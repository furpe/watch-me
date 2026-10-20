import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Turma, Professor, HorarioComRelacoes, FiltrosGrade } from '../types/database';
import { MOCK_TURMAS, MOCK_PROFESSORES, MOCK_HORARIOS_COMPLETOS } from './mockData';

// Estado reativo simples de status do fallback
let usandoDadosLocais = !isSupabaseConfigured;

export function isUsandoFallbackLocal(): boolean {
  return usandoDadosLocais;
}

/**
 * Busca todas as turmas cadastradas
 */
export async function buscarTurmas(): Promise<Turma[]> {
  if (!isSupabaseConfigured) {
    usandoDadosLocais = true;
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_TURMAS;
  }

  try {
    const { data, error } = await supabase
      .from('turmas')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.warn('Erro ao buscar turmas no Supabase. Alternando para dados locais:', error.message);
      usandoDadosLocais = true;
      return MOCK_TURMAS;
    }

    usandoDadosLocais = false;
    return (data as Turma[]) || [];
  } catch (err: any) {
    console.warn('Falha de conexão com Supabase. Alternando para dados locais:', err.message);
    usandoDadosLocais = true;
    return MOCK_TURMAS;
  }
}

/**
 * Busca todos os professores cadastrados
 */
export async function buscarProfessores(): Promise<Professor[]> {
  if (!isSupabaseConfigured) {
    usandoDadosLocais = true;
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_PROFESSORES;
  }

  try {
    const { data, error } = await supabase
      .from('professores')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.warn('Erro ao buscar professores no Supabase. Alternando para dados locais:', error.message);
      usandoDadosLocais = true;
      return MOCK_PROFESSORES;
    }

    usandoDadosLocais = false;
    return (data as Professor[]) || [];
  } catch (err: any) {
    console.warn('Falha de conexão com Supabase. Alternando para dados locais:', err.message);
    usandoDadosLocais = true;
    return MOCK_PROFESSORES;
  }
}

/**
 * Busca a grade horária com consultas relacionais completas para evitar o problema N+1.
 * Suporta filtro por turma (Modo Turma) ou por professor (Modo Docente).
 */
export async function buscarHorarios(filtros: FiltrosGrade): Promise<HorarioComRelacoes[]> {
  // Se Supabase não estiver configurado ou estivermos usando dados locais:
  if (!isSupabaseConfigured || usandoDadosLocais) {
    await new Promise((res) => setTimeout(res, 150));
    return filtrarHorariosLocais(filtros);
  }

  try {
    let query = supabase
      .from('horarios')
      .select('*, turmas(*), professores(*)')
      .order('dia_semana', { ascending: true })
      .order('numero_aula', { ascending: true });

    if (filtros.modoVisao === 'turma') {
      if (filtros.turmaId) {
        query = query.eq('turma_id', filtros.turmaId);
      }
      if (filtros.professorId) {
        query = query.eq('professor_id', filtros.professorId);
      }
    } else if (filtros.modoVisao === 'professor') {
      if (filtros.professorId) {
        query = query.eq('professor_id', filtros.professorId);
      }
      if (filtros.turmaId) {
        query = query.eq('turma_id', filtros.turmaId);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Erro na consulta do Supabase. Alternando para dados locais:', error.message);
      usandoDadosLocais = true;
      return filtrarHorariosLocais(filtros);
    }

    let items = (data as unknown as HorarioComRelacoes[]) || [];

    // Filtro adicional em memória por texto (matéria, nome do professor ou sala)
    if (filtros.buscaTexto && filtros.buscaTexto.trim() !== '') {
      const termo = filtros.buscaTexto.trim().toLowerCase();
      items = items.filter((h) => {
        const mat = h.professores?.materia?.toLowerCase() || '';
        const prof = h.professores?.nome?.toLowerCase() || '';
        const sala = h.turmas?.sala_numero?.toLowerCase() || '';
        const turma = h.turmas?.nome?.toLowerCase() || '';
        return mat.includes(termo) || prof.includes(termo) || sala.includes(termo) || turma.includes(termo);
      });
    }

    return items;
  } catch (error: any) {
    console.warn('Erro de rede ao consultar horários no Supabase. Alternando para dados locais:', error);
    usandoDadosLocais = true;
    return filtrarHorariosLocais(filtros);
  }
}

/**
 * Busca todos os horários cadastrados no sistema (útil para o painel de visão geral "Onde está agora")
 */
export async function buscarTodosHorarios(): Promise<HorarioComRelacoes[]> {
  if (!isSupabaseConfigured || usandoDadosLocais) {
    return MOCK_HORARIOS_COMPLETOS;
  }

  try {
    const { data, error } = await supabase
      .from('horarios')
      .select('*, turmas(*), professores(*)')
      .order('dia_semana', { ascending: true })
      .order('numero_aula', { ascending: true });

    if (error) {
      usandoDadosLocais = true;
      return MOCK_HORARIOS_COMPLETOS;
    }

    return (data as unknown as HorarioComRelacoes[]) || [];
  } catch {
    usandoDadosLocais = true;
    return MOCK_HORARIOS_COMPLETOS;
  }
}

/**
 * Filtra a coleção local de mock data
 */
function filtrarHorariosLocais(filtros: FiltrosGrade): HorarioComRelacoes[] {
  let resultado = [...MOCK_HORARIOS_COMPLETOS];

  if (filtros.modoVisao === 'turma') {
    if (filtros.turmaId) {
      resultado = resultado.filter((h) => h.turma_id === filtros.turmaId);
    }
    if (filtros.professorId) {
      resultado = resultado.filter((h) => h.professor_id === filtros.professorId);
    }
  } else if (filtros.modoVisao === 'professor') {
    if (filtros.professorId) {
      resultado = resultado.filter((h) => h.professor_id === filtros.professorId);
    }
    if (filtros.turmaId) {
      resultado = resultado.filter((h) => h.turma_id === filtros.turmaId);
    }
  }

  if (filtros.buscaTexto && filtros.buscaTexto.trim() !== '') {
    const termo = filtros.buscaTexto.trim().toLowerCase();
    resultado = resultado.filter((h) => {
      const mat = h.professores?.materia?.toLowerCase() || '';
      const prof = h.professores?.nome?.toLowerCase() || '';
      const sala = h.turmas?.sala_numero?.toLowerCase() || '';
      const turma = h.turmas?.nome?.toLowerCase() || '';
      return mat.includes(termo) || prof.includes(termo) || sala.includes(termo) || turma.includes(termo);
    });
  }

  return resultado;
}
