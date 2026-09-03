import {
  LayoutDashboard,
  Wrench,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings
} from 'lucide-react'

import { NavLink } from 'react-router-dom'
import './Sidebar.css'

export default function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wrench, label: 'Ordens de Serviço', path: '/ordens' },
    { icon: Package, label: 'Estoque', path: '/estoque' },
    { icon: ShoppingCart, label: 'Vendas (PDV)', path: '/vendas' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-top">

        <div className="brand">
          <div className="brand-logo">
            <div className="logo-icon">CPU</div>
          </div>

          <div className="brand-text">
            <h1 className="brand-title"> AlphaOS </h1>
            <p className="brand-subtitle">SISTEMA DE GESTÃO</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

      </div>

      <div className="user-footer">
        <div className="user-avatar">RS</div>

        <div className="user-details">
          <div className="user-name">Rodrigo Souza</div>
          <div className="role-badge">Admin</div>
        </div>
      </div>
    </aside>
  )
}