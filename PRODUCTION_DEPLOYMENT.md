# Renamerly Production Deployment Guide

## 🎯 Production Domain: renamerly.com

This guide covers everything needed to deploy Renamerly to production with the correct domain configuration.

---

## 📋 Pre-Deployment Checklist

### 1. **Domain Configuration**

- [ ] Domain `renamerly.com` is registered
- [ ] DNS configured to point to Vercel
- [ ] SSL certificate is active (Vercel handles this automatically)

### 2. **Vercel Project Setup**

**Project Settings:**
- [ ] Project imported to Vercel
- [ ] Production domain set to `renamerly.com`
- [ ] Framework Preset: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

**Domain Settings** (in Vercel dashboard):
1. Go to Project Settings → Domains
2. Add `renamerly.com` as production domain
3. Add `www.renamerly.com` (redirect to main domain)
4. Wait for DNS propagation

---

## 🔐 Environment Variables Setup

Configure these in Vercel → Project Settings → Environment Variables:

### **Supabase Configuration**

```bash
# Production
NEXT_PUBLIC_SUPABASE_URL=https://rgquzykwfixvnokgiizn.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_production_publishable_key
```

**Where to get:**
- Supabase Dashboard → Project Settings → API
- Use the **publishable key** (sb_publishable_xxx)

### **Stripe Configuration**

```bash
# Production - Use LIVE keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # Production webhook secret
STRIPE_PRICE_ID_PRO=price_xxx    # Live price ID
```

**Where to get:**
- Stripe Dashboard → Developers → API Keys
- For webhook secret: See "Stripe Webhook Setup" section below

---

## 🔗 Third-Party Service Configuration

### **1. Supabase OAuth Redirect URIs**

Update allowed redirect URLs in Supabase:

**Dashboard:** Supabase → Authentication → URL Configuration

**Add these URLs:**
```
# Production
https://renamerly.com/auth/callback

# Development (keep for testing)
http://localhost:3000/auth/callback
```

**Site URL:**
```
https://renamerly.com
```

**Redirect URLs (wildcard):**
```
https://renamerly.com/**
http://localhost:3000/**
```

### **2. Stripe Webhook Configuration**

**Create Production Webhook:**

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Configure:
   - **Endpoint URL**: `https://rgquzykwfixvnokgiizn.supabase.co/functions/v1/stripe-webhook`
   - **Description**: Renamerly Production Webhook
   - **Select events**:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - **API Version**: Latest (2024-11-20.acacia or newer)

4. **Copy the signing secret** (`whsec_xxx`)
5. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### **3. Supabase Edge Function Secrets**

Update Edge Function environment variables:

**Dashboard:** Supabase → Edge Functions → stripe-webhook → Environment Variables

**Add these secrets:**
```bash
STRIPE_SECRET_KEY=sk_live_xxx          # Live Stripe key
STRIPE_WEBHOOK_SECRET=whsec_xxx        # Production webhook secret
```

Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available.

### **4. Google OAuth (if enabled)**

**Google Cloud Console** → APIs & Services → Credentials

**Authorized JavaScript origins:**
```
https://renamerly.com
https://rgquzykwfixvnokgiizn.supabase.co
```

**Authorized redirect URIs:**
```
https://rgquzykwfixvnokgiizn.supabase.co/auth/v1/callback
```

### **5. GitHub OAuth (if enabled)**

**GitHub** → Settings → Developer settings → OAuth Apps

**Homepage URL:**
```
https://renamerly.com
```

**Authorization callback URL:**
```
https://rgquzykwfixvnokgiizn.supabase.co/auth/v1/callback
```

---

## 🚀 Deployment Steps

### **1. Pre-Deployment Checks**

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run lint

# Verify all environment variables are set
```

### **2. Deploy to Vercel**

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Deploy to production
vercel --prod
```

**OR** push to main branch (if auto-deploy is enabled)

### **3. Post-Deployment Verification**

**Test these URLs:**
- [ ] https://renamerly.com (loads correctly)
- [ ] https://www.renamerly.com (redirects to main)
- [ ] https://renamerly.com/app (main app works)
- [ ] https://renamerly.com/login (auth page loads)

**Test functionality:**
- [ ] User signup/login works
- [ ] Test Stripe checkout (use test mode first)
- [ ] Verify webhook receives events (check Supabase Edge Function logs)
- [ ] Confirm subscription tier updates in database
- [ ] Test subscription cancellation

---

## 🧪 Testing Production Stripe

### **Before Going Live:**

1. **Test in Stripe Test Mode:**
   - Temporarily use test keys in production
   - Complete a test checkout: https://renamerly.com/test-checkout
   - Use test card: `4242 4242 4242 4242`
   - Verify webhook logs in Supabase
   - Confirm database updates

2. **Check Stripe Dashboard:**
   - View webhook events
   - Verify successful delivery
   - Check for any errors

3. **Switch to Live Mode:**
   - Update Vercel env vars with live keys
   - Redeploy
   - Test with real payment (small amount)
   - Confirm everything works
   - Issue refund for test

---

## 🔍 Troubleshooting

### **Issue: Webhooks not triggering**

**Check:**
1. Webhook URL is correct in Stripe dashboard
2. Webhook secret matches in Vercel/Supabase
3. Edge Function has correct Stripe keys
4. View Edge Function logs for errors

**Fix:**
- Supabase Dashboard → Edge Functions → stripe-webhook → Logs
- Look for signature verification errors

### **Issue: OAuth redirect fails**

**Check:**
1. Redirect URLs match exactly in Supabase
2. Site URL is set correctly
3. OAuth provider callback URLs are updated

**Fix:**
- Verify URLs don't have trailing slashes
- Check for typos in domain name

### **Issue: Database updates fail**

**Check:**
1. RLS policies allow Edge Function updates
2. Service role key is set in Edge Function
3. Table schemas match expectations

**Fix:**
- Edge Function uses `service_role` key which bypasses RLS
- Check Supabase logs for permission errors

---

## 📊 Monitoring

### **Key Metrics to Watch:**

**Vercel:**
- Build times
- Error rates
- Response times
- Bandwidth usage

**Supabase:**
- Database connections
- Edge Function invocations
- Auth signups/logins
- Storage usage

**Stripe:**
- Successful payments
- Failed payments
- Webhook delivery success rate
- Subscription churn

### **Alerts to Set Up:**

1. **Vercel:** Failed deployments
2. **Stripe:** Webhook failures, failed payments
3. **Supabase:** Database errors, auth failures
4. **Uptime:** Domain availability

---

## 🔒 Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] Service role keys are never exposed to browser
- [ ] Stripe webhook signatures are verified
- [ ] HTTPS enforced (Vercel handles this)
- [ ] RLS enabled on all Supabase tables
- [ ] OAuth providers use HTTPS callback URLs
- [ ] CSP headers configured (if applicable)

---

## ✅ Launch Checklist

### **Day Before Launch:**
- [ ] All environment variables configured
- [ ] DNS propagated
- [ ] SSL certificate active
- [ ] Test Stripe checkout works
- [ ] Test auth flows
- [ ] Test database updates
- [ ] Verify Edge Functions running
- [ ] Check analytics setup

### **Launch Day:**
- [ ] Switch Stripe to live mode
- [ ] Final smoke test
- [ ] Monitor logs for 1 hour
- [ ] Test real payment
- [ ] Verify all webhooks firing
- [ ] Check database updates
- [ ] Announce launch 🚀

### **Post-Launch:**
- [ ] Monitor error rates
- [ ] Watch webhook success rate
- [ ] Track user signups
- [ ] Review performance metrics
- [ ] Set up automated backups

---

## 🆘 Emergency Rollback

If something goes wrong in production:

```bash
# Revert to previous deployment in Vercel
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → Promote to Production

# OR via CLI
vercel rollback
```

**Critical Issues:**
- Database corrupted: Restore from Supabase backup
- Payment failures: Revert to test mode keys
- Site down: Check Vercel status page

---

## 📞 Support Resources

- **Vercel:** https://vercel.com/support
- **Supabase:** https://supabase.com/support
- **Stripe:** https://support.stripe.com
- **Next.js:** https://nextjs.org/docs

---

## 🎉 Success!

Once all checklists are complete and tests pass, your production deployment is ready!

**Production URL:** https://renamerly.com

**Remember:**
- Keep environment variables secure
- Monitor webhooks regularly
- Test payment flows periodically
- Keep dependencies updated
- Back up database regularly

**Built with ♥ by Build With Treez**
