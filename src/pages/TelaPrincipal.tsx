import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Howl } from 'howler';
import bgMusicFile from '../assets/background.mp3';
import bgImage from '../assets/bg.jpg';
import roletaSound from '../assets/roleta.mp3';
import winSound from '../assets/win.mp3';
import { useBingo } from '../context/BingoContext';
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
    setNumbersDrawn,
    setCurrentNumber,
    setIsRolling,
    reiniciarTodasAsCartelas,
    removerJogador,
  } = useBingo();

  const [reiniciandoCartelas, setReinicandoCartelas] = useState(false);
  const [validacaoModal, setValidacaoModal] = useState({
    isOpen: false,
    sucesso: false,
  });

  const verificarLinhaOuColuna = (numeros: number[], cartela: number[]): boolean => {
    if (numeros.length !== 5) return false;

    // Encontrar os índices dos números selecionados na cartela
    const indices = numeros
      .map((numero) => cartela.indexOf(numero))
      .filter((idx) => idx !== -1);

    if (indices.length !== 5) return false; // Nem todos os números estão na cartela

    // Verificar se estão na mesma linha (5x5 grid)
    const linhas = indices.map((idx) => Math.floor(idx / 5));
    const mesmaLinha = linhas.every((linha) => linha === linhas[0]);

    if (mesmaLinha) return true;

    // Verificar se estão na mesma coluna (5x5 grid)
    const colunas = indices.map((idx) => idx % 5);
    const mesmaColuna = colunas.every((coluna) => coluna === colunas[0]);

    return mesmaColuna;
  };

  const validarNumeroJogador = (jogador: typeof jogadores[0]) => {
    if (!jogador.numerosSelecionados || jogador.numerosSelecionados.length === 0) {
      setValidacaoModal({
        isOpen: true,
        sucesso: false,
      });
      return;
    }

    // Verifica se TODOS os números selecionados estão em numbersDrawn
    const numerosSorteados = jogador.numerosSelecionados.filter((numero) =>
      numbersDrawn.includes(numero)
    );

    const todosNumerosSorteados = numerosSorteados.length >= 5;

    // Verifica se estão em linha ou coluna
    const estamEmLinhaOuColuna = verificarLinhaOuColuna(jogador.numerosSelecionados, jogador.cartela);

    // Bingo válido: todos sorteados E estão em linha/coluna
    const sucesso = todosNumerosSorteados && estamEmLinhaOuColuna;

    setValidacaoModal({
      isOpen: true,
      sucesso: sucesso,
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

  const win = new Howl({
    src: [winSound],
    volume: 1,
  });

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

  const bingou = () => {
    win.play();
    playSound(winSound);
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

      {/* Conteúdo Principal */}
      <div className="overlay">
        
        <div className="logo-container">
          <img 
            src={logoJB} 
            alt="JB - Joice's Bingo"
            className="logo-image"
          />
        </div>
        <h1>🎰 BINGO BARBOSA 🎰</h1>

        <div className="current-number">
          {isRolling ? <div className="rolling-ball"></div> : currentNumber ?? '--'}
        </div>

        <div className="buttons">
          <button onClick={drawNumber} disabled={isRolling}>
            Sortear
          </button>
          <button onClick={bingou}>Bingou!</button>
          <button onClick={restart}>Reiniciar</button>
          <button 
            onClick={handleReiniciarCartelas} 
            disabled={reiniciandoCartelas || jogadores.length === 0}
            style={{ backgroundColor: '#ff6b6b' }}
          >
            {reiniciandoCartelas ? 'Reiniciando...' : '🔄 Reiniciar Cartela'}
          </button>
        </div>

        <div className="drawn-numbers">
          <h3>Números Sorteados:</h3>
          <div className="numbers-grid">
            {numbersDrawn.map((n) => (
              <span key={n} className="number-ball">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ModalValidacao 
        isOpen={validacaoModal.isOpen}
        sucesso={validacaoModal.sucesso}
        onClose={() => setValidacaoModal({ ...validacaoModal, isOpen: false })}
      />
    </div>
  );
}
