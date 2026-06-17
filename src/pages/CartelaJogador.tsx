import { useState, useEffect } from 'react';
import { useBingo } from '../context/BingoContext';
import { buscarJogador } from '../api/jogadoresController';
import { supabase } from '../api/supabase';
import { ModalNome } from '../components/Modal';
import './CartelaJogador.css';
import logoJB from '../assets/images/Logo_JB_Joice_Bingo_Azul.png';

interface CarteleNumber {
  id: string;
  number: number;
  isSelected: boolean;
  isDrawn: boolean;
}

export function CartelaJogadorPage() {
  const {
    numbersDrawn,
    adicionarJogador,
    jogadores,
    selecionarNumero,
    deselecionarNumero,
    carregandoJogadores,
    recarregarJogadores,
    removerJogador,
    embaralharCartelaJogador,
    limparPoder,
    setSessaoAtual,
    sessaoAtual,
  } = useBingo();
  const [jogadorId, setJogadorId] = useState<string | null>(null);
  const [cartelaNumbers, setCartelaNumbers] = useState<CarteleNumber[]>([]);
  const [showModal, setShowModal] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [showPoderModal, setShowPoderModal] = useState(false);
  const [usandoPoder, setUsandoPoder] = useState(false);
  const [notificacaoTroca, setNotificacaoTroca] = useState<string | null>(null);

  const jogadorAtual = jogadores.find((j) => j.id === jogadorId);

  useEffect(() => {
    const jogadorIdSalvo = localStorage.getItem('jogador-id');
    if (jogadorIdSalvo && sessaoAtual) {
      setJogadorId(jogadorIdSalvo);
      setShowModal(false);
    }
  }, [sessaoAtual]);

  const handleNomeSubmit = async (nome: string, sessaoCode: number) => {
    setSalvando(true);
    try {
      setSessaoAtual(sessaoCode);
      const novoJogadorId = await adicionarJogador(nome, sessaoCode);
      if (novoJogadorId) {
        setJogadorId(novoJogadorId);
        localStorage.setItem('jogador-id', novoJogadorId);
        setShowModal(false);
      } else {
        console.error('Erro ao criar jogador');
      }
    } catch (err) {
      console.error('Erro ao criar jogador:', err);
    } finally {
      setSalvando(false);
    }
  };

  useEffect(() => {
    if (!carregandoJogadores && jogadorId && !jogadorAtual) {
      localStorage.removeItem('jogador-id');
      setJogadorId(null);
      setShowModal(true);
    }
  }, [jogadorId, jogadorAtual, carregandoJogadores]);

  const handleSair = async () => {
    if (!jogadorId) return;

    try {
      await removerJogador(jogadorId);
      await recarregarJogadores();
    } catch (err) {
      console.error('Erro ao remover jogador:', err);
    } finally {
      localStorage.removeItem('jogador-id');
      setJogadorId(null);
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (!jogadorId) return;

    const syncCartela = async () => {
      try {
        await buscarJogador(jogadorId);
        await recarregarJogadores();
      } catch (err) {
        console.error('Erro ao sincronizar cartela:', err);
      }
    };

    syncCartela();

    const interval = setInterval(syncCartela, 3000);
    return () => clearInterval(interval);
  }, [jogadorId, recarregarJogadores]);

  useEffect(() => {
    if (!sessaoAtual || !jogadorId) return;

    const channel = supabase
      .channel(`bingo-events-${sessaoAtual}`)
      .on(
        'broadcast',
        { event: 'cartelas_trocadas' },
        (msg: { payload: { swaps: { jogadorId: string; recebidoDeNome: string }[] } }) => {
          const meuSwap = msg.payload.swaps.find((s) => s.jogadorId === jogadorId);
          if (meuSwap) {
            setNotificacaoTroca(meuSwap.recebidoDeNome);
          }
        }
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [sessaoAtual, jogadorId]);

  useEffect(() => {
    if (jogadorAtual) {
      const cartela: CarteleNumber[] = jogadorAtual.cartela.map((num, idx) => ({
        id: `${idx}`,
        number: num,
        isSelected: jogadorAtual.numerosSelecionados.includes(num),
        isDrawn: numbersDrawn.includes(num),
      }));
      setCartelaNumbers(cartela);
    }
  }, [jogadorAtual, numbersDrawn]);

  const handleUsarPoder = async (targetId: string) => {
    if (!jogadorId) return;
    setUsandoPoder(true);
    try {
      await embaralharCartelaJogador(targetId);
      await limparPoder(jogadorId);
    } catch (err) {
      console.error('Erro ao usar poder:', err);
    } finally {
      setUsandoPoder(false);
      setShowPoderModal(false);
    }
  };

  const toggleSelect = async (id: string, numero: number) => {
    if (!jogadorId) return;

    const isCurrentlySelected = jogadorAtual?.numerosSelecionados.includes(numero);

    setCartelaNumbers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );

    try {
      if (isCurrentlySelected) {
        await deselecionarNumero(jogadorId, numero);
      } else {
        await selecionarNumero(jogadorId, numero);
      }
    } catch (err) {
      console.error('Erro ao atualizar número:', err);
    }
  };

  if (carregandoJogadores) {
    return (
      <div className="cartela-jogador-container">
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando...</p>
      </div>
    );
  }

  if (!jogadorAtual) {
    return <ModalNome isOpen={showModal} onSubmit={handleNomeSubmit} disabled={salvando} />;
  }

  return (
    <div className="cartela-jogador-container">

      <div className="cartela-header">
        <div className="logo-container">
          <img
            src={logoJB}
            alt="JB - Joice's Bingo"
            className="logo-image"
          />
        </div>
        <h1>🎫 Sua Cartela 🎫</h1>
        <div className="jogador-info">
          <span className="jogador-badge">👤 {jogadorAtual.nome}</span>
          {sessaoAtual && (
            <span className="sessao-badge-cartela">Sessão #{sessaoAtual}</span>
          )}
          <button
            onClick={handleSair}
            style={{
              padding: '8px 16px',
              marginLeft: '16px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {notificacaoTroca && (
        <div className="notificacao-troca" onClick={() => setNotificacaoTroca(null)}>
          <span>🔀 Você recebeu a cartela de <strong>{notificacaoTroca}</strong>!</span>
          <button className="notificacao-fechar" aria-label="Fechar">✕</button>
        </div>
      )}

      <div className="cartela-wrapper">
        <div className="bingo-header">
          {['B', 'I', 'N', 'G', 'O'].map((letra) => (
            <span key={letra} className="bingo-header-letra">{letra}</span>
          ))}
        </div>

        <div className="cartela-grid">
          {cartelaNumbers.map((item) => (
            <div
              key={item.id}
              className={`cartela-number ${item.isSelected ? 'selected' : ''} ${
                item.isDrawn ? 'drawn' : ''
              }`}
              onClick={() => toggleSelect(item.id, item.number)}
            >
              <span>{item.number}</span>
              {item.isDrawn && <div className="draw-mark">✓</div>}
            </div>
          ))}
        </div>
      </div>

      {jogadorAtual.temPoder && (
        <button
          className="btn-poder-jogador"
          onClick={() => setShowPoderModal(true)}
          title="Você tem o poder! Embaralhe a cartela de outro jogador."
        >
          🔥 poderJogador
        </button>
      )}

      {showPoderModal && (
        <div className="modal-poder-overlay" onClick={() => setShowPoderModal(false)}>
          <div className="modal-poder-content" onClick={(e) => e.stopPropagation()}>
            <h3>🔥 Escolha um jogador para embaralhar a cartela!</h3>
            <div className="modal-poder-lista">
              {jogadores
                .filter((j) => j.id !== jogadorId)
                .map((j) => (
                  <button
                    key={j.id}
                    className="modal-poder-jogador-btn"
                    onClick={() => handleUsarPoder(j.id)}
                    disabled={usandoPoder}
                  >
                    👤 {j.nome}
                  </button>
                ))}
              {jogadores.filter((j) => j.id !== jogadorId).length === 0 && (
                <p className="modal-poder-vazio">Nenhum outro jogador na partida.</p>
              )}
            </div>
            <button className="modal-poder-cancelar" onClick={() => setShowPoderModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="sorteados-info">
        <h3>Números Sorteados: {numbersDrawn.length}</h3>
        <div className="sorteados-grid">
          {numbersDrawn.map((n) => (
            <span key={n} className="sorteado-numero">{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
