Visão Geral do Projeto:

*Frontend:*
- HTML, CSS e JavaScript.
- React.js.
- Bootstrap para estilização responsiva ou Tailwind.

*Backend:*
- Node.js + Express, dotenv, mysql, cors, body-parser e para a criação da API.
- JSON Web Token (JWT) para autenticação.
- bcrypt.js para criptografia de senhas.
- Multer para upload de arquivos (laudos médicos).
- Puppeteer para geração de PDFs.

*Banco de Dados:*
- MySQL para armazenar os dados.

*Segurança:*
- Uso de HTTPS para comunicação segura.
- Criptografia de senhas.
- Registro de logs de acessos.

### Estrutura do Banco de Dados:

-- Tabela de Administradores
CREATE TABLE IF NOT EXISTS administradores (

    id INT AUTO_INCREMENT PRIMARY KEY,
		
    nome_completo VARCHAR(255) NOT NULL,
		
    email VARCHAR(320) UNIQUE NOT NULL,
		
    senha VARCHAR(255) NOT NULL,
		
    foto_perfil VARCHAR(255) NOT NULL,
		
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Analistas
CREATE TABLE IF NOT EXISTS analistas (

    id INT AUTO_INCREMENT PRIMARY KEY,
		
    nome_completo VARCHAR(255) NOT NULL,
		
    email VARCHAR(320) UNIQUE NOT NULL,
		
    senha VARCHAR(255) NOT NULL,
		
    especialidade VARCHAR(255) NOT NULL
		
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Pacientes
CREATE TABLE IF NOT EXISTS pacientes (

    id INT AUTO_INCREMENT PRIMARY KEY,
		
    nome_completo VARCHAR(255) NOT NULL,
		
    email VARCHAR(320) UNIQUE NOT NULL,
		
    senha VARCHAR(255) NOT NULL,
		
    genero ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
		
    data_nascimento DATE NOT NULL,
		
    telefone VARCHAR(20) NOT NULL
		
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Exames
CREATE TABLE IF NOT EXISTS exames (

    id INT AUTO_INCREMENT PRIMARY KEY,
		
    paciente_id INT,
		
    analista_id INT,
		
    tipo_exame VARCHAR(255) NOT NULL,
		
    data_exame TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		
    status ENUM('Pendente', 'Em andamento', 'Concluído') DEFAULT 'Pendente',
		
    resultado TEXT,
		
    laudo_medico TEXT,
		
    imagem_exame VARCHAR(255),
		
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
		
    FOREIGN KEY (analista_id) REFERENCES analistas(id) ON DELETE SET NULL,
		
    INDEX idx_paciente (paciente_id),
		
    INDEX idx_analista (analista_id),
		
    INDEX idx_tipo_exame (tipo_exame)
		
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Histórico de Ações
CREATE TABLE IF NOT EXISTS historicos (

    id INT AUTO_INCREMENT PRIMARY KEY,
		
    usuario_id INT NOT NULL,
		
    tipo_usuario ENUM('Administrador', 'Analista', 'Paciente') NOT NULL,
		
    acao TEXT NOT NULL,
		
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
		
    INDEX idx_usuario (usuario_id)
		
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Usuários Gerais (para login)
CREATE TABLE IF NOT EXISTS usuarios (

    id INT AUTO_INCREMENT PRIMARY KEY,
		
    nome_completo VARCHAR(255) NOT NULL,
		
    email VARCHAR(320) UNIQUE NOT NULL,
		
    senha VARCHAR(255) NOT NULL,
		
    tipo ENUM('Administrador', 'Analista', 'Paciente') NOT NULL
		
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

### Funcionalidades:

1. *Autenticação e Controle de Acesso:*
   - Login e cadastro de usuários.
   - Sessões seguras com JWT.
   - Controle de permissões, com base no tipo de usuário.
   - Administrador (acesso total), analista (gerenciar exames) e paciente (visualizar apenas seus exames)

2. *Gerenciamento de Pacientes:*
   - Cadastro, edição e exclusão de pacientes.
   - Busca e listagem de pacientes.

3. *Gerenciamento de Exames:*
   - Registro de exames com status "pendente" como padrão.
   - Atualização de status.
   - Upload de laudos médicos.
   - Edição, listagem e exclusão de exames.

4. *Consulta e Histórico:*
   - Listagem de exames por paciente.
   - Filtros por tipo de exame e data.
   - Registro de acessos e ações dos usuários.

5. *Relatórios e Exportação:*
   - Geração de PDFs dos exames e laudos.
   - Download de relatórios detalhados.

--------------------------------------


### Desenvolvimento do Backend (Node.js + Express.js)

1. *Configuração do Servidor:*
   - Criar um servidor Express e configurar Body-parser.

2. *Rotas do Sistema:*

Administradores
GET /api/administradores: Listar todos os administradores.
POST /api/administradores: Crie um novo administrador.
GET /api/administradores/:id: Obtenha um administrador específico.
PUT /api/administradores/:id: Atualizar um administrador específico.
DELETE /api/administradores/:id: Deletar um administrador específico.

Analistas
GET /api/analistas: Listar todos os analistas.
POST /api/analistas: Criar um novo analista.
GET /api/analistas/:id: Obter um analista específico.
PUT /api/analistas/:id: Atualizar um analista específico.
DELETE /api/analistas/:id: Deletar um analista específico.

Pacientes
GET /api/pacientes: Listar todos os pacientes.
POST /api/pacientes: Criar um novo paciente.
GET /api/pacientes/:id: Obter um paciente específico.
PUT /api/pacientes/:id: Atualizar um paciente específico.
DELETE /api/pacientes/:id: Deletar um paciente específico.

Exames
GET /api/exames: Listar todos os exames.
POST /api/exames: Crie um novo exame.
GET /api/exames/:id: Obtenha um exame específico.
PUT /api/exames/:id: Atualizar um exame específico.
DELETE /api/exames/:id: Deletar um exame específico.

Histórico de Ações
GET /api/historico: Listar todas as ações.
POST /api/historico: Criar um novo registro de ação.
GET /api/historico/:id: Obter um registro de ação específica.
DELETE /api/historico/:id: Deletar um registro de ação específica.

------------------------------------------

### Desenvolvimento do Frontend (HTML, CSS e JS)

1. *Página de Login:*
   - Formulário para autenticação.
   - Redirecionamento conforme permissão do usuário, ou seja, o tipo de usuário.

2. *Dashboard:*
   - Exibição de cards com o total real de administradores, analistas, pacientes, exames, exames pendentes e exames concluídos na página dashboard.js.
   - Dashboard para analistas, onde poderão gerir os exames e pecientes.
   - Uma página para o paciente poder visualizar os seus exames e baixá-los em PDF.

3. *Cadastro e Consulta de Pacientes:*
   - Formulário de inserção de dados.
   - Listagem de pacientes com botão para visualizar exames.

4. *Cadastro de Exames:*
   - Formulário com upload de arquivos.
   - Seleção de paciente associado ao exame.

5. *Visualização de Exames:*
   - Exibição de exames cadastrados.
   - Opção de baixar laudo e exames em PDF.

### Segurança e Privacidade:
- Uso de HTTPS para criptografia da comunicação.
- Criptografia de senhas com bcrypt.js.
- Controle de acessos e logs para auditoria.
- Backup periódico do banco de dados.

### OBS: se tiver que se melhorar alguma coisa, adicionar ou até deletar, podes fazê-lo, Miguel Luamba.
