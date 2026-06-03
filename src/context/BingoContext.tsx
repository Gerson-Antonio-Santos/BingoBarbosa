import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  criarJogador as criarJogadorSupabase,
  listarJogadores as listarJogadoresSupabase,
  atualizarNumerosSelecionados,
  atualizarCartela as atualizarCartelaSupabase,
  deletarJogador as deletarJogadorSupabase,
} from '../api';
import { supabase } from '../api/supabase';

export interface Jogador {
  id: string;
  nome: string;
  cartela: number[];
  numerosSelecionados: number[];
}

interface BingoContextType {
  numbersDrawn: number[];
  currentNumber: number | null;
  isRolling: boolean;
  jogadores: Jogador[];
  setNumbersDrawn: (numbers: number[]) => void;
  setCurrentNumber: (number: number | null) => void;
  setIsRolling: (isRolling: boolean) => void;
  adicionarJogador: (nome: string) => Promise<string | null>;
  removerJogador: (id: string) => Promise<void>;
  selecionarNumero: (jogadorId: string, numero: number) => Promise<void>;
  deselecionarNumero: (jogadorId: string, numero: number) => Promise<void>;
  gerarNovaCartela: (jogadorId: string) => Promise<void>;
  reiniciarTodasAsCartelas: () => Promise<void>;
  recarregarJogadores: () => Promise<void>;
  carregandoJogadores: boolean;
}

export const BingoContext = createContext<BingoContextType | undefined>(undefined);

// Carregar estado inicial do localStorage
const loadInitialState = () => {
  try {
    const saved = localStorage.getItem('bingo-state');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Erro ao carregar estado do localStorage:', e);
  }
  return { numbersDrawn: [], currentNumber: null };
};

export function BingoProvider({ children }: { children: ReactNode }) {
  const initialState = loadInitialState();
  const [numbersDrawn, setNumbersDrawn] = useState<number[]>(initialState.numbersDrawn);
  const [currentNumber, setCurrentNumber] = useState<number | null>(initialState.currentNumber);
  const [isRolling, setIsRolling] = useState(false);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [carregandoJogadores, setCarregandoJogadores] = useState(true);

  const gerarCartela = () => {
    const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);
    const shuffled = allNumbers.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 25);
  };

  // Carregar jogadores do Supabase ao iniciar
  useEffect(() => {
    const carregarJogadores = async () => {
      try {
        const jogadoresDB = await listarJogadoresSupabase();
        if (jogadoresDB) {
          setJogadores(
            jogadoresDB.map((j: any) => ({
              id: j.id,
              nome: j.nome,
              cartela: j.cartela,
              numerosSelecionados: j.numeros_selecionados || [],
            }))
          );
        }
      } catch (err) {
        console.error('Erro ao carregar jogadores:', err);
      }
    };

    // Carregar inicialmente
    (async () => {
      try {
        setCarregandoJogadores(true);
        await carregarJogadores();
      } finally {
        setCarregandoJogadores(false);
      }
    })();

    // Configurar polling para sincronizar a cada 1 segundo
    const pollingInterval = setInterval(() => {
      carregarJogadores();
    }, 1000);

    // Configurar listener em tempo real para mudanças na tabela de jogadores (como fallback extra)
    const channel = supabase
      .channel('jogadores-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta INSERT, UPDATE e DELETE
          schema: 'public',
          table: 'jogadores',
        },
        (payload) => {
          console.log('Mudança detectada no Supabase:', payload);
          // Recarregar a lista de jogadores quando há qualquer mudança
          carregarJogadores();
        }
      )
      .subscribe((status) => {
        console.log('Supabase channel status:', status);
      });

    // Limpar intervalos e inscrições quando o componente desmonta
    return () => {
      clearInterval(pollingInterval);
      channel.unsubscribe();
    };
  }, []);

  const adicionarJogador = async (nome: string): Promise<string | null> => {
    try {
      const cartela = gerarCartela();
      const jogadorDB = await criarJogadorSupabase(nome, cartela);

      if (jogadorDB) {
        const novoJogador: Jogador = {
          id: jogadorDB.id,
          nome: jogadorDB.nome,
          cartela: jogadorDB.cartela,
          numerosSelecionados: jogadorDB.numeros_selecionados || [],
        };
        setJogadores((prev) => [...prev, novoJogador]);
        return jogadorDB.id;
      }
      return null;
    } catch (err) {
      console.error('Erro ao adicionar jogador:', err);
      return null;
    }
  };

  const removerJogador = async (id: string) => {
    try {
      await deletarJogadorSupabase(id);
      setJogadores((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error('Erro ao remover jogador:', err);
    }
  };

  const selecionarNumero = async (jogadorId: string, numero: number) => {
    try {
      const jogador = jogadores.find((j) => j.id === jogadorId);
      if (jogador) {
        const numeros = [...new Set([...jogador.numerosSelecionados, numero])];
        await atualizarNumerosSelecionados(jogadorId, numeros);

        setJogadores((prev) =>
          prev.map((j) =>
            j.id === jogadorId
              ? { ...j, numerosSelecionados: numeros }
              : j
          )
        );
      }
    } catch (err) {
      console.error('Erro ao selecionar número:', err);
    }
  };

  const deselecionarNumero = async (jogadorId: string, numero: number) => {
    try {
      const jogador = jogadores.find((j) => j.id === jogadorId);
      if (jogador) {
        const numeros = jogador.numerosSelecionados.filter((n) => n !== numero);
        await atualizarNumerosSelecionados(jogadorId, numeros);

        setJogadores((prev) =>
          prev.map((j) =>
            j.id === jogadorId
              ? { ...j, numerosSelecionados: numeros }
              : j
          )
        );
      }
    } catch (err) {
      console.error('Erro ao desselecionar número:', err);
    }
  };

  const gerarNovaCartela = async (jogadorId: string) => {
    try {
      const novaCartela = gerarCartela();
      await atualizarCartelaSupabase(jogadorId, novaCartela);

      setJogadores((prev) =>
        prev.map((j) =>
          j.id === jogadorId
            ? {
                ...j,
                cartela: novaCartela,
                numerosSelecionados: [],
              }
            : j
        )
      );
    } catch (err) {
      console.error('Erro ao gerar nova cartela:', err);
    }
  };

  const reiniciarTodasAsCartelas = async () => {
    try {
      // Gerar novas cartelas para cada jogador
      const novasCartelas: { [key: string]: number[] } = {};
      for (const jogador of jogadores) {
        const novaCartela = gerarCartela();
        novasCartelas[jogador.id] = novaCartela;
        await atualizarCartelaSupabase(jogador.id, novaCartela);
      }

      // Atualizar estado local com as mesmas cartelas
      setJogadores((prev) =>
        prev.map((j) => ({
          ...j,
          cartela: novasCartelas[j.id] || j.cartela,
          numerosSelecionados: [],
        }))
      );
    } catch (err) {
      console.error('Erro ao reiniciar todas as cartelas:', err);
    }
  };

  const recarregarJogadores = async () => {
    try {
      const jogadoresDB = await listarJogadoresSupabase();
      if (jogadoresDB) {
        setJogadores(
          jogadoresDB.map((j: any) => ({
            id: j.id,
            nome: j.nome,
            cartela: j.cartela,
            numerosSelecionados: j.numeros_selecionados || [],
          }))
        );
      }
    } catch (err) {
      console.error('Erro ao recarregar jogadores:', err);
    }
  };

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    const state = {
      numbersDrawn,
      currentNumber,
    };
    localStorage.setItem('bingo-state', JSON.stringify(state));
  }, [numbersDrawn, currentNumber]);

  // Listener para sincronizar entre abas
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'bingo-state' && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue);
          if (newState.numbersDrawn) setNumbersDrawn(newState.numbersDrawn);
          if (newState.currentNumber !== undefined) setCurrentNumber(newState.currentNumber);
        } catch (e) {
          console.error('Erro ao sincronizar estado:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BingoContext.Provider
      value={{
        numbersDrawn,
        currentNumber,
        isRolling,
        jogadores,
        setNumbersDrawn,
        setCurrentNumber,
        setIsRolling,
        adicionarJogador,
        removerJogador,
        selecionarNumero,
        deselecionarNumero,
        gerarNovaCartela,
        reiniciarTodasAsCartelas,
        recarregarJogadores,
        carregandoJogadores,
      }}
    >
      {children}
    </BingoContext.Provider>
  );
}

export function useBingo() {
  const context = React.useContext(BingoContext);
  if (!context) {
    throw new Error('useBingo deve ser usado dentro de BingoProvider');
  }
  return context;
}
