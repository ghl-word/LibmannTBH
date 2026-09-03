import './TechniciansTable.css'

export default function TechniciansTable() {
  const technicians = [
    {
      name: 'Gabriel Menezes',
      specialty: 'iOS / Apple',
      completed: 86,
      revenue: 'R$ 14.500,00',
      efficiency: '98%'
    },
    {
      name: 'Mariana Costa',
      specialty: 'Android / Solda',
      completed: 74,
      revenue: 'R$ 11.200,00',
      efficiency: '95%'
    },
    {
      name: 'Lucas Almeida',
      specialty: 'Geral',
      completed: 58,
      revenue: 'R$ 8.900,00',
      efficiency: '92%'
    },
  ]

  return (
    <div className="technicians-section">
      <h3 className="section-title">Técnicos em Destaque (Reparos Concluídos)</h3>
      <div className="tech-table">
        <div className="table-header">
          <div className="table-cell">Nome do Técnico</div>
          <div className="table-cell">Especialidade</div>
          <div className="table-cell">OS Concluídas</div>
          <div className="table-cell">Faturamento Gerado</div>
          <div className="table-cell">Aproveitamento</div>
        </div>
        {technicians.map((tech, index) => (
          <div key={index} className="table-row">
            <div className="table-cell">{tech.name}</div>
            <div className="table-cell">{tech.specialty}</div>
            <div className="table-cell">{tech.completed}</div>
            <div className="table-cell">{tech.revenue}</div>
            <div className="table-cell efficiency">{tech.efficiency}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
