/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Supported ISO Currency Codes
export type CurrencyCode =
  | 'NGN' | 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'AED' | 'ZAR' | 'KES'
  | 'JPY' | 'CHF' | 'CNY' | 'SGD' | 'GHS' | 'RWF'
  | 'EGP' | 'MAD' | 'XOF' | 'ETB' | 'AOA' | 'MXN' | 'BRL' | 'ARS' | 'CLP'
  | 'SAR' | 'QAR' | 'KRW' | 'IDR' | 'NZD' | 'INR' | 'NOK';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  minorExponent: number; // e.g. 2 for NGN/USD (kobo/cents), 0 for JPY
}

// Core Taxonomy of Private Wealth Objectives
export type ObjectiveCategory =
  | 'capital_accumulation'
  | 'personal_risk_mgmt'
  | 'retirement_planning'
  | 'wealth_protection'
  | 'family_lifestyle'
  | 'tax_mobility'
  | 'dynasty_philanthropy';

export type ObjectivePriority = 'essential' | 'high' | 'medium' | 'aspirational';
export type ObjectiveStatus = 'considering' | 'funding' | 'achieved' | 'deferred';

export interface WealthObjective {
  id: string;
  category: ObjectiveCategory;
  name: string;
  description: string;
  currencyCode: CurrencyCode;
  targetAmountMinor: bigint;
  currentAmountMinor: bigint;
  targetYear: number;
  priority: ObjectivePriority;
  status: ObjectiveStatus;
  // Specific metadata fields
  metadata?: {
    monthsOfExpenses?: number; // For Emergency Fund
    beneficiaryName?: string;  // For Education or Family
    institutionTier?: 'nigerian_public' | 'nigerian_private' | 'overseas_uk' | 'overseas_us';
    countryCode?: string;       // For Golden Visa / Relocation / Real Estate
    cashFlowTargetQuarterlyMinor?: bigint; // For Passive Income / Second Income
    fireAnnualExpenseMinor?: bigint;       // For FIRE
    // Retirement Planning & Provision of Retirement Income metadata
    retirementAge?: number;
    longevityHorizonAge?: number; // e.g. 85, 90, 95, or beyond
    annualIncomeTargetMinor?: bigint;
    distributionStrategy?: 'safe_withdrawal_4pct' | 'annuity_guaranteed' | 'cashflow_dividend_rental' | 'bucket_strategy';
    investmentPurpose?: 'standard_of_living' | 'second_income' | 'financial_security' | 'retire_early' | 'grandchildren_legacy' | 'enjoy_investing';
    recessionDepletionStressTested?: boolean;
    // Personal Risk Management (Protection against Personal Risks)
    personalRiskType?: 'medical_expenses' | 'disability_income' | 'custodial_care' | 'premature_death' | 'property_liability_losses';
    riskMitigationStrategy?: 'insurance_transfer' | 'retained_loss_reserve' | 'hybrid_stop_loss';
    coverageAmountMinor?: bigint;
    deductibleMinor?: bigint;
  };
}

// Player Career & Identity
export type RiskAttitude = 'conservative' | 'moderate' | 'aggressive' | 'contrarian';
export type EmploymentStability = 'stable_salaried' | 'variable_commission' | 'entrepreneur' | 'executive';

export interface PlayerProfile {
  id: string;
  fullName: string;
  age: number;
  countryCode: string; // ISO 2-letter (e.g. 'NG', 'GB', 'US')
  city: string;
  residencyStatus: 'citizen' | 'work_visa' | 'permanent_resident' | 'golden_visa';
  primaryCurrency: CurrencyCode;
  jobTitle: string;
  employerName: string;
  quarterlySalaryMinor: bigint;
  quarterlyLivingExpensesMinor: bigint;
  dependentsCount: number;
  incomeEarnersCount: number;
  employmentStability: EmploymentStability;
  riskAttitude: RiskAttitude;
  socialCapitalScore: number; // 0 - 100
  industrialistPrestige: number; // 0 - 100
}

// Financial Stability Report (UK FSR 2019-2024 inspired) & Global Market Metrics
export interface FinancialStabilityMetrics {
  quarter: string; // e.g. 'Q1 2026'
  year: number;
  quarterNumber: 1 | 2 | 3 | 4;
  // Sovereign 10Y Yields (%)
  uk10YGiltYield: number;
  us10YTreasuryYield: number;
  nigeria10YFgnYield: number;
  // Credit Spreads (Basis Points)
  bbbCorporateCreditSpreadBps: number; // 120bps normal, 300bps stress
  highYieldSpreadBps: number;
  // Money Market & Liquidity
  soniaRatePercent: number;
  cbnMprRatePercent: number; // Central Bank of Nigeria MPR
  fedFundsRatePercent: number;
  boeBaseRatePercent: number;
  commercialPaperHealthIndex: number; // 0 (frozen) - 100 (abundant)
  moneyMarketLiquidityIndex: number;  // 0 (illiquid) - 100 (deep)
  // Commodities & FX
  brentCrudeUsd: number;
  goldUsdPerOz: number;
  usdNgnOfficial: number;
  usdNgnParallel: number; // Black market street rate
  gbpUsd: number;
  eurUsd: number;
  // Domestic Nigerian & UK Inflation
  nigeriaInflationRate: number; // e.g. 31.8%
  ukInflationRate: number;      // e.g. 3.4%
  usInflationRate: number;      // e.g. 2.9%
  marketSentiment: 'bearish_panic' | 'cautious_contraction' | 'neutral' | 'expansion_bull' | 'speculative_froth';
}

// Real-Time Google Grounding Snapshot
export interface GoogleLiveMarketSnapshot {
  lastFetchedAt: string | null;
  isLoading: boolean;
  sourceAttribution: string;
  indices: {
    ftse100: { price: number; changePercent: number };
    ftse250: { price: number; changePercent: number };
    sp500: { price: number; changePercent: number };
    ngx30: { price: number; changePercent: number };
  };
  equities: Array<{
    ticker: string;
    name: string;
    exchange: string;
    price: number;
    currency: CurrencyCode;
    changePercent: number;
  }>;
  fx: {
    usdNgnOfficial: number;
    usdNgnParallel: number;
    gbpUsd: number;
    eurUsd: number;
    gbpNgnParallel: number;
  };
  commodities: {
    brentCrudeUsd: number;
    goldUsdPerOz: number;
  };
  yields: {
    uk10YGilt: number;
    us10YTreasury: number;
    nigeria10YFgn: number;
    bbbSpreadBps: number;
  };
}

// Continents & Countries
export type ContinentCode = 'AF' | 'EU' | 'NA' | 'AS' | 'SA' | 'OC';

export interface CountryLeader {
  headOfState: string;
  headOfGovernment?: string;
  title: string;
  inOfficeSince: number; // year
  partyOrCoalition?: string;
}

export interface GovernanceProfile {
  governmentType: string;
  electionCycleYears: number; // e.g. 4 or 5
  nextElectionYear: number;
  lastElectionYear: number;
  politicalStabilityIndex: number; // 0 - 100
  ruleOfLawIndex: number;          // 0 - 100
  easeOfDoingBusinessScore: number;// 0 - 100
  corruptionPerceptionIndex: number; // 0 (high corruption) - 100 (clean)
  majorPoliticalRisks: string[];
}

export interface MacroeconomicStructure {
  gdpNominalUsdBillions: number;
  populationMillions: number;
  primaryExports: string[];
  fxRegime: 'Free Floating' | 'Managed Float' | 'Currency Board / Pegged' | 'Crawling Peg';
  sovereignDebtToGdpPercent: number;
}

export interface CountryModule {
  countryCode: string; // ISO 'NG', 'GB', 'US', 'AE', etc.
  countryName: string;
  continentCode: ContinentCode;
  currencyCode: CurrencyCode;
  capitalCity: string;
  sovereignRating: string; // 'B-', 'AA', 'AAA', etc.
  costOfLivingIndex: number; // vs Nigeria baseline 100
  baselineQuarterlyExpensesMinor: bigint;
  capitalControlsActive: boolean;
  maxMonthlyCardFxLimitUsd: number;
  wireTransferTaxPercent: number;
  // Granular Governance & Political Structure
  leader: CountryLeader;
  governance: GovernanceProfile;
  macro: MacroeconomicStructure;
  visaPathways: Array<{
    id: string;
    name: string;
    description: string;
    costMinor: bigint;
    currencyCode: CurrencyCode;
    proofOfFundsMinor: bigint;
    processingQuarters: number;
    qualifications: string;
  }>;
  taxRegime: {
    incomeTaxTopRate: number;
    corporateTaxRate: number;
    capitalGainsTaxRate: number;
    worldwideTaxation: boolean;
    description: string;
  };
}

// Asset Holdings
export type AssetType =
  | 'cash_savings'
  | 'cbn_treasury_bills'
  | 'sovereign_gilts'
  | 'corporate_bonds_bbb'
  | 'equities_defensive'    // FTSE 100 / NGX 30
  | 'equities_cyclical'     // FTSE 250
  | 'equities_tech_growth'  // S&P 500
  | 'fx_usd_domiciliary'
  | 'physical_gold'
  | 'real_estate'
  | 'ajo_contribution'
  | 'business_equity';

export interface AssetHolding {
  id: string;
  assetType: AssetType;
  name: string;
  currencyCode: CurrencyCode;
  acquisitionCostMinor: bigint;
  currentValueMinor: bigint;
  countryCode: string;
  expectedAnnualYieldPercent: number;
  liquidityDays: number;
  isLiquid: boolean;
  notes?: string;
}

// Real Estate & Property Manager Delegation
export interface RealProperty {
  id: string;
  name: string;
  propertyType: 'land_plot' | 'residential_apartment' | 'commercial_office' | 'shortlet_unit';
  address: string;
  city: string;
  countryCode: string;
  currencyCode: CurrencyCode;
  titleType: 'Certificate_of_Occupancy' | 'Governors_Consent' | 'Deed_of_Assignment' | 'Freehold' | 'Leasehold';
  acquisitionCostMinor: bigint;
  currentMarketValueMinor: bigint;
  annualRentalYieldPercent: number;
  isIncomeProducing: boolean;
  isInsured: boolean;
  assignedManagerId?: string;
  quarterlyRentalGrossMinor: bigint;
  quarterlyOperatingExpensesMinor: bigint;
}

export interface PropertyManager {
  id: string;
  name: string;
  firmName: string;
  countryCode: string;
  currencyCode: CurrencyCode;
  phone: string;
  reliabilityScore: number; // 0 - 10
  managementFeePercent: number; // e.g. 10%
  propertiesCount: number;
  totalRemittedMinor: bigint;
  status: 'active' | 'suspended';
}

export interface PropertyRemittance {
  id: string;
  propertyId: string;
  managerId: string;
  quarter: string;
  grossAmountMinor: bigint;
  managementFeeMinor: bigint;
  maintenanceDeductionsMinor: bigint;
  netRemittedMinor: bigint;
  currencyCode: CurrencyCode;
  status: 'pending_approval' | 'approved' | 'disputed';
  paymentReference: string;
}

// Ajo / Esusu & Peer Syndicates
export interface AjoCycle {
  id: string;
  name: string;
  totalMembers: number;
  monthlyContributionMinor: bigint;
  currencyCode: CurrencyCode;
  cycleLengthMonths: number;
  currentTurnMonth: number;
  playerPayoutMonth: number;
  playerPaidSoFarMinor: bigint;
  status: 'active' | 'completed' | 'defaulted';
  organizerTrustScore: number;
}

export interface PeerCoInvestment {
  id: string;
  dealName: string;
  sponsorName: string;
  assetType: string;
  totalCapitalRequiredMinor: bigint;
  playerCommitmentMinor: bigint;
  currencyCode: CurrencyCode;
  expectedReturnPercent: number;
  holdPeriodQuarters: number;
  quartersRemaining: number;
  trustScore: number;
  status: 'open' | 'funded' | 'completed';
}

// Closely-Held Businesses & Conglomerates
export interface BusinessEnterprise {
  id: string;
  name: string;
  industry: string;
  stage: 'early_sme' | 'growing_midmarket' | 'commercial_leader' | 'industrial_conglomerate';
  countryCode: string;
  currencyCode: CurrencyCode;
  ownershipPercent: number;
  valuationMinor: bigint;
  quarterlyRevenueMinor: bigint;
  quarterlyProfitMinor: bigint;
  quarterlyDistributionToPlayerMinor: bigint;
  employeesCount: number;
  hasKeyPersonInsurance: boolean;
  hasSuccessionPlan: boolean;
}

// Family Graph & Dynasty Trust
export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: 'parent' | 'spouse' | 'child' | 'sibling';
  age: number;
  isDependent: boolean;
  quarterlySupportObligationMinor: bigint;
  currencyCode: CurrencyCode;
  notes: string;
}

export interface DynastyTrust {
  id: string;
  trustName: string;
  jurisdiction: string; // e.g. 'Nigeria (CAMPA)', 'Jersey', 'Liechtenstein', 'Delaware'
  currencyCode: CurrencyCode;
  totalAssetsUnderTrustMinor: bigint;
  trustProtector: string;
  isIrrevocable: boolean;
  hasSpendthriftClause: boolean;
  hasFamilyCharter: boolean;
  governanceScore: number; // 0 - 100
}

// Quarterly Simulation History Log
export interface QuarterSettlementLog {
  quarter: string;
  year: number;
  quarterNumber: number;
  countryCode: string;
  startingNetWorthNaira: number;
  endingNetWorthNaira: number;
  totalIncomeMinor: bigint;
  totalExpensesMinor: bigint;
  investmentReturnsMinor: bigint;
  inflationDragNaira: number;
  fxGainLossNaira: number;
  majorEventTitle: string;
  majorEventDescription: string;
  decisionTaken?: string;
}
