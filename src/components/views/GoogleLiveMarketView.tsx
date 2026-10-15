/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { DuolingoCard } from '../common/DuolingoCard';
import { DuolingoButton } from '../common/DuolingoButton';
import { HISTORICAL_FSR_BENCHMARKS } from '../../data/financialMarketsData';
import {
  TrendingUp,
  RefreshCw,
  Globe2,
  Sparkles,
  BarChart3,
  ShieldAlert,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
} from 'lucide-react';

export const GoogleLiveMarketView: React.FC = () => {
  const {
    fsrMetrics,
    googleLiveSnapshot,
    fetchGoogleLiveMarket,
    syncGoogleWithSimulation,
  } = useSimulation();

  const [syncedRecently, setSyncedRecently] = useState(false);

  const handleSyncClick = () => {
    syncGoogleWithSimulation();
    setSyncedRecently(true);
    setTimeout(() => setSyncedRecently(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 shadow-[0_4px_0_0_#D4D4D4]">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#1CB0F6] tracking-wider">
              Real-World Financial Stability Monitor
            </span>
            <span className="text-xs text-slate-400 font-bold">·</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold">Google Search Grounding Engine</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight mt-0.5">
            Live Markets & Financial Stability Report
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 max-w-2xl">
            Grounded in empirical findings from the UK Financial Stability Report (2019–2024 by Michael Ogunnowo / Young Titans Foundation) and live Google market quotes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          <DuolingoButton
            variant="blue"
            size="sm"
            onClick={fetchGoogleLiveMarket}
            disabled={googleLiveSnapshot.isLoading}
            className="!py-2 text-xs font-black"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${googleLiveSnapshot.isLoading ? 'animate-spin' : ''}`} />
            <span className="truncate">{googleLiveSnapshot.isLoading ? 'Fetching...' : 'Fetch Google'}</span>
          </DuolingoButton>

          <DuolingoButton
            variant="green"
            size="sm"
            onClick={handleSyncClick}
            className="!py-2 text-xs font-black"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="truncate">{syncedRecently ? 'Synced!' : 'Apply Markets'}</span>
          </DuolingoButton>
        </div>
      </div>

      {/* Google Live Grounding Dashboard Strip */}
      <DuolingoCard variant="blue_light">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b-2 border-[#A8DEF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center font-black text-sm">
              G
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800">
                Real-Time Google Market Quotes
              </h2>
              <span className="text-[11px] font-bold text-slate-600">
                {googleLiveSnapshot.sourceAttribution} · Last updated:{' '}
                {googleLiveSnapshot.lastFetchedAt
                  ? new Date(googleLiveSnapshot.lastFetchedAt).toLocaleTimeString()
                  : 'Awaiting initial fetch'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-xl">
              USD/NGN Parallel: ₦{googleLiveSnapshot.fx.usdNgnParallel.toLocaleString()}
            </span>
            <span className="text-xs font-black text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-xl">
              Brent: ${googleLiveSnapshot.commodities.brentCrudeUsd}/bbl
            </span>
          </div>
        </div>

        {/* Live Indices Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
          <div className="bg-white border-2 border-[#A8DEF8] rounded-xl p-3">
            <div className="flex justify-between text-[11px] font-black uppercase text-slate-600">
              <span>FTSE 100</span>
              <span className="text-slate-600">London</span>
            </div>
            <div className="text-xl font-black font-mono-numbers text-slate-900 mt-1">
              {googleLiveSnapshot.indices.ftse100.price.toLocaleString()}
            </div>
            <span className={`text-xs font-black ${googleLiveSnapshot.indices.ftse100.changePercent >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
              {googleLiveSnapshot.indices.ftse100.changePercent >= 0 ? '+' : ''}
              {googleLiveSnapshot.indices.ftse100.changePercent}%
            </span>
          </div>

          <div className="bg-white border-2 border-[#A8DEF8] rounded-xl p-3">
            <div className="flex justify-between text-[11px] font-black uppercase text-slate-600">
              <span>FTSE 250</span>
              <span className="text-slate-600">UK Mid-Cap</span>
            </div>
            <div className="text-xl font-black font-mono-numbers text-slate-900 mt-1">
              {googleLiveSnapshot.indices.ftse250.price.toLocaleString()}
            </div>
            <span className={`text-xs font-black ${googleLiveSnapshot.indices.ftse250.changePercent >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
              {googleLiveSnapshot.indices.ftse250.changePercent >= 0 ? '+' : ''}
              {googleLiveSnapshot.indices.ftse250.changePercent}%
            </span>
          </div>

          <div className="bg-white border-2 border-[#A8DEF8] rounded-xl p-3">
            <div className="flex justify-between text-[11px] font-black uppercase text-slate-600">
              <span>S&P 500</span>
              <span className="text-slate-600">New York</span>
            </div>
            <div className="text-xl font-black font-mono-numbers text-slate-900 mt-1">
              {googleLiveSnapshot.indices.sp500.price.toLocaleString()}
            </div>
            <span className={`text-xs font-black ${googleLiveSnapshot.indices.sp500.changePercent >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
              {googleLiveSnapshot.indices.sp500.changePercent >= 0 ? '+' : ''}
              {googleLiveSnapshot.indices.sp500.changePercent}%
            </span>
          </div>

          <div className="bg-white border-2 border-[#A8DEF8] rounded-xl p-3">
            <div className="flex justify-between text-[11px] font-black uppercase text-slate-600">
              <span>NGX 30</span>
              <span className="text-slate-600">Nigeria</span>
            </div>
            <div className="text-xl font-black font-mono-numbers text-slate-900 mt-1">
              {googleLiveSnapshot.indices.ngx30.price.toLocaleString()}
            </div>
            <span className={`text-xs font-black ${googleLiveSnapshot.indices.ngx30.changePercent >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
              {googleLiveSnapshot.indices.ngx30.changePercent >= 0 ? '+' : ''}
              {googleLiveSnapshot.indices.ngx30.changePercent}%
            </span>
          </div>
        </div>

        {/* Live Equities Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
          {googleLiveSnapshot.equities.map((eq) => (
            <div key={eq.ticker} className="bg-white/80 border border-slate-200 rounded-xl p-2.5">
              <div className="flex justify-between text-[10px] font-black text-slate-600">
                <span>{eq.ticker} ({eq.exchange})</span>
                <span className={eq.changePercent >= 0 ? 'text-emerald-800' : 'text-rose-700'}>
                  {eq.changePercent >= 0 ? '+' : ''}{eq.changePercent}%
                </span>
              </div>
              <div className="text-sm font-black text-slate-800 truncate">{eq.name}</div>
              <div className="text-xs font-black font-mono-numbers text-slate-900 mt-0.5">
                {eq.currency === 'NGN' ? '₦' : eq.currency === 'GBP' ? '£' : '$'}{eq.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </DuolingoCard>

      {/* Financial Stability Report (FSR) Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credit Spread & Liquidity Vulnerability */}
        <DuolingoCard>
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-[#FF4B4B] text-white flex items-center justify-center font-black">
              📊
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                Bond Market & BBB Credit Spread Widening
              </h3>
              <p className="text-xs font-bold text-slate-600">
                Core empirical finding from FSR: Spreads blow out during stress
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-xs font-extrabold uppercase text-slate-600 block">
                  Current BBB Corporate Spread
                </span>
                <span className="text-3xl font-black font-mono-numbers text-slate-900">
                  {fsrMetrics.bbbCorporateCreditSpreadBps} bps
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-600 block">Baseline Normal</span>
                <span className="text-sm font-black text-emerald-800">120 bps (Pre-Crisis)</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full ${
                  fsrMetrics.bbbCorporateCreditSpreadBps > 220 ? 'bg-[#FF4B4B]' : 'bg-[#FFC800]'
                }`}
                style={{
                  width: `${Math.min(100, (fsrMetrics.bbbCorporateCreditSpreadBps / 300) * 100)}%`,
                }}
              />
            </div>

            <div className="bg-[#FAFDF7] border-2 border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700 space-y-1">
              <span className="font-black text-slate-900 block">FSR Finding:</span>
              <p>
                During COVID-19 and the 2022 Energy Crisis, BBB spreads widened from 120bps to 300bps and 250bps. Bid-ask spreads widen sharply, creating severe liquidity traps for illiquid private assets.
              </p>
            </div>
          </div>
        </DuolingoCard>

        {/* Central Bank Policy Divergence & FX Impact */}
        <DuolingoCard>
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-[#58CC02] text-white flex items-center justify-center font-black">
              🏦
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                Central Bank Policy Divergence & FX
              </h3>
              <p className="text-xs font-bold text-slate-600">
                Fed vs. BoE vs. CBN rate timing and currency flight
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] font-black uppercase text-slate-600 block">
                  US Fed Funds
                </span>
                <span className="text-base font-black text-slate-800 font-mono-numbers">
                  {fsrMetrics.fedFundsRatePercent}%
                </span>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] font-black uppercase text-slate-600 block">
                  BoE Base Rate
                </span>
                <span className="text-base font-black text-slate-800 font-mono-numbers">
                  {fsrMetrics.boeBaseRatePercent}%
                </span>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] font-black uppercase text-slate-600 block">
                  CBN MPR Rate
                </span>
                <span className="text-base font-black text-slate-800 font-mono-numbers">
                  {fsrMetrics.cbnMprRatePercent}%
                </span>
              </div>
            </div>

            <div className="bg-[#F6FBFE] border-2 border-[#A8DEF8] rounded-xl p-3 text-xs font-bold text-slate-700 space-y-1">
              <span className="font-black text-[#1CB0F6] block">FX Vulnerability Insight:</span>
              <p>
                Delayed central bank tightening relative to the US Fed triggers swift capital flight into the USD greenback. In the UK, this drove GBP/USD to 1.07; in Nigeria, it expands the parallel market premium beyond 10%.
              </p>
            </div>
          </div>
        </DuolingoCard>
      </div>

      {/* Historical Benchmarks (2019-2024 FSR Table) */}
      <DuolingoCard>
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-800">
              UK Financial Stability Report Timeline (2019–2024)
            </h3>
            <p className="text-xs font-bold text-slate-600">
              Empirical historical evolution of gilt yields, credit spreads, and inflation shocks
            </p>
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs font-bold text-slate-700">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 pr-4">Quarter</th>
                <th className="py-2.5 px-3">10Y Gilt</th>
                <th className="py-2.5 px-3">BBB Spread</th>
                <th className="py-2.5 px-3">FTSE 100</th>
                <th className="py-2.5 px-3">GBP/USD</th>
                <th className="py-2.5 px-3">Brent</th>
                <th className="py-2.5 px-3">Inflation</th>
                <th className="py-2.5 pl-3">Market Stress Reality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {HISTORICAL_FSR_BENCHMARKS.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 pr-4 font-black font-mono-numbers text-slate-900 whitespace-nowrap">
                    {b.date}
                  </td>
                  <td className="py-2.5 px-3 font-mono-numbers text-slate-800">
                    {b.giltYield}%
                  </td>
                  <td className={`py-2.5 px-3 font-mono-numbers ${b.bbbSpreadBps >= 250 ? 'text-rose-700 font-black' : 'text-slate-800'}`}>
                    {b.bbbSpreadBps} bps
                  </td>
                  <td className="py-2.5 px-3 font-mono-numbers text-slate-800">
                    {b.ftse100Price.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono-numbers text-slate-800">
                    ${b.gbpUsd}
                  </td>
                  <td className="py-2.5 px-3 font-mono-numbers text-slate-800">
                    ${b.brentCrude}
                  </td>
                  <td className={`py-2.5 px-3 font-mono-numbers ${b.ukInflation >= 10 ? 'text-rose-700 font-black' : 'text-slate-800'}`}>
                    {b.ukInflation}%
                  </td>
                  <td className="py-2.5 pl-3 text-slate-600 font-normal">
                    {b.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DuolingoCard>
    </div>
  );
};
