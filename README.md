# 🕹️ Event Mini Games Hub

Mobile web arcade designed for events, parties, and competitions. Guests scan a QR code on their phones, enter their name, and compete across 5 mini games with a unified live leaderboard.

---

## 🎮 Included Mini Games

| # | Game | File | Mechanics |
|---|---|---|---|
| 1 | 🐦 **Floppy Bird** | `games/floppy-bird.html` | Tap to flap, fly through pipes, speed ramps up |
| 2 | 🍾 **Bottle Flip Frenzy** | `games/bottle-flip.html` | Swipe/tap to flip bottle upright on platforms in 45s |
| 3 | 🎳 **Can Crusher** | `games/can-crusher.html` | Carnival physics toss to knock over can pyramid with 5 balls |
| 4 | ⚽ **Kick Shot** | `games/kick-shot.html` | Swipe curve penalty kicks past reactive goalkeeper (5 shots) |
| 5 | 🔨 **Hammer Smash** | `games/hammer-smash.html` | Rapid whack-a-mole; hit moles & stars, avoid bombs (45s) |

---

## 🚀 GitHub Pages Free Deployment

1. Push this repo to GitHub (main branch).
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Branch**, select `main` and folder `/ (root)`. Click **Save**.
4. In ~60 seconds, your site will be live at:
   `https://<your-github-username>.github.io/mini-games/`
5. Generate a free QR code pointing to that URL (e.g. using qr-code-generator.com or Canva).
6. Print or display the QR code at your event venue!

---

## 🏆 Real-Time Firebase Leaderboard Setup (Optional)

By default, scores are saved locally on each device. To enable **cross-player live syncing**:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Click **Add App** > **Web** (`</>`).
3. Create a **Realtime Database** (choose **Start in test mode** for event duration).
4. Open `js/firebase-config.js` and paste your config:
   ```javascript
   const FIREBASE_CONFIG = {
     apiKey: "...",
     authDomain: "...",
     databaseURL: "https://your-event-default-rtdb.firebaseio.com",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };

   const USE_FIREBASE = true; // Set to true!
   ```
5. Commit and push. Standings will now update live in real-time across all guest phones!
