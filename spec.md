# VEXO E-Waste Marketplace

## Current State
The app has:
- Motoko backend with user profiles (individual, company, recycler), e-waste listings, recycler price entries, basket, transactions, and CSR metrics
- Authorization and blob-storage components integrated
- React frontend with Landing page, Dashboard (with tabs: Overview, My Listings, Prices, Basket, My Pricing, Transactions, CSR Impact, Admin)
- Header and Footer components
- Profile setup flow post-login

## Requested Changes (Diff)

### Add
- Visual map interface for tracking pickup/delivery status (simulated, no GPS API) — show a step-by-step pickup progress tracker with map-like visual
- Stripe payment integration for transactions between sellers and recyclers
- Nearby recycling centres listing (simulated data with distances and pricing)
- E-waste category selection with rich category options (phones, laptops, TVs, batteries, appliances, etc.)
- Pickup scheduling flow: seller can request a pickup date/time after accepting a recycler's offer
- Transaction status visual tracker (pending → confirmed → pickup scheduled → in transit → completed)
- Notification badges and improved status indicators across the dashboard
- Improved landing page hero with VEXO logo more prominently displayed

### Modify
- ProductsTab: add category picker with e-waste types when creating/editing listings
- TransactionsTab: enhance with visual step-progress tracker showing pickup journey
- PriceComparisonTab: improve UI to show nearby centres with simulated distances
- OverviewTab: show quick stats more clearly
- Dashboard navigation: ensure better tab visibility and UX

### Remove
- Nothing to remove

## Implementation Plan
1. Select Stripe component for payment support
2. Update backend to support pickup scheduling (date, time) and Stripe payment reference in transactions
3. Update frontend:
   a. Enhance LandingPage hero section with larger logo, better tagline
   b. Improve PriceComparisonTab with nearby centres listing, distances, map-like visual
   c. Add pickup scheduling UI in TransactionsTab after transaction is created
   d. Add visual step tracker for transaction status (pending → confirmed → pickup scheduled → in transit → completed)
   e. Enhance ProductsTab category picker with comprehensive e-waste categories
   f. Add Stripe checkout flow triggered from BasketTab or TransactionsTab
   g. Improve OverviewTab quick stats cards
   h. Ensure VEXO logo appears in Header on all pages
