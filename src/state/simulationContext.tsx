/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PlayerProfile,
  FinancialStabilityMetrics,
  WealthObjective,
  AssetHolding,
  RealProperty,
  PropertyManager,
  PropertyRemittance,
  AjoCycle,
  PeerCoInvestment,
  BusinessEnterprise,
  DynastyTrust,
  QuarterSettlementLog,
  GoogleLiveMarketSnapshot,
  CurrencyCode,
  CountryModule,
} from '../types/wealth';
import { majorToMinor, minorToMajor, convertCurrencyMinor } from '../utils/formatters';
import { INITIAL_FSR_METRICS } from '../data/financialMarketsData';
import { COUNTRIES } from '../data/globalWorldData';

interface SimulationContextType {
  player: PlayerProfile;
  fsrMetrics: FinancialStabilityMetrics;
  objectives: WealthObjective[];
  assets: AssetHolding[];
  properties: RealProperty[];
  propertyManagers: PropertyManager[];
  remittances: PropertyRemittance[];
  ajoCycles: AjoCycle[];
  peerDeals: PeerCoInvestment[];
  businesses: BusinessEnterprise[];
  dynastyTrusts: DynastyTrust[];
  historyLogs: QuarterSettlementLog[];
  googleLiveSnapshot: GoogleLiveMarketSnapshot;
  countries: CountryModule[];
  totalNetWorthNaira: number;
  totalNetWorthUSD: number;
  emergencyFundMonths: number;
  // Actions
  advanceQuarter: () => QuarterSettlementLog;
  addObjective: (objective: Omit<WealthObjective, 'id' | 'currentAmountMinor'>) => void;
  allocateToObjective: (objectiveId: string, amountMinor: bigint) => boolean;
  buyAsset: (asset: Omit<AssetHolding, 'id'>) => boolean;
  sellAsset: (assetId: string) => void;
  approveRemittance: (remittanceId: string) => void;
  joinAjoCycle: (cycle: Omit<AjoCycle, 'id' | 'currentTurnMonth' | 'playerPaidSoFarMinor'>) => void;
  relocateToCountry: (countryCode: string, visaId: string) => { success: boolean; message: string };
  updateCountry: (countryCode: string, updates: Partial<CountryModule>) => void;
  addCountry: (newCountry: CountryModule) => void;
  resetCountriesToDefaults: () => void;
  fetchGoogleLiveMarket: () => Promise<void>;
  syncGoogleWithSimulation: () => void;
  resetSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'titan_wealth_simulation_state_v1';

// Initial Demilade Profile: ₦200,000 liquid capital
const INITIAL_PLAYER: PlayerProfile = {
  id: 'player_demilade',
  fullName: 'Demilade Michaels',
  age: 28,
  countryCode: 'NG',
  city: 'Lagos (Yaba / Victoria Island)',
  residencyStatus: 'citizen',
  primaryCurrency: 'NGN',
  jobTitle: 'Senior Operations Associate & Independent Broker',
  employerName: 'Mid-Market Logistics Ltd',
  quarterlySalaryMinor: majorToMinor(1_200_000, 'NGN'), // ₦1.2M/quarter (₦400k/month)
  quarterlyLivingExpensesMinor: majorToMinor(450_000, 'NGN'), // ₦450k/quarter (₦150k/month)
  dependentsCount: 1, // Elderly mother in Ibadan
  incomeEarnersCount: 1,
  employmentStability: 'variable_commission',
  riskAttitude: 'moderate',
  socialCapitalScore: 68,
  industrialistPrestige: 25,
};

// Starting Asset: ₦200,000 (20,000,000 kobo)
const INITIAL_ASSETS: AssetHolding[] = [
  {
    id: 'asset_zenith_savings',
    assetType: 'cash_savings',
    name: 'Zenith Bank High-Yield Savings Account',
    currencyCode: 'NGN',
    acquisitionCostMinor: majorToMinor(200_000, 'NGN'),
    currentValueMinor: majorToMinor(200_000, 'NGN'),
    countryCode: 'NG',
    expectedAnnualYieldPercent: 12.0,
    liquidityDays: 0,
    isLiquid: true,
    notes: 'Starting liquid capital reserve in Lagos.',
  },
];

// Comprehensive 5-Category Objectives
const INITIAL_OBJECTIVES: WealthObjective[] = [
  {
    id: 'obj_emergency_fund',
    category: 'capital_accumulation',
    name: 'Household Emergency & Shock Reserve (6 Months)',
    description: 'Liquid buffer covering 6 months of family living expenses and mother medical contingency.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(900_000, 'NGN'), // 6 x ₦150,000 = ₦900k
    currentAmountMinor: majorToMinor(200_000, 'NGN'),
    targetYear: 2026,
    priority: 'essential',
    status: 'funding',
    metadata: { monthsOfExpenses: 6 },
  },
  {
    id: 'obj_fx_hedge',
    category: 'wealth_protection',
    name: 'Foreign Currency Shield ($5,000 USD Domiciliary)',
    description: 'Insulate purchasing power from Naira parallel market depreciation into US Dollars.',
    currencyCode: 'USD',
    targetAmountMinor: majorToMinor(5_000, 'USD'), // $5,000 (~₦8.2M)
    currentAmountMinor: 0n,
    targetYear: 2027,
    priority: 'high',
    status: 'considering',
  },
  {
    id: 'obj_personal_risk_mgmt',
    category: 'personal_risk_mgmt',
    name: 'Protection against Personal Risks (Health, Disability & Property)',
    description: 'Personal risk management reserve protecting against medical expenses, breadwinner disability, custodial care needs, premature death continuity, and retained property/liability losses.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(5_000_000, 'NGN'),
    currentAmountMinor: majorToMinor(150_000, 'NGN'),
    targetYear: 2027,
    priority: 'essential',
    status: 'funding',
    metadata: {
      personalRiskType: 'medical_expenses',
      riskMitigationStrategy: 'hybrid_stop_loss',
      investmentPurpose: 'financial_security',
    },
  },
  {
    id: 'obj_lekki_land',
    category: 'capital_accumulation',
    name: 'Titled Land Acquisition (Ibeju-Lekki / Epe Corridor)',
    description: 'Purchase 600sqm plot with verified Certificate of Occupancy (C of O) before infrastructure boom.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(12_000_000, 'NGN'),
    currentAmountMinor: 0n,
    targetYear: 2028,
    priority: 'high',
    status: 'considering',
    metadata: { countryCode: 'NG' },
  },
  {
    id: 'obj_family_care',
    category: 'family_lifestyle',
    name: 'Mother Medical Care & Eldercare Allowance',
    description: 'Guaranteed quarterly health maintenance and personal stipend for mother in Ibadan.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(1_500_000, 'NGN'),
    currentAmountMinor: majorToMinor(100_000, 'NGN'),
    targetYear: 2026,
    priority: 'high',
    status: 'funding',
    metadata: { beneficiaryName: 'Mrs. Folake Michaels (Mother)' },
  },
  {
    id: 'obj_education_sister',
    category: 'family_lifestyle',
    name: 'Sister University Education Fund (Dunni Michaels)',
    description: 'Four-year degree tuition and living buffer at private university / Pan-Atlantic University.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(8_000_000, 'NGN'),
    currentAmountMinor: 0n,
    targetYear: 2028,
    priority: 'high',
    status: 'considering',
    metadata: { beneficiaryName: 'Dunni Michaels', institutionTier: 'nigerian_private' },
  },
  {
    id: 'obj_agro_business',
    category: 'capital_accumulation',
    name: 'Agro-Allied Processing Seed Capital (Titan Agro)',
    description: 'Launch cassava starch / grain aggregation SME with local sourcing advantage.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(6_000_000, 'NGN'),
    currentAmountMinor: 0n,
    targetYear: 2027,
    priority: 'medium',
    status: 'considering',
  },
  {
    id: 'obj_global_mobility',
    category: 'tax_mobility',
    name: 'Global Mobility & Second Residency (Dubai Golden Visa)',
    description: 'Secure AED 2M real estate or UK Global Talent visa for borderless capital movement and zero tax on foreign income.',
    currencyCode: 'AED',
    targetAmountMinor: majorToMinor(2_000_000, 'AED'), // ~₦900M long-term
    currentAmountMinor: 0n,
    targetYear: 2033,
    priority: 'aspirational',
    status: 'considering',
    metadata: { countryCode: 'AE' },
  },
  {
    id: 'obj_dynasty_trust',
    category: 'dynasty_philanthropy',
    name: 'Michaels Dynasty Trust & Pan-African Foundation',
    description: 'Irrevocable multi-generational trust preserving industrial equity with spendthrift protection and youth scholarships.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(150_000_000, 'NGN'),
    currentAmountMinor: 0n,
    targetYear: 2036,
    priority: 'aspirational',
    status: 'considering',
  },
  {
    id: 'obj_retirement_income',
    category: 'retirement_planning',
    name: 'Retirement Planning (Provision of Retirement Income)',
    description: 'Lifelong inflation-adjusted retirement income buffer designed to support living into the 80s, 90s, or beyond, with distributions resilient against market recessions and longevity risks.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(45_000_000, 'NGN'),
    currentAmountMinor: majorToMinor(500_000, 'NGN'),
    targetYear: 2045,
    priority: 'essential',
    status: 'funding',
    metadata: {
      retirementAge: 60,
      longevityHorizonAge: 90,
      annualIncomeTargetMinor: majorToMinor(3_600_000, 'NGN'),
      distributionStrategy: 'safe_withdrawal_4pct',
      investmentPurpose: 'financial_security',
      recessionDepletionStressTested: true,
    },
  },
  {
    id: 'obj_early_fire',
    category: 'retirement_planning',
    name: 'Early Retirement & FIRE (Retire Well Before 65)',
    description: 'Aggressive capital accumulation to achieve complete financial independence at age 48, generating secondary passive income from dividend equities and prime Lagos rental yields.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(35_000_000, 'NGN'),
    currentAmountMinor: 0n,
    targetYear: 2038,
    priority: 'high',
    status: 'considering',
    metadata: {
      retirementAge: 48,
      longevityHorizonAge: 92,
      distributionStrategy: 'bucket_strategy',
      investmentPurpose: 'retire_early',
      recessionDepletionStressTested: true,
    },
  },
  {
    id: 'obj_investment_mgmt',
    category: 'capital_accumulation',
    name: 'Investment & Property Management Fund',
    description: 'Professional multi-asset capital management mitigating economic volatility, UK/US market crashes, and local tax complexities via diversified property managers and sovereign bond allocations.',
    currencyCode: 'NGN',
    targetAmountMinor: majorToMinor(20_000_000, 'NGN'),
    currentAmountMinor: 0n,
    targetYear: 2030,
    priority: 'medium',
    status: 'considering',
    metadata: {
      investmentPurpose: 'second_income',
    },
  },
];

const INITIAL_PROPERTY_MANAGERS: PropertyManager[] = [
  {
    id: 'pm_segun_lagos',
    name: 'Segun Adebayo',
    firmName: 'Crown Point Realty Partners (Lekki Phase 1)',
    countryCode: 'NG',
    currencyCode: 'NGN',
    phone: '+234 803 555 0192',
    reliabilityScore: 8.8,
    managementFeePercent: 10,
    propertiesCount: 0,
    totalRemittedMinor: 0n,
    status: 'active',
  },
  {
    id: 'pm_charlotte_london',
    name: 'Charlotte Wright',
    firmName: 'Mayfair & Kensington Letting Management',
    countryCode: 'GB',
    currencyCode: 'GBP',
    phone: '+44 20 7946 0912',
    reliabilityScore: 9.4,
    managementFeePercent: 12,
    propertiesCount: 0,
    totalRemittedMinor: 0n,
    status: 'active',
  },
];

const INITIAL_AJO_CYCLES: AjoCycle[] = [
  {
    id: 'ajo_lagos_titans',
    name: 'Yaba Young Titans Ajo (10 Members)',
    totalMembers: 10,
    monthlyContributionMinor: majorToMinor(50_000, 'NGN'), // ₦50,000 / month = ₦150,000 / quarter
    currencyCode: 'NGN',
    cycleLengthMonths: 10,
    currentTurnMonth: 1,
    playerPayoutMonth: 4, // Collects lump sum of ₦500,000 in month 4 (Q2)!
    playerPaidSoFarMinor: 0n,
    status: 'active',
    organizerTrustScore: 9.2,
  },
];

const INITIAL_GOOGLE_SNAPSHOT: GoogleLiveMarketSnapshot = {
  lastFetchedAt: null,
  isLoading: false,
  sourceAttribution: 'Awaiting sync with Google Grounding',
  indices: {
    ftse100: { price: 8245.2, changePercent: 0.35 },
    ftse250: { price: 20890.5, changePercent: -0.15 },
    sp500: { price: 5864.7, changePercent: 0.42 },
    ngx30: { price: 3820.4, changePercent: 0.85 },
  },
  equities: [
    { ticker: 'DANGCEM', name: 'Dangote Cement', exchange: 'NGX', price: 650.0, currency: 'NGN', changePercent: 1.2 },
    { ticker: 'MTNN', name: 'MTN Nigeria', exchange: 'NGX', price: 175.5, currency: 'NGN', changePercent: -0.5 },
    { ticker: 'GTCO', name: 'Guaranty Trust Holding', exchange: 'NGX', price: 52.8, currency: 'NGN', changePercent: 2.1 },
    { ticker: 'SHEL', name: 'Shell Plc', exchange: 'LSE', price: 26.4, currency: 'GBP', changePercent: 0.4 },
  ],
  fx: {
    usdNgnOfficial: 1545.0,
    usdNgnParallel: 1650.0,
    gbpUsd: 1.285,
    eurUsd: 1.085,
    gbpNgnParallel: 2110.0,
  },
  commodities: {
    brentCrudeUsd: 78.4,
    goldUsdPerOz: 2655.0,
  },
  yields: {
    uk10YGilt: 4.22,
    us10YTreasury: 4.14,
    nigeria10YFgn: 18.5,
    bbbSpreadBps: 180,
  },
};

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<PlayerProfile>(INITIAL_PLAYER);
  const [fsrMetrics, setFsrMetrics] = useState<FinancialStabilityMetrics>(INITIAL_FSR_METRICS);
  const [objectives, setObjectives] = useState<WealthObjective[]>(INITIAL_OBJECTIVES);
  const [assets, setAssets] = useState<AssetHolding[]>(INITIAL_ASSETS);
  const [properties, setProperties] = useState<RealProperty[]>([]);
  const [propertyManagers, setPropertyManagers] = useState<PropertyManager[]>(INITIAL_PROPERTY_MANAGERS);
  const [remittances, setRemittances] = useState<PropertyRemittance[]>([]);
  const [ajoCycles, setAjoCycles] = useState<AjoCycle[]>(INITIAL_AJO_CYCLES);
  const [peerDeals, setPeerDeals] = useState<PeerCoInvestment[]>([]);
  const [businesses, setBusinesses] = useState<BusinessEnterprise[]>([]);
  const [dynastyTrusts, setDynastyTrusts] = useState<DynastyTrust[]>([]);
  const [historyLogs, setHistoryLogs] = useState<QuarterSettlementLog[]>([]);
  const [googleLiveSnapshot, setGoogleLiveSnapshot] = useState<GoogleLiveMarketSnapshot>(INITIAL_GOOGLE_SNAPSHOT);
  const [countries, setCountries] = useState<CountryModule[]>(COUNTRIES);

  // Load from LocalStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.player) setPlayer(parsed.player);
        if (parsed.fsrMetrics) setFsrMetrics(parsed.fsrMetrics);
        if (parsed.countries && Array.isArray(parsed.countries)) {
          // Restore bigints in visa pathways and baseline expenses
          setCountries(parsed.countries.map((c: any) => ({
            ...c,
            baselineQuarterlyExpensesMinor: BigInt(c.baselineQuarterlyExpensesMinor || '0'),
            visaPathways: (c.visaPathways || []).map((v: any) => ({
              ...v,
              costMinor: BigInt(v.costMinor || '0'),
              proofOfFundsMinor: BigInt(v.proofOfFundsMinor || '0'),
            })),
          })));
        }
        if (parsed.objectives) {
          // Restore bigints
          setObjectives(parsed.objectives.map((o: any) => ({
            ...o,
            targetAmountMinor: BigInt(o.targetAmountMinor),
            currentAmountMinor: BigInt(o.currentAmountMinor),
          })));
        }
        if (parsed.assets) {
          setAssets(parsed.assets.map((a: any) => ({
            ...a,
            acquisitionCostMinor: BigInt(a.acquisitionCostMinor),
            currentValueMinor: BigInt(a.currentValueMinor),
          })));
        }
        if (parsed.properties) {
          setProperties(parsed.properties.map((p: any) => ({
            ...p,
            acquisitionCostMinor: BigInt(p.acquisitionCostMinor),
            currentMarketValueMinor: BigInt(p.currentMarketValueMinor),
            quarterlyRentalGrossMinor: BigInt(p.quarterlyRentalGrossMinor),
            quarterlyOperatingExpensesMinor: BigInt(p.quarterlyOperatingExpensesMinor),
          })));
        }
        if (parsed.remittances) {
          setRemittances(parsed.remittances.map((r: any) => ({
            ...r,
            grossAmountMinor: BigInt(r.grossAmountMinor),
            managementFeeMinor: BigInt(r.managementFeeMinor),
            maintenanceDeductionsMinor: BigInt(r.maintenanceDeductionsMinor),
            netRemittedMinor: BigInt(r.netRemittedMinor),
          })));
        }
        if (parsed.ajoCycles) {
          setAjoCycles(parsed.ajoCycles.map((c: any) => ({
            ...c,
            monthlyContributionMinor: BigInt(c.monthlyContributionMinor),
            playerPaidSoFarMinor: BigInt(c.playerPaidSoFarMinor),
          })));
        }
        if (parsed.businesses) {
          setBusinesses(parsed.businesses.map((b: any) => ({
            ...b,
            valuationMinor: BigInt(b.valuationMinor),
            quarterlyRevenueMinor: BigInt(b.quarterlyRevenueMinor),
            quarterlyProfitMinor: BigInt(b.quarterlyProfitMinor),
            quarterlyDistributionToPlayerMinor: BigInt(b.quarterlyDistributionToPlayerMinor),
          })));
        }
        if (parsed.historyLogs) {
          setHistoryLogs(parsed.historyLogs.map((h: any) => ({
            ...h,
            totalIncomeMinor: BigInt(h.totalIncomeMinor),
            totalExpensesMinor: BigInt(h.totalExpensesMinor),
            investmentReturnsMinor: BigInt(h.investmentReturnsMinor),
          })));
        }
      }
    } catch (e) {
      console.error('Failed to hydrate state from local storage:', e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      const serialized = {
        player,
        fsrMetrics,
        objectives: objectives.map((o) => ({
          ...o,
          targetAmountMinor: o.targetAmountMinor.toString(),
          currentAmountMinor: o.currentAmountMinor.toString(),
        })),
        assets: assets.map((a) => ({
          ...a,
          acquisitionCostMinor: a.acquisitionCostMinor.toString(),
          currentValueMinor: a.currentValueMinor.toString(),
        })),
        properties: properties.map((p) => ({
          ...p,
          acquisitionCostMinor: p.acquisitionCostMinor.toString(),
          currentMarketValueMinor: p.currentMarketValueMinor.toString(),
          quarterlyRentalGrossMinor: p.quarterlyRentalGrossMinor.toString(),
          quarterlyOperatingExpensesMinor: p.quarterlyOperatingExpensesMinor.toString(),
        })),
        remittances: remittances.map((r) => ({
          ...r,
          grossAmountMinor: r.grossAmountMinor.toString(),
          managementFeeMinor: r.managementFeeMinor.toString(),
          maintenanceDeductionsMinor: r.maintenanceDeductionsMinor.toString(),
          netRemittedMinor: r.netRemittedMinor.toString(),
        })),
        ajoCycles: ajoCycles.map((c) => ({
          ...c,
          monthlyContributionMinor: c.monthlyContributionMinor.toString(),
          playerPaidSoFarMinor: c.playerPaidSoFarMinor.toString(),
        })),
        businesses: businesses.map((b) => ({
          ...b,
          valuationMinor: b.valuationMinor.toString(),
          quarterlyRevenueMinor: b.quarterlyRevenueMinor.toString(),
          quarterlyProfitMinor: b.quarterlyProfitMinor.toString(),
          quarterlyDistributionToPlayerMinor: b.quarterlyDistributionToPlayerMinor.toString(),
        })),
        historyLogs: historyLogs.map((h) => ({
          ...h,
          totalIncomeMinor: h.totalIncomeMinor.toString(),
          totalExpensesMinor: h.totalExpensesMinor.toString(),
          investmentReturnsMinor: h.investmentReturnsMinor.toString(),
        })),
        countries: countries.map((c) => ({
          ...c,
          baselineQuarterlyExpensesMinor: c.baselineQuarterlyExpensesMinor.toString(),
          visaPathways: c.visaPathways.map((v) => ({
            ...v,
            costMinor: v.costMinor.toString(),
            proofOfFundsMinor: v.proofOfFundsMinor.toString(),
          })),
        })),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serialized));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [player, fsrMetrics, objectives, assets, properties, remittances, ajoCycles, businesses, historyLogs, countries]);

  // Compute FX Rates Matrix relative to USD
  const usdExchangeRates: Record<CurrencyCode, number> = {
    USD: 1.0,
    NGN: fsrMetrics.usdNgnParallel, // Parallel market reflects true frontier purchasing power
    GBP: fsrMetrics.gbpUsd,
    EUR: fsrMetrics.eurUsd,
    CAD: 1.38,
    AUD: 1.52,
    AED: 3.6725,
    ZAR: 18.2,
    KES: 130.0,
    JPY: 152.0,
    CHF: 0.88,
    CNY: 7.25,
    SGD: 1.32,
    GHS: 15.8,
    RWF: 1380.0,
    EGP: 48.5,
    MAD: 9.8,
    XOF: 605.0,
    ETB: 120.0,
    AOA: 920.0,
    MXN: 19.8,
    BRL: 5.65,
    ARS: 1020.0,
    CLP: 940.0,
    SAR: 3.75,
    QAR: 3.64,
    KRW: 1380.0,
    IDR: 15600.0,
    NZD: 1.68,
    INR: 84.0,
    NOK: 10.9,
  };

  // Compute Total Net Worth in Naira (NGN)
  let totalNetWorthNaira = 0;
  for (const asset of assets) {
    const valNairaMinor = convertCurrencyMinor(asset.currentValueMinor, asset.currencyCode, 'NGN', usdExchangeRates);
    totalNetWorthNaira += minorToMajor(valNairaMinor, 'NGN');
  }
  for (const prop of properties) {
    const propNairaMinor = convertCurrencyMinor(prop.currentMarketValueMinor, prop.currencyCode, 'NGN', usdExchangeRates);
    totalNetWorthNaira += minorToMajor(propNairaMinor, 'NGN');
  }
  for (const biz of businesses) {
    const bizNairaMinor = convertCurrencyMinor(
      (biz.valuationMinor * BigInt(biz.ownershipPercent)) / 100n,
      biz.currencyCode,
      'NGN',
      usdExchangeRates
    );
    totalNetWorthNaira += minorToMajor(bizNairaMinor, 'NGN');
  }

  const totalNetWorthUSD = totalNetWorthNaira / (fsrMetrics.usdNgnParallel || 1650);

  // Compute Emergency Fund Months of Living Expenses
  const liquidCashAsset = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency);
  const liquidCashMajor = liquidCashAsset ? minorToMajor(liquidCashAsset.currentValueMinor, player.primaryCurrency) : 0;
  const monthlyLivingExpensesMajor = minorToMajor(player.quarterlyLivingExpensesMinor, player.primaryCurrency) / 3;
  const emergencyFundMonths = monthlyLivingExpensesMajor > 0 ? Number((liquidCashMajor / monthlyLivingExpensesMajor).toFixed(1)) : 0;

  // Advance Simulation by 1 Quarter
  const advanceQuarter = (): QuarterSettlementLog => {
    const currentQ = fsrMetrics.quarterNumber;
    const currentYear = fsrMetrics.year;
    const nextQ = (currentQ % 4 + 1) as 1 | 2 | 3 | 4;
    const nextYear = currentQ === 4 ? currentYear + 1 : currentYear;
    const quarterLabel = `Q${nextQ} ${nextYear}`;

    const startingNaira = totalNetWorthNaira;

    // Macro shocks generator based on real-world Nigerian & global dynamics
    const macroEvents = [
      {
        title: 'Central Bank Rate Policy Hike',
        desc: 'Monetary Policy Committee hikes policy rate by 100bps to curb headline inflation. Treasury bill yields rise, but corporate borrowing costs elevate.',
        fxShift: 1.02,
        inflationDelta: -0.4,
        giltShift: 0.15,
        spreadDelta: 20,
      },
      {
        title: 'Brent Crude Oil Rally & FX Influx',
        desc: 'Global energy demand and OPEC quota compliance push Brent crude to $84/bbl, lifting Nigeria foreign reserves and firming the official NAFEM window.',
        fxShift: 0.98,
        inflationDelta: -0.2,
        giltShift: -0.1,
        spreadDelta: -15,
      },
      {
        title: 'Fuel Subsidy & Transport Shock',
        desc: 'PMS refinery maintenance and distribution logistics trigger sudden fuel price adjustments, accelerating consumer living expenses.',
        fxShift: 1.04,
        inflationDelta: 1.8,
        giltShift: 0.2,
        spreadDelta: 35,
      },
      {
        title: 'UK & Global Central Bank Pivot',
        desc: 'Bank of England and US Fed signal coordinated rate cuts as core inflation settles. Sterling gains against USD, narrowing emerging market sovereign spreads.',
        fxShift: 0.99,
        inflationDelta: -0.5,
        giltShift: -0.25,
        spreadDelta: -25,
      },
      {
        title: 'Commercial Paper Market Liquidity Freeze',
        desc: 'A spike in defaults among retail conglomerates causes money market fund managers to demand higher risk premiums on short-term debt instruments.',
        fxShift: 1.01,
        inflationDelta: 0.3,
        giltShift: 0.1,
        spreadDelta: 45,
      },
    ];

    const randomEvent = macroEvents[Math.floor(Math.random() * macroEvents.length)];

    // Update FSR Metrics
    const updatedMetrics: FinancialStabilityMetrics = {
      ...fsrMetrics,
      quarter: quarterLabel,
      year: nextYear,
      quarterNumber: nextQ,
      usdNgnParallel: Math.round(fsrMetrics.usdNgnParallel * randomEvent.fxShift),
      usdNgnOfficial: Math.round(fsrMetrics.usdNgnOfficial * (randomEvent.fxShift * 0.99)),
      uk10YGiltYield: Number((fsrMetrics.uk10YGiltYield + randomEvent.giltShift).toFixed(2)),
      bbbCorporateCreditSpreadBps: Math.max(120, Math.min(320, fsrMetrics.bbbCorporateCreditSpreadBps + randomEvent.spreadDelta)),
      nigeriaInflationRate: Number((fsrMetrics.nigeriaInflationRate + randomEvent.inflationDelta).toFixed(1)),
      brentCrudeUsd: Number((fsrMetrics.brentCrudeUsd * (1 + (Math.random() * 0.08 - 0.04))).toFixed(1)),
    };
    setFsrMetrics(updatedMetrics);

    // Calculate Cash Flow Settlements for the Quarter
    let totalQuarterIncomeMinor = player.quarterlySalaryMinor;
    let totalQuarterExpensesMinor = player.quarterlyLivingExpensesMinor;
    let totalInvestmentReturnsMinor = 0n;

    // Rental Remittances from Properties
    const updatedProperties = properties.map((prop) => {
      if (prop.isIncomeProducing && prop.assignedManagerId) {
        const grossRent = prop.quarterlyRentalGrossMinor;
        const manager = propertyManagers.find((m) => m.id === prop.assignedManagerId);
        const feePercent = manager ? manager.managementFeePercent : 10;
        const managementFee = (grossRent * BigInt(feePercent)) / 100n;
        const maintenance = prop.quarterlyOperatingExpensesMinor;
        const netRemitted = grossRent - managementFee - maintenance;

        // Create remittance record
        const newRemittance: PropertyRemittance = {
          id: `remit_${Date.now()}_${prop.id}`,
          propertyId: prop.id,
          managerId: prop.assignedManagerId,
          quarter: quarterLabel,
          grossAmountMinor: grossRent,
          managementFeeMinor: managementFee,
          maintenanceDeductionsMinor: maintenance,
          netRemittedMinor: netRemitted,
          currencyCode: prop.currencyCode,
          status: 'pending_approval',
          paymentReference: `REMIT-${nextYear}-${nextQ}-${prop.id.substring(0, 4).toUpperCase()}`,
        };
        setRemittances((prev) => [newRemittance, ...prev]);

        // Remittance income in player primary currency
        const remittedInPlayerCurr = convertCurrencyMinor(netRemitted, prop.currencyCode, player.primaryCurrency, usdExchangeRates);
        totalQuarterIncomeMinor += remittedInPlayerCurr;
      }
      return prop;
    });
    setProperties(updatedProperties);

    // Distributions from Businesses
    for (const biz of businesses) {
      if (biz.quarterlyDistributionToPlayerMinor > 0n) {
        const distInPlayerCurr = convertCurrencyMinor(
          biz.quarterlyDistributionToPlayerMinor,
          biz.currencyCode,
          player.primaryCurrency,
          usdExchangeRates
        );
        totalQuarterIncomeMinor += distInPlayerCurr;
      }
    }

    // Ajo Rotational Contributions & Payouts
    const updatedAjo = ajoCycles.map((cycle) => {
      const quarterCost = cycle.monthlyContributionMinor * 3n;
      totalQuarterExpensesMinor += quarterCost;
      const updatedCycle = { ...cycle };
      updatedCycle.currentTurnMonth = (cycle.currentTurnMonth + 3) % cycle.cycleLengthMonths || cycle.cycleLengthMonths;
      updatedCycle.playerPaidSoFarMinor += quarterCost;

      // Check if player receives lump sum this quarter
      const turnStart = cycle.currentTurnMonth;
      const turnEnd = turnStart + 2;
      if (cycle.playerPayoutMonth >= turnStart && cycle.playerPayoutMonth <= turnEnd) {
        const lumpSumPayout = cycle.monthlyContributionMinor * BigInt(cycle.totalMembers);
        totalQuarterIncomeMinor += lumpSumPayout;
      }
      return updatedCycle;
    });
    setAjoCycles(updatedAjo);

    // Update Asset Yields & Returns
    const updatedAssets = assets.map((asset) => {
      // Annual yield / 4 = quarterly return
      const quarterlyRate = asset.expectedAnnualYieldPercent / 100 / 4;
      let returnMinor = 0n;
      if (asset.assetType === 'cbn_treasury_bills' || asset.assetType === 'cash_savings') {
        returnMinor = majorToMinor(minorToMajor(asset.currentValueMinor, asset.currencyCode) * quarterlyRate, asset.currencyCode);
      } else if (asset.assetType === 'equities_defensive' || asset.assetType === 'equities_cyclical' || asset.assetType === 'equities_tech_growth') {
        // Equity price fluctuation with dividend
        const marketDelta = (Math.random() * 0.12 - 0.05);
        const dividend = quarterlyRate * 0.5;
        const totalReturn = marketDelta + dividend;
        returnMinor = majorToMinor(minorToMajor(asset.currentValueMinor, asset.currencyCode) * totalReturn, asset.currencyCode);
      }

      totalInvestmentReturnsMinor += convertCurrencyMinor(returnMinor, asset.currencyCode, player.primaryCurrency, usdExchangeRates);
      return {
        ...asset,
        currentValueMinor: asset.currentValueMinor + returnMinor,
      };
    });

    // Net Cash Flow for the Quarter added to Primary Liquid Cash Account
    const netCashFlowMinor = totalQuarterIncomeMinor - totalQuarterExpensesMinor;
    const finalAssets = updatedAssets.map((asset) => {
      if (asset.assetType === 'cash_savings' && asset.currencyCode === player.primaryCurrency) {
        return {
          ...asset,
          currentValueMinor: asset.currentValueMinor + netCashFlowMinor,
        };
      }
      return asset;
    });
    setAssets(finalAssets);

    // Update Emergency Fund Objective Progress
    const newLiquidNairaMinor = finalAssets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency)?.currentValueMinor || 0n;
    setObjectives((prev) =>
      prev.map((obj) => {
        if (obj.id === 'obj_emergency_fund') {
          return {
            ...obj,
            currentAmountMinor: newLiquidNairaMinor > obj.targetAmountMinor ? obj.targetAmountMinor : newLiquidNairaMinor,
            status: newLiquidNairaMinor >= obj.targetAmountMinor ? 'achieved' : 'funding',
          };
        }
        return obj;
      })
    );

    const endingNaira = startingNaira + minorToMajor(netCashFlowMinor + totalInvestmentReturnsMinor, player.primaryCurrency);
    const inflationDragNaira = Math.round(startingNaira * (updatedMetrics.nigeriaInflationRate / 100 / 4));

    const log: QuarterSettlementLog = {
      quarter: quarterLabel,
      year: nextYear,
      quarterNumber: nextQ,
      countryCode: player.countryCode,
      startingNetWorthNaira: Math.round(startingNaira),
      endingNetWorthNaira: Math.round(endingNaira),
      totalIncomeMinor: totalQuarterIncomeMinor,
      totalExpensesMinor: totalQuarterExpensesMinor,
      investmentReturnsMinor: totalInvestmentReturnsMinor,
      inflationDragNaira,
      fxGainLossNaira: 0,
      majorEventTitle: randomEvent.title,
      majorEventDescription: randomEvent.desc,
    };

    setHistoryLogs((prev) => [log, ...prev]);
    return log;
  };

  // Add a new Objective
  const addObjective = (newObj: Omit<WealthObjective, 'id' | 'currentAmountMinor'>) => {
    const created: WealthObjective = {
      ...newObj,
      id: `obj_${Date.now()}`,
      currentAmountMinor: 0n,
    };
    setObjectives((prev) => [created, ...prev]);
  };

  // Allocate funds from liquid cash into an objective
  const allocateToObjective = (objectiveId: string, amountMinor: bigint): boolean => {
    const liquidAsset = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency);
    if (!liquidAsset || liquidAsset.currentValueMinor < amountMinor) {
      return false;
    }

    // Deduct from liquid cash
    setAssets((prev) =>
      prev.map((a) => (a.id === liquidAsset.id ? { ...a, currentValueMinor: a.currentValueMinor - amountMinor } : a))
    );

    // Add to objective
    setObjectives((prev) =>
      prev.map((obj) => {
        if (obj.id === objectiveId) {
          const updatedCurrent = obj.currentAmountMinor + amountMinor;
          return {
            ...obj,
            currentAmountMinor: updatedCurrent,
            status: updatedCurrent >= obj.targetAmountMinor ? 'achieved' : 'funding',
          };
        }
        return obj;
      })
    );

    return true;
  };

  // Buy an Asset
  const buyAsset = (newAsset: Omit<AssetHolding, 'id'>): boolean => {
    const costInPlayerCurr = convertCurrencyMinor(newAsset.acquisitionCostMinor, newAsset.currencyCode, player.primaryCurrency, usdExchangeRates);
    const liquidAsset = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency);

    if (!liquidAsset || liquidAsset.currentValueMinor < costInPlayerCurr) {
      return false;
    }

    // Deduct cash
    setAssets((prev) => [
      ...prev.map((a) => (a.id === liquidAsset.id ? { ...a, currentValueMinor: a.currentValueMinor - costInPlayerCurr } : a)),
      {
        ...newAsset,
        id: `asset_${Date.now()}`,
      },
    ]);

    return true;
  };

  // Sell an Asset
  const sellAsset = (assetId: string) => {
    const target = assets.find((a) => a.id === assetId);
    if (!target) return;

    const proceedInPlayerCurr = convertCurrencyMinor(target.currentValueMinor, target.currencyCode, player.primaryCurrency, usdExchangeRates);
    setAssets((prev) => [
      ...prev
        .filter((a) => a.id !== assetId)
        .map((a) =>
          a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency
            ? { ...a, currentValueMinor: a.currentValueMinor + proceedInPlayerCurr }
            : a
        ),
    ]);
  };

  // Approve a rental remittance from a property manager
  const approveRemittance = (remittanceId: string) => {
    setRemittances((prev) =>
      prev.map((r) => {
        if (r.id === remittanceId) {
          // Deposit net remitted to player cash
          const netInPlayerCurr = convertCurrencyMinor(r.netRemittedMinor, r.currencyCode, player.primaryCurrency, usdExchangeRates);
          setAssets((prevAssets) =>
            prevAssets.map((a) =>
              a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency
                ? { ...a, currentValueMinor: a.currentValueMinor + netInPlayerCurr }
                : a
            )
          );
          return { ...r, status: 'approved' };
        }
        return r;
      })
    );
  };

  // Join an Ajo Cycle
  const joinAjoCycle = (cycle: Omit<AjoCycle, 'id' | 'currentTurnMonth' | 'playerPaidSoFarMinor'>) => {
    const created: AjoCycle = {
      ...cycle,
      id: `ajo_${Date.now()}`,
      currentTurnMonth: 1,
      playerPaidSoFarMinor: 0n,
    };
    setAjoCycles((prev) => [...prev, created]);
  };

  // Relocate to another country
  const relocateToCountry = (targetCountryCode: string, visaId: string): { success: boolean; message: string } => {
    const country = countries.find((c) => c.countryCode === targetCountryCode);
    if (!country) return { success: false, message: 'Country not found' };

    const visa = country.visaPathways.find((v) => v.id === visaId);
    if (!visa) return { success: false, message: 'Visa pathway not found' };

    // Check proof of funds & visa cost
    const costInPlayerCurr = convertCurrencyMinor(visa.costMinor, visa.currencyCode, player.primaryCurrency, usdExchangeRates);
    const proofInPlayerCurr = convertCurrencyMinor(visa.proofOfFundsMinor, visa.currencyCode, player.primaryCurrency, usdExchangeRates);

    const liquidCash = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency)?.currentValueMinor || 0n;

    if (liquidCash < costInPlayerCurr + proofInPlayerCurr) {
      return {
        success: false,
        message: `Insufficient funds. Required fee + proof of funds: ${visa.currencyCode} ${minorToMajor(visa.costMinor + visa.proofOfFundsMinor, visa.currencyCode).toLocaleString()}`,
      };
    }

    // Deduct visa fee
    setAssets((prev) =>
      prev.map((a) =>
        a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency
          ? { ...a, currentValueMinor: a.currentValueMinor - costInPlayerCurr }
          : a
      )
    );

    // Switch player country, currency, and expenses
    setPlayer((prev) => ({
      ...prev,
      countryCode: targetCountryCode,
      city: country.capitalCity,
      primaryCurrency: country.currencyCode,
      quarterlyLivingExpensesMinor: country.baselineQuarterlyExpensesMinor,
      residencyStatus: visa.id.includes('golden') ? 'golden_visa' : 'work_visa',
      industrialistPrestige: prev.industrialistPrestige + 15,
    }));

    return {
      success: true,
      message: `Relocation successful to ${country.countryName}! Switched primary financial ledger to ${country.currencyCode}.`,
    };
  };

  // Granular Country Management Actions
  const updateCountry = (countryCode: string, updates: Partial<CountryModule>) => {
    setCountries((prev) =>
      prev.map((c) => {
        if (c.countryCode === countryCode) {
          return {
            ...c,
            ...updates,
            leader: updates.leader ? { ...c.leader, ...updates.leader } : c.leader,
            governance: updates.governance ? { ...c.governance, ...updates.governance } : c.governance,
            macro: updates.macro ? { ...c.macro, ...updates.macro } : c.macro,
            taxRegime: updates.taxRegime ? { ...c.taxRegime, ...updates.taxRegime } : c.taxRegime,
          };
        }
        return c;
      })
    );
  };

  const addCountry = (newCountry: CountryModule) => {
    setCountries((prev) => {
      const exists = prev.some((c) => c.countryCode.toUpperCase() === newCountry.countryCode.toUpperCase());
      if (exists) {
        return prev.map((c) => (c.countryCode.toUpperCase() === newCountry.countryCode.toUpperCase() ? newCountry : c));
      }
      return [...prev, newCountry];
    });
  };

  const resetCountriesToDefaults = () => {
    setCountries(COUNTRIES);
  };

  // Fetch Live Real-Time Market Data via Google Search Grounding API
  const fetchGoogleLiveMarket = async () => {
    setGoogleLiveSnapshot((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch('/api/market-data/realtime');
      if (!res.ok) throw new Error('API fetch failed');
      const data = await res.json();
      setGoogleLiveSnapshot({
        lastFetchedAt: data.lastFetchedAt || new Date().toISOString(),
        isLoading: false,
        sourceAttribution: data.sourceAttribution || 'Google Real-Time Search Grounding',
        indices: data.indices || googleLiveSnapshot.indices,
        equities: data.equities || googleLiveSnapshot.equities,
        fx: data.fx || googleLiveSnapshot.fx,
        commodities: data.commodities || googleLiveSnapshot.commodities,
        yields: data.yields || googleLiveSnapshot.yields,
      });
    } catch (e) {
      console.warn('Using existing snapshot, error fetching live:', e);
      setGoogleLiveSnapshot((prev) => ({
        ...prev,
        isLoading: false,
        lastFetchedAt: new Date().toISOString(),
      }));
    }
  };

  // Sync Google live data with simulation state
  const syncGoogleWithSimulation = () => {
    if (!googleLiveSnapshot.fx) return;
    setFsrMetrics((prev) => ({
      ...prev,
      usdNgnOfficial: googleLiveSnapshot.fx.usdNgnOfficial || prev.usdNgnOfficial,
      usdNgnParallel: googleLiveSnapshot.fx.usdNgnParallel || prev.usdNgnParallel,
      gbpUsd: googleLiveSnapshot.fx.gbpUsd || prev.gbpUsd,
      eurUsd: googleLiveSnapshot.fx.eurUsd || prev.eurUsd,
      brentCrudeUsd: googleLiveSnapshot.commodities.brentCrudeUsd || prev.brentCrudeUsd,
      goldUsdPerOz: googleLiveSnapshot.commodities.goldUsdPerOz || prev.goldUsdPerOz,
      uk10YGiltYield: googleLiveSnapshot.yields.uk10YGilt || prev.uk10YGiltYield,
      us10YTreasuryYield: googleLiveSnapshot.yields.us10YTreasury || prev.us10YTreasuryYield,
    }));
  };

  // Reset simulation to Demilade's starting profile
  const resetSimulation = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPlayer(INITIAL_PLAYER);
    setFsrMetrics(INITIAL_FSR_METRICS);
    setObjectives(INITIAL_OBJECTIVES);
    setAssets(INITIAL_ASSETS);
    setProperties([]);
    setPropertyManagers(INITIAL_PROPERTY_MANAGERS);
    setRemittances([]);
    setAjoCycles(INITIAL_AJO_CYCLES);
    setPeerDeals([]);
    setBusinesses([]);
    setDynastyTrusts([]);
    setHistoryLogs([]);
    setCountries(COUNTRIES);
  };

  return (
    <SimulationContext.Provider
      value={{
        player,
        fsrMetrics,
        objectives,
        assets,
        properties,
        propertyManagers,
        remittances,
        ajoCycles,
        peerDeals,
        businesses,
        dynastyTrusts,
        historyLogs,
        googleLiveSnapshot,
        countries,
        totalNetWorthNaira,
        totalNetWorthUSD,
        emergencyFundMonths,
        advanceQuarter,
        addObjective,
        allocateToObjective,
        buyAsset,
        sellAsset,
        approveRemittance,
        joinAjoCycle,
        relocateToCountry,
        updateCountry,
        addCountry,
        resetCountriesToDefaults,
        fetchGoogleLiveMarket,
        syncGoogleWithSimulation,
        resetSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
