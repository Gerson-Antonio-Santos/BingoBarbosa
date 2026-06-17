import './ModalValidacao.css';

interface ModalValidacaoProps {
  isOpen: boolean;
  sucesso: boolean;
  numerosInvalidos?: number[];
  onClose: () => void;
  onRemoverInvalidos?: () => void;
}

export function ModalValidacao({ isOpen, sucesso, numerosInvalidos = [], onClose, onRemoverInvalidos }: ModalValidacaoProps) {
  if (!isOpen) return null;

  const temInvalidos = !sucesso && numerosInvalidos.length > 0;

  return (
    <div className="modal-validacao-overlay" onClick={onClose}>
      <div className={`modal-validacao-content ${sucesso ? 'sucesso' : 'falha'}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-validacao-emoji">
          {sucesso ? '🎉' : '😢'}
        </div>

        <h2>{sucesso ? 'BINGO!' : 'AQUI NÃO LULA -  \nFaz o L'}</h2>

        <p>
          {sucesso
            ? 'Parabéns! 🏆'
            : 'Ainda faltam números para serem sorteados.'}
        </p>

        {temInvalidos && (
          <div className="modal-invalidos-info">
            <span>{numerosInvalidos.length} número(s) selecionado(s) incorretamente:</span>
            <div className="modal-invalidos-numeros">
              {numerosInvalidos.map((n) => (
                <span key={n} className="modal-invalido-badge">{n}</span>
              ))}
            </div>
          </div>
        )}

        <div className="modal-validacao-actions">
          {temInvalidos && onRemoverInvalidos && (
            <button
              onClick={onRemoverInvalidos}
              className="modal-validacao-button remover-invalidos"
            >
              🗑️ Remover Inválidos
            </button>
          )}
          <button onClick={onClose} className={`modal-validacao-button ${sucesso ? 'sucesso' : 'falha'}`}>
            {sucesso ? '✓ Legal!' : '✓ OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
