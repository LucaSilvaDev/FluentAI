const Lessons = (() => {
  let currentFilter = 'all';

  const init = () => {
    renderFilterPills();
    renderLessons();
  };

  const renderFilterPills = () => {
    const container = document.getElementById('lessonLevelFilter');
    if (!container) return;
    const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    container.innerHTML = levels.map(l => `
      <button class="filter-pill ${l === 'all' ? 'active' : ''}" onclick="Lessons.filterBy('${l}', this)">
        ${l === 'all' ? (I18n.getCurrent() === 'pt' ? 'Todos' : 'All') : l}
      </button>
    `).join('');
  };

  const filterBy = (level, btn) => {
    currentFilter = level;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    renderLessons();
  };

  const renderLessons = () => {
    const container = document.getElementById('lessonsContent');
    if (!container) return;
    const progress = Progress.get();
    const levels = currentFilter === 'all' ? ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] : [currentFilter];
    const lang = I18n.getCurrent();
    let html = '';

    levels.forEach(level => {
      const levelLessons = CURRICULUM.lessons.filter(l => l.level === level);
      if (!levelLessons.length) return;
      const info = CURRICULUM.levels[level];
      html += `
        <div class="lesson-section-title">
          <span class="lesson-level-tag" style="background:${info.color}">${level}</span>
          <span>${lang === 'pt' ? info.namePT : info.name}</span>
        </div>
        <div class="lesson-grid">
          ${levelLessons.map(lesson => renderLessonCard(lesson, progress, lang)).join('')}
        </div>
      `;
    });

    if (!html) {
      html = `<div class="empty-state">
        <i class="fa-solid fa-book"></i>
        <h4>${lang === 'pt' ? 'Nenhuma aula neste nível ainda' : 'No lessons at this level yet'}</h4>
        <p>${lang === 'pt' ? 'Mais aulas chegando em breve!' : 'More lessons coming soon!'}</p>
      </div>`;
    }

    container.innerHTML = html;

    gsap?.from('.lesson-card', {
      opacity: 0, y: 24, stagger: 0.05, duration: 0.4, ease: 'power2.out'
    });
  };

  const renderLessonCard = (lesson, progress, lang) => {
    const isCompleted = progress.lessonsCompleted.includes(lesson.id);
    const isLocked = isLessonLocked(lesson, progress);
    const statusIcon = isCompleted
      ? '<i class="fa-solid fa-circle-check lesson-status-icon completed"></i>'
      : isLocked
      ? '<i class="fa-solid fa-lock lesson-status-icon locked"></i>'
      : '<i class="fa-solid fa-circle-play lesson-status-icon in-progress"></i>';

    return `
      <div class="glass-card lesson-card glass-shine ${isLocked ? 'locked-card' : ''}"
           onclick="${isLocked ? 'Lessons.showLockedMessage()' : `Lessons.open('${lesson.id}')`}"
           style="${isLocked ? 'opacity:0.6;cursor:not-allowed' : ''}">
        <div class="lesson-card-top">
          <span class="lesson-level-tag">${lesson.level}</span>
          ${statusIcon}
        </div>
        <div style="font-size:28px;margin-bottom:8px">${lesson.icon}</div>
        <h4>${lang === 'pt' ? lesson.titlePT : lesson.title}</h4>
        <p>${lang === 'pt' ? lesson.descriptionPT : lesson.description}</p>
        <div class="lesson-card-footer">
          <span class="lesson-xp-tag">+${lesson.xp} XP</span>
          <span class="lesson-duration"><i class="fa-regular fa-clock"></i> ${lesson.duration}</span>
        </div>
        ${isCompleted ? '<div style="position:absolute;inset:0;border-radius:var(--border-radius);background:rgba(16,185,129,0.03);pointer-events:none;border:1px solid rgba(16,185,129,0.15)"></div>' : ''}
      </div>
    `;
  };

  const isLessonLocked = (lesson, progress) => {
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const userLevelIdx = levelOrder.indexOf(progress.level);
    const lessonLevelIdx = levelOrder.indexOf(lesson.level);
    return lessonLevelIdx > userLevelIdx + 1;
  };

  const showLockedMessage = () => {
    const lang = I18n.getCurrent();
    Progress.toast(
      lang === 'pt' ? 'Complete mais aulas para desbloquear este nível!' : 'Complete more lessons to unlock this level!',
      'warning'
    );
  };

  const open = (lessonId) => {
    const lesson = CURRICULUM.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    App.navigate('lesson-viewer');
    renderLessonViewer(lesson);
  };

  const renderLessonViewer = (lesson) => {
    const container = document.getElementById('lessonViewerContent');
    if (!container) return;
    const lang = I18n.getCurrent();
    const title = lang === 'pt' ? lesson.titlePT : lesson.title;
    const isCompleted = Progress.get().lessonsCompleted.includes(lesson.id);

    let html = `
      <div class="lesson-viewer">
        <div class="lesson-viewer-header">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <span style="font-size:40px">${lesson.icon}</span>
            <span class="lesson-level-tag">${lesson.level}</span>
            ${isCompleted ? '<span class="tag tag-green"><i class="fa-solid fa-check"></i> Completed</span>' : ''}
          </div>
          <h1>${title}</h1>
          <div class="lesson-viewer-meta">
            <span><i class="fa-regular fa-clock"></i> ${lesson.duration}</span>
            <span><i class="fa-solid fa-star"></i> ${lesson.xp} XP</span>
          </div>
        </div>
    `;

    // Render theory sections
    lesson.content.sections.forEach(section => {
      html += `<div class="glass-card lesson-section">`;
      if (section.type === 'theory') {
        html += `<h2>${lang === 'pt' ? (section.titlePT || section.title) : section.title}</h2>`;
        html += `<p>${lang === 'pt' ? (section.textPT || section.text) : section.text}</p>`;
        if (section.formula) {
          html += `<div class="grammar-formula">${section.formula.map(p =>
            p.startsWith('+') || p.startsWith('/') || p === ',' || p === '?' ? `<span class="formula-sep">${p}</span>` :
            `<span class="formula-part">${p}</span>`
          ).join('')}</div>`;
        }
        if (section.table) {
          html += renderTable(section.table);
        }
        if (section.irregularList) {
          html += renderIrregularList(section.irregularList, lang);
        }
        if (section.modalTable) {
          html += renderModalTable(section.modalTable, lang);
        }
        if (section.examples) {
          section.examples.forEach(ex => {
            html += `<div class="example-box">
              <div class="example-en">${ex.en.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--accent-cyan)">$1</strong>')}</div>
              <div class="example-pt">${ex.pt}</div>
            </div>`;
          });
        }
      } else if (section.type === 'tips') {
        const tipText = lang === 'pt' ? (section.tipPT || section.tip) : section.tip;
        html += `<div class="tip-box"><strong>💡 ${lang === 'pt' ? (section.titlePT || section.title) : section.title}</strong>
          <p>${tipText.replace(/\n/g, '<br>')}</p></div>`;
      }
      html += `</div>`;
    });

    // Vocabulary section
    if (lesson.content.vocabulary?.length) {
      html += `<div class="glass-card lesson-section">
        <h2>${lang === 'pt' ? '📚 Vocabulário da Aula' : '📚 Lesson Vocabulary'}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
          ${lesson.content.vocabulary.map(v => `
            <div class="glass-card" style="padding:16px;cursor:pointer" onclick="Speech.speak('${v.word}')">
              <div style="font-size:18px;font-weight:700;color:var(--accent-cyan);margin-bottom:2px">${v.word}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">${v.phonetic}</div>
              <div style="font-size:13px;color:var(--text-secondary)">${lang === 'pt' ? v.meaningPT : v.meaning}</div>
            </div>
          `).join('')}
        </div>
      </div>`;
    }

    // Quiz button
    html += `
      <div class="lesson-nav-buttons">
        <button class="btn-secondary" onclick="App.navigate('lessons')">
          <i class="fa-solid fa-arrow-left"></i> Back to lessons
        </button>
        <button class="btn-primary" onclick="Lessons.startQuiz('${lesson.id}')" style="width:auto">
          <i class="fa-solid fa-pen-to-square"></i>
          ${lang === 'pt' ? 'Fazer Quiz (+' + lesson.xp + ' XP)' : 'Take Quiz (+' + lesson.xp + ' XP)'}
        </button>
      </div>
    `;

    html += `</div>`; // .lesson-viewer
    container.innerHTML = html;

    gsap?.from('.lesson-section', {
      opacity: 0, y: 20, stagger: 0.08, duration: 0.5, ease: 'power2.out'
    });
  };

  const renderTable = (table) => {
    return `<div style="overflow-x:auto;margin-top:16px">
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr>${table.headers.map(h => `<th style="padding:10px 14px;text-align:left;border-bottom:1px solid var(--glass-border);color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${table.rows.map((row, i) => `
            <tr style="${i % 2 === 0 ? 'background:rgba(255,255,255,0.02)' : ''}">
              ${row.map((cell, j) => `<td style="padding:10px 14px;border-bottom:1px solid var(--glass-border);${j === 0 ? 'font-weight:700;color:var(--accent-cyan)' : j === 2 ? 'color:var(--accent-green)' : j === 3 ? 'color:var(--accent-pink)' : ''}">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
  };

  const renderIrregularList = (list, lang) => {
    return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-top:16px">
      ${list.map(v => `
        <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px">
          <span style="font-weight:700;color:var(--accent-cyan);min-width:48px">${v.base}</span>
          <span style="color:var(--text-muted)">→</span>
          <span style="font-weight:600;color:var(--accent-green)">${v.past}</span>
          ${lang === 'pt' ? `<span style="font-size:11px;color:var(--text-muted)">(${v.pt})</span>` : ''}
        </div>
      `).join('')}
    </div>`;
  };

  const renderModalTable = (list, lang) => {
    return `<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">
      ${list.map(m => `
        <div class="glass-card" style="padding:14px 18px;display:flex;gap:16px;align-items:flex-start">
          <span style="font-family:monospace;font-weight:800;color:var(--accent-purple);min-width:80px;font-size:15px">${m.modal}</span>
          <div style="flex:1">
            <span style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px">${lang === 'pt' ? m.usePT : m.use}</span>
            <span style="font-size:14px;font-style:italic;color:var(--text-secondary)">"${m.example}"</span>
            ${lang === 'pt' ? `<span style="font-size:12px;color:var(--text-muted);display:block">→ ${m.examplePT}</span>` : ''}
          </div>
        </div>
      `).join('')}
    </div>`;
  };

  const startQuiz = (lessonId) => {
    const lesson = CURRICULUM.lessons.find(l => l.id === lessonId);
    if (!lesson?.content?.quiz?.length) {
      Progress.toast('No quiz for this lesson yet.', 'info');
      return;
    }
    Exercises.runLessonQuiz(lesson);
    App.navigate('exercises');
  };

  return { init, filterBy, open, renderLessonViewer, startQuiz, showLockedMessage };
})();
