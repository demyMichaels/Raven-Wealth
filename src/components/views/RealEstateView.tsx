/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { DuolingoCard } from '../common/DuolingoCard';
import { DuolingoButton } from '../common/DuolingoButton';
import { RealProperty, PropertyManager, PropertyRemittance, CurrencyCode } from '../../types/wealth';
import { formatMoney, minorToMajor, majorToMinor } from '../../utils/formatters';
import {
  Building2,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Receipt,
  FileCheck2,
  DollarSign,
} from 'lucide-react';

export const RealEstateView: React.FC = () => {
  const {
    properties,
    propertyManagers,
    remittances,
    approveRemittance,
    buyAsset,
    player,
    assets,
  } = useSimulation();

  const [showAcquireModal, setShowAcquireModal] = useState(false);
  const [newPropName, setNewPropName] = useState('2-Bedroom Rental Apartment (Lekki Phase 1)');
  const [newPropType, setNewPropType] = useState<RealProperty['propertyType']>('residential_apartment');
  const [newPropAddress, setNewPropAddress] = useState('Admiralty Way, Lekki Phase 1, Lagos');
  const [newPropCity, setNewPropCity] = useState('Lagos');
  const [newPropCountry, setNewPropCountry] = useState('NG');
  const [newPropCurrency, setNewPropCurrency] = useState<CurrencyCode>('NGN');
  const [newPropTitle, setNewPropTitle] = useState<RealProperty['titleType']>('Governors_Consent');
  const [newPropCost, setNewPropCost] = useState('25000000'); // ₦25M
  const [newPropYield, setNewPropYield] = useState(9.5); // 9.5% annual rental yield
  const [assignedManager, setAssignedManager] = useState(propertyManagers[0]?.id || '');

  const liquidAsset = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency);
  const liquidCashMajor = liquidAsset ? minorToMajor(liquidAsset.currentValueMinor, player.primaryCurrency) : 0;

  // Real estate opportunity presets
  const propertyPresets = [
    {
      name: 'Residential Land Plot (600sqm) - Ibeju-Lekki Corridor',
      type: 'land_plot' as const,
      address: 'Dangote Refinery Axis, Ibeju-Lekki',
      city: 'Lagos',
      country: 'NG',
      currency: 'NGN' as CurrencyCode,
      title: 'Certificate_of_Occupancy' as const,
      cost: 12_000_000,
      yield: 0, // Land appreciation
      desc: 'Prime plot in growth corridor with authentic C of O registered with Lagos Lands Registry.',
    },
    {
      name: '2-Bedroom Serviced Shortlet Flat - Victoria Island',
      type: 'shortlet_unit' as const,
      address: 'Adeola Odeku Street, Victoria Island',
      city: 'Lagos',
      country: 'NG',
      currency: 'NGN' as CurrencyCode,
      title: 'Governors_Consent' as const,
      cost: 45_000_000,
      yield: 14.5,
      desc: 'High-occupancy corporate shortlet generating premium quarterly cash flow.',
    },
    {
      name: '1-Bedroom Buy-to-Let Apartment - Canary Wharf, London',
      type: 'residential_apartment' as const,
      address: 'Marsh Wall, Isle of Dogs, London E14',
      city: 'London',
      country: 'GB',
      currency: 'GBP' as CurrencyCode,
      title: 'Leasehold' as const,
      cost: 420_000, // £420,000
      yield: 6.2,
      desc: 'Tier-1 global financial capital asset generating stable hard-currency Sterling rental yield.',
    },
  ];

  const handleSelectPreset = (p: typeof propertyPresets[0]) => {
    setNewPropName(p.name);
    setNewPropType(p.type);
    setNewPropAddress(p.address);
    setNewPropCity(p.city);
    setNewPropCountry(p.country);
    setNewPropCurrency(p.currency);
    setNewPropTitle(p.title);
    setNewPropCost(p.cost.toString());
    setNewPropYield(p.yield);
  };

  const handleAcquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(newPropCost) || 0;
    if (cost <= 0) return;

    const minorCost = majorToMinor(cost, newPropCurrency);

    // Calculate quarterly gross rent based on yield
    const annualGrossRent = (cost * (newPropYield / 100));
    const quarterlyGross = annualGrossRent / 4;
    const quarterlyOperating = quarterlyGross * 0.15; // 15% maintenance

    // Add to assets and properties
    const success = buyAsset({
      assetType: 'real_estate',
      name: newPropName,
      currencyCode: newPropCurrency,
      acquisitionCostMinor: minorCost,
      currentValueMinor: minorCost,
      countryCode: newPropCountry,
      expectedAnnualYieldPercent: newPropYield,
      liquidityDays: 180,
      isLiquid: false,
      notes: `Title: ${newPropTitle} · Address: ${newPropAddress}`,
    });

    if (success) {
      setShowAcquireModal(false);
    } else {
      alert(`Insufficient funds in your account! Available: ₦${liquidCashMajor.toLocaleString()}`);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 shadow-[0_4px_0_0_#D4D4D4]">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#1CB0F6] tracking-wider">
              Real Estate & Property Delegation
            </span>
            <span className="text-xs text-slate-400 font-bold">·</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold">Lagos · London · Global</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight mt-0.5">
            Property Holdings & Remittances Hub
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 max-w-2xl">
            Acquire titled physical real estate with verified Certificates of Occupancy and delegate letting operations to professional property managers with quarterly remittance reconciliation.
          </p>
        </div>

        <DuolingoButton
          variant="green"
          size="sm"
          onClick={() => setShowAcquireModal(true)}
          className="!py-2 text-xs font-black w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Acquire Property</span>
        </DuolingoButton>
      </div>

      {/* Property Managers Delegation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {propertyManagers.map((mgr) => (
          <DuolingoCard key={mgr.id} variant="white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF7FF] border-2 border-[#A8DEF8] flex items-center justify-center text-2xl font-black shrink-0">
                  👨‍💼
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1CB0F6] uppercase">
                      {mgr.countryCode === 'NG' ? '🇳🇬 Lagos Letting Agent' : '🇬🇧 UK Property Manager'}
                    </span>
                    <span className="text-xs text-slate-600 font-bold">·</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      Score: {mgr.reliabilityScore}/10
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-800 mt-0.5">
                    {mgr.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-600">{mgr.firmName}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t-2 border-slate-100 text-center">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] font-black uppercase text-slate-600 block">
                  Management Fee
                </span>
                <span className="text-xs font-black text-slate-800 font-mono-numbers">
                  {mgr.managementFeePercent}%
                </span>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] font-black uppercase text-slate-600 block">
                  Properties Managed
                </span>
                <span className="text-xs font-black text-slate-800 font-mono-numbers">
                  {mgr.propertiesCount} Units
                </span>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] font-black uppercase text-slate-600 block">
                  Total Remitted
                </span>
                <span className="text-xs font-black text-emerald-800 font-mono-numbers">
                  {formatMoney(mgr.totalRemittedMinor, mgr.currencyCode, { compact: true })}
                </span>
              </div>
            </div>
          </DuolingoCard>
        ))}
      </div>

      {/* Pending Remittance Approvals Strip */}
      <DuolingoCard>
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-800">
              Rental Remittance Reconciliation
            </h3>
            <p className="text-xs font-bold text-slate-600">
              Review and approve rental disbursements received from your delegated property managers
            </p>
          </div>
        </div>

        {remittances.length === 0 ? (
          <div className="py-8 text-center text-slate-600 font-bold text-xs">
            No remittances logged yet. As you acquire rental apartments and advance quarters, quarterly rent statements will appear here.
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-100 pt-2">
            {remittances.map((rem) => {
              const manager = propertyManagers.find((m) => m.id === rem.managerId);
              return (
                <div key={rem.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-[#58CC02]">
                        {rem.quarter} Statement
                      </span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs font-mono-numbers text-slate-600 font-bold">{rem.paymentReference}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 mt-0.5">
                      Net Remittance: {formatMoney(rem.netRemittedMinor, rem.currencyCode)}
                    </h4>
                    <p className="text-xs font-bold text-slate-600">
                      Gross: {formatMoney(rem.grossAmountMinor, rem.currencyCode)} · Fee ({manager?.managementFeePercent}%): -{formatMoney(rem.managementFeeMinor, rem.currencyCode)} · Maintenance: -{formatMoney(rem.maintenanceDeductionsMinor, rem.currencyCode)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {rem.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Reconciled & Credited</span>
                      </span>
                    ) : (
                      <DuolingoButton
                        variant="green"
                        size="sm"
                        onClick={() => approveRemittance(rem.id)}
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Approve & Credit Cash</span>
                      </DuolingoButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DuolingoCard>

      {/* Property Acquisition Modal */}
      {showAcquireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 max-w-xl w-full shadow-[0_8px_0_0_#D4D4D4] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-800">
                Acquire Real Property
              </h3>
              <button
                onClick={() => setShowAcquireModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-slate-600 mb-3">
              Select a verified Nigerian or global real estate opportunity:
            </p>

            {/* Presets List */}
            <div className="space-y-2 mb-4">
              {propertyPresets.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    newPropName === p.name
                      ? 'border-[#58CC02] bg-[#FAFDF7] shadow-[0_2px_0_0_#388402]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">
                      {p.name}
                    </span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {p.currency === 'NGN' ? `₦${(p.cost / 1_000_000).toFixed(0)}M` : `£${(p.cost / 1_000).toFixed(0)}k`}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAcquireSubmit} className="space-y-4 pt-2 border-t-2 border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Title Documentation
                  </label>
                  <select
                    value={newPropTitle}
                    onChange={(e) => setNewPropTitle(e.target.value as any)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#58CC02]"
                  >
                    <option value="Certificate_of_Occupancy">Certificate of Occupancy (C of O)</option>
                    <option value="Governors_Consent">Governor's Consent (Lagos Lands)</option>
                    <option value="Freehold">Freehold Title</option>
                    <option value="Leasehold">Long-Term Leasehold</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Assigned Property Manager
                  </label>
                  <select
                    value={assignedManager}
                    onChange={(e) => setAssignedManager(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#58CC02]"
                  >
                    {propertyManagers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.managementFeePercent}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-[#FAFDF7] border-2 border-[#B6EAA0] rounded-xl p-3 text-xs font-bold text-slate-700">
                <span className="block font-black text-[#58CC02] uppercase mb-0.5">
                  Title Due Diligence Notice
                </span>
                Purchasing real estate locks capital into an illiquid hard asset while providing rent cash flows and protecting purchasing power against inflation.
              </div>

              <DuolingoButton variant="green" fullWidth type="submit">
                Execute Property Acquisition
              </DuolingoButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
