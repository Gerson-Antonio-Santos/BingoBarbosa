import { supabase } from './supabase';

export interface JogadorDB {
  id: string;
  nome: string;
  cartela: number[];
  numeros_selecionados: number[];
  created_at: string;
}

/**
 * Criar novo jogador no Supabase
 */
export async function criarJogador(
  nome: string,
  cartela: number[]
): Promise<JogadorDB | null> {
  try {
    const { data, error } = await supabase
      .from('jogadores')
      .insert([
        {
          nome,
          cartela,
          numeros_selecionados: [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar jogador:', error);
      return null;
    }

    return data as JogadorDB;
  } catch (err) {
    console.error('Erro ao criar jogador:', err);
    return null;
  }
}

/**
 * Buscar jogador por ID
 */
export async function buscarJogador(id: string): Promise<JogadorDB | null> {
  try {
    const { data, error } = await supabase
      .from('jogadores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar jogador:', error);
      return null;
    }

    return data as JogadorDB;
  } catch (err) {
    console.error('Erro ao buscar jogador:', err);
    return null;
  }
}

/**
 * Buscar jogador por nome
 */
export async function buscarJogadorPorNome(nome: string): Promise<JogadorDB | null> {
  try {
    const { data, error } = await supabase
      .from('jogadores')
      .select('*')
      .eq('nome', nome)
      .single();

    if (error) {
      console.error('Erro ao buscar jogador por nome:', error);
      return null;
    }

    return data as JogadorDB;
  } catch (err) {
    console.error('Erro ao buscar jogador por nome:', err);
    return null;
  }
}

/**
 * Listar todos os jogadores
 */
export async function listarJogadores(): Promise<JogadorDB[]> {
  try {
    const { data, error } = await supabase
      .from('jogadores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar jogadores:', error);
      return [];
    }

    return (data as JogadorDB[]) || [];
  } catch (err) {
    console.error('Erro ao listar jogadores:', err);
    return [];
  }
}

/**
 * Atualizar números selecionados
 */
export async function atualizarNumerosSelecionados(
  id: string,
  numerosSelecionados: number[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('jogadores')
      .update({ numeros_selecionados: numerosSelecionados })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar números:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Erro ao atualizar números:', err);
    return false;
  }
}

/**
 * Atualizar cartela
 */
export async function atualizarCartela(
  id: string,
  cartela: number[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('jogadores')
      .update({ cartela, numeros_selecionados: [] })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar cartela:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Erro ao atualizar cartela:', err);
    return false;
  }
}

/**
 * Deletar jogador
 */
export async function deletarJogador(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('jogadores')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar jogador:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Erro ao deletar jogador:', err);
    return false;
  }
}
