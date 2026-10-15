/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSimulation } from '../../state/simulationContext';
import { DuolingoCard } from '../common/DuolingoCard';
import { DuolingoButton } from '../common/DuolingoButton';
import { formatNaira, formatUSD, formatMoney, minorToMajor } from '../../utils/formatters';
import {
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Globe2,
  Calendar,
  Sparkles,
  ChevronRight,
  Building,
  Target,
  Banknote,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onAdvanceQuarter: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab, onAdvanceQuarter }) => {
  const {
    player,
    fsrMetrics,
    totalNetWorthNaira,
    totalNetWorthUSD,
    emergencyFundMonths,
    assets,
    objectives,
    historyLogs,
    googleLiveSnapshot,
  } = useSimulation();

  // Find liquid savings
  const liquidAsset = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency);
  const liquidCashNaira = liquidAsset ? minorToMajor(liquidAsset.currentValueMinor, player.primaryCurrency) : 0;

  // Emergency Fund status
  const isEmergencyFundHealthy = emergencyFundMonths >= 6;
  const emergencyFundPercent = Math.min(100, Math.round((emergencyFundMonths / 6) * 100));

  // Quarterly Net Savings Run Rate
  const quarterlySalaryMajor = minorToMajor(player.quarterlySalaryMinor, player.primaryCurrency);
  const quarterlyExpensesMajor = minorToMajor(player.quarterlyLivingExpensesMinor, player.primaryCurrency);
  const netQuarterlySavings = quarterlySalaryMajor - quarterlyExpensesMajor;

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome & Persona Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 shadow-[0_4px_0_0_#D4D4D4]">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#58CC02] border-2 border-[#46A302] shadow-[0_4px_0_0_#388402] flex items-center justify-center text-2xl sm:text-3xl shrink-0">
            🦅
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase text-[#58CC02] tracking-wider">
                Aspiring Industrialist Simulation
              </span>
              <span className="text-xs text-slate-400 font-bold">·</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold">{player.city}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {player.fullName}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
              {player.jobTitle} at {player.employerName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto pt-1 sm:pt-0">
          <DuolingoButton
            variant="blue"
            size="sm"
            onClick={() => onNavigateTab('objectives')}
            className="!py-2 text-xs font-black"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Manage Goals</span>
          </DuolingoButton>
          <DuolingoButton
            variant="green"
            size="sm"
            onClick={onAdvanceQuarter}
            className="!py-2 text-xs font-black"
          >
            <span>Next Quarter</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </DuolingoButton>
        </div>
      </div>

      {/* Main KPI Cockpit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Net Worth Card */}
        <DuolingoCard variant="cream" className="relative overflow-hidden !p-4 sm:!p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider">
              Consolidated Net Worth
            </span>
            <span className="text-[10px] sm:text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg px-2 py-0.5">
              {fsrMetrics.quarter}
            </span>
          </div>

          <div className="text-2xl xs:text-3xl sm:text-4xl font-black font-mono-numbers text-slate-900 tracking-tight truncate">
            {formatNaira(BigInt(Math.round(totalNetWorthNaira * 100)))}
          </div>

          <div className="flex items-center gap-2 mt-2 text-sm font-bold text-slate-600">
            <span>Global Equiv:</span>
            <span className="font-mono-numbers font-black text-slate-800">
              {formatUSD(BigInt(Math.round(totalNetWorthUSD * 100)))}
            </span>
            <span className="text-xs text-slate-600">
              (@ ₦{fsrMetrics.usdNgnParallel.toLocaleString()}/$)
            </span>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-[#E8E2D6] flex items-center justify-between text-xs font-extrabold text-slate-600">
            <span>Liquid Cash Balance:</span>
            <span className="font-mono-numbers text-slate-800 font-black">
              ₦{liquidCashNaira.toLocaleString()}
            </span>
          </div>
        </DuolingoCard>

        {/* Emergency Fund Liquidity Gauge */}
        <DuolingoCard
          variant={isEmergencyFundHealthy ? 'green_light' : 'amber_light'}
        >
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider">
              Emergency Reserve Buffer
            </span>
            {isEmergencyFundHealthy ? (
              <ShieldCheck className="w-5 h-5 text-[#58CC02]" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-[#FFC800]" />
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono-numbers text-slate-900">
              {emergencyFundMonths}
            </span>
            <span className="text-base font-extrabold text-slate-600">
              / 6.0 Months target
            </span>
          </div>

          <p className="text-xs font-bold text-slate-600 mt-1">
            {isEmergencyFundHealthy
              ? 'Adequate liquidity buffer protecting family against shocks.'
              : 'Liquidity vulnerability! Earmark savings to survive sudden job or economic disruption.'}
          </p>

          <div className="mt-4">
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
              <div
                className={`h-full transition-all duration-300 ${
                  isEmergencyFundHealthy ? 'bg-[#58CC02]' : 'bg-[#FFC800]'
                }`}
                style={{ width: `${emergencyFundPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-black text-slate-600 mt-1 uppercase">
              <span>Current: ₦{liquidCashNaira.toLocaleString()}</span>
              <span>Goal: ₦900,000</span>
            </div>
          </div>
        </DuolingoCard>

        {/* Quarterly Cash Flow Run-Rate */}
        <DuolingoCard variant="blue_light">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider">
              Quarterly Cash Flow Run-Rate
            </span>
            <Banknote className="w-5 h-5 text-[#1CB0F6]" />
          </div>

          <div className="text-3xl sm:text-4xl font-black font-mono-numbers text-slate-900">
            +₦{netQuarterlySavings.toLocaleString()}
          </div>
          <span className="text-xs font-extrabold text-[#1CB0F6] uppercase tracking-wider block mt-0.5">
            Net Surplus per Quarter
          </span>

          <div className="mt-4 pt-3 border-t-2 border-[#A8DEF8] space-y-1.5 text-xs font-extrabold text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-600">Quarterly Salary:</span>
              <span className="font-mono-numbers text-emerald-800">
                +₦{quarterlySalaryMajor.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Living Expenses:</span>
              <span className="font-mono-numbers text-rose-700">
                -₦{quarterlyExpensesMajor.toLocaleString()}
              </span>
            </div>
          </div>
        </DuolingoCard>
      </div>

      {/* Nigerian & Global Economic Climate Strip */}
      <DuolingoCard className="bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFC800] border-2 border-[#E0A800] shadow-[0_2px_0_0_#B88600] flex items-center justify-center text-amber-950 font-black">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800">
                Macroeconomic Climate & FX Reality
              </h2>
              <p className="text-xs font-bold text-slate-600">
                Simulated market variables impacting inflation drag and capital preservation
              </p>
            </div>
          </div>

          {googleLiveSnapshot.lastFetchedAt && (
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#1CB0F6]">
              <span className="w-2 h-2 rounded-full bg-[#1CB0F6] animate-pulse" />
              <span>Google Live Grounding Active</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 pt-4">
          <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5 sm:p-3">
            <span className="text-[10px] font-black uppercase text-slate-600 block">
              Parallel FX (Street)
            </span>
            <span className="text-base sm:text-lg font-black font-mono-numbers text-slate-800 block">
              ₦{fsrMetrics.usdNgnParallel.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-rose-700">
              Spread: {Math.round(((fsrMetrics.usdNgnParallel - fsrMetrics.usdNgnOfficial) / fsrMetrics.usdNgnOfficial) * 100)}%
            </span>
          </div>

          <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5 sm:p-3">
            <span className="text-[10px] font-black uppercase text-slate-600 block">
              Official NAFEM FX
            </span>
            <span className="text-base sm:text-lg font-black font-mono-numbers text-slate-800 block">
              ₦{fsrMetrics.usdNgnOfficial.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-600">CBN Window</span>
          </div>

          <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5 sm:p-3">
            <span className="text-[10px] font-black uppercase text-slate-600 block">
              CBN Policy Rate
            </span>
            <span className="text-base sm:text-lg font-black font-mono-numbers text-slate-800 block">
              {fsrMetrics.cbnMprRatePercent}%
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700">T-Bills ~18.5%</span>
          </div>

          <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5 sm:p-3">
            <span className="text-[10px] font-black uppercase text-slate-600 block">
              Headline Inflation
            </span>
            <span className="text-base sm:text-lg font-black font-mono-numbers text-rose-700 block">
              {fsrMetrics.nigeriaInflationRate}%
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-rose-700">Food / Energy Surge</span>
          </div>

          <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5 sm:p-3">
            <span className="text-[10px] font-black uppercase text-slate-600 block">
              Brent Crude Oil
            </span>
            <span className="text-base sm:text-lg font-black font-mono-numbers text-slate-800 block">
              ${fsrMetrics.brentCrudeUsd}/bbl
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800">FX Reserves Engine</span>
          </div>

          <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5 sm:p-3">
            <span className="text-[10px] font-black uppercase text-slate-600 block">
              UK 10Y Gilt Yield
            </span>
            <span className="text-base sm:text-lg font-black font-mono-numbers text-slate-800 block">
              {fsrMetrics.uk10YGiltYield}%
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-600">BoE Rate 4.75%</span>
          </div>
        </div>
      </DuolingoCard>

      {/* Strategic Actions & Objectives Quick Peek */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Objectives Progress */}
        <DuolingoCard>
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-800">
                Top Wealth Objectives
              </h3>
              <p className="text-xs font-bold text-slate-600">
                Prioritized roadmap from initial ₦200,000 to industrial titan
              </p>
            </div>
            <DuolingoButton
              variant="white"
              size="sm"
              onClick={() => onNavigateTab('objectives')}
            >
              <span>View All ({objectives.length})</span>
            </DuolingoButton>
          </div>

          <div className="divide-y-2 divide-slate-100 pt-2">
            {objectives.slice(0, 4).map((obj) => {
              const targetMajor = minorToMajor(obj.targetAmountMinor, obj.currencyCode);
              const currentMajor = minorToMajor(obj.currentAmountMinor, obj.currencyCode);
              const pct = targetMajor > 0 ? Math.min(100, Math.round((currentMajor / targetMajor) * 100)) : 0;
              return (
                <div key={obj.id} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-slate-800 truncate pr-2">
                      {obj.name}
                    </span>
                    <span className="text-xs font-black font-mono-numbers text-slate-700 shrink-0">
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full ${pct >= 100 ? 'bg-[#58CC02]' : 'bg-[#1CB0F6]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 mt-1">
                    <span>
                      Funded: {formatMoney(obj.currentAmountMinor, obj.currencyCode, { compact: true })}
                    </span>
                    <span>
                      Target: {formatMoney(obj.targetAmountMinor, obj.currencyCode, { compact: true })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </DuolingoCard>

        {/* Quick Capital Allocation Steps */}
        <DuolingoCard>
          <div className="pb-3 border-b-2 border-slate-100">
            <h3 className="text-base font-black text-slate-800">
              Immediate Growth Moves (₦200,000 Stage)
            </h3>
            <p className="text-xs font-bold text-slate-600">
              Recommended paths to compound earning power and hedge against inflation
            </p>
          </div>

          <div className="space-y-3 pt-3">
            <div
              onClick={() => onNavigateTab('ajo')}
              className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#E5E5E5] hover:border-[#58CC02] cursor-pointer transition-all bg-[#FAFDF7]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#58CC02] text-white flex items-center justify-center font-black">
                  🤝
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    Join Yaba Titans Ajo Pool
                  </h4>
                  <p className="text-xs font-bold text-slate-600">
                    Contribute ₦50k/mo · Collect ₦500k lump sum in Turn 4
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </div>

            <div
              onClick={() => onNavigateTab('portfolio')}
              className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#E5E5E5] hover:border-[#1CB0F6] cursor-pointer transition-all bg-[#F6FBFE]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center font-black">
                  📈
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    Subscribe to CBN Treasury Bills
                  </h4>
                  <p className="text-xs font-bold text-slate-600">
                    Risk-free 18.5% yield to outpace bank savings account
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </div>

            <div
              onClick={() => onNavigateTab('global')}
              className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#E5E5E5] hover:border-[#FFC800] cursor-pointer transition-all bg-[#FFFDF5]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFC800] text-amber-950 flex items-center justify-center font-black">
                  ✈️
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    Explore Global Relocation Pathways
                  </h4>
                  <p className="text-xs font-bold text-slate-600">
                    Evaluate UK Skilled Worker, Canada Express Entry & Dubai visas
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </DuolingoCard>
      </div>

      {/* Historical Quarter Settlement Log */}
      {historyLogs.length > 0 && (
        <DuolingoCard>
          <h3 className="text-base font-black text-slate-800 mb-3">
            Simulation Settlement Ledger
          </h3>
          <div className="divide-y-2 divide-slate-100">
            {historyLogs.slice(0, 3).map((log, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-black text-[#58CC02] uppercase tracking-wider block">
                    {log.quarter} Settlement · {log.majorEventTitle}
                  </span>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    {log.majorEventDescription}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black font-mono-numbers text-slate-800 block">
                    Ending: ₦{log.endingNetWorthNaira.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-rose-700">
                    Inflation Drag: -₦{log.inflationDragNaira.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DuolingoCard>
      )}
    </div>
  );
};
