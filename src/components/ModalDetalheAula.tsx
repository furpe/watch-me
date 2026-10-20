import React, { useState } from 'react';
import { HorarioComRelacoes } from '../types/database';
import { DIAS_SEMANA, PERIODOS_AULA } from '../utils/timeHelpers';
import { X, MapPin, User, Mail, BookOpen, Clock, Calendar, Check, Copy } from 'lucide-react';

interface ModalDetalheAulaProps {
  horario: HorarioComRelacoes | null;
  onClose: () => void;
}

export const ModalDetalheAula: React.FC<ModalDetalheAulaProps> = ({
  horario,
  onClose,
}) => {
  const [copiado, setCopiado] = useState(false);

  if (!horario) return null;

  const diaInfo = DIAS_SEMANA.find((d) => d.numero === horario.dia_semana);
  const periodoInfo = PERIODOS_AULA.find((p) => p.numero === horario.numero_aula);
  const corBadge = horario.professores?.cor_etiqueta || '#4F46E5';

  const handleCopiarLocalizacao = () => {
    const texto = `Aula de ${horario.professores.materia} (${horario.turmas.nome}) com ${horario.professores.nome} na ${horario.turmas.sala_numero}.`;
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span
              className="materia-badge modal-badge"
              style={{
                backgroundColor: `${corBadge}20`,
                color: corBadge,
                borderColor: `${corBadge}40`,
              }}
            >
              <BookOpen size={14} />
              {horario.professores.materia}
            </span>
            <h2 className="modal-title">{horario.professores.materia}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Cartão de Destaque da Sala */}
          <div className="modal-highlight-card">
            <div className="highlight-icon">
              <MapPin size={24} />
            </div>
            <div className="highlight-details">
              <span className="highlight-label">Localização da Sala</span>
              <span className="highlight-value">{horario.turmas.sala_numero}</span>
              <span className="highlight-sub">Turma: {horario.turmas.nome}</span>
            </div>
            <button
              className="btn-copiar"
              onClick={handleCopiarLocalizacao}
              title="Copiar informações da sala"
            >
              {copiado ? (
                <>
                  <Check size={14} className="text-success" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copiar Sala</span>
                </>
              )}
            </button>
          </div>

          <div className="modal-grid-info">
            {/* Professor */}
            <div className="info-block">
              <div className="info-label">
                <User size={15} />
                <span>Docente Responsável</span>
              </div>
              <div className="info-value">{horario.professores.nome}</div>
              <div className="info-extra">
                <Mail size={13} />
                <a href={`mailto:${horario.professores.email}`}>{horario.professores.email}</a>
              </div>
            </div>

            {/* Horário e Período */}
            <div className="info-block">
              <div className="info-label">
                <Clock size={15} />
                <span>Horário da Aula</span>
              </div>
              <div className="info-value">
                {periodoInfo?.label} ({periodoInfo?.inicio} às {periodoInfo?.fim})
              </div>
              <div className="info-extra">
                <Calendar size={13} />
                <span>{diaInfo?.nome}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-close" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
