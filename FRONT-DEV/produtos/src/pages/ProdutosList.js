// FRONT-DEV/produtos/src/pages/ProdutosList.js
import React, { useEffect, useState } from 'react';

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
      // CORREÇÃO FINAL AQUI: Usando concatenação de strings para a URL de DELETE.
      // Isso garante que o ID seja tratado como string pura e sem colchetes ou qualquer formatação inesperada.
      const deleteUrl = '/api/produtos/' + id + '/';
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // DELETE com sucesso retorna status 204 No Content, que não tem corpo.
      if (response.status === 204) {
        setMessage(`Produto "${produtoDescricao}" (ID: ${id}) excluído com sucesso!`);
        setMessageType('success');
        // Filtra o produto excluído da lista para atualizar a UI
        setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
      } else {
        // Se o status não for 204, tenta ler o corpo da resposta para pegar a mensagem de erro do Django
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

export default ProdutosList;