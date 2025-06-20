// FRONT-DEV/produtos/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importe os novos componentes de página (REMOVIDA A IMPORTAÇÃO DE PRODUTOSLIST AQUI)
import GruposList from './pages/GruposList';
import UnidadesList from './pages/UnidadesList';
import CidadesList from './pages/CidadesList';

// Importe o componente Navbar
import Navbar from './components/Navbar';

// Logo da Casa do Salgado (AJUSTADO PARA .JPG)
const logoCasaDoSalgado = process.env.PUBLIC_URL + '/logo_casa_do_salgado.jpg';

// Componente ProdutosList (agora está definido localmente no App.js, por isso não é importado de './pages')
function ProdutosList() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // Para mensagens de delete
  const [messageType, setMessageType] = useState(''); // Para tipo de mensagem (success/error)


  const fetchProdutos = async () => {
    setMessage(''); // Limpa mensagens ao recarregar a lista
    setMessageType('');
    try {
      const response = await fetch('/api/produtos/'); // Endpoint para GET (lista)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProdutos(data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleDeleteProduto = async (id, produtoDescricao) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${produtoDescricao}" (ID: ${id})?`)) {
      return; // O usuário cancelou a exclusão
    }

    setMessage(''); // Limpa mensagens anteriores
    setMessageType('');

    try {
      // Usando concatenação de strings para a URL de DELETE.
      const deleteUrl = '/api/produtos/' + id + '/';
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) { // 204 No Content para DELETE bem-sucedido
        setMessage(`Produto "${produtoDescricao}" (ID: ${id}) excluído com sucesso!`);
        setMessageType('success');
        setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
      } else {
        const data = await response.json();
        setMessage(`Erro ao excluir produto (ID: ${id}): ${data.error || 'Erro desconhecido.'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro de rede ou na requisição de exclusão:', error);
      setMessage('Não foi possível conectar ao servidor para excluir o produto.');
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <section className="products-section">
        <h2>Lista de Produtos</h2>
        <p>Carregando produtos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <h2>Lista de Produtos</h2>
        <p>Erro ao carregar produtos: {error.message}</p>
        <p>Verifique se o backend Django está rodando e a API de produtos está acessível.</p>
      </section>
    );
  }

  return (
    <section className="products-section">
      <h2>Lista de Produtos</h2>
      {message && ( // Exibe mensagens de exclusão aqui
        <p className={`form-message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      {produtos.length > 0 ? (
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Cód. Externo</th>
                <th>Grupo</th>
                <th>Unidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id}>{/* Conteúdo em uma única linha para evitar o warning de whitespace */}
                  <td>{produto.id}</td><td>{produto.descricao}</td><td>R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}</td><td>{produto.qntEstoque}</td><td>{produto.codExterno}</td><td>{produto.grupo__grupo || 'N/A'}</td><td>{produto.unidade__titulo || 'N/A'}</td><td className="actions-cell"><button className="btn btn-edit">Editar</button><button className="btn btn-delete" onClick={() => handleDeleteProduto(produto.id, produto.descricao)}>Deletar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Nenhum produto cadastrado no momento. Cadastre novos produtos para vê-los aqui!</p>
      )}
      <section className="add-product-section">
        <h2>Cadastrar Novo Produto</h2>
        <p>O formulário de cadastro de produto será implementado aqui.</p>
      </section>
    </section>
  );
}


// Componente principal App que gerencia o roteamento
function App() {
  return (
    <Router> {/* O Router envolve toda a aplicação para habilitar o roteamento */}
      <div className="app-container">
        <header className="app-header">
          <img src={logoCasaDoSalgado} alt="Logo Casa do Salgado" className="app-logo" />
          <h1 className="app-title">Controle de Cadastros</h1> {/* Título mais geral */}
          <p className="app-subtitle">Gerenciamento eficiente para a Casa do Salgado</p>
          <Navbar /> {/* Inclui o menu de navegação */}
        </header>
        <main className="app-main">
          <Routes> {/* Define as rotas */}
            {/* Rota padrão: redireciona para /produtos */}
            <Route path="/" element={<ProdutosList />} />
            {/* Rotas para cada tipo de cadastro */}
            <Route path="/produtos" element={<ProdutosList />} />
            <Route path="/grupos" element={<GruposList />} />
            <Route path="/unidades" element={<UnidadesList />} />
            <Route path="/cidades" element={<CidadesList />} />
          </Routes>
          <section className="add-product-section">
            <h2>Formulários de Cadastro</h2>
            <p>Os formulários de cadastro e edição serão implementados aqui, conforme a página selecionada.</p>
          </section>
        </main>
      </div>
    </Router>
  );
}

export default App;