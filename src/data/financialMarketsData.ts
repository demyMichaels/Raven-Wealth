/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FinancialStabilityMetrics } from '../types/wealth';

/**
 * Baseline Financial Stability State inspired by the empirical findings
 * in the Financial Stability Report of the UK Financial Market (2019-2024)
 * prepared by Michael Ogunnowo for Young Titans Foundation.
 */
export const INITIAL_FSR_METRICS: FinancialStabilityMetrics = {
  quarter: 'Q1 2026',
  year: 2026,
  quarterNumber: 1,
  // 10-Year Sovereign Yields (%)
  uk10YGiltYield: 4.25,        // Normalized from post-crisis peak 4.5% (was <1% in 2020)
  us10YTreasuryYield: 4.15,    // Benchmark world risk-free rate
  nigeria10YFgnYield: 18.50,   // High nominal frontier rate reflecting inflation premium
  // Corporate Credit Spreads (bps)
  bbbCorporateCreditSpreadBps: 180, // Normal is ~120bps; crisis widens to 250-300bps
  highYieldSpreadBps: 410,
  // Money Market & Liquidity
  soniaRatePercent: 4.75,
  cbnMprRatePercent: 27.25,   // CBN Monetary Policy Rate fighting inflation
  fedFundsRatePercent: 4.50,
  boeBaseRatePercent: 4.75,
  commercialPaperHealthIndex: 78,
  moneyMarketLiquidityIndex: 82,
  // Commodities & Foreign Exchange
  brentCrudeUsd: 78.50,       // Crucial driver of Nigerian foreign reserves and UK energy inflation
  goldUsdPerOz: 2650.00,      // Ultimate global store of value & geopolitical hedge
  usdNgnOfficial: 1540.0,     // CBN NAFEM window rate
  usdNgnParallel: 1645.0,     // Lagos black market street cash rate (parallel spread ~7%)
  gbpUsd: 1.285,              // Stiff recovery from 2022 mini-budget low of 1.07
  eurUsd: 1.085,
  // Inflation Rates (%)
  nigeriaInflationRate: 31.8, // Headline CPI driven by food, transport, and energy
  ukInflationRate: 2.8,       // Cooled from 2022 peak of 11.1%
  usInflationRate: 2.7,
  marketSentiment: 'cautious_contraction',
};

export interface HistoricalFSRPoint {
  date: string;
  giltYield: number;
  bbbSpreadBps: number;
  soniaRate: number;
  ftse100Price: number;
  ftse250Price: number;
  sp500Price: number;
  gbpUsd: number;
  brentCrude: number;
  ukInflation: number;
  notes: string;
}

export const HISTORICAL_FSR_BENCHMARKS: HistoricalFSRPoint[] = [
  {
    date: '2019 Q4',
    giltYield: 0.82,
    bbbSpreadBps: 120,
    soniaRate: 0.70,
    ftse100Price: 7540,
    ftse250Price: 21800,
    sp500Price: 3230,
    gbpUsd: 1.32,
    brentCrude: 66,
    ukInflation: 1.3,
    notes: 'Pre-COVID tranquility; credit spreads tight at 120bps.',
  },
  {
    date: '2020 Q1',
    giltYield: 0.35,
    bbbSpreadBps: 300,
    soniaRate: 0.05,
    ftse100Price: 5670,
    ftse250Price: 15200,
    sp500Price: 2580,
    gbpUsd: 1.15,
    brentCrude: 22,
    ukInflation: 0.9,
    notes: 'COVID-19 shock: FTSE 100 drops 30%, BBB spreads blow out to 300bps, massive liquidity run into cash.',
  },
  {
    date: '2021 Q4',
    giltYield: 1.02,
    bbbSpreadBps: 135,
    soniaRate: 0.18,
    ftse100Price: 7380,
    ftse250Price: 23400,
    sp500Price: 4760,
    gbpUsd: 1.35,
    brentCrude: 77,
    ukInflation: 5.4,
    notes: 'Stimulus rally; S&P 500 hits new highs while inflation pressures start building.',
  },
  {
    date: '2022 Q3',
    giltYield: 4.10,
    bbbSpreadBps: 250,
    soniaRate: 2.19,
    ftse100Price: 6890,
    ftse250Price: 17200,
    sp500Price: 3580,
    gbpUsd: 1.07,
    brentCrude: 98,
    ukInflation: 11.1,
    notes: 'Energy crisis & Russia-Ukraine war: Brent crude spikes, UK inflation reaches 11.1%, BoE policy lag causes GBP drop to 1.07.',
  },
  {
    date: '2023 Q4',
    giltYield: 4.45,
    bbbSpreadBps: 190,
    soniaRate: 5.18,
    ftse100Price: 7730,
    ftse250Price: 19600,
    sp500Price: 4770,
    gbpUsd: 1.27,
    brentCrude: 82,
    ukInflation: 4.0,
    notes: 'Quantitative tightening & high interest rates. FTSE 100 outperforming FTSE 250 due to multinational dividend shield.',
  },
  {
    date: '2024 Q4',
    giltYield: 4.25,
    bbbSpreadBps: 165,
    soniaRate: 4.75,
    ftse100Price: 8280,
    ftse250Price: 20900,
    sp500Price: 5860,
    gbpUsd: 1.30,
    brentCrude: 75,
    ukInflation: 2.6,
    notes: 'Stabilization phase. Fed & BoE rate cutting cycles initiated.',
  },
];
