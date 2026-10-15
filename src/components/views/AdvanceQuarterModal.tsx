/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QuarterSettlementLog } from '../../types/wealth';
import { DuolingoButton } from '../common/DuolingoButton';
import { formatNaira, formatMoney, minorToMajor } from '../../utils/formatters';
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  ShieldAlert,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface AdvanceQuarterModalProps {
  log: QuarterSettlementLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdvanceQuarterModal: React.FC<AdvanceQuarterModalProps> = ({
  log,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !log) return null;

  const netWorthDelta = log.endingNetWorthNaira - log.startingNetWorthNaira;
  const isNetWorthUp = netWorthDelta >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-[0_12px_0_0_#D4D4D4] max-h-[90vh] overflow-y-auto space-y-4">
        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#58CC02] border-2 border-[#46A302] shadow-[0_4px_0_0_#388402] flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-2">
            📅
          </div>
          <span className="text-xs font-black uppercase text-[#58CC02] tracking-widest block">
            Quarterly Settlement Complete
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Advanced to {log.quarter}
          </h2>
        </div>

        {/* Macroeconomic Event Banner */}
        <div className="bg-[#FFF9E6] border-2 border-[#FCE194] rounded-2xl p-4 shadow-[0_2px_0_0_#E9C86A]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">⚡</span>
            <span className="text-xs font-black uppercase text-amber-950">
              Macroeconomic Event: {log.majorEventTitle}
            </span>
          </div>
          <p className="text-xs font-bold text-amber-900">
            {log.majorEventDescription}
          </p>
        </div>

        {/* Net Worth Delta Pill */}
        <div className="bg-[#FAFDF7] border-2 border-[#B6EAA0] rounded-2xl p-3 sm:p-4 text-center">
          <span className="text-[10px] sm:text-xs font-extrabold uppercase text-slate-600 block mb-0.5">
            Consolidated Net Worth Transition
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono-numbers text-slate-900 truncate">
            ₦{log.endingNetWorthNaira.toLocaleString()}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 mt-1">
            <span className={`text-[11px] sm:text-xs font-black font-mono-numbers ${isNetWorthUp ? 'text-emerald-800' : 'text-rose-700'}`}>
              {isNetWorthUp ? '+' : ''}₦{netWorthDelta.toLocaleString()} this quarter
            </span>
            <span className="text-[11px] sm:text-xs text-slate-600 font-bold">
              (from ₦{log.startingNetWorthNaira.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Cash Flow Breakdown */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-2 text-xs font-extrabold text-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Quarterly Incomes (Salary, Rent, Yields):</span>
            <span className="font-mono-numbers text-emerald-800">
              +{formatNaira(log.totalIncomeMinor + log.investmentReturnsMinor)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600">Quarterly Living Expenses & Ajo Dues:</span>
            <span className="font-mono-numbers text-rose-700">
              -{formatNaira(log.totalExpensesMinor)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="text-slate-600 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-700" />
              Estimated Inflation Drag:
            </span>
            <span className="font-mono-numbers text-rose-700">
              -₦{log.inflationDragNaira.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <DuolingoButton
          variant="green"
          size="lg"
          fullWidth
          onClick={onClose}
        >
          <span>Continue Simulation</span>
        </DuolingoButton>
      </div>
    </div>
  );
};
