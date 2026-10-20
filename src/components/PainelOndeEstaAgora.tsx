import React, { useState } from 'react';
import { Turma, Professor, HorarioComRelacoes, HorarioSimulado } from '../types/database';
import { getStatusMomentoAtual, getAulaAtualParaTurma, getAulaAtualParaProfessor } from '../utils/timeHelpers';
import { X, MapPin, Users, GraduationCap, Compass, Search } from 'lucide-react';

interface PainelOndeEstaAgoraProps {
  turmas: Turma[];
  professores: Professor[];
  todosHorarios: HorarioComRelacoes[];
  horarioSimulado?: HorarioSimulado | null;
  onClose: () => void;
  onSelecionarTurma: (turmaId: string) => void;
  onSelecionarProfessor: (professorId: string) => void;
}

export const PainelOndeEstaAgora: React.FC<PainelOndeEstaAgoraProps> = ({
  turmas,
  professores,
  todosHorarios,
  horarioSimulado,
  onClose,
  onSelecionarTurma,
  onSelecionarProfessor,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'turmas' | 'professores'>('turmas');
  const [busca, setBusca] = useState('');

  const statusMomento = getStatusMomentoAtual(horarioSimulado);

  const turmasFiltradas = turmas.filter((t) =>
    t.nome.toLowerCase().includes(busca.toLowerCase()) ||
    t.sala_numero.toLowerCase().includes(busca.toLowerCase())
  );

  const professoresFiltrados = professores.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.materia.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-locator-badge">
              <Compass size={16} />
              <span>Localizador em Tempo Real</span>
            </div>
            <h2 className="modal-title">Onde Está Agora?</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar localizador">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status do Momento Atual */}
          <div className={`locator-status-bar ${statusMomento.emAula ? 'is-live' : statusMomento.noIntervalo ? 'is-break' : 'is-idle'}`}>
            <span className="pulse-dot"></span>
            <div className="status-bar-info">
              <span className="status-bar-title">{statusMomento.label}</span>
              {statusMomento.isSimulacao && (
                <span className="simulacao-badge">Modo Simulação Ativo</span>
              )}
            </div>
          </div>

          {/* Abas e Campo de Busca */}
          <div className="locator-nav-bar">
            <div className="locator-tabs" role="tablist">
              <button
                type="button"
                className={`locator-tab-btn ${abaAtiva === 'turmas' ? 'active' : ''}`}
                onClick={() => setAbaAtiva('turmas')}
              >
                <Users size={15} />
                <span>Localização das Turmas ({turmas.length})</span>
              </button>
              <button
                type="button"
                className={`locator-tab-btn ${abaAtiva === 'professores' ? 'active' : ''}`}
                onClick={() => setAbaAtiva('professores')}
              >
                <GraduationCap size={15} />
                <span>Onde Estão os Professores ({professores.length})</span>
              </button>
            </div>

            <div className="locator-search-wrapper">
              <Search size={14} className="locator-search-icon" />
              <input
                type="text"
                placeholder={abaAtiva === 'turmas' ? 'Filtrar por turma ou sala...' : 'Filtrar por professor ou matéria...'}
                className="locator-search-input"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          {/* Conteúdo: Lista de Turmas */}
          {abaAtiva === 'turmas' && (
            <div className="locator-grid">
              {turmasFiltradas.map((turma) => {
                const infoAula = getAulaAtualParaTurma(turma.id, todosHorarios, horarioSimulado);
                const aula = infoAula.horario;

                return (
                  <div
                    key={turma.id}
                    className={`locator-card ${aula ? 'has-active-class' : ''}`}
                    onClick={() => {
                      onSelecionarTurma(turma.id);
                      onClose();
                    }}
                    title="Clique para abrir a grade completa desta turma"
                  >
                    <div className="locator-card-head">
                      <div className="turma-pill">
                        <Users size={13} />
                        <span>{turma.nome}</span>
                      </div>
                      <span className="locator-room-tag">
                        <MapPin size={12} />
                        {turma.sala_numero}
                      </span>
                    </div>

                    <div className="locator-card-body">
                      {aula ? (
                        <>
                          <div className="locator-materia-row">
                            <span
                              className="materia-bullet"
                              style={{ backgroundColor: aula.professores.cor_etiqueta || '#4F46E5' }}
                            />
                            <span className="locator-materia-title">{aula.professores.materia}</span>
                          </div>
                          <span className="locator-prof-sub">
                            Docente: <strong>{aula.professores.nome}</strong>
                          </span>
                        </>
                      ) : (
                        <div className="locator-no-class">
                          <span>{infoAula.status}</span>
                        </div>
                      )}
                    </div>

                    <div className="locator-card-footer">
                      <span className="btn-view-schedule">Ver grade semanal →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Conteúdo: Lista de Professores */}
          {abaAtiva === 'professores' && (
            <div className="locator-grid">
              {professoresFiltrados.map((prof) => {
                const infoAula = getAulaAtualParaProfessor(prof.id, todosHorarios, horarioSimulado);
                const aula = infoAula.horario;

                return (
                  <div
                    key={prof.id}
                    className={`locator-card ${aula ? 'has-active-class' : ''}`}
                    onClick={() => {
                      onSelecionarProfessor(prof.id);
                      onClose();
                    }}
                    title="Clique para abrir a grade semanal deste professor"
                  >
                    <div className="locator-card-head">
                      <div className="prof-pill">
                        <span
                          className="materia-bullet"
                          style={{ backgroundColor: prof.cor_etiqueta || '#4F46E5' }}
                        />
                        <span className="prof-name">{prof.nome}</span>
                      </div>
                      <span className="prof-materia-badge" style={{ color: prof.cor_etiqueta || '#4F46E5' }}>
                        {prof.materia}
                      </span>
                    </div>

                    <div className="locator-card-body">
                      {aula ? (
                        <>
                          <div className="locator-class-location">
                            <span className="location-action">Lecionando agora em:</span>
                            <strong className="turma-target">{aula.turmas.nome}</strong>
                          </div>
                          <div className="locator-room-box">
                            <MapPin size={13} className="text-primary" />
                            <span>{aula.turmas.sala_numero}</span>
                          </div>
                        </>
                      ) : (
                        <div className="locator-no-class">
                          <span>{infoAula.status}</span>
                        </div>
                      )}
                    </div>

                    <div className="locator-card-footer">
                      <span className="btn-view-schedule">Ver grade do professor →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-modal-close" onClick={onClose}>
            Fechar Localizador
          </button>
        </div>
      </div>
    </div>
  );
};
