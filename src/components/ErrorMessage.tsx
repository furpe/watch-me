import React from 'react';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';

interface ErrorMessageProps {
  mensagem: string;
  onTentarNovamente: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  mensagem,
  onTentarNovamente,
}) => {
  return (
    <div className="error-card-container">
      <div className="error-icon-box">
        <AlertTriangle size={32} className="error-icon" />
      </div>
      <div className="error-content">
        <h3 className="error-title">Falha ao Conectar com o Supabase</h3>
        <p className="error-description">{mensagem}</p>
        <div className="error-help-box">
          <Database size={16} />
          <span>
            Verifique se as variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no arquivo <code>.env</code> estão corretas e se as políticas RLS foram aplicadas executando o script <code>supabase/schema.sql</code> no seu projeto.
          </span>
        </div>
        <button className="btn-retry" onClick={onTentarNovamente}>
          <RefreshCw size={16} />
          <span>Tentar Novamente</span>
        </button>
      </div>
    </div>
  );
};
