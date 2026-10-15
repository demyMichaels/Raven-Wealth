/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { DuolingoCard } from '../common/DuolingoCard';
import { DuolingoButton } from '../common/DuolingoButton';
import { WealthObjective, ObjectiveCategory, ObjectivePriority, CurrencyCode } from '../../types/wealth';
import { formatMoney, minorToMajor, majorToMinor } from '../../utils/formatters';
import { WEALTH_OBJECTIVE_PRESETS, ObjectivePreset } from '../../data/objectivesPresets';
import {
  Target,
  Plus,
  Shield,
  ShieldAlert,
  HeartHandshake,
  Globe2,
  Landmark,
  Coins,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  TrendingUp,
  Sparkles,
  BookOpen,
  Calendar,
  Flame,
  Clock,
  ArrowRight,
  X,
  AlertTriangle,
  Umbrella,
  Compass,
  HeartPulse,
  Activity,
} from 'lucide-react';

export const ObjectivesView: React.FC = () => {
  const { objectives, addObjective, allocateToObjective, assets, player, fsrMetrics } = useSimulation();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showRetirementModal, setShowRetirementModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showSizerModal, setShowSizerModal] = useState(false);
  const [allocatingGoal, setAllocatingGoal] = useState<WealthObjective | null>(null);
  const [allocationInput, setAllocationInput] = useState<string>('50000');

  // Custom Objective Form State
  const [newCategory, setNewCategory] = useState<ObjectiveCategory>('capital_accumulation');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCurrency, setNewCurrency] = useState<CurrencyCode>(player.primaryCurrency || 'NGN');
  const [newTargetAmount, setNewTargetAmount] = useState('2000000');
  const [newTargetYear, setNewTargetYear] = useState(fsrMetrics.year + 3);
  const [newPriority, setNewPriority] = useState<ObjectivePriority>('high');
  const [newPurpose, setNewPurpose] = useState<'standard_of_living' | 'second_income' | 'financial_security' | 'retire_early' | 'grandchildren_legacy' | 'enjoy_investing'>('financial_security');
  const [newRiskType, setNewRiskType] = useState<'medical_expenses' | 'disability_income' | 'custodial_care' | 'premature_death' | 'property_liability_losses'>('medical_expenses');
  const [newRiskStrategy, setNewRiskStrategy] = useState<'hybrid_stop_loss' | 'retained_loss_reserve' | 'insurance_transfer'>('hybrid_stop_loss');
  const [newRetireAge, setNewRetireAge] = useState<number>(55);
  const [newLongevityAge, setNewLongevityAge] = useState<number>(90);
  const [newDistStrategy, setNewDistStrategy] = useState<'safe_withdrawal_4pct' | 'annuity_guaranteed' | 'cashflow_dividend_rental' | 'bucket_strategy'>('safe_withdrawal_4pct');

  // Presets Category Filter State
  const [presetCategoryFilter, setPresetCategoryFilter] = useState<string>('all');

  // Emergency Fund Sizer State
  const [sizerEarners, setSizerEarners] = useState<number>(1);
  const [sizerStability, setSizerStability] = useState<'stable' | 'variable' | 'entrepreneur'>('variable');
  const [sizerRisk, setSizerRisk] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [sizerMonthlyExpense, setSizerMonthlyExpense] = useState<number>(150000);

  // Retirement Planning & Provision of Retirement Income State
  const [retCurrentAge, setRetCurrentAge] = useState<number>(player.age || 28);
  const [retRetireAge, setRetRetireAge] = useState<number>(55); // Early retirement option well before 65
  const [retLongevityAge, setRetLongevityAge] = useState<number>(90); // Longevity horizon into 80s, 90s, or beyond
  const [retDesiredMonthlyIncome, setRetDesiredMonthlyIncome] = useState<number>(350000); // ₦350k/mo
  const [retDistributionStrategy, setRetDistributionStrategy] = useState<'safe_withdrawal_4pct' | 'annuity_guaranteed' | 'cashflow_dividend_rental' | 'bucket_strategy'>('safe_withdrawal_4pct');
  const [retRecessionStressTest, setRetRecessionStressTest] = useState<boolean>(true);
  const [retInvestmentPurpose, setRetInvestmentPurpose] = useState<'standard_of_living' | 'second_income' | 'financial_security' | 'retire_early' | 'grandchildren_legacy' | 'enjoy_investing'>('retire_early');

  // Protection against Personal Risks (Personal Risk Management) State
  const [riskMedicalMajor, setRiskMedicalMajor] = useState<number>(2500000); // Uncovered medical expenses & stop-loss
  const [riskDisabilityMonths, setRiskDisabilityMonths] = useState<number>(18); // Disability of income earners (months of salary)
  const [riskCustodialMajor, setRiskCustodialMajor] = useState<number>(4000000); // Custodial care & long-term care expenses
  const [riskDeathCoverageMajor, setRiskDeathCoverageMajor] = useState<number>(15000000); // Premature death family continuity
  const [riskPropertyLiabilityMajor, setRiskPropertyLiabilityMajor] = useState<number>(2000000); // Property and liability losses deductible retention
  const [riskStrategy, setRiskStrategy] = useState<'hybrid_stop_loss' | 'retained_loss_reserve' | 'insurance_transfer'>('hybrid_stop_loss');

  // Personal Risk Management Calculations
  const calculatePersonalRiskMetrics = () => {
    const monthlySalary = minorToMajor(player.quarterlySalaryMinor, player.primaryCurrency) / 3;
    const disabilityTotal = Math.round(monthlySalary * riskDisabilityMonths);
    const grossExposure = riskMedicalMajor + disabilityTotal + riskCustodialMajor + riskDeathCoverageMajor + riskPropertyLiabilityMajor;

    // Sizing the required liquid retained loss reserve:
    let recommendedReserve = 0;
    if (riskStrategy === 'hybrid_stop_loss') {
      // Retain full medical deductible/emergency deposit + 6 mo disability runway + property deductible + 25% custodial retainer
      recommendedReserve = riskMedicalMajor + Math.round(monthlySalary * 6) + riskPropertyLiabilityMajor + Math.round(riskCustodialMajor * 0.25);
    } else if (riskStrategy === 'retained_loss_reserve') {
      // Pure self-insurance: retain medical + full disability runway + 50% custodial + property losses
      recommendedReserve = riskMedicalMajor + disabilityTotal + Math.round(riskCustodialMajor * 0.5) + riskPropertyLiabilityMajor;
    } else {
      // Insurance transfer focus: retain 25% medical deductibles + 3 mo salary bridge + property deductible
      recommendedReserve = Math.round(riskMedicalMajor * 0.25) + Math.round(monthlySalary * 3) + Math.round(riskPropertyLiabilityMajor * 0.3);
    }

    return {
      monthlySalary: Math.round(monthlySalary),
      disabilityTotal,
      grossExposure,
      recommendedReserve: Math.max(1000000, recommendedReserve),
    };
  };

  const personalRiskMetrics = calculatePersonalRiskMetrics();

  // Emergency Fund calculation
  const calculateSizerMonths = () => {
    let months = 6;
    if (sizerEarners === 1) months += 1;
    if (sizerStability === 'variable') months += 2;
    if (sizerStability === 'entrepreneur') months += 3;
    if (sizerRisk === 'conservative') months += 2;
    if (sizerRisk === 'aggressive') months -= 1;
    return Math.max(3, Math.min(12, months));
  };
  const calculatedEmergencyMonths = calculateSizerMonths();
  const calculatedEmergencyTarget = calculatedEmergencyMonths * sizerMonthlyExpense;

  // Retirement Planning Calculations
  const calculateRetirementMetrics = () => {
    const yearsToRetirement = Math.max(1, retRetireAge - retCurrentAge);
    const yearsInRetirement = Math.max(5, retLongevityAge - retRetireAge);
    const annualIncomeNeeded = retDesiredMonthlyIncome * 12;

    // Capital needed based on distribution strategy
    let baseNestEgg = 0;
    if (retDistributionStrategy === 'safe_withdrawal_4pct') {
      baseNestEgg = annualIncomeNeeded * 25; // 4% Rule
    } else if (retDistributionStrategy === 'annuity_guaranteed') {
      baseNestEgg = annualIncomeNeeded * 18; // Annuity pricing with guaranteed floor
    } else if (retDistributionStrategy === 'cashflow_dividend_rental') {
      baseNestEgg = annualIncomeNeeded * 30; // 3.33% yield leaving principal completely untouched
    } else {
      // Bucket strategy
      const cashBucket = annualIncomeNeeded * 3;
      const fixedIncomeBucket = annualIncomeNeeded * 7;
      const growthBucket = annualIncomeNeeded * 12;
      baseNestEgg = cashBucket + fixedIncomeBucket + growthBucket;
    }

    // Adjust for economic recession depletion stress test
    // A major economic recession / depression depletes asset values by 20-35%
    const recessionDepletionBuffer = retRecessionStressTest ? baseNestEgg * 0.25 : 0;
    const totalRequiredNestEgg = baseNestEgg + recessionDepletionBuffer;

    // Required savings per quarter (assuming 7% nominal real compound rate)
    const totalQuarters = yearsToRetirement * 4;
    const requiredSavingsPerQuarter = totalRequiredNestEgg / totalQuarters;

    return {
      yearsToRetirement,
      yearsInRetirement,
      annualIncomeNeeded,
      baseNestEgg,
      recessionDepletionBuffer,
      totalRequiredNestEgg,
      requiredSavingsPerQuarter,
      targetYear: fsrMetrics.year + yearsToRetirement,
    };
  };

  const retirementMetrics = calculateRetirementMetrics();

  const categories = [
    {
      id: 'all',
      label: 'All Objectives',
      icon: Target,
      activeStyle: 'bg-slate-800 border-slate-900 text-white shadow-[0_3px_0_0_#0f172a]',
      badgeStyle: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'capital_accumulation',
      label: 'Capital Accumulation',
      icon: Coins,
      activeStyle: 'bg-[#1CB0F6] border-[#1899D6] text-white shadow-[0_3px_0_0_#137CB0]',
      badgeStyle: 'bg-blue-50 text-[#1CB0F6]',
    },
    {
      id: 'personal_risk_mgmt',
      label: 'Personal Risks',
      icon: ShieldAlert,
      activeStyle: 'bg-[#9333EA] border-[#7E22CE] text-white shadow-[0_3px_0_0_#6B21A8]',
      badgeStyle: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'retirement_planning',
      label: 'Retirement Planning',
      icon: Flame,
      activeStyle: 'bg-[#FF9600] border-[#E68600] text-white shadow-[0_3px_0_0_#CC7700]',
      badgeStyle: 'bg-amber-50 text-amber-800',
    },
    {
      id: 'wealth_protection',
      label: 'Wealth Protection',
      icon: Shield,
      activeStyle: 'bg-[#4F46E5] border-[#4338CA] text-white shadow-[0_3px_0_0_#3730A3]',
      badgeStyle: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'family_lifestyle',
      label: 'Family & Lifestyle',
      icon: HeartHandshake,
      activeStyle: 'bg-[#58CC02] border-[#46A302] text-white shadow-[0_3px_0_0_#368001]',
      badgeStyle: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'tax_mobility',
      label: 'Tax & Mobility',
      icon: Globe2,
      activeStyle: 'bg-[#0D9488] border-[#0F766E] text-white shadow-[0_3px_0_0_#115E59]',
      badgeStyle: 'bg-teal-50 text-teal-700',
    },
    {
      id: 'dynasty_philanthropy',
      label: 'Dynasty & Impact',
      icon: Landmark,
      activeStyle: 'bg-[#E11D48] border-[#BE123C] text-white shadow-[0_3px_0_0_#9F1239]',
      badgeStyle: 'bg-rose-50 text-rose-700',
    },
  ];

  const filteredObjectives = selectedCategory === 'all'
    ? objectives
    : objectives.filter((o) => o.category === selectedCategory);

  const liquidCashAsset = assets.find((a) => a.assetType === 'cash_savings' && a.currencyCode === player.primaryCurrency);
  const liquidCashMajor = liquidCashAsset ? minorToMajor(liquidCashAsset.currentValueMinor, player.primaryCurrency) : 0;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    let extraMeta: any = {};
    if (newCategory === 'personal_risk_mgmt') {
      extraMeta = {
        personalRiskType: newRiskType,
        riskMitigationStrategy: newRiskStrategy,
      };
    } else if (newCategory === 'retirement_planning') {
      extraMeta = {
        retirementAge: newRetireAge,
        longevityHorizonAge: newLongevityAge,
        distributionStrategy: newDistStrategy,
        recessionDepletionStressTested: true,
      };
    }

    addObjective({
      category: newCategory,
      name: newName,
      description: newDesc || 'Strategic wealth objective.',
      currencyCode: newCurrency,
      targetAmountMinor: majorToMinor(parseFloat(newTargetAmount) || 100000, newCurrency),
      targetYear: newTargetYear,
      priority: newPriority,
      status: 'considering',
      metadata: {
        investmentPurpose: newPurpose,
        ...extraMeta,
      },
    });
    setShowCreateModal(false);
    setNewName('');
    setNewDesc('');
  };

  const handleApplyPreset = (preset: ObjectivePreset) => {
    let extraMeta: any = {};
    if (preset.id === 'preset_personal_risk_medical') {
      extraMeta = { personalRiskType: 'medical_expenses', riskMitigationStrategy: 'hybrid_stop_loss' };
    } else if (preset.id === 'preset_personal_risk_disability') {
      extraMeta = { personalRiskType: 'disability_income', riskMitigationStrategy: 'insurance_transfer' };
    } else if (preset.id === 'preset_personal_risk_custodial_care') {
      extraMeta = { personalRiskType: 'custodial_care', riskMitigationStrategy: 'retained_loss_reserve' };
    } else if (preset.id === 'preset_personal_risk_premature_death') {
      extraMeta = { personalRiskType: 'premature_death', riskMitigationStrategy: 'insurance_transfer' };
    } else if (preset.id === 'preset_personal_risk_property_liability') {
      extraMeta = { personalRiskType: 'property_liability_losses', riskMitigationStrategy: 'retained_loss_reserve' };
    } else if (preset.id === 'preset_personal_risk_umbrella_defense') {
      extraMeta = { personalRiskType: 'property_liability_losses', riskMitigationStrategy: 'hybrid_stop_loss' };
    } else if (preset.id === 'preset_retirement_income_longevity') {
      extraMeta = { retirementAge: 60, longevityHorizonAge: 90, distributionStrategy: 'safe_withdrawal_4pct', recessionDepletionStressTested: true };
    } else if (preset.id === 'preset_early_retirement_fire') {
      extraMeta = { retirementAge: 48, longevityHorizonAge: 92, distributionStrategy: 'bucket_strategy', recessionDepletionStressTested: true };
    } else if (preset.id === 'preset_recession_depletion_shield') {
      extraMeta = { retirementAge: 60, longevityHorizonAge: 90, distributionStrategy: 'bucket_strategy', recessionDepletionStressTested: true };
    } else if (preset.id === 'preset_retirement_distribution_bucket') {
      extraMeta = { retirementAge: 58, longevityHorizonAge: 90, distributionStrategy: 'bucket_strategy', recessionDepletionStressTested: true };
    } else if (preset.id === 'preset_pension_rsa_maximizer') {
      extraMeta = { retirementAge: 60, longevityHorizonAge: 90, distributionStrategy: 'annuity_guaranteed' };
    }

    addObjective({
      category: preset.category,
      name: preset.name,
      description: preset.description,
      currencyCode: preset.currencyCode,
      targetAmountMinor: majorToMinor(preset.defaultTargetMajor, preset.currencyCode),
      targetYear: fsrMetrics.year + preset.yearsHorizon,
      priority: preset.priority,
      status: 'considering',
      metadata: {
        investmentPurpose: preset.purpose,
        ...extraMeta,
      },
    });
    setShowPresetsModal(false);
  };

  const handleApplyRetirementObjective = () => {
    const isEarly = retRetireAge < 60;
    const title = isEarly
      ? `Early Retirement & FIRE (Target Age ${retRetireAge})`
      : `Retirement Planning (Provision of Retirement Income to Age ${retLongevityAge})`;

    const description = `Provision of adequate retirement income (₦${(retDesiredMonthlyIncome * 12).toLocaleString()}/yr) supporting living into age ${retLongevityAge}, stress-tested against economic recessions and utilizing ${retDistributionStrategy.replace(/_/g, ' ')}.`;

    addObjective({
      category: 'retirement_planning',
      name: title,
      description,
      currencyCode: 'NGN',
      targetAmountMinor: majorToMinor(Math.round(retirementMetrics.totalRequiredNestEgg), 'NGN'),
      targetYear: retirementMetrics.targetYear,
      priority: 'essential',
      status: 'funding',
      metadata: {
        retirementAge: retRetireAge,
        longevityHorizonAge: retLongevityAge,
        annualIncomeTargetMinor: majorToMinor(retirementMetrics.annualIncomeNeeded, 'NGN'),
        distributionStrategy: retDistributionStrategy,
        investmentPurpose: retInvestmentPurpose,
        recessionDepletionStressTested: retRecessionStressTest,
      },
    });
    setShowRetirementModal(false);
  };

  const handleApplyPersonalRiskObjective = () => {
    const riskMetrics = calculatePersonalRiskMetrics();
    const description = `Protection against personal risks: medical expenses (₦${riskMedicalMajor.toLocaleString()}), disability of income earners (${riskDisabilityMonths} mo buffer), custodial care (₦${riskCustodialMajor.toLocaleString()}), death continuity, and retained property/liability losses.`;

    addObjective({
      category: 'personal_risk_mgmt',
      name: 'Protection against Personal Risks (Risk Management)',
      description,
      currencyCode: 'NGN',
      targetAmountMinor: majorToMinor(riskMetrics.recommendedReserve, 'NGN'),
      targetYear: fsrMetrics.year + 1,
      priority: 'essential',
      status: 'funding',
      metadata: {
        personalRiskType: 'medical_expenses',
        riskMitigationStrategy: riskStrategy,
        investmentPurpose: 'financial_security',
      },
    });
    setShowRiskModal(false);
  };

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingGoal) return;
    const amount = parseFloat(allocationInput) || 0;
    if (amount <= 0) return;
    const amountMinor = majorToMinor(amount, allocatingGoal.currencyCode);
    const success = allocateToObjective(allocatingGoal.id, amountMinor);
    if (success) {
      setAllocatingGoal(null);
    } else {
      alert('Insufficient liquid cash balance in your account!');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 sm:pb-20">
      {/* Top Banner / Action Deck */}
      <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 shadow-[0_4px_0_0_#D4D4D4] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-black uppercase text-[#1CB0F6] tracking-wider">
                Private Wealth Management Architecture
              </span>
              <span className="text-xs text-slate-400 font-bold hidden xs:inline">·</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold">
                5 Strategic Domains & Capital Allocation
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight mt-0.5">
              Financial Objectives & Wealth Planning
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Determine, analyze, and plan your life goals: from emergency cushions and rising higher education costs to lifelong retirement income (lasting into your 80s/90s), personal risk management, early FIRE, and property management.
            </p>
          </div>

          {/* Action CTAs: Responsive grid on mobile, flex on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0">
            <DuolingoButton
              variant="blue"
              size="sm"
              onClick={() => setShowRetirementModal(true)}
              className="!py-2 text-[11px] sm:text-xs font-black"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Retirement Plan</span>
            </DuolingoButton>

            <DuolingoButton
              variant="purple"
              size="sm"
              onClick={() => setShowRiskModal(true)}
              className="!py-2 text-[11px] sm:text-xs font-black"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-200" />
              <span>Personal Risks</span>
            </DuolingoButton>

            <DuolingoButton
              variant="amber"
              size="sm"
              onClick={() => setShowSizerModal(true)}
              className="!py-2 text-[11px] sm:text-xs font-black"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Emergency Sizer</span>
            </DuolingoButton>

            <DuolingoButton
              variant="white"
              size="sm"
              onClick={() => setShowPresetsModal(true)}
              className="!py-2 text-[11px] sm:text-xs font-black"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Goal Presets</span>
            </DuolingoButton>

            <DuolingoButton
              variant="green"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="!py-2 text-[11px] sm:text-xs font-black col-span-2 sm:col-span-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom Goal</span>
            </DuolingoButton>
          </div>
        </div>

        {/* Wealth Planning Spotlight Strip: 4 Strategic Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1CB0F6] flex items-center justify-center shrink-0 font-black">
              🛡️
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-800 block">
                Emergency Fund Cushion
              </span>
              <p className="text-[11px] font-bold text-slate-500 leading-snug mt-0.5">
                Calibrated against income earners, employment volatility, and insurance deductibles (3 to 12 months).
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-black">
              🩺
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-800 block">
                Personal Risk Management
              </span>
              <p className="text-[11px] font-bold text-slate-500 leading-snug mt-0.5">
                Planning for medical expenses, earner disability, custodial care, death, and property/liability losses.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-black">
              🌅
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-800 block">
                Retirement & Longevity
              </span>
              <p className="text-[11px] font-bold text-slate-500 leading-snug mt-0.5">
                Lifelong income lasting into 80s, 90s+, or early FIRE before 65, resilient to market recessions.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black">
              📈
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-800 block">
                Investment & Property
              </span>
              <p className="text-[11px] font-bold text-slate-500 leading-snug mt-0.5">
                Mitigate investment complexity, market volatility, and tax burdens with disciplined property management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs: Smooth Horizontal Scroll on Mobile with Signature Colors */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2.5 px-2.5 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'all'
            ? objectives.length
            : objectives.filter((o) => o.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 font-black text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? cat.activeStyle
                  : 'bg-white border-[#E5E5E5] text-slate-600 hover:text-slate-800 shadow-[0_2px_0_0_#D4D4D4]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Objectives Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredObjectives.map((obj) => {
          const targetMajor = minorToMajor(obj.targetAmountMinor, obj.currencyCode);
          const currentMajor = minorToMajor(obj.currentAmountMinor, obj.currencyCode);
          const percent = targetMajor > 0 ? Math.min(100, Math.round((currentMajor / targetMajor) * 100)) : 0;
          const gapMajor = Math.max(0, targetMajor - currentMajor);

          // Calculate years remaining
          const currentYear = fsrMetrics.year;
          const yearsRemaining = Math.max(1, obj.targetYear - currentYear);
          const requiredPerQuarter = gapMajor / (yearsRemaining * 4);

          // Feasibility logic
          let feasibility = 'Achievable';
          let feasibilityColor = 'text-[#58CC02] bg-emerald-50 border-emerald-200';
          if (percent >= 100) {
            feasibility = 'Goal Achieved';
            feasibilityColor = 'text-[#58CC02] bg-emerald-100 border-emerald-300';
          } else if (requiredPerQuarter > 2_000_000 && obj.currencyCode === 'NGN') {
            feasibility = 'Requires Revenue Scaling';
            feasibilityColor = 'text-amber-800 bg-amber-50 border-amber-200';
          }

          const getCategoryBadge = () => {
            switch (obj.category) {
              case 'capital_accumulation':
                return {
                  label: 'Capital Accumulation',
                  color: 'bg-blue-50 text-[#1CB0F6] border-blue-200',
                  bar: 'bg-[#1CB0F6]',
                };
              case 'personal_risk_mgmt':
                return {
                  label: 'Personal Risks',
                  color: 'bg-purple-50 text-purple-700 border-purple-200',
                  bar: 'bg-[#9333EA]',
                };
              case 'retirement_planning':
                return {
                  label: 'Retirement Planning',
                  color: 'bg-amber-50 text-amber-800 border-amber-300',
                  bar: 'bg-[#FF9600]',
                };
              case 'wealth_protection':
                return {
                  label: 'Wealth Protection',
                  color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  bar: 'bg-[#4F46E5]',
                };
              case 'family_lifestyle':
                return {
                  label: 'Family & Lifestyle',
                  color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  bar: 'bg-[#58CC02]',
                };
              case 'tax_mobility':
                return {
                  label: 'Tax & Mobility',
                  color: 'bg-teal-50 text-teal-700 border-teal-200',
                  bar: 'bg-[#0D9488]',
                };
              case 'dynasty_philanthropy':
                return {
                  label: 'Dynasty & Impact',
                  color: 'bg-rose-50 text-rose-700 border-rose-200',
                  bar: 'bg-[#E11D48]',
                };
              default:
                return {
                  label: 'Objective',
                  color: 'bg-slate-50 text-slate-700 border-slate-200',
                  bar: 'bg-slate-600',
                };
            }
          };

          const catBadge = getCategoryBadge();

          return (
            <DuolingoCard key={obj.id} className="flex flex-col justify-between p-4 sm:p-5">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${catBadge.color}`}>
                    {catBadge.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {obj.metadata?.recessionDepletionStressTested && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-lg border bg-rose-50 text-rose-700 border-rose-200" title="Stress-tested against recession depletion">
                        Recession Tested
                      </span>
                    )}
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${feasibilityColor}`}>
                      {feasibility}
                    </span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-snug">
                  {obj.name}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                  {obj.description}
                </p>

                {/* Metadata highlights (Retirement age, Longevity horizon, Purpose) */}
                {obj.metadata && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                    {obj.metadata.retirementAge && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        Retire Age: {obj.metadata.retirementAge}
                      </span>
                    )}
                    {obj.metadata.longevityHorizonAge && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        Horizon: Age {obj.metadata.longevityHorizonAge}+
                      </span>
                    )}
                    {obj.metadata.distributionStrategy && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-300 uppercase">
                        {obj.metadata.distributionStrategy.replace(/_/g, ' ')}
                      </span>
                    )}
                    {obj.metadata.investmentPurpose && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200 uppercase">
                        {obj.metadata.investmentPurpose.replace(/_/g, ' ')}
                      </span>
                    )}
                    {obj.metadata.personalRiskType && (
                      <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
                        Risk: {obj.metadata.personalRiskType.replace(/_/g, ' ')}
                      </span>
                    )}
                    {obj.metadata.riskMitigationStrategy && (
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200 uppercase">
                        {obj.metadata.riskMitigationStrategy.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-black text-slate-700">
                      Funded: {formatMoney(obj.currentAmountMinor, obj.currencyCode)}
                    </span>
                    <span className="text-xs font-black font-mono-numbers text-slate-800">
                      {percent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 sm:h-3 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-300 ${
                        percent >= 100 ? 'bg-[#58CC02]' : catBadge.bar
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Goal Gap Analysis Strip */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-4 pt-3 border-t-2 border-slate-100 text-center">
                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-1.5 sm:p-2">
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-500 block leading-tight">
                      Target Goal
                    </span>
                    <span className="text-xs font-black font-mono-numbers text-slate-800">
                      {formatMoney(obj.targetAmountMinor, obj.currencyCode, { compact: true })}
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-1.5 sm:p-2">
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-500 block leading-tight">
                      Funding Gap
                    </span>
                    <span className="text-xs font-black font-mono-numbers text-rose-700">
                      {formatMoney(majorToMinor(gapMajor, obj.currencyCode), obj.currencyCode, { compact: true })}
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-1.5 sm:p-2">
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-500 block leading-tight">
                      Req / Qtr
                    </span>
                    <span className="text-xs font-black font-mono-numbers text-slate-800">
                      {formatMoney(majorToMinor(Math.round(requiredPerQuarter), obj.currencyCode), obj.currencyCode, { compact: true })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t-2 border-slate-100 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">
                  Target: {obj.targetYear} ({yearsRemaining} yrs left)
                </span>
                <DuolingoButton
                  variant="blue"
                  size="sm"
                  onClick={() => {
                    setAllocatingGoal(obj);
                    setAllocationInput('50000');
                  }}
                  disabled={percent >= 100}
                  className="w-full xs:w-auto !py-1.5 text-xs font-black"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{percent >= 100 ? 'Achieved' : 'Allocate Capital'}</span>
                </DuolingoButton>
              </div>
            </DuolingoCard>
          );
        })}
      </div>

      {/* --- RETIREMENT PLANNING & PROVISION OF RETIREMENT INCOME MODAL --- */}
      {showRetirementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-[0_8px_0_0_#D4D4D4] max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FF4B4B] text-white flex items-center justify-center font-black text-xl shadow-[0_2px_0_0_#D42B2B]">
                  🌅
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    Retirement Planning Engine
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    Provision of Adequate Retirement Income & Longevity Horizon
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowRetirementModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Empirical & Academic Rationale Notice */}
            <div className="bg-[#FFF8E6] border-2 border-[#FCE194] rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-800" />
                <span>The Modern Retirement Planning Challenge</span>
              </div>
              <p className="text-xs font-bold text-amber-950 leading-relaxed">
                Today people can anticipate living to enjoy long retirement lasting into their <strong>80s, 90s, or beyond</strong>. However, economic recessions deplete the value of retirement accounts, and savings adequacy is under severe pressure. Planning must ensure <strong>adequate income provision</strong> and safe distribution strategies, whether retiring at 65 or early before age 65.
              </p>
            </div>

            {/* Interactive Form Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Ages */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 block">
                  Current Age & Planned Retirement Age
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block">Current Age</span>
                    <input
                      type="number"
                      min={18}
                      max={75}
                      value={retCurrentAge}
                      onChange={(e) => setRetCurrentAge(parseInt(e.target.value) || 28)}
                      className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block">Retirement Age</span>
                    <input
                      type="number"
                      min={35}
                      max={75}
                      value={retRetireAge}
                      onChange={(e) => setRetRetireAge(parseInt(e.target.value) || 55)}
                      className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => setRetRetireAge(48)}
                    className="text-[10px] font-black px-2 py-0.5 rounded-lg border bg-white text-slate-700 hover:bg-slate-50"
                  >
                    Early FIRE (48)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRetRetireAge(55)}
                    className="text-[10px] font-black px-2 py-0.5 rounded-lg border bg-white text-slate-700 hover:bg-slate-50"
                  >
                    Age 55
                  </button>
                  <button
                    type="button"
                    onClick={() => setRetRetireAge(65)}
                    className="text-[10px] font-black px-2 py-0.5 rounded-lg border bg-white text-slate-700 hover:bg-slate-50"
                  >
                    Standard 65
                  </button>
                </div>
              </div>

              {/* Longevity Horizon (Living into 80s, 90s, or beyond) */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 block">
                  Longevity Horizon (Plan into 80s/90s+)
                </label>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-black text-slate-800">
                      Target Life Horizon: Age {retLongevityAge}
                    </span>
                    <span className="text-[11px] font-extrabold text-blue-600">
                      {retLongevityAge - retRetireAge} yrs in retirement
                    </span>
                  </div>
                  <input
                    type="range"
                    min={75}
                    max={100}
                    step={1}
                    value={retLongevityAge}
                    onChange={(e) => setRetLongevityAge(parseInt(e.target.value))}
                    className="w-full accent-[#1CB0F6]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {[85, 92, 98].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setRetLongevityAge(age)}
                      className={`text-[10px] font-bold py-1 rounded-lg border text-center ${
                        retLongevityAge === age ? 'bg-[#1CB0F6] text-white border-[#1899D6]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Age {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desired Monthly Living Income in Retirement */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 block">
                  Desired Monthly Retirement Income (₦)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={retDesiredMonthlyIncome}
                  onChange={(e) => setRetDesiredMonthlyIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                />
                <span className="text-[10px] font-bold text-slate-500 block">
                  Equals ₦{(retDesiredMonthlyIncome * 12).toLocaleString()} annual living income in retirement.
                </span>
              </div>

              {/* Distribution Strategy from Various Plans */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 block">
                  Distribution Strategy (Plan Drawdown)
                </label>
                <select
                  value={retDistributionStrategy}
                  onChange={(e) => setRetDistributionStrategy(e.target.value as any)}
                  className="w-full px-2.5 py-2 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                >
                  <option value="safe_withdrawal_4pct">Systematic 4% Safe Withdrawal Rate (Inflation Adjusted)</option>
                  <option value="annuity_guaranteed">Guaranteed Pension Annuity Floor (PenCom RSA / UK Annuity)</option>
                  <option value="cashflow_dividend_rental">Dividend & Rental Cashflow Only (Preserve Principal 100%)</option>
                  <option value="bucket_strategy">3-Bucket Early Retirement Strategy (Cash + Gilts + Equities)</option>
                </select>
              </div>
            </div>

            {/* Purpose & Recession Stress Test Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  General Investment Purpose
                </label>
                <select
                  value={retInvestmentPurpose}
                  onChange={(e) => setRetInvestmentPurpose(e.target.value as any)}
                  className="w-full px-2.5 py-2 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                >
                  <option value="retire_early">The ability to retire early (well before age 65)</option>
                  <option value="financial_security">Greater financial security against economic crisis</option>
                  <option value="standard_of_living">Better standard of living in the future</option>
                  <option value="second_income">A second income in addition to earnings</option>
                  <option value="grandchildren_legacy">A capital fund to pass on to children/grandchildren</option>
                  <option value="enjoy_investing">Simply enjoy the investment process</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                <div>
                  <span className="text-xs font-black text-rose-900 block">
                    Recession & Depression Depletion Buffer (+25%)
                  </span>
                  <p className="text-[10px] font-bold text-rose-700 leading-snug mt-0.5">
                    Depleted account protection against market downturns.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={retRecessionStressTest}
                  onChange={(e) => setRetRecessionStressTest(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Live Calculation Output Dashboard */}
            <div className="bg-[#EBF7FF] border-2 border-[#BCE3FF] rounded-2xl p-4 shadow-[0_2px_0_0_#99D1FF] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200 pb-2">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#137CB0] block">
                    Calculated Capital Nest Egg Required
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-slate-900">
                    ₦{Math.round(retirementMetrics.totalRequiredNestEgg).toLocaleString()}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-black uppercase text-[#137CB0] block">
                    Target Milestone Year
                  </span>
                  <span className="text-base font-black text-slate-800">
                    Year {retirementMetrics.targetYear} ({retirementMetrics.yearsToRetirement} yrs saving)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white/80 rounded-xl p-2 border border-blue-200">
                  <span className="text-[9px] font-black uppercase text-slate-500 block">Saving Horizon</span>
                  <span className="text-xs font-black text-slate-800">{retirementMetrics.yearsToRetirement} Years</span>
                </div>
                <div className="bg-white/80 rounded-xl p-2 border border-blue-200">
                  <span className="text-[9px] font-black uppercase text-slate-500 block">Retirement Span</span>
                  <span className="text-xs font-black text-slate-800">{retirementMetrics.yearsInRetirement} Years</span>
                </div>
                <div className="bg-white/80 rounded-xl p-2 border border-blue-200">
                  <span className="text-[9px] font-black uppercase text-slate-500 block">Required / Qtr</span>
                  <span className="text-xs font-black text-slate-800 font-mono-numbers">
                    ₦{Math.round(retirementMetrics.requiredSavingsPerQuarter).toLocaleString()}
                  </span>
                </div>
                <div className="bg-white/80 rounded-xl p-2 border border-blue-200">
                  <span className="text-[9px] font-black uppercase text-slate-500 block">Recession Buffer</span>
                  <span className="text-xs font-black text-rose-700 font-mono-numbers">
                    +₦{Math.round(retirementMetrics.recessionDepletionBuffer).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <DuolingoButton
              variant="green"
              fullWidth
              onClick={handleApplyRetirementObjective}
              className="!py-3 text-sm font-black"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>Instantiate Retirement Income Objective</span>
            </DuolingoButton>
          </div>
        </div>
      )}

      {/* --- PROTECTION AGAINST PERSONAL RISKS (PERSONAL RISK MANAGEMENT) MODAL --- */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-[0_8px_0_0_#D4D4D4] max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#9333EA] text-white flex items-center justify-center font-black text-xl shadow-[0_2px_0_0_#7E22CE]">
                  🛡️
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    Personal Risk Management Engine
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    Protection against Personal Losses (Medical, Disability, Care, Death, Property)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowRiskModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Academic & Professional Rationale Banner */}
            <div className="bg-[#FAF5FF] border-2 border-[#E9D5FF] rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-purple-950 font-black text-xs uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-purple-700" />
                <span>The 5 Core Personal Loss Exposures</span>
              </div>
              <p className="text-xs font-bold text-purple-950 leading-relaxed">
                Personal risk management systematically plans for the catastrophic events that deplete family wealth:
                <strong> medical expenses</strong>, <strong>disability of income earners</strong>, <strong>custodial care (long-term care)</strong>, <strong>premature death</strong>, and <strong>property & liability losses</strong>. Managing these exposures combines insurance transfer and dedicated retained liquid reserves.
              </p>
            </div>

            {/* 5 Exposure Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Medical Expenses */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                    <span>Medical Expenses Stop-Loss (₦)</span>
                  </label>
                </div>
                <input
                  type="number"
                  step={250000}
                  value={riskMedicalMajor}
                  onChange={(e) => setRiskMedicalMajor(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                />
                <span className="text-[10px] font-bold text-slate-500 block leading-tight">
                  High hospital deductibles, emergency surgery cash deposits, and specialized overseas care.
                </span>
              </div>

              {/* 2. Disability of Income Earners */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-600" />
                    <span>Earner Disability Runway</span>
                  </label>
                  <span className="text-[11px] font-black font-mono-numbers text-amber-700">
                    ₦{personalRiskMetrics.disabilityTotal.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[12, 18, 24].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setRiskDisabilityMonths(m)}
                      className={`text-[11px] font-bold py-1.5 rounded-lg border text-center transition-all ${
                        riskDisabilityMonths === m
                          ? 'bg-[#1CB0F6] text-white border-[#1899D6] shadow-[0_2px_0_0_#137CB0]'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500 block leading-tight">
                  Replaces earned quarterly salary (₦{personalRiskMetrics.monthlySalary.toLocaleString()}/mo) during recovery.
                </span>
              </div>

              {/* 3. Custodial Care (Long-Term Care) */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
                    <span>Custodial (Long-Term) Care (₦)</span>
                  </label>
                </div>
                <input
                  type="number"
                  step={500000}
                  value={riskCustodialMajor}
                  onChange={(e) => setRiskCustodialMajor(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                />
                <span className="text-[10px] font-bold text-slate-500 block leading-tight">
                  Assisted daily living and nursing assistance for aging parents or extended personal care.
                </span>
              </div>

              {/* 4. Premature Death Family Continuity */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                    <Umbrella className="w-3.5 h-3.5 text-blue-600" />
                    <span>Premature Death Continuity (₦)</span>
                  </label>
                </div>
                <input
                  type="number"
                  step={1000000}
                  value={riskDeathCoverageMajor}
                  onChange={(e) => setRiskDeathCoverageMajor(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                />
                <span className="text-[10px] font-bold text-slate-500 block leading-tight">
                  Mortgage payoff, family debt liquidation, and child education continuation fund.
                </span>
              </div>

              {/* 5. Property and Liability Losses */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-600" />
                    <span>Property and Liability Losses (Retained Reserve ₦)</span>
                  </label>
                </div>
                <input
                  type="number"
                  step={500000}
                  value={riskPropertyLiabilityMajor}
                  onChange={(e) => setRiskPropertyLiabilityMajor(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                />
                <span className="text-[10px] font-bold text-slate-500 block leading-tight">
                  Dedicated self-insurance buffer covering property damage deductibles, vehicle collisions, transit cargo, and legal defense retainers.
                </span>
              </div>
            </div>

            {/* Risk Mitigation Strategy Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-700 block">
                Personal Risk Management Strategy
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRiskStrategy('hybrid_stop_loss')}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    riskStrategy === 'hybrid_stop_loss'
                      ? 'border-[#9333EA] bg-purple-50 shadow-[0_2px_0_0_#7E22CE]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-black text-slate-900 block">Hybrid Stop-Loss</span>
                  <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                    Liquid reserve for immediate deductibles + commercial insurance for catastrophic loss.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRiskStrategy('retained_loss_reserve')}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    riskStrategy === 'retained_loss_reserve'
                      ? 'border-[#9333EA] bg-purple-50 shadow-[0_2px_0_0_#7E22CE]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-black text-slate-900 block">Retained Loss Reserve</span>
                  <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                    Deliberate self-insurance covering moderate property & medical shocks without recurring premium drag.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRiskStrategy('insurance_transfer')}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    riskStrategy === 'insurance_transfer'
                      ? 'border-[#9333EA] bg-purple-50 shadow-[0_2px_0_0_#7E22CE]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-black text-slate-900 block">Insurance Transfer</span>
                  <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                    Maximize policy limits with HMO, disability insurance, and life policies; retain minimal deductible.
                  </span>
                </button>
              </div>
            </div>

            {/* Personal Risk Exposure & Sizing Card */}
            <div className="bg-[#FAF5FF] border-2 border-[#E9D5FF] rounded-2xl p-4 shadow-[0_2px_0_0_#D8B4FE] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200 pb-2">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 block">
                    Recommended Retained Risk Capital Target
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-slate-900">
                    ₦{personalRiskMetrics.recommendedReserve.toLocaleString()}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-black uppercase text-purple-900 block">
                    Gross Assessed Family Exposure
                  </span>
                  <span className="text-base font-black font-mono-numbers text-slate-800">
                    ₦{personalRiskMetrics.grossExposure.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white/80 rounded-xl p-2 border border-purple-200">
                  <span className="text-[9px] font-black uppercase text-slate-500 block">Medical Stop-Loss</span>
                  <span className="text-xs font-black text-slate-800 font-mono-numbers">₦{(riskMedicalMajor / 1000).toFixed(0)}k</span>
                </div>
                <div className="bg-white/80 rounded-xl p-2 border border-purple-200">
                  <span className="text-[9px] font-black uppercase text-slate-500 block">Disability Runway</span>
                  <span className="text-xs font-black text-slate-800">{riskDisabilityMonths} Months</span>
                </div>
                <div className="bg-white/80 rounded-xl p-2 border border-purple-200">
                  <span className="text-[9px] font-black uppercase text-slate-500 block">Custodial Care</span>
                  <span className="text-xs font-black text-slate-800 font-mono-numbers">₦{(riskCustodialMajor / 1000).toFixed(0)}k</span>
                </div>
                <div className="bg-white/80 rounded-xl p-2 border border-purple-200">
                  <span className="text-[9px] font-black uppercase text-slate-500 block">Property Retention</span>
                  <span className="text-xs font-black text-slate-800 font-mono-numbers">₦{(riskPropertyLiabilityMajor / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>

            <DuolingoButton
              variant="green"
              fullWidth
              onClick={handleApplyPersonalRiskObjective}
              className="!py-3 text-sm font-black"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>Instantiate Personal Risk Management Objective</span>
            </DuolingoButton>
          </div>
        </div>
      )}

      {/* --- PRESETS BROWSER MODAL (All Wealth Objectives Categories) --- */}
      {showPresetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 max-w-4xl w-full shadow-[0_8px_0_0_#D4D4D4] max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#9333EA] text-white flex items-center justify-center font-black text-xl shadow-[0_2px_0_0_#7E22CE]">
                  📚
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    Comprehensive Wealth Objectives Library (32 Presets)
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    Grounded in Private Wealth Management Taxonomy across 7 Strategic Domains
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowPresetsModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Presets Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              {[
                { id: 'all', label: `All (${WEALTH_OBJECTIVE_PRESETS.length})`, active: 'bg-slate-800 text-white border-slate-900 shadow-[0_2px_0_0_#0f172a]' },
                { id: 'capital_accumulation', label: 'Capital Growth (6)', active: 'bg-[#1CB0F6] text-white border-[#1899D6] shadow-[0_2px_0_0_#137CB0]' },
                { id: 'personal_risk_mgmt', label: 'Personal Risks (6)', active: 'bg-[#9333EA] text-white border-[#7E22CE] shadow-[0_2px_0_0_#6B21A8]' },
                { id: 'retirement_planning', label: 'Retirement (5)', active: 'bg-[#FF9600] text-white border-[#E68600] shadow-[0_2px_0_0_#CC7700]' },
                { id: 'wealth_protection', label: 'Asset Shield (3)', active: 'bg-[#4F46E5] text-white border-[#4338CA] shadow-[0_2px_0_0_#3730A3]' },
                { id: 'family_lifestyle', label: 'Family & Life (5)', active: 'bg-[#58CC02] text-white border-[#46A302] shadow-[0_2px_0_0_#368001]' },
                { id: 'tax_mobility', label: 'Tax & Mobility (3)', active: 'bg-[#0D9488] text-white border-[#0F766E] shadow-[0_2px_0_0_#115E59]' },
                { id: 'dynasty_philanthropy', label: 'Dynasty & Impact (4)', active: 'bg-[#E11D48] text-white border-[#BE123C] shadow-[0_2px_0_0_#9F1239]' },
              ].map((pCat) => {
                const isSelected = presetCategoryFilter === pCat.id;
                return (
                  <button
                    key={pCat.id}
                    onClick={() => setPresetCategoryFilter(pCat.id)}
                    className={`px-2.5 py-1.5 rounded-xl border-2 font-black text-[10px] sm:text-[11px] uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                      isSelected
                        ? pCat.active
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 shadow-[0_1px_0_0_#D4D4D4]'
                    }`}
                  >
                    {pCat.label}
                  </button>
                );
              })}
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {WEALTH_OBJECTIVE_PRESETS.filter((p) => presetCategoryFilter === 'all' || p.category === presetCategoryFilter).map((preset) => {
                const getPresetBadge = () => {
                  switch (preset.category) {
                    case 'capital_accumulation':
                      return { label: 'Capital Accumulation', color: 'bg-blue-50 text-[#1CB0F6] border-blue-200' };
                    case 'personal_risk_mgmt':
                      return { label: 'Personal Risks', color: 'bg-purple-50 text-purple-700 border-purple-200' };
                    case 'retirement_planning':
                      return { label: 'Retirement Planning', color: 'bg-amber-50 text-amber-800 border-amber-300' };
                    case 'wealth_protection':
                      return { label: 'Wealth Protection', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
                    case 'family_lifestyle':
                      return { label: 'Family & Lifestyle', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
                    case 'tax_mobility':
                      return { label: 'Tax & Mobility', color: 'bg-teal-50 text-teal-700 border-teal-200' };
                    case 'dynasty_philanthropy':
                      return { label: 'Dynasty & Impact', color: 'bg-rose-50 text-rose-700 border-rose-200' };
                    default:
                      return { label: 'Objective', color: 'bg-slate-50 text-slate-700 border-slate-200' };
                  }
                };

                const pBadge = getPresetBadge();

                return (
                  <div
                    key={preset.id}
                    className="bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between hover:border-[#1CB0F6] transition-all space-y-2.5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${pBadge.color}`}>
                          {pBadge.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 font-mono-numbers bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {preset.currencyCode} {preset.defaultTargetMajor.toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {preset.name}
                      </h4>

                      <p className="text-xs font-bold text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        {preset.description}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[9px] font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                          {preset.shortTag}
                        </span>
                        <span className="text-[9px] font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 uppercase">
                          Priority: {preset.priority}
                        </span>
                      </div>

                      {/* Planning Factors */}
                      <div className="mt-2.5 space-y-1">
                        {preset.planningFactors.slice(0, 2).map((factor, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                            <span className="text-[#58CC02] font-black">✓</span>
                            <span className="truncate">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">
                        Horizon: {preset.yearsHorizon} Years ({fsrMetrics.year + preset.yearsHorizon})
                      </span>
                      <DuolingoButton
                        variant="green"
                        size="sm"
                        onClick={() => handleApplyPreset(preset)}
                        className="!py-1 !px-2.5 text-xs font-black"
                      >
                        <span>Adopt Goal</span>
                      </DuolingoButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- EMERGENCY FUND SIZER MODAL --- */}
      {showSizerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-[0_8px_0_0_#D4D4D4] max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFC800] text-amber-950 flex items-center justify-center font-black text-xl shadow-[0_2px_0_0_#D9A700]">
                  🎚️
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    Scientific Emergency Fund Sizer
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    Calibrated Reserve (3 to 12 Months of Expenses)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSizerModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-slate-600">
              In private wealth management, the emergency fund size is not arbitrary: it depends on household income, number of income earners, employment stability, debt, insurance deductibles, and family risk attitude.
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Monthly Household Living Expenses (₦)
                </label>
                <input
                  type="number"
                  value={sizerMonthlyExpense}
                  onChange={(e) => setSizerMonthlyExpense(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Number of Household Income Earners
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSizerEarners(1)}
                    className={`py-2 px-3 rounded-xl border-2 font-bold text-xs ${
                      sizerEarners === 1 ? 'bg-[#1CB0F6] text-white border-[#1899D6]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    1 Earner (+1 Mo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizerEarners(2)}
                    className={`py-2 px-3 rounded-xl border-2 font-bold text-xs ${
                      sizerEarners === 2 ? 'bg-[#1CB0F6] text-white border-[#1899D6]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    2+ Earners (+0 Mo)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Employment Stability
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSizerStability('stable')}
                    className={`py-2 px-2 rounded-xl border-2 font-bold text-[11px] ${
                      sizerStability === 'stable' ? 'bg-[#1CB0F6] text-white border-[#1899D6]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Salaried
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizerStability('variable')}
                    className={`py-2 px-2 rounded-xl border-2 font-bold text-[11px] ${
                      sizerStability === 'variable' ? 'bg-[#1CB0F6] text-white border-[#1899D6]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Variable (+2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizerStability('entrepreneur')}
                    className={`py-2 px-2 rounded-xl border-2 font-bold text-[11px] ${
                      sizerStability === 'entrepreneur' ? 'bg-[#1CB0F6] text-white border-[#1899D6]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Founder (+3)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Family Risk Attitude
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSizerRisk('conservative')}
                    className={`py-2 px-2 rounded-xl border-2 font-bold text-[11px] ${
                      sizerRisk === 'conservative' ? 'bg-[#1CB0F6] text-white border-[#1899D6]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Conservative (+2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizerRisk('moderate')}
                    className={`py-2 px-2 rounded-xl border-2 font-bold text-[11px] ${
                      sizerRisk === 'moderate' ? 'bg-[#1CB0F6] text-white border-[#1899D6]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Moderate (+0)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizerRisk('aggressive')}
                    className={`py-2 px-2 rounded-xl border-2 font-bold text-[11px] ${
                      sizerRisk === 'aggressive' ? 'bg-[#1CB0F6] text-white border-[#1899D6]' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Aggressive (-1)
                  </button>
                </div>
              </div>

              {/* Calculated Results Box */}
              <div className="bg-[#FFF9E6] border-2 border-[#FCE194] rounded-2xl p-4 shadow-[0_2px_0_0_#E9C86A]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black uppercase text-amber-950">
                    Optimal Reserve Target
                  </span>
                  <span className="text-base font-black text-amber-950">
                    {calculatedEmergencyMonths} Months of Expenses
                  </span>
                </div>
                <div className="text-2xl font-black font-mono-numbers text-amber-950">
                  ₦{calculatedEmergencyTarget.toLocaleString()}
                </div>
                <p className="text-[11px] font-bold text-amber-900 mt-1">
                  This cushion protects your household against sudden recessions, Nigerian fuel/inflation spikes, and uncovered medical deductibles.
                </p>
              </div>

              <DuolingoButton
                variant="green"
                fullWidth
                onClick={() => {
                  const targetObj = objectives.find((o) => o.id === 'obj_emergency_fund');
                  if (targetObj) {
                    targetObj.targetAmountMinor = majorToMinor(calculatedEmergencyTarget, 'NGN');
                    targetObj.metadata = { ...targetObj.metadata, monthsOfExpenses: calculatedEmergencyMonths };
                  }
                  setShowSizerModal(false);
                }}
              >
                Apply This Target to Simulation
              </DuolingoButton>
            </div>
          </div>
        </div>
      )}

      {/* --- ALLOCATE CAPITAL MODAL --- */}
      {allocatingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-[0_8px_0_0_#D4D4D4] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                Allocate Capital to Goal
              </h3>
              <button
                onClick={() => setAllocatingGoal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-slate-600 mb-1">
              Target: <span className="text-slate-900 font-black">{allocatingGoal.name}</span>
            </p>
            <p className="text-xs font-bold text-emerald-800">
              Available Liquid Cash: ₦{liquidCashMajor.toLocaleString()}
            </p>

            <form onSubmit={handleAllocateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Amount to Allocate ({allocatingGoal.currencyCode})
                </label>
                <input
                  type="number"
                  value={allocationInput}
                  onChange={(e) => setAllocationInput(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                  placeholder="50000"
                />
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {['25000', '50000', '100000', liquidCashMajor.toString()].map((amt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAllocationInput(amt)}
                    className="px-2 py-1.5 rounded-lg border bg-slate-50 text-[11px] font-bold text-slate-700 hover:bg-slate-100 truncate"
                  >
                    {idx === 3 ? 'Max All' : `₦${(parseInt(amt) / 1000).toFixed(0)}k`}
                  </button>
                ))}
              </div>

              <DuolingoButton variant="green" fullWidth type="submit">
                Confirm Capital Allocation
              </DuolingoButton>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE CUSTOM OBJECTIVE MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-[0_8px_0_0_#D4D4D4] max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                Create Wealth Objective
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Objective Domain
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ObjectiveCategory)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                >
                  <option value="capital_accumulation">Capital Accumulation & Growth (Emergency, Real Estate, SME, Alpha)</option>
                  <option value="personal_risk_mgmt">Protection against Personal Risks (Health, Disability, Custodial, Liability)</option>
                  <option value="retirement_planning">Retirement Planning (Lifelong Income, FIRE, Bucket, Recession Shield)</option>
                  <option value="wealth_protection">Wealth Protection & Asset Shield (FX Domiciliary, Creditor Shield, Gold)</option>
                  <option value="family_lifestyle">Family Support & Lifestyle (Education, Eldercare, Milestones, Sabbatical)</option>
                  <option value="tax_mobility">Tax Planning & Global Mobility (Golden Visas, Remittance Basis, CGT Shield)</option>
                  <option value="dynasty_philanthropy">Dynasty, Succession & Impact (Dynasty Trusts, MBO, Foundations)</option>
                </select>
              </div>

              {/* Conditional Personal Risk Fields */}
              {newCategory === 'personal_risk_mgmt' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50/60 rounded-xl border border-purple-200">
                  <div>
                    <label className="text-[11px] font-black uppercase text-purple-900 block mb-1">
                      Personal Risk Exposure
                    </label>
                    <select
                      value={newRiskType}
                      onChange={(e) => setNewRiskType(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-purple-300 rounded-lg font-bold text-xs bg-white text-purple-900 focus:outline-none"
                    >
                      <option value="medical_expenses">Medical Expenses</option>
                      <option value="disability_income">Disability of Earners</option>
                      <option value="custodial_care">Custodial / LTC Care</option>
                      <option value="premature_death">Premature Death</option>
                      <option value="property_liability_losses">Property & Liability</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-purple-900 block mb-1">
                      Mitigation Strategy
                    </label>
                    <select
                      value={newRiskStrategy}
                      onChange={(e) => setNewRiskStrategy(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-purple-300 rounded-lg font-bold text-xs bg-white text-purple-900 focus:outline-none"
                    >
                      <option value="hybrid_stop_loss">Hybrid Stop-Loss</option>
                      <option value="retained_loss_reserve">Retained Loss Reserve</option>
                      <option value="insurance_transfer">Insurance Transfer</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Conditional Retirement Planning Fields */}
              {newCategory === 'retirement_planning' && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-black uppercase text-amber-900 block mb-1">
                        Retire Age (Early &lt;65)
                      </label>
                      <input
                        type="number"
                        min={35}
                        max={75}
                        value={newRetireAge}
                        onChange={(e) => setNewRetireAge(parseInt(e.target.value) || 55)}
                        className="w-full px-2.5 py-1.5 border border-amber-300 rounded-lg font-bold font-mono-numbers text-xs bg-white text-amber-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase text-amber-900 block mb-1">
                        Longevity Horizon
                      </label>
                      <input
                        type="number"
                        min={75}
                        max={105}
                        value={newLongevityAge}
                        onChange={(e) => setNewLongevityAge(parseInt(e.target.value) || 90)}
                        className="w-full px-2.5 py-1.5 border border-amber-300 rounded-lg font-bold font-mono-numbers text-xs bg-white text-amber-900 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-amber-900 block mb-1">
                      Distribution Strategy
                    </label>
                    <select
                      value={newDistStrategy}
                      onChange={(e) => setNewDistStrategy(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-amber-300 rounded-lg font-bold text-xs bg-white text-amber-900 focus:outline-none"
                    >
                      <option value="safe_withdrawal_4pct">4% Safe Withdrawal Rate (Inflation Adjusted)</option>
                      <option value="annuity_guaranteed">Guaranteed Life Annuity Floor</option>
                      <option value="cashflow_dividend_rental">Dividend & Rental Cashflow Engine</option>
                      <option value="bucket_strategy">3-Bucket Strategy (Cash, Bonds, Equity)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  General Investment Purpose
                </label>
                <select
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value as any)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                >
                  <option value="financial_security">Greater financial security & shock absorption</option>
                  <option value="retire_early">The ability to retire early (well before 65)</option>
                  <option value="second_income">A second income in addition to earnings</option>
                  <option value="standard_of_living">A better standard of living in the future</option>
                  <option value="grandchildren_legacy">A capital fund to pass on to children or grandchildren</option>
                  <option value="enjoy_investing">Simply enjoy the investment process</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Goal Name / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Education Fund / Second Income Real Estate"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Description & Context
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific planning factors, milestones, family beneficiaries..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Currency
                  </label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AED">AED</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Target Year
                  </label>
                  <input
                    type="number"
                    min={2026}
                    max={2060}
                    value={newTargetYear}
                    onChange={(e) => setNewTargetYear(parseInt(e.target.value) || 2028)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newTargetAmount}
                    onChange={(e) => setNewTargetAmount(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold font-mono-numbers text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as ObjectivePriority)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                  >
                    <option value="essential">Essential (Top Priority)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="aspirational">Aspirational</option>
                  </select>
                </div>
              </div>

              <DuolingoButton variant="green" fullWidth type="submit" className="!py-2.5">
                Establish Wealth Objective
              </DuolingoButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
