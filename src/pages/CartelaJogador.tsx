import { useState, useEffect } from 'react';
import { useBingo } from '../context/BingoContext';
import { buscarJogador } from '../api/jogadoresController';
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
  } = useBingo();
  const [jogadorId, setJogadorId] = useState<string | null>(null);
  const [cartelaNumbers, setCartelaNumbers] = useState<CarteleNumber[]>([]);
  const [showModal, setShowModal] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const jogadorAtual = jogadores.find((j) => j.id === jogadorId);

  // Carregar jogadorId do localStorage ao iniciar e fazer primeiro sync
  useEffect(() => {
    const jogadorIdSalvo = localStorage.getItem('jogador-id');
    if (jogadorIdSalvo) {
      setJogadorId(jogadorIdSalvo);
      setShowModal(false);
    }
  }, []);

  const handleNomeSubmit = async (nome: string) => {
    setSalvando(true);
    try {
      const novoJogadorId = await adicionarJogador(nome);
      if (novoJogadorId) {
        setJogadorId(novoJogadorId);
        // Salvar no localStorage
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

  // Detectar se o jogador foi removido e limpar localStorage
  useEffect(() => {
    if (jogadorId && !jogadorAtual) {
      // Jogador foi removido, limpar localStorage e mostrar modal
      localStorage.removeItem('jogador-id');
      setJogadorId(null);
      setShowModal(true);
    }
  }, [jogadorId, jogadorAtual]);

  const handleSair = async () => {
    if (!jogadorId) return;
    
    try {
      // Remover jogador do banco de dados
      await removerJogador(jogadorId);
      // Recarregar a lista de jogadores para atualizar a TelaPrincipal
      await recarregarJogadores();
    } catch (err) {
      console.error('Erro ao remover jogador:', err);
    } finally {
      // Limpar localStorage e voltar para modal
      localStorage.removeItem('jogador-id');
      setJogadorId(null);
      setShowModal(true);
    }
  };

  // Sincronização da cartela com o banco em tempo real
  useEffect(() => {
    if (!jogadorId) return;

    const syncCartela = async () => {
      try {
        // Buscar dados atualizados do banco
        await buscarJogador(jogadorId);
        // Recarregar todos os jogadores para manter em sync
        await recarregarJogadores();
      } catch (err) {
        console.error('Erro ao sincronizar cartela:', err);
      }
    };

    // Fazer sync imediato na primeira vez
    syncCartela();

    // Depois sincronizar a cada 3 segundos
    const interval = setInterval(syncCartela, 3000);

    return () => clearInterval(interval);
  }, [jogadorId, recarregarJogadores]);

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

  const toggleSelect = async (id: string, numero: number) => {
    if (!jogadorId) return;

    const isCurrentlySelected = jogadorAtual?.numerosSelecionados.includes(numero);

    setCartelaNumbers((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isSelected: !item.isSelected }
          : item
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
