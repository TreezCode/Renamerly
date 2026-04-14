import { test, expect } from '@playwright/test'

test.describe('Stripe Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the test checkout page
    await page.goto('http://localhost:3000/test-checkout')
  })

  test('should display test checkout page correctly', async ({ page }) => {
    // Check page loaded
    await expect(page.getByText('Test Stripe Checkout')).toBeVisible()
    await expect(page.getByText('Renamify Pro')).toBeVisible()
    await expect(page.getByText('$19/mo')).toBeVisible()
    
    // Check test card info is displayed
    await expect(page.getByText('4242 4242 4242 4242')).toBeVisible()
  })

  test('should redirect to Stripe Checkout', async ({ page }) => {
    // Click checkout button
    await page.getByRole('button', { name: /start free trial/i }).click()
    
    // Should redirect to Stripe Checkout
    await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 10000 })
    
    // Check Stripe checkout page elements
    await expect(page.getByText(/subscribe/i)).toBeVisible({ timeout: 5000 })
  })

  test('should complete checkout with test card', async ({ page }) => {
    // Click checkout button
    await page.getByRole('button', { name: /start free trial/i }).click()
    
    // Wait for Stripe Checkout to load
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 })
    
    // Fill in email
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.fill('test@example.com')
    
    // Fill in card details
    // Note: Stripe uses iframes, we need to handle them
    const cardFrame = page.frameLocator('iframe[title*="Secure card payment"]').first()
    
    // Card number
    await cardFrame.locator('[name="cardnumber"]').fill('4242424242424242')
    
    // Expiry
    await cardFrame.locator('[name="exp-date"]').fill('1234')
    
    // CVC
    await cardFrame.locator('[name="cvc"]').fill('123')
    
    // ZIP
    await cardFrame.locator('[name="postal"]').fill('12345')
    
    // Submit payment
    await page.getByRole('button', { name: /subscribe/i }).click()
    
    // Should redirect back to success URL
    await expect(page).toHaveURL(/localhost:3000\/dashboard/, { timeout: 15000 })
    await expect(page).toHaveURL(/success=true/, { timeout: 15000 })
  })

  test('should handle checkout cancellation', async ({ page }) => {
    // Click checkout button
    await page.getByRole('button', { name: /start free trial/i }).click()
    
    // Wait for Stripe Checkout to load
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 })
    
    // Click back button (cancel)
    await page.getByRole('link', { name: /back/i }).click()
    
    // Should redirect to cancel URL
    await expect(page).toHaveURL(/localhost:3000/, { timeout: 10000 })
    await expect(page).toHaveURL(/canceled=true/, { timeout: 10000 })
  })
})

test.describe('Subscription Management', () => {
  test.skip('should allow canceling subscription via portal', async ({ page }) => {
    // This test requires an active subscription
    // You would need to set up authentication and navigate to billing page
    
    await page.goto('http://localhost:3000/dashboard/billing')
    
    // Click "Manage Subscription" button
    await page.getByRole('button', { name: /manage subscription/i }).click()
    
    // Should redirect to Stripe Customer Portal
    await expect(page).toHaveURL(/billing\.stripe\.com/, { timeout: 10000 })
    
    // Cancel subscription
    await page.getByText(/cancel plan/i).click()
    await page.getByRole('button', { name: /cancel plan/i }).click()
    
    // Confirm cancellation
    await expect(page.getByText(/canceled/i)).toBeVisible()
  })
})
