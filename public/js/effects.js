const Effects = (() => {

  // ── SCRAMBLE TEXT ──
  // Randomizes characters then resolves to final text (landonorris.com style)
  const scramble = (el, finalText, duration = 900) => {
    if (!el) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*';
    const totalFrames = Math.ceil(duration / 30);
    let frame = 0;
    const timer = setInterval(() => {
      const progress = frame / totalFrames;
      el.textContent = finalText.split('').map((char, i) => {
        if (char === ' ' || char === '!' || char === '👋') return char;
        if (i < progress * finalText.length) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (frame++ >= totalFrames) {
        clearInterval(timer);
        el.textContent = finalText;
      }
    }, 30);
  };

  // ── COUNT UP ANIMATION ──
  const countUp = (el, target, duration = 1200) => {
    if (!el || isNaN(target) || target < 0) return;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // ease out quart
      el.textContent = Math.round(target * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ── 3D CARD TILT ──
  const initTilt = () => {
    // Exclude: flashcard (has its own 3D flip), stat-card (has float anim), no-tilt
    const selector = '.glass-card:not(.no-tilt):not([data-tilt]):not(.flashcard-front):not(.flashcard-back)';
    document.querySelectorAll(selector).forEach(card => {
      // Don't apply to anything inside a .flashcard
      if (card.closest('.flashcard')) return;
      card.setAttribute('data-tilt', '1');
      let raf = null;

      card.addEventListener('mouseenter', () => {
        card.style.willChange = 'transform';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (!raf) {
          raf = requestAnimationFrame(() => {
            card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(6px)`;
            card.style.transition = 'transform 0.08s linear';
            raf = null;
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = '';
        card.style.willChange = 'auto';
        card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });
    });
  };

  // ── MAGNETIC BUTTONS ──
  const initMagnetic = () => {
    document.querySelectorAll('.btn-primary:not([data-mag]), .nav-item:not([data-mag])').forEach(btn => {
      btn.setAttribute('data-mag', '1');
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
        btn.style.transition = 'transform 0.1s ease';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });
    });
  };

  // ── STAGGER REVEAL ON PAGE ENTER ──
  const staggerIn = (selector = '.glass-card', options = {}) => {
    if (!window.gsap) return;
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    gsap.fromTo(els,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: options.duration || 0.55,
        stagger: options.stagger || 0.06,
        delay: options.delay || 0,
        ease: 'power3.out',
        clearProps: 'transform'
      }
    );
  };

  // ── CLIP REVEAL FOR HEADINGS ──
  // Text slides up from below a clip-path mask
  const revealHeading = (el, delay = 0) => {
    if (!el || !window.gsap) return;
    el.style.overflow = 'hidden';
    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.textContent = el.textContent;
    el.textContent = '';
    el.appendChild(inner);
    gsap.from(inner, {
      y: '110%', opacity: 0, duration: 0.7, delay,
      ease: 'power3.out'
    });
  };

  // ── PAGE TRANSITION OVERLAY ──
  const createOverlay = () => {
    if (document.getElementById('pageTransOverlay')) return;
    const el = document.createElement('div');
    el.id = 'pageTransOverlay';
    el.style.cssText = `
      position:fixed;inset:0;z-index:600;pointer-events:none;
      background:linear-gradient(135deg,#0096FF,#8B5CF6);
      clip-path:inset(0 100% 0 0);
    `;
    document.body.appendChild(el);
  };

  const transition = (cb) => {
    const el = document.getElementById('pageTransOverlay');
    if (!el || !window.gsap) { cb(); return; }
    gsap.timeline()
      .to(el, { clipPath: 'inset(0 0% 0 0)', duration: 0.25, ease: 'power2.in' })
      .call(cb)
      .to(el, { clipPath: 'inset(0 0% 0 100%)', duration: 0.25, ease: 'power2.out' });
  };

  // ── ENHANCED CURSOR GLOW ──
  const initCursor = () => {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      glow.style.left = cx + 'px';
      glow.style.top = cy + 'px';
      requestAnimationFrame(tick);
    };
    tick();
    // Expand on hoverable elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, a, .glass-card, input, textarea')) {
        glow.style.width = '300px';
        glow.style.height = '300px';
        glow.style.opacity = '0.12';
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('button, a, .glass-card, input, textarea')) {
        glow.style.width = '';
        glow.style.height = '';
        glow.style.opacity = '';
      }
    });
  };

  // ── PARALLAX ORBS ──
  const initParallaxOrbs = () => {
    const orbs = [
      document.querySelector('.orb-1'),
      document.querySelector('.orb-2'),
      document.querySelector('.orb-3'),
    ];
    document.addEventListener('mousemove', (e) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach((orb, i) => {
        if (!orb) return;
        const strength = (i + 1) * 22;
        orb.style.transform = `translate(${cx * strength}px, ${cy * strength}px)`;
        orb.style.transition = 'transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)';
      });
    });
  };

  // ── STAT CARD ENTRANCE ──
  const animateStats = (xp, streak, lessons) => {
    setTimeout(() => {
      const xpEl = document.getElementById('statXP');
      const streakEl = document.getElementById('statStreak');
      const lessonsEl = document.getElementById('statLessons');
      if (xpEl) countUp(xpEl, xp, 1400);
      if (streakEl) countUp(streakEl, streak, 800);
      if (lessonsEl) countUp(lessonsEl, lessons, 1000);
    }, 200);
  };

  // ── INIT (called once on app boot) ──
  const init = () => {
    createOverlay();
    initCursor();
    initParallaxOrbs();
    setTimeout(() => {
      initTilt();
      initMagnetic();
    }, 500);
  };

  // ── REINIT (called after page navigation) ──
  const reinit = (page) => {
    setTimeout(() => {
      initTilt();
      initMagnetic();
      if (page && page !== 'dashboard') {
        staggerIn('.glass-card');
      }
    }, 80);
  };

  return { init, reinit, scramble, countUp, staggerIn, revealHeading, transition, animateStats };
})();
