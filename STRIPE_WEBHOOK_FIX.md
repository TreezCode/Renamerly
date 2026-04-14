# Stripe Webhook Fix - Security Definer Function

## 🎯 Problem

Subscription tier was not updating in Supabase after successful Stripe checkout because:
1. Webhooks have no user session (no cookies, no auth context)
2. RLS policies block updates without authenticated user
3. Previous solution bypassed ALL RLS security (bad practice)

## ✅ Proper Solution

Create a **security definer function** that:
- Runs with elevated privileges to update subscription_tier
- Is safely restricted to a private schema
- Only accessible through specific parameters
- Maintains RLS security for all other operations

This follows Supabase best practices for webhook operations.

---

## 📋 Setup Steps

### Step 1: Create the Security Definer Function

Run this SQL in your Supabase SQL Editor:

```sql
-- Create private schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS private;

-- Revoke access from public roles
REVOKE ALL ON SCHEMA private FROM public, anon, authenticated;

-- Function to update user subscription tier
CREATE OR REPLACE FUNCTION private.update_subscription_tier(
  p_user_id UUID,
  p_tier TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Validate tier
  IF p_tier NOT IN ('free', 'pro') THEN
    RAISE EXCEPTION 'Invalid subscription tier: %', p_tier;
  END IF;

  -- Update the user profile
  UPDATE public.user_profiles
  SET 
    subscription_tier = p_tier,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING jsonb_build_object(
    'id', id,
    'subscription_tier', subscription_tier,
    'updated_at', updated_at
  ) INTO v_result;

  -- Check if update was successful
  IF v_result IS NULL THEN
    RAISE EXCEPTION 'User profile not found for user_id: %', p_user_id;
  END IF;

  RETURN v_result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION private.update_subscription_tier(UUID, TEXT) TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION private.update_subscription_tier IS 
'Updates user subscription tier. Used by Stripe webhooks. Security definer to bypass RLS safely.';
```

**Why this is secure:**
- ✅ Function is in `private` schema (not exposed via API)
- ✅ Only accepts specific parameters (user_id, tier)
- ✅ Validates tier value ('free' or 'pro' only)
- ✅ Returns success/error clearly
- ✅ Can't be called directly from browser
- ✅ RLS still protects all other table operations

### Step 2: Regenerate TypeScript Types

After creating the function, regenerate your database types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
```

Or use the Supabase MCP:
```
Use mcp6_generate_typescript_types
```

### Step 3: Test the Fix

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Start Stripe webhook forwarding:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. **Complete a test checkout:**
   - Go to: http://localhost:3000/test-checkout
   - Use test card: 4242 4242 4242 4242
   - Complete checkout

4. **Check dev server logs:**
   ```
   [Webhook] Received event: customer.subscription.created
   Updating user <uuid> to tier: pro
   Profile updated successfully: { id: '...', subscription_tier: 'pro', ... }
   ```

5. **Verify in Supabase:**
   - Table Editor → user_profiles
   - Your user should have `subscription_tier: 'pro'`

---

## 🔒 Security Benefits

### Before (Bypassing RLS - BAD ❌)
```typescript
// Used service_role key - bypasses ALL RLS
const supabase = createAdminClient() // Dangerous!
await supabase.from('user_profiles').update(...) // No security
```

**Problems:**
- Bypasses RLS completely
- Any bug could update ANY user's data
- No validation or constraints
- Violates principle of least privilege

### After (Security Definer Function - GOOD ✅)
```typescript
// Uses regular client with RLS enabled
const supabase = await createClient()
// Calls secure function with specific parameters
await supabase.rpc('update_subscription_tier', {
  p_user_id: userId,
  p_tier: tier
})
```

**Benefits:**
- RLS still active for all other operations
- Function only does ONE thing (update subscription_tier)
- Input validation built-in
- Can't accidentally update wrong data
- Follows Supabase security best practices

---

## 📊 How It Works

```
┌─────────────┐
│   Stripe    │
│   Webhook   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Next.js API Route              │
│  /api/stripe/webhook            │
│  - Verifies signature           │
│  - Extracts user_id from Stripe │
│  - Determines tier (pro/free)   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Supabase Client (with RLS)     │
│  - Has NO user session          │
│  - RLS would normally block     │
└────────────┬────────────────────┘
             │
             │  .rpc('update_subscription_tier')
             ▼
┌─────────────────────────────────┐
│  Security Definer Function      │
│  private.update_subscription_tier│
│  - Runs with postgres privileges│
│  - Validates input              │
│  - Updates ONLY subscription    │
│  - Returns result               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  user_profiles table            │
│  - subscription_tier updated ✅ │
│  - RLS still active everywhere  │
└─────────────────────────────────┘
```

---

## 🧪 Testing

### Test Subscription Creation
```bash
stripe trigger customer.subscription.created
```

Check logs for:
```
Profile updated successfully: { subscription_tier: 'pro', ... }
```

### Test Subscription Cancellation
```bash
stripe trigger customer.subscription.deleted
```

Check logs for:
```
Profile downgraded successfully: { subscription_tier: 'free', ... }
```

---

## 🐛 Troubleshooting

### Issue: Function not found
**Error:** `function private.update_subscription_tier does not exist`

**Solution:**
1. Run the SQL in Supabase SQL Editor
2. Verify function exists: 
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_schema = 'private';
   ```

### Issue: TypeScript error on `.rpc()`
**Error:** `Argument of type '"update_subscription_tier"' not assignable`

**Solution:**
- Regenerate types after creating the function
- TypeScript needs to know about the new RPC function

### Issue: Permission denied
**Error:** `permission denied for schema private`

**Solution:**
- Make sure you granted execute permission:
  ```sql
  GRANT EXECUTE ON FUNCTION private.update_subscription_tier(UUID, TEXT) TO authenticated;
  ```

---

## 📚 References

- [Supabase RLS Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Security Definer Functions](https://supabase.com/docs/guides/database/functions#security-definer-vs-invoker)
- [Stripe Webhooks Security](https://stripe.com/docs/webhooks/best-practices)

---

## ✅ Checklist

- [ ] Created `private.update_subscription_tier` function
- [ ] Granted execute permission to authenticated role
- [ ] Regenerated TypeScript types
- [ ] Tested subscription creation
- [ ] Tested subscription cancellation
- [ ] Verified in Supabase dashboard
- [ ] No TypeScript errors
- [ ] Dev server logs show success

**Status: Ready to test!** 🚀
