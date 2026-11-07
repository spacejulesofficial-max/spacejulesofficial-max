# Glitzo's Little Lab 🐙💜

A cozy, interactive sci-fi web demo featuring **Glitzo**, a purple baby octopus with big expressive eyes, living in a quantum bio-chamber with glowing teal accents.

> **Glitzo's Motto:**
> *"Eight arms. One green square at a time."* 🐙💚

---

## 🌟 Features

1. **BOOP! Button**:
   - Boop Glitzo's nose or click the **BOOP!** button.
   - Glitzo squishes happily with smiling curve eyes, glowing blush, heart reactions floating up, and synthesized playful sound effects.
2. **Wave Hello Button**:
   - Animates Tentacle #4 into a friendly wave gesture with custom greeting lines and ripple effects.
3. **One Green Square Button**:
   - Increments the **OTERCEL progress counter** (0 / 3 -> 1 / 3 -> 2 / 3 -> 3 / 3).
   - Filled slots emit a radiant emerald glow with checkmarks and quantum tones.
4. **OTERCEL Celebration**:
   - Completing 3 green squares launches a celebration event: Glitzo spins in a celebration dance, confetti bursts across the screen, a celebration banner appears, and celebratory chimes play.
5. **No External APIs or Paid Services**:
   - Pure HTML5, modern CSS3, and vanilla JavaScript.
   - Built-in Web Audio API synthesizer for adorable chimes and squeaks (zero external audio files).
   - Responsive design tailored for mobile phones, tablets, and desktop displays.

---

## 🚀 How to Run Locally

Because this demo uses simple HTML, CSS, and JavaScript, you can run it using any simple local static server or directly open it in your browser.

### Option 1: Python HTTP Server (Recommended)
From the repository root or inside the `glitzo-lab` directory:

```bash
# If running from repository root:
python3 -m http.server 8000

# Then open in your browser:
# http://localhost:8000/glitzo-lab/
```

Or from inside `glitzo-lab`:
```bash
cd glitzo-lab
python3 -m http.server 8000
# Open: http://localhost:8000/
```

### Option 2: Node.js / npx
```bash
npx serve glitzo-lab
```

### Option 3: Direct File Open
You can also directly open `glitzo-lab/index.html` in any modern web browser (Google Chrome, Firefox, Safari, Edge).

---

## 🧪 Testing

Automated end-to-end tests are written with Playwright to verify:
- Initial state rendering and responsive layout.
- "BOOP!" button interactions, facial expression shift, and speech bubbles.
- "Wave Hello" tentacle animation trigger and greetings.
- "One Green Square" progress progression (1, 2, and 3 squares).
- Full OTERCEL celebration modal, confetti triggering, and lab reset.

To run the automated tests:
```bash
python3 glitzo-lab/test_glitzo.py
```
