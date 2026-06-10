import { useState } from 'react';
import { buscarSessao } from '../api/sessaoController';
import './Modal.css';

interface ModalNomeProps {
  isOpen: boolean;
  onSubmit: (nome: string, sessao: number) => void;
  disabled?: boolean;
}

export function ModalNome({ isOpen, onSubmit, disabled = false }: ModalNomeProps) {
  const [nome, setNome] = useState('');
  const [sessao, setSessao] = useState('');
  const [erroSessao, setErroSessao] = useState('');
  const [validando, setValidando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !sessao.trim() || disabled || validando) return;

    const codigo = parseInt(sessao.trim());
    if (isNaN(codigo) || codigo <= 0) {
      setErroSessao('Digite um código numérico válido');
      return;
    }

    setErroSessao('');
    setValidando(true);
    try {
      const sessaoExistente = await buscarSessao(codigo);
      if (!sessaoExistente) {
        setErroSessao('Código de sessão não encontrado. Verifique o código informado.');
        return;
      }
      onSubmit(nome.trim(), codigo);
      setNome('');
      setSessao('');
    } finally {
      setValidando(false);
    }
  };

  if (!isOpen) return null;

  const carregando = disabled || validando;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bem-vindo ao Bingo!</h2>
        <p>Digite seu nome e o código da sessão para começar</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome..."
            autoFocus
            maxLength={20}
            className="modal-input"
            disabled={carregando}
          />
          <input
            type="number"
            value={sessao}
            onChange={(e) => { setSessao(e.target.value); setErroSessao(''); }}
            placeholder="Código da sessão..."
            className="modal-input"
            disabled={carregando}
            min={1}
          />
          {erroSessao && (
            <p className="modal-erro">{erroSessao}</p>
          )}
          <button
            type="submit"
            className="modal-button"
            disabled={!nome.trim() || !sessao.trim() || carregando}
          >
            {carregando ? 'Verificando...' : 'Começar a Jogar'}
          </button>
        </form>
      </div>
    </div>
  );
}
