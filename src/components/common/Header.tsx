/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSimulation } from '../../state/simulationContext';
import { DuolingoButton } from './DuolingoButton';
import { formatNaira } from '../../utils/formatters';
import { COUNTRIES } from '../../data/globalWorldData';
import { Play, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onAdvanceQuarterClick: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdvanceQuarterClick, activeTab, setActiveTab }) => {
  const { player, fsrMetrics, totalNetWorthNaira, googleLiveSnapshot, fetchGoogleLiveMarket, syncGoogleWithSimulation, countries } = useSimulation();

  const currentCountry = (countries || COUNTRIES).find((c) => c.countryCode === player.countryCode);
  const countryFlag = player.countryCode === 'NG' ? '🇳🇬' : player.countryCode === 'GB' ? '🇬🇧' : player.countryCode === 'US' ? '🇺🇸' : player.countryCode === 'AE' ? '🇦🇪' : player.countryCode === 'CA' ? '🇨🇦' : '🌍';

  const handleSyncGoogle = async () => {
    await fetchGoogleLiveMarket();
    syncGoogleWithSimulation();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-[#E5E5E5] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (Compact on mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#58CC02] border-2 border-[#46A302] shadow-[0_3px_0_0_#388402] flex items-center justify-center text-white font-black text-lg sm:text-xl shrink-0">
              T
            </div>
            <div>
              <span className="text-base sm:text-xl font-black text-slate-800 tracking-tight block leading-tight">
                TitanWealth
              </span>
              <span className="text-[10px] sm:text-[11px] font-black text-slate-600 block uppercase tracking-wider truncate max-w-[140px] sm:max-w-none">
                {countryFlag} {currentCountry?.countryName || 'Nigeria'} · {fsrMetrics.quarter}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-extrabold text-slate-600">
          {[
            { id: 'dashboard', label: 'Overview' },
            { id: 'objectives', label: 'Goals' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'markets', label: 'Google Live & FSR' },
            { id: 'realestate', label: 'Property' },
            { id: 'ajo', label: 'Ajo Pool' },
            { id: 'global', label: 'Global Relocate' },
            { id: 'dynasty', label: 'Dynasty' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap shrink-0 transition-colors ${
                activeTab === item.id ? 'text-[#58CC02] border-b-2 border-[#58CC02] pb-0.5' : 'hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Net Worth Summary & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Net Worth Indicator - visible on mobile and desktop */}
          <div className="bg-[#FFFDF9] border-2 border-[#E5E5E5] rounded-xl px-2 sm:px-2.5 py-1 text-right">
            <span className="text-[8px] sm:text-[9px] font-black text-slate-500 block uppercase tracking-wider leading-none">
              Net Worth
            </span>
            <span className="text-[11px] sm:text-sm font-black font-mono-numbers text-slate-900 block leading-tight">
              {formatNaira(BigInt(Math.round(totalNetWorthNaira * 100)), true)}
            </span>
          </div>

          {/* Google Live Sync Button */}
          <button
            onClick={handleSyncGoogle}
            disabled={googleLiveSnapshot.isLoading}
            title="Fetch real-world stock prices and FX from Google"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-[#E5E5E5] shadow-[0_3px_0_0_#D4D4D4] flex items-center justify-center text-[#1CB0F6] hover:bg-[#EBF7FF] active:translate-y-1 active:shadow-none transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${googleLiveSnapshot.isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Primary Action: Advance Quarter CTA */}
          <DuolingoButton
            variant="green"
            size="sm"
            onClick={onAdvanceQuarterClick}
            className="whitespace-nowrap !py-1.5 sm:!py-2 !px-2.5 sm:!px-4 text-[11px] sm:text-xs font-black shrink-0"
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            <span className="hidden xs:inline">Next Quarter</span>
            <span className="xs:hidden">Next Q</span>
          </DuolingoButton>
        </div>
      </div>
    </header>
  );
};
