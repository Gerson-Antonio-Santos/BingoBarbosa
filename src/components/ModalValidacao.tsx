import './ModalValidacao.css';

interface ModalValidacaoProps {
  isOpen: boolean;
  sucesso: boolean;
  onClose: () => void;
}

export function ModalValidacao({ isOpen, sucesso, onClose }: ModalValidacaoProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-validacao-overlay" onClick={onClose}>
      <div className={`modal-validacao-content ${sucesso ? 'sucesso' : 'falha'}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-validacao-emoji">
          {sucesso ? '🎉' : '😢'}
        </div>
        
        <h2>{sucesso ? 'Bingou!' : 'Esse Faz o L'}</h2>
        
        <p>
          {sucesso 
            ? 'Parabéns! Todos os números foram sorteados! 🏆' 
            : 'Ainda faltam números para serem sorteados. 📊'}
        </p>
        
        <button onClick={onClose} className={`modal-validacao-button ${sucesso ? 'sucesso' : 'falha'}`}>
          {sucesso ? '✓ Legal!' : '✓ OK'}
        </button>
      </div>
    </div>
  );
}
