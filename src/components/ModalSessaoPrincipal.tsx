import { useState } from 'react';
import { criarOuBuscarSessaoComSenha } from '../api/sessaoController';
import './Modal.css';

interface ModalSessaoPrincipalProps {
  isOpen: boolean;
  onSubmit: (sessao: number) => void;
}

export function ModalSessaoPrincipal({ isOpen, onSubmit }: ModalSessaoPrincipalProps) {
  const [sessao, setSessao] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessao.trim() || !senha.trim() || carregando) return;

    const codigo = parseInt(sessao.trim());
    if (isNaN(codigo) || codigo <= 0) {
      setErro('Digite um código numérico válido');
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      const { sessao: sessaoRetornada, erro: erroRetornado } = await criarOuBuscarSessaoComSenha(
        codigo,
        senha.trim()
      );
      if (erroRetornado || !sessaoRetornada) {
        setErro(erroRetornado || 'Erro ao processar sessão.');
        return;
      }
      onSubmit(sessaoRetornada.sessao);
      setSessao('');
      setSenha('');
    } finally {
      setCarregando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🎰 Tela Principal</h2>
        <p>Digite o código da sessão e a senha para continuar</p>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={sessao}
            onChange={(e) => { setSessao(e.target.value); setErro(''); }}
            placeholder="Código da sessão..."
            className="modal-input"
            disabled={carregando}
            min={1}
            autoFocus
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); setErro(''); }}
            placeholder="Senha..."
            className="modal-input"
            disabled={carregando}
          />
          {erro && <p className="modal-erro">{erro}</p>}
          <button
            type="submit"
            className="modal-button"
            disabled={!sessao.trim() || !senha.trim() || carregando}
          >
            {carregando ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
