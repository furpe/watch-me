import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Database, CheckCircle2, AlertCircle, Sliders } from 'lucide-react';
import { getStatusMomentoAtual, DIAS_SEMANA } from '../utils/timeHelpers';
import { isSupabaseConfigured } from '../lib/supabase';
import { HorarioSimulado } from '../types/database';

interface HeaderProps {
  horarioSimulado?: HorarioSimulado | null;
  usandoFallback?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  horarioSimulado,
  usandoFallback = false,
}) => {
  const [horaReal, setHoraReal] = useState<string>('');
  const [dataReal, setDataReal] = useState<string>('');
  const [statusMomento, setStatusMomento] = useState(getStatusMomentoAtual(horarioSimulado));

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHoraReal(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDataReal(
        now.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      );
      setStatusMomento(getStatusMomentoAtual(horarioSimulado));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [horarioSimulado]);

  const isSimAtiva = Boolean(horarioSimulado && horarioSimulado.ativo);
  const diaSimuladoInfo = isSimAtiva
    ? DIAS_SEMANA.find((d) => d.numero === horarioSimulado?.diaSemana)?.nome
    : null;

  const horaDisplay = isSimAtiva ? `${horarioSimulado?.horaMinuto}:00` : horaReal;
  const dataDisplay = isSimAtiva ? `${diaSimuladoInfo} (Simulado)` : dataReal;

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <Calendar className="brand-icon" />
          </div>
          <div>
            <div className="brand-badge">
              <Sparkles size={12} />
              <span>Ensino Médio 2026</span>
            </div>
            <h1 className="brand-title">Localizador de Salas & Grade Horária</h1>
            <p className="brand-subtitle">
              Consulte a programação semanal de turmas, docentes e localização de salas em tempo real.
            </p>
          </div>
        </div>

        <div className="header-status-panel">
          {/* Relógio e Data */}
          <div className={`clock-widget ${isSimAtiva ? 'clock-simulado' : ''}`}>
            <div className="clock-time">
              {isSimAtiva ? (
                <Sliders size={16} className="text-warning" />
              ) : (
                <Clock size={16} className="text-primary" />
              )}
              <span>{horaDisplay || '--:--:--'}</span>
            </div>
            <div className="clock-date">{dataDisplay}</div>
          </div>

          {/* Status do momento atual */}
          <div
            className={`status-pill ${
              statusMomento.emAula
                ? 'status-live'
                : statusMomento.noIntervalo
                ? 'status-break'
                : 'status-idle'
            }`}
          >
            <span className="pulse-dot"></span>
            <span>{statusMomento.label}</span>
          </div>

          {/* Indicador de Conexão Supabase / Modo Offline */}
          <div
            className="db-status-badge"
            title={
              isSupabaseConfigured && !usandoFallback
                ? 'Conectado diretamente ao Supabase PostgreSQL com RLS'
                : 'Modo Local / Fallback ativo com dados integrados e sem necessidade de conexão externa'
            }
          >
            <Database size={13} />
            {isSupabaseConfigured && !usandoFallback ? (
              <>
                <span>Supabase Conectado</span>
                <CheckCircle2 size={13} className="text-success" />
              </>
            ) : (
              <>
                <span>Modo Local (Ativo)</span>
                <AlertCircle size={13} className="text-warning" />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
