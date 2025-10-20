# Jumping Jack Platform Adventure �💚�💚

A responsive, cross-platform Mario-style platform game built with HTML5, CSS3, JavaScript, and LittleJS engine. Features 3 challenging levels, collectible gems, enemies, and works seamlessly across all devices and browsers.

## 🎮 Game Features

### Core Gameplay
- **3 Progressive Levels**: Each level increases in difficulty with more complex platforming challenges
- **Collectible System**: 
  - �� Diamonds: 50 points each
  - 💚 Emeralds: 25 points each
- **Enemy System**: Jump on enemies to defeat them and earn bonus points
- **Lives System**: 3 lives per game with respawn mechanics
- **Timer Challenge**: Complete each level within 5 minutes (300 seconds)

### Technical Features
- **Fully Responsive**: Adapts to desktop, tablet, and smartphone screens
- **Cross-Browser Compatible**: Works on Chrome, Firefox, Edge, Opera, Safari, and more
- **Multi-Input Support**: 
  - Desktop: Keyboard (Arrow keys, WASD, Space)
  - Mobile: Touch controls with on-screen buttons
- **Advanced Physics**: Gravity, collision detection, and smooth movement
- **Particle Effects**: Visual feedback for collecting items
- **Sound System**: Dynamic sound effects using Web Audio API
- **Optimized Performance**: 60 FPS gameplay with efficient rendering

## 🚀 Quick Start

### Option 1: Direct Play
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Click "START GAME" and enjoy!

### Option 2: Development Server
```bash
# Install dependencies
pnpm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 How to Play

### Controls

#### Desktop
- **Movement**: Arrow Keys or WASD
- **Jump**: Space Bar or Up Arrow or W
- **Pause**: Tab away from game

#### Mobile/Touch Devices
- **Move Left**: Touch and hold left arrow button
- **Move Right**: Touch and hold right arrow button  
- **Jump**: Touch jump button
- **Multi-touch**: Supported for simultaneous actions

### Objectives
1. **Collect Gems**: Gather diamonds and emeralds for points
2. **Avoid/Defeat Enemies**: Jump on enemies to defeat them
3. **Reach the End**: Complete each level before time runs out
4. **Survive**: Don't fall off platforms or get hit by enemies
5. **Progress**: Complete all 3 levels to win the game

### Scoring System
- Diamonds: 50 points
- Emeralds: 25 points  
- Defeated Enemies: 100 points
- Time Bonus: Remaining seconds × 10 (end of level)

## 🏗️ Technical Architecture

### File Structure
```
mario-platform-game/
├── index.html          # Main HTML file with game structure
├── styles.css          # Responsive CSS with mobile-first design
├── game.js             # Core game logic and LittleJS integration
├── package.json        # Project dependencies and scripts
├── vite.config.js      # Vite configuration for development
├── vercel.json         # Deployment configuration
└── README.md           # This documentation file
```

### Core Technologies
- **HTML5 Canvas**: High-performance 2D rendering
- **CSS3**: Responsive design with Flexbox and Grid
- **JavaScript ES6+**: Modern syntax with classes and modules
- **LittleJS Engine**: Lightweight game engine for physics and utilities
- **Web Audio API**: Dynamic sound generation
- **Vite**: Fast development server and build tool

### Game Architecture

#### Game State Management
```javascript
gameState = {
    score: 0,           // Current player score
    level: 1,           // Current level (1-3)
    lives: 3,           // Remaining lives
    timeLeft: 300,      // Seconds remaining
    gameStarted: false, // Game active state
    gameOver: false,    // Game end state
    paused: false       // Pause state
}
```

#### Entity System
- **Player**: Main character with physics, animation, and input handling
- **Platform**: Static collision objects with different visual types
- **Collectible**: Animated gems with collection detection
- **Enemy**: AI-controlled obstacles with basic movement patterns
- **Particle**: Visual effects for enhanced feedback

#### Collision Detection
- **AABB (Axis-Aligned Bounding Box)**: Efficient rectangular collision detection
- **Platform Physics**: Proper landing, side collision, and ceiling detection
- **Collectible Triggers**: Overlap detection for item collection
- **Enemy Interaction**: Directional collision for jumping vs. touching

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1024px+ (Full keyboard controls, larger UI)
- **Tablet**: 768px-1023px (Touch controls, medium UI)
- **Mobile**: 320px-767px (Optimized touch controls, compact UI)

### Adaptive Features
- **Canvas Scaling**: Maintains aspect ratio across all screen sizes
- **UI Scaling**: Font sizes and button dimensions scale with viewport
- **Touch Controls**: Automatically shown on touch devices
- **Performance Optimization**: Reduced particle effects on mobile devices

### Mobile Optimizations
- **Touch-Friendly Buttons**: Large, accessible control buttons
- **Gesture Prevention**: Prevents scrolling and zooming during gameplay
- **Battery Optimization**: Efficient rendering to preserve battery life
- **Orientation Support**: Works in both portrait and landscape modes

## 🎨 Level Design

### Level 1: "Green Hills"
- **Difficulty**: Beginner
- **Platforms**: 6 platforms with gentle progression
- **Collectibles**: 5 items (3 emeralds, 2 diamonds)
- **Enemies**: 2 basic enemies
- **Focus**: Learning basic movement and jumping mechanics

### Level 2: "Stone Caverns"  
- **Difficulty**: Intermediate
- **Platforms**: 9 platforms with moderate gaps
- **Collectibles**: 8 items (5 emeralds, 3 diamonds)
- **Enemies**: 4 strategically placed enemies
- **Focus**: Precision jumping and enemy avoidance

### Level 3: "Sky Temple"
- **Difficulty**: Advanced
- **Platforms**: 13 platforms with challenging gaps
- **Collectibles**: 12 items (7 emeralds, 5 diamonds)
- **Enemies**: 6 enemies with complex patrol patterns
- **Focus**: Master-level platforming and timing

## 🔧 Development

### Prerequisites
- Node.js 16+ 
- Modern web browser
- Text editor (VS Code recommended)

### Setup Development Environment
```bash
# Clone repository
git clone <repository-url>
cd mario-platform-game

# Install dependencies
pnpm install

# Start development server
npm run dev

# Open browser to localhost:5173
```

### Build for Production
```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

### Code Structure

#### Game Loop
```javascript
function gameLoop() {
    gameUpdate();    // Update game logic
    gameRender();    // Render graphics
    requestAnimationFrame(gameLoop);
}
```

#### Entity Updates
```javascript
// Player physics and input
player.update();

// Collectible animations and collision
collectibles.forEach(c => c.update());

// Enemy AI and movement  
enemies.forEach(e => e.update());

// Particle system effects
particles.forEach(p => p.update());
```

#### Rendering Pipeline
```javascript
// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Scale for responsive design
ctx.scale(scaleX, scaleY);

// Draw in layers: background → platforms → entities → effects
```

## 🌐 Deployment

### GitHub Pages Deployment
1. **Fork/Clone** this repository
2. **Enable GitHub Pages** in repository settings
3. **Select source**: Deploy from main branch
4. **Access game**: `https://yourusername.github.io/mario-platform-game`

### Alternative Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop build folder or connect Git
- **Firebase Hosting**: Use Firebase CLI for deployment
- **Surge.sh**: Simple static hosting with CLI

### Build Configuration
The game includes optimized build settings:
- Asset optimization and minification
- Cross-browser compatibility polyfills
- Progressive Web App (PWA) ready structure
- SEO-friendly meta tags and structure

## 🎵 Audio System

### Sound Effects
- **Jump**: Synthesized square wave at 440Hz
- **Collect**: Sine wave tones (880Hz diamonds, 660Hz emeralds)  
- **Enemy Defeat**: Square wave at 330Hz
- **Death**: Sawtooth wave at 220Hz
- **Level Complete**: Ascending sine wave at 660Hz

### Audio Implementation
```javascript
// Web Audio API sound generation
function playSound(frequency, duration, type = "sine") {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    // Play with fade out
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
}
```

## 🐛 Browser Compatibility

### Supported Browsers
- **Chrome**: 60+ (Full support)
- **Firefox**: 55+ (Full support)  
- **Safari**: 12+ (Full support)
- **Edge**: 79+ (Full support)
- **Opera**: 47+ (Full support)
- **Mobile Safari**: iOS 12+ (Full support)
- **Chrome Mobile**: Android 7+ (Full support)

### Fallbacks
- **Audio**: Graceful degradation if Web Audio API unavailable
- **Canvas**: Automatic scaling and pixel ratio detection
- **Touch**: Feature detection for touch vs. mouse events
- **Performance**: Automatic quality adjustment based on device capabilities

## 🔧 Customization

### Adding New Levels
```javascript
// Add to getLevelData() function
4: {
    playerSpawn: { x: 50, y: 100 },
    platforms: [
        { x: 0, y: 680, width: 200, height: 40, type: "grass" }
        // Add more platforms...
    ],
    collectibles: [
        { x: 320, y: 560, type: "emerald" }
        // Add more collectibles...
    ],
    enemies: [
        { x: 350, y: 580, type: "goomba" }
        // Add more enemies...
    ]
}
```

### Modifying Game Settings
```javascript
// Edit GAME_CONFIG object
const GAME_CONFIG = {
    CANVAS_WIDTH: 1280,      // Game world width
    CANVAS_HEIGHT: 720,      // Game world height
    GRAVITY: 0.8,            // Gravity strength
    JUMP_FORCE: -15,         // Jump power
    PLAYER_SPEED: 5,         // Movement speed
    LEVEL_TIME: 300,         // Seconds per level
    DIAMOND_POINTS: 50,      // Diamond value
    EMERALD_POINTS: 25       // Emerald value
};
```

### Creating New Enemy Types
```javascript
class Enemy {
    constructor(x, y, type = "goomba") {
        // Add new enemy types:
        // "goomba", "koopa", "spiny", etc.
        this.type = type;
        
        // Customize behavior based on type
        switch(type) {
            case "koopa":
                this.velocityX = -2; // Faster movement
                break;
            case "spiny":
                this.canBeJumpedOn = false; // Dangerous to touch
                break;
        }
    }
}
```

## 📊 Performance Optimization

### Rendering Optimizations
- **Object Pooling**: Reuse particle objects to reduce garbage collection
- **Culling**: Only render objects visible on screen
- **Efficient Collision**: Spatial partitioning for large numbers of entities
- **Canvas Optimization**: Minimize state changes and use efficient drawing methods

### Mobile Performance
- **Reduced Particles**: Fewer particle effects on mobile devices
- **Lower Resolution**: Automatic canvas scaling based on device capabilities
- **Touch Optimization**: Debounced touch events to prevent excessive firing
- **Memory Management**: Careful cleanup of audio contexts and event listeners

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Use consistent indentation and naming conventions
2. **Comments**: Document complex game logic and algorithms  
3. **Testing**: Test on multiple devices and browsers
4. **Performance**: Profile changes for performance impact
5. **Accessibility**: Ensure keyboard navigation and screen reader compatibility

### Reporting Issues
- **Bug Reports**: Include browser, device, and steps to reproduce
- **Feature Requests**: Describe the enhancement and use case
- **Performance Issues**: Include device specifications and FPS measurements

## 📄 License

MIT License - Feel free to use, modify, and distribute this game.

## 🙏 Credits

- **Game Engine**: LittleJS by Frank Force
- **Font**: "Press Start 2P" from Google Fonts
- **Inspiration**: Classic Nintendo Super Mario Bros series
- **Development**: Built with modern web technologies

---

<div class="footer">
AI vibe coded development by <a href="https://biela.dev/" target="_blank">Biela.dev</a>, powered by <a href="https://teachmecode.ae/" target="_blank">TeachMeCode® Institute</a>
</div>

## �� Start Playing Now!

Ready to jump into action? Open `index.html` in your browser and start your Mario platform adventure today!

**Happy Gaming! 🍄✨**
