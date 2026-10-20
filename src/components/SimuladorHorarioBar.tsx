import React from 'react';
import { HorarioSimulado, DiaSemanaNumero } from '../types/database';
import { DIAS_SEMANA, PERIODOS_AULA, INTERVALO_CONFIG } from '../utils/timeHelpers';
import { Sliders, Play, RotateCcw, X, Clock, Calendar } from 'lucide-react';

interface SimuladorHorarioBarProps {
  simulacao: HorarioSimulado;
  onSimulacaoChange: (novaSimulacao: HorarioSimulado) => void;
  onFechar: () => void;
}

export const SimuladorHorarioBar: React.FC<SimuladorHorarioBarProps> = ({
  simulacao,
  onSimulacaoChange,
  onFechar,
}) => {
  const handleToggleAtivo = () => {
    onSimulacaoChange({
      ...simulacao,
      ativo: !simulacao.ativo,
    });
  };

  const handleDiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSimulacaoChange({
      ...simulacao,
      ativo: true,
      diaSemana: Number(e.target.value) as DiaSemanaNumero,
    });
  };

  const handleHoraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSimulacaoChange({
      ...simulacao,
      ativo: true,
      horaMinuto: e.target.value,
    });
  };

  const aplicarPreset = (dia: DiaSemanaNumero, hora: string) => {
    onSimulacaoChange({
      ativo: true,
      diaSemana: dia,
      horaMinuto: hora,
    });
  };

  return (
    <div className={`simulador-banner ${simulacao.ativo ? 'simulador-ativo' : ''}`}>
      <div className="simulador-content">
        <div className="simulador-title-col">
          <div className="simulador-icon-tag">
            <Sliders size={15} />
            <span>Simulador de Tempo Real</span>
          </div>
          <span className="simulador-desc">
            Altere o horário para testar o indicador &quot;Agora&quot; e a localização em qualquer dia/aula.
          </span>
        </div>

        <div className="simulador-controls">
          {/* Seletor de Dia da Semana */}
          <div className="simulador-field">
            <Calendar size={14} className="field-icon" />
            <select
              className="simulador-select"
              value={simulacao.diaSemana}
              onChange={handleDiaChange}
              title="Dia simulado"
            >
              {DIAS_SEMANA.map((dia) => (
                <option key={dia.numero} value={dia.numero}>
                  {dia.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Horário */}
          <div className="simulador-field">
            <Clock size={14} className="field-icon" />
            <input
              type="time"
              className="simulador-time-input"
              value={simulacao.horaMinuto}
              onChange={handleHoraChange}
              title="Hora simulada"
            />
          </div>

          {/* Botão de Ligar / Desligar */}
          <button
            type="button"
            className={`btn-simulador-toggle ${simulacao.ativo ? 'btn-active' : ''}`}
            onClick={handleToggleAtivo}
            title={simulacao.ativo ? 'Desativar simulação e voltar ao tempo real' : 'Ativar simulação'}
          >
            {simulacao.ativo ? (
              <>
                <RotateCcw size={14} />
                <span>Resetar Tempo Real</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>Ativar Simulação</span>
              </>
            )}
          </button>
        </div>

        {/* Presets Rápidos */}
        <div className="simulador-presets">
          <span className="presets-label">Atalhos:</span>
          <button
            type="button"
            className="preset-btn"
            onClick={() => aplicarPreset(1, '07:30')}
          >
            Seg 1ª Aula ({PERIODOS_AULA[0].inicio})
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => aplicarPreset(2, '09:10')}
          >
            Ter 3ª Aula ({PERIODOS_AULA[2].inicio})
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => aplicarPreset(3, '09:55')}
          >
            Qua Recreio ({INTERVALO_CONFIG.inicio})
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => aplicarPreset(5, '12:00')}
          >
            Sex 6ª Aula ({PERIODOS_AULA[5].inicio})
          </button>
        </div>

        {/* Botão de Fechar painel */}
        <button
          type="button"
          className="simulador-close-btn"
          onClick={onFechar}
          title="Fechar painel do simulador"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
