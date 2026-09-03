import './KPICard.css'

export default function KPICard({ title, value, change, period, icon: Icon, isPositive }) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
        <div className="kpi-icon">
          <Icon size={16} />
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-footer">
        <span className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{change}
        </span>
        <span className="kpi-period">{period}</span>
      </div>
    </div>
  )
}
