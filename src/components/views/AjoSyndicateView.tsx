/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { DuolingoCard } from '../common/DuolingoCard';
import { DuolingoButton } from '../common/DuolingoButton';
import { formatNaira, formatMoney, minorToMajor, majorToMinor } from '../../utils/formatters';
import {
  Users2,
  Plus,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Handshake,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export const AjoSyndicateView: React.FC = () => {
  const { ajoCycles, joinAjoCycle, player, assets } = useSimulation();

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newAjoName, setNewAjoName] = useState('Lagos Tech Founders & Operators Ajo');
  const [newAjoMonthly, setNewAjoMonthly] = useState('100000'); // ₦100,000/mo
  const [newAjoMembers, setNewAjoMembers] = useState(10);
  const [newAjoPayoutMonth, setNewAjoPayoutMonth] = useState(6);

  const liquidAsset = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency);
  const liquidCashMajor = liquidAsset ? minorToMajor(liquidAsset.currentValueMinor, player.primaryCurrency) : 0;

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const monthly = parseFloat(newAjoMonthly) || 0;
    if (monthly <= 0) return;

    joinAjoCycle({
      name: newAjoName,
      totalMembers: newAjoMembers,
      monthlyContributionMinor: majorToMinor(monthly, 'NGN'),
      currencyCode: 'NGN',
      cycleLengthMonths: newAjoMembers,
      playerPayoutMonth: newAjoPayoutMonth,
      status: 'active',
      organizerTrustScore: 9.0,
    });

    setShowJoinModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 shadow-[0_4px_0_0_#D4D4D4]">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#58CC02] tracking-wider">
              Traditional Peer Capital Formation
            </span>
            <span className="text-xs text-slate-400 font-bold">·</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold">Ajo / Esusu Syndicates</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight mt-0.5">
            Rotational Savings & Peer Syndicates
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 max-w-2xl">
            Leverage time-tested African rotational credit associations to force savings discipline, build social trust capital, and collect interest-free lump sums for major capital outlays.
          </p>
        </div>

        <DuolingoButton
          variant="green"
          size="sm"
          onClick={() => setShowJoinModal(true)}
          className="!py-2 text-xs font-black w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Join New Ajo</span>
        </DuolingoButton>
      </div>

      {/* Ajo Cycles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ajoCycles.map((cycle) => {
          const monthlyMajor = minorToMajor(cycle.monthlyContributionMinor, cycle.currencyCode);
          const lumpSumMajor = monthlyMajor * cycle.totalMembers;
          const paidMajor = minorToMajor(cycle.playerPaidSoFarMinor, cycle.currencyCode);
          const isPayoutQuarter = cycle.playerPayoutMonth >= cycle.currentTurnMonth && cycle.playerPayoutMonth <= cycle.currentTurnMonth + 2;

          return (
            <DuolingoCard key={cycle.id} variant="white">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F2FDE6] border-2 border-[#B6EAA0] flex items-center justify-center text-2xl font-black shrink-0">
                    🤝
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#58CC02] uppercase tracking-wider block">
                      Active Rotational Pool
                    </span>
                    <h3 className="text-base font-black text-slate-800 mt-0.5">
                      {cycle.name}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  Trust: {cycle.organizerTrustScore}/10
                </span>
              </div>

              {/* Lump Sum Highlight Box */}
              <div className="bg-[#FAFDF7] border-2 border-[#B6EAA0] rounded-2xl p-4 my-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-extrabold uppercase text-slate-600">
                    Your Scheduled Lump Sum Payout
                  </span>
                  <span className="text-xs font-black text-[#58CC02] uppercase">
                    Turn Month {cycle.playerPayoutMonth} of {cycle.cycleLengthMonths}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono-numbers text-slate-900">
                  ₦{lumpSumMajor.toLocaleString()}
                </div>
                <p className="text-[11px] font-bold text-slate-600 mt-1">
                  {isPayoutQuarter
                    ? '🎉 Payout active this quarter! Lump sum will be automatically credited to cash.'
                    : `Payout scheduled in Month ${cycle.playerPayoutMonth}. Current turn: Month ${cycle.currentTurnMonth}.`}
                </p>
              </div>

              {/* Cycle Stats Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t-2 border-slate-100 text-center">
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2">
                  <span className="text-[10px] font-black uppercase text-slate-600 block">
                    Monthly Dues
                  </span>
                  <span className="text-xs font-black text-slate-800 font-mono-numbers">
                    ₦{monthlyMajor.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2">
                  <span className="text-[10px] font-black uppercase text-slate-600 block">
                    Total Members
                  </span>
                  <span className="text-xs font-black text-slate-800 font-mono-numbers">
                    {cycle.totalMembers} Peers
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2">
                  <span className="text-[10px] font-black uppercase text-slate-600 block">
                    Paid to Date
                  </span>
                  <span className="text-xs font-black text-slate-800 font-mono-numbers">
                    ₦{paidMajor.toLocaleString()}
                  </span>
                </div>
              </div>
            </DuolingoCard>
          );
        })}
      </div>

      {/* Peer Syndicate Opportunities */}
      <DuolingoCard>
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-800">
              Co-Investment Syndicates & Angel Deals
            </h3>
            <p className="text-xs font-bold text-slate-600">
              Pooled capital opportunities with vetted friends and professional colleagues
            </p>
          </div>
        </div>

        <div className="divide-y-2 divide-slate-100 pt-1">
          <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-700 flex items-center justify-center font-black text-lg shrink-0">
                🚛
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#1CB0F6] uppercase">
                    Commercial Logistics Fleet Syndicate
                  </span>
                  <span className="text-xs text-slate-600">·</span>
                  <span className="text-xs font-bold text-emerald-800">22% Projected IRR</span>
                </div>
                <h4 className="text-sm font-black text-slate-800 mt-0.5">
                  Acquisition of 3 Used Howo 30-Ton Dump Trucks for Quarry Haulage
                </h4>
                <p className="text-xs font-bold text-slate-600">
                  Lead Sponsor: Engr. Femi Coker · Total Raise: ₦45,000,000 · Min Ticket: ₦1,000,000
                </p>
              </div>
            </div>

            <DuolingoButton
              variant="white"
              size="sm"
              onClick={() => alert('Deal review: Syndicate opens when liquid balance exceeds ₦1,000,000 minimum ticket.')}
            >
              Review Syndicate Memo
            </DuolingoButton>
          </div>
        </div>
      </DuolingoCard>

      {/* Join Ajo Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 max-w-md w-full shadow-[0_8px_0_0_#D4D4D4]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-800">
                Join Ajo / Esusu Cycle
              </h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Ajo Pool Name
                </label>
                <input
                  type="text"
                  required
                  value={newAjoName}
                  onChange={(e) => setNewAjoName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#58CC02]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Monthly Contribution (₦)
                </label>
                <input
                  type="number"
                  min={10000}
                  step={5000}
                  value={newAjoMonthly}
                  onChange={(e) => setNewAjoMonthly(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#58CC02]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Members Count
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={24}
                    value={newAjoMembers}
                    onChange={(e) => setNewAjoMembers(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#58CC02]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Your Payout Month
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={newAjoMembers}
                    value={newAjoPayoutMonth}
                    onChange={(e) => setNewAjoPayoutMonth(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#58CC02]"
                  />
                </div>
              </div>

              <div className="bg-[#FAFDF7] border-2 border-[#B6EAA0] rounded-xl p-3 text-xs font-bold text-slate-700">
                Total Lump Sum Payout will be{' '}
                <span className="font-black text-[#58CC02]">
                  ₦{((parseFloat(newAjoMonthly) || 0) * newAjoMembers).toLocaleString()}
                </span>{' '}
                upon your scheduled turn month.
              </div>

              <DuolingoButton variant="green" fullWidth type="submit">
                Confirm Membership & Auto-Dues
              </DuolingoButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
