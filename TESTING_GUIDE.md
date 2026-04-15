# Testing Guide - Renamerly Subscription Flow

Complete guide for testing the Stripe checkout, webhooks, and subscription management features.

---

## 🎯 Overview

This guide covers testing the complete subscription lifecycle:
1. Free user signup
2. Checkout session creation
3. Subscription webhook events
4. Database synchronization
5. Customer portal access
6. Subscription changes

---

## 📋 Prerequisites

### Required Setup:
- ✅ Supabase project configured (see SUPABASE_SETUP.md)
- ✅ Stripe account in test mode
- ✅ Stripe CLI installed (`stripe login`)
- ✅ Environment variables set in `.env.local`
- ✅ Supabase Edge Function deployed
- ✅ Database tables created with RLS policies

### Environment Variables Checklist:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_PRO=price_test_xxx
```

---

## 🧪 Test Scenario 1: Free User Flow

### Step 1: Create Free Account
```bash
# Start dev server
npm run dev
```

1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Create account with email/password
4. Verify email (check Supabase Auth emails)
5. Login to account

### Step 2: Verify Free Tier Limits
1. Navigate to `/dashboard/billing`
2. Verify:
   - ✅ Shows "Free Plan"
   - ✅ "Upgrade to Pro" button visible
   - ✅ Images: "0 / 20" displayed
   - ✅ Projects: "Upgrade to Pro" message
   - ✅ No "Payment History" section

3. Navigate to `/app`
4. Upload 21 images
5. Verify:
   - ✅ Warning appears after 20 images
   - ✅ Upload blocked or shows upgrade prompt

### Expected Database State:
```sql
-- Check user profile
SELECT subscription_tier, stripe_customer_id 
FROM user_profiles 
WHERE id = '<user_id>';
-- Should show: tier='free', customer_id=NULL

-- Check usage tracking
SELECT * FROM usage_tracking 
WHERE user_id = '<user_id>' 
AND month = '2026-04';
-- Should show: images_processed=0 (or current count)
```

---

## 💳 Test Scenario 2: Checkout Flow

### Step 1: Start Stripe CLI Webhook Forwarding

Open a new terminal:
```bash
stripe listen --forward-to https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook
```

**Copy the webhook secret** (whsec_xxx) and add to:
- `.env.local` → `STRIPE_WEBHOOK_SECRET`
- Supabase Edge Function environment variables

### Step 2: Initiate Checkout
1. While logged in as free user, click "Upgrade to Pro" on `/dashboard/billing`
2. **OR** navigate to `/pricing` and click "Upgrade to Pro"

### Step 3: Complete Checkout
1. Stripe Checkout page opens
2. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

3. Click "Subscribe"
4. Should redirect to `/dashboard` or success page

### Step 4: Verify Webhook Received
Check Stripe CLI terminal output:
```
✔ Received event: customer.subscription.created
✔ Received event: checkout.session.completed
✔ Received event: invoice.paid
```

### Step 5: Verify Database Updates
```sql
-- Check updated profile
SELECT subscription_tier, stripe_customer_id 
FROM user_profiles 
WHERE id = '<user_id>';
-- Should show: tier='pro', customer_id='cus_xxx'

-- Check subscription events log
SELECT * FROM subscription_events 
WHERE user_id = '<user_id>' 
ORDER BY created_at DESC;
-- Should have 'subscribed' event
```

### Step 6: Verify Pro Access
1. Refresh `/dashboard/billing`
2. Verify:
   - ✅ Shows "Pro Plan - $19 per month"
   - ✅ "Manage Subscription" button visible
   - ✅ Images: "Unlimited"
   - ✅ Projects: "Unlimited"
   - ✅ "Payment History" section appears

3. Navigate to `/app`
4. Try uploading 25+ images
5. Verify:
   - ✅ No upload limits enforced
   - ✅ All images process successfully

---

## 🔄 Test Scenario 3: Customer Portal

### Step 1: Access Portal
1. Navigate to `/dashboard/billing`
2. Click "Manage Subscription"

### Step 2: Verify Portal Features
In Stripe Customer Portal:
- ✅ Current subscription displayed
- ✅ Payment method shown
- ✅ Invoice history accessible
- ✅ Can update payment method
- ✅ Can cancel subscription

### Step 3: Test Subscription Cancellation
1. Click "Cancel Subscription"
2. Confirm cancellation
3. Choose cancellation option:
   - **Immediately** - loses access now
   - **End of period** - keeps access until billing cycle ends

### Step 4: Verify Cancellation Webhook
Check Stripe CLI:
```
✔ Received event: customer.subscription.updated (status: canceled)
```

### Step 5: Verify Database After Cancellation
```sql
-- Immediate cancellation
SELECT subscription_tier FROM user_profiles WHERE id = '<user_id>';
-- Should show: 'free'

-- End of period cancellation
SELECT subscription_tier FROM user_profiles WHERE id = '<user_id>';
-- Should show: 'pro' (until period ends)

-- Check subscription events
SELECT event_type, created_at FROM subscription_events 
WHERE user_id = '<user_id>' 
ORDER BY created_at DESC;
-- Should show 'canceled' event
```

---

## 🔧 Test Scenario 4: Edge Cases

### Test 4.1: Payment Failure
1. Start new checkout session
2. Use card: **4000 0000 0000 0341** (declined)
3. Verify:
   - ✅ Error message displayed
   - ✅ User remains on free tier
   - ✅ No subscription created in database

### Test 4.2: Webhook Retry Logic
1. Stop Stripe CLI webhook forwarding
2. Complete a checkout (webhook will fail)
3. Restart webhook forwarding
4. Stripe will automatically retry failed webhooks
5. Verify database updates after retry

### Test 4.3: Duplicate Events
1. Manually trigger same webhook event twice
2. Verify:
   - ✅ Database handles idempotently
   - ✅ No duplicate subscriptions created
   - ✅ Tier not incorrectly updated

### Test 4.4: Subscription Update
1. As Pro user, access Customer Portal
2. Click "Update Payment Method"
3. Change card details
4. Verify:
   - ✅ `customer.subscription.updated` webhook received
   - ✅ Subscription remains active
   - ✅ New payment method saves

---

## 📊 Monitoring & Debugging

### Check Stripe Dashboard
https://dashboard.stripe.com/test/subscriptions

- View all test subscriptions
- See webhook delivery logs
- Check payment attempts
- Review customer details

### Check Supabase Logs
```bash
# View Edge Function logs
supabase functions logs stripe-webhook --project-ref rgquzykwfixvnokgiizn
```

Or in dashboard: Supabase → Edge Functions → stripe-webhook → Logs

### Check Database Tables
```sql
-- All Pro users
SELECT u.email, p.subscription_tier, p.stripe_customer_id
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE p.subscription_tier = 'pro';

-- Recent subscription events
SELECT 
  u.email,
  se.event_type,
  se.stripe_subscription_id,
  se.created_at
FROM subscription_events se
JOIN auth.users u ON se.user_id = u.id
ORDER BY se.created_at DESC
LIMIT 10;

-- Usage tracking this month
SELECT 
  u.email,
  ut.images_processed,
  ut.projects_created,
  ut.month
FROM usage_tracking ut
JOIN auth.users u ON ut.user_id = u.id
WHERE ut.month = '2026-04'
ORDER BY ut.images_processed DESC;
```

### Common Issues

#### Issue: Webhook not received
**Solution:**
1. Check Stripe CLI is running
2. Verify webhook secret in `.env.local` matches CLI output
3. Check Supabase Edge Function environment variables
4. Review Edge Function logs for errors

#### Issue: Database not updating
**Solution:**
1. Check RLS policies allow service role access
2. Verify Edge Function has correct Supabase credentials
3. Check `update_subscription_tier` function exists
4. Review Edge Function logs for database errors

#### Issue: Checkout redirects to wrong page
**Solution:**
1. Check `success_url` and `cancel_url` in checkout API route
2. Verify NEXT_PUBLIC_SITE_URL is correct
3. Test both success and cancel flows

---

## ✅ Test Checklist

### Before Testing:
- [ ] Stripe CLI installed and logged in
- [ ] Environment variables configured
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Edge Function deployed
- [ ] Dev server running

### Free Tier Testing:
- [ ] User can sign up
- [ ] Free tier limits displayed correctly
- [ ] Upgrade prompts appear
- [ ] Image limit enforced at 20
- [ ] Can't save projects/templates

### Checkout Testing:
- [ ] Checkout session creates successfully
- [ ] Stripe Checkout UI loads
- [ ] Test card payment succeeds
- [ ] Redirects back to app
- [ ] Webhooks received
- [ ] Database updates to 'pro'

### Pro Tier Testing:
- [ ] Unlimited images work
- [ ] Can save projects
- [ ] Can save templates
- [ ] Customer Portal accessible
- [ ] Payment history visible
- [ ] All Pro features available

### Cancellation Testing:
- [ ] Can cancel subscription
- [ ] Database updates correctly
- [ ] Downgrade to free works
- [ ] Pro features disabled
- [ ] Grace period respected (if end-of-period)

---

## 🚀 Production Testing

### Before Going Live:
1. Switch to **live mode** in Stripe Dashboard
2. Update environment variables with live keys
3. Update Supabase Edge Function with live keys
4. Configure live webhook endpoint in Stripe
5. Test with real card (use your own, then refund)

### Live Webhook Configuration:
```
Endpoint URL: https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook
Events to send:
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - checkout.session.completed
```

### Production Smoke Test:
1. Create test account
2. Complete real checkout (use own card)
3. Verify Pro access granted
4. Access Customer Portal
5. Cancel subscription
6. Verify downgrade
7. Refund payment in Stripe Dashboard

---

## 📞 Support

If you encounter issues during testing:

1. **Check Logs:**
   - Stripe CLI webhook output
   - Supabase Edge Function logs
   - Browser console errors
   - Network tab in DevTools

2. **Review Documentation:**
   - SUPABASE_SETUP.md
   - ENVIRONMENT_SETUP.md
   - PRODUCTION_DEPLOYMENT.md

3. **Database Queries:**
   - Use SQL queries above to inspect state
   - Check Supabase Dashboard tables

4. **Reset Test Data:**
   ```sql
   -- Delete test subscriptions (CAREFUL!)
   DELETE FROM subscription_events WHERE user_id = '<test_user_id>';
   UPDATE user_profiles 
   SET subscription_tier = 'free', stripe_customer_id = NULL 
   WHERE id = '<test_user_id>';
   ```

---

**Happy Testing! 🎉**

Remember: Always test in **test mode** before going live with real payments.
