# Reset Onboarding Modal

To see the onboarding modal again for testing/design review:

## Option 1: Browser DevTools (Easiest)
1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `http://localhost:3000`
4. Delete the key: `renamify-ui-state`
5. Refresh the page and upload images

## Option 2: Console Command
1. Open browser console (F12)
2. Run: `localStorage.removeItem('renamify-ui-state')`
3. Refresh the page and upload images

## Option 3: Incognito/Private Window
1. Open an incognito/private browser window
2. Navigate to `http://localhost:3000/app`
3. Upload images - modal will show

---

The modal will appear once you upload at least one image (it's triggered by user action, not page load).
