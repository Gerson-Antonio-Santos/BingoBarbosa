import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Howl } from 'howler';
import bgMusicFile from '../assets/background.mp3';
import bgImage from '../assets/bg.jpg';
import roletaSound from '../assets/roleta.mp3';
import winSound from '../assets/win.mp3';
import { useBingo } from '../context/BingoContext';
import { atualizarNumerosSelecionados } from '../api';
import { ModalValidacao } from '../components/ModalValidacao';
import './TelaPrincipal.css';
import logoJB from '../assets/images/Logo_JB_Joice_Bingo_Azul.png'; 

const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);

export function TelaPrincipalPage() {
  const navigate = useNavigate();
  const {
    numbersDrawn,
    currentNumber,
    isRolling,
    jogadores,
    sessaoAtual,
    setNumbersDrawn,
    setCurrentNumber,
    setIsRolling,
    reiniciarTodasAsCartelas,
    removerJogador,
    ativarPoder,
    trocarCartelas,
  } = useBingo();

  const [reiniciandoCartelas, setReinicandoCartelas] = useState(false);
  const [trocandoCartelas, setTrocandoCartelas] = useState(false);
  const [validacaoModal, setValidacaoModal] = useState<{
    isOpen: boolean;
    sucesso: boolean;
    jogadorId: string | null;
    numerosInvalidos: number[];
  }>({
    isOpen: false,
    sucesso: false,
    jogadorId: null,
    numerosInvalidos: [],
  });

  const temLinhaOuColunaCompleta = (numeros: number[], cartela: number[]): boolean => {
    // Encontrar os índices dos números na cartela
    const indices = numeros
      .map((numero) => cartela.indexOf(numero))
      .filter((idx) => idx !== -1);

    if (indices.length < 5) return false; // Precisa ter pelo menos 5 números

    // Verificar se existe uma linha completa (5 números em uma mesma linha)
    for (let linha = 0; linha < 5; linha++) {
      const linhaIndices = [linha * 5, linha * 5 + 1, linha * 5 + 2, linha * 5 + 3, linha * 5 + 4];
      const todosNaLinha = linhaIndices.every((idx) => indices.includes(idx));
      if (todosNaLinha) return true;
    }

    // Verificar se existe uma coluna completa (5 números em uma mesma coluna)
    for (let coluna = 0; coluna < 5; coluna++) {
      const colunaIndices = [coluna, coluna + 5, coluna + 10, coluna + 15, coluna + 20];
      const todoNaColuna = colunaIndices.every((idx) => indices.includes(idx));
      if (todoNaColuna) return true;
    }

    return false;
  };

  const validarNumeroJogador = (jogador: typeof jogadores[0]) => {
    if (!jogador.numerosSelecionados || jogador.numerosSelecionados.length === 0) {
      setValidacaoModal({ isOpen: true, sucesso: false, jogadorId: jogador.id, numerosInvalidos: [] });
      return;
    }

    // Encontrar números que foram SORTEADOS E SELECIONADOS (interseção)
    const sorteadosESelecionados = jogador.numerosSelecionados.filter((numero) =>
      numbersDrawn.includes(numero)
    );

    // Bingo válido: existe uma linha ou coluna completa com números sorteados e selecionados
    const sucesso = temLinhaOuColunaCompleta(sorteadosESelecionados, jogador.cartela);

    const numerosInvalidos = jogador.numerosSelecionados.filter((n) => !numbersDrawn.includes(n));

    setValidacaoModal({
      isOpen: true,
      sucesso,
      jogadorId: jogador.id,
      numerosInvalidos,
    });

    if (sucesso) {
      const winSound2 = new Howl({
        src: [winSound],
        volume: 1,
      });
      winSound2.play();
    }
  };

  const playSound = (soundFile: string) => {
    const sound = new Howl({ src: [soundFile] });
    sound.play();
  };

  // const win = new Howl({
  //   src: [winSound],
  //   volume: 1,
  // });

  const drawNumber = () => {
    if (numbersDrawn.length >= 80 || isRolling) return;

    setIsRolling(true);
    playSound(roletaSound);

    setTimeout(() => {
      const available = allNumbers.filter((n) => !numbersDrawn.includes(n));
      const newNumber = available[Math.floor(Math.random() * available.length)];
      setCurrentNumber(newNumber);
      setNumbersDrawn([...numbersDrawn, newNumber]);
      setIsRolling(false);
    }, 1000);
  };

  const restart = () => {
    setNumbersDrawn([]);
    setCurrentNumber(null);
  };

  // const bingou = () => {
  //   win.play();
  //   playSound(winSound);
  // };

  const handleTrocarCartelas = async () => {
    setTrocandoCartelas(true);
    try {
      await trocarCartelas();
    } catch (err) {
      console.error('Erro ao trocar cartelas:', err);
    } finally {
      setTrocandoCartelas(false);
    }
  };

  const handleReiniciarCartelas = async () => {
    setReinicandoCartelas(true);
    try {
      await reiniciarTodasAsCartelas();
    } catch (err) {
      console.error('Erro ao reiniciar cartelas:', err);
    } finally {
      setReinicandoCartelas(false);
    }
  };

  const handleRemoverInvalidos = async () => {
    const { jogadorId, numerosInvalidos } = validacaoModal;
    if (!jogadorId || numerosInvalidos.length === 0) return;

    const jogador = jogadores.find((j) => j.id === jogadorId);
    if (!jogador) return;

    const numerosValidos = jogador.numerosSelecionados.filter((n) => !numerosInvalidos.includes(n));
    try {
      await atualizarNumerosSelecionados(jogadorId, numerosValidos);
    } catch (err) {
      console.error('Erro ao remover números inválidos:', err);
    }
    setValidacaoModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleRemoverJogador = async (jogadorId: string) => {
    try {
      await removerJogador(jogadorId);
    } catch (err) {
      console.error('Erro ao remover jogador:', err);
    }
  };

  useEffect(() => {
    const bgMusic = new Howl({
      src: [bgMusicFile],
      autoplay: true,
      loop: true,
      volume: 0.1,
    });

    bgMusic.play();

    return () => {
      bgMusic.stop();
    };
  }, []);

  return (
    <div className="TelaPrincipal" style={{ backgroundImage: `url(${bgImage})` }}>
      <button className="back-button" onClick={() => navigate('/')}>
        ← Voltar
      </button>

      {/* Lista de Jogadores à Esquerda */}
      <div className="jogadores-sidebar">
        <h2>👥 Jogadores</h2>
        <div className="jogadores-list">
          {jogadores.length === 0 ? (
            <p className="no-jogadores">Nenhum jogador conectado</p>
          ) : (
            jogadores.map((jogador) => (
              <div key={jogador.id} className="jogador-item">
                <span className="jogador-nome">{jogador.nome}</span>
                <div className="jogador-buttons">
                  <button 
                    className="btn-validar-jogador"
                    onClick={() => validarNumeroJogador(jogador)}
                    title="Validar números do jogador"
                  >
                    ✓
                  </button>
                  <button 
                    className="btn-remover-jogador"
                    onClick={() => handleRemoverJogador(jogador.id)}
                    title="Remover jogador"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="jogadores-count">
          Total: {jogadores.length} jogador(es)
        </div>
      </div>


      <div className="overlay">
        <div className="overlay-header">
          <img src={logoJB} alt="JB - Joice's Bingo" className="logo-image" />
          <h1>🎰 BINGO BARBOSA 🎰</h1>
          {sessaoAtual && (
            <div className="sessao-badge">Sessão #{sessaoAtual}</div>
          )}
        </div>

        <div className="current-number">
          {isRolling ? <div className="rolling-ball"></div> : currentNumber ?? '--'}
        </div>

        <div className="buttons">
          <button onClick={drawNumber} disabled={isRolling}>
            🎲 Sortear
          </button>
          <button onClick={restart}>🔄 Reiniciar</button>
          <button
            className="btn-nova-cartela"
            onClick={handleReiniciarCartelas}
            disabled={reiniciandoCartelas || jogadores.length === 0}
          >
            {reiniciandoCartelas ? 'Reiniciando...' : '🃏 Nova Cartela'}
          </button>
          <button
            className="btn-ativar-poder"
            onClick={ativarPoder}
            disabled={jogadores.length === 0}
            title="Sorteia um jogador para receber o poder"
          >
            ⚡ Ativar Poder
          </button>
          <button
            className="btn-trocar-cartela"
            onClick={handleTrocarCartelas}
            disabled={trocandoCartelas || jogadores.length < 2}
            title="Troca as cartelas entre os jogadores aleatoriamente"
          >
            {trocandoCartelas ? 'Trocando...' : '🔀 Trocar Cartela'}
          </button>
        </div>

        <div className="drawn-numbers">
          <h3>Números Sorteados: <span className="count">{numbersDrawn.length}</span>/80</h3>
          <div className="numbers-grid">
            {numbersDrawn.map((n) => (
              <span key={n} className="number-ball">{n}</span>
            ))}
          </div>
        </div>
      </div>

      <ModalValidacao
        isOpen={validacaoModal.isOpen}
        sucesso={validacaoModal.sucesso}
        numerosInvalidos={validacaoModal.numerosInvalidos}
        onClose={() => setValidacaoModal((prev) => ({ ...prev, isOpen: false }))}
        onRemoverInvalidos={handleRemoverInvalidos}
      />
    </div>
  );
}
