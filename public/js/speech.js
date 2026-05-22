const Speech = (() => {
  let recognition = null;
  let isListening = false;
  let synthesis = window.speechSynthesis;

  const isSupported = () => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  const isSynthSupported = () => 'speechSynthesis' in window;

  const speak = (text, lang = 'en-US', rate = 0.9) => {
    if (!isSynthSupported()) return;
    synthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = rate;
    utt.pitch = 1;
    const voices = synthesis.getVoices();
    const preferred = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
      || voices.find(v => v.lang === 'en-US')
      || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utt.voice = preferred;
    synthesis.speak(utt);
  };

  const speakSlow = (text) => speak(text, 'en-US', 0.6);

  const startListening = (onResult, onEnd, options = {}) => {
    if (!isSupported()) {
      Progress.toast('Speech recognition not supported. Use Chrome!', 'warning');
      return;
    }
    if (isListening) { stopListening(); return; }
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.lang = options.lang || 'en-US';
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interim !== false;
    isListening = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      const isFinal = event.results[event.results.length - 1].isFinal;
      onResult(transcript, isFinal);
    };
    recognition.onend = () => { isListening = false; if (onEnd) onEnd(); };
    recognition.onerror = (event) => {
      isListening = false;
      if (event.error !== 'no-speech') Progress.toast(`Mic error: ${event.error}`, 'error');
      if (onEnd) onEnd();
    };
    recognition.start();
  };

  const stopListening = () => {
    if (recognition && isListening) { recognition.stop(); isListening = false; }
  };

  const toggleChatSpeech = () => {
    const btn = document.getElementById('chatMicBtn');
    const input = document.getElementById('chatInput');
    if (!btn || !input) return;
    if (isListening) {
      stopListening();
      btn.style.color = '';
      btn.querySelector('i').className = 'fa-solid fa-microphone';
      return;
    }
    btn.style.color = '#EC4899';
    btn.querySelector('i').className = 'fa-solid fa-microphone-slash';
    startListening(
      (text) => { input.value = text; Chat.autoResize(input); },
      () => { btn.style.color = ''; btn.querySelector('i').className = 'fa-solid fa-microphone'; }
    );
  };

  // ── SENTENCES BY LEVEL ──
  const SENTENCES = {
    A1: [
      { en: 'My name is Lucas and I am a developer.', pt: 'Meu nome é Lucas e sou desenvolvedor.' },
      { en: 'I am from Brazil.', pt: 'Eu sou do Brasil.' },
      { en: 'Nice to meet you!', pt: 'Prazer em te conhecer!' },
      { en: 'I work with computers every day.', pt: 'Trabalho com computadores todo dia.' },
      { en: 'Can you help me, please?', pt: 'Você pode me ajudar, por favor?' },
      { en: 'I speak Portuguese and a little English.', pt: 'Falo português e um pouco de inglês.' },
      { en: 'Good morning! How are you?', pt: 'Bom dia! Como você está?' },
      { en: 'Thank you very much!', pt: 'Muito obrigado!' },
    ],
    A2: [
      { en: 'I am a web developer from Brazil.', pt: 'Sou desenvolvedor web do Brasil.' },
      { en: 'I work from home three days a week.', pt: 'Trabalho em casa três dias por semana.' },
      { en: 'The meeting starts at two o\'clock.', pt: 'A reunião começa às duas horas.' },
      { en: 'I have been learning English for six months.', pt: 'Estou aprendendo inglês há seis meses.' },
      { en: 'Can you send me the file by email?', pt: 'Você pode me enviar o arquivo por email?' },
      { en: 'I don\'t understand. Could you repeat that?', pt: 'Não entendi. Você pode repetir?' },
      { en: 'The project deadline is next Friday.', pt: 'O prazo do projeto é sexta-feira.' },
      { en: 'I am working on a new feature right now.', pt: 'Estou trabalhando em uma nova funcionalidade agora.' },
    ],
    B1: [
      { en: 'Could you please review my pull request?', pt: 'Você poderia revisar meu pull request?' },
      { en: 'I would like to schedule a meeting for tomorrow.', pt: 'Gostaria de agendar uma reunião para amanhã.' },
      { en: 'The deployment was successful and all tests passed.', pt: 'O deploy foi bem-sucedido e todos os testes passaram.' },
      { en: 'If you have any questions, feel free to ask.', pt: 'Se tiver dúvidas, sinta-se à vontade para perguntar.' },
      { en: 'We should optimize these database queries for better performance.', pt: 'Devemos otimizar essas consultas ao banco de dados.' },
      { en: 'I have been working on this bug for the past two days.', pt: 'Tenho trabalhado nesse bug pelos últimos dois dias.' },
      { en: 'The new version introduces several breaking changes.', pt: 'A nova versão introduz várias mudanças incompatíveis.' },
      { en: 'I am blocked on this task. Could someone help me?', pt: 'Estou travado nessa tarefa. Alguém pode me ajudar?' },
    ],
    B2: [
      { en: 'I would like to propose a refactoring of the authentication module.', pt: 'Gostaria de propor uma refatoração do módulo de autenticação.' },
      { en: 'Could you elaborate on the technical requirements for this sprint?', pt: 'Você poderia detalhar os requisitos técnicos para este sprint?' },
      { en: 'We need to ensure backward compatibility when updating the API.', pt: 'Precisamos garantir compatibilidade retroativa ao atualizar a API.' },
      { en: 'The code review revealed some performance bottlenecks that need addressing.', pt: 'A revisão de código revelou gargalos de desempenho que precisam ser resolvidos.' },
      { en: 'I\'d appreciate your feedback on my implementation approach.', pt: 'Gostaria do seu feedback sobre minha abordagem de implementação.' },
      { en: 'The stakeholders have approved the new architecture proposal.', pt: 'Os stakeholders aprovaram a nova proposta de arquitetura.' },
    ],
    C1: [
      { en: 'The microservices architecture significantly improves scalability, though it introduces considerable operational overhead.', pt: 'A arquitetura de microsserviços melhora significativamente a escalabilidade, embora introduza considerável sobrecarga operacional.' },
      { en: 'I\'d like to advocate for a more rigorous code review process to mitigate technical debt accumulation.', pt: 'Gostaria de defender um processo de revisão de código mais rigoroso para mitigar o acúmulo de dívida técnica.' },
      { en: 'Could we schedule a post-mortem to discuss the root causes of last week\'s production incident?', pt: 'Poderíamos agendar um post-mortem para discutir as causas raiz do incidente de produção da semana passada?' },
      { en: 'The proposed solution trades off readability for performance, which may not be the right tradeoff at this stage.', pt: 'A solução proposta troca legibilidade por desempenho, o que pode não ser a troca certa neste momento.' },
      { en: 'I\'ve benchmarked three approaches and the results are somewhat counterintuitive.', pt: 'Avaliei três abordagens e os resultados são um pouco contraintuitivos.' },
      { en: 'We should establish clearer ownership boundaries between teams to avoid ambiguity going forward.', pt: 'Devemos estabelecer limites de responsabilidade mais claros entre as equipes para evitar ambiguidade.' },
    ],
    C2: [
      { en: 'The distributed consensus algorithm draws heavily on the Raft protocol, though we\'ve made pragmatic trade-offs to accommodate our latency requirements.', pt: 'O algoritmo de consenso distribuído se baseia fortemente no protocolo Raft, embora tenhamos feito concessões pragmáticas para atender aos requisitos de latência.' },
      { en: 'I\'d argue that the premature optimization here is obscuring the code\'s intent, and we\'d be better served by profiling before committing to this approach.', pt: 'Eu diria que a otimização prematura está obscurecendo a intenção do código, e seria melhor fazermos profiling antes de nos comprometer com essa abordagem.' },
      { en: 'The inherent tension between developer ergonomics and runtime efficiency is something we\'ll need to navigate carefully as the codebase scales.', pt: 'A tensão entre ergonomia do desenvolvedor e eficiência em tempo de execução é algo que precisaremos navegar cuidadosamente conforme o código cresce.' },
      { en: 'Coupling the data layer this tightly to the presentation layer will make this system very difficult to test and evolve independently.', pt: 'Acoplar a camada de dados tão firmemente à camada de apresentação vai tornar muito difícil testar e evoluir este sistema de forma independente.' },
      { en: 'While I appreciate the elegance of this solution, I\'m concerned it relies on implementation details not guaranteed by the spec.', pt: 'Embora aprecie a elegância desta solução, estou preocupado que ela dependa de detalhes de implementação não garantidos pela especificação.' },
    ],
  };

  const init = () => {
    if (isSynthSupported()) {
      synthesis.getVoices();
      synthesis.onvoiceschanged = () => synthesis.getVoices();
    }
    initSpeakingPage();
  };

  const initSpeakingPage = () => {
    const container = document.getElementById('speakingContent');
    if (!container) return;

    const userLevel = Progress.get().level || 'A2';
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const levelIdx = levelOrder.indexOf(userLevel);
    const bestLevel = levelOrder[levelIdx]; // use the actual user level now
    const availableLevels = levelOrder.slice(0, Math.min(levelIdx + 2, levelOrder.length));

    let currentLevel = bestLevel;
    let sentences = [...(SENTENCES[currentLevel] || SENTENCES.B1)];
    let currentIdx = 0;
    let userTranscript = '';

    const switchLevel = (level) => {
      currentLevel = level;
      sentences = [...(SENTENCES[level] || SENTENCES.B1)];
      currentIdx = 0;
      renderSentence();
    };

    const renderLevelTabs = () => availableLevels.map(l => `
      <button class="helper-pill ${l === currentLevel ? 'active' : ''}"
        style="${l === currentLevel ? 'background:var(--accent-blue);color:white' : ''}"
        onclick="window._switchSpeakLevel('${l}')">${l}</button>
    `).join('');

    const renderSentence = () => {
      const s = sentences[currentIdx];
      container.innerHTML = `
        <div class="speaking-grid">
          <div class="glass-card pronunciation-area">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
              <div style="display:flex;gap:6px">${renderLevelTabs()}</div>
              <span class="tag tag-blue">${currentIdx + 1} / ${sentences.length}</span>
            </div>

            <p class="target-sentence" id="speakTarget">${s.en}</p>
            <p class="target-translation">${s.pt}</p>

            <div style="display:flex;gap:12px;justify-content:center;margin-bottom:24px">
              <button class="btn-secondary" onclick="Speech.speak('${s.en.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-volume-high"></i> Listen
              </button>
              <button class="btn-secondary" onclick="Speech.speakSlow('${s.en.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-gauge-simple-low"></i> Slow
              </button>
            </div>

            <button class="mic-button" id="speakMicBtn" onclick="window._toggleSpeakMic()">
              <i class="fa-solid fa-microphone"></i>
            </button>
            <p class="speech-status" id="speechStatus">Tap the mic to speak</p>
            <div id="userSaid" style="min-height:32px;font-size:16px;color:var(--text-secondary);margin-top:12px;padding:12px;background:var(--glass-bg);border-radius:10px;display:none"></div>
            <div id="pronunciationScore" style="display:none;margin-top:16px"></div>
          </div>

          <div class="glass-card" style="padding:28px">
            <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">
              <i class="fa-solid fa-lightbulb" style="color:var(--accent-orange)"></i> Pronunciation Tips
            </h3>
            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">
              <div class="tip-box"><strong>TH Sound</strong><p>Tongue between teeth for "the", "this", "that", "three". Brazilians often say "d" or "f" — avoid it!</p></div>
              <div class="tip-box"><strong>R Sound</strong><p>Don't roll the "r" like in Portuguese! English "r" is softer — almost like a vowel. Try "car", "work", "here".</p></div>
              <div class="tip-box"><strong>Word Stress</strong><p>Stress the right syllable: de-VE-lop-er, im-PLE-ment, re-QUIRE-ment, con-FIG-ure.</p></div>
              <div class="tip-box"><strong>Linking Words</strong><p>In natural speech, words connect: "I am" → "I'm", "want to" → "wanna", "going to" → "gonna".</p></div>
            </div>
            <div style="display:flex;justify-content:space-between;gap:8px">
              <button class="btn-secondary" style="flex:1" onclick="window._prevSentence()" ${currentIdx === 0 ? 'disabled' : ''}>
                ← Previous
              </button>
              <button class="btn-secondary" style="flex:1" onclick="window._nextSentence()">
                Next →
              </button>
            </div>
            <button class="btn-primary" style="margin-top:10px" onclick="window._askAIToExplain()">
              <i class="fa-solid fa-robot"></i> Ask AI to explain this sentence
            </button>
          </div>
        </div>
      `;
    };

    // ── REAL GEMINI PRONUNCIATION FEEDBACK ──
    const evaluatePronunciation = async (target, spoken) => {
      const scoreEl = document.getElementById('pronunciationScore');
      const statusEl = document.getElementById('speechStatus');
      if (!scoreEl) return;

      scoreEl.style.display = 'block';
      scoreEl.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--glass-bg);border-radius:10px">
        <div class="spinner" style="width:20px;height:20px;flex-shrink:0"></div>
        <span style="color:var(--text-muted);font-size:14px">Analyzing your pronunciation with AI...</span>
      </div>`;

      try {
        const res = await fetch('/api/pronunciation-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spokenText: spoken, targetText: target })
        });
        const data = await res.json();

        const score = data.score || 0;
        const color = score >= 80 ? 'var(--accent-green)' : score >= 55 ? 'var(--accent-orange)' : 'var(--accent-pink)';
        const emoji = score >= 80 ? '🎉' : score >= 55 ? '👍' : '💪';

        scoreEl.innerHTML = `
          <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:12px;padding:20px;margin-top:8px">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
              <div class="score-circle" style="color:${color};border-color:${color};font-size:22px;font-weight:800">${score}%</div>
              <div>
                <strong style="display:block;margin-bottom:4px;font-size:16px">${emoji} ${data.feedback || 'Keep practicing!'}</strong>
                <small style="color:var(--text-muted)">You said: <em>"${spoken}"</em></small>
              </div>
            </div>
            ${data.feedbackPT ? `<p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;padding:10px;background:rgba(139,92,246,0.08);border-radius:8px">🇧🇷 ${data.feedbackPT}</p>` : ''}
            ${data.tips && data.tips.length ? `
              <div style="margin-top:8px">
                <strong style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Tips</strong>
                <ul style="margin:8px 0 0;padding-left:18px;color:var(--text-secondary);font-size:13px">
                  ${data.tips.map(t => `<li style="margin-bottom:4px">${t}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `;

        if (score >= 70) { Progress.addXP(10); Progress.playSound('correct'); }
        else if (score >= 40) { Progress.addXP(5); }
        if (statusEl) statusEl.textContent = score >= 70 ? '✅ Great! Try the next one.' : '🔄 Try again or move on';
      } catch {
        // Fallback to simple word matching if API fails
        const targetWords = target.toLowerCase().replace(/[^a-z\s]/g, '').split(' ');
        const spokenWords = spoken.toLowerCase().replace(/[^a-z\s]/g, '').split(' ');
        const matches = spokenWords.filter(w => targetWords.includes(w)).length;
        const score = Math.round((matches / targetWords.length) * 100);
        scoreEl.innerHTML = `<div style="padding:12px;background:var(--glass-bg);border-radius:10px">
          <strong>${score >= 70 ? '✅ Good!' : '🔄 Keep trying!'}</strong>
          <span style="margin-left:8px;font-size:18px;font-weight:700;color:var(--accent-blue)">${score}%</span>
          <p style="font-size:12px;color:var(--text-muted);margin-top:4px">You said: "${spoken}"</p>
        </div>`;
        if (score >= 70) Progress.addXP(10);
      }
    };

    window._toggleSpeakMic = () => {
      const btn = document.getElementById('speakMicBtn');
      const status = document.getElementById('speechStatus');
      const userEl = document.getElementById('userSaid');
      const scoreEl = document.getElementById('pronunciationScore');
      if (isListening) { stopListening(); btn.classList.remove('recording'); status.textContent = 'Tap the mic to speak'; return; }
      if (scoreEl) scoreEl.style.display = 'none';
      btn.classList.add('recording');
      status.textContent = '🎙️ Listening… speak clearly!';
      userEl.style.display = 'block';
      userEl.textContent = '…';
      const s = sentences[currentIdx];
      startListening(
        (text, isFinal) => {
          userTranscript = text;
          userEl.textContent = `"${text}"`;
          if (isFinal) { evaluatePronunciation(s.en, text); }
        },
        () => { btn.classList.remove('recording'); status.textContent = 'Tap the mic to speak'; }
      );
    };

    window._nextSentence = () => {
      if (currentIdx < sentences.length - 1) { currentIdx++; renderSentence(); }
    };
    window._prevSentence = () => {
      if (currentIdx > 0) { currentIdx--; renderSentence(); }
    };
    window._switchSpeakLevel = (level) => switchLevel(level);
    window._askAIToExplain = () => {
      const s = sentences[currentIdx];
      Chat.quickSend(`Explain this sentence and help me pronounce it correctly: "${s.en}". I'm Brazilian, so focus on sounds that are difficult for Portuguese speakers.`);
      App.navigate('chat');
    };

    renderSentence();
  };

  return { speak, speakSlow, startListening, stopListening, toggleChatSpeech, init, isListening: () => isListening };
})();
