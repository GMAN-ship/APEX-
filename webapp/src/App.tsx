import React from 'react'
import Header from './components/Header'
import DashboardCards from './components/DashboardCards'
import TradesList from './components/TradesList'
import MasterToggle from './components/MasterToggle'
import ManualDock from './components/ManualDock'
import SettingsTabs from './components/SettingsTabs'
import BrokerProfile from './components/BrokerProfile'

export default function App() {
  return (
    <div className="min-h-screen text-slate-100 font-sans">
      <div className="max-w-5xl mx-auto p-4">
        <Header />

        <main className="mt-6 space-y-6">
          <MasterToggle />
          <DashboardCards />
          <TradesList />
          <ManualDock />
          <SettingsTabs />
          <BrokerProfile />
        </main>
      </div>
    </div>
  )
}
