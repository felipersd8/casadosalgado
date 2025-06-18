// FRONT-DEV/produtos/src/components/UnidadeForm.js
import React, { useState, useEffect } from 'react';
import '../App.css';

// O componente agora pode receber 'initialData' (para edição) e 'onSuccess' (para ambos)
function UnidadeForm({ initialData = null, onSuccess }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Seta o estado inicial do formulário quando 'initialData' muda (para edição)
  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo);
      setDescricao(initialData.descricao);
    } else {
      setTitulo('');
      setDescricao('');
    }
    setMessage('');
    setMessageType('');
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setMessageType('');

    if (!titulo.trim() || !descricao.trim()) {
      setMessage('Todos os campos são obrigatórios!');
      setMessageType('error');
      return;
    }

    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/unidades/${initialData.id}/` : '/api/unidades/';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo: titulo, descricao: descricao }),
      });

      const data = await response.json();

      if (response.ok) {
        const action = initialData ? 'editada' : 'cadastrada';
        setMessage(`Unidade "${data.titulo}" ${action} com sucesso! ID: ${data.id}`);
        setMessageType('success');
        
        if (!initialData) {
          setTitulo('');
          setDescricao('');
        }

        if (onSuccess) {
          onSuccess(data, initialData ? 'edited' : 'added');
        }
      } else {
        setMessage(`Erro ao ${initialData ? 'editar' : 'cadastrar'} unidade: ${data.error || 'Erro desconhecido.'}`);
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
      <h3>{initialData ? 'Editar Unidade' : 'Cadastrar Nova Unidade'}</h3>
      <form onSubmit={handleSubmit} className="generic-form">
        <div className="form-group">
          <label htmlFor="titulo">Título (Ex: Kg, Litro):</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Kg"
            maxLength="16"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descricao">Descrição (Ex: Quilograma):</label>
          <input
            type="text"
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Quilograma"
            maxLength="126"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">{initialData ? 'Atualizar Unidade' : 'Cadastrar Unidade'}</button>
      </form>
      {message && (
        <p className={`form-message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default UnidadeForm;