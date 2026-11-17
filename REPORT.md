# CS4032 Web Programming — Assignment 02 Report
## Business Website Development Using React: FixMate (Home Services)

---

### Section 1: Student and Project Details

| Field | Detail |
|---|---|
| **Student Name** | Abdul Rehman |
| **Roll Number** | 24i-2092 |
| **Section** | BS Cyber Security / B |
| **Course** | Web Programming (CS4032) — Fall 2026 |
| **Institution** | National University of Computer and Emerging Sciences, Islamabad Campus |
| **Business Name** | **FixMate** |
| **Business Domain** | On-Demand Home Services & Maintenance Marketplace |
| **Reference Website Investigated** | [HomeGenie](https://homegenie.lovable.app) |
| **Public GitHub Repository** | `https://github.com/Abdul-dev909/fixmate-web` |
| **Live Deployed Application** | `https://fixmate-web-delta.vercel.app` |
| **Final Application Commit Hash** | `dba5554` |

---

### Section 2: Business Profile

| Element | Description & Specifications |
|---|---|
| **Business Identity** | **FixMate** — An on-demand home maintenance and repairs marketplace connecting homeowners with verified, background-checked local technicians, cleaners, electricians, plumbers, and handymen. |
| **Primary Audience** | Homeowners, apartment residents, working professionals, and university students residing across the urban sectors of Islamabad seeking reliable, transparently priced household services. |
| **Operating Area** | Islamabad Capital Territory (Core Sectors: F-6, F-7, F-8, F-10, F-11, G-6, G-7, G-8, G-9, G-10, I-8, I-10, I-14, E-7, E-11, H-8, H-9). |
| **Main Customer Task** | Effortlessly discover home maintenance services, review verified service providers and real customer ratings, check real-time time-slot capacity, select appointment slots, configure quantities, and confirm scheduled bookings with transparent upfront pricing. |
| **Business Goal** | To drive complete, frictionless service bookings with transparent provider verification and dynamic service fee waivers that reward high-value orders. |
| **Offering (12 Services)** | 1. Deep Home Cleaning (Cleaning)<br>2. AC Service & Repair (Appliance Repair)<br>3. Electrician Services (Electrical)<br>4. Plumbing Solutions (Plumbing)<br>5. Pest Control (Cleaning)<br>6. Painting & Wall Repair (Renovation)<br>7. Carpenter & Furniture Repair (Carpentry)<br>8. Home Shifting & Packing (Moving)<br>9. CCTV & Security Installation (Electrical)<br>10. Gardening & Landscaping (Outdoor)<br>11. Water Tank Cleaning (Cleaning)<br>12. Geyser & Water Heater Service (Appliance Repair) |

---

### Section 3: Operating Rules

#### Rule 1: Slot Availability & Capacity Limits (Category: Availability / Capacity)
- **1. Exact Condition:** Each appointment time slot has a strict capacity limit (`maxBookingsPerSlot`). The remaining available slots equal `maxBookingsPerSlot - currentBookings[slot]`. When remaining capacity equals 0, the slot is fully booked.
- **2. Communication to User:** Displayed on each slot selection pill on `/services/:id` with real-time badges ("2 left", "1 left", or "Fully Booked").
- **3. Application Behavior:** When available (`remaining > 0`), the button is selectable with an informational prompt. When saturated (`remaining <= 0`), the slot is disabled (`disabled` attribute), visually greyed out, and cannot be added to cart.
- **4. Boundary Case:** Exactly 1 slot remaining (`remaining = 1`). Result: The slot renders as available with warning text "1 left", permitting exactly one final booking before saturation.

#### Rule 2: Geographic Sector Eligibility (Category: Eligibility / Compatibility)
- **1. Exact Condition:** A booking is eligible only if the customer's sector exists within the service's `areasCovered` array.
- **2. Communication to User:** On the service detail page (`/services/:id`) and during final checkout (`/checkout`), the sector selector explicitly highlights whether the service covers that sector.
- **3. Application Behavior:** If the sector is covered, a green checkmark confirms eligibility ("✓ Service is available in Sector F-7"). If outside coverage (e.g. "Bahria Town"), a prominent error message displays the supported sectors and disables checkout completion.
- **4. Boundary Case:** Selecting an edge sector such as "I-14" which is covered by large-scale services (e.g. Moving, Tank Cleaning) but excluded by localized services. Result: Properly validates per-service compatibility in the multi-item cart.

#### Rule 3: 5% Platform Fee Waiver on Orders $\ge$ PKR 10,000 (Category: Pricing / Fulfilment)
- **1. Exact Condition:** Subtotal is calculated as $\sum (\text{item.price} \times \text{item.quantity})$. A standard 5% platform service fee applies ($\text{subtotal} \times 0.05$). If $\text{subtotal} \ge \text{PKR } 10,000$, the service fee is completely waived ($\text{fee} = 0$).
- **2. Communication to User:** Real-time breakdown in Cart Summary (`/cart`) and Checkout Summary (`/checkout`), with a progress notice indicating how much more needs to be added to qualify for free platform fees.
- **3. Application Behavior:** Automatically recalculates upon every item quantity adjustment without page reload.
- **4. Boundary Case:** Subtotal exactly equal to PKR 10,000. Result: Service fee becomes PKR 0 (displaying "Waived! / FREE"), saving the user PKR 500.

---

### Section 4: Reference-Site Investigation (HomeGenie)

#### Reference Website:
- **URL:** [https://homegenie.lovable.app](https://homegenie.lovable.app)
- **Domain:** Home services discovery and booking.

#### Problem 1: Broken Dark Mode Toggle Button
- **Task User is Trying to Complete:** Switch between light and dark visual modes using the navigation toggle for eye comfort in low-light environments.
- **What Goes Wrong:** Clicking the toggle button triggers no CSS changes, fails to apply any dark theme styles, and does not persist preference in browser storage.
- **Possible Business Consequence:** Accessibility compliance failure, eye fatigue for night-time users leading to site abandonment, and perceived lack of technical credibility.
- **How FixMate Addresses It:** Implemented a dedicated `ThemeContext` storing user preferences in `localStorage` and toggling `data-theme` on `<html>`. The entire UI uses semantic CSS custom properties that adapt instantly and smoothly across all pages.

#### Problem 2: Service Cards Conceal Provider Details on Click
- **Task User is Trying to Complete:** Inspect assigned service providers, their background verification, and reviews to establish trust before scheduling home entry.
- **What Goes Wrong:** Clicking on service cards or provider links fails to show provider identity or opens a non-functional state with no provider details.
- **Possible Business Consequence:** High drop-off rate prior to booking. Customers will not allow unverified technicians into their homes without knowing provider credentials.
- **How FixMate Addresses It:** Every service card prominently displays the provider firm name, verified partner badge, and years of field experience. The parameterized `/services/:id` route renders a complete Provider Profile Card with direct helpline, on-duty status, and service warranty.

#### Problem 3: Homepage Search Bar Fails on Vague / Cross-Category Queries
- **Task User is Trying to Complete:** Search for services using common task descriptions such as "ac cleaning", "leak repair", or "pipe replacement".
- **What Goes Wrong:** The search bar on HomeGenie only performs strict category title matching. Entering "ac cleaning" returns 0 results because "Cleaning" and "Appliance Repair" are separate categories, leaving the user with an empty screen and no suggestions.
- **Possible Business Consequence:** High search abandonment. Frustrated users assume the platform does not offer AC servicing or plumbing leak repair.
- **How FixMate Addresses It:** Built a multi-token fuzzy search engine (`src/utils/search.js`) that breaks queries into tokens and searches service names, categories, tags, and detailed descriptions with weighted relevance scoring. Also added one-click quick search chips for immediate guidance.

---

### Section 5: Frontend Architectural Decisions (Summary of DECISIONS.md)

| Field | Decision 1: Theme Persistence | Decision 2: Provider Transparency | Decision 3: Multi-Token Search |
|---|---|---|---|
| **Problem** | Broken dark mode toggle on HomeGenie | Cards conceal provider identity | Strict search ignores vague/cross terms |
| **Decision** | Centralized `ThemeContext` with root `data-theme` and `localStorage` | Direct inline card badges + full profile on `/services/:id` | Token-based weighted scoring across names, tags, and descriptions |
| **Alternative** | Per-component dark mode class toggles | Popup modal on card click | Strict title substring search or server search |
| **Reason** | Zero style flash on reload, clean global consistency | Builds immediate homeowner trust without extra clicks | Customers search by task words ("ac cleaning") not strict categories |
| **Tradeoff** | Requires discipline with semantic CSS variables | Slightly taller card height on mobile viewports | JS scoring scales well for hundreds of items; larger needs backend |
| **Code Location** | `src/context/ThemeContext.js`, `src/index.css` | `src/components/ServiceCard.js`, `src/pages/ServiceDetailPage.js` | `src/utils/search.js`, `src/components/SearchBar.js` |

---

### Section 6: Implemented Application Walkthrough

The completed FixMate application implements the full 7-stage customer journey:
1. **Browse:** Users browse 12 rich service records on `/` and `/services` featuring icons, prices, ratings, and verified provider badges.
2. **Search & Narrow Down:** Search bar with live debounce, popular keyword chips, category dropdown filter, and sorting controls (price, rating, popular, name).
3. **Open Details Page:** Dynamic route `/services/:id` displays comprehensive service descriptions, provider background, and covered sectors.
4. **Build & Change Selection:** Users select appointment slots (validated against remaining capacity) and adjust quantities (1–6 boundary).
5. **Review Summary:** `/cart` provides real-time itemized calculation, quantity updates, item removals, and Rule 3 service fee waiver calculation.
6. **Complete Relevant Form:** `/checkout` captures customer contact and address through a fully controlled React form with live validation.
7. **Confirmation Result:** `/confirmation` generates a unique booking ID, displays complete order summary, clears the cart, and provides printable receipt options.

---

### Section 7: Verification & Automated Test Results

#### 7.1 Automated Business Rule Tests (Task 6.2)
Tests were executed using Node.js's native test runner (`node --test src/__tests__/bookingRules.test.mjs`) with `node:assert/strict`:

```text
▶ Business Operating Rules Test Suite (Task 6.2)
  ▶ Rule 1: Slot Availability (Capacity Limits)
    ✔ Case 1 (Valid Input): Slot with open capacity returns valid=true and correct remaining count
    ✔ Case 2 (Boundary Limit): Slot with exactly 1 spot remaining before saturation
    ✔ Case 3 (Breaks Rule): Slot at full capacity (4/4 booked) returns valid=false
    ✔ Case 4 (Edge Case): Non-existent slot returns valid=false
  ✔ Rule 1: Slot Availability (Capacity Limits)
  ▶ Rule 2: Geographic Service Area Eligibility
    ✔ Case 1 (Valid Area): Customer in covered sector returns valid=true
    ✔ Case 2 (Case Insensitive Match): Sector input matches regardless of lowercase/whitespace
    ✔ Case 3 (Breaks Rule): Customer outside covered sectors returns valid=false
  ✔ Rule 2: Geographic Service Area Eligibility
  ▶ Rule 3: Pricing & Service Fee Waiver Threshold (PKR 10,000)
    ✔ Case 1 (Standard Order < 10,000): Applies standard 5% service fee
    ✔ Case 2 (Boundary Limit == 10,000): Exactly PKR 10,000 qualifies for fee waiver (fee = 0)
    ✔ Case 3 (Breaks Threshold > 10,000): PKR 15,000 qualifies for fee waiver
    ✔ Case 4 (Edge Case - Negative Input): Returns zeroed out safe fallback
  ✔ Rule 3: Pricing & Service Fee Waiver Threshold (PKR 10,000)
✔ Business Operating Rules Test Suite (Task 6.2)
ℹ tests 11, pass 11, fail 0 (Duration: 235ms)
```

#### 7.2 Manual Edge-Case Checklist

| Edge Case Scenario | User Actions | Expected Behaviour | Observed Result | Status |
|---|---|---|---|---|
| **Simulated Loader Failure** | Check demo toggle on `/` or `/services` | App transitions to error state card with "Try Again" CTA | Error banner shown; unchecking and clicking "Try Again" reloads data | **PASS** |
| **Invalid Service ID** | Navigate to `/services/svc-999` | Shows 404/not found card with return buttons | Clean error card rendered with links to `/services` and `/` | **PASS** |
| **Zero Search Matches** | Enter `zzzqqq` in search bar | Shows empty state with "Reset All Filters" CTA | Empty state rendered; reset button restores all 12 services | **PASS** |
| **Invalid Form Submission** | Enter invalid phone (`0399`) on `/checkout` | Form submission blocked, field highlighted, input preserved | Red inline error shown; user's name and address preserved | **PASS** |
| **Slot Capacity Limit** | Select 5:00 PM on Deep Cleaning | Saturated slot cannot be selected | Slot pill marked "Fully Booked" and disabled | **PASS** |
| **Cart Persistence** | Add 2 items, hard refresh (`Ctrl+F5`) | Cart count badge and items remain intact | All cart selections restored from `localStorage` | **PASS** |

---

### Section 8: Known Limitations

1. **Simulated Backend Operations:** Checkout and booking IDs are generated client-side for academic evaluation without an active SQL/NoSQL database backend.
2. **Payment Processing:** Payment is strictly Cash on Delivery / direct bank transfer simulation; no live payment gateway (Stripe/JazzCash) is integrated.
3. **Session-Specific Cart:** Cart persistence relies on browser `localStorage` and does not synchronize across different devices.
