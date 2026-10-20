// ==============================================================================
// TIPOS TYPESCRIPT: MODELOS DE DADOS DO SISTEMA DE GRADE HORÁRIA
// ==============================================================================

export type DiaSemanaNumero = 1 | 2 | 3 | 4 | 5;

export type ModoVisaoGrade = 'turma' | 'professor';

export interface Turma {
  id: string;
  nome: string;          // Ex: "1º Ano A"
  ano_letivo: number;    // 1, 2 ou 3
  sala_numero: string;   // Ex: "Sala 101 (Bloco A)"
  created_at?: string;
}

export interface Professor {
  id: string;
  nome: string;          // Ex: "Prof. Carlos Eduardo"
  materia: string;       // Ex: "Matemática"
  email: string;
  cor_etiqueta?: string; // Cor HEX para badge na UI, ex: "#2563EB"
  created_at?: string;
}

export interface Horario {
  id: string;
  turma_id: string;
  professor_id: string;
  dia_semana: DiaSemanaNumero; // 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex
  numero_aula: number;         // 1 a 6
  created_at?: string;
}

/**
 * Estrutura combinada obtida através do join relacional no Supabase:
 * supabase.from('horarios').select('*, turmas(*), professores(*)')
 */
export interface HorarioComRelacoes extends Horario {
  turmas: Turma;
  professores: Professor;
}

/**
 * Informações dos períodos de aula pré-definidos do Ensino Médio
 */
export interface PeriodoAula {
  numero: number;
  label: string;
  inicio: string; // "07:00"
  fim: string;    // "07:50"
  intervaloApos?: boolean; // Se há recreio/intervalo após esta aula
}

/**
 * Filtros de busca aplicáveis à grade
 */
export interface FiltrosGrade {
  modoVisao: ModoVisaoGrade;
  turmaId?: string;
  professorId?: string;
  buscaTexto?: string;
}

/**
 * Estado do Simulador de Horário em Tempo Real
 */
export interface HorarioSimulado {
  ativo: boolean;
  diaSemana: DiaSemanaNumero;
  horaMinuto: string; // "HH:MM"
}
