import { Turma, Professor, HorarioComRelacoes } from '../types/database';

export const MOCK_TURMAS: Turma[] = [
  { id: '11111111-1111-1111-1111-111111111111', nome: '1º Ano A', ano_letivo: 1, sala_numero: 'Sala 101 (Bloco A)' },
  { id: '22222222-2222-2222-2222-222222222222', nome: '2º Ano B', ano_letivo: 2, sala_numero: 'Sala 104 (Bloco A)' },
  { id: '33333333-3333-3333-3333-333333333333', nome: '3º Ano C', ano_letivo: 3, sala_numero: 'Sala 201 (Bloco B)' },
];

export const MOCK_PROFESSORES: Professor[] = [
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', nome: 'Prof. Carlos Eduardo', materia: 'Matemática', email: 'carlos.eduardo@escola.edu.br', cor_etiqueta: '#2563EB' },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', nome: 'Profa. Mariana Costa', materia: 'Física', email: 'mariana.costa@escola.edu.br', cor_etiqueta: '#7C3AED' },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', nome: 'Prof. Roberto Souza', materia: 'Química', email: 'roberto.souza@escola.edu.br', cor_etiqueta: '#059669' },
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', nome: 'Profa. Fernanda Lima', materia: 'Biologia', email: 'fernanda.lima@escola.edu.br', cor_etiqueta: '#10B981' },
  { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', nome: 'Prof. André Martins', materia: 'História', email: 'andre.martins@escola.edu.br', cor_etiqueta: '#D97706' },
  { id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', nome: 'Profa. Juliana Santos', materia: 'Geografia', email: 'juliana.santos@escola.edu.br', cor_etiqueta: '#EA580C' },
  { id: '10101010-1010-1010-1010-101010101010', nome: 'Profa. Beatriz Mendes', materia: 'Português', email: 'beatriz.mendes@escola.edu.br', cor_etiqueta: '#DC2626' },
  { id: '20202020-2020-2020-2020-202020202020', nome: 'Prof. Lucas Rocha', materia: 'Inglês', email: 'lucas.rocha@escola.edu.br', cor_etiqueta: '#0891B2' },
];

const profMap = new Map(MOCK_PROFESSORES.map(p => [p.id, p]));
const turmaMap = new Map(MOCK_TURMAS.map(t => [t.id, t]));

const T1_ID = '11111111-1111-1111-1111-111111111111';
const T2_ID = '22222222-2222-2222-2222-222222222222';
const T3_ID = '33333333-3333-3333-3333-333333333333';

const P_MAT = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const P_FIS = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const P_QUI = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const P_BIO = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const P_HIS = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const P_GEO = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const P_POR = '10101010-1010-1010-1010-101010101010';
const P_ING = '20202020-2020-2020-2020-202020202020';

interface HorarioRaw {
  id: string;
  turma_id: string;
  professor_id: string;
  dia_semana: 1 | 2 | 3 | 4 | 5;
  numero_aula: number;
}

const RAW_HORARIOS: HorarioRaw[] = [
  // ==========================================
  // TURMA 1: 1º ANO A
  // ==========================================
  // Segunda-feira (Dia 1)
  { id: 'h-1a-1-1', turma_id: T1_ID, professor_id: P_MAT, dia_semana: 1, numero_aula: 1 },
  { id: 'h-1a-1-2', turma_id: T1_ID, professor_id: P_MAT, dia_semana: 1, numero_aula: 2 },
  { id: 'h-1a-1-3', turma_id: T1_ID, professor_id: P_POR, dia_semana: 1, numero_aula: 3 },
  { id: 'h-1a-1-4', turma_id: T1_ID, professor_id: P_POR, dia_semana: 1, numero_aula: 4 },
  { id: 'h-1a-1-5', turma_id: T1_ID, professor_id: P_FIS, dia_semana: 1, numero_aula: 5 },
  { id: 'h-1a-1-6', turma_id: T1_ID, professor_id: P_FIS, dia_semana: 1, numero_aula: 6 },

  // Terça-feira (Dia 2)
  { id: 'h-1a-2-1', turma_id: T1_ID, professor_id: P_QUI, dia_semana: 2, numero_aula: 1 },
  { id: 'h-1a-2-2', turma_id: T1_ID, professor_id: P_QUI, dia_semana: 2, numero_aula: 2 },
  { id: 'h-1a-2-3', turma_id: T1_ID, professor_id: P_BIO, dia_semana: 2, numero_aula: 3 },
  { id: 'h-1a-2-4', turma_id: T1_ID, professor_id: P_BIO, dia_semana: 2, numero_aula: 4 },
  { id: 'h-1a-2-5', turma_id: T1_ID, professor_id: P_HIS, dia_semana: 2, numero_aula: 5 },
  { id: 'h-1a-2-6', turma_id: T1_ID, professor_id: P_HIS, dia_semana: 2, numero_aula: 6 },

  // Quarta-feira (Dia 3)
  { id: 'h-1a-3-1', turma_id: T1_ID, professor_id: P_GEO, dia_semana: 3, numero_aula: 1 },
  { id: 'h-1a-3-2', turma_id: T1_ID, professor_id: P_GEO, dia_semana: 3, numero_aula: 2 },
  { id: 'h-1a-3-3', turma_id: T1_ID, professor_id: P_ING, dia_semana: 3, numero_aula: 3 },
  { id: 'h-1a-3-4', turma_id: T1_ID, professor_id: P_ING, dia_semana: 3, numero_aula: 4 },
  { id: 'h-1a-3-5', turma_id: T1_ID, professor_id: P_MAT, dia_semana: 3, numero_aula: 5 },
  { id: 'h-1a-3-6', turma_id: T1_ID, professor_id: P_MAT, dia_semana: 3, numero_aula: 6 },

  // Quinta-feira (Dia 4 - Aula 6 vago/janela)
  { id: 'h-1a-4-1', turma_id: T1_ID, professor_id: P_POR, dia_semana: 4, numero_aula: 1 },
  { id: 'h-1a-4-2', turma_id: T1_ID, professor_id: P_POR, dia_semana: 4, numero_aula: 2 },
  { id: 'h-1a-4-3', turma_id: T1_ID, professor_id: P_FIS, dia_semana: 4, numero_aula: 3 },
  { id: 'h-1a-4-4', turma_id: T1_ID, professor_id: P_FIS, dia_semana: 4, numero_aula: 4 },
  { id: 'h-1a-4-5', turma_id: T1_ID, professor_id: P_QUI, dia_semana: 4, numero_aula: 5 },

  // Sexta-feira (Dia 5)
  { id: 'h-1a-5-1', turma_id: T1_ID, professor_id: P_BIO, dia_semana: 5, numero_aula: 1 },
  { id: 'h-1a-5-2', turma_id: T1_ID, professor_id: P_BIO, dia_semana: 5, numero_aula: 2 },
  { id: 'h-1a-5-3', turma_id: T1_ID, professor_id: P_HIS, dia_semana: 5, numero_aula: 3 },
  { id: 'h-1a-5-4', turma_id: T1_ID, professor_id: P_GEO, dia_semana: 5, numero_aula: 4 },
  { id: 'h-1a-5-5', turma_id: T1_ID, professor_id: P_ING, dia_semana: 5, numero_aula: 5 },
  { id: 'h-1a-5-6', turma_id: T1_ID, professor_id: P_MAT, dia_semana: 5, numero_aula: 6 },

  // ==========================================
  // TURMA 2: 2º ANO B
  // ==========================================
  // Segunda-feira (Dia 1)
  { id: 'h-2b-1-1', turma_id: T2_ID, professor_id: P_FIS, dia_semana: 1, numero_aula: 1 },
  { id: 'h-2b-1-2', turma_id: T2_ID, professor_id: P_FIS, dia_semana: 1, numero_aula: 2 },
  { id: 'h-2b-1-3', turma_id: T2_ID, professor_id: P_MAT, dia_semana: 1, numero_aula: 3 },
  { id: 'h-2b-1-4', turma_id: T2_ID, professor_id: P_MAT, dia_semana: 1, numero_aula: 4 },
  { id: 'h-2b-1-5', turma_id: T2_ID, professor_id: P_POR, dia_semana: 1, numero_aula: 5 },
  { id: 'h-2b-1-6', turma_id: T2_ID, professor_id: P_POR, dia_semana: 1, numero_aula: 6 },

  // Terça-feira (Dia 2)
  { id: 'h-2b-2-1', turma_id: T2_ID, professor_id: P_HIS, dia_semana: 2, numero_aula: 1 },
  { id: 'h-2b-2-2', turma_id: T2_ID, professor_id: P_HIS, dia_semana: 2, numero_aula: 2 },
  { id: 'h-2b-2-3', turma_id: T2_ID, professor_id: P_QUI, dia_semana: 2, numero_aula: 3 },
  { id: 'h-2b-2-4', turma_id: T2_ID, professor_id: P_QUI, dia_semana: 2, numero_aula: 4 },
  { id: 'h-2b-2-5', turma_id: T2_ID, professor_id: P_BIO, dia_semana: 2, numero_aula: 5 },
  { id: 'h-2b-2-6', turma_id: T2_ID, professor_id: P_BIO, dia_semana: 2, numero_aula: 6 },

  // Quarta-feira (Dia 3)
  { id: 'h-2b-3-1', turma_id: T2_ID, professor_id: P_ING, dia_semana: 3, numero_aula: 1 },
  { id: 'h-2b-3-2', turma_id: T2_ID, professor_id: P_ING, dia_semana: 3, numero_aula: 2 },
  { id: 'h-2b-3-3', turma_id: T2_ID, professor_id: P_GEO, dia_semana: 3, numero_aula: 3 },
  { id: 'h-2b-3-4', turma_id: T2_ID, professor_id: P_GEO, dia_semana: 3, numero_aula: 4 },
  { id: 'h-2b-3-5', turma_id: T2_ID, professor_id: P_FIS, dia_semana: 3, numero_aula: 5 },
  { id: 'h-2b-3-6', turma_id: T2_ID, professor_id: P_FIS, dia_semana: 3, numero_aula: 6 },

  // Quinta-feira (Dia 4)
  { id: 'h-2b-4-1', turma_id: T2_ID, professor_id: P_MAT, dia_semana: 4, numero_aula: 1 },
  { id: 'h-2b-4-2', turma_id: T2_ID, professor_id: P_MAT, dia_semana: 4, numero_aula: 2 },
  { id: 'h-2b-4-3', turma_id: T2_ID, professor_id: P_ING, dia_semana: 4, numero_aula: 3 },
  { id: 'h-2b-4-4', turma_id: T2_ID, professor_id: P_ING, dia_semana: 4, numero_aula: 4 },
  { id: 'h-2b-4-5', turma_id: T2_ID, professor_id: P_POR, dia_semana: 4, numero_aula: 5 },
  { id: 'h-2b-4-6', turma_id: T2_ID, professor_id: P_POR, dia_semana: 4, numero_aula: 6 },

  // Sexta-feira (Dia 5 - Aula 6 vago/janela)
  { id: 'h-2b-5-1', turma_id: T2_ID, professor_id: P_QUI, dia_semana: 5, numero_aula: 1 },
  { id: 'h-2b-5-2', turma_id: T2_ID, professor_id: P_QUI, dia_semana: 5, numero_aula: 2 },
  { id: 'h-2b-5-3', turma_id: T2_ID, professor_id: P_FIS, dia_semana: 5, numero_aula: 3 },
  { id: 'h-2b-5-4', turma_id: T2_ID, professor_id: P_FIS, dia_semana: 5, numero_aula: 4 },
  { id: 'h-2b-5-5', turma_id: T2_ID, professor_id: P_GEO, dia_semana: 5, numero_aula: 5 },

  // ==========================================
  // TURMA 3: 3º ANO C
  // ==========================================
  // Segunda-feira (Dia 1)
  { id: 'h-3c-1-1', turma_id: T3_ID, professor_id: P_BIO, dia_semana: 1, numero_aula: 1 },
  { id: 'h-3c-1-2', turma_id: T3_ID, professor_id: P_BIO, dia_semana: 1, numero_aula: 2 },
  { id: 'h-3c-1-3', turma_id: T3_ID, professor_id: P_GEO, dia_semana: 1, numero_aula: 3 },
  { id: 'h-3c-1-4', turma_id: T3_ID, professor_id: P_GEO, dia_semana: 1, numero_aula: 4 },
  { id: 'h-3c-1-5', turma_id: T3_ID, professor_id: P_ING, dia_semana: 1, numero_aula: 5 },
  { id: 'h-3c-1-6', turma_id: T3_ID, professor_id: P_ING, dia_semana: 1, numero_aula: 6 },

  // Terça-feira (Dia 2)
  { id: 'h-3c-2-1', turma_id: T3_ID, professor_id: P_MAT, dia_semana: 2, numero_aula: 1 },
  { id: 'h-3c-2-2', turma_id: T3_ID, professor_id: P_MAT, dia_semana: 2, numero_aula: 2 },
  { id: 'h-3c-2-3', turma_id: T3_ID, professor_id: P_POR, dia_semana: 2, numero_aula: 3 },
  { id: 'h-3c-2-4', turma_id: T3_ID, professor_id: P_POR, dia_semana: 2, numero_aula: 4 },
  { id: 'h-3c-2-5', turma_id: T3_ID, professor_id: P_FIS, dia_semana: 2, numero_aula: 5 },
  { id: 'h-3c-2-6', turma_id: T3_ID, professor_id: P_FIS, dia_semana: 2, numero_aula: 6 },

  // Quarta-feira (Dia 3)
  { id: 'h-3c-3-1', turma_id: T3_ID, professor_id: P_QUI, dia_semana: 3, numero_aula: 1 },
  { id: 'h-3c-3-2', turma_id: T3_ID, professor_id: P_QUI, dia_semana: 3, numero_aula: 2 },
  { id: 'h-3c-3-3', turma_id: T3_ID, professor_id: P_HIS, dia_semana: 3, numero_aula: 3 },
  { id: 'h-3c-3-4', turma_id: T3_ID, professor_id: P_HIS, dia_semana: 3, numero_aula: 4 },
  { id: 'h-3c-3-5', turma_id: T3_ID, professor_id: P_BIO, dia_semana: 3, numero_aula: 5 },
  { id: 'h-3c-3-6', turma_id: T3_ID, professor_id: P_BIO, dia_semana: 3, numero_aula: 6 },

  // Quinta-feira (Dia 4)
  { id: 'h-3c-4-1', turma_id: T3_ID, professor_id: P_GEO, dia_semana: 4, numero_aula: 1 },
  { id: 'h-3c-4-2', turma_id: T3_ID, professor_id: P_GEO, dia_semana: 4, numero_aula: 2 },
  { id: 'h-3c-4-3', turma_id: T3_ID, professor_id: P_QUI, dia_semana: 4, numero_aula: 3 },
  { id: 'h-3c-4-4', turma_id: T3_ID, professor_id: P_QUI, dia_semana: 4, numero_aula: 4 },
  { id: 'h-3c-4-5', turma_id: T3_ID, professor_id: P_MAT, dia_semana: 4, numero_aula: 5 },
  { id: 'h-3c-4-6', turma_id: T3_ID, professor_id: P_MAT, dia_semana: 4, numero_aula: 6 },

  // Sexta-feira (Dia 5 - Aula 5 vago/janela)
  { id: 'h-3c-5-1', turma_id: T3_ID, professor_id: P_HIS, dia_semana: 5, numero_aula: 1 },
  { id: 'h-3c-5-2', turma_id: T3_ID, professor_id: P_HIS, dia_semana: 5, numero_aula: 2 },
  { id: 'h-3c-5-3', turma_id: T3_ID, professor_id: P_POR, dia_semana: 5, numero_aula: 3 },
  { id: 'h-3c-5-4', turma_id: T3_ID, professor_id: P_POR, dia_semana: 5, numero_aula: 4 },
  { id: 'h-3c-5-6', turma_id: T3_ID, professor_id: P_ING, dia_semana: 5, numero_aula: 6 },
];

export const MOCK_HORARIOS_COMPLETOS: HorarioComRelacoes[] = RAW_HORARIOS.map(raw => ({
  ...raw,
  turmas: turmaMap.get(raw.turma_id)!,
  professores: profMap.get(raw.professor_id)!,
}));
