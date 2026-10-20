import React, { useState } from 'react';
import { HorarioComRelacoes, DiaSemanaNumero, ModoVisaoGrade, HorarioSimulado } from '../types/database';
import { DIAS_SEMANA, PERIODOS_AULA, INTERVALO_CONFIG, getDiaSemanaAtual, getMinutosEDiaAtuais } from '../utils/timeHelpers';
import { CardAula } from './CardAula';
import { Clock, Coffee, CalendarDays } from 'lucide-react';

interface GradeHorariaProps {
  horarios: HorarioComRelacoes[];
  modoVisao?: ModoVisaoGrade;
  horarioSimulado?: HorarioSimulado | null;
  tituloGrade?: string;
  subtituloGrade?: string;
  onSelectAula?: (horario: HorarioComRelacoes) => void;
}

export const GradeHoraria: React.FC<GradeHorariaProps> = ({
  horarios,
  modoVisao = 'turma',
  horarioSimulado,
  tituloGrade,
  subtituloGrade,
  onSelectAula,
}) => {
  // Dia selecionado para a visualização mobile (abas)
  const [diaSelecionadoMobile, setDiaSelecionadoMobile] = useState<DiaSemanaNumero>(
    getDiaSemanaAtual(horarioSimulado)
  );

  // Mapeia os horários em uma matriz rápida [diaSemana][numeroAula]
  const mapaHorarios = React.useMemo(() => {
    const mapa = new Map<string, HorarioComRelacoes>();
    horarios.forEach((h) => {
      mapa.set(`${h.dia_semana}-${h.numero_aula}`, h);
    });
    return mapa;
  }, [horarios]);

  const { currentDay: diaAtualHoje } = getMinutosEDiaAtuais(horarioSimulado);

  return (
    <div className="grade-wrapper">
      {/* ------------------------------------------------------------- */}
      {/* CABEÇALHO EXCLUSIVO PARA IMPRESSÃO / PDF                        */}
      {/* ------------------------------------------------------------- */}
      <div className="print-header-only">
        <div className="print-title-area">
          <h2>Grade Horária Escolar — Ensino Médio 2026</h2>
          {tituloGrade && <h3 className="print-target-title">{tituloGrade}</h3>}
          {subtituloGrade && <p className="print-target-sub">{subtituloGrade}</p>}
        </div>
        <div className="print-date">
          Emitido em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SELETOR DE ABAS MOBILE (Exibido apenas em telas menores)        */}
      {/* ------------------------------------------------------------- */}
      <div className="mobile-tabs-container">
        <div className="mobile-tabs-header">
          <CalendarDays size={16} />
          <span>Selecione o dia da semana:</span>
        </div>
        <div className="mobile-tabs-list" role="tablist">
          {DIAS_SEMANA.map((dia) => {
            const isHoje = diaAtualHoje === dia.numero;
            const isSelected = diaSelecionadoMobile === dia.numero;
            return (
              <button
                key={dia.numero}
                role="tab"
                aria-selected={isSelected}
                className={`mobile-tab-btn ${isSelected ? 'active' : ''} ${isHoje ? 'is-today' : ''}`}
                onClick={() => setDiaSelecionadoMobile(dia.numero)}
              >
                <span className="tab-abrev">{dia.abrev}</span>
                <span className="tab-full">{dia.nome}</span>
                {isHoje && <span className="tab-today-dot" title="Hoje"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VISUALIZAÇÃO MOBILE (Timeline vertical do dia selecionado)      */}
      {/* ------------------------------------------------------------- */}
      <div className="mobile-timeline-view">
        <div className="mobile-day-title">
          <h3>
            {DIAS_SEMANA.find((d) => d.numero === diaSelecionadoMobile)?.nome}
          </h3>
          {diaAtualHoje === diaSelecionadoMobile && (
            <span className="hoje-badge">Hoje</span>
          )}
        </div>

        <div className="timeline-items">
          {PERIODOS_AULA.map((periodo) => {
            const horario = mapaHorarios.get(`${diaSelecionadoMobile}-${periodo.numero}`);

            return (
              <React.Fragment key={`mobile-aula-${periodo.numero}`}>
                <div className="timeline-row">
                  <div className="periodo-time-col">
                    <span className="periodo-label">{periodo.label}</span>
                    <span className="periodo-range">
                      {periodo.inicio} - {periodo.fim}
                    </span>
                  </div>

                  <div className="periodo-card-col">
                    <CardAula
                      horario={horario}
                      diaSemana={diaSelecionadoMobile}
                      numeroAula={periodo.numero}
                      modoVisao={modoVisao}
                      horarioSimulado={horarioSimulado}
                      onClick={onSelectAula}
                    />
                  </div>
                </div>

                {/* Divisor do Intervalo / Recreio após a 3ª aula */}
                {periodo.intervaloApos && (
                  <div className="intervalo-divider mobile-intervalo">
                    <div className="intervalo-badge">
                      <Coffee size={14} />
                      <span>{INTERVALO_CONFIG.label}</span>
                      <span className="intervalo-time">
                        ({INTERVALO_CONFIG.inicio} - {INTERVALO_CONFIG.fim})
                      </span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VISUALIZAÇÃO DESKTOP (Tabela / Grid Semanal Completo)          */}
      {/* ------------------------------------------------------------- */}
      <div className="desktop-grid-view">
        <div className="table-responsive-wrapper">
          <table className="grade-table">
            <thead>
              <tr>
                <th className="th-horario">
                  <div className="th-horario-content">
                    <Clock size={16} />
                    <span>Horário</span>
                  </div>
                </th>
                {DIAS_SEMANA.map((dia) => {
                  const isHoje = diaAtualHoje === dia.numero;
                  return (
                    <th
                      key={dia.numero}
                      className={`th-dia ${isHoje ? 'th-dia-hoje' : ''}`}
                    >
                      <div className="th-dia-title">
                        <span>{dia.nome}</span>
                        {isHoje && <span className="hoje-pill">Hoje</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PERIODOS_AULA.map((periodo) => (
                <React.Fragment key={`desktop-row-${periodo.numero}`}>
                  <tr>
                    {/* Coluna de Horário da Aula */}
                    <td className="td-periodo">
                      <div className="periodo-info">
                        <span className="periodo-num">{periodo.label}</span>
                        <span className="periodo-hours">
                          {periodo.inicio} — {periodo.fim}
                        </span>
                      </div>
                    </td>

                    {/* Colunas dos 5 Dias da Semana */}
                    {DIAS_SEMANA.map((dia) => {
                      const horario = mapaHorarios.get(`${dia.numero}-${periodo.numero}`);

                      return (
                        <td
                          key={`cell-${dia.numero}-${periodo.numero}`}
                          className={`td-aula-cell ${
                            diaAtualHoje === dia.numero ? 'col-hoje' : ''
                          }`}
                        >
                          <CardAula
                            horario={horario}
                            diaSemana={dia.numero}
                            numeroAula={periodo.numero}
                            modoVisao={modoVisao}
                            horarioSimulado={horarioSimulado}
                            onClick={onSelectAula}
                          />
                        </td>
                      );
                    })}
                  </tr>

                  {/* Linha especial de Intervalo após a 3ª aula */}
                  {periodo.intervaloApos && (
                    <tr className="tr-intervalo">
                      <td colSpan={6}>
                        <div className="intervalo-bar">
                          <Coffee size={15} className="intervalo-icon" />
                          <span className="intervalo-title">
                            {INTERVALO_CONFIG.label}
                          </span>
                          <span className="intervalo-hours">
                            {INTERVALO_CONFIG.inicio} às {INTERVALO_CONFIG.fim}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
