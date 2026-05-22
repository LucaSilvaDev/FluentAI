const CURRICULUM = {
  levels: {
    A1: { name: 'Beginner', namePT: 'Iniciante', color: '#10B981', xpRequired: 0, xpToNext: 500 },
    A2: { name: 'Elementary', namePT: 'Elementar', color: '#0096FF', xpRequired: 500, xpToNext: 1000 },
    B1: { name: 'Intermediate', namePT: 'Intermediário', color: '#8B5CF6', xpRequired: 1500, xpToNext: 1500 },
    B2: { name: 'Upper-Intermediate', namePT: 'Avançado', color: '#F59E0B', xpRequired: 3000, xpToNext: 2000 },
    C1: { name: 'Advanced', namePT: 'Avançado+', color: '#EC4899', xpRequired: 5000, xpToNext: 3000 },
    C2: { name: 'Mastery', namePT: 'Maestria', color: '#FF6B35', xpRequired: 8000, xpToNext: 5000 },
  },

  lessons: [
    // ======== A1 LESSONS ========
    {
      id: 'a1-01', level: 'A1', order: 1, xp: 50, duration: '10 min',
      title: 'Greetings & Introductions',
      titlePT: 'Cumprimentos e Apresentações',
      description: 'Learn how to say hello, goodbye, and introduce yourself.',
      descriptionPT: 'Aprenda a dizer olá, tchau e se apresentar.',
      icon: '👋',
      content: {
        sections: [
          {
            type: 'theory',
            title: 'Basic Greetings',
            titlePT: 'Cumprimentos Básicos',
            text: 'Greetings are the first thing you say when you meet someone. In English, greetings vary by time of day and formality.',
            textPT: 'Cumprimentos são a primeira coisa que você diz ao encontrar alguém. Em inglês, os cumprimentos variam pelo horário e formalidade.',
            examples: [
              { en: 'Good morning! / Good afternoon! / Good evening!', pt: 'Bom dia! / Boa tarde! / Boa noite!' },
              { en: 'Hi! / Hello! / Hey! (informal)', pt: 'Oi! / Olá! / Ei! (informal)' },
              { en: 'How are you? / How\'s it going? / What\'s up?', pt: 'Como você está? / Como vai? / E aí?' },
              { en: 'I\'m fine, thank you. / I\'m good. / Not bad.', pt: 'Estou bem, obrigado. / Estou bem. / Não tão ruim.' },
            ]
          },
          {
            type: 'theory',
            title: 'Introducing Yourself',
            titlePT: 'Apresentando-se',
            text: 'When you meet someone new, you introduce yourself by sharing your name and some basic information.',
            textPT: 'Quando você conhece alguém, se apresenta compartilhando seu nome e algumas informações básicas.',
            formula: ['My name is', '+', '[Name]', '/', 'I\'m', '+', '[Name]'],
            examples: [
              { en: 'My name is Lucas. I\'m a web developer.', pt: 'Meu nome é Lucas. Sou desenvolvedor web.' },
              { en: 'I\'m from Brazil. Nice to meet you!', pt: 'Sou do Brasil. Prazer em conhecer você!' },
              { en: 'What\'s your name? / Where are you from?', pt: 'Qual é o seu nome? / De onde você é?' },
            ]
          },
          {
            type: 'tips',
            title: 'Cultural Tips',
            tip: 'In English-speaking countries, a handshake is common when meeting someone for the first time in a professional setting. Friends often say "Hey!" or hug. Always make eye contact — it shows confidence and respect!',
            tipPT: 'Em países de língua inglesa, um aperto de mão é comum ao conhecer alguém pela primeira vez em ambiente profissional. Amigos frequentemente dizem "Hey!" ou se abraçam. Sempre mantenha contato visual — mostra confiança e respeito!'
          }
        ],
        vocabulary: [
          { word: 'Hello', phonetic: '/həˈloʊ/', meaning: 'A greeting used when meeting someone', meaningPT: 'Um cumprimento usado ao encontrar alguém' },
          { word: 'Goodbye', phonetic: '/ˌɡʊdˈbaɪ/', meaning: 'What you say when leaving', meaningPT: 'O que você diz ao sair' },
          { word: 'Please', phonetic: '/pliːz/', meaning: 'Used to make requests polite', meaningPT: 'Usado para tornar pedidos educados' },
          { word: 'Thank you', phonetic: '/θæŋk juː/', meaning: 'Expression of gratitude', meaningPT: 'Expressão de gratidão' },
          { word: 'Sorry', phonetic: '/ˈsɒri/', meaning: 'Expression of apology', meaningPT: 'Expressão de desculpa' },
        ],
        quiz: [
          { q: 'How do you say "Bom dia" in English?', qt: 'Como se diz "Bom dia" em inglês?', options: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'], answer: 1, explanation: '"Good morning" is used from the start of the day until around noon.', explanationPT: '"Good morning" é usado do início do dia até por volta do meio-dia.' },
          { q: 'Which is more FORMAL?', qt: 'Qual é mais FORMAL?', options: ['Hey!', 'What\'s up?', 'Hello.', 'Hi!'], answer: 2, explanation: '"Hello" is the most formal greeting. "Hey" and "What\'s up?" are very informal.', explanationPT: '"Hello" é o cumprimento mais formal. "Hey" e "What\'s up?" são muito informais.' },
          { q: 'Complete: "My name ___ Lucas."', qt: 'Complete: "My name ___ Lucas."', options: ['am', 'are', 'is', 'be'], answer: 2, explanation: 'We use "is" with "my name" because it\'s third person singular.', explanationPT: 'Usamos "is" com "my name" porque é terceira pessoa do singular.' },
        ]
      }
    },

    {
      id: 'a1-02', level: 'A1', order: 2, xp: 60, duration: '15 min',
      title: 'Present Simple — "To Be"',
      titlePT: 'Presente Simples — Verbo "Ser/Estar"',
      description: 'Master the most important verb in English: to be.',
      descriptionPT: 'Domine o verbo mais importante do inglês: ser/estar.',
      icon: '📝',
      content: {
        sections: [
          {
            type: 'theory',
            title: 'The Verb "To Be"',
            titlePT: 'O Verbo "To Be"',
            text: 'The verb "to be" (ser/estar) is the most fundamental verb in English. It changes form based on the subject.',
            textPT: 'O verbo "to be" (ser/estar) é o verbo mais fundamental do inglês. Ele muda de forma baseado no sujeito.',
            table: {
              headers: ['Pronoun', 'To Be', 'Short Form', 'Negation', 'Portuguese'],
              rows: [
                ['I', 'am', "I'm", "I'm not", 'Eu sou/estou'],
                ['You', 'are', "You're", "You're not", 'Você é/está'],
                ['He', 'is', "He's", "He's not", 'Ele é/está'],
                ['She', 'is', "She's", "She's not", 'Ela é/está'],
                ['It', 'is', "It's", "It's not", 'É/Está'],
                ['We', 'are', "We're", "We're not", 'Nós somos/estamos'],
                ['They', 'are', "They're", "They're not", 'Eles são/estão'],
              ]
            },
            examples: [
              { en: 'I am a developer. → I\'m a developer.', pt: 'Eu sou um desenvolvedor.' },
              { en: 'She is from Brazil. → She\'s from Brazil.', pt: 'Ela é do Brasil.' },
              { en: 'They are happy. → They\'re happy.', pt: 'Eles estão felizes.' },
              { en: 'I am not tired. → I\'m not tired.', pt: 'Eu não estou cansado.' },
            ]
          },
          {
            type: 'theory',
            title: 'Questions with "To Be"',
            titlePT: 'Perguntas com "To Be"',
            text: 'To make a question, move "to be" before the subject.',
            textPT: 'Para fazer uma pergunta, mova o "to be" para antes do sujeito.',
            formula: ['Am/Is/Are', '+', '[Subject]', '+', '[complement]?'],
            examples: [
              { en: 'Are you a programmer?', pt: 'Você é programador?' },
              { en: 'Is she from São Paulo?', pt: 'Ela é de São Paulo?' },
              { en: 'What is your name? → What\'s your name?', pt: 'Qual é o seu nome?' },
              { en: 'How old are you?', pt: 'Quantos anos você tem?' },
            ]
          },
          {
            type: 'tips',
            title: 'Pro Tip',
            tip: 'Always use contractions in spoken English and informal writing! "I\'m" sounds much more natural than "I am" in conversation. "I am" is used for emphasis: "Yes, I AM going!"',
            tipPT: 'Sempre use contrações no inglês falado e escrita informal! "I\'m" soa muito mais natural que "I am" na conversa. "I am" é usado para ênfase: "Yes, I AM going!"'
          }
        ],
        vocabulary: [
          { word: 'Happy', phonetic: '/ˈhæpi/', meaning: 'Feeling pleasure or contentment', meaningPT: 'Feliz' },
          { word: 'Tired', phonetic: '/ˈtaɪərd/', meaning: 'In need of sleep or rest', meaningPT: 'Cansado' },
          { word: 'Hungry', phonetic: '/ˈhʌŋɡri/', meaning: 'Wanting food', meaningPT: 'Com fome' },
          { word: 'Ready', phonetic: '/ˈredi/', meaning: 'Prepared for action', meaningPT: 'Pronto' },
          { word: 'Right', phonetic: '/raɪt/', meaning: 'Correct / the right side', meaningPT: 'Certo / lado direito' },
        ],
        quiz: [
          { q: 'Fill in: "___ you a developer?"', qt: 'Preencha: "___ you a developer?"', options: ['Am', 'Is', 'Are', 'Be'], answer: 2, explanation: 'With "you", we use "are".', explanationPT: 'Com "you", usamos "are".' },
          { q: 'What is the contraction of "She is"?', qt: 'Qual é a contração de "She is"?', options: ["Sh'is", "She's", "She's'", "Sheis"], answer: 1, explanation: '"She is" contracts to "She\'s". The apostrophe replaces the \'i\' of \'is\'.', explanationPT: '"She is" se contrai para "She\'s". O apóstrofo substitui o \'i\' de \'is\'.' },
          { q: 'Which is WRONG?', qt: 'Qual está ERRADO?', options: ['He is happy.', 'I am hungry.', 'They is ready.', 'We are tired.'], answer: 2, explanation: '"They" uses "are", not "is". Correct: "They are ready."', explanationPT: '"They" usa "are", não "is". Correto: "They are ready."' },
        ]
      }
    },

    {
      id: 'a1-03', level: 'A1', order: 3, xp: 70, duration: '15 min',
      title: 'Present Simple — Regular Verbs',
      titlePT: 'Presente Simples — Verbos Regulares',
      description: 'Learn to talk about habits, routines, and facts.',
      descriptionPT: 'Aprenda a falar sobre hábitos, rotinas e fatos.',
      icon: '🔄',
      content: {
        sections: [
          {
            type: 'theory',
            title: 'Present Simple Structure',
            titlePT: 'Estrutura do Presente Simples',
            text: 'The Present Simple is used for habits, routines, facts, and permanent situations.',
            textPT: 'O Presente Simples é usado para hábitos, rotinas, fatos e situações permanentes.',
            formula: ['[Subject]', '+', '[Verb]', '(+s/es for he/she/it)'],
            examples: [
              { en: 'I work from home every day.', pt: 'Eu trabalho em casa todo dia.' },
              { en: 'She writes code in JavaScript.', pt: 'Ela escreve código em JavaScript.' },
              { en: 'They live in São Paulo.', pt: 'Eles moram em São Paulo.' },
              { en: 'Water boils at 100°C.', pt: 'A água ferve a 100°C.' },
            ]
          },
          {
            type: 'theory',
            title: 'The "-s" Rule (He/She/It)',
            titlePT: 'A Regra do "-s" (He/She/It)',
            text: 'IMPORTANT: When the subject is he, she, or it, you must add -s or -es to the verb!',
            textPT: 'IMPORTANTE: Quando o sujeito é he, she ou it, você DEVE adicionar -s ou -es ao verbo!',
            examples: [
              { en: 'I work → He work**s**', pt: 'Eu trabalho → Ele trabalha' },
              { en: 'You play → She play**s**', pt: 'Você joga → Ela joga' },
              { en: 'We go → He go**es**', pt: 'Nós vamos → Ele vai' },
              { en: 'I have → She ha**s** (irregular!)', pt: 'Eu tenho → Ela tem (irregular!)' },
            ]
          },
          {
            type: 'theory',
            title: 'Negative & Questions',
            titlePT: 'Negativa e Perguntas',
            text: 'Use "do/does" as a helper verb for negatives and questions.',
            textPT: 'Use "do/does" como verbo auxiliar para negativas e perguntas.',
            formula: ['[Subject]', '+', "don't/doesn't", '+', '[Verb base]'],
            examples: [
              { en: "I don't like Mondays.", pt: 'Eu não gosto de segundas-feiras.' },
              { en: "She doesn't use Windows.", pt: 'Ela não usa Windows.' },
              { en: "Do you code in Python?", pt: 'Você codifica em Python?' },
              { en: "Does he work remotely?", pt: 'Ele trabalha remotamente?' },
            ]
          },
          {
            type: 'tips',
            title: 'Remember!',
            tip: 'Common time expressions: always, usually, often, sometimes, never, every day/week/year, on Mondays, at night, in the morning.',
            tipPT: 'Expressões de tempo comuns: always (sempre), usually (geralmente), often (frequentemente), sometimes (às vezes), never (nunca), every day/week/year (todo dia/semana/ano), on Mondays (nas segundas), at night (à noite), in the morning (de manhã).'
          }
        ],
        vocabulary: [
          { word: 'Work', phonetic: '/wɜːrk/', meaning: 'To do a job or task', meaningPT: 'Trabalhar' },
          { word: 'Study', phonetic: '/ˈstʌdi/', meaning: 'To learn something', meaningPT: 'Estudar' },
          { word: 'Write', phonetic: '/raɪt/', meaning: 'To produce text', meaningPT: 'Escrever' },
          { word: 'Read', phonetic: '/riːd/', meaning: 'To look at and understand text', meaningPT: 'Ler' },
          { word: 'Use', phonetic: '/juːz/', meaning: 'To employ something', meaningPT: 'Usar' },
        ],
        quiz: [
          { q: 'She ___ JavaScript every day.', qt: 'She ___ JavaScript todo dia.', options: ['code', 'codes', 'coding', 'to code'], answer: 1, explanation: 'He/She/It needs -s: "codes".', explanationPT: 'He/She/It precisa de -s: "codes".' },
          { q: 'I ___ like Mondays.', qt: 'I ___ like Mondays.', options: ["doesn't", "don't", "no", "not"], answer: 1, explanation: 'With "I", we use "don\'t" (do not).', explanationPT: 'Com "I", usamos "don\'t" (do not).' },
          { q: '___ she work remotely?', qt: '___ she work remotely?', options: ['Do', 'Does', 'Is', 'Are'], answer: 1, explanation: 'With he/she/it, we use "does" for questions.', explanationPT: 'Com he/she/it, usamos "does" para perguntas.' },
        ]
      }
    },

    // ======== A2 LESSONS ========
    {
      id: 'a2-01', level: 'A2', order: 1, xp: 80, duration: '20 min',
      title: 'Past Simple',
      titlePT: 'Passado Simples',
      description: 'Talk about completed actions in the past.',
      descriptionPT: 'Fale sobre ações concluídas no passado.',
      icon: '⏮️',
      content: {
        sections: [
          {
            type: 'theory',
            title: 'Past Simple — Regular Verbs',
            titlePT: 'Passado Simples — Verbos Regulares',
            text: 'Use the Past Simple for actions that started and finished in the past. Regular verbs add -ed.',
            textPT: 'Use o Passado Simples para ações que começaram e terminaram no passado. Verbos regulares adicionam -ed.',
            formula: ['[Subject]', '+', '[Verb + ed]'],
            examples: [
              { en: 'I worked on a big project yesterday.', pt: 'Eu trabalhei em um grande projeto ontem.' },
              { en: 'She deployed the app last night.', pt: 'Ela fez o deploy do app ontem à noite.' },
              { en: 'We fixed the bug this morning.', pt: 'Nós corrigimos o bug hoje de manhã.' },
            ]
          },
          {
            type: 'theory',
            title: 'Irregular Verbs — The Most Common',
            titlePT: 'Verbos Irregulares — Os Mais Comuns',
            text: 'Many common verbs are irregular — they don\'t follow the -ed rule.',
            textPT: 'Muitos verbos comuns são irregulares — eles não seguem a regra do -ed.',
            irregularList: [
              { base: 'go', past: 'went', pt: 'ir/foi' },
              { base: 'have', past: 'had', pt: 'ter/teve' },
              { base: 'get', past: 'got', pt: 'conseguir/conseguiu' },
              { base: 'make', past: 'made', pt: 'fazer/fez' },
              { base: 'write', past: 'wrote', pt: 'escrever/escreveu' },
              { base: 'find', past: 'found', pt: 'encontrar/encontrou' },
              { base: 'see', past: 'saw', pt: 'ver/viu' },
              { base: 'come', past: 'came', pt: 'vir/veio' },
              { base: 'know', past: 'knew', pt: 'saber/sabia' },
              { base: 'think', past: 'thought', pt: 'pensar/pensou' },
              { base: 'build', past: 'built', pt: 'construir/construiu' },
              { base: 'run', past: 'ran', pt: 'correr/correu' },
            ]
          },
          {
            type: 'theory',
            title: 'Negative & Questions',
            titlePT: 'Negativa e Perguntas',
            text: 'Use "didn\'t" for negatives and "did" for questions. The main verb goes back to base form!',
            textPT: 'Use "didn\'t" para negativas e "did" para perguntas. O verbo principal volta para a forma base!',
            examples: [
              { en: "I didn't push the code yet.", pt: 'Eu não fiz o push do código ainda.' },
              { en: "She didn't find the bug.", pt: 'Ela não encontrou o bug.' },
              { en: "Did you finish the task?", pt: 'Você terminou a tarefa?' },
              { en: "What did he build?", pt: 'O que ele construiu?' },
            ]
          }
        ],
        vocabulary: [
          { word: 'Deploy', phonetic: '/dɪˈplɔɪ/', meaning: 'To release software to a server', meaningPT: 'Publicar/instalar software em servidor' },
          { word: 'Build', phonetic: '/bɪld/', meaning: 'To create or construct', meaningPT: 'Construir/criar' },
          { word: 'Push', phonetic: '/pʊʃ/', meaning: 'To send code to a repository', meaningPT: 'Enviar código para repositório' },
          { word: 'Fix', phonetic: '/fɪks/', meaning: 'To repair or solve a problem', meaningPT: 'Corrigir/resolver' },
          { word: 'Launch', phonetic: '/lɔːntʃ/', meaning: 'To start or release something', meaningPT: 'Lançar/iniciar' },
        ],
        quiz: [
          { q: 'She ___ the code yesterday. (write)', qt: 'She ___ o código ontem. (write)', options: ['write', 'writes', 'wrote', 'writed'], answer: 2, explanation: '"write" is irregular: write → wrote.', explanationPT: '"write" é irregular: write → wrote.' },
          { q: 'I ___ finish the project last week.', qt: 'I ___ terminar o projeto semana passada.', options: ["didn't", "don't", "wasn't", "not"], answer: 0, explanation: '"didn\'t" (did not) is used for past simple negatives with all subjects.', explanationPT: '"didn\'t" (did not) é usado para negativas no passado simples com todos os sujeitos.' },
          { q: '___ you deploy the app this morning?', qt: '___ você fez o deploy do app hoje de manhã?', options: ['Did', 'Do', 'Was', 'Were'], answer: 0, explanation: '"Did" is used to form questions in the past simple.', explanationPT: '"Did" é usado para formar perguntas no passado simples.' },
        ]
      }
    },

    {
      id: 'a2-02', level: 'A2', order: 2, xp: 90, duration: '20 min',
      title: 'Present Continuous',
      titlePT: 'Presente Contínuo',
      description: 'Describe actions happening right now.',
      descriptionPT: 'Descreva ações que estão acontecendo agora.',
      icon: '▶️',
      content: {
        sections: [
          {
            type: 'theory',
            title: 'Present Continuous Structure',
            titlePT: 'Estrutura do Presente Contínuo',
            text: 'The Present Continuous describes actions happening NOW or around now.',
            textPT: 'O Presente Contínuo descreve ações que estão acontecendo AGORA ou por volta de agora.',
            formula: ['[Subject]', '+', 'am/is/are', '+', '[Verb + -ing]'],
            examples: [
              { en: "I'm debugging the code right now.", pt: 'Estou depurando o código agora.' },
              { en: "She's learning English this year.", pt: 'Ela está aprendendo inglês este ano.' },
              { en: "We're working on a new feature.", pt: 'Estamos trabalhando em uma nova funcionalidade.' },
              { en: "They're not responding to my messages.", pt: 'Eles não estão respondendo às minhas mensagens.' },
            ]
          },
          {
            type: 'tips',
            title: 'Present Simple vs Present Continuous',
            tip: 'Present Simple = habits & routines ("I work from home")\nPresent Continuous = right now ("I\'m working right now")\n\nKey words for Continuous: now, right now, at the moment, currently, today, this week.',
            tipPT: 'Presente Simples = hábitos e rotinas ("I work from home" / Trabalho em casa)\nPresente Contínuo = agora ("I\'m working right now" / Estou trabalhando agora)\n\nPalavras-chave para o Contínuo: now (agora), right now (agora mesmo), at the moment (no momento), currently (atualmente), today (hoje), this week (esta semana).'
          }
        ],
        vocabulary: [
          { word: 'Currently', phonetic: '/ˈkɜːrəntli/', meaning: 'At the present time', meaningPT: 'Atualmente' },
          { word: 'Debug', phonetic: '/diːˈbʌɡ/', meaning: 'To find and fix errors in code', meaningPT: 'Depurar/encontrar e corrigir erros' },
          { word: 'Running', phonetic: '/ˈrʌnɪŋ/', meaning: 'Operating / executing', meaningPT: 'Executando/rodando' },
          { word: 'Waiting', phonetic: '/ˈweɪtɪŋ/', meaning: 'Staying until something happens', meaningPT: 'Esperando/aguardando' },
        ],
        quiz: [
          { q: 'She ___ a new app right now. (build)', qt: 'Ela ___ um novo app agora. (build)', options: ['builds', 'built', 'is building', 'building'], answer: 2, explanation: 'Right now = Present Continuous: is + building.', explanationPT: 'Right now (agora) = Presente Contínuo: is + building.' },
          { q: 'I work from home. What does this mean?', qt: 'I work from home. O que isso significa?', options: ['I am at home right now', 'I always/usually work from home', 'I worked from home once', 'I will work from home'], answer: 1, explanation: 'Present Simple = habit/routine, not necessarily happening right now.', explanationPT: 'Presente Simples = hábito/rotina, não necessariamente acontecendo agora.' },
        ]
      }
    },

    // ======== B1 LESSONS ========
    {
      id: 'b1-01', level: 'B1', order: 1, xp: 100, duration: '25 min',
      title: 'Present Perfect',
      titlePT: 'Presente Perfeito',
      description: 'Connect past experiences to the present moment.',
      descriptionPT: 'Conecte experiências passadas ao momento presente.',
      icon: '🔗',
      content: {
        sections: [
          {
            type: 'theory',
            title: 'Present Perfect Structure',
            titlePT: 'Estrutura do Presente Perfeito',
            text: 'The Present Perfect connects a past action to the present. There\'s no specific time mentioned.',
            textPT: 'O Presente Perfeito conecta uma ação passada ao presente. Não há um tempo específico mencionado.',
            formula: ['[Subject]', '+', 'have/has', '+', '[Past Participle]'],
            examples: [
              { en: "I've deployed this app three times.", pt: 'Eu já fiz o deploy deste app três vezes.' },
              { en: "She has never used Vue.js.", pt: 'Ela nunca usou Vue.js.' },
              { en: "Have you ever worked with AWS?", pt: 'Você já trabalhou com AWS?' },
              { en: "I've just finished the pull request.", pt: 'Acabei de terminar o pull request.' },
              { en: "The server hasn't responded yet.", pt: 'O servidor ainda não respondeu.' },
            ]
          },
          {
            type: 'theory',
            title: 'Present Perfect vs. Past Simple',
            titlePT: 'Presente Perfeito vs. Passado Simples',
            text: 'This is one of the most confusing parts for Brazilians! When to use each?',
            textPT: 'Esta é uma das partes mais confusas para brasileiros! Quando usar cada um?',
            examples: [
              { en: 'I worked at Google. (finished, specific past - no connection now)', pt: 'Eu trabalhei no Google. (terminado, passado específico)' },
              { en: "I've worked at Google. (experience you have right now)", pt: 'Eu já trabalhei no Google. (experiência que você tem agora)' },
              { en: "Did you push the code? (specific time in past)", pt: 'Você fez o push do código? (tempo específico no passado)' },
              { en: "Have you pushed the code? (at any time, relevant now)", pt: 'Você já fez o push do código? (em algum momento, relevante agora)' },
            ]
          },
          {
            type: 'tips',
            title: 'Key Words',
            tip: 'Present Perfect keywords: ever, never, already, yet, just, recently, so far, for, since.\n\nPast Simple keywords: yesterday, last week/year, in 2020, ago, when.',
            tipPT: 'Palavras-chave do Presente Perfeito: ever (alguma vez), never (nunca), already (já), yet (ainda), just (acabei de), recently (recentemente), so far (até agora), for (por), since (desde).\n\nPalavras-chave do Passado Simples: yesterday (ontem), last week/year (semana/ano passado), in 2020 (em 2020), ago (atrás), when (quando).'
          }
        ],
        vocabulary: [
          { word: 'Experience', phonetic: '/ɪkˈspɪriəns/', meaning: 'Knowledge gained by doing something', meaningPT: 'Experiência' },
          { word: 'Achieve', phonetic: '/əˈtʃiːv/', meaning: 'To successfully reach a goal', meaningPT: 'Alcançar/conquistar' },
          { word: 'Release', phonetic: '/rɪˈliːs/', meaning: 'To publish/launch a product', meaningPT: 'Lançar/publicar' },
          { word: 'Implement', phonetic: '/ˈɪmplɪment/', meaning: 'To put something into effect', meaningPT: 'Implementar' },
          { word: 'Upgrade', phonetic: '/ˈʌɡreɪd/', meaning: 'To improve to a newer version', meaningPT: 'Atualizar/melhorar' },
        ],
        quiz: [
          { q: 'I ___ never seen this bug before.', qt: 'I ___ never seen this bug before.', options: ['did', 'have', 'had', 'am'], answer: 1, explanation: '"never" signals Present Perfect: have/has + past participle.', explanationPT: '"never" indica Presente Perfeito: have/has + particípio passado.' },
          { q: '___ you ever worked with Docker?', qt: '___ você já trabalhou com Docker?', options: ['Did', 'Do', 'Have', 'Had'], answer: 2, explanation: '"ever" with experience = Present Perfect: "Have you ever...?"', explanationPT: '"ever" com experiência = Presente Perfeito: "Have you ever...?"' },
          { q: 'When would you use: "I worked at Amazon"?', qt: 'Quando você usaria: "I worked at Amazon"?', options: ['When you still work there', 'When it\'s a past experience with no time', 'When you worked there at a specific period in the past, now finished', 'When asking a question'], answer: 2, explanation: 'Past Simple = specific, finished past event with a time reference.', explanationPT: 'Passado Simples = evento passado específico e concluído com referência de tempo.' },
        ]
      }
    },

    // ======== B1-B2 LESSONS ========
    {
      id: 'b1-02', level: 'B1', order: 2, xp: 100, duration: '25 min',
      title: 'Modal Verbs',
      titlePT: 'Verbos Modais',
      description: 'Express ability, possibility, necessity and permission.',
      descriptionPT: 'Expresse habilidade, possibilidade, necessidade e permissão.',
      icon: '🎛️',
      content: {
        sections: [
          {
            type: 'theory',
            title: 'Modal Verbs Overview',
            titlePT: 'Visão Geral dos Verbos Modais',
            text: 'Modal verbs add meaning to the main verb. They never change form and are followed by the base verb (no -s, no -ing).',
            textPT: 'Os verbos modais adicionam significado ao verbo principal. Eles nunca mudam de forma e são seguidos pelo verbo base (sem -s, sem -ing).',
            modalTable: [
              { modal: 'can', use: 'Ability / Possibility', usePT: 'Habilidade / Possibilidade', example: 'I can code in Python.', examplePT: 'Eu sei programar em Python.' },
              { modal: 'could', use: 'Past ability / Polite request', usePT: 'Habilidade passada / Pedido educado', example: 'Could you review my code?', examplePT: 'Você poderia revisar meu código?' },
              { modal: 'should', use: 'Advice / Recommendation', usePT: 'Conselho / Recomendação', example: 'You should test your code.', examplePT: 'Você deveria testar seu código.' },
              { modal: 'must', use: 'Necessity / Strong obligation', usePT: 'Necessidade / Obrigação forte', example: 'You must push to main branch.', examplePT: 'Você deve fazer push para o branch main.' },
              { modal: 'might', use: 'Possibility (less certain)', usePT: 'Possibilidade (menos certo)', example: 'The server might be down.', examplePT: 'O servidor pode estar fora do ar.' },
              { modal: 'would', use: 'Conditional / Polite offers', usePT: 'Condicional / Ofertas educadas', example: "I would use React for this.", examplePT: 'Eu usaria React para isso.' },
              { modal: 'may', use: 'Formal possibility / Permission', usePT: 'Possibilidade formal / Permissão', example: 'May I ask a question?', examplePT: 'Posso fazer uma pergunta?' },
            ]
          },
          {
            type: 'tips',
            title: 'Important!',
            tip: 'Modal verbs NEVER change: not "she cans", "he shoulds" — always the same form.\nAlways followed by BARE INFINITIVE (no "to"): "You should go" NOT "You should to go".',
            tipPT: 'Verbos modais NUNCA mudam: não "she cans", "he shoulds" — sempre a mesma forma.\nSempre seguidos de INFINITIVO BASE (sem "to"): "You should go" NÃO "You should to go".'
          }
        ],
        vocabulary: [
          { word: 'Ability', phonetic: '/əˈbɪlɪti/', meaning: 'The power or skill to do something', meaningPT: 'Habilidade/capacidade' },
          { word: 'Permission', phonetic: '/pəˈmɪʃən/', meaning: 'Being allowed to do something', meaningPT: 'Permissão' },
          { word: 'Obligation', phonetic: '/ˌɒblɪˈɡeɪʃən/', meaning: 'Something you are required to do', meaningPT: 'Obrigação' },
          { word: 'Suggestion', phonetic: '/səˈdʒestʃən/', meaning: 'An idea put forward', meaningPT: 'Sugestão' },
        ],
        quiz: [
          { q: 'You ___ test your code before pushing. (advice)', qt: 'Você ___ testar seu código antes do push. (conselho)', options: ['can', 'should', 'must', 'might'], answer: 1, explanation: '"should" = advice/recommendation.', explanationPT: '"should" = conselho/recomendação.' },
          { q: 'She ___ be working from home today. (possibility)', qt: 'Ela ___ estar trabalhando em casa hoje. (possibilidade)', options: ['should', 'must', 'might', 'would'], answer: 2, explanation: '"might" = uncertain possibility.', explanationPT: '"might" = possibilidade incerta.' },
          { q: 'Which is WRONG?', qt: 'Qual está ERRADO?', options: ['He can code.', 'She should to study.', 'They must push.', 'I might come.'], answer: 1, explanation: 'Never use "to" after modal verbs: "should study" not "should to study".', explanationPT: 'Nunca use "to" após verbos modais: "should study" não "should to study".' },
        ]
      }
    },

    {
      id: 'b2-01', level: 'B2', order: 1, xp: 120, duration: '30 min',
      title: 'Conditionals',
      titlePT: 'Condicionais',
      description: 'Master all 4 conditional types for real and unreal situations.',
      descriptionPT: 'Domine os 4 tipos de condicionais para situações reais e irreais.',
      icon: '🔀',
      content: {
        sections: [
          {
            type: 'theory',
            title: 'Zero Conditional — General Truths',
            titlePT: '0º Condicional — Verdades Gerais',
            text: 'Facts, scientific truths, things that always happen when the condition is met.',
            textPT: 'Fatos, verdades científicas, coisas que sempre acontecem quando a condição é cumprida.',
            formula: ['If + Present Simple', ',', 'Present Simple'],
            examples: [
              { en: 'If you run the code, it compiles.', pt: 'Se você rodar o código, ele compila.' },
              { en: 'If water reaches 100°C, it boils.', pt: 'Se a água atingir 100°C, ela ferve.' },
            ]
          },
          {
            type: 'theory',
            title: '1st Conditional — Real Future',
            titlePT: '1º Condicional — Futuro Real',
            text: 'Real and possible situations in the future.',
            textPT: 'Situações reais e possíveis no futuro.',
            formula: ['If + Present Simple', ',', 'will + Verb'],
            examples: [
              { en: "If you study every day, you'll be fluent.", pt: 'Se você estudar todo dia, você será fluente.' },
              { en: "If the build fails, I'll check the logs.", pt: 'Se o build falhar, eu verei os logs.' },
            ]
          },
          {
            type: 'theory',
            title: '2nd Conditional — Unreal Present/Future',
            titlePT: '2º Condicional — Irreal Presente/Futuro',
            text: 'Hypothetical situations — unlikely or impossible now.',
            textPT: 'Situações hipotéticas — improváveis ou impossíveis agora.',
            formula: ['If + Past Simple', ',', 'would + Verb'],
            examples: [
              { en: "If I were you, I'd use TypeScript.", pt: 'Se eu fosse você, eu usaria TypeScript.' },
              { en: "If I had more time, I would learn Rust.", pt: 'Se eu tivesse mais tempo, aprenderia Rust.' },
            ]
          },
          {
            type: 'theory',
            title: '3rd Conditional — Unreal Past',
            titlePT: '3º Condicional — Irreal Passado',
            text: 'Imagining a different past — regrets, "what if".',
            textPT: 'Imaginando um passado diferente — arrependimentos, "e se".',
            formula: ['If + Past Perfect', ',', 'would have + Past Participle'],
            examples: [
              { en: "If I had studied more, I would have gotten the job.", pt: 'Se eu tivesse estudado mais, teria conseguido o emprego.' },
              { en: "If she had tested it, she would have found the bug.", pt: 'Se ela tivesse testado, teria encontrado o bug.' },
            ]
          }
        ],
        vocabulary: [
          { word: 'Unless', phonetic: '/ənˈles/', meaning: 'Except if / if not', meaningPT: 'A menos que / se não' },
          { word: 'Suppose', phonetic: '/səˈpoʊz/', meaning: 'To imagine or assume', meaningPT: 'Supor/imaginar' },
          { word: 'Imagine', phonetic: '/ɪˈmædʒɪn/', meaning: 'To form a mental picture', meaningPT: 'Imaginar' },
          { word: 'Otherwise', phonetic: '/ˈʌðərwaɪz/', meaning: 'In different circumstances', meaningPT: 'Caso contrário/de outra forma' },
        ],
        quiz: [
          { q: 'If she ___ more, she would speak English better.', qt: 'Se ela ___ mais, ela falaria inglês melhor.', options: ['practices', 'practiced', 'will practice', 'had practiced'], answer: 1, explanation: '2nd Conditional: If + Past Simple. "If she practiced more (now), she would..."', explanationPT: '2º Condicional: If + Passado Simples. "Se ela praticasse mais (agora), ela..."' },
          { q: 'If it rains, ___ stay inside.', qt: 'Se chover, ___ ficar dentro de casa.', options: ["I'll", "I'd", "I would", "I had"], answer: 0, explanation: '1st Conditional (real future): If + Present → will.', explanationPT: '1º Condicional (futuro real): If + Presente → will.' },
        ]
      }
    },

    // ======== C1 LESSONS ========
    {
      id: 'c1-01', level: 'C1', order: 1, xp: 150, duration: '35 min',
      title: 'Passive Voice',
      titlePT: 'Voz Passiva',
      description: 'Use passive constructions to change emphasis in professional writing.',
      descriptionPT: 'Use construções passivas para mudar ênfase na escrita profissional.',
      icon: '🔄',
      content: {
        sections: [
          {
            type: 'theory',
            title: 'When & Why We Use Passive',
            titlePT: 'Quando e Por Que Usamos o Passivo',
            text: 'We use passive when: (1) the action is more important than who does it, (2) we don\'t know who did it, or (3) to sound more formal/professional.',
            textPT: 'Usamos o passivo quando: (1) a ação é mais importante do que quem a faz, (2) não sabemos quem fez, ou (3) para soar mais formal/profissional.',
            formula: ['[Subject]', '+', 'be + Past Participle', '(+', 'by + agent', ')'],
            examples: [
              { en: 'The bug was fixed by the senior dev.', pt: 'O bug foi corrigido pelo desenvolvedor sênior.' },
              { en: 'The code is reviewed every week.', pt: 'O código é revisado toda semana.' },
              { en: 'The app will be deployed tomorrow.', pt: 'O app será publicado amanhã.' },
              { en: 'The server has been updated.', pt: 'O servidor foi atualizado.' },
              { en: 'The database was being migrated.', pt: 'O banco de dados estava sendo migrado.' },
            ]
          },
          {
            type: 'tips',
            title: 'Tech Writing Tip',
            tip: 'Passive voice is very common in technical writing, documentation, and formal reports. "The function returns a boolean" (active) vs "A boolean is returned by the function" (passive — more formal).',
            tipPT: 'A voz passiva é muito comum na escrita técnica, documentação e relatórios formais. "The function returns a boolean" (ativo) vs "A boolean is returned by the function" (passivo — mais formal).'
          }
        ],
        vocabulary: [
          { word: 'Implement', phonetic: '/ˈɪmplɪment/', meaning: 'To put into effect; to code a feature', meaningPT: 'Implementar' },
          { word: 'Maintain', phonetic: '/meɪnˈteɪn/', meaning: 'To keep in working condition', meaningPT: 'Manter' },
          { word: 'Document', phonetic: '/ˈdɒkjʊment/', meaning: 'To write official records', meaningPT: 'Documentar' },
          { word: 'Configure', phonetic: '/kənˈfɪɡjər/', meaning: 'To set up for a specific purpose', meaningPT: 'Configurar' },
        ],
        quiz: [
          { q: 'The code ___ (review) every Monday.', qt: 'O código ___ (review) toda segunda-feira.', options: ['reviews', 'is reviewed', 'reviewed', 'reviewing'], answer: 1, explanation: 'Passive: is + past participle (reviewed).', explanationPT: 'Passivo: is + particípio passado (reviewed).' },
          { q: 'Which is PASSIVE?', qt: 'Qual é a VOZ PASSIVA?', options: ['The team fixed the bug.', 'The bug was fixed.', 'The team is fixing the bug.', 'Fixing the bug took hours.'], answer: 1, explanation: '"was fixed" = passive voice (be + past participle, no specific agent stated).', explanationPT: '"was fixed" = voz passiva (be + particípio passado, sem agente específico).' },
        ]
      }
    },
  ],

  // Word of the day pool
  wordOfDay: [
    { word: 'Proficient', phonetic: '/prəˈfɪʃənt/', pos: 'adjective', meaning: 'Competent or skilled in doing something', meaningPT: 'Proficiente/habilidoso', example: 'She is proficient in three programming languages.', examplePT: 'Ela é proficiente em três linguagens de programação.' },
    { word: 'Leverage', phonetic: '/ˈlevərɪdʒ/', pos: 'verb', meaning: 'To use something to maximum advantage', meaningPT: 'Alavancar/aproveitar ao máximo', example: "We should leverage our existing API.", examplePT: 'Devemos aproveitar nossa API existente.' },
    { word: 'Iterate', phonetic: '/ˈɪtəreɪt/', pos: 'verb', meaning: 'To repeat a process or improve in cycles', meaningPT: 'Iterar/repetir em ciclos', example: "We iterate on the product every sprint.", examplePT: 'Iteramos no produto a cada sprint.' },
    { word: 'Robust', phonetic: '/roʊˈbʌst/', pos: 'adjective', meaning: 'Strong and unlikely to fail', meaningPT: 'Robusto/sólido', example: "We need a robust testing strategy.", examplePT: 'Precisamos de uma estratégia de testes robusta.' },
    { word: 'Streamline', phonetic: '/ˈstriːmlaɪn/', pos: 'verb', meaning: 'To make more efficient by simplifying', meaningPT: 'Simplificar/otimizar processo', example: "Let's streamline the onboarding process.", examplePT: "Vamos simplificar o processo de onboarding." },
    { word: 'Scalable', phonetic: '/ˈskeɪləbəl/', pos: 'adjective', meaning: 'Able to grow and handle more load', meaningPT: 'Escalável', example: "The architecture must be scalable.", examplePT: 'A arquitetura deve ser escalável.' },
    { word: 'Deadline', phonetic: '/ˈdedlaɪn/', pos: 'noun', meaning: 'The latest time something must be done', meaningPT: 'Prazo/data limite', example: "The deadline for this feature is Friday.", examplePT: 'O prazo para esta funcionalidade é sexta-feira.' },
    { word: 'Collaborate', phonetic: '/kəˈlæbəreɪt/', pos: 'verb', meaning: 'To work together with others', meaningPT: 'Colaborar', example: "We collaborate with teams across the globe.", examplePT: 'Colaboramos com equipes ao redor do mundo.' },
    { word: 'Troubleshoot', phonetic: '/ˈtrʌbəlʃuːt/', pos: 'verb', meaning: 'To identify and fix problems', meaningPT: 'Solucionar problemas', example: "Can you troubleshoot this network issue?", examplePT: 'Você pode solucionar este problema de rede?' },
    { word: 'Seamless', phonetic: '/ˈsiːmləs/', pos: 'adjective', meaning: 'Smooth and without any problems', meaningPT: 'Perfeito/sem falhas', example: "We want a seamless user experience.", examplePT: 'Queremos uma experiência do usuário perfeita.' },
    { word: 'Milestone', phonetic: '/ˈmaɪlstoʊn/', pos: 'noun', meaning: 'An important event or stage in development', meaningPT: 'Marco/etapa importante', example: "Shipping v2.0 was a major milestone.", examplePT: 'Lançar a v2.0 foi um grande marco.' },
    { word: 'Bandwidth', phonetic: '/ˈbændwɪdθ/', pos: 'noun', meaning: 'Capacity to process/handle something (also used metaphorically)', meaningPT: 'Largura de banda / capacidade (também metáfora para tempo/energia)', example: "I don't have the bandwidth to take on more tasks.", examplePT: 'Não tenho capacidade para assumir mais tarefas.' },
  ]
};
