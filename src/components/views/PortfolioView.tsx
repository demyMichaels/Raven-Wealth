/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { DuolingoCard } from '../common/DuolingoCard';
import { DuolingoButton } from '../common/DuolingoButton';
import { AssetHolding, AssetType, CurrencyCode } from '../../types/wealth';
import { formatMoney, minorToMajor, majorToMinor } from '../../utils/formatters';
import {
  PieChart,
  Plus,
  Coins,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building2,
  Trash2,
  ArrowUpRight,
  Landmark,
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { assets, buyAsset, sellAsset, player, fsrMetrics, totalNetWorthNaira } = useSimulation();

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>('cbn_treasury_bills');
  const [buyName, setBuyName] = useState('CBN 1-Year Treasury Bill (18.5% Yield)');
  const [buyCurrency, setBuyCurrency] = useState<CurrencyCode>('NGN');
  const [buyAmountMajor, setBuyAmountMajor] = useState<string>('50000');
  const [buyYield, setBuyYield] = useState<number>(18.5);

  const liquidAsset = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency);
  const liquidCashMajor = liquidAsset ? minorToMajor(liquidAsset.currentValueMinor, player.primaryCurrency) : 0;

  // Preset investment opportunities matching real-world realities
  const investmentPresets: Array<{
    type: AssetType;
    name: string;
    currency: CurrencyCode;
    annualYield: number;
    desc: string;
    minMajor: number;
  }> = [
    {
      type: 'cbn_treasury_bills',
      name: 'Central Bank of Nigeria (CBN) 364-Day Treasury Bill',
      currency: 'NGN',
      annualYield: 18.5,
      desc: 'Government backed, zero default risk. Exempt from Nigerian personal income tax.',
      minMajor: 50_000,
    },
    {
      type: 'fx_usd_domiciliary',
      name: 'Offshore / Domiciliary US Dollar Cash Account',
      currency: 'USD',
      annualYield: 4.5,
      desc: 'High-yield dollar liquidity protecting against parallel market Naira devaluation.',
      minMajor: 50, // $50
    },
    {
      type: 'equities_defensive',
      name: 'NGX 30 Blue-Chip Dividend Portfolio (Dangote & MTNN)',
      currency: 'NGN',
      annualYield: 14.2,
      desc: 'High-dividend multi-nationals generating inflation-hedged quarterly payouts.',
      minMajor: 20_000,
    },
    {
      type: 'sovereign_gilts',
      name: 'United Kingdom 10-Year HM Treasury Gilt',
      currency: 'GBP',
      annualYield: 4.25,
      desc: 'Sovereign sterling bond benchmark, direct beneficiary of BoE policy stability.',
      minMajor: 100, // £100
    },
    {
      type: 'corporate_bonds_bbb',
      name: 'Investment Grade Corporate Bond (BBB Spread Stress Hedge)',
      currency: 'GBP',
      annualYield: 6.8,
      desc: 'Corporate credit with spread premium (180bps over gilts), yielding quarterly coupons.',
      minMajor: 250, // £250
    },
    {
      type: 'equities_tech_growth',
      name: 'S&P 500 Index Global ETF Allocation',
      currency: 'USD',
      annualYield: 10.5,
      desc: 'Broad exposure to US large-cap tech innovators and global compounding giants.',
      minMajor: 100, // $100
    },
    {
      type: 'physical_gold',
      name: 'Physical Allocated Gold Bars (1 Troy Ounce)',
      currency: 'USD',
      annualYield: 2.0,
      desc: 'Sovereign crisis insurance, permanent hedge against global fiat currency dilution.',
      minMajor: 200, // Fractional gold
    },
  ];

  const handleSelectPreset = (preset: typeof investmentPresets[0]) => {
    setSelectedAssetType(preset.type);
    setBuyName(preset.name);
    setBuyCurrency(preset.currency);
    setBuyYield(preset.annualYield);
    setBuyAmountMajor(preset.minMajor.toString());
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(buyAmountMajor) || 0;
    if (amount <= 0) return;

    const minorAmount = majorToMinor(amount, buyCurrency);
    const success = buyAsset({
      assetType: selectedAssetType,
      name: buyName,
      currencyCode: buyCurrency,
      acquisitionCostMinor: minorAmount,
      currentValueMinor: minorAmount,
      countryCode: player.countryCode,
      expectedAnnualYieldPercent: buyYield,
      liquidityDays: selectedAssetType === 'cash_savings' ? 0 : selectedAssetType === 'cbn_treasury_bills' ? 90 : 3,
      isLiquid: selectedAssetType !== 'physical_gold',
    });

    if (success) {
      setShowBuyModal(false);
    } else {
      alert(`Insufficient funds in your primary cash account! Available: ₦${liquidCashMajor.toLocaleString()}`);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 shadow-[0_4px_0_0_#D4D4D4]">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#58CC02] tracking-wider">
              Multi-Asset Allocation
            </span>
            <span className="text-xs text-slate-400 font-bold">·</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold">{assets.length} Holdings</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight mt-0.5">
            Portfolio Management & Assets
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 max-w-2xl">
            Diversify across Nigerian money markets, Treasury bills, foreign currency domiciliary accounts, UK gilts, and global equities.
          </p>
        </div>

        <DuolingoButton
          variant="green"
          size="sm"
          onClick={() => setShowBuyModal(true)}
          className="!py-2 text-xs font-black self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Acquire Asset</span>
        </DuolingoButton>
      </div>

      {/* Asset Allocation Cockpit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DuolingoCard variant="cream">
          <span className="text-xs font-extrabold uppercase text-slate-600 block mb-1">
            Total Asset Value
          </span>
          <div className="text-3xl font-black font-mono-numbers text-slate-900">
            ₦{Math.round(totalNetWorthNaira).toLocaleString()}
          </div>
          <p className="text-xs font-bold text-slate-600 mt-1">
            Consolidated valuation across all currencies in Naira
          </p>
        </DuolingoCard>

        <DuolingoCard variant="green_light">
          <span className="text-xs font-extrabold uppercase text-[#58CC02] block mb-1">
            Liquid Available Cash
          </span>
          <div className="text-3xl font-black font-mono-numbers text-slate-900">
            ₦{liquidCashMajor.toLocaleString()}
          </div>
          <p className="text-xs font-bold text-slate-600 mt-1">
            Ready for deployment into high-yield instruments or emergencies
          </p>
        </DuolingoCard>

        <DuolingoCard variant="blue_light">
          <span className="text-xs font-extrabold uppercase text-[#1CB0F6] block mb-1">
            Weighted Yield Target
          </span>
          <div className="text-3xl font-black font-mono-numbers text-slate-900">
            ~15.4% p.a.
          </div>
          <p className="text-xs font-bold text-slate-600 mt-1">
            Blended interest & dividend compounding across portfolio
          </p>
        </DuolingoCard>
      </div>

      {/* Asset Holdings Table */}
      <DuolingoCard>
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <h3 className="text-base font-black text-slate-800">
            Active Investment Positions
          </h3>
          <span className="text-xs font-bold text-slate-600">
            Values updated with quarterly compounding
          </span>
        </div>

        <div className="divide-y-2 divide-slate-100 pt-1">
          {assets.map((asset) => {
            const currentMajor = minorToMajor(asset.currentValueMinor, asset.currencyCode);
            const costMajor = minorToMajor(asset.acquisitionCostMinor, asset.currencyCode);
            const pnlMajor = currentMajor - costMajor;
            const pnlPercent = costMajor > 0 ? ((pnlMajor / costMajor) * 100).toFixed(1) : '0.0';

            const getAssetIcon = () => {
              switch (asset.assetType) {
                case 'cbn_treasury_bills':
                  return '📜';
                case 'fx_usd_domiciliary':
                  return '💵';
                case 'equities_defensive':
                case 'equities_cyclical':
                case 'equities_tech_growth':
                  return '📈';
                case 'sovereign_gilts':
                case 'corporate_bonds_bbb':
                  return '🏛️';
                case 'physical_gold':
                  return '🪙';
                default:
                  return '🏦';
              }
            };

            return (
              <div key={asset.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-xl shrink-0">
                    {getAssetIcon()}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">
                      {asset.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mt-0.5">
                      <span className="uppercase">{asset.currencyCode}</span>
                      <span>·</span>
                      <span>Expected Yield: {asset.expectedAnnualYieldPercent}% p.a.</span>
                      <span>·</span>
                      <span>{asset.liquidityDays === 0 ? 'Instant Liquidity' : `${asset.liquidityDays} Days`}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-sm font-black font-mono-numbers text-slate-900 block">
                      {formatMoney(asset.currentValueMinor, asset.currencyCode)}
                    </span>
                    <span className={`text-[11px] font-bold ${pnlMajor >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
                      {pnlMajor >= 0 ? '+' : ''}{pnlMajor.toLocaleString()} ({pnlPercent}%)
                    </span>
                  </div>

                  {asset.assetType !== 'cash_savings' && (
                    <button
                      onClick={() => sellAsset(asset.id)}
                      title="Liquidate position into primary cash account"
                      className="px-3 py-1.5 rounded-lg border-2 border-rose-200 bg-rose-50 text-rose-700 text-xs font-black uppercase hover:bg-rose-100 transition-colors"
                    >
                      Liquidate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DuolingoCard>

      {/* Acquire Asset Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 max-w-xl w-full shadow-[0_8px_0_0_#D4D4D4] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-800">
                Acquire Investment Asset
              </h3>
              <button
                onClick={() => setShowBuyModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-slate-600 mb-3">
              Select a verified financial instrument to add to your private balance sheet:
            </p>

            {/* Presets List */}
            <div className="space-y-2 mb-4 max-h-56 overflow-y-auto no-scrollbar">
              {investmentPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    buyName === preset.name
                      ? 'border-[#58CC02] bg-[#FAFDF7] shadow-[0_2px_0_0_#388402]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">
                      {preset.name}
                    </span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {preset.annualYield}% p.a.
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                    {preset.desc}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-4 pt-2 border-t-2 border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Currency
                  </label>
                  <select
                    value={buyCurrency}
                    onChange={(e) => setBuyCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#58CC02]"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Investment Amount ({buyCurrency})
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={buyAmountMajor}
                    onChange={(e) => setBuyAmountMajor(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#58CC02]"
                  />
                </div>
              </div>

              <div className="bg-[#FAFDF7] border-2 border-[#B6EAA0] rounded-xl p-3 text-xs font-bold text-slate-700">
                <span className="block font-black text-[#58CC02] uppercase mb-0.5">
                  Liquidity & Settlement Notice
                </span>
                Purchases are debited directly from your liquid cash balance and will begin yielding quarterly cash flows on the next turn.
              </div>

              <DuolingoButton variant="green" fullWidth type="submit">
                Execute Investment Purchase
              </DuolingoButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
