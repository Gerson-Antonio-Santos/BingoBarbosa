import { supabase } from './supabase';

export interface SessaoPrincipal {
  id: string;
  sessao: number;
  data_criacao: string;
}

export async function criarOuBuscarSessao(codigo: number): Promise<SessaoPrincipal | null> {
  try {
    const existente = await buscarSessao(codigo);
    if (existente) return existente;

    const { data, error } = await supabase
      .from('sessao_principal')
      .insert([{ sessao: codigo }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar sessão:', error);
      return null;
    }

    return data as SessaoPrincipal;
  } catch (err) {
    console.error('Erro ao criar/buscar sessão:', err);
    return null;
  }
}

export async function buscarSessao(codigo: number): Promise<SessaoPrincipal | null> {
  try {
    const { data, error } = await supabase
      .from('sessao_principal')
      .select('*')
      .eq('sessao', codigo)
      .single();

    if (error) return null;
    return data as SessaoPrincipal;
  } catch {
    return null;
  }
}

export async function listarSessoes(): Promise<SessaoPrincipal[]> {
  try {
    const { data, error } = await supabase
      .from('sessao_principal')
      .select('*')
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('Erro ao listar sessões:', error);
      return [];
    }

    return (data as SessaoPrincipal[]) || [];
  } catch (err) {
    console.error('Erro ao listar sessões:', err);
    return [];
  }
}

export async function deletarSessaoComJogadores(sessaoCodigo: number): Promise<boolean> {
  try {
    await supabase.from('jogadores').delete().eq('sessao', sessaoCodigo);
    const { error } = await supabase
      .from('sessao_principal')
      .delete()
      .eq('sessao', sessaoCodigo);

    if (error) {
      console.error('Erro ao deletar sessão:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Erro ao deletar sessão:', err);
    return false;
  }
}
