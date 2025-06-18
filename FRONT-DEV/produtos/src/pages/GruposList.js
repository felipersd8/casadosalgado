// FRONT-DEV/produtos/src/pages/GruposList.js
import React, { useEffect, useState } from 'react';
import GrupoForm from '../components/GrupoForm'; // Importe o componente de formulário

function GruposList() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingGrupo, setEditingGrupo] = useState(null); // Novo estado para controlar o grupo em edição

  const fetchGrupos = async () => {
    setMessage('');
    setMessageType('');
    try {
      const response = await fetch('/api/grupos/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGrupos(data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar grupos:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleSuccess = (updatedGrupo, actionType) => {
    if (actionType === 'added') {
      setGrupos(prevGrupos => [...prevGrupos, updatedGrupo]);
    } else if (actionType === 'edited') {
      setGrupos(prevGrupos =>
        prevGrupos.map(grupo => (grupo.id === updatedGrupo.id ? updatedGrupo : grupo))
      );
      setEditingGrupo(null); // Sai do modo de edição após salvar
    }
    // A mensagem de sucesso já vem do GrupoForm e é exibida por ele
  };

  const handleDeleteGrupo = async (id, grupoNome) => {
    if (!window.confirm(`Tem certeza que deseja excluir o grupo "${grupoNome}" (ID: ${id})?`)) {
      return;
    }

    setMessage('');
    setMessageType('');

    try {
      const response = await fetch(`/api/grupos/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        setMessage(`Grupo "${grupoNome}" (ID: ${id}) excluído com sucesso!`);
        setMessageType('success');
        setGrupos(prevGrupos => prevGrupos.filter(grupo => grupo.id !== id));
      } else {
        const data = await response.json();
        setMessage(`Erro ao excluir grupo (ID: ${id}): ${data.error || 'Erro desconhecido.'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro de rede ou na requisição de exclusão:', error);
      setMessage('Não foi possível conectar ao servidor para excluir o grupo.');
      setMessageType('error');
    }
  };

  // Função chamada ao clicar no botão "Editar" da tabela
  const handleEditClick = (grupo) => {
    setEditingGrupo(grupo); // Define o grupo a ser editado
  };

  if (loading) {
    return (
      <section className="products-section">
        <h2>Lista de Grupos</h2>
        <p>Carregando Grupos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <h2>Lista de Grupos</h2>
        <p>Erro ao carregar Grupos: {error.message}</p>
        <p>Verifique se o backend Django está rodando e a API de grupos está acessível em http://localhost:8000/api/grupos/.</p>
      </section>
    );
  }

  return (
    <section className="products-section">
      <h2>Lista de Grupos</h2>
      {message && (
        <p className={`form-message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      {grupos.length > 0 ? (
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Grupo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {grupos.map(grupo => (
                <tr key={grupo.id}>
                  <td>{grupo.id}</td>
                  <td>{grupo.grupo}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditClick(grupo)} // Conecta o botão Editar
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteGrupo(grupo.id, grupo.grupo)}
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
        <p>Nenhum grupo cadastrado.</p>
      )}
      {/* Integra o formulário de cadastro/edição de grupo */}
      <section className="add-product-section" style={{marginTop: '30px'}}>
        {/* Renderiza GrupoForm, passando initialData se estiver editando, e a função de sucesso */}
        <GrupoForm
          initialData={editingGrupo}
          onSuccess={handleSuccess}
        />
        {editingGrupo && ( // Mostra o botão "Cancelar Edição" apenas se estiver editando
          <button
            className="btn btn-secondary"
            onClick={() => setEditingGrupo(null)}
            style={{marginTop: '10px'}}
          >
            Cancelar Edição
          </button>
        )}
      </section>
    </section>
  );
}

export default GruposList;