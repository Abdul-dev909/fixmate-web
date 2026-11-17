# FixMate — On-Demand Home Services Marketplace (Islamabad)

**Course:** CS4032 Web Programming — Assignment 02  
**Institution:** National University of Computer and Emerging Sciences (FAST-NUCES), Islamabad  
**Student Name:** Abdul Rehman  
**Roll Number:** 24i-2092  
**Business Name:** FixMate  
**Operating Area:** Islamabad Capital Territory (Sectors F-6 through I-14)  
**Reference Website Investigated:** [HomeGenie](https://homegenie.lovable.app)  

---

## 1. Project Overview

**FixMate** is a responsive on-demand home services marketplace web application built in React 18. It connects residents of Islamabad with verified local technicians, plumbers, electricians, painters, and cleaners. 

The application investigates and directly resolves three key user experience and interaction defects found in the reference website (HomeGenie):
1. **Broken Dark Mode Toggle:** Resolved via persistent `ThemeContext` and CSS custom properties on `<html>`.
2. **Concealed Provider Information:** Resolved by displaying provider credentials, ratings, and experience directly on cards and on dedicated `/services/:id` profiles.
3. **Rigid Search Limited to Categories:** Resolved through a multi-token fuzzy search engine searching names, categories, tags, and service descriptions.

---

## 2. Installation, Development & Test Commands

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on Node v26.13.1)
- npm (v9.0.0 or higher)

### Setup & Installation
```bash
# Clone the repository
git clone <repository-url>
cd fixmate

# Install project dependencies
npm install
```

### Running the Development Server
```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### Running Automated Business Rule Tests (Task 6.2)
```bash
node --test src/__tests__/bookingRules.test.mjs
```
Runs the 11 unit tests using Node.js's native test runner (`node:test` and `node:assert/strict`).

### Production Build
```bash
npm run build
```
Builds the app for production to the `build` directory.

---

## 3. GitHub & Deployment Links

- **Public GitHub Repository:** [https://github.com/abdulrehman-24i2092/fixmate-web](https://github.com/abdulrehman-24i2092/fixmate-web) *(or your specific repo link)*
- **Live Deployed Website:** [https://fixmate-web.vercel.app](https://fixmate-web.vercel.app) *(or Netlify/Vercel URL)*
- **Final Commit Hash:** `3fa1bc9` *(updated upon milestone completion)*

---

## 4. Main Routes & Feature Summary

| Route | Page Component | Key Features |
|---|---|---|
| `/` | `HomePage` | Hero section, fuzzy search with suggestions, popular services, how-it-works overview, error simulation toggle. |
| `/services` | `ServicesPage` | Full catalog of 12 services, category filters, sorting (Price, Rating, Popularity, Name), debounced search. |
| `/services/:id` | `ServiceDetailPage` | Parameterized view, complete provider credentials, slot capacity validation (Rule 1), sector eligibility check (Rule 2), quantity control (1-6). |
| `/cart` | `CartPage` | Selection management, item quantities, calculated summary, 5% fee waiver rule (Rule 3), persistent local storage. |
| `/checkout` | `CheckoutPage` | Controlled customer form (Name, Phone regex, Sector compatibility, Address), real-time validation, order review. |
| `/confirmation` | `ConfirmationPage` | Order reference number generation, customer and item breakdown, cart cleanup upon placement, printable receipt. |
| `*` | `NotFoundPage` | 404 handler for invalid routes with quick recovery navigation. |

---

## 5. Three Operating Business Rules

1. **Rule 1 (Capacity/Availability):** Each service slot has a maximum capacity (`maxBookingsPerSlot`). When bookings reach this limit, the slot is marked as "Fully Booked" and disabled, preventing overscheduling.
2. **Rule 2 (Eligibility/Compatibility):** Each service operates within specific Islamabad sectors. Entering a non-covered sector (e.g. Bahria Town or uncovered sectors) triggers an explicit error and blocks booking.
3. **Rule 3 (Pricing & Fulfilment):** Orders incur a standard 5% platform service fee. If the item subtotal equals or exceeds **PKR 10,000**, the entire service fee is waived (FREE).

---

## 6. Instructions for Reproducing Edge Cases

1. **Simulated Loading Failure & Retry:**
   - On either `/` or `/services`, check the checkbox labeled *"Simulate network/loader error (Edge Case Demo)"*.
   - The application immediately displays the error state banner with a *"Try Again"* button.
   - Uncheck the box and click *"Try Again"* to verify seamless error recovery.
2. **Invalid Service Route / Parameter (`/services/:id`):**
   - Navigate to `/services/svc-999` in the browser address bar.
   - The app gracefully displays a "Service Not Found" feedback card with direct links back to `/services` and `/`.
3. **Empty Search Results vs. Full Dataset:**
   - On `/services`, type a non-existent search term (e.g. `xyz123`).
   - The UI shows an empty results state with a *"Reset All Filters"* button that restores the catalog.
4. **Invalid Form Input & Preservation:**
   - Proceed to `/checkout` and input an invalid phone number (e.g. `12345`).
   - Submit the form: the phone field highlights with a specific format error while the customer's name and address remain fully preserved.
5. **Local Storage Cart & Theme Restoration:**
   - Add items to the cart and toggle to Dark Mode.
   - Hard refresh the browser (`Ctrl+F5`): theme and all cart items persist seamlessly.

---

## 7. Simulated Operations & Known Limitations

- **Simulated Transactions:** All booking references (`#FXM-XXXXXX`) and checkout submissions simulate real backend actions; no credit cards or live payments are accepted.
- **Provider Contact:** Direct helpline numbers and provider profiles are simulated for academic evaluation.
- **Local Storage State:** Cart selections are client-persisted in browser storage (`localStorage`) and are specific to the user's browser session.

---

## 8. Concept Map

| Requirement / Concept | Source File | Key Component / Function |
|---|---|---|
| **Routing & Parameterized Routes** | `src/App.js` | `<BrowserRouter>`, `<Routes>`, `<Route path="/services/:id">` |
| **Theme State & Dark Mode** | `src/context/ThemeContext.js` | `ThemeProvider`, `useTheme`, `document.documentElement.setAttribute` |
| **Shared Cart State & Persistence** | `src/context/CartContext.js` | `CartProvider`, `useCart`, `localStorage` read/write |
| **Async Data Loading & Delay** | `src/utils/loader.js` | `loadServices(simulateError)` |
| **Fuzzy Search Algorithm** | `src/utils/search.js` | `searchServices(services, query)`, `containsToken` |
| **Business Rule: Capacity (Rule 1)** | `src/utils/bookingRules.mjs` | `checkSlotAvailability(availability, slot)` |
| **Business Rule: Coverage (Rule 2)** | `src/utils/bookingRules.mjs` | `checkAreaEligibility(areasCovered, customerSector)` |
| **Business Rule: Pricing (Rule 3)** | `src/utils/bookingRules.mjs` | `calculateTotal(subtotal, serviceFeeRate)` |
| **Controlled Form & Validation** | `src/pages/CheckoutPage.js` | `formData` state, `handleChange`, `validate()` |
| **Automated Business Rule Tests** | `src/__tests__/bookingRules.test.mjs` | `describe()`, `test()`, `assert.equal()`, `assert.match()` |
