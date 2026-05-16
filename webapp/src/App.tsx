import React from 'react'
import Header from './components/Header'
import DashboardCards from './components/DashboardCards'
import TradesList from './components/TradesList'
import MasterToggle from './components/MasterToggle'
import ManualDock from './components/ManualDock'
import SettingsTabs from './components/SettingsTabs'
import SettingsPanel from './components/SettingsPanel'
import BrokerProfile from './components/BrokerProfile'
import AppShell from './components/AppShell'

export default function App() {
  return (
    <AppShell>
      <Header />

      <main className="mt-6 space-y-6">
        <MasterToggle />
        <DashboardCards />
        <TradesList />
        <ManualDock />
        <SettingsTabs />
        <SettingsPanel />
        <BrokerProfile />
      </main>
    </AppShell>
  )
}
