// FRONT-DEV/produtos/src/components/GrupoForm.js
import React, { useState, useEffect } from 'react';
import '../App.css'; // Para usar os estilos gerais

// O componente agora pode receber 'initialData' (para edição) e 'onSuccess' (para ambos)
function GrupoForm({ initialData = null, onSuccess }) {
  const [grupo, setGrupo] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Seta o estado inicial do formulário quando 'initialData' muda (para edição)
  useEffect(() => {
    if (initialData) {
      setGrupo(initialData.grupo);
    } else {
      setGrupo(''); // Limpa se for um novo formulário (initialData é null)
    }
    setMessage(''); // Limpa mensagens ao carregar/resetar o formulário
    setMessageType('');
  }, [initialData]); // Roda sempre que initialData (o grupo a ser editado) muda

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setMessageType('');

    if (!grupo.trim()) {
      setMessage('O nome do grupo não pode ser vazio!');
      setMessageType('error');
      return;
    }

    const method = initialData ? 'PUT' : 'POST'; // Se tem initialData, é PUT; senão, é POST
    const url = initialData ? `/api/grupos/${initialData.id}/` : '/api/grupos/'; // URL para PUT ou POST

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grupo: grupo }), // Envia o nome do grupo como JSON
      });

      const data = await response.json();

      if (response.ok) {
        const action = initialData ? 'editado' : 'cadastrado';
        setMessage(`Grupo "${data.grupo}" ${action} com sucesso! ID: ${data.id}`);
        setMessageType('success');
        
        // Se for um cadastro novo, limpa o campo
        if (!initialData) {
          setGrupo('');
        }

        if (onSuccess) {
          onSuccess(data, initialData ? 'edited' : 'added'); // Notifica o componente pai sobre a ação
        }
      } else {
        setMessage(`Erro ao ${initialData ? 'editar' : 'cadastrar'} grupo: ${data.error || 'Erro desconhecido.'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro de rede ou na requisição:', error);
      setMessage('Não foi possível conectar ao servidor. Verifique sua conexão e o backend.');
      setMessageType('error');
    }
  };

  return (
    <div className="form-container">
      <h3>{initialData ? 'Editar Grupo' : 'Cadastrar Novo Grupo'}</h3>
      <form onSubmit={handleSubmit} className="generic-form">
        <div className="form-group">
          <label htmlFor="grupo">Nome do Grupo:</label>
          <input
            type="text"
            id="grupo"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            placeholder="Ex: Salgados Fritos"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">{initialData ? 'Atualizar Grupo' : 'Cadastrar Grupo'}</button>
      </form>
      {message && (
        <p className={`form-message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default GrupoForm;