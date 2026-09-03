import { DollarSign, TrendingUp, Receipt, Wrench } from 'lucide-react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KPICard from './components/KPICard'
import RevenueChart from './components/RevenueChart'
import TopProducts from './components/TopProducts'
import TechniciansTable from './components/TechniciansTable'
import OrdensServico from './components/OrdensServico'
import Clientes from './components/Clientes'
import Vendas from './components/Vendas'

import './App.css'

function Dashboard() {
  const kpiData = [
    {
      title: 'Receita Bruta',
      value: 'R$ 48.920,00',
      change: '12,4%',
      period: 'este mês',
      icon: DollarSign,
      isPositive: true
    },
    {
      title: 'Lucro Líquido',
      value: 'R$ 18.450,00',
      change: '8,2%',
      period: 'este mês',
      icon: TrendingUp,
      isPositive: true
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 320,00',
      change: '1,5%',
      period: 'este mês',
      icon: Receipt,
      isPositive: false
    },
    {
      title: 'Ordens Abertas',
      value: '42',
      change: 'Ativas',
      period: 'este mês',
      icon: Wrench,
      isPositive: true
    },
  ]

  return (
    <>
      <Header />

      <section className="kpi-row">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </section>

      <section className="charts-grid">
        <RevenueChart />
        <TopProducts />
      </section>

      <section className="content-section">
        <TechniciansTable />
      </section>
    </>
  )
}

function PaginaTemporaria({ titulo }) {
  return (
    <>
      <Header />

      <section
        style={{
          background: 'white',
          padding: '32px',
          borderRadius: '12px',
          marginTop: '24px'
        }}
      >
        <h2>{titulo}</h2>
        <p style={{ marginTop: '12px', color: '#6b7280' }}>
          Esta página será implementada na próxima etapa.
        </p>
      </section>
    </>
  )
}

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/ordens"
            element={<OrdensServico />}
          />

          <Route
            path="/estoque"
            element={<PaginaTemporaria titulo="Estoque" />}
          />

          <Route
            path="/vendas"
            element={<Vendas titulo="Vendas (PDV)" />}
          />


          <Route path="/clientes" element={<Clientes />} />

          <Route
            path="/clientes"
            element={<PaginaTemporaria titulo="Clientes" />}
          />


          <Route
            path="/relatorios"
            element={<PaginaTemporaria titulo="Relatórios" />}
          />

          <Route
            path="/configuracoes"
            element={<PaginaTemporaria titulo="Configurações" />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App