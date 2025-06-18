// FRONT-DEV/produtos/src/pages/CidadesList.js
import React, { useEffect, useState } from 'react'; // CORREÇÃO: Removido ' => 'react'
import CidadeForm from '../components/CidadeForm';

function CidadesList() {
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingCidade, setEditingCidade] = useState(null);

  const fetchCidades = async () => {
    setMessage('');
    setMessageType('');
    try {
      const response = await fetch('/api/cidades/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCidades(data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar cidades:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCidades();
  }, []);

  const handleSuccess = (updatedCidade, actionType) => {
    if (actionType === 'added') {
      setCidades(prevCidades => [...prevCidades, updatedCidade]);
    } else if (actionType === 'edited') {
      setCidades(prevCidades =>
        prevCidades.map(cidade => (cidade.id === updatedCidade.id ? updatedCidade : cidade))
      );
      setEditingCidade(null);
    }
  };

  const handleDeleteCidade = async (id, cidadeNome) => {
    if (!window.confirm(`Tem certeza que deseja excluir a cidade "${cidadeNome}" (ID: ${id})?`)) {
      return;
    }

    setMessage('');
    setMessageType('');

    try {
      const response = await fetch(`/api/cidades/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 204) {
        setMessage(`Cidade "${cidadeNome}" (ID: ${id}) excluída com sucesso!`);
        setMessageType('success');
        setCidades(prevCidades => prevCidades.filter(cidade => cidade.id !== id));
      } else {
        const data = await response.json();
        setMessage(`Erro ao excluir cidade (ID: ${id}): ${data.error || 'Erro desconhecido.'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro de rede ou na requisição de exclusão:', error);
      setMessage('Não foi possível conectar ao servidor para excluir a cidade.');
      setMessageType('error');
    }
  };

  const handleEditClick = (cidade) => {
    setEditingCidade(cidade);
  };

  if (loading) {
    return (
      <section className="products-section">
        <h2>Lista de Cidades</h2>
        <p>Carregando Cidades...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <h2>Lista de Cidades</h2>
        <p>Erro ao carregar Cidades: {error.message}</p>
        <p>Verifique se o backend Django está rodando e a API de cidades está acessível em http://localhost:8000/api/cidades/.</p>
      </section>
    );
  }

  return (
    <section className="products-section">
      <h2>Lista de Cidades</h2>
      {message && (
        <p className={`form-message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      {cidades.length > 0 ? (
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cidade</th>
                <th>UF</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cidades.map(cidade => (
                <tr key={cidade.id}>
                  <td>{cidade.id}</td>
                  <td>{cidade.cidade}</td>
                  <td>{cidade.uf}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditClick(cidade)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteCidade(cidade.id, cidade.cidade)}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Nenhuma cidade cadastrada.</p>
      )}
      <section className="add-product-section" style={{marginTop: '30px'}}>
        <CidadeForm
          initialData={editingCidade}
          onSuccess={handleSuccess}
        />
        {editingCidade && (
          <button
            className="btn btn-secondary"
            onClick={() => setEditingCidade(null)}
            style={{marginTop: '10px'}}
          >
            Cancelar Edição
          </button>
        )}
      </section>
    </section>
  );
}

export default CidadesList;