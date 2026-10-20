import React from 'react';

export const GradeSkeleton: React.FC = () => {
  return (
    <div className="skeleton-container" aria-label="Carregando grade horária">
      <div className="skeleton-header-bar">
        <div className="skeleton-box skeleton-title-bar"></div>
        <div className="skeleton-box skeleton-sub-bar"></div>
      </div>

      <div className="skeleton-grid">
        {/* Cabeçalho da tabela */}
        <div className="skeleton-row header-row">
          <div className="skeleton-cell time-cell"></div>
          {[1, 2, 3, 4, 5].map((col) => (
            <div key={`sk-h-${col}`} className="skeleton-cell day-cell"></div>
          ))}
        </div>

        {/* Linhas de aula simuladas */}
        {[1, 2, 3, 4, 5, 6].map((row) => (
          <div key={`sk-r-${row}`} className="skeleton-row">
            <div className="skeleton-cell time-cell"></div>
            {[1, 2, 3, 4, 5].map((col) => (
              <div key={`sk-c-${row}-${col}`} className="skeleton-cell card-cell">
                <div className="skeleton-pill"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line-sm"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
