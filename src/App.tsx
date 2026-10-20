import React, { useState, useEffect, useCallback } from 'react';
import { Turma, Professor, HorarioComRelacoes, FiltrosGrade, HorarioSimulado } from './types/database';
import { buscarTurmas, buscarProfessores, buscarHorarios, buscarTodosHorarios, isUsandoFallbackLocal } from './services/horariosService';
import { Header } from './components/Header';
import { FiltrosBar } from './components/FiltrosBar';
import { GradeHoraria } from './components/GradeHoraria';
import { ModalDetalheAula } from './components/ModalDetalheAula';
import { SimuladorHorarioBar } from './components/SimuladorHorarioBar';
import { PainelOndeEstaAgora } from './components/PainelOndeEstaAgora';
import { GradeSkeleton } from './components/Skeletons';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [horarios, setHorarios] = useState<HorarioComRelacoes[]>([]);
  const [todosHorarios, setTodosHorarios] = useState<HorarioComRelacoes[]>([]);

  const [filtros, setFiltros] = useState<FiltrosGrade>({
    modoVisao: 'turma',
    turmaId: '',
    professorId: undefined,
    buscaTexto: '',
  });

  const [simulacao, setSimulacao] = useState<HorarioSimulado>({
    ativo: false,
    diaSemana: 1,
    horaMinuto: '07:30',
  });

  const [isSimuladorAberto, setIsSimuladorAberto] = useState<boolean>(false);
  const [isOndeEstaAgoraAberto, setIsOndeEstaAgoraAberto] = useState<boolean>(false);

  const [isCarregandoEstrutura, setIsCarregandoEstrutura] = useState<boolean>(true);
  const [isCarregandoHorarios, setIsCarregandoHorarios] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const [aulaSelecionadaModal, setAulaSelecionadaModal] = useState<HorarioComRelacoes | null>(null);

  // 1. Carrega turmas, professores e base geral na montagem inicial
  const carregarDadosIniciais = useCallback(async () => {
    setIsCarregandoEstrutura(true);
    setErro(null);

    try {
      const [listaTurmas, listaProfessores, listaTodos] = await Promise.all([
        buscarTurmas(),
        buscarProfessores(),
        buscarTodosHorarios(),
      ]);

      setTurmas(listaTurmas);
      setProfessores(listaProfessores);
      setTodosHorarios(listaTodos);

      if (listaTurmas.length > 0) {
        setFiltros((prev) => ({
          ...prev,
          turmaId: prev.turmaId || listaTurmas[0].id,
          professorId: prev.professorId || (listaProfessores[0]?.id ?? undefined),
        }));
      }
    } catch (err: any) {
      console.error(err);
      setErro(err.message || 'Erro ao carregar dados essenciais do sistema.');
    } finally {
      setIsCarregandoEstrutura(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  // 2. Carrega a grade horária sempre que os filtros mudarem
  const carregarHorariosFiltrados = useCallback(async () => {
    // Se estiver no modo turma, precisa de turmaId; se estiver no modo professor, precisa de professorId
    if (filtros.modoVisao === 'turma' && !filtros.turmaId) return;
    if (filtros.modoVisao === 'professor' && !filtros.professorId) return;

    setIsCarregandoHorarios(true);
    setErro(null);

    try {
      const resultado = await buscarHorarios(filtros);
      setHorarios(resultado);
    } catch (err: any) {
      console.error(err);
      setErro(err.message || 'Falha ao buscar a grade horária.');
    } finally {
      setIsCarregandoHorarios(false);
    }
  }, [filtros]);

  useEffect(() => {
    if (
      (filtros.modoVisao === 'turma' && filtros.turmaId) ||
      (filtros.modoVisao === 'professor' && filtros.professorId)
    ) {
      carregarHorariosFiltrados();
    }
  }, [filtros, carregarHorariosFiltrados]);

  // Informações da seleção atual para tags de cabeçalho
  const turmaSelecionada = turmas.find((t) => t.id === filtros.turmaId);
  const professorSelecionado = professores.find((p) => p.id === filtros.professorId);

  const handleResetFiltros = () => {
    setFiltros((prev) => ({
      ...prev,
      professorId: prev.modoVisao === 'turma' ? undefined : prev.professorId,
      turmaId: prev.modoVisao === 'professor' ? undefined : (turmas[0]?.id || ''),
      buscaTexto: '',
    }));
  };

  const handleImprimir = () => {
    window.print();
  };

  // Título dinâmico para impressão e exportação
  const tituloImpressao = filtros.modoVisao === 'turma'
    ? `${turmaSelecionada?.nome || 'Turma'} — Sala ${turmaSelecionada?.sala_numero || ''}`
    : `${professorSelecionado?.nome || 'Professor'} (${professorSelecionado?.materia || ''})`;

  const subtituloImpressao = filtros.modoVisao === 'turma'
    ? 'Grade Horária Semanal Completa'
    : `Alocação Semanal Docente • E-mail: ${professorSelecionado?.email || ''}`;

  return (
    <div className="app-container">
      {/* Cabeçalho com Relógio, Status ao Vivo e Indicador de Conexão */}
      <Header
        horarioSimulado={simulacao}
        usandoFallback={isUsandoFallbackLocal()}
      />

      {/* Barra do Simulador de Tempo Real (quando aberta) */}
      {isSimuladorAberto && (
        <SimuladorHorarioBar
          simulacao={simulacao}
          onSimulacaoChange={setSimulacao}
          onFechar={() => setIsSimuladorAberto(false)}
        />
      )}

      {/* Exibição de Erro Crítico (com opção de tentar novamente) */}
      {erro && (
        <ErrorMessage
          mensagem={erro}
          onTentarNovamente={() => {
            if (turmas.length === 0) {
              carregarDadosIniciais();
            } else {
              carregarHorariosFiltrados();
            }
          }}
        />
      )}

      {/* Barra de Filtros e Ferramentas */}
      {!erro && (
        <FiltrosBar
          turmas={turmas}
          professores={professores}
          filtros={filtros}
          turmaSelecionadaInfo={turmaSelecionada}
          professorSelecionadoInfo={professorSelecionado}
          totalAulasEncontradas={horarios.length}
          isSimuladorAberto={isSimuladorAberto}
          isSimulacaoAtiva={simulacao.ativo}
          onFiltrosChange={setFiltros}
          onResetFiltros={handleResetFiltros}
          onAbrirOndeEstaAgora={() => setIsOndeEstaAgoraAberto(true)}
          onToggleSimulador={() => setIsSimuladorAberto((prev) => !prev)}
          onImprimirGrade={handleImprimir}
        />
      )}

      {/* Grade Horária ou Skeletons de Loading */}
      {isCarregandoEstrutura || isCarregandoHorarios ? (
        <GradeSkeleton />
      ) : !erro ? (
        <GradeHoraria
          horarios={horarios}
          modoVisao={filtros.modoVisao}
          horarioSimulado={simulacao}
          tituloGrade={tituloImpressao}
          subtituloGrade={subtituloImpressao}
          onSelectAula={(aula) => setAulaSelecionadaModal(aula)}
        />
      ) : null}

      {/* Modal de Detalhes da Aula */}
      <ModalDetalheAula
        horario={aulaSelecionadaModal}
        onClose={() => setAulaSelecionadaModal(null)}
      />

      {/* Painel / Localizador em Tempo Real "Onde Está Agora?" */}
      {isOndeEstaAgoraAberto && (
        <PainelOndeEstaAgora
          turmas={turmas}
          professores={professores}
          todosHorarios={todosHorarios}
          horarioSimulado={simulacao}
          onClose={() => setIsOndeEstaAgoraAberto(false)}
          onSelecionarTurma={(turmaId) => {
            setFiltros((prev) => ({
              ...prev,
              modoVisao: 'turma',
              turmaId,
              buscaTexto: '',
            }));
          }}
          onSelecionarProfessor={(profId) => {
            setFiltros((prev) => ({
              ...prev,
              modoVisao: 'professor',
              professorId: profId,
              buscaTexto: '',
            }));
          }}
        />
      )}
    </div>
  );
};

export default App;
