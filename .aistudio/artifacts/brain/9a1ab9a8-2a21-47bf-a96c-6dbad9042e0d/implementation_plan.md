# Global Private Wealth Management & Industrial Titan Simulation

A high-fidelity global wealth management tracker and realistic macroeconomic simulation. The player starts as an aspiring industrialist in Nigeria with ₦200,000 (20,000,000 kobo) and operates within a living world economy across all 6 continents. Grounded in the **UK Financial Stability Report (2019–2024)**, integrated with **Google Search Grounding via `@google/genai`**, and powered by an exhaustive **Taxonomy of Private Wealth Objectives**, the app empowers players to establish, analyze, and master their full financial life architecture.

All wrapped in an interactive Duolingo-themed mobile, tablet, and desktop design language (#58CC02 green, #1CB0F6 blue, #FFC800 gold, 2px solid borders with 4px bottom shadow offsets, warm cream canvas #F7F5F0).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following revisions have been synthesized based on your prompt:

- **Exhaustive Private Wealth Objectives Taxonomy**:
  Expanding far beyond basic savings to encompass all dimensions of private wealth management:
  1. **Capital Accumulation & Growth**:
     - *Emergency & Shock Reserve*: 3–12 months dynamically calculated buffer.
     - *Primary & Luxury Real Estate*: Buying homes/land (Lekki, Epe, Ikoyi, London, Dubai).
     - *Business Venture Capitalization*: Bootstrapping startups, expansion capex, industrial acquisitions.
     - *Education & Human Capital*: Children, grandchildren, overseas tuition, executive upskilling.
     - *Financial Independence & Early Retirement (FIRE)*: Passive cash flow replacing labor income.
     - *Second Income Stream*: Dedicated dividend, interest, and rental yield portfolios.
     - *Speculative & High-Alpha Growth*: Opportunistic angel deals, crypto, distressed debt arbitrage.
  2. **Wealth Protection & Risk Insulation**:
     - *Asset Protection & Creditor Shielding*: Irrevocable trusts, LLC structures, and liability firewalls.
     - *Inflation & Currency Devaluation Hedging*: FX USD/GBP cushions, physical gold, stablecoins.
     - *Long-Term Care & Catastrophic Health*: Private health coverage, medical evacuation reserves.
     - *Income Replacement & Family Disability Cushion*: Protection against loss of earning power.
  3. **Family, Cultural & Milestone Objectives**:
     - *Family Support & Cultural Obligations*: Parental eldercare, sibling stipends, extended family assistance (essential in Nigerian & African wealth management).
     - *Life Milestones & Celebrations*: Weddings, generational anniversaries, pilgrimages.
     - *Lifestyle & Passions*: Aviation, art collections, travel sabbatical funds.
  4. **Tax Arbitrage & Global Mobility**:
     - *Tax Optimization & Minimization*: Capital gains shielding, remittance basis, estate tax mitigation.
     - *Citizenship & Residency by Investment (CBI/RBI)*: Golden Visas (UAE, Portugal, UK, EB-5 US, Caribbean passports) for global travel and capital protection.
  5. **Dynasty, Succession & Philanthropy**:
     - *Multi-Generational Dynasty Preservation*: Generation-skipping dynasty trusts, family banks, family charters.
     - *Business Succession*: Management buyout (MBO), ESOP, or next-generation transition planning.
     - *Philanthropy & Impact*: Foundations, community endowments, scholarships, Africapitalism initiatives.
- **Interactive Goal Gap Analysis**:
  - Live tracking of target amount, current funded amount, projected value at target date, funding gap, and required quarterly contribution in minor units.
  - Feasibility categorizations: `Achievable`, `Achievable with Changes`, `Infeasible`, or `Already Exceeded`.
- **Google Real-Time Data Integration**:
  - Full-stack Express server (`server.ts`) with `@google/genai` Google Search Grounding to fetch live market prices (FTSE 100/250, S&P 500, NGX tickers, USD/NGN official vs parallel, Brent crude, Gold, UK 10Y Gilts, US 10Y Treasuries).
- **Starting Persona & Progression**:
  - Demilade Michaels, 28, Lagos, Nigeria. Starting liquid capital: ₦200,000 (20,000,000 kobo).
- **Duolingo Tactile 3D Styling**:
  - Tactile 2px borders, 4px bottom shadow offsets, Nunito typography, and responsive mobile-to-desktop layout.

---

## 1. Comprehensive Private Wealth Objectives Architecture

The objectives engine models five distinct categories with concrete financial mechanics:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Private Wealth Objectives Framework                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────┬───────────────┼───────────────┬────────────────┐
    ▼               ▼               ▼               ▼                ▼
┌───────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│ 1. Capital    ││ 2. Wealth    ││ 3. Family &  ││ 4. Tax &     ││ 5. Dynasty & │
│ Accumulation  ││ Protection   ││ Lifestyle    ││ Mobility     ││ Philanthropy │
│• Emergency    ││• Asset Shield││• Extended    ││• Tax Shelter ││• Dynasty     │
│• Real Estate  ││• Currency    ││  Family Care ││• Golden Visa ││  Trusts      │
│• Business Seed││  Devaluation ││• Milestone   ││  & CBI/RBI   ││• Business    │
│• Education    ││  Hedge       ││  Weddings    ││• Remittance  ││  Succession  │
│• FIRE / Exit  ││• Health & LTC││• Sabbaticals ││  Arbitrage   ││• Foundations │
└───────────────┘└──────────────┘└──────────────┘└──────────────┘└──────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             Goal Gap Analysis & Capital Allocation Strategies          │
│ • Projected at Target vs Target Goal · Required Quarterly Contribution │
│ • Priority Weighting (Essential, Important, Aspirational)              │
└────────────────────────────────────────────────────────────────────────┘
```

### Objective Details & Calculation Logic

1. **Capital Accumulation**:
   - **Emergency Fund**: Dynamically sized (3–12 months of household living costs) based on income stability, number of earners, debt load, and risk attitude.
   - **Real Estate Acquisition**: Earmarked capital for land, residential or commercial property in Lagos, Abuja, London, or Dubai.
   - **Business Capitalization**: Seed capital for bootstrapping enterprises or expanding industrial operations.
   - **Education Fund**: Scaled by number of children, target schools (domestic public, domestic private, or overseas UK/US/Canada), and education inflation.
   - **Retirement & FIRE**: Target capital base yielding 4% safe withdrawal rate to permanently cover living expenses.
   - **Second Income Stream**: Capital allocated to dividend stocks and rental assets to achieve target quarterly passive cash flow.
   - **Speculative Growth**: High-risk, high-reward capital for venture bets, distressed debt, and angel investing.

2. **Wealth Protection & Risk Insulation**:
   - **Asset Protection & Creditor Shielding**: Setting up legal entity firewalls, trusts, and holding companies to insulate personal assets from business risks.
   - **Currency & Inflation Hedge**: Hedging domestic Naira volatility with foreign currency (USD/GBP/EUR), gold, and hard export revenues.
   - **Health & Catastrophic Care**: Retained reserves for international medical treatments and long-term care needs.
   - **Income Replacement**: Capital backing life/disability safety nets to protect family continuity.

3. **Family, Cultural & Milestone Goals**:
   - **Extended Family & Eldercare Support**: Monthly/quarterly allowances for parents, elderly relatives, and sibling education (a prominent financial reality in Nigeria).
   - **Life Milestones**: Milestone weddings, cultural ceremonies, and sabbaticals.
   - **Lifestyle Assets**: Funding secondary residences, luxury automobiles, or private aircraft charters.

4. **Tax Optimization & Global Mobility**:
   - **Cross-Border Tax Planning**: Utilizing legal tax structures (UK non-dom, UAE 0% corporate/income zones, offshore holding entities).
   - **Golden Visa & Second Passports (CBI/RBI)**: Funding investment thresholds for UAE Golden Visa (AED 2M), Portugal Golden Visa, or Caribbean CBI passports.

5. **Dynasty, Succession & Philanthropy**:
   - **Dynasty Trusts**: Irrevocable multi-generational trust structures preserving capital across centuries without probate friction.
   - **Succession Planning**: Funding buy-sell agreements, management buyouts, and key person transitions for operating companies.
   - **Foundations & Impact**: Endowments, educational scholarships, community development funds, and Africapitalism ventures.

---

## 2. Google Real-Time Data & Full-Stack Architecture

To ensure zero API key leakage to client bundles, the app runs a full-stack Node.js server (`server.ts`) leveraging Express and `vite.middlewares` in dev mode:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Tactile Duolingo UI Client                      │
│        (React 19 · Nunito Typography · Tabular Numerals · 3D Pop)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ fetch('/api/market-data/realtime')
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Express Backend Server (server.ts)                │
│  • Proxy & Caching Layer (in-memory 5-minute TTL to respect quotas)    │
│  • Google GenAI Client with Telemetry Header ('aistudio-build')        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ ai.models.generateContent({
                                    │   model: 'gemini-3.8-flash',
                                    │   config: { tools: [{ googleSearch: {} }] }
                                    │ })
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Google Search Grounding Engine                       │
│  • Current FTSE 100, FTSE 250, S&P 500, NGX Stock Quotes               │
│  • Current USD/NGN Official & Parallel, GBP/USD, EUR/USD               │
│  • Brent Crude ($/bbl), Gold ($/oz), UK 10Y Gilts, US 10Y Treasuries   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. User Experience & Visual Design

### Duolingo Tactile 3D Aesthetics
- **Color Identity**:
  - Energetic Green: `#58CC02` (Primary CTAs, goal achievements, active statuses)
  - Action Blue: `#1CB0F6` (Google live sync, navigation, foreign exchange trades)
  - Warning Gold: `#FFC800` (Objective funding deficit, credit spread alerts, inflation warnings)
  - Ultra-Clean Cream: `#F7F5F0` (Warm, approachable background canvas)
  - Tactile Borders & Pop Shadows: `border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#D4D4D4] active:translate-y-1 active:shadow-none`
- **Interactive Objective Cards**: Tactile progress bars with percentage badges, funding gap indicators, and one-tap allocation triggers.
- **Responsive Layout**:
  - *Mobile (375px)*: Ergonomic thumb-zone bottom navigation bar (Overview, Objectives, Portfolio, Google Live, Global, Dynasty).
  - *Tablet & Desktop (768px - 1440px)*: Multi-column executive cockpit with live objective tracking, real-time market ticker, and simulation controls.

---

## 4. Key Product Decisions & Simulation State

### Minor-Unit Bigint Arithmetic Architecture
- Every monetary value stored as `bigint` minor units (`_minor`) with explicit `currency_code char(3)`:
  - NGN: kobo (100 kobo = ₦1)
  - USD: cents (100 cents = $1)
  - GBP: pence (100 pence = £1)
  - JPY: yen (1 yen = ¥1)
- Eliminates floating-point errors and prevents overflow across multi-generational wealth scenarios.

### Discrete Quarterly Turn Cycle with Live Sync Option
The player can play in two modes:
1. **Quarterly Simulation Cycle**: Advances quarter-by-quarter (Q1 2026 $\to$ Q2 2026...) with simulated macro shocks, compounding interest, rental remittances, and salary.
2. **Google Real-Time Market Calibration**: At any point, the user can click "Sync Real-World Google Market", which pulls fresh live prices via Google Search Grounding to update portfolio asset valuations, FX rates, and commodity benchmarks.

---

## 5. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Tactile Duolingo UI Shell                       │
│    (Nunito Typography · #58CC02 Emerald · #1CB0F6 Blue · #FFC800 Gold) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│     Mobile Navigation Bar     │       │    Desktop / Tablet Header    │
│  (Overview · Objectives ·     │       │ (Global Net Worth · Google    │
│   Portfolio · Global · Dynasty)│      │   Live Sync · Advance Turn)   │
└──────────────┬────────────────┘       └──────────────┬────────────────┘
               └────────────────────┬──────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        View Routing Controller                         │
│  ┌───────────────┬───────────────┬───────────────┬──────────────────┐  │
│  │ 1. Overview   │ 2. Objectives │ 3. Portfolio  │ 4. Google Live   │  │
│  │    Dashboard  │    Hub (All 5)│    Allocation │    Market/FSR    │  │
│  ├───────────────┴───────────────┴───────────────┴──────────────────┤  │
│  │ 5. Properties & Remittances   │ 6. Ajo / Peer Syndicates         │  │
│  ├───────────────────────────────┴──────────────────────────────────┤  │
│  │ 7. Global World & Relocation  │ 8. Business & Dynasty Trusts     │  │
│  └───────────────────────────────┴──────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            Global Wealth & Financial Stability State Store             │
│  • Player State: ₦200,000 start, Country of Residence, Career          │
│  • Full Objectives Matrix: Capital, Protection, Family, Tax, Dynasty   │
│  • FSR & Google Market State: Yield curves, BBB credit spreads, FX     │
│  • Equity Indexes: FTSE 100, FTSE 250, S&P 500, NGX 30                 │
│  • Asset Registry: Multi-currency bank accounts, Gilts/T-bills, Stock  │
│    holdings, Real estate, Ajo pools, Conglomerate subsidiaries         │
│  • Turn Processor: Quarterly settlement, inflation drag, macro shocks  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   LocalStorage Persistence & JSON Sync                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Stages & Verification Plan

### Phase 1: Full-Stack Setup & Google Search Grounding Endpoint
- Create `server.ts` with Express and Vite middleware.
- Implement `/api/market-data/realtime` using `@google/genai` with `gemini-3.8-flash` and `{ tools: [{ googleSearch: {} }] }` to fetch real-world stock quotes, FX rates, and commodities.
- Ensure package.json has `"start": "node server.ts"` and `"dev": "tsx server.ts"`.

### Phase 2: Core Types & Financial Market Engine
- Implement `src/types/wealth.ts` and `src/data/financialMarketsData.ts` with minor unit `bigint` math, credit spread models, and yield curve simulation.
- Implement full 5-category Objectives data model (Capital, Protection, Family/Culture, Tax/Mobility, Dynasty/Succession).
- Configure Google Nunito font and Duolingo tactile styling tokens in Tailwind CSS.

### Phase 3: Simulation Store & Turn-Based Engine
- Implement `src/state/simulationContext.tsx` with Demilade's ₦200,000 starting scenario in Nigeria.
- Implement quarterly progression resolving macro shocks, corporate credit spread widening, stock index shifts, and cash settlements.
- Add automatic Goal Gap recalculation on every quarter tick.

### Phase 4: Tactile UI Components & Views
- Build responsive shell (sticky top bar, mobile bottom tab bar, desktop sidebar).
- Implement all primary views: Dashboard, Objectives Hub (with all 5 categories and goal creation modal), Portfolio, Google Live Market & FSR, Global World & Relocation, Real Estate & Remittances, Ajo Syndicates, and Business/Dynasty.
- Add Google Real-Time Sync controls with loading skeletons and source attribution.

### Phase 5: Verification & Polish
- Compile with `compile_applet` and verify zero errors.
- Test across mobile (375px), tablet (768px), and desktop (1440px) viewports.
