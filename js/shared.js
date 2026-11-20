// ============================================================
// SHARED GAME UTILITIES
// ============================================================

const SharedGame = (() => {

  // ── Storage helpers ─────────────────────────────────────
  const LS_PLAYER_KEY = 'eventgame_player';

  function getPlayer() {
    try {
      const raw = localStorage.getItem(LS_PLAYER_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function setPlayer(name) {
    const existing = getPlayer();
    const id = existing?.id || crypto.randomUUID();
    const player = { id, name: name.trim().substring(0, 20) };
    localStorage.setItem(LS_PLAYER_KEY, JSON.stringify(player));
    return player;
  }

  function getHighScore(gameId) {
    return parseInt(localStorage.getItem(`hs_${gameId}`) || '0', 10);
  }

  function saveHighScore(gameId, score) {
    const current = getHighScore(gameId);
    if (score > current) {
      localStorage.setItem(`hs_${gameId}`, String(score));
      return true;
    }
    return false;
  }

  // ── Firebase / localStorage DB ───────────────────────────
  let db = null;
  let firebaseReady = false;

  function initFirebase() {
    if (typeof USE_FIREBASE === 'undefined' || !USE_FIREBASE) return;
    if (typeof firebase === 'undefined') return;
    try {
      if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      db = firebase.database();
      firebaseReady = true;
      console.log('✅ Firebase connected');
    } catch (e) {
      console.warn('⚠️ Firebase init failed, using local mode', e);
    }
  }

  // ── Score submission ─────────────────────────────────────
  async function submitScore(gameId, score) {
    const player = getPlayer();
    if (!player) return false;

    const isNewHigh = saveHighScore(gameId, score);

    if (firebaseReady && db) {
      try {
        const ref = db.ref(`players/${player.id}`);
        const snap = await ref.once('value');
        const existing = snap.val() || {};
        const scores = existing.scores || {};

        if (!scores[gameId] || score > scores[gameId]) {
          scores[gameId] = score;
        }

        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        await ref.set({
          name: player.name,
          scores,
          total,
          lastUpdated: Date.now()
        });
      } catch (e) {
        console.warn('Firebase submit failed:', e);
      }
    }

    return isNewHigh;
  }

  // ── Leaderboard subscription ─────────────────────────────
  function onLeaderboardUpdate(callback) {
    if (firebaseReady && db) {
      db.ref('players')
        .orderByChild('total')
        .limitToLast(50)
        .on('value', snap => {
          const data = snap.val() || {};
          const list = Object.entries(data)
            .map(([id, p]) => ({ id, ...p }))
            .sort((a, b) => b.total - a.total);
          callback(list, true);
        });
    } else {
      // Local mode — build from localStorage
      const player = getPlayer();
      if (!player) return callback([], false);
      const scores = {};
      GAME_IDS.forEach(id => { scores[id] = getHighScore(id); });
      const total = Object.values(scores).reduce((a, b) => a + b, 0);
      callback([{ id: player.id, name: player.name, scores, total }], false);
    }
  }

  // ── Navigation ───────────────────────────────────────────
  function goHome() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    // If we're inside /games/ folder
    if (pathParts[pathParts.length - 2] === 'games') {
      window.location.href = '../../index.html';
    } else {
      window.location.href = '../index.html';
    }
  }

  function guardPlayer() {
    const player = getPlayer();
    if (!player || !player.name) {
      goHome();
      return null;
    }
    return player;
  }

  // ── Confetti burst ───────────────────────────────────────
  function confetti(count = 70) {
    const colors = ['#ff6b9d', '#c084fc', '#ffd93d', '#4ecdc4', '#6bcb77', '#45b7d1'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:fixed; top:-12px; pointer-events:none; z-index:9999;
        left:${Math.random() * 100}vw;
        width:${5 + Math.random() * 9}px;
        height:${10 + Math.random() * 12}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:2px;
        transform:rotate(${Math.random() * 360}deg);
        animation:confetti-fall ${1.5 + Math.random() * 2}s linear ${Math.random() * 0.4}s forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
  }

  // ── Game metadata ────────────────────────────────────────
  const GAME_IDS = ['floppy-bird', 'bottle-flip', 'can-crusher', 'kick-shot', 'hammer-smash'];

  const GAME_INFO = {
    'floppy-bird':  { name: 'Floppy Bird',        emoji: '🐦', color: '#4ecdc4', desc: 'Tap to flap, dodge the pipes!',           path: 'games/floppy-bird.html'  },
    'bottle-flip':  { name: 'Bottle Flip Frenzy',  emoji: '🍾', color: '#45b7d1', desc: 'Flip the bottle and land it upright!',    path: 'games/bottle-flip.html'  },
    'can-crusher':  { name: 'Can Crusher',          emoji: '🎳', color: '#f7971e', desc: 'Knock down all the cans!',               path: 'games/can-crusher.html'  },
    'kick-shot':    { name: 'Kick Shot',            emoji: '⚽', color: '#6bcb77', desc: 'Swipe to shoot, score 5 goals!',         path: 'games/kick-shot.html'    },
    'hammer-smash': { name: 'Hammer Smash',         emoji: '🔨', color: '#ff6b9d', desc: 'Smash moles, dodge bombs!',              path: 'games/hammer-smash.html' },
  };

  // ── Init on DOM ready ────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
  } else {
    initFirebase();
  }

  return {
    getPlayer, setPlayer,
    getHighScore, saveHighScore,
    submitScore,
    onLeaderboardUpdate,
    goHome, guardPlayer,
    confetti,
    GAME_IDS, GAME_INFO
  };

})();
