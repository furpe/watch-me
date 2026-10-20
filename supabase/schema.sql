-- ==============================================================================
-- SCHEMA SUPABASE: GRADE HORÁRIA ESCOLAR (ENSINO MÉDIO)
-- ==============================================================================
-- Descrição: Tabelas, restrições, índices de performance, RLS e dados de teste.
-- ==============================================================================

-- Habilita extensão para geração de UUID caso não esteja habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABELA: turmas
-- ==============================================================================
DROP TABLE IF EXISTS horarios CASCADE;
DROP TABLE IF EXISTS professores CASCADE;
DROP TABLE IF EXISTS turmas CASCADE;

CREATE TABLE turmas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    ano_letivo INTEGER NOT NULL CHECK (ano_letivo >= 1 AND ano_letivo <= 3), -- 1º, 2º ou 3º ano
    sala_numero VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE turmas IS 'Armazena as turmas do Ensino Médio e a sala base atribuída';
COMMENT ON COLUMN turmas.nome IS 'Nome de exibição da turma, ex: "1º Ano A"';
COMMENT ON COLUMN turmas.ano_letivo IS 'Ano escolar (1, 2 ou 3)';
COMMENT ON COLUMN turmas.sala_numero IS 'Identificador da sala de aula física (ex: Sala 101, Lab Química)';

-- ==============================================================================
-- 2. TABELA: professores
-- ==============================================================================
CREATE TABLE professores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    materia VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    cor_etiqueta VARCHAR(20) DEFAULT '#4F46E5', -- Cor identificadora da disciplina
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE professores IS 'Armazena os docentes e a matéria lecionada';
COMMENT ON COLUMN professores.cor_etiqueta IS 'Código HEX da cor para diferenciação visual na grade';

-- ==============================================================================
-- 3. TABELA: horarios
-- ==============================================================================
CREATE TABLE horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES professores(id) ON DELETE CASCADE,
    dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 5), -- 1: Seg, 2: Ter, 3: Qua, 4: Qui, 5: Sex
    numero_aula INTEGER NOT NULL CHECK (numero_aula BETWEEN 1 AND 6), -- 1 a 6 aulas por dia
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Restrição de Unicidade: Uma turma não pode ter mais de uma aula no mesmo horário e dia
    CONSTRAINT uk_turma_dia_aula UNIQUE (turma_id, dia_semana, numero_aula),

    -- Restrição de Unicidade Adicional: Um professor não pode estar em duas turmas no mesmo horário
    CONSTRAINT uk_professor_dia_aula UNIQUE (professor_id, dia_semana, numero_aula)
);

COMMENT ON TABLE horarios IS 'Tabela associativa de alocação de aulas na grade semanal';
COMMENT ON COLUMN horarios.dia_semana IS '1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta';
COMMENT ON COLUMN horarios.numero_aula IS 'Período da aula (1 a 6)';

-- ==============================================================================
-- 4. ÍNDICES DE PERFORMANCE
-- ==============================================================================
-- Índice para filtros rápidos por turma
CREATE INDEX idx_horarios_turma_id ON horarios(turma_id);

-- Índice para filtros rápidos por professor
CREATE INDEX idx_horarios_professor_id ON horarios(professor_id);

-- Índice composto para consultas por dia e aula
CREATE INDEX idx_horarios_dia_aula ON horarios(dia_semana, numero_aula);

-- Índice para buscas de turmas por nome
CREATE INDEX idx_turmas_nome ON turmas(nome);

-- Índice para buscas de professores por nome ou matéria
CREATE INDEX idx_professores_materia ON professores(materia);
CREATE INDEX idx_professores_nome ON professores(nome);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) - LEITURA PÚBLICA
-- ==============================================================================
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública para qualquer visitante ou aplicação anônima
CREATE POLICY "Permitir leitura pública de turmas" 
ON turmas FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Permitir leitura pública de professores" 
ON professores FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Permitir leitura pública de horarios" 
ON horarios FOR SELECT 
TO anon, authenticated 
USING (true);

-- ==============================================================================
-- 6. DADOS DE TESTE (MOCK DATA)
-- ==============================================================================
-- Inserindo Turmas
INSERT INTO turmas (id, nome, ano_letivo, sala_numero) VALUES
('11111111-1111-1111-1111-111111111111', '1º Ano A', 1, 'Sala 101 (Bloco A)'),
('22222222-2222-2222-2222-222222222222', '2º Ano B', 2, 'Sala 104 (Bloco A)'),
('33333333-3333-3333-3333-333333333333', '3º Ano C', 3, 'Sala 201 (Bloco B)');

-- Inserindo Professores (Com matérias e paleta de cores para UI)
INSERT INTO professores (id, nome, materia, email, cor_etiqueta) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Prof. Carlos Eduardo', 'Matemática', 'carlos.eduardo@escola.edu.br', '#2563EB'), -- Azul
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Profa. Mariana Costa', 'Física', 'mariana.costa@escola.edu.br', '#7C3AED'),     -- Violeta
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Prof. Roberto Souza', 'Química', 'roberto.souza@escola.edu.br', '#059669'),     -- Verde esmeralda
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Profa. Fernanda Lima', 'Biologia', 'fernanda.lima@escola.edu.br', '#10B981'),   -- Verde
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Prof. André Martins', 'História', 'andre.martins@escola.edu.br', '#D97706'),    -- Âmbar
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Profa. Juliana Santos', 'Geografia', 'juliana.santos@escola.edu.br', '#EA580C'), -- Laranja
('10101010-1010-1010-1010-101010101010', 'Profa. Beatriz Mendes', 'Português', 'beatriz.mendes@escola.edu.br', '#DC2626'), -- Vermelho
('20202020-2020-2020-2020-202020202020', 'Prof. Lucas Rocha', 'Inglês', 'lucas.rocha@escola.edu.br', '#0891B2');         -- Ciano

-- Inserindo Grade Horária Completa para a Turma 1 (1º Ano A)
-- Segunda-feira (dia_semana = 1)
INSERT INTO horarios (turma_id, professor_id, dia_semana, numero_aula) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 1), -- Mat
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 2), -- Mat
('11111111-1111-1111-1111-111111111111', '10101010-1010-1010-1010-101010101010', 1, 3), -- Port
('11111111-1111-1111-1111-111111111111', '10101010-1010-1010-1010-101010101010', 1, 4), -- Port
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 5), -- Fís
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 6); -- Fís

-- Terça-feira (dia_semana = 2)
INSERT INTO horarios (turma_id, professor_id, dia_semana, numero_aula) VALUES
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2, 1), -- Quím
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2, 2), -- Quím
('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 2, 3), -- Bio
('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 2, 4), -- Bio
('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 2, 5), -- Hist
('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 2, 6); -- Hist

-- Quarta-feira (dia_semana = 3)
INSERT INTO horarios (turma_id, professor_id, dia_semana, numero_aula) VALUES
('11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 3, 1), -- Geo
('11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 3, 2), -- Geo
('11111111-1111-1111-1111-111111111111', '20202020-2020-2020-2020-202020202020', 3, 3), -- Ing
('11111111-1111-1111-1111-111111111111', '20202020-2020-2020-2020-202020202020', 3, 4), -- Ing
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 5), -- Mat
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 6); -- Mat

-- Quinta-feira (dia_semana = 4)
INSERT INTO horarios (turma_id, professor_id, dia_semana, numero_aula) VALUES
('11111111-1111-1111-1111-111111111111', '10101010-1010-1010-1010-101010101010', 4, 1), -- Port
('11111111-1111-1111-1111-111111111111', '10101010-1010-1010-1010-101010101010', 4, 2), -- Port
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, 3), -- Fís
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, 4), -- Fís
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 4, 5); -- Quím (Aula 6 vaga para teste de janela!)

-- Sexta-feira (dia_semana = 5)
INSERT INTO horarios (turma_id, professor_id, dia_semana, numero_aula) VALUES
('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 5, 1), -- Bio
('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 5, 2), -- Bio
('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 5, 3), -- Hist
('11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 5, 4), -- Geo
('11111111-1111-1111-1111-111111111111', '20202020-2020-2020-2020-202020202020', 5, 5), -- Ing
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 6); -- Mat

-- Inserindo Grade Horária Completa para a Turma 2 (2º Ano B)
INSERT INTO horarios (turma_id, professor_id, dia_semana, numero_aula) VALUES
-- Segunda-feira (dia_semana = 1)
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 1), -- Fís
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 2), -- Fís
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 3), -- Mat
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 4), -- Mat
('22222222-2222-2222-2222-222222222222', '10101010-1010-1010-1010-101010101010', 1, 5), -- Port
('22222222-2222-2222-2222-222222222222', '10101010-1010-1010-1010-101010101010', 1, 6), -- Port
-- Terça-feira (dia_semana = 2)
('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 2, 1), -- Hist
('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 2, 2), -- Hist
('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2, 3), -- Quím
('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2, 4), -- Quím
('22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 2, 5), -- Bio
('22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 2, 6), -- Bio
-- Quarta-feira (dia_semana = 3)
('22222222-2222-2222-2222-222222222222', '20202020-2020-2020-2020-202020202020', 3, 1), -- Ing
('22222222-2222-2222-2222-222222222222', '20202020-2020-2020-2020-202020202020', 3, 2), -- Ing
('22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 3, 3), -- Geo
('22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 3, 4), -- Geo
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, 5), -- Fís
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, 6), -- Fís
-- Quinta-feira (dia_semana = 4)
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 1), -- Mat
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 2), -- Mat
('22222222-2222-2222-2222-222222222222', '20202020-2020-2020-2020-202020202020', 4, 3), -- Ing
('22222222-2222-2222-2222-222222222222', '20202020-2020-2020-2020-202020202020', 4, 4), -- Ing
('22222222-2222-2222-2222-222222222222', '10101010-1010-1010-1010-101010101010', 4, 5), -- Port
('22222222-2222-2222-2222-222222222222', '10101010-1010-1010-1010-101010101010', 4, 6), -- Port
-- Sexta-feira (dia_semana = 5 - Aula 6 vaga para janela)
('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 5, 1), -- Quím
('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 5, 2), -- Quím
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, 3), -- Fís
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, 4), -- Fís
('22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 5, 5); -- Geo

-- Inserindo Grade Horária Completa para a Turma 3 (3º Ano C)
INSERT INTO horarios (turma_id, professor_id, dia_semana, numero_aula) VALUES
-- Segunda-feira (dia_semana = 1)
('33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1, 1), -- Bio
('33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1, 2), -- Bio
('33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 1, 3), -- Geo
('33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 1, 4), -- Geo
('33333333-3333-3333-3333-333333333333', '20202020-2020-2020-2020-202020202020', 1, 5), -- Ing
('33333333-3333-3333-3333-333333333333', '20202020-2020-2020-2020-202020202020', 1, 6), -- Ing
-- Terça-feira (dia_semana = 2)
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 1), -- Mat
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 2), -- Mat
('33333333-3333-3333-3333-333333333333', '10101010-1010-1010-1010-101010101010', 2, 3), -- Port
('33333333-3333-3333-3333-333333333333', '10101010-1010-1010-1010-101010101010', 2, 4), -- Port
('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 5), -- Fís
('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 6), -- Fís
-- Quarta-feira (dia_semana = 3)
('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 3, 1), -- Quím
('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 3, 2), -- Quím
('33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 3, 3), -- Hist
('33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 3, 4), -- Hist
('33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 3, 5), -- Bio
('33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 3, 6), -- Bio
-- Quinta-feira (dia_semana = 4)
('33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 4, 1), -- Geo
('33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 4, 2), -- Geo
('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 4, 3), -- Quím
('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 4, 4), -- Quím
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 5), -- Mat
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 6), -- Mat
-- Sexta-feira (dia_semana = 5 - Aula 5 vaga para janela)
('33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 5, 1), -- Hist
('33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 5, 2), -- Hist
('33333333-3333-3333-3333-333333333333', '10101010-1010-1010-1010-101010101010', 5, 3), -- Port
('33333333-3333-3333-3333-333333333333', '10101010-1010-1010-1010-101010101010', 5, 4), -- Port
('33333333-3333-3333-3333-333333333333', '20202020-2020-2020-2020-202020202020', 5, 6); -- Ing
