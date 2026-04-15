# Stripe Webhook Setup Guide

## Overview

This guide walks you through setting up Stripe webhooks to sync subscription events with your Supabase database.

## Prerequisites

- Supabase project with the `stripe-webhook` edge function deployed ✅
- Stripe account (test mode for development, live mode for production)
- Supabase CLI installed (for local testing)

---

## Step 1: Configure Edge Function Secrets

The `stripe-webhook` edge function requires the following environment variables to be set as **secrets** in Supabase:

### Required Secrets

1. **`STRIPE_SECRET_KEY`**
   - Your Stripe secret API key
   - Test: `sk_test_...` (from Stripe Dashboard → Developers → API keys)
   - Production: `sk_live_...`

2. **`STRIPE_WEBHOOK_SECRET`**
   - Webhook signing secret for verifying Stripe events
   - Test: `whsec_...` (created in Step 2)
   - Production: Different secret for live webhooks

### How to Set Secrets

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** in the sidebar
3. Click on the `stripe-webhook` function
4. Scroll to **Function Secrets** section
5. Add each secret:
   - Name: `STRIPE_SECRET_KEY`
   - Value: Your Stripe secret key (`sk_test_...` or `sk_live_...`)
   - Click **Add**
   - Repeat for `STRIPE_WEBHOOK_SECRET`

#### Option B: Via Supabase CLI

```bash
# Set Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here

# Set webhook secret (after creating endpoint in Step 2)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

**Note:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available in edge functions and don't need to be set manually.

---

## Step 2: Create Stripe Webhook Endpoint

### Get Your Webhook URL

Your Supabase webhook endpoint URL follows this pattern:

```
https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook
```

**Your webhook URL:**
```
https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook
```

### Register Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **Add endpoint**
3. Enter your endpoint URL (see above)
4. Select events to listen for:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Set it as `STRIPE_WEBHOOK_SECRET` in Supabase (see Step 1)

---

## Step 3: Verify Database Setup

### Check RLS Policies

The `subscription_events` table must have proper RLS policies:

```sql
-- Check existing policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'subscription_events';
```

**Expected policies:**
- ✅ `Service role can insert subscription events` (INSERT)
- ✅ `Users can view own subscription events` (SELECT)

If the INSERT policy is missing, it has been added automatically. ✅

---

## Step 4: Test the Webhook

### Option A: Stripe CLI (Local Testing)

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login to Stripe:
   ```bash
   stripe login
   ```
3. Forward events to your webhook:
   ```bash
   stripe listen --forward-to https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook
   ```
4. Trigger a test event:
   ```bash
   stripe trigger customer.subscription.created
   ```

### Option B: Stripe Dashboard

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Click **Send test webhook**
4. Select event: `customer.subscription.created`
5. Click **Send test webhook**

### Check Logs

Monitor the edge function logs to see if events are being processed:

1. **Via Supabase Dashboard:**
   - Navigate to Edge Functions → stripe-webhook
   - Click on **Logs** tab
   - Look for:
     - ✅ `Stripe webhook handler initialized`
     - ✅ `Environment check` showing all required vars
     - ✅ `Event received: customer.subscription.*`
     - ✅ `Attempting to insert subscription event`
     - ✅ `Subscription event logged successfully`

2. **Look for errors:**
   - ❌ `Missing required environment variables` → Go back to Step 1
   - ❌ `No supabase_user_id in customer metadata` → See Step 5

---

## Step 5: Important Implementation Notes

### Stripe Customer Metadata

The webhook expects customers to have a `supabase_user_id` in their metadata:

```typescript
// When creating a Stripe customer, include:
const customer = await stripe.customers.create({
  email: user.email,
  metadata: {
    supabase_user_id: user.id, // ← REQUIRED for webhook to work
  },
})
```

**Without this metadata, events will be received but not processed.**

### Subscription Tier Mapping

The webhook maps Stripe subscription statuses to database tiers:

- `active` → `pro`
- All other statuses → `free`

### Event Types Logged

| Stripe Event | Database `event_type` |
|--------------|----------------------|
| `customer.subscription.created` | `subscribed` |
| `customer.subscription.updated` (active) | `renewed` |
| `customer.subscription.updated` (inactive) | `downgraded` |
| `customer.subscription.deleted` | `canceled` |

---

## Step 6: Verify Events Are Being Saved

Check the `subscription_events` table:

```sql
-- Via Supabase SQL Editor or MCP
SELECT * FROM subscription_events ORDER BY created_at DESC LIMIT 10;
```

**Expected columns:**
- `id` (UUID)
- `user_id` (UUID)
- `event_type` (subscribed, renewed, canceled, etc.)
- `stripe_subscription_id`
- `metadata` (JSONB with event details)
- `created_at`

---

## Troubleshooting

### ❌ Events not appearing in database

**Check logs for:**
1. Environment variable errors → Set secrets in Step 1
2. "No supabase_user_id in customer metadata" → Add metadata when creating customers
3. RLS policy errors → Verify INSERT policy exists
4. Network/connection errors → Check Supabase status

### ❌ Webhook signature verification failed

- Make sure `STRIPE_WEBHOOK_SECRET` matches the signing secret from your Stripe webhook endpoint
- Verify you're using the correct secret (test vs. production)

### ❌ Profile updates work but events don't save

- Check that the INSERT policy was created (see Step 3)
- Verify `SUPABASE_SERVICE_ROLE_KEY` is available in the edge function

---

## Production Deployment

When deploying to production:

1. **Create a separate webhook endpoint in Stripe** (live mode)
2. **Update secrets with production values:**
   - `STRIPE_SECRET_KEY` → `sk_live_...`
   - `STRIPE_WEBHOOK_SECRET` → `whsec_...` (from live webhook)
3. **Test thoroughly with Stripe test mode first**
4. **Monitor logs for the first few live events**

---

## Security Checklist

- ✅ Never commit Stripe secrets to git
- ✅ Use separate keys for test and production
- ✅ Webhook endpoint has `verify_jwt: false` (Stripe signs requests differently)
- ✅ Service role key is used for database operations (bypasses RLS)
- ✅ Webhook signature is verified before processing events
- ✅ User IDs are validated before database operations

---

## Next Steps

1. **Set the required secrets** in Supabase (Step 1)
2. **Create the Stripe webhook endpoint** (Step 2)
3. **Test with a sample subscription event** (Step 4)
4. **Verify events appear in the database** (Step 6)

For issues or questions, check the edge function logs first for detailed error messages.
