import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Gift, Search, Filter, MessageCircle, Edit2, Clock, X } from 'lucide-react';
import './Clientes.css';

export default function Clientes() {
  const [termoBusca, setTermoBusca] = useState('');
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null); // NULL = Novo Cliente | ID = Editando
  const [formData, setFormData] = useState({
    cpf: '', data_nascimento: '', nome: '', telefone: '', 
    rua: '', numero: '', bairro: '', cidade: ''
  });

  const buscarClientes = () => {
    fetch('http://localhost:3001/api/clientes')
      .then(res => res.json())
      .then(dados => {
        if (Array.isArray(dados)) setClientes(dados);
        setCarregando(false);
      })
      .catch(erro => console.error("Erro:", erro));
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buscarCNPJ = async () => {
    const cnpjLimpo = formData.cpf.replace(/\D/g, ''); 
    if (cnpjLimpo.length !== 14) {
      alert('Por favor, digite um CNPJ válido com 14 números.');
      return;
    }
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      if (!response.ok) throw new Error('CNPJ não encontrado');
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        nome: data.razao_social || prev.nome,
        telefone: data.ddd_telefone_1 || prev.telefone,
        rua: data.logradouro || prev.rua,
        numero: data.numero || prev.numero,
        bairro: data.bairro || prev.bairro,
        cidade: data.municipio || prev.cidade
      }));
    } catch (error) {
      alert('Erro ao buscar CNPJ. Verifique o número digitado.');
    }
  };

  // Prepara o modal para um NOVO cliente
  const abrirModalNovo = () => {
    setClienteEditando(null);
    setFormData({ cpf: '', data_nascimento: '', nome: '', telefone: '', rua: '', numero: '', bairro: '', cidade: '' });
    setModalAberto(true);
  };

  // Prepara o modal para EDITAR um cliente existente
  const abrirModalEdicao = (cliente) => {
    setClienteEditando(cliente.id);
    
    // Ajusta o formato da data para o input type="date" (AAAA-MM-DD)
    let dataNasc = '';
    if (cliente.data_nascimento) {
      dataNasc = cliente.data_nascimento.substring(0, 10);
    }

    setFormData({
      cpf: cliente.cpf || '',
      data_nascimento: dataNasc,
      nome: cliente.nome || '',
      telefone: cliente.telefone || '',
      rua: cliente.rua || '',
      numero: cliente.numero || '',
      bairro: cliente.bairro || '',
      cidade: cliente.cidade || ''
    });
    setModalAberto(true);
  };

  // Salva (POST) ou Atualiza (PUT)
  const salvarCliente = async (e) => {
    e.preventDefault();
    try {
      const url = clienteEditando 
        ? `http://localhost:3001/api/clientes/${clienteEditando}` 
        : 'http://localhost:3001/api/clientes';
      
      const method = clienteEditando ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (response.ok) {
        setModalAberto(false);
        setClienteEditando(null);
        setFormData({ cpf: '', data_nascimento: '', nome: '', telefone: '', rua: '', numero: '', bairro: '', cidade: '' }); 
        buscarClientes(); 
      } else {
        // Exibe o erro retornado pelo back-end (como CPF duplicado)
        alert(data.error || 'Erro ao salvar cliente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  // ==========================================
  // LÓGICAS DE EXIBIÇÃO (KPIs E FILTROS)
  // ==========================================
  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();
  const totalClientes = clientes.length;

  const cadastradosNesseMes = clientes.filter(c => {
    if (!c.criado_em) return false;
    const dataCad = new Date(c.criado_em);
    return (dataCad.getMonth() + 1) === mesAtual && dataCad.getFullYear() === anoAtual;
  }).length;

  const aniversariantesMes = clientes.filter(c => {
    if (!c.data_nascimento) return false;
    const mesNascimento = parseInt(c.data_nascimento.substring(5, 7), 10);
    return mesNascimento === mesAtual;
  }).length;

  const clientesFiltrados = clientes.filter(cliente => {
    const nome = cliente.nome ? cliente.nome.toLowerCase() : '';
    const telefone = cliente.telefone ? cliente.telefone : '';
    return nome.includes(termoBusca.toLowerCase()) || telefone.includes(termoBusca);
  });

  const formatarData = (dataIso) => {
    if (!dataIso) return '--/--/----';
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="clientes-container">
      {/* 1. CAIXAS SUPERIORES (KPIs) */}
      <div className="clientes-kpi-row">
        <div className="cliente-kpi-card">
          <div className="kpi-header">
            <h4>Clientes Ativos</h4>
            <div className="kpi-icon-wrapper"><Users size={20} /></div>
          </div>
          <div className="kpi-body">
            <h2>{totalClientes}</h2>
            <span><span className="kpi-trend">↗ Atualizado</span> agora</span>
          </div>
        </div>
        <div className="cliente-kpi-card">
          <div className="kpi-header">
            <h4>Novos Este Mês</h4>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--color-danger)' }}><TrendingUp size={20} /></div>
          </div>
          <div className="kpi-body">
            <h2>{cadastradosNesseMes}</h2>
            <span>Este mês</span>
          </div>
        </div>
        <div className="cliente-kpi-card">
          <div className="kpi-header">
            <h4>Aniversariantes</h4>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--color-warning)' }}><Gift size={20} /></div>
          </div>
          <div className="kpi-body">
            <h2>{aniversariantesMes}</h2>
            <span>Neste mês</span>
          </div>
        </div>
      </div>

      {/* 2. ÁREA DE BUSCA */}
      <div className="search-section">
        <div className="search-header">
          <h3>Buscar Clientes</h3>
          <p>Encontre clientes por nome ou WhatsApp</p>
        </div>
        <div className="search-bar-wrapper">
          <div className="search-input-container">
            <Search size={20} color="var(--color-gray-400)" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou WhatsApp..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
          <button className="btn-filtros">
            <Filter size={18} /> Filtros <span className="badge-ativo">Ativo</span>
          </button>
          
          <button className="btn-novo-cliente" onClick={abrirModalNovo}>
            + Novo Cliente
          </button>
        </div>
      </div>

      {/* 3. LISTA DE CLIENTES */}
      <div className="clientes-list-container">
        <div className="list-header">
          <input type="checkbox" />
          <span>Selecionar todos</span>
        </div>

        {carregando ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-gray-500)' }}>
            Carregando clientes...
          </div>
        ) : (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="cliente-row">
              <div className="cliente-info-left">
                <input type="checkbox" />
                <div className="cliente-details">
                  <div className="cliente-name-area">
                    <h4>{cliente.nome}</h4>
                    <span className="status-badge">Ativo</span>
                  </div>
                  <div className="cliente-sub-info">
                    <span>{cliente.telefone || 'Sem telefone'}</span>
                    <span>•</span>
                    <span>Cadastrado em {formatarData(cliente.criado_em)}</span>
                    {cliente.data_nascimento && (
                      <>
                        <span>•</span>
                        <span>Nasc: {formatarData(cliente.data_nascimento)}</span>
                      </>
                    )}
                  </div>
                  <div className="cliente-extra-details">
                    Última OS: {cliente.ultima_compra ? formatarData(cliente.ultima_compra) : 'Nenhuma OS'}
                  </div>
                </div>
              </div>

              <div className="cliente-actions-right">
                <div className="action-icons">
                  <button title="Histórico"><Clock size={18} /></button>
                  <button title="Enviar Mensagem"><MessageCircle size={18} /></button>
                  <button title="Editar" onClick={() => abrirModalEdicao(cliente)}>
                    <Edit2 size={18} />
                  </button>
                </div>
                <div className="cliente-value">
                  <h4>R$ {Number(cliente.valor_gasto || 0).toFixed(2).replace('.', ',')}</h4>
                  <p>Total gasto</p>
                </div>
              </div>
            </div>
          ))
        )}

        {!carregando && clientesFiltrados.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-gray-500)' }}>
            Nenhum cliente encontrado.
          </div>
        )}
      </div>

      {/* 4. MODAL DE NOVO/EDITAR CLIENTE */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            <div className="modal-header-top">
              <h2>{clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <button 
                onClick={() => { setModalAberto(false); setClienteEditando(null); }} 
                style={{ color: 'var(--color-gray-500)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div className="section-subtitle">Dados do Cliente</div>
            <div className="section-divider"></div>

            <form onSubmit={salvarCliente}>
              <div className="form-grid">
                <div className="form-group">
                  <label>CPF / CNPJ</label>
                  <div className="input-with-button">
                    <input 
                      type="text" 
                      name="cpf" 
                      placeholder="Apenas números" 
                      value={formData.cpf} 
                      onChange={handleInputChange} 
                    />
                    <button type="button" className="btn-buscar-cnpj" onClick={buscarCNPJ}>
                      Buscar CNPJ
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input 
                    type="date" 
                    name="data_nascimento" 
                    value={formData.data_nascimento} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="form-group">
                  <label>Nome Completo / Razão Social *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    required 
                    value={formData.nome} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    name="telefone" 
                    value={formData.telefone} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Rua / Logradouro</label>
                  <input 
                    type="text" 
                    name="rua" 
                    value={formData.rua} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="form-group">
                  <label>Número</label>
                  <div className="input-with-checkbox">
                    <input 
                      type="text" 
                      name="numero" 
                      value={formData.numero} 
                      onChange={handleInputChange} 
                      disabled={formData.numero === 'S/N'}
                    />
                    <label className="checkbox-group">
                      <input 
                        type="checkbox" 
                        checked={formData.numero === 'S/N'}
                        onChange={(e) => {
                          setFormData({ 
                            ...formData, 
                            numero: e.target.checked ? 'S/N' : '' 
                          });
                        }}
                      />
                      S/N
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Bairro</label>
                  <input 
                    type="text" 
                    name="bairro" 
                    value={formData.bairro} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="form-group full-width">
                  <label>Cidade</label>
                  <input 
                    type="text" 
                    name="cidade" 
                    value={formData.cidade} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => { setModalAberto(false); setClienteEditando(null); }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  {clienteEditando ? 'Salvar Alterações' : 'Salvar Cliente'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}