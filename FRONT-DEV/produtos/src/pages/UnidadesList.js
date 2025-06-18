// FRONT-DEV/produtos/src/pages/UnidadesList.js
import React, { useEffect, useState } from 'react'; // CORREÇÃO: Removido ' => 'react'
import UnidadeForm from '../components/UnidadeForm';

function UnidadesList() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingUnidade, setEditingUnidade] = useState(null);

  const fetchUnidades = async () => {
    setMessage('');
    setMessageType('');
    try {
      const response = await fetch('/api/unidades/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUnidades(data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar unidades:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  const handleSuccess = (updatedUnidade, actionType) => {
    if (actionType === 'added') {
      setUnidades(prevUnidades => [...prevUnidades, updatedUnidade]);
    } else if (actionType === 'edited') {
      setUnidades(prevUnidades =>
        prevUnidades.map(unidade => (unidade.id === updatedUnidade.id ? updatedUnidade : unidade))
      );
      setEditingUnidade(null);
    }
  };

  const handleDeleteUnidade = async (id, unidadeTitulo) => {
    if (!window.confirm(`Tem certeza que deseja excluir a unidade "${unidadeTitulo}" (ID: ${id})?`)) {
      return;
    }

    setMessage('');
    setMessageType('');

    try {
      const response = await fetch(`/api/unidades/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 204) {
        setMessage(`Unidade "${unidadeTitulo}" (ID: ${id}) excluída com sucesso!`);
        setMessageType('success');
        setUnidades(prevUnidades => prevUnidades.filter(unidade => unidade.id !== id));
      } else {
        const data = await response.json();
        setMessage(`Erro ao excluir unidade (ID: ${id}): ${data.error || 'Erro desconhecido.'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro de rede ou na requisição de exclusão:', error);
      setMessage('Não foi possível conectar ao servidor para excluir a unidade.');
      setMessageType('error');
    }
  };

  const handleEditClick = (unidade) => {
    setEditingUnidade(unidade);
  };

  if (loading) {
    return (
      <section className="products-section">
        <h2>Lista de Unidades</h2>
        <p>Carregando Unidades...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <h2>Lista de Unidades</h2>
        <p>Erro ao carregar Unidades: {error.message}</p>
        <p>Verifique se o backend Django está rodando e a API de unidades está acessível em http://localhost:8000/api/unidades/.</p>
      </section>
    );
  }

  return (
    <section className="products-section">
      <h2>Lista de Unidades</h2>
      {message && (
        <p className={`form-message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      {unidades.length > 0 ? (
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {unidades.map(unidade => (
                <tr key={unidade.id}>
                  <td>{unidade.id}</td>
                  <td>{unidade.titulo}</td>
                  <td>{unidade.descricao}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditClick(unidade)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteUnidade(unidade.id, unidade.titulo)}
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
        <p>Nenhuma unidade cadastrada.</p>
      )}
      <section className="add-product-section" style={{marginTop: '30px'}}>
        <UnidadeForm
          initialData={editingUnidade}
          onSuccess={handleSuccess}
        />
        {editingUnidade && (
          <button
            className="btn btn-secondary"
            onClick={() => setEditingUnidade(null)}
            style={{marginTop: '10px'}}
          >
            Cancelar Edição
          </button>
        )}
      </section>
    </section>
  );
}

export default UnidadesList;