# Payments setup (Stripe Checkout via Netlify Functions)

Rent payments go through a real Stripe Checkout session, created by a serverless
function so the secret key never reaches the browser.

## 1. Set your Stripe secret key on Netlify

Site settings → Environment variables → Add a variable:

- Key: `STRIPE_SECRET_KEY`
- Value: your Stripe secret key (starts with `sk_test_...` or `sk_live_...`)

Redeploy after adding it (env vars are picked up on the next build/deploy).

## 2. This must actually run on Netlify

The serverless function only executes when Netlify is building/serving the site —
either by connecting this repo to a Netlify site (Git-based deploy), or by
deploying with the Netlify CLI (`netlify deploy`). A plain drag-and-drop of the
folder onto Netlify Drop publishes static files only and does **not** run
`netlify/functions/`, so "Pay rent" will fall back to the local demo behavior
(instant fake payment, no real charge) instead of opening Stripe Checkout.

To test locally with functions working, use `netlify dev` (Netlify CLI) instead
of a plain static server — it runs the function locally against your env vars.

## 3. Test the flow

Use Stripe's test mode (a `sk_test_...` key) and, on the Checkout page, pay with:

- Card number: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits
- ZIP: any 5 digits

That completes a successful test payment and redirects back to `rental.html`,
which will show the balance as paid.
