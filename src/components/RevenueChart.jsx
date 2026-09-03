import { useState } from 'react'
import './RevenueChart.css'

export default function RevenueChart() {
  const [period, setPeriod] = useState('monthly')

  const months = ['Set', 'Out', 'Nov', 'Dez', 'Jan']
  const dataPoints = [
    { month: 'Set', value: 35 },
    { month: 'Out', value: 65 },
    { month: 'Nov', value: 50 },
    { month: 'Dez', value: 75 },
    { month: 'Jan', value: 60 },
  ]

  const maxValue = 100
  const chartWidth = 500
  const chartHeight = 180
  const padding = 10

  // Gerar points para a linha
  let pathData = ''
  dataPoints.forEach((point, index) => {
    const x = padding + (index / (dataPoints.length - 1)) * (chartWidth - padding * 2)
    const y = chartHeight - (point.value / maxValue) * chartHeight
    pathData += `${index === 0 ? 'M' : 'L'} ${x} ${y} `
  })

  return (
    <div className="revenue-chart">
      <div className="chart-header">
        <h3 className="chart-title">Evolução da Receita</h3>
        <div className="period-selector">
          <button 
            className={`period-btn ${period === 'daily' ? 'active' : ''}`}
            onClick={() => setPeriod('daily')}
          >
            Diário
          </button>
          <button 
            className={`period-btn ${period === 'weekly' ? 'active' : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            Semanal
          </button>
          <button 
            className={`period-btn ${period === 'monthly' ? 'active' : ''}`}
            onClick={() => setPeriod('monthly')}
          >
            Mensal
          </button>
        </div>
      </div>

      <div className="chart-visual">
        <svg width="100%" height="220" viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="0" x2="500" y2="0" stroke="#e5e7eb" />
          <line x1="0" y1="60" x2="500" y2="60" stroke="#e5e7eb" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="#e5e7eb" />
          <line x1="0" y1="180" x2="500" y2="180" stroke="#e5e7eb" />

          {/* Chart line */}
          <polyline
            points={dataPoints.map((point, index) => {
              const x = 10 + (index / (dataPoints.length - 1)) * 480
              const y = chartHeight - (point.value / maxValue) * chartHeight
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Dots on points */}
          {dataPoints.map((point, index) => {
            const x = 10 + (index / (dataPoints.length - 1)) * 480
            const y = chartHeight - (point.value / maxValue) * chartHeight
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#2563eb"
              />
            )
          })}
        </svg>

        {/* Labels */}
        <div className="chart-labels">
          {months.map((month, index) => (
            <div key={index} className="chart-label">
              {month}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
