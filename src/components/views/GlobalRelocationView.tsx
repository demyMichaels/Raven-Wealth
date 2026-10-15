/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { DuolingoCard } from '../common/DuolingoCard';
import { DuolingoButton } from '../common/DuolingoButton';
import { CONTINENTS } from '../../data/globalWorldData';
import { ContinentCode, CountryModule, CurrencyCode } from '../../types/wealth';
import { formatMoney, minorToMajor, majorToMinor } from '../../utils/formatters';
import {
  Globe2,
  PlaneTakeoff,
  ShieldAlert,
  Building,
  CheckCircle2,
  Search,
  Vote,
  UserCheck,
  Landmark,
  Scale,
  TrendingUp,
  AlertTriangle,
  Award,
  Edit3,
  PlusCircle,
  RotateCcw,
  Calendar,
  X,
  ChevronRight,
  Sliders,
  DollarSign,
  Shield,
  Layers,
} from 'lucide-react';

export const GlobalRelocationView: React.FC = () => {
  const {
    player,
    relocateToCountry,
    fsrMetrics,
    countries,
    updateCountry,
    addCountry,
    resetCountriesToDefaults,
  } = useSimulation();

  const [selectedContinent, setSelectedContinent] = useState<ContinentCode | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGovType, setSelectedGovType] = useState<string>('ALL');
  const [showOnlyUpcomingElections, setShowOnlyUpcomingElections] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(player.countryCode || 'NG');
  const [relocationFeedback, setRelocationFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Mobile navigation tabs inside dossier
  const [activeDossierTab, setActiveDossierTab] = useState<'governance' | 'economy' | 'visas'>('governance');
  const [mobileShowCountryPicker, setMobileShowCountryPicker] = useState(false);

  // Edit Country Modal state
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [editLeaderHeadOfState, setEditLeaderHeadOfState] = useState('');
  const [editLeaderHeadOfGov, setEditLeaderHeadOfGov] = useState('');
  const [editLeaderTitle, setEditLeaderTitle] = useState('');
  const [editLeaderInOfficeSince, setEditLeaderInOfficeSince] = useState(2023);
  const [editLeaderParty, setEditLeaderParty] = useState('');
  const [editGovType, setEditGovType] = useState('');
  const [editElectionCycle, setEditElectionCycle] = useState(4);
  const [editLastElectionYear, setEditLastElectionYear] = useState(2023);
  const [editNextElectionYear, setEditNextElectionYear] = useState(2027);
  const [editStabilityIndex, setEditStabilityIndex] = useState(50);
  const [editRuleOfLawIndex, setEditRuleOfLawIndex] = useState(50);
  const [editEaseOfBusiness, setEditEaseOfBusiness] = useState(60);
  const [editCorruptionIndex, setEditCorruptionIndex] = useState(40);
  const [editRisksText, setEditRisksText] = useState('');
  const [editIncomeTaxTop, setEditIncomeTaxTop] = useState(25);
  const [editCorporateTax, setEditCorporateTax] = useState(25);
  const [editCapitalGainsTax, setEditCapitalGainsTax] = useState(10);
  const [editWorldwideTax, setEditWorldwideTax] = useState(false);
  const [editCostOfLivingIndex, setEditCostOfLivingIndex] = useState(100);

  // Add Country Modal state
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const [newCountryCode, setNewCountryCode] = useState('');
  const [newCountryName, setNewCountryName] = useState('');
  const [newContinent, setNewContinent] = useState<ContinentCode>('AF');
  const [newCurrency, setNewCurrency] = useState<CurrencyCode>('USD');
  const [newCapitalCity, setNewCapitalCity] = useState('');
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newGovType, setNewGovType] = useState('Federal Presidential Republic');
  const [newNextElection, setNewNextElection] = useState(2028);

  const continentList: Array<{ code: ContinentCode | 'ALL'; name: string; icon: string }> = [
    { code: 'ALL', name: 'All Continents', icon: '🌐' },
    { code: 'AF', name: 'Africa', icon: '🌍' },
    { code: 'EU', name: 'Europe', icon: '🏰' },
    { code: 'NA', name: 'North America', icon: '🗽' },
    { code: 'AS', name: 'Asia & Middle East', icon: '🏙️' },
    { code: 'SA', name: 'South America', icon: '⛰️' },
    { code: 'OC', name: 'Oceania', icon: '🏖️' },
  ];

  const governmentTypes = [
    'ALL',
    'Presidential',
    'Parliamentary',
    'Monarchy',
    'Semi-Presidential',
  ];

  const currentYear = fsrMetrics.year;

  // Filtered countries
  const filteredCountries = countries.filter((c) => {
    const matchContinent = selectedContinent === 'ALL' || c.continentCode === selectedContinent;
    const matchSearch =
      c.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.capitalCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.countryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.leader.headOfState.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.leader.headOfGovernment && c.leader.headOfGovernment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.leader.partyOrCoalition && c.leader.partyOrCoalition.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchGov =
      selectedGovType === 'ALL' ||
      c.governance.governmentType.toLowerCase().includes(selectedGovType.toLowerCase());
    const electionDiff = c.governance.nextElectionYear - currentYear;
    const matchUpcomingElection = !showOnlyUpcomingElections || (electionDiff >= 0 && electionDiff <= 2);

    return matchContinent && matchSearch && matchGov && matchUpcomingElection;
  });

  const selectedCountry = countries.find((c) => c.countryCode === selectedCountryCode) || countries[0];

  const handleApplyVisa = (visaId: string) => {
    const res = relocateToCountry(selectedCountry.countryCode, visaId);
    setRelocationFeedback(res);
    setTimeout(() => {
      setRelocationFeedback(null);
    }, 6000);
  };

  const openEditModal = (c: CountryModule) => {
    setEditLeaderHeadOfState(c.leader.headOfState);
    setEditLeaderHeadOfGov(c.leader.headOfGovernment || '');
    setEditLeaderTitle(c.leader.title);
    setEditLeaderInOfficeSince(c.leader.inOfficeSince);
    setEditLeaderParty(c.leader.partyOrCoalition || '');
    setEditGovType(c.governance.governmentType);
    setEditElectionCycle(c.governance.electionCycleYears);
    setEditLastElectionYear(c.governance.lastElectionYear);
    setEditNextElectionYear(c.governance.nextElectionYear);
    setEditStabilityIndex(c.governance.politicalStabilityIndex);
    setEditRuleOfLawIndex(c.governance.ruleOfLawIndex);
    setEditEaseOfBusiness(c.governance.easeOfDoingBusinessScore);
    setEditCorruptionIndex(c.governance.corruptionPerceptionIndex);
    setEditRisksText(c.governance.majorPoliticalRisks.join('\n'));
    setEditIncomeTaxTop(c.taxRegime.incomeTaxTopRate);
    setEditCorporateTax(c.taxRegime.corporateTaxRate);
    setEditCapitalGainsTax(c.taxRegime.capitalGainsTaxRate);
    setEditWorldwideTax(c.taxRegime.worldwideTaxation);
    setEditCostOfLivingIndex(c.costOfLivingIndex);
    setIsEditingCountry(true);
  };

  const handleSaveCountryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const risksArray = editRisksText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    updateCountry(selectedCountry.countryCode, {
      costOfLivingIndex: editCostOfLivingIndex,
      leader: {
        ...selectedCountry.leader,
        headOfState: editLeaderHeadOfState,
        headOfGovernment: editLeaderHeadOfGov || undefined,
        title: editLeaderTitle,
        inOfficeSince: Number(editLeaderInOfficeSince),
        partyOrCoalition: editLeaderParty || undefined,
      },
      governance: {
        ...selectedCountry.governance,
        governmentType: editGovType,
        electionCycleYears: Number(editElectionCycle),
        lastElectionYear: Number(editLastElectionYear),
        nextElectionYear: Number(editNextElectionYear),
        politicalStabilityIndex: Number(editStabilityIndex),
        ruleOfLawIndex: Number(editRuleOfLawIndex),
        easeOfDoingBusinessScore: Number(editEaseOfBusiness),
        corruptionPerceptionIndex: Number(editCorruptionIndex),
        majorPoliticalRisks: risksArray.length > 0 ? risksArray : selectedCountry.governance.majorPoliticalRisks,
      },
      taxRegime: {
        ...selectedCountry.taxRegime,
        incomeTaxTopRate: Number(editIncomeTaxTop),
        corporateTaxRate: Number(editCorporateTax),
        capitalGainsTaxRate: Number(editCapitalGainsTax),
        worldwideTaxation: editWorldwideTax,
      },
    });

    setIsEditingCountry(false);
  };

  const handleSaveNewCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountryCode || !newCountryName) return;

    const code = newCountryCode.trim().toUpperCase().substring(0, 2);
    const newEntry: CountryModule = {
      countryCode: code,
      countryName: newCountryName.trim(),
      continentCode: newContinent,
      currencyCode: newCurrency,
      capitalCity: newCapitalCity || 'Capital',
      sovereignRating: 'BBB',
      costOfLivingIndex: 200,
      baselineQuarterlyExpensesMinor: majorToMinor(3000, newCurrency),
      capitalControlsActive: false,
      maxMonthlyCardFxLimitUsd: 25000,
      wireTransferTaxPercent: 0,
      leader: {
        headOfState: newLeaderName || 'State Leader',
        title: 'Head of State',
        inOfficeSince: 2024,
      },
      governance: {
        governmentType: newGovType,
        electionCycleYears: 4,
        lastElectionYear: currentYear - 1,
        nextElectionYear: Number(newNextElection),
        politicalStabilityIndex: 65,
        ruleOfLawIndex: 60,
        easeOfDoingBusinessScore: 70,
        corruptionPerceptionIndex: 50,
        majorPoliticalRisks: ['Macroeconomic policy calibration', 'Regional trade flows'],
      },
      macro: {
        gdpNominalUsdBillions: 100,
        populationMillions: 20,
        primaryExports: ['Commodities & Agriculture', 'Manufactured Goods'],
        fxRegime: 'Free Floating',
        sovereignDebtToGdpPercent: 55.0,
      },
      visaPathways: [
        {
          id: `${code.toLowerCase()}_general_entry`,
          name: `${newCountryName} Skilled Investor & Entrepreneur Visa`,
          description: 'Legal residency pathway with commercial establishment rights.',
          costMinor: majorToMinor(1000, newCurrency),
          currencyCode: newCurrency,
          proofOfFundsMinor: majorToMinor(25000, newCurrency),
          processingQuarters: 2,
          qualifications: 'Proof of commercial activity or qualified employment contract.',
        },
      ],
      taxRegime: {
        incomeTaxTopRate: 25,
        corporateTaxRate: 20,
        capitalGainsTaxRate: 15,
        worldwideTaxation: false,
        description: 'Standard statutory tax framework.',
      },
    };

    addCountry(newEntry);
    setSelectedCountryCode(code);
    setIsAddingCountry(false);
    setNewCountryCode('');
    setNewCountryName('');
  };

  const isCurrentCountry = player.countryCode === selectedCountry.countryCode;
  const yearsUntilElection = selectedCountry.governance.nextElectionYear - currentYear;
  const isElectionApproaching = yearsUntilElection <= 1 && yearsUntilElection >= 0;

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
      {/* Header Banner - Mobile-first padding and flex */}
      <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 shadow-[0_4px_0_0_#D4D4D4]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase text-[#1CB0F6] tracking-wider">
                International Wealth Mobility
              </span>
              <span className="text-xs text-slate-400 font-bold">·</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-extrabold">
                {countries.length} Granular Sovereign Jurisdictions
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight mt-0.5">
              Global Geopolitics & Relocation Engine
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 max-w-2xl">
              Model real-life international mobility constraints, sovereign elections, tax residency, and capital controls across 6 continents.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="bg-[#FAFDF7] border-2 border-[#B6EAA0] rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-left sm:text-right">
              <span className="text-[9px] font-black uppercase text-slate-500 block">
                Current Domicile
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 block truncate max-w-[140px] sm:max-w-none">
                {countries.find((c) => c.countryCode === player.countryCode)?.countryName || 'Nigeria'}
              </span>
              <span className="text-[10px] font-extrabold text-[#58CC02] uppercase block">
                {player.residencyStatus}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <DuolingoButton
                variant="white"
                size="sm"
                onClick={() => setIsAddingCountry(true)}
                className="!py-2 !px-2.5 text-xs font-black"
                title="Register a new country into the simulation"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#58CC02]" />
                <span className="hidden xs:inline">Add Nation</span>
              </DuolingoButton>

              <button
                onClick={resetCountriesToDefaults}
                title="Reset countries to official default database"
                className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Relocation Notification Feedback */}
      {relocationFeedback && (
        <div
          className={`p-3.5 sm:p-4 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center gap-3 transition-all ${
            relocationFeedback.success
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-[0_2px_0_0_#059669]'
              : 'bg-rose-50 border-rose-300 text-rose-800 shadow-[0_2px_0_0_#E11D48]'
          }`}
        >
          {relocationFeedback.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
          <span>{relocationFeedback.message}</span>
        </div>
      )}

      {/* Continents Filter Bar - Smooth horizontal scroll on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
        {continentList.map((cont) => {
          const isActive = selectedContinent === cont.code;
          return (
            <button
              key={cont.code}
              onClick={() => setSelectedContinent(cont.code)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl border-2 font-black text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1CB0F6] border-[#1899D6] text-white shadow-[0_3px_0_0_#137CB0]'
                  : 'bg-white border-[#E5E5E5] text-slate-600 hover:text-slate-800 shadow-[0_3px_0_0_#D4D4D4]'
              }`}
            >
              <span>{cont.icon}</span>
              <span>{cont.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search, Gov Filter & Upcoming Elections Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white border-2 border-[#E5E5E5] p-2.5 sm:p-3 rounded-2xl shadow-[0_2px_0_0_#D4D4D4]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search country, capital, leader, party or ISO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs font-bold text-slate-800 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#1CB0F6]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {governmentTypes.map((gt) => (
            <button
              key={gt}
              onClick={() => setSelectedGovType(gt)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-black uppercase whitespace-nowrap transition-colors ${
                selectedGovType === gt
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {gt}
            </button>
          ))}

          <button
            onClick={() => setShowOnlyUpcomingElections(!showOnlyUpcomingElections)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-black uppercase whitespace-nowrap transition-colors ${
              showOnlyUpcomingElections
                ? 'bg-amber-400 border-amber-500 text-amber-950 font-black'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Vote className="w-3 h-3" />
            <span>Elections Soon</span>
          </button>
        </div>
      </div>

      {/* Mobile Country Selector Button (opens bottom picker or modal) */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileShowCountryPicker(true)}
          className="w-full flex items-center justify-between p-3.5 bg-[#EBF7FF] border-2 border-[#1CB0F6] rounded-2xl shadow-[0_3px_0_0_#137CB0] text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">
              {selectedCountry.countryCode === 'NG' ? '🇳🇬' : selectedCountry.countryCode === 'GB' ? '🇬🇧' : selectedCountry.countryCode === 'US' ? '🇺🇸' : selectedCountry.countryCode === 'AE' ? '🇦🇪' : selectedCountry.countryCode === 'CA' ? '🇨🇦' : selectedCountry.countryCode === 'DE' ? '🇩🇪' : selectedCountry.countryCode === 'SG' ? '🇸🇬' : selectedCountry.countryCode === 'CH' ? '🇨🇭' : selectedCountry.countryCode === 'ZA' ? '🇿🇦' : selectedCountry.countryCode === 'KE' ? '🇰🇪' : selectedCountry.countryCode === 'GH' ? '🇬🇭' : selectedCountry.countryCode === 'RW' ? '🇷🇼' : selectedCountry.countryCode === 'EG' ? '🇪🇬' : selectedCountry.countryCode === 'MA' ? '🇲🇦' : selectedCountry.countryCode === 'ET' ? '🇪🇹' : selectedCountry.countryCode === 'MU' ? '🇲🇺' : selectedCountry.countryCode === 'SN' ? '🇸🇳' : selectedCountry.countryCode === 'CI' ? '🇨🇮' : selectedCountry.countryCode === 'FR' ? '🇫🇷' : selectedCountry.countryCode === 'IT' ? '🇮🇹' : selectedCountry.countryCode === 'ES' ? '🇪🇸' : selectedCountry.countryCode === 'NL' ? '🇳🇱' : selectedCountry.countryCode === 'IE' ? '🇮🇪' : selectedCountry.countryCode === 'LU' ? '🇱🇺' : selectedCountry.countryCode === 'PT' ? '🇵🇹' : selectedCountry.countryCode === 'MX' ? '🇲🇽' : selectedCountry.countryCode === 'PA' ? '🇵🇦' : selectedCountry.countryCode === 'JP' ? '🇯🇵' : selectedCountry.countryCode === 'CN' ? '🇨🇳' : selectedCountry.countryCode === 'IN' ? '🇮🇳' : selectedCountry.countryCode === 'SA' ? '🇸🇦' : selectedCountry.countryCode === 'QA' ? '🇶🇦' : selectedCountry.countryCode === 'HK' ? '🇭🇰' : selectedCountry.countryCode === 'BR' ? '🇧🇷' : selectedCountry.countryCode === 'AR' ? '🇦🇷' : selectedCountry.countryCode === 'CL' ? '🇨🇱' : selectedCountry.countryCode === 'CO' ? '🇨🇴' : selectedCountry.countryCode === 'AU' ? '🇦🇺' : selectedCountry.countryCode === 'NZ' ? '🇳🇿' : '🌍'}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900">
                  {selectedCountry.countryName}
                </span>
                <span className="text-[10px] font-black text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {selectedCountry.countryCode}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-600">
                {selectedCountry.leader.headOfState} · {selectedCountry.governance.governmentType}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-[#1CB0F6]">
            <span>Change</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Main Grid: Country Registry Column (Desktop) + Selected Country Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desktop Country Selector Column */}
        <div className="hidden lg:block space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Sovereign Registry ({filteredCountries.length})
            </h3>
            <span className="text-[11px] font-bold text-slate-600">Click to inspect</span>
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto no-scrollbar pr-1">
            {filteredCountries.map((c) => {
              const isSelected = selectedCountryCode === c.countryCode;
              const isHome = player.countryCode === c.countryCode;
              const electionInYears = c.governance.nextElectionYear - currentYear;
              const hasUpcomingElection = electionInYears <= 1 && electionInYears >= 0;

              return (
                <div
                  key={c.countryCode}
                  onClick={() => setSelectedCountryCode(c.countryCode)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#1CB0F6] bg-[#EBF7FF] shadow-[0_2px_0_0_#137CB0]'
                      : 'border-[#E5E5E5] bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {c.countryCode === 'NG' ? '🇳🇬' : c.countryCode === 'GB' ? '🇬🇧' : c.countryCode === 'US' ? '🇺🇸' : c.countryCode === 'AE' ? '🇦🇪' : c.countryCode === 'CA' ? '🇨🇦' : c.countryCode === 'DE' ? '🇩🇪' : c.countryCode === 'SG' ? '🇸🇬' : c.countryCode === 'CH' ? '🇨🇭' : c.countryCode === 'ZA' ? '🇿🇦' : c.countryCode === 'KE' ? '🇰🇪' : c.countryCode === 'GH' ? '🇬🇭' : c.countryCode === 'RW' ? '🇷🇼' : c.countryCode === 'EG' ? '🇪🇬' : c.countryCode === 'MA' ? '🇲🇦' : c.countryCode === 'ET' ? '🇪🇹' : c.countryCode === 'MU' ? '🇲🇺' : c.countryCode === 'SN' ? '🇸🇳' : c.countryCode === 'CI' ? '🇨🇮' : c.countryCode === 'FR' ? '🇫🇷' : c.countryCode === 'IT' ? '🇮🇹' : c.countryCode === 'ES' ? '🇪🇸' : c.countryCode === 'NL' ? '🇳🇱' : c.countryCode === 'IE' ? '🇮🇪' : c.countryCode === 'LU' ? '🇱🇺' : c.countryCode === 'PT' ? '🇵🇹' : c.countryCode === 'MX' ? '🇲🇽' : c.countryCode === 'PA' ? '🇵🇦' : c.countryCode === 'JP' ? '🇯🇵' : c.countryCode === 'CN' ? '🇨🇳' : c.countryCode === 'IN' ? '🇮🇳' : c.countryCode === 'SA' ? '🇸🇦' : c.countryCode === 'QA' ? '🇶🇦' : c.countryCode === 'HK' ? '🇭🇰' : c.countryCode === 'BR' ? '🇧🇷' : c.countryCode === 'AR' ? '🇦🇷' : c.countryCode === 'CL' ? '🇨🇱' : c.countryCode === 'CO' ? '🇨🇴' : c.countryCode === 'AU' ? '🇦🇺' : c.countryCode === 'NZ' ? '🇳🇿' : '🌍'}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-800 truncate">
                            {c.countryName}
                          </span>
                          <span className="text-[9px] font-black text-slate-600 bg-slate-100 px-1 rounded">
                            {c.countryCode}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 block truncate max-w-[150px]">
                          {c.leader.headOfState}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-black font-mono-numbers text-slate-700 block">
                        {c.sovereignRating}
                      </span>
                      {hasUpcomingElection && (
                        <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-1 py-0.2 rounded block">
                          Vote '{c.governance.nextElectionYear.toString().slice(-2)}
                        </span>
                      )}
                      {isHome && (
                        <span className="text-[8px] font-black uppercase text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded block mt-0.5">
                          Home
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Country Dossier Panel (2 columns wide on desktop, 1 on mobile) */}
        <div className="lg:col-span-2 space-y-4">
          <DuolingoCard className="!p-4 sm:!p-6">
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">
                  {selectedCountry.countryCode === 'NG' ? '🇳🇬' : selectedCountry.countryCode === 'GB' ? '🇬🇧' : selectedCountry.countryCode === 'US' ? '🇺🇸' : selectedCountry.countryCode === 'AE' ? '🇦🇪' : selectedCountry.countryCode === 'CA' ? '🇨🇦' : selectedCountry.countryCode === 'DE' ? '🇩🇪' : selectedCountry.countryCode === 'SG' ? '🇸🇬' : selectedCountry.countryCode === 'CH' ? '🇨🇭' : selectedCountry.countryCode === 'ZA' ? '🇿🇦' : selectedCountry.countryCode === 'KE' ? '🇰🇪' : selectedCountry.countryCode === 'GH' ? '🇬🇭' : selectedCountry.countryCode === 'RW' ? '🇷🇼' : selectedCountry.countryCode === 'EG' ? '🇪🇬' : selectedCountry.countryCode === 'MA' ? '🇲🇦' : selectedCountry.countryCode === 'ET' ? '🇪🇹' : selectedCountry.countryCode === 'MU' ? '🇲🇺' : selectedCountry.countryCode === 'SN' ? '🇸🇳' : selectedCountry.countryCode === 'CI' ? '🇨🇮' : selectedCountry.countryCode === 'FR' ? '🇫🇷' : selectedCountry.countryCode === 'IT' ? '🇮🇹' : selectedCountry.countryCode === 'ES' ? '🇪🇸' : selectedCountry.countryCode === 'NL' ? '🇳🇱' : selectedCountry.countryCode === 'IE' ? '🇮🇪' : selectedCountry.countryCode === 'LU' ? '🇱🇺' : selectedCountry.countryCode === 'PT' ? '🇵🇹' : selectedCountry.countryCode === 'MX' ? '🇲🇽' : selectedCountry.countryCode === 'PA' ? '🇵🇦' : selectedCountry.countryCode === 'JP' ? '🇯🇵' : selectedCountry.countryCode === 'CN' ? '🇨🇳' : selectedCountry.countryCode === 'IN' ? '🇮🇳' : selectedCountry.countryCode === 'SA' ? '🇸🇦' : selectedCountry.countryCode === 'QA' ? '🇶🇦' : selectedCountry.countryCode === 'HK' ? '🇭🇰' : selectedCountry.countryCode === 'BR' ? '🇧🇷' : selectedCountry.countryCode === 'AR' ? '🇦🇷' : selectedCountry.countryCode === 'CL' ? '🇨🇱' : selectedCountry.countryCode === 'CO' ? '🇨🇴' : selectedCountry.countryCode === 'AU' ? '🇦🇺' : selectedCountry.countryCode === 'NZ' ? '🇳🇿' : '🌍'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                      {selectedCountry.countryName}
                    </h2>
                    <span className="text-xs font-black uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                      {selectedCountry.countryCode}
                    </span>
                    <span className="text-xs font-black bg-blue-100 text-[#1CB0F6] px-2 py-0.5 rounded-lg">
                      {CONTINENTS[selectedCountry.continentCode]?.name || selectedCountry.continentCode}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    Capital: {selectedCountry.capitalCity} · Currency: {selectedCountry.currencyCode} · Sovereign Rating: {selectedCountry.sovereignRating}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <DuolingoButton
                  variant="white"
                  size="sm"
                  onClick={() => openEditModal(selectedCountry)}
                  className="!py-1.5 !px-3 text-xs font-black"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-700" />
                  <span>Edit Data</span>
                </DuolingoButton>

                {isCurrentCountry ? (
                  <span className="px-3 py-1.5 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-800 font-black text-xs uppercase">
                    Current Domicile
                  </span>
                ) : (
                  <DuolingoButton
                    variant="blue"
                    size="sm"
                    onClick={() => {
                      if (selectedCountry.visaPathways.length > 0) {
                        handleApplyVisa(selectedCountry.visaPathways[0].id);
                      }
                    }}
                    className="!py-1.5 !px-3 text-xs font-black"
                  >
                    <PlaneTakeoff className="w-3.5 h-3.5" />
                    <span>Relocate</span>
                  </DuolingoButton>
                )}
              </div>
            </div>

            {/* Dossier Tabs - Makes mobile reading clean and organized */}
            <div className="flex items-center gap-2 my-3 border-b-2 border-slate-100 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'governance', label: '🏛️ Governance & Leaders' },
                { id: 'economy', label: '📊 Economy & Taxes' },
                { id: 'visas', label: `✈️ Visa Pathways (${selectedCountry.visaPathways.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDossierTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                    activeDossierTab === tab.id
                      ? 'bg-slate-900 text-white shadow-[0_2px_0_0_#1e293b]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: GOVERNANCE & LEADERSHIP */}
            {activeDossierTab === 'governance' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Leadership Strip */}
                <div className="bg-[#FFFDF9] border-2 border-[#E8E2D6] rounded-2xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-600 block">
                        Head of State & Government
                      </span>
                      <h4 className="text-base font-black text-slate-900">
                        {selectedCountry.leader.headOfState}
                      </h4>
                      {selectedCountry.leader.headOfGovernment && (
                        <p className="text-xs font-bold text-slate-600">
                          Head of Government: {selectedCountry.leader.headOfGovernment}
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-black text-slate-800 block">
                        {selectedCountry.leader.title}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">
                        In Office Since {selectedCountry.leader.inOfficeSince}
                        {selectedCountry.leader.partyOrCoalition && ` · ${selectedCountry.leader.partyOrCoalition}`}
                      </span>
                    </div>
                  </div>

                  {/* Constitutional & Election Schedule */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-2">
                      <span className="text-[9px] font-black uppercase text-slate-600 block">
                        Government Type
                      </span>
                      <span className="text-xs font-black text-slate-800 block leading-tight mt-0.5">
                        {selectedCountry.governance.governmentType}
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-2">
                      <span className="text-[9px] font-black uppercase text-slate-600 block">
                        Election Cycle
                      </span>
                      <span className="text-xs font-black text-slate-800 block mt-0.5">
                        {selectedCountry.governance.electionCycleYears > 0 ? `Every ${selectedCountry.governance.electionCycleYears} Years` : 'Non-Electoral'}
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-2">
                      <span className="text-[9px] font-black uppercase text-slate-600 block">
                        Next Election Year
                      </span>
                      <span className={`text-xs font-black block mt-0.5 ${isElectionApproaching ? 'text-amber-800' : 'text-slate-800'}`}>
                        {selectedCountry.governance.nextElectionYear} {isElectionApproaching && '⚠️'}
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-2">
                      <span className="text-[9px] font-black uppercase text-slate-600 block">
                        Last Election Year
                      </span>
                      <span className="text-xs font-black text-slate-800 block mt-0.5">
                        {selectedCountry.governance.lastElectionYear}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Governance Scores Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-2.5">
                    <span className="text-[10px] font-black uppercase text-slate-600 block">
                      Political Stability
                    </span>
                    <span className="text-base font-black font-mono-numbers text-slate-900 block mt-0.5">
                      {selectedCountry.governance.politicalStabilityIndex} <span className="text-xs font-bold text-slate-600">/100</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-2.5">
                    <span className="text-[10px] font-black uppercase text-slate-600 block">
                      Rule of Law
                    </span>
                    <span className="text-base font-black font-mono-numbers text-slate-900 block mt-0.5">
                      {selectedCountry.governance.ruleOfLawIndex} <span className="text-xs font-bold text-slate-600">/100</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-2.5">
                    <span className="text-[10px] font-black uppercase text-slate-600 block">
                      Ease of Doing Biz
                    </span>
                    <span className="text-base font-black font-mono-numbers text-slate-900 block mt-0.5">
                      {selectedCountry.governance.easeOfDoingBusinessScore} <span className="text-xs font-bold text-slate-600">/100</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-2.5">
                    <span className="text-[10px] font-black uppercase text-slate-600 block">
                      Corruption Index
                    </span>
                    <span className="text-base font-black font-mono-numbers text-slate-900 block mt-0.5">
                      {selectedCountry.governance.corruptionPerceptionIndex} <span className="text-xs font-bold text-slate-600">/100</span>
                    </span>
                  </div>
                </div>

                {/* Major Political Risk Factors Strip */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
                    <span>Identified Political & Policy Risks:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs font-bold text-amber-900">
                    {selectedCountry.governance.majorPoliticalRisks.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: ECONOMY & TAX REGIME */}
            {activeDossierTab === 'economy' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Macro Economic Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5">
                    <span className="text-[9px] font-black uppercase text-slate-600 block">
                      Nominal GDP
                    </span>
                    <span className="text-sm font-black font-mono-numbers text-slate-800 block mt-0.5">
                      ${selectedCountry.macro.gdpNominalUsdBillions} Billion
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">Pop: {selectedCountry.macro.populationMillions}M</span>
                  </div>

                  <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5">
                    <span className="text-[9px] font-black uppercase text-slate-600 block">
                      FX Regime
                    </span>
                    <span className="text-sm font-black text-slate-800 block mt-0.5 truncate">
                      {selectedCountry.macro.fxRegime}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">Currency: {selectedCountry.currencyCode}</span>
                  </div>

                  <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5">
                    <span className="text-[9px] font-black uppercase text-slate-600 block">
                      Public Debt/GDP
                    </span>
                    <span className="text-sm font-black font-mono-numbers text-slate-800 block mt-0.5">
                      {selectedCountry.macro.sovereignDebtToGdpPercent}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">Credit: {selectedCountry.sovereignRating}</span>
                  </div>

                  <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-xl p-2.5">
                    <span className="text-[9px] font-black uppercase text-slate-600 block">
                      Capital Controls
                    </span>
                    <span className={`text-sm font-black block mt-0.5 ${selectedCountry.capitalControlsActive ? 'text-amber-700' : 'text-emerald-800'}`}>
                      {selectedCountry.capitalControlsActive ? 'Active' : 'Unrestricted'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">Card: ${selectedCountry.maxMonthlyCardFxLimitUsd}/mo</span>
                  </div>
                </div>

                {/* Primary Export Basket */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 flex flex-wrap items-center gap-1.5">
                  <span className="font-black text-slate-800 uppercase text-[10px]">
                    Primary Export Commodities:
                  </span>
                  {selectedCountry.macro.primaryExports.map((exp, idx) => (
                    <span key={idx} className="bg-white border border-slate-300 rounded-md px-2 py-0.5 text-[11px] text-slate-800 font-black">
                      {exp}
                    </span>
                  ))}
                </div>

                {/* Tax Regime Blueprint */}
                <div className="bg-[#FFFDF9] border-2 border-[#E8E2D6] rounded-2xl p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h4 className="text-sm font-black text-slate-800">
                      Sovereign Tax System & Private Wealth Exposure
                    </h4>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${selectedCountry.taxRegime.worldwideTaxation ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                      {selectedCountry.taxRegime.worldwideTaxation ? 'Worldwide Taxation' : 'Territorial / Remittance'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 my-3 text-center">
                    <div className="bg-white border border-slate-200 rounded-xl p-2">
                      <span className="text-[9px] font-black uppercase text-slate-600 block">
                        Top Personal Rate
                      </span>
                      <span className="text-base font-black font-mono-numbers text-slate-900">
                        {selectedCountry.taxRegime.incomeTaxTopRate}%
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-2">
                      <span className="text-[9px] font-black uppercase text-slate-600 block">
                        Corporate Tax
                      </span>
                      <span className="text-base font-black font-mono-numbers text-slate-900">
                        {selectedCountry.taxRegime.corporateTaxRate}%
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-2">
                      <span className="text-[9px] font-black uppercase text-slate-600 block">
                        Capital Gains
                      </span>
                      <span className="text-base font-black font-mono-numbers text-slate-900">
                        {selectedCountry.taxRegime.capitalGainsTaxRate}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    {selectedCountry.taxRegime.description}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: VISAS & IMMIGRATION PATHWAYS */}
            {activeDossierTab === 'visas' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                {selectedCountry.visaPathways.map((visa) => (
                  <div
                    key={visa.id}
                    className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#1CB0F6] transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">
                          {visa.name}
                        </h4>
                        <p className="text-xs font-bold text-slate-600 mt-0.5">
                          {visa.description}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs font-black font-mono-numbers text-slate-900 block">
                          Fee: {formatMoney(visa.costMinor, visa.currencyCode)}
                        </span>
                        <span className="text-[11px] font-bold text-slate-600">
                          Proof of Funds: {formatMoney(visa.proofOfFundsMinor, visa.currencyCode)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs font-bold text-slate-600">
                      <span>Lead Time: {visa.processingQuarters} Quarters · {visa.qualifications}</span>

                      {!isCurrentCountry && (
                        <DuolingoButton
                          variant="blue"
                          size="sm"
                          onClick={() => handleApplyVisa(visa.id)}
                          className="!py-1.5 !px-3 text-xs font-black self-end sm:self-auto"
                        >
                          <PlaneTakeoff className="w-3.5 h-3.5" />
                          <span>Apply & Relocate</span>
                        </DuolingoButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DuolingoCard>
        </div>
      </div>

      {/* MOBILE COUNTRY PICKER BOTTOM SHEET */}
      {mobileShowCountryPicker && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setMobileShowCountryPicker(false)}
          />
          <div className="relative bg-white border-t-2 border-[#E5E5E5] rounded-t-3xl p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] max-h-[85vh] overflow-y-auto z-10 space-y-3">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Select Sovereign Nation
                </h3>
                <span className="text-xs font-bold text-slate-600">
                  {filteredCountries.length} countries matching filters
                </span>
              </div>
              <button
                onClick={() => setMobileShowCountryPicker(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filteredCountries.map((c) => {
                const isSelected = selectedCountryCode === c.countryCode;
                const isHome = player.countryCode === c.countryCode;

                return (
                  <button
                    key={c.countryCode}
                    onClick={() => {
                      setSelectedCountryCode(c.countryCode);
                      setMobileShowCountryPicker(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#1CB0F6] bg-[#EBF7FF]'
                        : 'border-[#E5E5E5] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">
                        {c.countryCode === 'NG' ? '🇳🇬' : c.countryCode === 'GB' ? '🇬🇧' : c.countryCode === 'US' ? '🇺🇸' : c.countryCode === 'AE' ? '🇦🇪' : c.countryCode === 'CA' ? '🇨🇦' : c.countryCode === 'DE' ? '🇩🇪' : c.countryCode === 'SG' ? '🇸🇬' : c.countryCode === 'CH' ? '🇨🇭' : c.countryCode === 'ZA' ? '🇿🇦' : c.countryCode === 'KE' ? '🇰🇪' : c.countryCode === 'GH' ? '🇬🇭' : c.countryCode === 'RW' ? '🇷🇼' : c.countryCode === 'EG' ? '🇪🇬' : c.countryCode === 'MA' ? '🇲🇦' : c.countryCode === 'ET' ? '🇪🇹' : c.countryCode === 'MU' ? '🇲🇺' : c.countryCode === 'SN' ? '🇸🇳' : c.countryCode === 'CI' ? '🇨🇮' : c.countryCode === 'FR' ? '🇫🇷' : c.countryCode === 'IT' ? '🇮🇹' : c.countryCode === 'ES' ? '🇪🇸' : c.countryCode === 'NL' ? '🇳🇱' : c.countryCode === 'IE' ? '🇮🇪' : c.countryCode === 'LU' ? '🇱🇺' : c.countryCode === 'PT' ? '🇵🇹' : c.countryCode === 'MX' ? '🇲🇽' : c.countryCode === 'PA' ? '🇵🇦' : c.countryCode === 'JP' ? '🇯🇵' : c.countryCode === 'CN' ? '🇨🇳' : c.countryCode === 'IN' ? '🇮🇳' : c.countryCode === 'SA' ? '🇸🇦' : c.countryCode === 'QA' ? '🇶🇦' : c.countryCode === 'HK' ? '🇭🇰' : c.countryCode === 'BR' ? '🇧🇷' : c.countryCode === 'AR' ? '🇦🇷' : c.countryCode === 'CL' ? '🇨🇱' : c.countryCode === 'CO' ? '🇨🇴' : c.countryCode === 'AU' ? '🇦🇺' : c.countryCode === 'NZ' ? '🇳🇿' : '🌍'}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-900">
                            {c.countryName}
                          </span>
                          <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-1 rounded">
                            {c.countryCode}
                          </span>
                          {isHome && (
                            <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-1 rounded">
                              Home
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-600 block">
                          {c.leader.headOfState} · {c.governance.governmentType}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono-numbers text-slate-700">
                      {c.sovereignRating}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* EDIT COUNTRY MODAL */}
      {isEditingCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 max-w-xl w-full shadow-[0_8px_24px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  Edit Sovereign Dynamics: {selectedCountry.countryName}
                </h3>
                <p className="text-xs font-bold text-slate-600">
                  Update leaders, election schedules, and tax regimes dynamically.
                </p>
              </div>
              <button
                onClick={() => setIsEditingCountry(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCountryEdit} className="space-y-4 text-xs font-bold text-slate-700">
              {/* Leader Info */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-[#1CB0F6] block">
                  1. Executive Leadership
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block mb-1 text-slate-600">Head of State</label>
                    <input
                      type="text"
                      value={editLeaderHeadOfState}
                      onChange={(e) => setEditLeaderHeadOfState(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-600">Head of Government (Prime Minister)</label>
                    <input
                      type="text"
                      value={editLeaderHeadOfGov}
                      onChange={(e) => setEditLeaderHeadOfGov(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block mb-1 text-slate-600">Leader Title</label>
                    <input
                      type="text"
                      value={editLeaderTitle}
                      onChange={(e) => setEditLeaderTitle(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-600">In Office Since (Year)</label>
                    <input
                      type="number"
                      value={editLeaderInOfficeSince}
                      onChange={(e) => setEditLeaderInOfficeSince(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-600">Ruling Party / Coalition</label>
                  <input
                    type="text"
                    value={editLeaderParty}
                    onChange={(e) => setEditLeaderParty(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                  />
                </div>
              </div>

              {/* Governance & Elections */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-[#1CB0F6] block">
                  2. Constitutional Order & Election Cycles
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block mb-1 text-slate-600">Government Type</label>
                    <input
                      type="text"
                      value={editGovType}
                      onChange={(e) => setEditGovType(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-600">Election Cycle (Years, 0 if None)</label>
                    <input
                      type="number"
                      value={editElectionCycle}
                      onChange={(e) => setEditElectionCycle(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block mb-1 text-slate-600">Last Election Year</label>
                    <input
                      type="number"
                      value={editLastElectionYear}
                      onChange={(e) => setEditLastElectionYear(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-600">Next Scheduled Election</label>
                    <input
                      type="number"
                      value={editNextElectionYear}
                      onChange={(e) => setEditNextElectionYear(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Stability & Risk Indices */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-[#1CB0F6] block">
                  3. Governance Scores (0 - 100)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600">Stability</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editStabilityIndex}
                      onChange={(e) => setEditStabilityIndex(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600">Rule of Law</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editRuleOfLawIndex}
                      onChange={(e) => setEditRuleOfLawIndex(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600">Ease of Biz</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editEaseOfBusiness}
                      onChange={(e) => setEditEaseOfBusiness(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600">CPI</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editCorruptionIndex}
                      onChange={(e) => setEditCorruptionIndex(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-600">Key Political Risks (One per line)</label>
                  <textarea
                    rows={3}
                    value={editRisksText}
                    onChange={(e) => setEditRisksText(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                  />
                </div>
              </div>

              {/* Tax Regime */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-[#1CB0F6] block">
                  4. Tax Rates & Cost of Living
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600">Top Income Tax %</label>
                    <input
                      type="number"
                      value={editIncomeTaxTop}
                      onChange={(e) => setEditIncomeTaxTop(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600">Corporate %</label>
                    <input
                      type="number"
                      value={editCorporateTax}
                      onChange={(e) => setEditCorporateTax(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600">CGT %</label>
                    <input
                      type="number"
                      value={editCapitalGainsTax}
                      onChange={(e) => setEditCapitalGainsTax(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="worldwideTaxCheckbox"
                    checked={editWorldwideTax}
                    onChange={(e) => setEditWorldwideTax(e.target.checked)}
                    className="w-4 h-4 text-[#1CB0F6] rounded"
                  />
                  <label htmlFor="worldwideTaxCheckbox" className="text-xs font-bold text-slate-800">
                    Enforces Worldwide Income Taxation on Tax Residents
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingCountry(false)}
                  className="px-4 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <DuolingoButton variant="green" size="sm" type="submit">
                  Save Sovereign Updates
                </DuolingoButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW SOVEREIGN NATION MODAL */}
      {isAddingCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-[0_8px_24px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  Register New Sovereign Jurisdiction
                </h3>
                <p className="text-xs font-bold text-slate-600">
                  Add any country with custom governance and financial parameters.
                </p>
              </div>
              <button
                onClick={() => setIsAddingCountry(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewCountry} className="space-y-3.5 text-xs font-bold text-slate-700">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block mb-1 text-slate-600">Country ISO Code (e.g. TZ, PL)</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={newCountryCode}
                    onChange={(e) => setNewCountryCode(e.target.value.toUpperCase())}
                    placeholder="TZ"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl uppercase font-mono-numbers focus:border-[#1CB0F6] outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">Country Name</label>
                  <input
                    type="text"
                    required
                    value={newCountryName}
                    onChange={(e) => setNewCountryName(e.target.value)}
                    placeholder="Tanzania"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block mb-1 text-slate-600">Continent</label>
                  <select
                    value={newContinent}
                    onChange={(e) => setNewContinent(e.target.value as ContinentCode)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl bg-white"
                  >
                    <option value="AF">Africa</option>
                    <option value="EU">Europe</option>
                    <option value="NA">North America</option>
                    <option value="AS">Asia & Middle East</option>
                    <option value="SA">South America</option>
                    <option value="OC">Oceania</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">Primary Currency</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="AED">AED</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="ZAR">ZAR</option>
                    <option value="KES">KES</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block mb-1 text-slate-600">Capital City</label>
                  <input
                    type="text"
                    value={newCapitalCity}
                    onChange={(e) => setNewCapitalCity(e.target.value)}
                    placeholder="Dodoma"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">Current Leader / President</label>
                  <input
                    type="text"
                    value={newLeaderName}
                    onChange={(e) => setNewLeaderName(e.target.value)}
                    placeholder="Samia Suluhu Hassan"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block mb-1 text-slate-600">Government Type</label>
                  <input
                    type="text"
                    value={newGovType}
                    onChange={(e) => setNewGovType(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">Next Election Year</label>
                  <input
                    type="number"
                    value={newNextElection}
                    onChange={(e) => setNewNextElection(Number(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-[#1CB0F6] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingCountry(false)}
                  className="px-4 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <DuolingoButton variant="green" size="sm" type="submit">
                  Register Nation
                </DuolingoButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
