// FRONT-DEV/produtos/src/components/CidadeForm.js
import React, { useState, useEffect } from 'react';
import '../App.css';

// O componente agora pode receber 'initialData' (para edição) e 'onSuccess' (para ambos)
function CidadeForm({ initialData = null, onSuccess }) {
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Seta o estado inicial do formulário quando 'initialData' muda (para edição)
  useEffect(() => {
    if (initialData) {
      setCidade(initialData.cidade);
      setUf(initialData.uf);
    } else {
      setCidade('');
      setUf('');
    }
    setMessage('');
    setMessageType('');
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setMessageType('');

    if (!cidade.trim() || !uf.trim()) {
      setMessage('Todos os campos são obrigatórios!');
      setMessageType('error');
      return;
    }
    if (uf.trim().length !== 2) {
      setMessage('UF deve ter 2 caracteres!');
      setMessageType('error');
      return;
    }

    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/cidades/${initialData.id}/` : '/api/cidades/';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cidade: cidade, uf: uf.toUpperCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        const action = initialData ? 'editada' : 'cadastrada';
        setMessage(`Cidade "${data.cidade}" (${data.uf}) ${action} com sucesso! ID: ${data.id}`);
        setMessageType('success');
        
        if (!initialData) {
          setCidade('');
          setUf('');
        }

        if (onSuccess) {
          onSuccess(data, initialData ? 'edited' : 'added');
        }
      } else {
        setMessage(`Erro ao ${initialData ? 'editar' : 'cadastrar'} cidade: ${data.error || 'Erro desconhecido.'}`);
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
      <h3>{initialData ? 'Editar Cidade' : 'Cadastrar Nova Cidade'}</h3>
      <form onSubmit={handleSubmit} className="generic-form">
        <div className="form-group">
          <label htmlFor="cidade">Nome da Cidade:</label>
          <input
            type="text"
            id="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: Florianópolis"
            maxLength="26"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="uf">UF:</label>
          <input
            type="text"
            id="uf"
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            placeholder="Ex: SC"
            maxLength="2"
            style={{ textTransform: 'uppercase' }}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">{initialData ? 'Atualizar Cidade' : 'Cadastrar Cidade'}</button>
      </form>
      {message && (
        <p className={`form-message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default CidadeForm;