/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CountryModule } from '../../types/wealth';
import { majorToMinor } from '../../utils/formatters';

export const OCEANIA_COUNTRIES: CountryModule[] = [
  {
    countryCode: 'AU',
    countryName: 'Australia',
    continentCode: 'OC',
    currencyCode: 'AUD',
    capitalCity: 'Canberra (Commercial: Sydney / Melbourne)',
    sovereignRating: 'AAA',
    costOfLivingIndex: 430,
    baselineQuarterlyExpensesMinor: majorToMinor(7_800, 'AUD'),
    capitalControlsActive: false,
    maxMonthlyCardFxLimitUsd: 100000,
    wireTransferTaxPercent: 0,
    leader: {
      headOfState: 'King Charles III',
      headOfGovernment: 'Anthony Albanese',
      title: 'Monarch & Prime Minister',
      inOfficeSince: 2022,
      partyOrCoalition: 'Australian Labor Party (ALP)',
    },
    governance: {
      governmentType: 'Federal Parliamentary Constitutional Monarchy',
      electionCycleYears: 3,
      lastElectionYear: 2022,
      nextElectionYear: 2025,
      politicalStabilityIndex: 86,
      ruleOfLawIndex: 91,
      easeOfDoingBusinessScore: 84,
      corruptionPerceptionIndex: 75,
      majorPoliticalRisks: ['2025 federal parliamentary elections', 'Commodity export reliance on Chinese demand', 'Housing supply deficit'],
    },
    macro: {
      gdpNominalUsdBillions: 1720,
      populationMillions: 27,
      primaryExports: ['Iron Ore (BHP, Rio Tinto)', 'Coal & LNG (Woodside)', 'Gold & Lithium', 'Higher Education & Tourism'],
      fxRegime: 'Free Floating',
      sovereignDebtToGdpPercent: 55.0,
    },
    visaPathways: [
      {
        id: 'au_skills_subclass_189',
        name: 'Skilled Independent Visa (Subclass 189)',
        description: 'Permanent residency points-tested visa without needing state sponsorship.',
        costMinor: majorToMinor(4_600, 'AUD'),
        currencyCode: 'AUD',
        proofOfFundsMinor: majorToMinor(20_000, 'AUD'),
        processingQuarters: 3,
        qualifications: 'Eligible occupation on skilled list + skills assessment + 65+ points.',
      },
      {
        id: 'au_national_innovation',
        name: 'National Innovation Visa (NIV)',
        description: 'Permanent visa for exceptionally talented entrepreneurs, major investors, and researchers.',
        costMinor: majorToMinor(5_200, 'AUD'),
        currencyCode: 'AUD',
        proofOfFundsMinor: majorToMinor(500_000, 'AUD'),
        processingQuarters: 2,
        qualifications: 'Demonstrated international prominence in priority industrial sectors.',
      },
    ],
    taxRegime: {
      incomeTaxTopRate: 45, // Plus 2% Medicare levy
      corporateTaxRate: 30, // 25% for small-medium base rate entities
      capitalGainsTaxRate: 23.5, // 50% discount for individuals
      worldwideTaxation: true,
      description: '50% CGT discount for assets held over 12 months by tax residents. Franking credits prevent double taxation on dividends.',
    },
  },
  {
    countryCode: 'NZ',
    countryName: 'New Zealand',
    continentCode: 'OC',
    currencyCode: 'NZD',
    capitalCity: 'Wellington (Commercial: Auckland)',
    sovereignRating: 'AA+',
    costOfLivingIndex: 410,
    baselineQuarterlyExpensesMinor: majorToMinor(7_600, 'NZD'),
    capitalControlsActive: false,
    maxMonthlyCardFxLimitUsd: 100000,
    wireTransferTaxPercent: 0,
    leader: {
      headOfState: 'King Charles III',
      headOfGovernment: 'Christopher Luxon',
      title: 'Monarch & Prime Minister',
      inOfficeSince: 2023,
      partyOrCoalition: 'National Party / ACT / NZ First Coalition',
    },
    governance: {
      governmentType: 'Unitary Parliamentary Constitutional Monarchy',
      electionCycleYears: 3,
      lastElectionYear: 2023,
      nextElectionYear: 2026,
      politicalStabilityIndex: 90,
      ruleOfLawIndex: 93,
      easeOfDoingBusinessScore: 87,
      corruptionPerceptionIndex: 85,
      majorPoliticalRisks: ['Agricultural carbon emissions pricing', 'Trade exposure to Asian markets', 'Infrastructure deficit'],
    },
    macro: {
      gdpNominalUsdBillions: 250,
      populationMillions: 5.2,
      primaryExports: ['Dairy Products (Fonterra)', 'Meat & Wine', 'Wood & Forestry', 'Tourism Services'],
      fxRegime: 'Free Floating',
      sovereignDebtToGdpPercent: 49.0,
    },
    visaPathways: [
      {
        id: 'nz_active_investor',
        name: 'Active Investor Plus Visa',
        description: 'Direct residency for high-value investors allocating capital into Kiwi enterprises.',
        costMinor: majorToMinor(8_000, 'NZD'),
        currencyCode: 'NZD',
        proofOfFundsMinor: majorToMinor(5_000_000, 'NZD'),
        processingQuarters: 2,
        qualifications: 'NZ$ 5M+ direct investment in approved private equity or direct businesses.',
      },
    ],
    taxRegime: {
      incomeTaxTopRate: 39,
      corporateTaxRate: 28,
      capitalGainsTaxRate: 0, // Zero capital gains tax!
      worldwideTaxation: true,
      description: 'Zero general capital gains tax, zero stamp duty, zero inheritance tax. 4-year transitional tax exemption for new residents on foreign income.',
    },
  },
];
