# 🎓 Grade Horária Escolar - Ensino Médio

Sistema web moderno e responsivo para visualização da grade horária das turmas do Ensino Médio. Desenvolvido para ajudar alunos, professores e coordenação pedagógica a localizarem em tempo real em qual sala cada turma ou professor está no momento.

---

## 🚀 1. Stack Tecnológica

- **Frontend:** React 19 + TypeScript + Vite
- **Estilização & UI/UX:** CSS Moderno (Design Tokens, Glassmorphism, Micro-animações e paleta de cores temática por disciplina)
- **Ícones:** Lucide React
- **Backend & Banco de Dados:** Supabase (PostgreSQL com Row Level Security - RLS)
- **Linguagem:** TypeScript (100% tipado com interfaces estáticas)

---

## 📂 2. Estrutura do Projeto

```text
├── supabase/
│   └── schema.sql             # Script SQL completo com tabelas, RLS e dados de teste
├── src/
│   ├── types/
│   │   └── database.ts        # Interfaces TypeScript (Turma, Professor, Horario, etc.)
│   ├── lib/
│   │   └── supabase.ts        # Inicialização do cliente Supabase e checagem de variáveis
│   ├── services/
│   │   ├── horariosService.ts # Consultas relacionais com .select('*, turmas(*), professores(*)')
│   │   └── mockData.ts        # Mock data com fallback inteligente
│   ├── utils/
│   │   └── timeHelpers.ts     # Cálculo de aula atual em tempo real e períodos de aula
│   ├── components/
│   │   ├── Header.tsx         # Cabeçalho com relógio ao vivo e status "Agora"
│   │   ├── FiltrosBar.tsx     # Filtro por Turma, Professor/Matéria e busca textual
│   │   ├── GradeHoraria.tsx   # Grid semanal desktop + abas por dia no mobile
│   │   ├── CardAula.tsx       # Card de cada aula com badge colorido por matéria
│   │   ├── ModalDetalheAula.tsx # Modal com dados completos e botão "Copiar Sala"
│   │   ├── Skeletons.tsx      # Estados visuais de carregamento (Shimmer)
│   │   └── ErrorMessage.tsx   # Tratamento e recuperação de erros de rede/banco
│   ├── App.tsx                # Gerenciador de estado principal
│   ├── index.css              # Sistema visual e responsividade
│   └── main.tsx               # Ponto de entrada da aplicação
├── .env                       # Variáveis de ambiente com chaves do Supabase
└── package.json
```

---

## 🗄️ 3. Configuração do Banco de Dados no Supabase

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com).
2. Vá até a aba **SQL Editor**.
3. Abra o arquivo [`supabase/schema.sql`](./supabase/schema.sql) deste projeto.
4. Cole o conteúdo no editor do Supabase e clique em **Run**.

O script irá criar:
- Tabela `turmas` (com restrições de ano letivo e sala).
- Tabela `professores` (com e-mail único e cor da disciplina).
- Tabela `horarios` (com chaves estrangeiras e constraints de unicidade evitando conflito de horários para a turma e para o professor).
- Índices de performance para otimizar queries em turmas e professores.
- Políticas de **Row Level Security (RLS)** habilitando leitura pública (`anon` e `authenticated`).
- Dados de teste com 3 turmas, 8 professores e grade semanal completa.

---

## 💻 4. Como Executar Localmente

### Pré-requisitos
- Node.js instalado (v18+)
- npm instalado

### Passos:

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## ✨ 5. Principais Recursos de UI/UX

1. **Localizador em Tempo Real ("Agora"):** Detecta o dia e horário atual e destaca automaticamente com um badge pulsante a aula que está ocorrendo no momento.
2. **Responsividade Mobile Inteligente:** Em telas de celulares ou tablets menores, o layout se transforma automaticamente de grid semanal para **abas de navegação por dia** (`[Seg] [Ter] [Qua] [Qui] [Sex]`), garantindo perfeita legibilidade.
3. **Prevenção de N+1 Queries:** O serviço consulta os horários trazendo simultaneamente os dados da turma e do professor via relacionamento no PostgreSQL.
4. **Estado "Janela / Vago":** Horários sem aulas exibem um card discreto e elegante indicando vaga/janela.
5. **Divisor de Intervalo:** Marca visualmente o período do recreio escolar entre a 3ª e a 4ª aula.
6. **Modal Detalhado com Ação Rápida:** Clique em qualquer aula para ver e-mail do professor e copiar os dados da sala em um clique.
7. **Visão Dupla (Grade por Turma vs. Grade por Docente):** Permite alternar instantaneamente entre a grade semanal da turma e a alocação completa de cada professor entre todas as salas da escola.
8. **Simulador de Tempo Real:** Painel com presets rápidos que permite avançar o horário para qualquer dia e período de aula para testes e demonstrações a qualquer hora.
9. **Painel "Onde Está Agora?":** Drawer/modal com visão instantânea da localização física de todas as turmas e professores no momento.
10. **Impressão Formatada & PDF A4:** Estilo dedicado `@media print` para geração de impressos institucionais e relatórios semanais.
11. **Resiliência e Fallback Offline:** Fallback transparente para banco de dados local com 3 turmas e 8 professores completos caso o Supabase remoto esteja offline.
