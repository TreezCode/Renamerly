# Stripe Webhook Edge Function Setup

## ✅ What Was Done

**Deployed Supabase Edge Function** for Stripe webhooks (official Supabase approach):
- ✅ Function deployed: `stripe-webhook`
- ✅ URL: `https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook`
- ✅ Has service_role access (no RLS issues)
- ✅ Production-ready solution

---

## 🔧 Required Setup

### Step 1: Set Edge Function Secrets

The Edge Function needs these environment variables:

**Go to Supabase Dashboard:**
https://supabase.com/dashboard/project/rgquzykwfixvnokgiizn/functions/stripe-webhook/details

**Add these secrets:**

1. **STRIPE_SECRET_KEY**
   - Value: Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
   - Get from: https://dashboard.stripe.com/apikeys

2. **STRIPE_WEBHOOK_SECRET**
   - Value: Will be generated in Step 2
   - Format: `whsec_...`

**Note:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available to Edge Functions.

---

### Step 2: Update Stripe CLI Webhook Forwarding

**Stop your current Stripe CLI** (Ctrl+C)

**Start with new Edge Function URL:**
```bash
stripe listen --forward-to https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook
```

**Copy the webhook secret:**
- Look for: `whsec_...` in the output
- Add it to Edge Function secrets as `STRIPE_WEBHOOK_SECRET`

---

### Step 3: Test the Webhook

1. **Complete a test checkout:**
   ```
   http://localhost:3000/test-checkout
   ```

2. **Watch Edge Function logs:**
   - Go to: https://supabase.com/dashboard/project/rgquzykwfixvnokgiizn/functions/stripe-webhook/logs
   - You should see:
     ```
     🔔 Event received: customer.subscription.created
     Updating user <uuid> to tier: pro
     ✅ Profile updated successfully
     ✅ Subscription event logged
     ```

3. **Verify in Supabase:**
   - Table Editor → `user_profiles` → Check `subscription_tier` = `pro`
   - Table Editor → `subscription_events` → Should have event logged

---

## 🎯 Why This Is Better

### Before (Next.js API Route):
❌ RLS policy conflicts  
❌ Schema confusion (private vs public)  
❌ Manual service_role key management  
❌ Complex security definer functions  
❌ Hard to debug  

### Now (Edge Function):
✅ Runs on Supabase infrastructure  
✅ Built-in service_role access  
✅ No RLS issues  
✅ Official Supabase approach  
✅ Easy to monitor (function logs)  
✅ Production-ready  

---

## 🔍 Debugging

### Check Edge Function Logs
```
https://supabase.com/dashboard/project/rgquzykwfixvnokgiizn/functions/stripe-webhook/logs
```

### Check if secrets are set
```
https://supabase.com/dashboard/project/rgquzykwfixvnokgiizn/functions/stripe-webhook/details
```

### Common Issues

**Issue: "Missing STRIPE_SECRET_KEY"**
- Solution: Add secret in Edge Function settings

**Issue: "Webhook signature verification failed"**
- Solution: Make sure `STRIPE_WEBHOOK_SECRET` matches the CLI output

**Issue: "No supabase_user_id in customer metadata"**
- Solution: The checkout session needs to set this metadata (already done in your code)

---

## 🚀 Production Deployment

When ready for production:

1. **In Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - URL: `https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

2. **Update Edge Function secret:**
   - Copy the production webhook secret from Stripe
   - Update `STRIPE_WEBHOOK_SECRET` in Edge Function settings

3. **Switch to live Stripe keys:**
   - Update `STRIPE_SECRET_KEY` to live key (`sk_live_...`)
   - Update `.env.local` with live publishable key

---

## 📋 Cleanup

### Remove Old Next.js Webhook Route (Optional)

The old Next.js API route is no longer needed:
```
src/app/api/stripe/webhook/route.ts  (can be deleted)
```

You can keep it as a backup or delete it since the Edge Function handles everything now.

---

## ✅ Verification Checklist

- [ ] Edge Function deployed
- [ ] `STRIPE_SECRET_KEY` secret added
- [ ] `STRIPE_WEBHOOK_SECRET` secret added
- [ ] Stripe CLI forwarding to Edge Function URL
- [ ] Test checkout completed
- [ ] User profile updated to `pro` tier
- [ ] Subscription event logged in database
- [ ] Edge Function logs show success messages

**Once all checkboxes are done, your Stripe webhook integration is complete!** 🎉
