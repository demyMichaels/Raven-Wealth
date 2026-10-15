/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrencyCode, CurrencyInfo } from '../types/wealth';

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', minorExponent: 2 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', minorExponent: 2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', minorExponent: 2 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', minorExponent: 2 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', minorExponent: 2 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', minorExponent: 2 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED ', minorExponent: 2 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R ', minorExponent: 2 },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh ', minorExponent: 2 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', minorExponent: 0 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF ', minorExponent: 2 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', minorExponent: 2 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', minorExponent: 2 },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', minorExponent: 2 },
  RWF: { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw ', minorExponent: 0 },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', minorExponent: 2 },
  MAD: { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD ', minorExponent: 2 },
  XOF: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA ', minorExponent: 0 },
  ETB: { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br ', minorExponent: 2 },
  AOA: { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz ', minorExponent: 2 },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', minorExponent: 2 },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', minorExponent: 2 },
  ARS: { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', minorExponent: 2 },
  CLP: { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$ ', minorExponent: 0 },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR ', minorExponent: 2 },
  QAR: { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR ', minorExponent: 2 },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', minorExponent: 0 },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp ', minorExponent: 0 },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', minorExponent: 2 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', minorExponent: 2 },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr ', minorExponent: 2 },
};

/**
 * Converts minor unit bigint to major number
 */
export function minorToMajor(amountMinor: bigint, currencyCode: CurrencyCode): number {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.NGN;
  if (curr.minorExponent === 0) {
    return Number(amountMinor);
  }
  const divisor = Math.pow(10, curr.minorExponent);
  return Number(amountMinor) / divisor;
}

/**
 * Converts major number to minor unit bigint
 */
export function majorToMinor(amountMajor: number, currencyCode: CurrencyCode): bigint {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.NGN;
  if (curr.minorExponent === 0) {
    return BigInt(Math.round(amountMajor));
  }
  const multiplier = Math.pow(10, curr.minorExponent);
  return BigInt(Math.round(amountMajor * multiplier));
}

/**
 * Format money with symbol, comma separators, and exact minor precision
 */
export function formatMoney(
  amountMinor: bigint,
  currencyCode: CurrencyCode = 'NGN',
  options: { compact?: boolean; hideSymbol?: boolean } = {}
): string {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.NGN;
  const major = minorToMajor(amountMinor, currencyCode);

  if (options.compact) {
    const abs = Math.abs(major);
    let formatted = '';
    if (abs >= 1_000_000_000_000) {
      formatted = (major / 1_000_000_000_000).toFixed(2) + 'T';
    } else if (abs >= 1_000_000_000) {
      formatted = (major / 1_000_000_000).toFixed(2) + 'B';
    } else if (abs >= 1_000_000) {
      formatted = (major / 1_000_000).toFixed(2) + 'M';
    } else if (abs >= 1_000) {
      formatted = (major / 1_000).toFixed(1) + 'k';
    } else {
      formatted = major.toLocaleString('en-US', {
        minimumFractionDigits: curr.minorExponent,
        maximumFractionDigits: curr.minorExponent,
      });
    }
    return options.hideSymbol ? formatted : `${curr.symbol}${formatted}`;
  }

  const formatted = major.toLocaleString('en-US', {
    minimumFractionDigits: curr.minorExponent,
    maximumFractionDigits: curr.minorExponent,
  });

  return options.hideSymbol ? formatted : `${curr.symbol}${formatted}`;
}

/**
 * Convenience helper for Nigerian Naira
 */
export function formatNaira(kobo: bigint, compact = false): string {
  return formatMoney(kobo, 'NGN', { compact });
}

/**
 * Convenience helper for US Dollars
 */
export function formatUSD(cents: bigint, compact = false): string {
  return formatMoney(cents, 'USD', { compact });
}

/**
 * Convert an amount from one currency to another using the FX matrix
 */
export function convertCurrencyMinor(
  amountMinor: bigint,
  from: CurrencyCode,
  to: CurrencyCode,
  usdExchangeRates: Record<CurrencyCode, number> // rate relative to 1 USD
): bigint {
  if (from === to) return amountMinor;

  // Convert 'from' minor to 'from' major
  const fromMajor = minorToMajor(amountMinor, from);

  // Convert 'from' major to USD major
  // e.g. from NGN to USD: fromMajor / usdNgnRate
  // e.g. from GBP to USD: fromMajor * gbpUsdRate
  const rateFrom = usdExchangeRates[from] || 1; // units of currency per 1 USD (or USD per unit)
  const rateTo = usdExchangeRates[to] || 1;

  let amountInUsd = 0;
  if (from === 'USD') {
    amountInUsd = fromMajor;
  } else if (from === 'GBP' || from === 'EUR' || from === 'AUD') {
    // direct quotation (1 GBP = 1.28 USD)
    amountInUsd = fromMajor * rateFrom;
  } else {
    // indirect quotation (1 USD = 1600 NGN)
    amountInUsd = fromMajor / rateFrom;
  }

  let toMajor = 0;
  if (to === 'USD') {
    toMajor = amountInUsd;
  } else if (to === 'GBP' || to === 'EUR' || to === 'AUD') {
    toMajor = amountInUsd / rateTo;
  } else {
    toMajor = amountInUsd * rateTo;
  }

  return majorToMinor(toMajor, to);
}
