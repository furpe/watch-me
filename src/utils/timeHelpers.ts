import { DiaSemanaNumero, PeriodoAula, HorarioSimulado, HorarioComRelacoes } from '../types/database';

export const DIAS_SEMANA: { numero: DiaSemanaNumero; nome: string; abrev: string }[] = [
  { numero: 1, nome: 'Segunda-feira', abrev: 'Seg' },
  { numero: 2, nome: 'Terça-feira', abrev: 'Ter' },
  { numero: 3, nome: 'Quarta-feira', abrev: 'Qua' },
  { numero: 4, nome: 'Quinta-feira', abrev: 'Qui' },
  { numero: 5, nome: 'Sexta-feira', abrev: 'Sex' },
];

export const PERIODOS_AULA: PeriodoAula[] = [
  { numero: 1, label: '1ª Aula', inicio: '07:15', fim: '08:05' },
  { numero: 2, label: '2ª Aula', inicio: '08:05', fim: '08:55' },
  { numero: 3, label: '3ª Aula', inicio: '08:55', fim: '09:45', intervaloApos: true },
  { numero: 4, label: '4ª Aula', inicio: '10:05', fim: '10:55' },
  { numero: 5, label: '5ª Aula', inicio: '10:55', fim: '11:45' },
  { numero: 6, label: '6ª Aula', inicio: '11:45', fim: '12:35' },
];

export const INTERVALO_CONFIG = {
  label: 'Intervalo / Recreio',
  inicio: '09:45',
  fim: '10:05',
};

/**
 * Converte "HH:MM" em minutos desde o início do dia
 */
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Retorna o dia da semana atual no formato escolar (1 a 5). Se for fim de semana, retorna 1 (Segunda) como padrão.
 */
export function getDiaSemanaAtual(simulado?: HorarioSimulado | null): DiaSemanaNumero {
  if (simulado && simulado.ativo) {
    return simulado.diaSemana;
  }

  const day = new Date().getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  if (day >= 1 && day <= 5) {
    return day as DiaSemanaNumero;
  }
  return 1; // Padrão Segunda-feira para visualização amigável
}

/**
 * Obtém os minutos atuais e dia da semana, considerando simulação se ativa
 */
export function getMinutosEDiaAtuais(simulado?: HorarioSimulado | null): { currentDay: number; currentMinutes: number } {
  if (simulado && simulado.ativo) {
    return {
      currentDay: simulado.diaSemana,
      currentMinutes: timeStringToMinutes(simulado.horaMinuto),
    };
  }

  const now = new Date();
  return {
    currentDay: now.getDay(),
    currentMinutes: now.getHours() * 60 + now.getMinutes(),
  };
}

/**
 * Verifica se uma determinada aula está ocorrendo exatamente agora
 */
export function isAulaAgora(
  diaSemana: number,
  numeroAula: number,
  simulado?: HorarioSimulado | null
): boolean {
  const { currentDay, currentMinutes } = getMinutosEDiaAtuais(simulado);

  if (currentDay !== diaSemana) return false;

  const periodo = PERIODOS_AULA.find((p) => p.numero === numeroAula);
  if (!periodo) return false;

  const inicioMin = timeStringToMinutes(periodo.inicio);
  const fimMin = timeStringToMinutes(periodo.fim);

  return currentMinutes >= inicioMin && currentMinutes < fimMin;
}

/**
 * Retorna informações sobre o status do momento escolar (Em aula, No intervalo ou Fora do expediente)
 */
export function getStatusMomentoAtual(simulado?: HorarioSimulado | null): {
  emAula: boolean;
  noIntervalo: boolean;
  numeroAula?: number;
  label: string;
  isSimulacao: boolean;
} {
  const isSim = Boolean(simulado && simulado.ativo);
  const { currentDay, currentMinutes } = getMinutosEDiaAtuais(simulado);

  if (currentDay < 1 || currentDay > 5) {
    return {
      emAula: false,
      noIntervalo: false,
      label: 'Fim de semana (Fora de horário letivo)',
      isSimulacao: isSim,
    };
  }

  const intInicio = timeStringToMinutes(INTERVALO_CONFIG.inicio);
  const intFim = timeStringToMinutes(INTERVALO_CONFIG.fim);

  if (currentMinutes >= intInicio && currentMinutes < intFim) {
    return {
      emAula: false,
      noIntervalo: true,
      label: `Recreio / Intervalo (${INTERVALO_CONFIG.inicio} - ${INTERVALO_CONFIG.fim})`,
      isSimulacao: isSim,
    };
  }

  for (const p of PERIODOS_AULA) {
    const start = timeStringToMinutes(p.inicio);
    const end = timeStringToMinutes(p.fim);
    if (currentMinutes >= start && currentMinutes < end) {
      return {
        emAula: true,
        noIntervalo: false,
        numeroAula: p.numero,
        label: `${p.label} em andamento (${p.inicio} - ${p.fim})`,
        isSimulacao: isSim,
      };
    }
  }

  if (currentMinutes < timeStringToMinutes(PERIODOS_AULA[0].inicio)) {
    return {
      emAula: false,
      noIntervalo: false,
      label: `Aulas ainda não iniciaram hoje (início às ${PERIODOS_AULA[0].inicio})`,
      isSimulacao: isSim,
    };
  }

  return {
    emAula: false,
    noIntervalo: false,
    label: 'Período letivo encerrado por hoje',
    isSimulacao: isSim,
  };
}

/**
 * Localiza a aula atual de uma turma em tempo real
 */
export function getAulaAtualParaTurma(
  turmaId: string,
  horarios: HorarioComRelacoes[],
  simulado?: HorarioSimulado | null
): { horario?: HorarioComRelacoes; status: string } {
  const statusMomento = getStatusMomentoAtual(simulado);
  const { currentDay } = getMinutosEDiaAtuais(simulado);

  if (!statusMomento.emAula || !statusMomento.numeroAula) {
    return { status: statusMomento.label };
  }

  const aula = horarios.find(
    (h) =>
      h.turma_id === turmaId &&
      h.dia_semana === currentDay &&
      h.numero_aula === statusMomento.numeroAula
  );

  return {
    horario: aula,
    status: aula ? `${statusMomento.label}` : 'Horário livre / Janela',
  };
}

/**
 * Localiza a aula atual de um professor em tempo real
 */
export function getAulaAtualParaProfessor(
  professorId: string,
  horarios: HorarioComRelacoes[],
  simulado?: HorarioSimulado | null
): { horario?: HorarioComRelacoes; status: string } {
  const statusMomento = getStatusMomentoAtual(simulado);
  const { currentDay } = getMinutosEDiaAtuais(simulado);

  if (!statusMomento.emAula || !statusMomento.numeroAula) {
    return { status: statusMomento.label };
  }

  const aula = horarios.find(
    (h) =>
      h.professor_id === professorId &&
      h.dia_semana === currentDay &&
      h.numero_aula === statusMomento.numeroAula
  );

  return {
    horario: aula,
    status: aula
      ? `Em aula na ${aula.turmas.nome} (${aula.turmas.sala_numero})`
      : 'Sem aula no momento (Horário livre / Janela)',
  };
}
