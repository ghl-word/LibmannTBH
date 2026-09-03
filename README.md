# AlphaOS
### Sistema de Gestão para Assistência Técnica de Celulares e Loja de Acessórios

## Sobre o Projeto

Este projeto tem como objetivo desenvolver um sistema web para automatizar a gestão de uma assistência técnica de celulares e uma loja de acessórios.

Atualmente, diversos processos são realizados manualmente, como o cadastro de ordens de serviço, controle de estoque, registro de vendas e acompanhamento financeiro. Essa forma de gerenciamento dificulta o controle das informações, aumenta a possibilidade de erros e reduz a eficiência do atendimento aos clientes.

A proposta do sistema é integrar todos esses processos em uma única plataforma, permitindo o gerenciamento de clientes, equipamentos, ordens de serviço, estoque, vendas, relatórios financeiros e controle de usuários com diferentes níveis de acesso (Administrador, Técnico e Vendedor).


Integrantes do Grupo
Gabriel Libmann
Igor Hetman
Natali Lascoski


Tecnologias e Ferramentas Utilizadas
Prototipação
Figma
Backend (Planejado)
Python
Flask
SQLAlchemy
Banco de Dados
PostgreSQL
Frontend
HTML5
CSS3
JavaScript
Bootstrap
Bibliotecas Previstas
ReportLab (Geração de PDF)
SMTP (Envio de e-mails)
Ferramentas
Git
GitHub
Visual Studio Code
Status do Projeto

Fase atual: Planejamento e Prototipação.

Até o momento foram concluídas as seguintes etapas:

Levantamento dos requisitos.
Definição das funcionalidades.
Modelagem inicial do sistema.
Criação do protótipo das telas no Figma.
Criação do repositório no GitHub.

As etapas de implementação do sistema serão desenvolvidas nas próximas fases do projeto.

Instalação e Execução

Como o projeto encontra-se em fase de prototipação, ainda não há código-fonte disponível para execução.

As tecnologias previstas para desenvolvimento são:

Python
Flask
PostgreSQL
HTML5
CSS3
JavaScript
Bootstrap

Quando a implementação for iniciada, as instruções de instalação, dependências e execução serão adicionadas a este repositório.

Dependências Previstas
Python 3.x
Flask
SQLAlchemy
PostgreSQL
Bootstrap
ReportLab
Estrutura Inicial do Projeto
assistencia-tecnica/

├── backend/
├── frontend/
├── database/
├── docs/
└── README.md
Protótipo no Figma

Link do protótipo: https://www.figma.com/design/N2eAmd64ssRn3ScvkKDLeu/Sem-t%C3%ADtulo?t=9EWgNoNI6VGtng9T-1

## Como executar
1. Clone o projeto:

```bash
git clone https://github.com/Lascoski/AlphaOS.git
cd AlphaOS
```
2. Crie no PostgreSQL o banco `alphaos_db` e restaure o arquivo `bkp alphaos_db.backup`.

3. Na pasta `alphaos-backend`, crie o `.env`:
```env
DB_USER=postgres
DB_PASSWORD=SUA_SENHA
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alphaos_db
```
4. Inicie o backend:
```bash
cd alphaos-backend
npm install
node server.js
```
5. Em outro terminal, inicie o frontend:

```bash
npm install
npm run dev
```
Acesse o endereço `localhost` exibido pelo Vite.


Projeto desenvolvido para fins acadêmicos.

Projeto Acadêmico • 2026

</div>
