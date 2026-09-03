import { Bell, HelpCircle } from 'lucide-react'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-text">
        <h1 className="header-title">Painel Financeiro</h1>
        <p className="header-subtitle">Visão geral de receitas, lucros e desempenho de reparos</p>
      </div>
      <div className="header-actions">
        <button className="header-button">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        <button className="header-button">
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  )
}
