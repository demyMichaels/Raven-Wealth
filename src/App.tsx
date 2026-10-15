/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './state/simulationContext';
import { Header } from './components/common/Header';
import { MobileNavigation } from './components/common/MobileNavigation';
import { DashboardView } from './components/views/DashboardView';
import { ObjectivesView } from './components/views/ObjectivesView';
import { PortfolioView } from './components/views/PortfolioView';
import { GoogleLiveMarketView } from './components/views/GoogleLiveMarketView';
import { RealEstateView } from './components/views/RealEstateView';
import { AjoSyndicateView } from './components/views/AjoSyndicateView';
import { GlobalRelocationView } from './components/views/GlobalRelocationView';
import { BusinessDynastyView } from './components/views/BusinessDynastyView';
import { AdvanceQuarterModal } from './components/views/AdvanceQuarterModal';
import { QuarterSettlementLog } from './types/wealth';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [settlementLog, setSettlementLog] = useState<QuarterSettlementLog | null>(null);
  const [showAdvanceModal, setShowAdvanceModal] = useState<boolean>(false);

  const { advanceQuarter } = useSimulation();

  const handleAdvanceQuarter = () => {
    const log = advanceQuarter();
    setSettlementLog(log);
    setShowAdvanceModal(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'objectives':
        return <ObjectivesView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'markets':
        return <GoogleLiveMarketView />;
      case 'realestate':
        return <RealEstateView />;
      case 'ajo':
        return <AjoSyndicateView />;
      case 'global':
        return <GlobalRelocationView />;
      case 'dynasty':
        return <BusinessDynastyView />;
      case 'dashboard':
      default:
        return (
          <DashboardView
            onNavigateTab={setActiveTab}
            onAdvanceQuarter={handleAdvanceQuarter}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAdvanceQuarterClick={handleAdvanceQuarter}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-32 sm:pb-24">
        {renderActiveView()}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Advance Quarter Modal */}
      <AdvanceQuarterModal
        log={settlementLog}
        isOpen={showAdvanceModal}
        onClose={() => setShowAdvanceModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <MainApp />
    </SimulationProvider>
  );
}
