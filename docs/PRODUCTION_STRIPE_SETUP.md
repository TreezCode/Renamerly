# Production Stripe Setup Guide

## Overview

Yes, **ALL 4 Stripe variables** need different values for production. Here's why and how to set them up.

---

## 📋 The 4 Stripe Variables

### 1. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
- **Test:** `pk_test_...`
- **Production:** `pk_live_...`
- **Where to get it:** Stripe Dashboard → Developers → API keys
- **What it does:** Used in the frontend to initialize Stripe checkout

### 2. **STRIPE_SECRET_KEY**
- **Test:** `sk_test_...`
- **Production:** `sk_live_...`
- **Where to get it:** Stripe Dashboard → Developers → API keys
- **What it does:** Used in backend API routes to create customers, subscriptions, etc.

### 3. **STRIPE_WEBHOOK_SECRET** ⚠️ (This is the confusing one!)
- **Test:** `whsec_...` (from TEST mode webhook endpoint)
- **Production:** `whsec_...` (DIFFERENT secret from LIVE mode webhook endpoint)
- **Where to get it:** Stripe Dashboard → Developers → Webhooks → [your endpoint] → Signing secret
- **What it does:** Verifies that webhook events actually came from Stripe

### 4. **STRIPE_PRICE_ID_PRO**
- **Test:** `price_...` (from test mode product)
- **Production:** `price_...` (DIFFERENT ID from live mode product)
- **Where to get it:** Stripe Dashboard → Products → [your product] → Pricing → API ID
- **What it does:** Tells Stripe which subscription plan to charge

---

## 🔑 Why Webhook Secret is Different for Production

The webhook secret is **tied to a specific webhook endpoint**. Here's the key concept:

### Test Mode Webhook Endpoint
```
URL: https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook
Signing Secret: whsec_c822ae564bb250351e26d264ac5d33f1049fd70269609e4e98c98705b5ac3fb2
```
This endpoint receives **test mode** events (subscriptions from test cards).

### Production Mode Webhook Endpoint
```
URL: https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook (SAME URL!)
Signing Secret: whsec_[DIFFERENT_SECRET_FOR_PRODUCTION]
```
This endpoint receives **live mode** events (real subscriptions).

**Important:** Even though the URL is the same, Stripe generates a **different signing secret** for each endpoint because:
- One endpoint is in TEST mode
- One endpoint is in LIVE mode

---

## 📝 Step-by-Step Production Setup

### Step 1: Get Your Live API Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. **Toggle to "Live mode"** (top right corner - should say "Viewing live data")
3. Copy your keys:
   - **Publishable key:** `pk_live_...`
   - **Secret key:** `sk_live_...` (click "Reveal live key")

### Step 2: Create Production Product & Price

1. Go to: https://dashboard.stripe.com/products
2. **Make sure you're in Live mode** (toggle at top)
3. Click "Add product"
4. Fill in:
   - Name: "Renamerly Pro"
   - Pricing: $19/month (or your price)
   - Recurring: Monthly
5. Click "Save product"
6. Copy the **Price ID**: `price_...`

### Step 3: Create Production Webhook Endpoint

This is where you get the webhook secret!

1. Go to: https://dashboard.stripe.com/webhooks
2. **Toggle to "Live mode"** (top right)
3. Click "Add endpoint"
4. Configure:
   ```
   Endpoint URL: https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook
   
   Events to send:
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ```
5. Click "Add endpoint"
6. **Click "Reveal" next to "Signing secret"**
7. Copy the secret: `whsec_...` (this is your production webhook secret!)

### Step 4: Set Supabase Edge Function Secrets (Production)

The edge function needs the production keys:

```bash
# Set production Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_live_your_actual_key_here

# Set production webhook secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_production_secret_here
```

**Important:** These secrets override the test ones. If you want to test with test mode later, you'll need to switch them back.

### Step 5: Set Vercel Environment Variables

In your Vercel dashboard for this project:

1. Go to: Settings → Environment Variables
2. Add these variables for **Production** environment only:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_your_key_here
STRIPE_SECRET_KEY = sk_live_your_key_here
STRIPE_WEBHOOK_SECRET = whsec_your_production_webhook_secret
STRIPE_PRICE_ID_PRO = price_your_production_price_id
NEXT_PUBLIC_SITE_URL = https://asset-flow-sage.vercel.app/
```

3. For **Preview** and **Development** environments, use your test keys:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_c822ae564bb250351e26d264ac5d33f1049fd70269609e4e98c98705b5ac3fb2
STRIPE_PRICE_ID_PRO = price_1TLyy1JUYhhpiYSZexDbiomG
```

---

## 🎯 Quick Reference: What Goes Where

### Local Development (.env.local)
```bash
# Keep test mode keys for local development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_c822ae564bb250351e26d264ac5d33f1049fd70269609e4e98c98705b5ac3fb2
STRIPE_PRICE_ID_PRO=price_1TLyy1JUYhhpiYSZexDbiomG
```

### Vercel Production Environment
```bash
# Production keys only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_[FROM_STEP_3]
STRIPE_PRICE_ID_PRO=price_[FROM_STEP_2]
```

### Supabase Edge Function Secrets
```bash
# These should be production keys since the edge function serves production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_[FROM_STEP_3]
```

**Note:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are already set automatically in Supabase edge functions.

---

## ⚠️ Common Mistakes

### Mistake 1: Using Test Webhook Secret with Live Keys
```bash
# ❌ WRONG - will fail signature verification
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_c822ae564bb250351e26d264ac5d33f1049fd70269609e4e98c98705b5ac3fb2 (test secret!)
```

### Mistake 2: Using Test Price ID in Production
```bash
# ❌ WRONG - subscription will fail or charge wrong amount
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID_PRO=price_1TLyy1JUYhhpiYSZexDbiomG (test price!)
```

### Mistake 3: Not Setting Edge Function Secrets
- The edge function has its own secrets separate from Vercel
- Both need to be set for production

---

## 🧪 Testing Production (Without Charging Real Cards)

If you want to test production setup WITHOUT real charges:

1. Keep edge function secrets as **test mode**
2. Keep Vercel environment as **test mode**  
3. Use test cards
4. When ready for real production:
   - Update edge function secrets to live
   - Update Vercel production environment to live
   - Redeploy

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Live mode webhook endpoint created in Stripe Dashboard
- [ ] All 3 events selected (created, updated, deleted)
- [ ] Webhook signing secret copied and saved
- [ ] Production product created with correct price
- [ ] Price ID copied from product page
- [ ] Live API keys copied from Stripe Dashboard
- [ ] Supabase edge function secrets updated to production
- [ ] Vercel production environment variables set
- [ ] Test a subscription to verify everything works
- [ ] Check Supabase logs to confirm webhook received
- [ ] Check `subscription_events` table for new entries

---

## 🚨 Security Reminders

1. **Never commit production keys to git** - they're in `.env.local` which is gitignored
2. **Rotate keys immediately** if they're ever exposed
3. **Use restricted API keys** in production (limit permissions)
4. **Monitor webhook logs** for failed signature verifications
5. **Set up Stripe alerts** for unusual activity

---

## 📞 Need Help?

If webhooks fail in production:

1. Check Stripe Dashboard → Webhooks → Recent deliveries
2. Look for failed events (red X)
3. Click on the event to see error message
4. Common issues:
   - Wrong webhook secret
   - Endpoint URL typo
   - Edge function not deployed
   - Missing edge function secrets

---

## 🔄 Switching Between Test and Production

### To Test Locally with Production Keys

1. Temporarily update `.env.local` with live keys
2. **Don't commit these changes!**
3. Test
4. Revert back to test keys

### To Keep Both Available

Create `.env.production.local` (gitignored):
```bash
# Production keys for local testing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_production_secret
STRIPE_PRICE_ID_PRO=price_production_id
```

Then load it manually when needed:
```bash
# Use production keys locally
cp .env.production.local .env.local
npm run dev
```

---

**Last Updated:** April 15, 2026
