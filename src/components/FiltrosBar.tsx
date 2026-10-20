import React from 'react';
import { Turma, Professor, FiltrosGrade, ModoVisaoGrade } from '../types/database';
import { Users, GraduationCap, Search, X, MapPin, Printer, Compass, Sliders, Mail } from 'lucide-react';

interface FiltrosBarProps {
  turmas: Turma[];
  professores: Professor[];
  filtros: FiltrosGrade;
  turmaSelecionadaInfo?: Turma;
  professorSelecionadoInfo?: Professor;
  totalAulasEncontradas: number;
  isSimuladorAberto: boolean;
  isSimulacaoAtiva: boolean;
  onFiltrosChange: (novosFiltros: FiltrosGrade) => void;
  onResetFiltros: () => void;
  onAbrirOndeEstaAgora: () => void;
  onToggleSimulador: () => void;
  onImprimirGrade: () => void;
}

export const FiltrosBar: React.FC<FiltrosBarProps> = ({
  turmas,
  professores,
  filtros,
  turmaSelecionadaInfo,
  professorSelecionadoInfo,
  totalAulasEncontradas,
  isSimuladorAberto,
  isSimulacaoAtiva,
  onFiltrosChange,
  onResetFiltros,
  onAbrirOndeEstaAgora,
  onToggleSimulador,
  onImprimirGrade,
}) => {
  const handleModoVisaoChange = (novoModo: ModoVisaoGrade) => {
    onFiltrosChange({
      ...filtros,
      modoVisao: novoModo,
      // Se mudar para professor e não tiver selecionado, pega o primeiro
      professorId: novoModo === 'professor' && !filtros.professorId && professores.length > 0
        ? professores[0].id
        : filtros.professorId,
      // Se mudar para turma e não tiver selecionado, pega a primeira
      turmaId: novoModo === 'turma' && !filtros.turmaId && turmas.length > 0
        ? turmas[0].id
        : filtros.turmaId,
      buscaTexto: '',
    });
  };

  const handleTurmaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      turmaId: e.target.value,
    });
  };

  const handleProfessorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      professorId: e.target.value || undefined,
    });
  };

  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      buscaTexto: e.target.value,
    });
  };

  const temFiltroAtivo = filtros.modoVisao === 'turma'
    ? Boolean(filtros.professorId || filtros.buscaTexto)
    : Boolean(filtros.turmaId || filtros.buscaTexto);

  return (
    <div className="filtros-container">
      {/* 1. Barra de Ações Rápidas do Topo: Alternador de Modo e Utilitários */}
      <div className="filtros-header-row">
        <div className="view-mode-switch" role="tablist" aria-label="Modo de visualização da grade">
          <button
            type="button"
            role="tab"
            aria-selected={filtros.modoVisao === 'turma'}
            className={`view-mode-btn ${filtros.modoVisao === 'turma' ? 'active' : ''}`}
            onClick={() => handleModoVisaoChange('turma')}
          >
            <Users size={16} />
            <span>Grade por Turma</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filtros.modoVisao === 'professor'}
            className={`view-mode-btn ${filtros.modoVisao === 'professor' ? 'active' : ''}`}
            onClick={() => handleModoVisaoChange('professor')}
          >
            <GraduationCap size={16} />
            <span>Grade por Docente</span>
          </button>
        </div>

        <div className="filtros-utility-actions">
          {/* Botão Localizador Rápido */}
          <button
            type="button"
            className="btn-utility btn-locator"
            onClick={onAbrirOndeEstaAgora}
            title="Localizador instantâneo em tempo real de turmas e docentes"
          >
            <Compass size={15} />
            <span>Onde Está Agora?</span>
          </button>

          {/* Botão Simulador de Horário */}
          <button
            type="button"
            className={`btn-utility btn-simulator ${isSimuladorAberto || isSimulacaoAtiva ? 'btn-sim-active' : ''}`}
            onClick={onToggleSimulador}
            title="Abrir painel de simulação de horário escolar"
          >
            <Sliders size={15} />
            <span>Simulador {isSimulacaoAtiva ? '(Ativo)' : ''}</span>
          </button>

          {/* Botão de Impressão */}
          <button
            type="button"
            className="btn-utility btn-print"
            onClick={onImprimirGrade}
            title="Imprimir grade horária formatada ou salvar em PDF"
          >
            <Printer size={15} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* 2. Grade de Filtros */}
      <div className="filtros-grid">
        {/* Caso 1: Modo Turma Ativo */}
        {filtros.modoVisao === 'turma' ? (
          <>
            {/* Seleção de Turma (Principal) */}
            <div className="filtro-group primary-filter">
              <label htmlFor="select-turma" className="filtro-label">
                <Users size={16} className="text-primary" />
                <span>Turma do Ensino Médio</span>
                <span className="required-tag">*Obrigatório</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="select-turma"
                  className="custom-select"
                  value={filtros.turmaId}
                  onChange={handleTurmaChange}
                >
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome} — {turma.ano_letivo}º Ano ({turma.sala_numero})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtrar por Professor (Opcional) */}
            <div className="filtro-group">
              <label htmlFor="select-professor" className="filtro-label">
                <GraduationCap size={16} />
                <span>Destacar Professor / Matéria</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="select-professor"
                  className="custom-select"
                  value={filtros.professorId || ''}
                  onChange={handleProfessorChange}
                >
                  <option value="">Todos os Professores</option>
                  {professores.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nome} ({prof.materia})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          /* Caso 2: Modo Docente Ativo */
          <>
            {/* Seleção de Professor (Principal) */}
            <div className="filtro-group primary-filter">
              <label htmlFor="select-professor-primary" className="filtro-label">
                <GraduationCap size={16} className="text-primary" />
                <span>Docente Responsável</span>
                <span className="required-tag">*Obrigatório</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="select-professor-primary"
                  className="custom-select"
                  value={filtros.professorId || (professores[0]?.id ?? '')}
                  onChange={handleProfessorChange}
                >
                  {professores.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nome} — {prof.materia}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtrar por Turma (Opcional) */}
            <div className="filtro-group">
              <label htmlFor="select-turma-sub" className="filtro-label">
                <Users size={16} />
                <span>Filtrar por Turma Específica</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="select-turma-sub"
                  className="custom-select"
                  value={filtros.turmaId || ''}
                  onChange={handleTurmaChange}
                >
                  <option value="">Todas as Turmas do Docente</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome} ({turma.sala_numero})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* 3. Campo de Busca Rápida por Texto (Comum a ambos os modos) */}
        <div className="filtro-group search-filter">
          <label htmlFor="input-busca" className="filtro-label">
            <Search size={16} />
            <span>Busca Rápida</span>
          </label>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              id="input-busca"
              type="text"
              className="custom-input"
              placeholder={
                filtros.modoVisao === 'turma'
                  ? 'Buscar por disciplina, professor ou sala...'
                  : 'Buscar por turma, matéria ou sala...'
              }
              value={filtros.buscaTexto || ''}
              onChange={handleBuscaChange}
            />
            {filtros.buscaTexto && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => onFiltrosChange({ ...filtros, buscaTexto: '' })}
                title="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Barra de resumo e contador de resultados */}
      <div className="filtros-footer">
        <div className="turma-info-tag">
          {filtros.modoVisao === 'turma' && turmaSelecionadaInfo && (
            <>
              <span className="turma-name-highlight">{turmaSelecionadaInfo.nome}</span>
              <span className="turma-room-badge">
                <MapPin size={13} />
                Sala Padrão: {turmaSelecionadaInfo.sala_numero}
              </span>
            </>
          )}

          {filtros.modoVisao === 'professor' && professorSelecionadoInfo && (
            <>
              <span
                className="turma-name-highlight"
                style={{ color: professorSelecionadoInfo.cor_etiqueta || '#4F46E5' }}
              >
                {professorSelecionadoInfo.nome}
              </span>
              <span className="turma-room-badge">
                Matéria: <strong>{professorSelecionadoInfo.materia}</strong>
              </span>
              <span className="turma-room-badge">
                <Mail size={12} />
                {professorSelecionadoInfo.email}
              </span>
            </>
          )}
        </div>

        <div className="filtros-actions">
          <span className="results-count">
            {totalAulasEncontradas} {totalAulasEncontradas === 1 ? 'aula alocada' : 'aulas alocadas'}
          </span>

          {temFiltroAtivo && (
            <button
              type="button"
              className="btn-reset-filtros"
              onClick={onResetFiltros}
            >
              <X size={13} />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
