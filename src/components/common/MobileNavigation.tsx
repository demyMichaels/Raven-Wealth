/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  PieChart,
  TrendingUp,
  MoreHorizontal,
  Building2,
  Users2,
  Globe2,
  Landmark,
  X,
  RotateCcw,
} from 'lucide-react';
import { useSimulation } from '../../state/simulationContext';
import { formatNaira } from '../../utils/formatters';

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, setActiveTab }) => {
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const { totalNetWorthNaira, resetSimulation, player } = useSimulation();

  const isMoreTabActive = ['realestate', 'ajo', 'global', 'dynasty'].includes(activeTab);

  const primaryTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'objectives', label: 'Goals', icon: Target },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
  ];

  const secondaryTabs = [
    {
      id: 'realestate',
      label: 'Property & Remittances',
      icon: Building2,
      desc: 'Acquire titled plots & manage letting agents',
      badge: 'Real Estate',
    },
    {
      id: 'ajo',
      label: 'Ajo / Esusu Syndicates',
      icon: Users2,
      desc: 'Peer rotational savings pools & lump sums',
      badge: 'Social Capital',
    },
    {
      id: 'global',
      label: 'Global Relocation & Visas',
      icon: Globe2,
      desc: 'Immigration pathways & political stability',
      badge: '6 Continents',
    },
    {
      id: 'dynasty',
      label: 'Dynasty Trusts & Enterprise',
      icon: Landmark,
      desc: 'Pan-African conglomerates & family governance',
      badge: 'Legacy',
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setShowMoreDrawer(false);
  };

  return (
    <>
      {/* Slide-Up More Navigation Drawer (Mobile Bottom Sheet) */}
      {showMoreDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowMoreDrawer(false)}
          />
          <div className="relative bg-white border-t-2 border-[#E5E5E5] rounded-t-3xl p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] max-h-[85vh] overflow-y-auto z-10 space-y-4">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto" />

            <div className="flex items-center justify-between pb-2 border-b-2 border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Wealth Command Centers
                </h3>
                <span className="text-xs font-bold text-slate-600">
                  Net Worth: {formatNaira(BigInt(Math.round(totalNetWorthNaira * 100)), true)}
                </span>
              </div>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hub Links */}
            <div className="grid grid-cols-1 gap-2.5">
              {secondaryTabs.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#1CB0F6] bg-[#EBF7FF] shadow-[0_2px_0_0_#137CB0]'
                        : 'border-[#E5E5E5] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                        isSelected
                          ? 'bg-[#1CB0F6] text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900 truncate">
                          {item.label}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-600 truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                Logged in as {player.fullName}
              </span>
              <button
                onClick={() => {
                  if (confirm('Reset simulation state to ₦200,000 starting profile?')) {
                    resetSimulation();
                    setShowMoreDrawer(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-700 hover:text-rose-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Fixed Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#E5E5E5] px-1.5 pt-1 pb-[calc(0.35rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#1CB0F6] font-black'
                    : 'text-slate-600 hover:text-slate-800 font-bold'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive ? 'scale-110 bg-[#EBF7FF]' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[62px]">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* 5th Button: More / Hub */}
          <button
            onClick={() => setShowMoreDrawer(true)}
            className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 rounded-xl transition-all ${
              isMoreTabActive
                ? 'text-[#58CC02] font-black'
                : 'text-slate-600 hover:text-slate-800 font-bold'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-transform ${
                isMoreTabActive ? 'scale-110 bg-[#F2FDE6]' : ''
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[62px]">
              {isMoreTabActive ? 'More (Active)' : 'More'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
