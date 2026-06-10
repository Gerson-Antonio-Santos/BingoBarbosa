import { supabase } from './supabase';

export interface JogadorDB {
  id: string;
  nome: string;
  cartela: number[];
  numeros_selecionados: number[];
  tem_poder: boolean;
  created_at: string;
  sessao?: number | null;
}

export async function criarJogador(
  nome: string,
  cartela: number[],
  sessao?: number
): Promise<JogadorDB | null> {
  try {
    const insertData: Record<string, unknown> = {
      nome,
      cartela,
      numeros_selecionados: [],
    };
    if (sessao !== undefined) insertData.sessao = sessao;

    const { data, error } = await supabase
      .from('jogadores')
      .insert([insertData])
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

export async function listarJogadores(sessao?: number): Promise<JogadorDB[]> {
  try {
    let query = supabase
      .from('jogadores')
      .select('*')
      .order('created_at', { ascending: false });

    if (sessao !== undefined) {
      query = query.eq('sessao', sessao);
    }

    const { data, error } = await query;

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

export async function definirPoderJogador(id: string, sessao?: number): Promise<boolean> {
  try {
    let clearQuery = supabase.from('jogadores').update({ tem_poder: false }).eq('tem_poder', true);
    if (sessao !== undefined) {
      clearQuery = clearQuery.eq('sessao', sessao);
    }
    await clearQuery;

    const { error } = await supabase.from('jogadores').update({ tem_poder: true }).eq('id', id);
    if (error) {
      console.error('Erro ao definir poder:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Erro ao definir poder:', err);
    return false;
  }
}

export async function limparPoderJogador(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('jogadores').update({ tem_poder: false }).eq('id', id);
    if (error) {
      console.error('Erro ao limpar poder:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Erro ao limpar poder:', err);
    return false;
  }
}

export async function embaralharCartela(id: string, cartela: number[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('jogadores')
      .update({ cartela })
      .eq('id', id);
    if (error) {
      console.error('Erro ao embaralhar cartela:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Erro ao embaralhar cartela:', err);
    return false;
  }
}
