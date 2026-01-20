# YEP Lucky Draw - AI Coding Instructions

## Project Overview
A React-based gameshow-style vertical wheel lucky draw application for Year End Party events. The app features a spinning vertical column with 1-1000 configurable numbers, theatrical effects (confetti, clapping animations, audio), and an optional backend API for result manipulation.

## Architecture

### Frontend-First Design
- **Single-component architecture**: All logic lives in [`src/components/LuckyDraw.jsx`](../src/components/LuckyDraw.jsx) (~500 lines)
- **No state management library**: Uses React hooks (`useState`, `useRef`, `useEffect`)
- **Self-contained**: App works standalone without backend - API integration is optional

### Key Dependencies
- **GSAP** (animation engine): Handles wheel spin/stop animations with easing
- **canvas-confetti**: Dual-cannon confetti effects triggered on win
- **HTML5 Audio**: Background music loops + 5-second clap sound effect

### Backend API (Optional)
- **FastAPI server** at [`api/main.py`](../api/main.py) - provides cheat mechanism
- **Async post-spin fetch**: After each spin completes, frontend calls `GET /api/cheat`
- **Next-result pattern**: API returns `{number: 42}` to pre-determine the *next* spin (never the current one)
- **Stateless server**: Uses global `next_number` variable, resets after serving result

## Critical Implementation Patterns

### Animation System (GSAP)
```javascript
// Spin: infinite loop with modulo normalization
gsap.to(wheelRef.current, {
  y: `-=${totalNumbers * CELL_HEIGHT * 3}`,
  repeat: -1,
  modifiers: { y: (y) => normalized_position } // Prevent overflow
});

// Stop: target specific number with ease-out
gsap.to(wheelRef.current, { 
  y: targetY, 
  duration: 2, 
  ease: 'power3.out',
  onComplete: () => triggerWinEffects()
});
```

### Audio Management Pattern
**CRITICAL**: HTML5 Audio requires preloading and browser interaction policy handling
- Background music: Starts on user's first interaction (config modal button click)
- Clap audio: **Pre-loaded in useEffect**, reused via `currentTime = 0` reset
- Win audio sequence: Pause background → play clap for 5s → resume background

### Number Drawing Logic
1. Maintain `drawnNumbers` array (prevents re-drawing)
2. Filter `availableNumbers = numbers.filter(num => !drawnNumbers.includes(num))`
3. Apply cheat result IF available AND not already drawn, else random from available
4. Calculate wheel position: `targetY = initialOffset - (winningIndex * CELL_HEIGHT)`

## Development Workflows

### Local Development
```bash
cd lucky-draw
npm install
npm run dev  # Vite dev server on :5173
```

### With Backend API
**Terminal 1:**
```bash
cd lucky-draw/api
pip install -r requirements.txt
python main.py  # FastAPI on :8000
```

**Terminal 2:**
```bash
cd lucky-draw
npm run dev
```

### Testing Cheat Mechanism
```bash
# Set next result to 42
curl -X POST http://127.0.0.1:8000/api/set-number/42

# Check current status
curl http://127.0.0.1:8000/api/status
```

## Project-Specific Conventions

### Styling Approach
- **Gameshow aesthetic**: Gold/red colors, metallic gradients, bulb lighting
- CSS animations for sparkle/glow (no JavaScript for static effects)
- Fixed dimensions: `CELL_HEIGHT = 120px`, `VISIBLE_CELLS = 5`

### File Organization
- **No component splitting**: Single JSX file with co-located CSS
- **Public assets**: Audio files MUST be in `/public/audio/` for production build
- **API isolation**: Backend entirely separate in `/api/` directory

### Configuration Pattern
Modal on app start allows 1-1000 number range configuration:
```javascript
setTotalNumbers(num);
setNumbers(shuffleArray(Array.from({ length: num }, (_, i) => i + 1)));
```

### Keyboard Shortcuts
- **Space**: Start/Stop spin (dual-action button)
- **R**: Reset to config modal
- **M**: Mute/Unmute all audio

## Integration Points

### Frontend → Backend API
- **Endpoint**: `GET https://web.ozovn.com/api/v1/cheat` (production) or `http://127.0.0.1:8000/api/cheat` (local)
- **Timing**: Called in `stopSpin()` GSAP `onComplete` callback
- **Error handling**: Silent failure (console.log) - allows standalone operation
- **Response**: `{number: 42}` or `{}` (empty = no cheat)

### CORS Configuration
Vite dev server allows specific ngrok domain (see [`vite.config.js`](../vite.config.js)):
```javascript
server: { allowedHosts: ['190ee5e3e42c.ngrok-free.app'] }
```

## Common Modifications

### Changing Audio Files
Replace files in [`public/audio/`](../public/audio/):
- `background.mp3` - looping background music (0.5 volume)
- `clap.mp3` - 5-second win sound effect (0.8 volume)

Update references in `LuckyDraw.jsx` if using different filenames.

### Adjusting Animation Speed
Modify these constants in [`LuckyDraw.jsx`](../src/components/LuckyDraw.jsx):
```javascript
duration: 3,  // Spin acceleration time
duration: 2,  // Stop deceleration time
ease: 'power3.out'  // Easing function
```

### Confetti Customization
Edit `triggerConfetti()` function:
```javascript
particleCount: 7,  // Particles per frame
angle: 60/120,     // Launch angles (left/right)
duration: 5 * 1000 // Total confetti time
```

## Documentation References
- **Specification**: [`YEP_Lucky_Draw_Spec.md`](../../YEP_Lucky_Draw_Spec.md) - Original Vietnamese design requirements
- **User Guide**: [`HUONG_DAN_SU_DUNG.md`](../HUONG_DAN_SU_DUNG.md) - MC operation instructions
- **API README**: [`api/README.md`](../api/README.md) - Backend setup details
