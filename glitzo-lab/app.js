/**
 * Glitzo's Little Lab — Interactive Logic
 * Features:
 *  1. BOOP Glitzo with giggle reactions, sparkle effects & sound
 *  2. Wave Hello with animated tentacle
 *  3. One Green Square incrementing OTERCEL progress counter
 *  4. Celebration on 3 green squares with confetti burst & cheer
 */

(function () {
  'use strict';

  // --- Sound Synthesizer (Zero external dependencies) ---
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.12, type = 'sine', rampTo = null) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      if (rampTo !== null) {
        osc.frequency.exponentialRampToValueAtTime(rampTo, audioCtx.currentTime + duration);
      }
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked before first user gesture
    }
  }

  function playBoopSound() {
    playTone(480, 0.15, 'sine', 780);
  }

  function playWaveSound() {
    playTone(350, 0.18, 'triangle', 520);
    setTimeout(() => playTone(520, 0.18, 'triangle', 440), 120);
  }

  function playSquareSound(step) {
    const baseFreqs = [523.25, 659.25, 783.99]; // C5, E5, G5
    const f = baseFreqs[Math.min(step - 1, baseFreqs.length - 1)] || 523.25;
    playTone(f, 0.25, 'sine', f * 1.25);
  }

  function playCelebrationChime() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.35, 'triangle', freq * 1.05);
      }, idx * 120);
    });
  }

  // --- DOM Elements ---
  const speechBubble = document.getElementById('speech-bubble');
  const speechText = document.getElementById('speech-text');
  const mascotStage = document.getElementById('mascot-stage');
  const glitzoSvg = document.getElementById('glitzo-svg');
  const wavingTentacle = document.getElementById('waving-tentacle');
  const moodVal = document.getElementById('mood-val');
  const otercelCount = document.getElementById('otercel-count');
  const squaresTrack = document.getElementById('squares-track');
  const squaresHint = document.getElementById('squares-hint');
  const reactionsContainer = document.getElementById('reactions-container');
  const particlesContainer = document.getElementById('particles-container');

  const btnBoop = document.getElementById('btn-boop');
  const directBoopZone = document.getElementById('direct-boop-zone');
  const btnWave = document.getElementById('btn-wave');
  const btnSquare = document.getElementById('btn-square');
  const btnReset = document.getElementById('btn-reset');
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundStatus = document.getElementById('sound-status');

  const celebrationOverlay = document.getElementById('celebration-overlay');
  const btnCelebrateAgain = document.getElementById('btn-celebrate-again');
  const btnCelebrateReset = document.getElementById('btn-celebrate-reset');
  const confettiCanvas = document.getElementById('confetti-canvas');

  // --- State ---
  let greenSquaresCount = 0;
  let boopTimeout = null;
  let waveTimeout = null;
  let speechTimeout = null;

  const BOOP_QUOTES = [
    "Teehee! That tickles my quantum tentacles! 🥰",
    "*giggles in bioluminescence* Bloop! 💜",
    "Boop detected! Serotonin levels at 100%! ✨",
    "You touched my nose! *happy octopus wiggles* 🐙",
    "Squish! Glitzo feels so loved! 💖"
  ];

  const WAVE_QUOTES = [
    "Hello human friend! Waving with Tentacle #4! 👋",
    "High four! Or high eight! Bloop bloop! 🐙✨",
    "Look at this arm go! Perfect wave trajectory! 💫",
    "Sending cosmic ripples of good vibes your way! 🌊"
  ];

  const SQUARE_QUOTES = [
    "First green square locked in! Building our universe! 🟩",
    "Two green squares shining bright! One step closer! 🟩🟩",
    "THREE GREEN SQUARES! Quantum circuit complete! 🎉💚"
  ];

  // --- Ambient Background Bubbles ---
  function createAmbientParticles() {
    if (!particlesContainer) return;
    particlesContainer.innerHTML = '';
    const count = 12;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 8 + 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `-20px`;
      p.style.animationDuration = `${Math.random() * 4 + 4}s`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      particlesContainer.appendChild(p);
    }
  }

  // --- UI Update Helpers ---
  function setSpeech(msg) {
    if (!speechBubble || !speechText) return;
    speechText.textContent = msg;
    speechBubble.classList.remove('bubble-pop');
    // Force reflow
    void speechBubble.offsetWidth;
    speechBubble.classList.add('bubble-pop');

    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
      speechBubble.classList.remove('bubble-pop');
    }, 400);
  }

  function spawnReaction(emoji = '💜') {
    if (!reactionsContainer) return;
    const item = document.createElement('div');
    item.className = 'reaction-item';
    item.textContent = emoji;

    const startX = 140 + (Math.random() * 40 - 20);
    const startY = 120 + (Math.random() * 30 - 15);
    const rx = (Math.random() * 60 - 30);
    const rdeg = (Math.random() * 40 - 20);

    item.style.left = `${startX}px`;
    item.style.top = `${startY}px`;
    item.style.setProperty('--rx', `${rx}px`);
    item.style.setProperty('--rdeg', `${rdeg}deg`);

    reactionsContainer.appendChild(item);
    setTimeout(() => {
      item.remove();
    }, 1000);
  }

  // --- Action 1: BOOP! ---
  function handleBoop() {
    initAudio();
    playBoopSound();

    glitzoSvg.classList.add('booped');
    moodVal.textContent = 'BOOPED_OVERJOYED';

    const quote = BOOP_QUOTES[Math.floor(Math.random() * BOOP_QUOTES.length)];
    setSpeech(quote);

    const emojis = ['💜', '💖', '✨', '🥰', '🌸'];
    spawnReaction(emojis[Math.floor(Math.random() * emojis.length)]);
    setTimeout(() => spawnReaction('✨'), 150);

    clearTimeout(boopTimeout);
    boopTimeout = setTimeout(() => {
      glitzoSvg.classList.remove('booped');
      if (greenSquaresCount < 3) {
        moodVal.textContent = 'ECSTATIC_CUDDLY';
      }
    }, 900);
  }

  // --- Action 2: Wave Hello ---
  function handleWave() {
    initAudio();
    playWaveSound();

    wavingTentacle.classList.add('waving-arm-active');
    moodVal.textContent = 'FRIENDLY_GREETING';

    const quote = WAVE_QUOTES[Math.floor(Math.random() * WAVE_QUOTES.length)];
    setSpeech(quote);

    spawnReaction('👋');

    clearTimeout(waveTimeout);
    waveTimeout = setTimeout(() => {
      wavingTentacle.classList.remove('waving-arm-active');
      if (greenSquaresCount < 3) {
        moodVal.textContent = 'ECSTATIC_CUDDLY';
      }
    }, 2400);
  }

  // --- Action 3: One Green Square ---
  function updateSquaresUI() {
    const slots = squaresTrack.querySelectorAll('.square-slot');
    slots.forEach((slot, idx) => {
      if (idx < greenSquaresCount) {
        slot.classList.add('filled');
      } else {
        slot.classList.remove('filled');
      }
    });

    otercelCount.textContent = `${greenSquaresCount} / 3 COMPLETED`;

    if (greenSquaresCount === 0) {
      squaresHint.textContent = 'Feed quantum energy to complete the 3 green squares!';
    } else if (greenSquaresCount === 1) {
      squaresHint.textContent = '1 green square active! Keep building!';
    } else if (greenSquaresCount === 2) {
      squaresHint.textContent = '2 green squares radiant! Just 1 more for celebration!';
    } else if (greenSquaresCount >= 3) {
      squaresHint.textContent = '🎉 All 3 green squares completed! OTERCEL achieved!';
    }
  }

  function handleAddGreenSquare() {
    initAudio();
    if (greenSquaresCount < 3) {
      greenSquaresCount++;
      playSquareSound(greenSquaresCount);
      updateSquaresUI();

      spawnReaction('🟩');
      const quote = SQUARE_QUOTES[greenSquaresCount - 1];
      setSpeech(quote);

      if (greenSquaresCount === 3) {
        setTimeout(triggerCelebration, 400);
      }
    } else {
      // Already 3 completed: trigger celebration again!
      triggerCelebration();
    }
  }

  // --- Action 4: Celebration ---
  let confettiAnimationId = null;

  function triggerCelebration() {
    initAudio();
    playCelebrationChime();

    moodVal.textContent = 'OTERCEL_CELEBRATION';
    glitzoSvg.classList.add('celebrating');
    celebrationOverlay.classList.add('active');
    celebrationOverlay.setAttribute('aria-hidden', 'false');

    setSpeech('WE DID IT! 3 GREEN SQUARES! 🎉🐙💚');
    startConfetti();
  }

  function closeCelebrationModal() {
    celebrationOverlay.classList.remove('active');
    celebrationOverlay.setAttribute('aria-hidden', 'true');
  }

  function handleReset() {
    initAudio();
    greenSquaresCount = 0;
    updateSquaresUI();
    closeCelebrationModal();
    glitzoSvg.classList.remove('celebrating', 'booped');
    wavingTentacle.classList.remove('waving-arm-active');
    stopConfetti();
    moodVal.textContent = 'ECSTATIC_CUDDLY';
    setSpeech("Lab reset! Glitzo is ready for a new quantum run! Bloop! ✨");
    playTone(330, 0.15, 'sine', 220);
  }

  // --- Confetti Engine ---
  let confettiParticles = [];

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function startConfetti() {
    resizeConfetti();
    confettiParticles = [];
    const colors = ['#00ff88', '#10b981', '#00f5d4', '#c084fc', '#d946ef', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2 + (Math.random() * 80 - 40),
        y: window.innerHeight / 2 - 40,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 16,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    if (!confettiAnimationId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.rSpeed;
      p.opacity -= 0.007;

      if (p.opacity <= 0 || p.y > confettiCanvas.height + 20) {
        confettiParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      ctx.restore();
    }

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimationId = null;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  function stopConfetti() {
    confettiParticles = [];
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
    if (confettiCanvas) {
      const ctx = confettiCanvas.getContext('2d');
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // --- Sound Toggle ---
  function toggleSound() {
    soundEnabled = !soundEnabled;
    soundStatus.textContent = soundEnabled ? 'ON' : 'OFF';
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) {
      initAudio();
      playTone(550, 0.1, 'sine');
    }
  }

  // --- Event Listeners ---
  function initEvents() {
    if (btnBoop) btnBoop.addEventListener('click', handleBoop);
    if (directBoopZone) directBoopZone.addEventListener('click', handleBoop);
    if (btnWave) btnWave.addEventListener('click', handleWave);
    if (btnSquare) btnSquare.addEventListener('click', handleAddGreenSquare);
    if (btnReset) btnReset.addEventListener('click', handleReset);
    if (soundToggle) soundToggle.addEventListener('click', toggleSound);

    if (btnCelebrateAgain) {
      btnCelebrateAgain.addEventListener('click', () => {
        startConfetti();
        playCelebrationChime();
        spawnReaction('🎉');
        spawnReaction('💚');
      });
    }

    if (btnCelebrateReset) {
      btnCelebrateReset.addEventListener('click', handleReset);
    }

    // Close celebration modal by clicking outside
    if (celebrationOverlay) {
      celebrationOverlay.addEventListener('click', (e) => {
        if (e.target === celebrationOverlay) {
          closeCelebrationModal();
        }
      });
    }

    // Window resize handler
    window.addEventListener('resize', () => {
      resizeConfetti();
    });
  }

  // --- Initializer ---
  createAmbientParticles();
  initEvents();
  updateSquaresUI();

  // Expose test hooks for automated verification
  window.__glitzoTest = {
    handleBoop,
    handleWave,
    handleAddGreenSquare,
    handleReset,
    getState: () => ({
      greenSquaresCount,
      mood: moodVal ? moodVal.textContent : '',
      speech: speechText ? speechText.textContent : '',
      isCelebrating: celebrationOverlay ? celebrationOverlay.classList.contains('active') : false,
      isBooped: glitzoSvg ? glitzoSvg.classList.contains('booped') : false,
      isWaving: wavingTentacle ? wavingTentacle.classList.contains('waving-arm-active') : false
    })
  };
})();
