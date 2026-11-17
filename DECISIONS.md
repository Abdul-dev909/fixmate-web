# Frontend Architecture Decisions — FixMate

This document records the architectural and design decisions made to resolve three specific interaction and frontend design issues identified on the reference website ([HomeGenie](https://homegenie.lovable.app)).

---

## Decision 1: Persistent Dark Mode Theming (Interaction & State Behaviour)

- **Problem:**
  On HomeGenie, clicking the dark mode toggle button in the header fails to apply dark styling or alter component themes. The state is either broken or completely decoupled from stylesheet variables, leaving users working in low-light environments without visual comfort or accessibility accommodation.

- **Decision:**
  Implemented a centralized `ThemeContext` in React using React Context API. The context synchronizes with a `data-theme` attribute on the root `<html>` element and persists user preference in `localStorage`. All components reference semantic CSS custom properties (`--bg-primary`, `--card-bg`, `--text-primary`, `--nav-bg`) that seamlessly transition between light and dark palettes.

- **Alternative:**
  Injecting class names like `.dark` on individual components or managing CSS module theme flags per component.

- **Reason:**
  A single root attribute combined with CSS variables ensures 100% theme consistency across all current and future routes without prop drilling or component re-renders. It guarantees instant paint and avoids theme flashing on reload.

- **Tradeoff:**
  Requires all components to strictly use semantic CSS variables rather than hardcoded hex colors, slightly increasing discipline needed during style authoring.

- **Code Location:**
  - `src/context/ThemeContext.js` (`ThemeProvider`, `useTheme`)
  - `src/components/Navbar.js` (Theme toggle button)
  - `src/index.css` (CSS variables for `:root` and `[data-theme='dark']`)

- **Evidence:**
  Clicking the moon/sun toggle in `Navbar.js` instantly toggles the document's `data-theme` between `light` and `dark`, persisting through page refreshes.

---

## Decision 2: Inline Provider Transparency & Detailed Profiles (Information Hierarchy & Layout)

- **Problem:**
  On HomeGenie service cards, clicking to view the assigned provider or technicians does nothing. Users cannot inspect who will enter their premises, their credentials, or verify their authenticity prior to booking.

- **Decision:**
  Restructured the card information hierarchy to surface the provider name, verified partner badge, and years of field experience directly on every `ServiceCard`. Furthermore, the dedicated parameterized route (`/services/:id`) provides a comprehensive Provider Profile section displaying direct helpline info, on-duty status, and background verification.

- **Alternative:**
  Displaying provider details inside a modal or popup dialog upon clicking an info button on the card.

- **Reason:**
  Home services require immense customer trust. Surfacing provider verification directly within the browsing hierarchy eliminates friction, reassuring users before they commit to an appointment.

- **Tradeoff:**
  Consumes additional vertical real estate on service cards, requiring a balanced responsive grid on compact mobile viewports (390px).

- **Code Location:**
  - `src/components/ServiceCard.js` (Inline provider badge and verification pill)
  - `src/pages/ServiceDetailPage.js` (Comprehensive Provider Profile Card)
  - `src/components/ServiceCard.css` and `src/pages/ServiceDetailPage.css`

- **Evidence:**
  Every service card across `/` and `/services` clearly shows provider credentials, and clicking through to `/services/:id` renders their complete profile and availability.

---

## Decision 3: Multi-Token Fuzzy Search with Keyword Chips (Interaction & Search UX)

- **Problem:**
  The search bar on HomeGenie only matches exact predefined category titles. Entering realistic or colloquial search terms (such as "ac cleaning", "leak repair", or "pest") returns zero results because the matching logic is strict and ignores tags, item descriptions, and partial keywords.

- **Decision:**
  Developed a tokenized scoring search utility (`searchServices`) in `src/utils/search.js`. The search algorithm normalizes query strings, splits them into whitespace-separated tokens, and computes relevance scores by scanning item names (weight: 10), categories (weight: 8), metadata tags (weight: 6), and descriptions (weight: 3–4). Quick-search chips ("AC Cleaning", "Leak Repair", "Pest Control") were also added below the search bar for instant 1-click discovery.

- **Alternative:**
  Server-side search indexing (e.g. Algolia/ElasticSearch) or a strict substring search matching only against the service title.

- **Reason:**
  Users commonly search by problem ("leak", "cleaning") rather than formal category names. Token matching across multiple attributes ensures vague search queries accurately surface the appropriate service providers.

- **Tradeoff:**
  Multi-attribute token scoring in JavaScript scales with catalog size. While blazing fast for tens of records, catalogs with tens of thousands of items would require indexed inverted lists or web workers.

- **Code Location:**
  - `src/utils/search.js` (`searchServices`, `containsToken`)
  - `src/components/SearchBar.js` (Debounced input and interactive keyword chips)
  - `src/pages/ServicesPage.js` and `src/pages/HomePage.js` (Integration with category filters and sorting)

- **Evidence:**
  Typing "ac cleaning" successfully returns "AC Service & Repair" and "Deep Home Cleaning" due to matched tags and descriptions.
