/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { DuolingoCard } from '../common/DuolingoCard';
import { DuolingoButton } from '../common/DuolingoButton';
import { BusinessEnterprise, DynastyTrust } from '../../types/wealth';
import { formatMoney, minorToMajor, majorToMinor } from '../../utils/formatters';
import {
  Landmark,
  Plus,
  Building,
  Factory,
  ShieldCheck,
  CheckCircle2,
  Users2,
  Scroll,
  TrendingUp,
} from 'lucide-react';

export const BusinessDynastyView: React.FC = () => {
  const {
    businesses,
    dynastyTrusts,
    player,
    assets,
    buyAsset,
  } = useSimulation();

  const [showLaunchBizModal, setShowLaunchBizModal] = useState(false);
  const [showTrustModal, setShowTrustModal] = useState(false);

  // Business launch form state
  const [bizName, setBizName] = useState('Titan Agro-Allied Processing Ltd');
  const [bizIndustry, setBizIndustry] = useState('Agro-Processing & Grain Storage');
  const [bizCapex, setBizCapex] = useState('5000000'); // ₦5M seed capex

  // Trust form state
  const [trustName, setTrustName] = useState('Michaels Family Dynasty Trust');
  const [trustJurisdiction, setTrustJurisdiction] = useState('Nigeria (Irrevocable Private Trust)');

  const liquidAsset = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency);
  const liquidCashMajor = liquidAsset ? minorToMajor(liquidAsset.currentValueMinor, player.primaryCurrency) : 0;

  const handleLaunchBizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const capex = parseFloat(bizCapex) || 0;
    if (capex <= 0) return;

    const capexMinor = majorToMinor(capex, 'NGN');
    const success = buyAsset({
      assetType: 'business_equity',
      name: `${bizName} (100% Equity)`,
      currencyCode: 'NGN',
      acquisitionCostMinor: capexMinor,
      currentValueMinor: capexMinor,
      countryCode: player.countryCode,
      expectedAnnualYieldPercent: 24.0, // High operating return
      liquidityDays: 365,
      isLiquid: false,
      notes: `Operating commercial enterprise: ${bizIndustry}`,
    });

    if (success) {
      setShowLaunchBizModal(false);
    } else {
      alert(`Insufficient liquid cash balance! Available: ₦${liquidCashMajor.toLocaleString()}`);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 shadow-[0_4px_0_0_#D4D4D4]">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#58CC02] tracking-wider">
              Industrial Scale & Generational Legacy
            </span>
            <span className="text-xs text-slate-400 font-bold">·</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold">Pan-African Conglomerate Path</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight mt-0.5">
            Closely-Held Businesses & Dynasty Trusts
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 max-w-2xl">
            Transition from wage earning to commercial enterprise ownership, scale manufacturing capex, and protect family assets across generations through irrevocable trusts.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          <DuolingoButton
            variant="blue"
            size="sm"
            onClick={() => setShowTrustModal(true)}
            className="!py-2 text-xs font-black"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Establish Trust</span>
          </DuolingoButton>
          <DuolingoButton
            variant="green"
            size="sm"
            onClick={() => setShowLaunchBizModal(true)}
            className="!py-2 text-xs font-black"
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Launch Venture</span>
          </DuolingoButton>
        </div>
      </div>

      {/* Industrial Growth Stages Strip */}
      <DuolingoCard className="bg-white">
        <h3 className="text-base font-black text-slate-800 mb-2">
          The Industrialist Ladder: From ₦200,000 to Titan
        </h3>
        <p className="text-xs font-bold text-slate-600 mb-4">
          Mastering private wealth management dynamics in Africa requires climbing from liquidity reserves to productive commercial assets:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-[#FAFDF7] border-2 border-[#B6EAA0] rounded-2xl p-3.5">
            <span className="text-[10px] font-black uppercase text-[#58CC02] block">
              Stage 1: Liquidity Cushion
            </span>
            <h4 className="text-sm font-black text-slate-800 mt-0.5">
              ₦200k - ₦2M Reserve
            </h4>
            <p className="text-[11px] font-bold text-slate-600 mt-1">
              6-month emergency fund, CBN Treasury Bills, and Ajo rotational pools for forced savings discipline.
            </p>
          </div>

          <div className="bg-[#F6FBFE] border-2 border-[#A8DEF8] rounded-2xl p-3.5">
            <span className="text-[10px] font-black uppercase text-[#1CB0F6] block">
              Stage 2: Hard Asset Ownership
            </span>
            <h4 className="text-sm font-black text-slate-800 mt-0.5">
              ₦10M - ₦50M Real Estate
            </h4>
            <p className="text-[11px] font-bold text-slate-600 mt-1">
              Titled land plots in Lagos/Epe, rental apartments with delegated property managers, and USD Dom hedges.
            </p>
          </div>

          <div className="bg-[#FFF9E6] border-2 border-[#FCE194] rounded-2xl p-3.5">
            <span className="text-[10px] font-black uppercase text-amber-950 block">
              Stage 3: Enterprise Building
            </span>
            <h4 className="text-sm font-black text-slate-800 mt-0.5">
              ₦50M - ₦500M Operating Capex
            </h4>
            <p className="text-[11px] font-bold text-slate-600 mt-1">
              Agro-processing plants, cold-chain haulage fleets, and local import-substitution manufacturing.
            </p>
          </div>

          <div className="bg-[#FBF5FF] border-2 border-[#D8B4FE] rounded-2xl p-3.5">
            <span className="text-[10px] font-black uppercase text-purple-700 block">
              Stage 4: Dynasty Preservation
            </span>
            <h4 className="text-sm font-black text-slate-800 mt-0.5">
              ₦1 Billion+ Conglomerate
            </h4>
            <p className="text-[11px] font-bold text-slate-600 mt-1">
              Irrevocable dynasty trusts, family constitution, pan-African expansion, and community foundation endowments.
            </p>
          </div>
        </div>
      </DuolingoCard>

      {/* Dynasty Trust Card */}
      <DuolingoCard variant="cream">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#E8E2D6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 border-2 border-purple-200 flex items-center justify-center font-black">
              📜
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                Family Governance & Dynasty Trust
              </h3>
              <p className="text-xs font-bold text-slate-600">
                Shielding family assets against probate disputes, creditors, and multi-generational dilution
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
            Status: Drafting Family Charter
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-3">
            <span className="text-[10px] font-black uppercase text-slate-600 block">
              Trust Structure
            </span>
            <span className="text-sm font-black text-slate-800 block mt-0.5">
              Irrevocable Discretionary Trust
            </span>
            <span className="text-[11px] font-bold text-emerald-800">Spendthrift Clause Active</span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-3">
            <span className="text-[10px] font-black uppercase text-slate-600 block">
              Trust Protector
            </span>
            <span className="text-sm font-black text-slate-800 block mt-0.5">
              Independent Senior Legal Counsel
            </span>
            <span className="text-[11px] font-bold text-slate-600">Fiduciary Oversight</span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-3">
            <span className="text-[10px] font-black uppercase text-slate-600 block">
              Family Governance Score
            </span>
            <span className="text-sm font-black text-slate-800 block mt-0.5 font-mono-numbers">
              85 / 100
            </span>
            <span className="text-[11px] font-bold text-slate-600">Charter Codified</span>
          </div>
        </div>

        <div className="bg-white border-2 border-[#E8E2D6] rounded-xl p-3 text-xs font-bold text-slate-700">
          <span className="block font-black text-slate-900 uppercase mb-0.5">
            Key Rule of Dynasty Perpetuity:
          </span>
          Assets placed into the trust no longer belong to Demilade as an individual; they are insulated from business liabilities and pass seamlessly to named beneficiaries (sister Dunni and future heirs) without inheritance tax or probate freezes.
        </div>
      </DuolingoCard>

      {/* Launch Venture Modal */}
      {showLaunchBizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 max-w-md w-full shadow-[0_8px_0_0_#D4D4D4]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-800">
                Capitalize Commercial Enterprise
              </h3>
              <button
                onClick={() => setShowLaunchBizModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLaunchBizSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#58CC02]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Industry & Sector
                </label>
                <input
                  type="text"
                  required
                  value={bizIndustry}
                  onChange={(e) => setBizIndustry(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#58CC02]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Seed Equity Capitalization (₦)
                </label>
                <input
                  type="number"
                  min={500000}
                  value={bizCapex}
                  onChange={(e) => setBizCapex(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#58CC02]"
                />
              </div>

              <div className="bg-[#FAFDF7] border-2 border-[#B6EAA0] rounded-xl p-3 text-xs font-bold text-slate-700">
                Operating businesses produce quarterly cash flow distributions and unlock industrialist prestige scores in the simulation.
              </div>

              <DuolingoButton variant="green" fullWidth type="submit">
                Incorporate & Fund Company
              </DuolingoButton>
            </form>
          </div>
        </div>
      )}

      {/* Trust Modal */}
      {showTrustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 max-w-md w-full shadow-[0_8px_0_0_#D4D4D4]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-800">
                Establish Family Dynasty Trust
              </h3>
              <button
                onClick={() => setShowTrustModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Trust Entity Name
                </label>
                <input
                  type="text"
                  value={trustName}
                  onChange={(e) => setTrustName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Jurisdiction & Governing Law
                </label>
                <select
                  value={trustJurisdiction}
                  onChange={(e) => setTrustJurisdiction(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                >
                  <option value="Nigeria (CAMPA 2020 Irrevocable Trust)">Nigeria (CAMPA 2020 Irrevocable Trust)</option>
                  <option value="Jersey / Guernsey Offshore Trust">Jersey / Guernsey Offshore Trust</option>
                  <option value="Liechtenstein Family Foundation">Liechtenstein Family Foundation</option>
                  <option value="Dubai International Financial Centre (DIFC) Trust">Dubai (DIFC Private Family Trust)</option>
                </select>
              </div>

              <div className="bg-[#FAFDF7] border-2 border-[#B6EAA0] rounded-xl p-3 text-xs font-bold text-slate-700">
                The Trust deed will include a spendthrift clause preventing creditors from attaching beneficiary shares, and earmark annual education distributions for your siblings and descendants.
              </div>

              <DuolingoButton
                variant="green"
                fullWidth
                onClick={() => {
                  alert('Michaels Family Dynasty Trust charter formalised!');
                  setShowTrustModal(false);
                }}
              >
                Execute Trust Settlement Deed
              </DuolingoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
