import { useState } from 'react';
import './Modal.css';

interface ModalNomeProps {
  isOpen: boolean;
  onSubmit: (nome: string) => void;
  disabled?: boolean;
}

export function ModalNome({ isOpen, onSubmit, disabled = false }: ModalNomeProps) {
  const [nome, setNome] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim() && !disabled) {
      onSubmit(nome.trim());
      setNome('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bem-vindo ao Bingo!</h2>
        <p>Digite seu nome para começar</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome..."
            autoFocus
            maxLength={20}
            className="modal-input"
            disabled={disabled}
          />
          <button type="submit" className="modal-button" disabled={!nome.trim() || disabled}>
            {disabled ? 'Salvando...' : 'Começar a Jogar'}
          </button>
        </form>
      </div>
    </div>
  );
}
