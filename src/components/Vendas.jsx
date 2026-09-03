import { useState, useEffect } from 'react'
import { Search, Plus, X, Trash2, Edit3, Package, CheckCircle, AlertCircle, UserPlus, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'
import Header from './Header'
import './Vendas.css'

export default function Vendas() {
  const [listaVendas, setListaVendas] = useState([])
  const [produtos, setProdutos] = useState([])
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)

  // Modais
  const [modalVendaAberto, setModalVendaAberto] = useState(false)
  const [modalClienteAberto, setModalClienteAberto] = useState(false)
  
  // Controle de Edição de Venda
  const [vendaEditando, setVendaEditando] = useState(null)

  // Estados de Busca e Cliente
  const [buscaGeral, setBuscaGeral] = useState('') 
  const [buscaCliente, setBuscaCliente] = useState('') 
  const [clienteSelecionado, setClienteSelecionado] = useState(null)

  // Estados do Novo Cliente (Cadastro Rápido)
  const [novoCliente, setNovoCliente] = useState({ nome: '', telefone: '', cpf: '' })

  // Estados do Carrinho
  const [itensVenda, setItemsVenda] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [quantidadeItem, setQuantidadeItem] = useState(1)
  
  // Estados para o Item Manual
  const [modoManual, setModoManual] = useState(false)
  const [nomeManual, setNomeManual] = useState('')
  const [precoManual, setPrecoManual] = useState('')

  // Estados de Pagamento
  const [meioPagamento, setMeioPagamento] = useState('Dinheiro')
  const [parcelas, setParcelas] = useState('À vista')

  // Sistema de Toast (Popup sutil)
  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' })
  const [toastTimer, setToastTimer] = useState(null)

  const mostrarToast = (mensagem, tipo = 'sucesso') => {
    if (toastTimer) clearTimeout(toastTimer)
    setToast({ visivel: true, mensagem, tipo })
    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, visivel: false }))
    }, 3500)
    setToastTimer(timer)
  }

  const buscarDadosVendas = () => {
    setCarregando(true)
    Promise.all([
      fetch('http://localhost:3001/api/vendas').then(res => res.json()),
      fetch('http://localhost:3001/api/produtos').then(res => res.json()),
      fetch('http://localhost:3001/api/clientes').then(res => res.json())
    ])
      .then(([vendasData, produtosData, clientesData]) => {
        setListaVendas(vendasData)
        setProdutos(produtosData)
        setClientes(clientesData)
      })
      .catch(err => {
        console.error("Erro ao buscar dados:", err)
        mostrarToast("Erro ao carregar dados.", "erro")
      })
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    buscarDadosVendas()
  }, [])

  // ==========================================
  // CÁLCULO DOS CARDS (KPIs)
  // ==========================================
  const calcularKPIs = () => {
    const hoje = new Date().toLocaleDateString('pt-BR')
    
    let vendasHoje = 0
    let transacoesHoje = 0
    let totalGeral = 0

    listaVendas.forEach(venda => {
      totalGeral += Number(venda.valor_total || 0)
      const dataVenda = new Date(venda.data_venda).toLocaleDateString('pt-BR')
      if (dataVenda === hoje) {
        vendasHoje += Number(venda.valor_total || 0)
        transacoesHoje++
      }
    })

    const ticketMedio = listaVendas.length > 0 ? (totalGeral / listaVendas.length) : 0
    return { vendasHoje, transacoesHoje, ticketMedio }
  }

  const kpis = calcularKPIs()

  // ==========================================
  // FUNÇÕES DE CADASTRO DE CLIENTE RÁPIDO
  // ==========================================
  const cadastrarClienteRapido = async (e) => {
    e.preventDefault()
    if (!novoCliente.nome) return mostrarToast("O nome do cliente é obrigatório.", "erro")

    try {
      const res = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCliente)
      })

      if (res.ok) {
        const clienteSalvo = await res.json()
        setClientes([...clientes, clienteSalvo])
        setClienteSelecionado(clienteSalvo)
        setModalClienteAberto(false)
        setNovoCliente({ nome: '', telefone: '', cpf: '' })
        mostrarToast("Cliente cadastrado com sucesso!", "sucesso")
      } else {
        const errData = await res.json()
        mostrarToast(errData.error || "Erro ao cadastrar cliente.", "erro")
      }
    } catch (err) {
      console.error(err)
      mostrarToast("Erro de conexão.", "erro")
    }
  }

  // ==========================================
  // FUNÇÕES DO CARRINHO E VENDAS
  // ==========================================
  const adicionarItemAoCarrinho = async () => {
    // SE FOR MANUAL: Não salva no banco agora, apenas joga no carrinho
    if (modoManual) {
      if (!nomeManual || !precoManual) return mostrarToast("Preencha o nome e o preço do item.", "erro")
      
      setItemsVenda([...itensVenda, {
        produto_id: `manual_${Date.now()}`, // ID temporário que o Back-end vai reconhecer
        nome: nomeManual,
        preco_unitario: Number(precoManual),
        quantidade: Number(quantidadeItem),
        isManual: true // Avisa o sistema que é avulso
      }])

      setNomeManual('')
      setPrecoManual('')
      setQuantidadeItem(1)
      setModoManual(false)
      mostrarToast("Item manual adicionado ao carrinho!", "sucesso")
      return
    }

    // SE FOR DO ESTOQUE
    if (!produtoSelecionado) return mostrarToast("Selecione um produto do estoque.", "erro")
    const prod = produtos.find(p => p.id === Number(produtoSelecionado))
    if (!prod) return

    const itemExistente = itensVenda.find(i => i.produto_id === prod.id)
    if (itemExistente) {
      setItemsVenda(itensVenda.map(i => 
        i.produto_id === prod.id ? { ...i, quantidade: i.quantidade + Number(quantidadeItem) } : i
      ))
    } else {
      setItemsVenda([...itensVenda, {
        produto_id: prod.id,
        nome: prod.nome,
        preco_unitario: Number(prod.preco),
        quantidade: Number(quantidadeItem),
        isManual: false
      }])
    }
    setProdutoSelecionado('')
    setQuantidadeItem(1)
  }

  const removerItemCarrinho = (produto_id) => {
    setItemsVenda(itensVenda.filter(i => i.produto_id !== produto_id))
  }

  const calcularTotalVenda = () => {
    return itensVenda.reduce((total, item) => total + (item.preco_unitario * item.quantidade), 0)
  }

  const abrirNovaVenda = () => {
    setVendaEditando(null)
    setClienteSelecionado(null)
    setItemsVenda([])
    setMeioPagamento('Dinheiro')
    setParcelas('À vista')
    setModalVendaAberto(true)
  }

  const abrirEdicaoVenda = (venda) => {
    setVendaEditando(venda.id)
    const cliente = clientes.find(c => c.id === venda.cliente_id)
    setClienteSelecionado(cliente || { nome: venda.cliente_nome, id: venda.cliente_id })
    
    if (venda.meio_pagamento && venda.meio_pagamento.includes('Cartão de Crédito')) {
      setMeioPagamento('Cartão de Crédito')
      const matchParcela = venda.meio_pagamento.match(/\(([^)]+)\)/)
      setParcelas(matchParcela ? matchParcela[1] : 'À vista')
    } else {
      setMeioPagamento(venda.meio_pagamento || 'Dinheiro')
      setParcelas('À vista')
    }
    
    setItemsVenda([]) 
    setModalVendaAberto(true)
    mostrarToast("Edição aberta (itens não carregados provisoriamente).", "sucesso")
  }

  const cancelarVenda = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar e excluir esta venda?")) return
    try {
      const res = await fetch(`http://localhost:3001/api/vendas/${id}`, { method: 'DELETE' })
      if (res.ok) {
        mostrarToast("Venda cancelada com sucesso!", "sucesso")
        buscarDadosVendas()
      } else {
        mostrarToast("Erro ao cancelar venda.", "erro")
      }
    } catch (err) {
      console.error(err)
      mostrarToast("Erro de conexão.", "erro")
    }
  }

  const salvarVenda = async (e) => {
    e.preventDefault()
    if (!clienteSelecionado) return mostrarToast("Selecione um cliente.", "erro")
    if (!vendaEditando && itensVenda.length === 0) return mostrarToast("Adicione pelo menos um item.", "erro")

    const pagamentoFinal = meioPagamento === 'Cartão de Crédito' 
      ? `Cartão de Crédito (${parcelas})` : meioPagamento

    const dadosVenda = {
      cliente_id: clienteSelecionado.id,
      valor_total: calcularTotalVenda(),
      meio_pagamento: pagamentoFinal,
      itens: itensVenda // Envia os itens (incluindo os avulsos que o back-end vai processar)
    }

    try {
      const url = vendaEditando 
        ? `http://localhost:3001/api/vendas/${vendaEditando}` 
        : 'http://localhost:3001/api/vendas'
      
      const method = vendaEditando ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosVenda)
      })

      if (res.ok) {
        mostrarToast(vendaEditando ? "Venda editada!" : "Venda finalizada!", "sucesso")
        setModalVendaAberto(false)
        buscarDadosVendas()
      } else {
        mostrarToast("Erro ao salvar no banco de dados.", "erro")
      }
    } catch (err) {
      console.error(err)
      mostrarToast("Erro de conexão.", "erro")
    }
  }

  const formatarValor = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const formatarData = (d) => new Date(d).toLocaleDateString('pt-BR')

  // Filtragem da tabela principal
  const vendasFiltradas = listaVendas.filter(v => 
    v.cliente_nome.toLowerCase().includes(buscaGeral.toLowerCase()) || 
    v.id.toString().includes(buscaGeral)
  )

  return (
    <>
      <Header />
      <section className="vendas-page">
        
        {/* CABEÇALHO */}
        <div className="vendas-header">
          <div>
            <h1 className="page-title">Gestão de Vendas</h1>
            <p className="page-subtitle">Registre e gerencie suas vendas financeiras</p>
          </div>
          <button className="btn-nova-venda" onClick={abrirNovaVenda}>
            <Plus size={18} /> Nova Venda
          </button>
        </div>

        {/* CARDS (KPIs) */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Vendas Hoje</span>
              <DollarSign size={18} className="kpi-icon blue-icon" />
            </div>
            <span className="kpi-value">{formatarValor(kpis.vendasHoje)}</span>
            <span className="kpi-footer">↗ Fechamento diário do caixa</span>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Transações</span>
              <ShoppingCart size={18} className="kpi-icon blue-icon" />
            </div>
            <span className="kpi-value">{kpis.transacoesHoje}</span>
            <span className="kpi-footer">Realizadas hoje</span>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Ticket Médio</span>
              <TrendingUp size={18} className="kpi-icon blue-icon" />
            </div>
            <span className="kpi-value">{formatarValor(kpis.ticketMedio)}</span>
            <span className="kpi-footer">↗ Média geral da loja</span>
          </div>
        </div>

        {/* ÁREA DE BUSCA DA TABELA */}
        <div className="search-section">
          <div>
            <h2 className="search-title">Buscar Vendas</h2>
            <p className="search-subtitle">Encontre vendas por cliente ou ID da venda</p>
          </div>
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por cliente ou ID..." 
              value={buscaGeral}
              onChange={e => setBuscaGeral(e.target.value)}
            />
          </div>
        </div>

        {/* TABELA DE VENDAS */}
        <div className="os-table-container">
          <table className="os-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Vínculo OS</th>
                <th>Pagamento</th>
                <th>Data</th>
                <th>Valor Total</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>Carregando vendas...</td></tr>
              ) : vendasFiltradas.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>Nenhuma venda encontrada.</td></tr>
              ) : (
                vendasFiltradas.map(venda => (
                  <tr key={venda.id}>
                    <td><strong>#{venda.id}</strong></td>
                    <td>{venda.cliente_nome}</td>
                    <td>{venda.numero_os ? <span className="status-badge status-andamento">{venda.numero_os}</span> : 'Venda Direta'}</td>
                    <td>{venda.meio_pagamento}</td>
                    <td>{formatarData(venda.data_venda)}</td>
                    <td><strong style={{color: '#111827'}}>{formatarValor(venda.valor_total)}</strong></td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="table-actions">
                        <button type="button" className="btn-icon btn-edit" title="Editar Venda" onClick={() => abrirEdicaoVenda(venda)}>
                          <Edit3 size={18} />
                        </button>
                        <button type="button" className="btn-icon btn-delete" title="Cancelar Venda" onClick={() => cancelarVenda(venda.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL PRINCIPAL: NOVA/EDITAR VENDA */}
      {modalVendaAberto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>
                {vendaEditando ? `Editar Venda #${vendaEditando}` : 'Registrar Nova Venda'}
              </h2>
              <button type="button" onClick={() => setModalVendaAberto(false)} className="btn-close-modal">
                <X size={26} />
              </button>
            </div>

            <form onSubmit={salvarVenda}>
              <div className="form-grid">
                
                {/* BUSCA DE CLIENTE */}
                <div className="form-group form-full">
                  <label>Cliente</label>
                  {clienteSelecionado ? (
                    <div className="cliente-selecionado-box">
                      <div className="cliente-selecionado-info">
                        <h4>{clienteSelecionado.nome}</h4>
                        <p>{clienteSelecionado.telefone || 'Sem telefone'} • {clienteSelecionado.cpf || 'Sem CPF'}</p>
                      </div>
                      <button type="button" className="btn-trocar-cliente" onClick={() => setClienteSelecionado(null)}>Trocar Cliente</button>
                    </div>
                  ) : (
                    <div className="busca-cliente-wrapper">
                      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <div style={{ position: 'relative', flex: '1' }}>
                          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input 
                            type="text" 
                            className="busca-cliente-input custom-input input-redondo"
                            style={{ paddingLeft: '44px' }}
                            placeholder="Buscar por nome, telefone ou CPF..."
                            value={buscaCliente}
                            onChange={e => setBuscaCliente(e.target.value)}
                          />
                        </div>
                        <button 
                          type="button" 
                          className="btn-novo-cliente-inline redondo"
                          onClick={() => setModalClienteAberto(true)}
                          title="Cadastrar Novo Cliente"
                        >
                          <UserPlus size={20} />
                        </button>
                      </div>

                      {buscaCliente && (
                        <ul className="lista-busca-flutuante custom-scrollbar">
                          {clientes.filter(c => {
                            const termo = buscaCliente.toLowerCase()
                            return (
                              c.nome.toLowerCase().includes(termo) ||
                              (c.telefone && c.telefone.includes(termo)) ||
                              (c.cpf && c.cpf.includes(termo))
                            )
                          }).map(c => (
                            <li key={c.id} onClick={() => { setClienteSelecionado(c); setBuscaCliente('') }}>
                              <strong>{c.nome}</strong>
                              <span>{c.telefone || c.cpf || 'Sem dados'}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* HEADER DE ADICIONAR PRODUTOS */}
                <div className="form-group form-full" style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', margin: 0, fontWeight: '600' }}>Itens da Venda</h3>
                    <button type="button" className="btn-toggle-manual" onClick={() => setModoManual(!modoManual)}>
                      {modoManual ? <><Package size={16}/> Usar Estoque</> : <><Edit3 size={16}/> Adicionar Manualmente</>}
                    </button>
                  </div>
                </div>

                <div className="linha-adicionar-item">
                  {modoManual ? (
                    <>
                      <div className="item-flex-grow">
                        <label>Nome (Avulso)</label>
                        <input type="text" className="custom-input input-arredondado" placeholder="Ex: Película de Vidro..." value={nomeManual} onChange={e => setNomeManual(e.target.value)} />
                      </div>
                      <div className="item-qtd-box">
                        <label>Preço (R$)</label>
                        <input type="number" step="0.01" className="custom-input input-arredondado" placeholder="0.00" value={precoManual} onChange={e => setPrecoManual(e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <div className="item-flex-grow">
                      <label>Produto do Estoque</label>
                      <select className="custom-select input-arredondado" value={produtoSelecionado} onChange={e => setProdutoSelecionado(e.target.value)}>
                        <option value="">Selecione um produto...</option>
                        {produtos
                          /* MÁGICA: Oculta itens que começam com (Avulso) e esconde seus testes com estoque negativo! */
                          .filter(p => !p.nome.startsWith('(Avulso)') && p.quantidade_estoque >= 0)
                          .map(p => (
                          <option key={p.id} value={p.id}>{p.nome} — {formatarValor(p.preco)} (Est: {p.quantidade_estoque})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="item-qtd-box">
                    <label>Qtd</label>
                    <input type="number" min="1" className="custom-input input-arredondado" value={quantidadeItem} onChange={e => setQuantidadeItem(e.target.value)} />
                  </div>

                  <button type="button" className="btn-add-item" onClick={adicionarItemAoCarrinho}>
                    + Add
                  </button>
                </div>

                {/* TABELA DE ITENS NO CARRINHO */}
                <div className="form-group form-full">
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                          <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: '600' }}>Item</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: '600' }}>Qtd</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right', color: '#475569', fontWeight: '600' }}>Preço Unit.</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right', color: '#475569', fontWeight: '600' }}>Subtotal</th>
                          <th style={{ padding: '12px 16px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensVenda.length === 0 ? (
                          <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Nenhum item adicionado à venda.</td></tr>
                        ) : (
                          itensVenda.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '12px 16px' }}>{item.nome}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>{item.quantidade}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>{formatarValor(item.preco_unitario)}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#1e293b' }}>{formatarValor(item.preco_unitario * item.quantidade)}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <button type="button" onClick={() => removerItemCarrinho(item.produto_id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* PAGAMENTO */}
                <div className="form-group">
                  <label>Meio de Pagamento</label>
                  <select className="custom-select input-arredondado" value={meioPagamento} onChange={e => setMeioPagamento(e.target.value)}>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Pix">Pix</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                  </select>
                </div>

                {meioPagamento === 'Cartão de Crédito' && (
                  <div className="form-group">
                    <label>Condição de Parcelamento</label>
                    <select className="custom-select input-arredondado" value={parcelas} onChange={e => setParcelas(e.target.value)}>
                      <option value="À vista">À vista</option>
                      <option value="2x">2x</option>
                      <option value="3x">3x</option>
                      <option value="4x">4x</option>
                      <option value="5x">5x</option>
                      <option value="6x">6x</option>
                      <option value="7x">7x</option>
                      <option value="8x">8x</option>
                      <option value="9x">9x</option>
                      <option value="10x">10x</option>
                    </select>
                  </div>
                )}

                <div className="form-group" style={{ gridColumn: meioPagamento === 'Cartão de Crédito' ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Valor Total</span>
                  <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>{formatarValor(calcularTotalVenda())}</span>
                </div>

              </div>

              <div className="modal-actions" style={{ marginTop: '32px' }}>
                <button type="button" className="btn-cancel" onClick={() => setModalVendaAberto(false)}>Cancelar</button>
                <button type="submit" className="btn-save">{vendaEditando ? 'Salvar Alterações' : 'Finalizar Venda'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SECUNDÁRIO: CADASTRAR CLIENTE NOVO */}
      {modalClienteAberto && (
        <div className="modal-overlay" style={{ zIndex: 10001 }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>Novo Cliente</h2>
              <button type="button" onClick={() => setModalClienteAberto(false)} className="btn-close-modal">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={cadastrarClienteRapido}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#475569' }}>Nome Completo *</label>
                  <input type="text" className="custom-input input-arredondado" value={novoCliente.nome} onChange={e => setNovoCliente({...novoCliente, nome: e.target.value})} required />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#475569' }}>WhatsApp / Telefone</label>
                  <input type="text" className="custom-input input-arredondado" value={novoCliente.telefone} onChange={e => setNovoCliente({...novoCliente, telefone: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#475569' }}>CPF / CNPJ</label>
                  <input type="text" className="custom-input input-arredondado" value={novoCliente.cpf} onChange={e => setNovoCliente({...novoCliente, cpf: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-cancel" onClick={() => setModalClienteAberto(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST POPUP */}
      <div className={`toast-notification ${toast.visivel ? 'show' : ''} ${toast.tipo}`}>
        {toast.tipo === 'sucesso' ? (
          <CheckCircle size={20} color="#10b981" />
        ) : (
          <AlertCircle size={20} color="#ef4444" />
        )}
        <span>{toast.mensagem}</span>
      </div>
    </>
  )
}