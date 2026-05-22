const IT_ENGLISH = {
  categories: [
    {
      id: 'git',
      name: 'Git & Version Control',
      namePT: 'Git e Controle de Versão',
      icon: 'fa-code-branch',
      terms: [
        { term: 'commit', pronunciation: '/kəˈmɪt/', meaning: 'Save a snapshot of your code changes', meaningPT: 'Salvar um registro das alterações do código', example: 'git commit -m "Fix login bug"', usage: '"I committed the changes but forgot to push."' },
        { term: 'branch', pronunciation: '/bræntʃ/', meaning: 'A separate version of the codebase for development', meaningPT: 'Uma versão separada da base de código para desenvolvimento', example: 'git checkout -b feature/user-auth', usage: '"Create a new branch for each feature."' },
        { term: 'merge', pronunciation: '/mɜːrdʒ/', meaning: 'To combine changes from one branch into another', meaningPT: 'Combinar alterações de um branch em outro', example: 'git merge feature/login', usage: '"Let\'s merge your PR into main."' },
        { term: 'pull request (PR)', pronunciation: '/pʊl rɪˈkwest/', meaning: 'A request to review and merge your code changes', meaningPT: 'Solicitação para revisar e mesclar suas alterações de código', example: 'github.com → New Pull Request', usage: '"Open a PR when your feature is ready for review."' },
        { term: 'rebase', pronunciation: '/riːˈbeɪs/', meaning: 'To move or combine commits to a new base', meaningPT: 'Mover ou combinar commits para uma nova base', example: 'git rebase main', usage: '"Rebase your branch to get the latest changes."' },
        { term: 'conflict', pronunciation: '/ˈkɒnflɪkt/', meaning: 'When two branches have incompatible changes', meaningPT: 'Quando dois branches têm alterações incompatíveis', example: 'CONFLICT: Merge conflict in index.js', usage: '"There\'s a merge conflict — you need to resolve it manually."' },
        { term: 'clone', pronunciation: '/kloʊn/', meaning: 'To copy a repository to your local machine', meaningPT: 'Copiar um repositório para sua máquina local', example: 'git clone https://github.com/user/repo.git', usage: '"Clone the repo and run npm install."' },
        { term: 'stash', pronunciation: '/stæʃ/', meaning: 'To temporarily save changes without committing', meaningPT: 'Salvar temporariamente alterações sem fazer commit', example: 'git stash; git stash pop', usage: '"Stash your changes before switching branches."' },
        { term: 'cherry-pick', pronunciation: '/ˈtʃeri pɪk/', meaning: 'Apply a specific commit from one branch to another', meaningPT: 'Aplicar um commit específico de um branch em outro', example: 'git cherry-pick a3b4c5d', usage: '"Cherry-pick that hotfix commit into the release branch."' },
        { term: 'tag', pronunciation: '/tæɡ/', meaning: 'A reference to a specific commit, usually for releases', meaningPT: 'Uma referência a um commit específico, geralmente para releases', example: 'git tag v1.0.0', usage: '"Always tag your production releases."' },
      ]
    },
    {
      id: 'sql',
      name: 'SQL & Databases',
      namePT: 'SQL e Bancos de Dados',
      icon: 'fa-database',
      terms: [
        { term: 'query', pronunciation: '/ˈkwɪri/', meaning: 'A request to retrieve or manipulate data', meaningPT: 'Uma solicitação para recuperar ou manipular dados', example: 'SELECT * FROM users WHERE active = 1', usage: '"Run this query to get all active users."' },
        { term: 'JOIN', pronunciation: '/dʒɔɪn/', meaning: 'Combine rows from two or more tables based on a related column', meaningPT: 'Combinar linhas de duas ou mais tabelas com base em uma coluna relacionada', example: 'SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id', usage: '"We need to join the users and orders tables."' },
        { term: 'INNER JOIN', pronunciation: '/ˈɪnər dʒɔɪn/', meaning: 'Returns only matching rows from both tables', meaningPT: 'Retorna apenas linhas que correspondem em ambas as tabelas', example: 'SELECT * FROM a INNER JOIN b ON a.id = b.a_id', usage: '"Use INNER JOIN when you only want matching records."' },
        { term: 'LEFT JOIN', pronunciation: '/left dʒɔɪn/', meaning: 'Returns all rows from the left table, with matches from the right', meaningPT: 'Retorna todas as linhas da tabela esquerda, com correspondências da direita', example: 'SELECT u.*, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id', usage: '"LEFT JOIN keeps all users even if they have no orders."' },
        { term: 'GROUP BY', pronunciation: '/ɡruːp baɪ/', meaning: 'Groups rows that share the same values into summary rows', meaningPT: 'Agrupa linhas que têm os mesmos valores em linhas de resumo', example: 'SELECT department, COUNT(*) FROM employees GROUP BY department', usage: '"Group by department to count employees per team."' },
        { term: 'HAVING', pronunciation: '/ˈhævɪŋ/', meaning: 'Filters groups created by GROUP BY (like WHERE but for groups)', meaningPT: 'Filtra grupos criados pelo GROUP BY (como WHERE mas para grupos)', example: 'SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5', usage: '"HAVING filters groups — WHERE filters individual rows."' },
        { term: 'index', pronunciation: '/ˈɪndeks/', meaning: 'A data structure that speeds up data retrieval', meaningPT: 'Uma estrutura de dados que acelera a recuperação de dados', example: 'CREATE INDEX idx_email ON users(email)', usage: '"Add an index on email — that column is queried constantly."' },
        { term: 'transaction', pronunciation: '/trænˈzækʃən/', meaning: 'A sequence of operations treated as a single unit (all or nothing)', meaningPT: 'Uma sequência de operações tratadas como uma unidade (tudo ou nada)', example: 'BEGIN; UPDATE accounts SET balance=balance-100 WHERE id=1; COMMIT;', usage: '"Wrap the payment update in a transaction to prevent partial writes."' },
        { term: 'NULL', pronunciation: '/nʌl/', meaning: 'Absence of a value — not zero, not empty string', meaningPT: 'Ausência de qualquer valor — não é zero, não é string vazia', example: 'SELECT * FROM users WHERE phone IS NULL', usage: '"NULL is not zero. Use IS NULL, never = NULL."' },
        { term: 'subquery', pronunciation: '/ˈsʌbˌkwɪri/', meaning: 'A query nested inside another query', meaningPT: 'Uma consulta aninhada dentro de outra consulta', example: 'SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > 100)', usage: '"Use a subquery here, but check if a JOIN would be faster."' },
        { term: 'stored procedure', pronunciation: '/stɔːrd prəˈsiːdʒər/', meaning: 'A saved, reusable SQL routine stored in the database', meaningPT: 'Uma rotina SQL salva e reutilizável armazenada no banco de dados', example: 'EXEC GetUserOrders @UserId = 42', usage: '"The business logic lives in a stored procedure on the DB."' },
        { term: 'foreign key', pronunciation: '/ˈfɒrɪn kiː/', meaning: 'A column that references the primary key of another table', meaningPT: 'Uma coluna que referencia a chave primária de outra tabela', example: 'FOREIGN KEY (user_id) REFERENCES users(id)', usage: '"Always define foreign keys to enforce referential integrity."' },
        { term: 'primary key', pronunciation: '/ˈpraɪməri kiː/', meaning: 'A column (or combination) that uniquely identifies each row', meaningPT: 'Uma coluna (ou combinação) que identifica exclusivamente cada linha', example: 'CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT)', usage: '"Every table should have a primary key."' },
        { term: 'migration', pronunciation: '/maɪˈɡreɪʃən/', meaning: 'A script that changes the database schema in a controlled way', meaningPT: 'Um script que altera o esquema do banco de dados de forma controlada', example: 'ALTER TABLE users ADD COLUMN phone VARCHAR(20)', usage: '"Write a migration to add the new column — don\'t change it manually in prod."' },
        { term: 'deadlock', pronunciation: '/ˈdedlɒk/', meaning: 'When two transactions block each other indefinitely', meaningPT: 'Quando duas transações se bloqueiam mutuamente indefinidamente', example: 'Transaction A waits for B, Transaction B waits for A', usage: '"We got a deadlock in production — we need to optimize the query order."' },
        { term: 'EXPLAIN / query plan', pronunciation: '/ɪkˈspleɪn/', meaning: 'Shows how the database will execute a query (for optimization)', meaningPT: 'Mostra como o banco vai executar uma consulta (para otimização)', example: 'EXPLAIN SELECT * FROM orders WHERE user_id = 42', usage: '"Run EXPLAIN on slow queries to find missing indexes."' },
      ]
    },
    {
      id: 'web',
      name: 'Web Development',
      namePT: 'Desenvolvimento Web',
      icon: 'fa-globe',
      terms: [
        { term: 'endpoint', pronunciation: '/ˈendpɔɪnt/', meaning: 'A specific URL where an API can be accessed', meaningPT: 'Uma URL específica onde uma API pode ser acessada', example: 'GET /api/users/:id', usage: '"Create an endpoint for user authentication."' },
        { term: 'payload', pronunciation: '/ˈpeɪloʊd/', meaning: 'The actual data sent in a request or response', meaningPT: 'Os dados reais enviados em uma requisição ou resposta', example: '{ "username": "lucas", "password": "..." }', usage: '"Check the request payload — it\'s missing the token."' },
        { term: 'middleware', pronunciation: '/ˈmɪdəlwer/', meaning: 'Code that runs between the request and the response', meaningPT: 'Código que roda entre a requisição e a resposta', example: 'app.use(authMiddleware)', usage: '"The middleware checks if the user is authenticated."' },
        { term: 'render', pronunciation: '/ˈrendər/', meaning: 'To generate and display content on screen', meaningPT: 'Gerar e exibir conteúdo na tela', example: 'return res.render("index", { user })', usage: '"The component re-renders when the state changes."' },
        { term: 'responsive', pronunciation: '/rɪˈspɒnsɪv/', meaning: 'Design that adapts to different screen sizes', meaningPT: 'Design que se adapta a diferentes tamanhos de tela', example: '@media (max-width: 768px) { ... }', usage: '"Make sure the layout is responsive on mobile."' },
        { term: 'cache', pronunciation: '/kæʃ/', meaning: 'Stored data for faster future access', meaningPT: 'Dados armazenados para acesso mais rápido no futuro', example: 'Redis.set("user:1", JSON.stringify(user))', usage: '"Clear the cache if you see stale data."' },
        { term: 'deploy', pronunciation: '/dɪˈplɔɪ/', meaning: 'To release software to a production server', meaningPT: 'Publicar software em um servidor de produção', example: 'npm run deploy; vercel deploy', usage: '"Deploy the fix to staging first, then production."' },
        { term: 'refactor', pronunciation: '/riːˈfæktər/', meaning: 'To restructure code without changing behavior', meaningPT: 'Reestruturar o código sem mudar o comportamento', example: 'Extract helper functions, rename variables for clarity', usage: '"Let\'s refactor this module before adding new features."' },
        { term: 'rate limiting', pronunciation: '/reɪt ˈlɪmɪtɪŋ/', meaning: 'Restricting how many requests a client can make', meaningPT: 'Limitar quantas requisições um cliente pode fazer', example: '429 Too Many Requests', usage: '"We need rate limiting to prevent abuse of the API."' },
        { term: 'CORS', pronunciation: '/kɔːrz/', meaning: 'Cross-Origin Resource Sharing — browser security policy', meaningPT: 'Compartilhamento de recursos entre origens diferentes — política de segurança do browser', example: 'Access-Control-Allow-Origin: *', usage: '"The frontend is getting a CORS error — fix the headers."' },
      ]
    },
    {
      id: 'agile',
      name: 'Agile & Project Management',
      namePT: 'Ágil e Gestão de Projetos',
      icon: 'fa-chart-gantt',
      terms: [
        { term: 'sprint', pronunciation: '/sprɪnt/', meaning: 'A short development cycle, usually 1–2 weeks', meaningPT: 'Um ciclo curto de desenvolvimento, geralmente 1–2 semanas', example: 'Sprint 23: User Profile Features', usage: '"We ship new features every sprint."' },
        { term: 'backlog', pronunciation: '/ˈbæklɒɡ/', meaning: 'A prioritized list of all work to be done', meaningPT: 'Uma lista priorizada de todo o trabalho a ser feito', example: 'Product Backlog → Sprint Backlog', usage: '"Add that feature to the backlog for next sprint."' },
        { term: 'standup', pronunciation: '/ˈstændʌp/', meaning: 'A brief daily team sync meeting (max 15 min)', meaningPT: 'Uma breve reunião diária de sincronização da equipe (máx. 15 min)', example: '"Yesterday / Today / Blockers"', usage: '"See you at standup at 9am."' },
        { term: 'blocker', pronunciation: '/ˈblɒkər/', meaning: 'An obstacle preventing progress on a task', meaningPT: 'Um obstáculo que impede o progresso em uma tarefa', example: '"I\'m blocked by the API being down."', usage: '"Any blockers? Let\'s resolve them now."' },
        { term: 'deliverable', pronunciation: '/dɪˈlɪvərəbəl/', meaning: 'A tangible output from a project phase', meaningPT: 'Uma entrega concreta de uma fase do projeto', example: 'API docs, UI mockups, test report', usage: '"What are the deliverables for this sprint?"' },
        { term: 'scope creep', pronunciation: '/skoʊp kriːp/', meaning: 'Uncontrolled growth of project requirements', meaningPT: 'Crescimento descontrolado dos requisitos do projeto', example: '"Can we also add X?" — "That\'s scope creep."', usage: '"We need to avoid scope creep or we\'ll miss the deadline."' },
        { term: 'bandwidth', pronunciation: '/ˈbændwɪdθ/', meaning: 'Capacity or availability to take on work (metaphor)', meaningPT: 'Capacidade ou disponibilidade para trabalhar (metáfora)', example: '"Do you have bandwidth for this task?"', usage: '"I don\'t have the bandwidth to take on more this week."' },
        { term: 'ticket / issue', pronunciation: '/ˈtɪkɪt/', meaning: 'A unit of work tracked in a project management tool', meaningPT: 'Uma unidade de trabalho rastreada em uma ferramenta de gestão de projetos', example: 'JIRA-1234: Fix login redirect bug', usage: '"Create a ticket for that bug before you start fixing it."' },
        { term: 'velocity', pronunciation: '/vəˈlɒsɪti/', meaning: 'The amount of work a team completes per sprint', meaningPT: 'A quantidade de trabalho que uma equipe completa por sprint', example: '"Our velocity is 40 story points per sprint."', usage: '"Based on our velocity, we can\'t fit that in this sprint."' },
        { term: 'retrospective', pronunciation: '/ˌretrəˈspektɪv/', meaning: 'A meeting to reflect on what went well and what to improve', meaningPT: 'Uma reunião para refletir sobre o que correu bem e o que melhorar', example: '"What went well? What didn\'t? What will we change?"', usage: '"Bring up the deployment issues in the retrospective."' },
      ]
    },
    {
      id: 'interview',
      name: 'Tech Interview English',
      namePT: 'Inglês para Entrevistas Tech',
      icon: 'fa-user-tie',
      terms: [
        { term: 'walk me through', pronunciation: '', meaning: 'Please explain step by step', meaningPT: 'Por favor explique passo a passo', example: '"Can you walk me through your solution?"', usage: 'Interviewers use this to ask you to explain your thinking.' },
        { term: 'trade-off', pronunciation: '/ˈtreɪdɒf/', meaning: 'A balance between competing advantages or disadvantages', meaningPT: 'Um equilíbrio entre vantagens e desvantagens concorrentes', example: '"What are the trade-offs between SQL and NoSQL?"', usage: '"Always discuss trade-offs in system design interviews."' },
        { term: 'scalability', pronunciation: '/ˌskeɪləˈbɪlɪti/', meaning: 'Ability to handle growing amounts of work or users', meaningPT: 'Capacidade de lidar com cargas crescentes de trabalho ou usuários', example: '"How would you ensure the system scales to 1M users?"', usage: 'Key topic in senior-level system design interviews.' },
        { term: 'edge case', pronunciation: '/ˈedʒ keɪs/', meaning: 'An unusual or extreme input/scenario that needs handling', meaningPT: 'Uma entrada ou cenário incomum que precisa ser tratado', example: '"What happens if the input is empty or null?"', usage: '"Always think about edge cases in coding interviews."' },
        { term: 'time complexity', pronunciation: '/taɪm kəmˈpleksɪti/', meaning: 'How runtime grows relative to input size (Big O notation)', meaningPT: 'Como o tempo de execução cresce em relação ao tamanho da entrada (notação Big O)', example: '"This solution is O(n log n) time, O(n) space."', usage: '"Always explain the time complexity of your algorithm."' },
        { term: 'tell me about yourself', pronunciation: '', meaning: 'Standard opening question — your professional summary', meaningPT: 'Pergunta padrão de abertura — seu resumo profissional', example: '"My name is Lucas. I\'m a web developer from Brazil with 3 years of experience in Node.js and React..."', usage: 'Prepare a 2-minute structured answer: background → current role → why this company.' },
        { term: 'strength / weakness', pronunciation: '', meaning: '"What are your strengths and weaknesses?"', meaningPT: '"Quais são seus pontos fortes e fracos?"', example: 'Strength: "I\'m very detail-oriented." Weakness: "I sometimes over-engineer solutions, but I\'m learning to..."', usage: 'For weakness, always show what you\'re doing to improve.' },
        { term: 'culture fit', pronunciation: '/ˈkʌltʃər fɪt/', meaning: 'Whether you align with the company\'s values and style', meaningPT: 'Se você se alinha aos valores e estilo da empresa', example: '"We want to make sure there\'s a good culture fit."', usage: 'Research the company before the interview. Ask: "What does success look like in this role?"' },
        { term: 'take-home assignment', pronunciation: '', meaning: 'A coding project to complete at home before/after interview', meaningPT: 'Um projeto de código para completar em casa antes/após a entrevista', example: '"Please complete this API project within 48 hours."', usage: 'Read ALL requirements first. Then code. Then review before submitting.' },
      ]
    }
  ],

  phrases: {
    codeReview: [
      { en: "LGTM — Looks Good To Me", pt: 'Parece bom para mim — aprovando', context: 'Approving a PR' },
      { en: "This could be simplified.", pt: 'Isso poderia ser simplificado.', context: 'Suggestion' },
      { en: "Nit: minor style issue (not blocking)", pt: 'Detalhe menor de estilo (não bloqueia o PR)', context: 'Minor comment' },
      { en: "Can you add a unit test for this case?", pt: 'Você pode adicionar um teste unitário para este caso?', context: 'Requesting test' },
      { en: "This might break if the input is null.", pt: 'Isso pode quebrar se a entrada for nula.', context: 'Warning' },
      { en: "What's the reasoning behind this approach?", pt: 'Qual é a razão por trás desta abordagem?', context: 'Asking why' },
      { en: "Good catch! Fixed in the latest commit.", pt: 'Boa observação! Corrigido no último commit.', context: 'Responding to review' },
      { en: "Could you elaborate on this?", pt: 'Você poderia elaborar sobre isso?', context: 'Asking for clarification' },
      { en: "I'd suggest extracting this into a helper function.", pt: 'Eu sugeriria extrair isso em uma função auxiliar.', context: 'Refactoring suggestion' },
      { en: "This is a blocking issue — please fix before merging.", pt: 'Isso é um problema bloqueante — corrija antes de fazer o merge.', context: 'Blocking PR' },
      { en: "Nice solution! Very clean.", pt: 'Ótima solução! Muito limpo.', context: 'Complimenting' },
      { en: "This will cause a race condition under concurrent load.", pt: 'Isso vai causar uma condição de corrida sob carga concorrente.', context: 'Technical warning' },
    ],
    standups: [
      { en: "Yesterday I worked on the authentication module.", pt: 'Ontem trabalhei no módulo de autenticação.', context: 'Daily standup - yesterday' },
      { en: "Today I'm planning to finish the user profile API.", pt: 'Hoje estou planejando terminar a API de perfil do usuário.', context: 'Daily standup - today' },
      { en: "I'm blocked by a bug I can't reproduce locally.", pt: 'Estou bloqueado por um bug que não consigo reproduzir localmente.', context: 'Reporting a blocker' },
      { en: "I'll need help reviewing the DB schema changes.", pt: 'Vou precisar de ajuda para revisar as mudanças no esquema do banco.', context: 'Asking for help' },
      { en: "The PR is up and ready for review.", pt: 'O PR está aberto e pronto para revisão.', context: 'PR status' },
      { en: "I'm on track to finish by EOD (end of day).", pt: 'Estou no caminho certo para terminar até o fim do dia.', context: 'Progress update' },
      { en: "I finished ahead of schedule — I can pick up another ticket.", pt: 'Terminei antes do prazo — posso pegar outro ticket.', context: 'Finished early' },
      { en: "I pushed a hotfix to production last night — everything looks stable.", pt: 'Subi um hotfix para produção ontem à noite — tudo parece estável.', context: 'Hotfix status' },
    ],
    slack: [
      { en: "Just a heads up — the API will be down for maintenance at 2pm.", pt: 'Só um aviso — a API ficará fora para manutenção às 14h.', context: 'Advance warning' },
      { en: "Can I DM you about this?", pt: 'Posso te mandar uma mensagem direta sobre isso?', context: 'Requesting DM' },
      { en: "Let's take this to a call — too complex for text.", pt: 'Vamos para uma chamada — muito complexo para texto.', context: 'Moving to call' },
      { en: "+1 — totally agree.", pt: '+1 — concordo totalmente.', context: 'Agreement' },
      { en: "Circling back on this — any updates?", pt: 'Voltando a este assunto — alguma atualização?', context: 'Following up' },
      { en: "Tagging @channel because this affects everyone.", pt: 'Marcando @canal porque isso afeta a todos.', context: 'Team announcement' },
      { en: "FYI (For Your Information): the deploy is done.", pt: 'Para sua informação: o deploy está feito.', context: 'Information share' },
      { en: "EOD = End of Day / EOM = End of Month / EOW = End of Week", pt: 'EOD = fim do dia / EOM = fim do mês / EOW = fim da semana', context: 'Common abbreviations' },
      { en: "Can you share your screen so I can see the error?", pt: 'Você pode compartilhar sua tela para eu ver o erro?', context: 'Debugging together' },
      { en: "I'll be AFK (Away From Keyboard) for 30 minutes.", pt: 'Estarei ausente por 30 minutos.', context: 'Availability' },
    ],
    emails: [
      { en: "Hi [Name], I hope this email finds you well.", pt: 'Oi [Nome], espero que esteja bem.', context: 'Email opening' },
      { en: "I'm writing to follow up on our conversation last week.", pt: 'Estou escrevendo para dar seguimento à nossa conversa da semana passada.', context: 'Follow-up' },
      { en: "Please find the attached document for your review.", pt: 'Por favor encontre o documento em anexo para sua revisão.', context: 'Sending attachment' },
      { en: "Could you please get back to me by Friday?", pt: 'Você poderia me responder até sexta-feira?', context: 'Setting deadline' },
      { en: "Let me know if you have any questions.", pt: 'Me avise se tiver alguma dúvida.', context: 'Email closing' },
      { en: "I wanted to bring this to your attention.", pt: 'Queria trazer isso à sua atenção.', context: 'Flagging issue' },
      { en: "As per our previous discussion...", pt: 'Conforme nossa discussão anterior...', context: 'Referring to past' },
      { en: "Thank you for your prompt response.", pt: 'Obrigado pela sua resposta rápida.', context: 'Thanking' },
      { en: "I apologize for the delayed response.", pt: 'Me desculpe pela resposta atrasada.', context: 'Apologizing for delay' },
      { en: "Best regards / Kind regards / Thanks,", pt: 'Atenciosamente / Com os melhores cumprimentos / Obrigado,', context: 'Email sign-off' },
    ],
    meetings: [
      { en: "Let's get started — does everyone have the agenda?", pt: 'Vamos começar — todos têm a pauta?', context: 'Opening meeting' },
      { en: "Could you mute yourself? There\'s some background noise.", pt: 'Você pode se silenciar? Há algum ruído de fundo.', context: 'Audio issue' },
      { en: "Sorry, you broke up — could you repeat that?", pt: 'Desculpe, a conexão caiu — você pode repetir?', context: 'Connection issue' },
      { en: "Can everyone see my screen?", pt: 'Todos conseguem ver minha tela?', context: 'Screen share' },
      { en: "I'd like to add something to that point.", pt: 'Gostaria de acrescentar algo a esse ponto.', context: 'Adding to discussion' },
      { en: "Let's table this for now and follow up later.", pt: 'Vamos deixar isso de lado por agora e retomar depois.', context: 'Postponing topic' },
      { en: "To recap what we decided today...", pt: 'Resumindo o que decidimos hoje...', context: 'Meeting summary' },
      { en: "Who\'s going to own this action item?", pt: 'Quem vai ser responsável por esse item de ação?', context: 'Assigning task' },
    ]
  },

  sqlPhrases: [
    { situation: 'Explaining a slow query', en: '"The query is running slowly because it\'s doing a full table scan. We need to add an index on the user_id column."', pt: 'A consulta está lenta porque está fazendo um full table scan. Precisamos adicionar um índice na coluna user_id.' },
    { situation: 'Describing a JOIN', en: '"I\'m joining the users table with the orders table on the user ID to get each customer\'s purchase history."', pt: 'Estou juntando a tabela de usuários com a de pedidos pelo ID do usuário para obter o histórico de compras de cada cliente.' },
    { situation: 'Explaining NULL handling', en: '"Watch out — if the email field is NULL, this comparison will always return false. Use IS NULL instead."', pt: 'Cuidado — se o campo email for NULL, essa comparação sempre retornará falso. Use IS NULL.' },
    { situation: 'Proposing a migration', en: '"I\'ll write a migration to add the new column. We should test it in staging before running it in production."', pt: 'Vou escrever uma migration para adicionar a nova coluna. Devemos testar em staging antes de rodar em produção.' },
    { situation: 'Discussing performance', en: '"Let\'s run EXPLAIN on this query to see why it\'s slow. I suspect we\'re missing an index."', pt: 'Vamos rodar EXPLAIN nessa consulta para ver por que está lenta. Suspeito que esteja faltando um índice.' },
    { situation: 'Explaining a transaction', en: '"The transfer logic needs to be wrapped in a transaction. If either UPDATE fails, we need to roll back both."', pt: 'A lógica de transferência precisa ser envolvida em uma transação. Se qualquer UPDATE falhar, precisamos fazer rollback de ambos.' },
    { situation: 'Reviewing a schema', en: '"The foreign key constraint is missing here. Without it, you could have orphaned records."', pt: 'A constraint de chave estrangeira está faltando aqui. Sem ela, você pode ter registros órfãos.' },
    { situation: 'Discussing aggregation', en: '"GROUP BY department gives us the count per team. Add HAVING COUNT(*) > 5 to filter out small teams."', pt: 'GROUP BY department nos dá a contagem por equipe. Adicione HAVING COUNT(*) > 5 para filtrar equipes pequenas.' },
  ],

  articles: [
    {
      title: "How to Give Better Code Reviews",
      content: `Code reviews are a **critical** part of the development process. They help maintain code quality and **knowledge sharing** across the team.\n\nWhen reviewing someone's code, always be **constructive**. Instead of saying "This is wrong," try "This could be improved by...". Remember that the goal is to improve the code, not to criticize the developer.\n\nKey phrases for code reviews:\n- "Have you considered...?" (Você considerou...?)\n- "This approach works, but there might be a more efficient solution..." \n- "Great solution! Just a minor nit..."`
    },
    {
      title: "Talking About SQL in English",
      content: `SQL is used worldwide and knowing how to **talk about your queries in English** is essential for any developer working in international teams.\n\nCommon phrases:\n- "I wrote a query to fetch all active users." (Escrevi uma consulta para buscar todos os usuários ativos.)\n- "The query is running a full table scan — we need an index." \n- "Let me JOIN the two tables on the user ID."\n- "I wrapped the updates in a transaction to ensure atomicity."\n- "EXPLAIN shows the bottleneck is the missing index on email."\n\nPro tip: Never say "I did a select from the table." Instead say: "I queried the users table" or "I ran a SELECT against the database."`
    }
  ]
};
