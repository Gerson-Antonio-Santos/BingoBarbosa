import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  criarJogador as criarJogadorSupabase,
  listarJogadores as listarJogadoresSupabase,
  atualizarNumerosSelecionados,
  atualizarCartela as atualizarCartelaSupabase,
  deletarJogador as deletarJogadorSupabase,
  definirPoderJogador as definirPoderJogadorSupabase,
  limparPoderJogador as limparPoderJogadorSupabase,
  embaralharCartela as embaralharCartelaSupabase,
} from '../api';
import { supabase } from '../api/supabase';

export interface Jogador {
  id: string;
  nome: string;
  cartela: number[];
  numerosSelecionados: number[];
  temPoder: boolean;
  sessao?: number | null;
}

interface BingoContextType {
  numbersDrawn: number[];
  currentNumber: number | null;
  isRolling: boolean;
  jogadores: Jogador[];
  jogadorComPoder: string | null;
  sessaoAtual: number | null;
  setNumbersDrawn: (numbers: number[]) => void;
  setCurrentNumber: (number: number | null) => void;
  setIsRolling: (isRolling: boolean) => void;
  setSessaoAtual: (sessao: number | null) => void;
  adicionarJogador: (nome: string, sessao?: number) => Promise<string | null>;
  removerJogador: (id: string) => Promise<void>;
  selecionarNumero: (jogadorId: string, numero: number) => Promise<void>;
  deselecionarNumero: (jogadorId: string, numero: number) => Promise<void>;
  gerarNovaCartela: (jogadorId: string) => Promise<void>;
  reiniciarTodasAsCartelas: () => Promise<void>;
  recarregarJogadores: () => Promise<void>;
  ativarPoder: () => void;
  embaralharCartelaJogador: (jogadorId: string) => Promise<void>;
  limparPoder: (jogadorId: string) => Promise<void>;
  carregandoJogadores: boolean;
}

export const BingoContext = createContext<BingoContextType | undefined>(undefined);

const loadInitialState = () => {
  try {
    const saved = localStorage.getItem('bingo-state');
    if (saved) return JSON.parse(saved);
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
  const [jogadorComPoder, setJogadorComPoder] = useState<string | null>(null);
  const [carregandoJogadores, setCarregandoJogadores] = useState(false);
  const [sessaoAtual, setSessaoAtualState] = useState<number | null>(() => {
    const saved = localStorage.getItem('bingo-sessao-atual');
    return saved ? parseInt(saved) : null;
  });

  const setSessaoAtual = (sessao: number | null) => {
    if (sessao !== null) {
      localStorage.setItem('bingo-sessao-atual', String(sessao));
    } else {
      localStorage.removeItem('bingo-sessao-atual');
    }
    setSessaoAtualState(sessao);
  };

  const gerarCartela = () => {
    const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);
    const shuffled = allNumbers.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 25);
  };

  useEffect(() => {
    if (!sessaoAtual) {
      setCarregandoJogadores(false);
      setJogadores([]);
      return;
    }

    const carregarJogadores = async () => {
      try {
        const jogadoresDB = await listarJogadoresSupabase(sessaoAtual);
        if (jogadoresDB) {
          setJogadores(
            jogadoresDB.map((j: any) => ({
              id: j.id,
              nome: j.nome,
              cartela: j.cartela,
              numerosSelecionados: j.numeros_selecionados || [],
              temPoder: j.tem_poder ?? false,
              sessao: j.sessao,
            }))
          );
        }
      } catch (err) {
        console.error('Erro ao carregar jogadores:', err);
      }
    };

    (async () => {
      try {
        setCarregandoJogadores(true);
        await carregarJogadores();
      } finally {
        setCarregandoJogadores(false);
      }
    })();

    const pollingInterval = setInterval(carregarJogadores, 1000);

    const channel = supabase
      .channel(`jogadores-sessao-${sessaoAtual}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jogadores',
          filter: `sessao=eq.${sessaoAtual}`,
        },
        () => carregarJogadores()
      )
      .subscribe();

    return () => {
      clearInterval(pollingInterval);
      channel.unsubscribe();
    };
  }, [sessaoAtual]);

  const adicionarJogador = async (nome: string, sessao?: number): Promise<string | null> => {
    try {
      const cartela = gerarCartela();
      const sessaoParaUsar = sessao ?? sessaoAtual ?? undefined;
      const jogadorDB = await criarJogadorSupabase(nome, cartela, sessaoParaUsar);

      if (jogadorDB) {
        const novoJogador: Jogador = {
          id: jogadorDB.id,
          nome: jogadorDB.nome,
          cartela: jogadorDB.cartela,
          numerosSelecionados: jogadorDB.numeros_selecionados || [],
          temPoder: jogadorDB.tem_poder ?? false,
          sessao: jogadorDB.sessao,
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
          prev.map((j) => (j.id === jogadorId ? { ...j, numerosSelecionados: numeros } : j))
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
          prev.map((j) => (j.id === jogadorId ? { ...j, numerosSelecionados: numeros } : j))
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
          j.id === jogadorId ? { ...j, cartela: novaCartela, numerosSelecionados: [] } : j
        )
      );
    } catch (err) {
      console.error('Erro ao gerar nova cartela:', err);
    }
  };

  const reiniciarTodasAsCartelas = async () => {
    try {
      const novasCartelas: { [key: string]: number[] } = {};
      for (const jogador of jogadores) {
        const novaCartela = gerarCartela();
        novasCartelas[jogador.id] = novaCartela;
        await atualizarCartelaSupabase(jogador.id, novaCartela);
      }
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
      const jogadoresDB = await listarJogadoresSupabase(sessaoAtual ?? undefined);
      if (jogadoresDB) {
        setJogadores(
          jogadoresDB.map((j: any) => ({
            id: j.id,
            nome: j.nome,
            cartela: j.cartela,
            numerosSelecionados: j.numeros_selecionados || [],
            temPoder: j.tem_poder ?? false,
            sessao: j.sessao,
          }))
        );
      }
    } catch (err) {
      console.error('Erro ao recarregar jogadores:', err);
    }
  };

  const ativarPoder = () => {
    if (jogadores.length === 0) return;
    const jogadorAleatorio = jogadores[Math.floor(Math.random() * jogadores.length)];
    setJogadorComPoder(jogadorAleatorio.id);
    definirPoderJogadorSupabase(jogadorAleatorio.id, sessaoAtual ?? undefined).catch(console.error);
  };

  const embaralharCartelaJogador = async (jogadorId: string) => {
    try {
      const jogador = jogadores.find((j) => j.id === jogadorId);
      if (jogador) {
        const novaCartela = [...jogador.cartela].sort(() => Math.random() - 0.5);
        await embaralharCartelaSupabase(jogadorId, novaCartela);
        setJogadores((prev) =>
          prev.map((j) => (j.id === jogadorId ? { ...j, cartela: novaCartela } : j))
        );
      }
    } catch (err) {
      console.error('Erro ao embaralhar cartela:', err);
    }
  };

  const limparPoder = async (jogadorId: string) => {
    try {
      await limparPoderJogadorSupabase(jogadorId);
      setJogadorComPoder(null);
      setJogadores((prev) =>
        prev.map((j) => (j.id === jogadorId ? { ...j, temPoder: false } : j))
      );
    } catch (err) {
      console.error('Erro ao limpar poder:', err);
    }
  };

  useEffect(() => {
    const state = { numbersDrawn, currentNumber };
    localStorage.setItem('bingo-state', JSON.stringify(state));
  }, [numbersDrawn, currentNumber]);

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
        jogadorComPoder,
        sessaoAtual,
        setNumbersDrawn,
        setCurrentNumber,
        setIsRolling,
        setSessaoAtual,
        adicionarJogador,
        removerJogador,
        selecionarNumero,
        deselecionarNumero,
        gerarNovaCartela,
        reiniciarTodasAsCartelas,
        recarregarJogadores,
        ativarPoder,
        embaralharCartelaJogador,
        limparPoder,
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
