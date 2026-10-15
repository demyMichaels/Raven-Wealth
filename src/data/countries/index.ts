/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CountryModule, ContinentCode } from '../../types/wealth';
import { AFRICA_COUNTRIES } from './africa';
import { EUROPE_COUNTRIES } from './europe';
import { NORTH_AMERICA_COUNTRIES } from './northAmerica';
import { ASIA_MIDDLE_EAST_COUNTRIES } from './asiaMiddleEast';
import { SOUTH_AMERICA_COUNTRIES } from './southAmerica';
import { OCEANIA_COUNTRIES } from './oceania';

export { AFRICA_COUNTRIES } from './africa';
export { EUROPE_COUNTRIES } from './europe';
export { NORTH_AMERICA_COUNTRIES } from './northAmerica';
export { ASIA_MIDDLE_EAST_COUNTRIES } from './asiaMiddleEast';
export { SOUTH_AMERICA_COUNTRIES } from './southAmerica';
export { OCEANIA_COUNTRIES } from './oceania';

export const CONTINENTS: Record<ContinentCode, { name: string; icon: string }> = {
  AF: { name: 'Africa', icon: '🌍' },
  EU: { name: 'Europe', icon: '🏰' },
  NA: { name: 'North America', icon: '🗽' },
  AS: { name: 'Asia & Middle East', icon: '🏙️' },
  SA: { name: 'South America', icon: '⛰️' },
  OC: { name: 'Oceania', icon: '🏖️' },
};

export const ALL_COUNTRIES: CountryModule[] = [
  ...AFRICA_COUNTRIES,
  ...EUROPE_COUNTRIES,
  ...NORTH_AMERICA_COUNTRIES,
  ...ASIA_MIDDLE_EAST_COUNTRIES,
  ...SOUTH_AMERICA_COUNTRIES,
  ...OCEANIA_COUNTRIES,
];

// Helper functions for easy updating and querying
export function getCountryByCode(code: string, customList?: CountryModule[]): CountryModule | undefined {
  const list = customList || ALL_COUNTRIES;
  return list.find((c) => c.countryCode.toUpperCase() === code.toUpperCase());
}

export function getCountriesByContinent(continent: ContinentCode | 'ALL', customList?: CountryModule[]): CountryModule[] {
  const list = customList || ALL_COUNTRIES;
  if (continent === 'ALL') return list;
  return list.filter((c) => c.continentCode === continent);
}

export function getUpcomingElections(withinYears: number = 2, currentYear: number = 2026, customList?: CountryModule[]): CountryModule[] {
  const list = customList || ALL_COUNTRIES;
  return list.filter((c) => {
    const diff = c.governance.nextElectionYear - currentYear;
    return diff >= 0 && diff <= withinYears;
  });
}
