// Mario Platform Game with LittleJS
// Advanced responsive platform game with 3 levels

// Game Configuration
const GAME_CONFIG = {
    CANVAS_WIDTH: 1280,
    CANVAS_HEIGHT: 720,
    GRAVITY: 0.8,
    JUMP_FORCE: -15,
    PLAYER_SPEED: 5,
    LEVEL_TIME: 300, // 5 minutes per level
    DIAMOND_POINTS: 50,
    EMERALD_POINTS: 25
};

// Game State
let gameState = {
    score: 0,
    level: 1,
    lives: 3,
    timeLeft: GAME_CONFIG.LEVEL_TIME,
    gameStarted: false,
    gameOver: false,
    paused: false,
    currentLevelData: null
};

// Input handling
let keys = {};
let mobileControls = {
    left: false,
    right: false,
    jump: false
};

// Game objects arrays
let platforms = [];
let collectibles = [];
let enemies = [];
let particles = [];

// Player object
let player = null;

// Audio context for sound generation
let audioContext = null;

// Initialize the game
function gameInit() {
    // Set up canvas and rendering
    setupCanvas();
    
    // Initialize audio
    initAudio();
    
    // Set up input handlers
    setupInputHandlers();
    
    // Show start screen
    showStartScreen();
    
    // Create initial level
    createLevel(1);
    
    console.log("Mario Platform Game Initialized!");
}

function setupCanvas() {
    const canvas = document.getElementById("gameCanvas");
    const container = document.getElementById("gameContainer");
    
    // Make canvas responsive
    function resizeCanvas() {
        const containerRect = container.getBoundingClientRect();
        const aspectRatio = GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.CANVAS_HEIGHT;
        
        let width = containerRect.width;
        let height = containerRect.height - 60; // Account for UI
        
        // Maintain aspect ratio
        if (width / height > aspectRatio) {
            width = height * aspectRatio;
        } else {
            height = width / aspectRatio;
        }
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
    }
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
}

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log("Audio not supported");
    }
}

function playSound(frequency, duration, type = "sine") {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function setupInputHandlers() {
    // Keyboard input
    document.addEventListener("keydown", (e) => {
        keys[e.code] = true;
        
        // Prevent default for game keys
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space", "KeyA", "KeyD", "KeyW"].includes(e.code)) {
            e.preventDefault();
        }
    });
    
    document.addEventListener("keyup", (e) => {
        keys[e.code] = false;
    });
    
    // Mobile touch controls
    const leftBtn = document.getElementById("leftBtn");
    const rightBtn = document.getElementById("rightBtn");
    const jumpBtn = document.getElementById("jumpBtn");
    
    // Touch events for mobile controls
    function addTouchEvents(element, control) {
        element.addEventListener("touchstart", (e) => {
            e.preventDefault();
            mobileControls[control] = true;
        });
        
        element.addEventListener("touchend", (e) => {
            e.preventDefault();
            mobileControls[control] = false;
        });
        
        element.addEventListener("mousedown", (e) => {
            e.preventDefault();
            mobileControls[control] = true;
        });
        
        element.addEventListener("mouseup", (e) => {
            e.preventDefault();
            mobileControls[control] = false;
        });
    }
    
    addTouchEvents(leftBtn, "left");
    addTouchEvents(rightBtn, "right");
    addTouchEvents(jumpBtn, "jump");
    
    // Start button
    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("restartButton").addEventListener("click", restartGame);
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.direction = 1; // 1 for right, -1 for left
        this.animFrame = 0;
        this.animTimer = 0;
    }
    
    update() {
        // Handle input
        this.handleInput();
        
        // Apply gravity
        this.velocityY += GAME_CONFIG.GRAVITY;
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Platform collision
        this.checkPlatformCollisions();
        
        // Screen boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > GAME_CONFIG.CANVAS_WIDTH - this.width) {
            this.x = GAME_CONFIG.CANVAS_WIDTH - this.width;
        }
        
        // Death condition
        if (this.y > GAME_CONFIG.CANVAS_HEIGHT) {
            this.die();
        }
        
        // Animation
        this.updateAnimation();
    }
    
    handleInput() {
        this.velocityX = 0;
        
        // Keyboard input
        if (keys["ArrowLeft"] || keys["KeyA"] || mobileControls.left) {
            this.velocityX = -GAME_CONFIG.PLAYER_SPEED;
            this.direction = -1;
        }
        if (keys["ArrowRight"] || keys["KeyD"] || mobileControls.right) {
            this.velocityX = GAME_CONFIG.PLAYER_SPEED;
            this.direction = 1;
        }
        if ((keys["ArrowUp"] || keys["Space"] || keys["KeyW"] || mobileControls.jump) && this.onGround) {
            this.jump();
        }
    }
    
    jump() {
        this.velocityY = GAME_CONFIG.JUMP_FORCE;
        this.onGround = false;
        playSound(440, 0.2, "square");
    }
    
    checkPlatformCollisions() {
        this.onGround = false;
        
        for (let platform of platforms) {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y < platform.y + platform.height &&
                this.y + this.height > platform.y) {
                
                // Top collision (landing on platform)
                if (this.velocityY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                }
                // Bottom collision
                else if (this.velocityY < 0 && this.y > platform.y) {
                    this.y = platform.y + platform.height;
                    this.velocityY = 0;
                }
                // Side collisions
                else if (this.velocityX > 0) {
                    this.x = platform.x - this.width;
                } else if (this.velocityX < 0) {
                    this.x = platform.x + platform.width;
                }
            }
        }
    }
    
    updateAnimation() {
        this.animTimer++;
        if (this.animTimer > 10) {
            this.animFrame = (this.animFrame + 1) % 4;
            this.animTimer = 0;
        }
    }
    
    die() {
        gameState.lives--;
        playSound(220, 0.5, "sawtooth");
        
        if (gameState.lives <= 0) {
            gameOver();
        } else {
            // Respawn
            this.x = 50;
            this.y = 100;
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }
    
    draw(ctx) {
        // Simple sprite drawing
        ctx.fillStyle = this.onGround ? "#FF6B6B" : "#FF8E53";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Eyes
        ctx.fillStyle = "white";
        ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
        ctx.fillRect(this.x + 18, this.y + 8, 6, 6);
        
        // Pupils
        ctx.fillStyle = "black";
        const eyeOffset = this.direction > 0 ? 2 : 0;
        ctx.fillRect(this.x + 10 + eyeOffset, this.y + 10, 2, 2);
        ctx.fillRect(this.x + 20 + eyeOffset, this.y + 10, 2, 2);
        
        // Hat
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x + 4, this.y - 8, 24, 12);
    }
}

// Platform class
class Platform {
    constructor(x, y, width, height, type = "normal") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }
    
    draw(ctx) {
        switch (this.type) {
            case "grass":
                ctx.fillStyle = "#228B22";
                break;
            case "stone":
                ctx.fillStyle = "#696969";
                break;
            case "brick":
                ctx.fillStyle = "#8B4513";
                break;
            default:
                ctx.fillStyle = "#32CD32";
        }
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add texture
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        for (let i = 0; i < this.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y);
            ctx.lineTo(this.x + i, this.y + this.height);
            ctx.stroke();
        }
    }
}

// Collectible class
class Collectible {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type; // "diamond" or "emerald"
        this.collected = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.points = type === "diamond" ? GAME_CONFIG.DIAMOND_POINTS : GAME_CONFIG.EMERALD_POINTS;
    }
    
    update() {
        // Animation
        this.animTimer++;
        if (this.animTimer > 8) {
            this.animFrame = (this.animFrame + 1) % 8;
            this.animTimer = 0;
        }
        
        // Floating effect
        this.y += Math.sin(Date.now() * 0.005 + this.x * 0.01) * 0.5;
        
        // Check collision with player
        if (!this.collected && player &&
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y) {
            
            this.collect();
        }
    }
    
    collect() {
        this.collected = true;
        gameState.score += this.points;
        updateUI();
        
        // Play collect sound
        playSound(this.type === "diamond" ? 880 : 660, 0.3, "sine");
        
        // Create particles
        createCollectParticles(this.x + this.width/2, this.y + this.height/2);
    }
    
    draw(ctx) {
        if (this.collected) return;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.animFrame * 0.1);
        
        if (this.type === "diamond") {
            // Diamond shape
            ctx.fillStyle = "#00BFFF";
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(8, -4);
            ctx.lineTo(8, 4);
            ctx.lineTo(0, 10);
            ctx.lineTo(-8, 4);
            ctx.lineTo(-8, -4);
            ctx.closePath();
            ctx.fill();
            
            // Shine effect
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.fillRect(-2, -6, 4, 4);
        } else {
            // Emerald shape
            ctx.fillStyle = "#50C878";
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(6, -2);
            ctx.lineTo(6, 6);
            ctx.lineTo(0, 8);
            ctx.lineTo(-6, 6);
            ctx.lineTo(-6, -2);
            ctx.closePath();
            ctx.fill();
            
            // Shine effect
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillRect(-1, -4, 2, 3);
        }
        
        ctx.restore();
    }
}

// Enemy class
class Enemy {
    constructor(x, y, type = "goomba") {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.type = type;
        this.velocityX = -1;
        this.velocityY = 0;
        this.direction = -1;
        this.onGround = false;
        this.defeated = false;
    }
    
    update() {
        if (this.defeated) return;
        
        // Apply gravity
        this.velocityY += GAME_CONFIG.GRAVITY;
        
        // Move
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Platform collision
        this.checkPlatformCollisions();
        
        // Turn around at edges
        if (this.x <= 0 || this.x >= GAME_CONFIG.CANVAS_WIDTH - this.width) {
            this.velocityX *= -1;
            this.direction *= -1;
        }
        
        // Check collision with player
        if (player && !this.defeated &&
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y) {
            
            // Player jumping on enemy
            if (player.velocityY > 0 && player.y < this.y) {
                this.defeat();
                player.velocityY = GAME_CONFIG.JUMP_FORCE * 0.5; // Small bounce
            } else {
                // Player hit by enemy
                player.die();
            }
        }
    }
    
    checkPlatformCollisions() {
        this.onGround = false;
        
        for (let platform of platforms) {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y < platform.y + platform.height &&
                this.y + this.height > platform.y) {
                
                // Top collision
                if (this.velocityY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                }
            }
        }
    }
    
    defeat() {
        this.defeated = true;
        gameState.score += 100;
        playSound(330, 0.4, "square");
        updateUI();
    }
    
    draw(ctx) {
        if (this.defeated) return;
        
        // Simple enemy sprite
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Eyes
        ctx.fillStyle = "red";
        ctx.fillRect(this.x + 4, this.y + 6, 4, 4);
        ctx.fillRect(this.x + 16, this.y + 6, 4, 4);
        
        // Feet
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + 2, this.y + this.height - 4, 6, 4);
        ctx.fillRect(this.x + 16, this.y + this.height - 4, 6, 4);
    }
}

// Particle class for effects
class Particle {
    constructor(x, y, velocityX, velocityY, color, life) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.life = life;
        this.maxLife = life;
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += 0.2; // Gravity
        this.life--;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color.replace("1)", alpha + ")");
        ctx.fillRect(this.x, this.y, 3, 3);
    }
    
    isDead() {
        return this.life <= 0;
    }
}

function createCollectParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        particles.push(new Particle(
            x, y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed - 2,
            "rgba(255, 215, 0, 1)",
            30
        ));
    }
}

// Level creation
function createLevel(levelNum) {
    platforms = [];
    collectibles = [];
    enemies = [];
    particles = [];
    
    gameState.currentLevelData = getLevelData(levelNum);
    
    // Create platforms
    gameState.currentLevelData.platforms.forEach(p => {
        platforms.push(new Platform(p.x, p.y, p.width, p.height, p.type));
    });
    
    // Create collectibles
    gameState.currentLevelData.collectibles.forEach(c => {
        collectibles.push(new Collectible(c.x, c.y, c.type));
    });
    
    // Create enemies
    gameState.currentLevelData.enemies.forEach(e => {
        enemies.push(new Enemy(e.x, e.y, e.type));
    });
    
    // Create player
    const spawn = gameState.currentLevelData.playerSpawn;
    player = new Player(spawn.x, spawn.y);
}

function getLevelData(levelNum) {
    const levels = {
        1: {
            playerSpawn: { x: 50, y: 100 },
            platforms: [
                { x: 0, y: 680, width: 200, height: 40, type: "grass" },
                { x: 300, y: 600, width: 150, height: 20, type: "stone" },
                { x: 500, y: 520, width: 100, height: 20, type: "brick" },
                { x: 700, y: 440, width: 120, height: 20, type: "stone" },
                { x: 900, y: 360, width: 100, height: 20, type: "brick" },
                { x: 1100, y: 280, width: 180, height: 40, type: "grass" }
            ],
            collectibles: [
                { x: 320, y: 560, type: "emerald" },
                { x: 520, y: 480, type: "diamond" },
                { x: 720, y: 400, type: "emerald" },
                { x: 920, y: 320, type: "diamond" },
                { x: 1150, y: 240, type: "diamond" }
            ],
            enemies: [
                { x: 350, y: 580, type: "goomba" },
                { x: 750, y: 420, type: "goomba" }
            ]
        },
        2: {
            playerSpawn: { x: 50, y: 100 },
            platforms: [
                { x: 0, y: 680, width: 150, height: 40, type: "grass" },
                { x: 200, y: 620, width: 100, height: 20, type: "stone" },
                { x: 350, y: 560, width: 80, height: 20, type: "brick" },
                { x: 480, y: 500, width: 100, height: 20, type: "stone" },
                { x: 630, y: 440, width: 80, height: 20, type: "brick" },
                { x: 760, y: 380, width: 100, height: 20, type: "stone" },
                { x: 910, y: 320, width: 80, height: 20, type: "brick" },
                { x: 1040, y: 260, width: 120, height: 20, type: "stone" },
                { x: 1180, y: 200, width: 100, height: 40, type: "grass" }
            ],
            collectibles: [
                { x: 220, y: 580, type: "emerald" },
                { x: 370, y: 520, type: "emerald" },
                { x: 500, y: 460, type: "diamond" },
                { x: 650, y: 400, type: "emerald" },
                { x: 780, y: 340, type: "diamond" },
                { x: 930, y: 280, type: "emerald" },
                { x: 1060, y: 220, type: "diamond" },
                { x: 1200, y: 160, type: "diamond" }
            ],
            enemies: [
                { x: 250, y: 600, type: "goomba" },
                { x: 520, y: 480, type: "goomba" },
                { x: 800, y: 360, type: "goomba" },
                { x: 1100, y: 240, type: "goomba" }
            ]
        },
        3: {
            playerSpawn: { x: 50, y: 100 },
            platforms: [
                { x: 0, y: 680, width: 120, height: 40, type: "grass" },
                { x: 150, y: 640, width: 80, height: 20, type: "brick" },
                { x: 260, y: 600, width: 60, height: 20, type: "stone" },
                { x: 350, y: 560, width: 80, height: 20, type: "brick" },
                { x: 460, y: 520, width: 60, height: 20, type: "stone" },
                { x: 550, y: 480, width: 80, height: 20, type: "brick" },
                { x: 660, y: 440, width: 60, height: 20, type: "stone" },
                { x: 750, y: 400, width: 80, height: 20, type: "brick" },
                { x: 860, y: 360, width: 60, height: 20, type: "stone" },
                { x: 950, y: 320, width: 80, height: 20, type: "brick" },
                { x: 1060, y: 280, width: 60, height: 20, type: "stone" },
                { x: 1150, y: 240, width: 80, height: 20, type: "brick" },
                { x: 1200, y: 180, width: 80, height: 40, type: "grass" }
            ],
            collectibles: [
                { x: 170, y: 600, type: "emerald" },
                { x: 280, y: 560, type: "emerald" },
                { x: 370, y: 520, type: "diamond" },
                { x: 480, y: 480, type: "emerald" },
                { x: 570, y: 440, type: "diamond" },
                { x: 680, y: 400, type: "emerald" },
                { x: 770, y: 360, type: "diamond" },
                { x: 880, y: 320, type: "emerald" },
                { x: 970, y: 280, type: "diamond" },
                { x: 1080, y: 240, type: "emerald" },
                { x: 1170, y: 200, type: "diamond" },
                { x: 1220, y: 140, type: "diamond" }
            ],
            enemies: [
                { x: 200, y: 620, type: "goomba" },
                { x: 400, y: 540, type: "goomba" },
                { x: 600, y: 460, type: "goomba" },
                { x: 800, y: 380, type: "goomba" },
                { x: 1000, y: 300, type: "goomba" },
                { x: 1200, y: 220, type: "goomba" }
            ]
        }
    };
    
    return levels[levelNum] || levels[1];
}

// Game loop
function gameUpdate() {
    if (!gameState.gameStarted || gameState.gameOver || gameState.paused) return;
    
    // Update timer
    gameState.timeLeft -= 1/60; // Assuming 60 FPS
    if (gameState.timeLeft <= 0) {
        gameOver();
        return;
    }
    
    // Update game objects
    if (player) player.update();
    
    collectibles.forEach(c => c.update());
    enemies.forEach(e => e.update());
    
    // Update particles
    particles = particles.filter(p => {
        p.update();
        return !p.isDead();
    });
    
    // Check level completion
    const remainingCollectibles = collectibles.filter(c => !c.collected);
    if (remainingCollectibles.length === 0) {
        nextLevel();
    }
    
    updateUI();
}

function gameRender() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scale for responsive design
    const scaleX = canvas.width / GAME_CONFIG.CANVAS_WIDTH;
    const scaleY = canvas.height / GAME_CONFIG.CANVAS_HEIGHT;
    ctx.save();
    ctx.scale(scaleX, scaleY);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(0.7, "#98FB98");
    gradient.addColorStop(1, "#228B22");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    
    // Draw platforms
    platforms.forEach(p => p.draw(ctx));
    
    // Draw collectibles
    collectibles.forEach(c => c.draw(ctx));
    
    // Draw enemies
    enemies.forEach(e => e.draw(ctx));
    
    // Draw player
    if (player) player.draw(ctx);
    
    // Draw particles
    particles.forEach(p => p.draw(ctx));
    
    ctx.restore();
}

// Main game loop
function gameLoop() {
    gameUpdate();
    gameRender();
    requestAnimationFrame(gameLoop);
}

// UI Functions
function updateUI() {
    document.getElementById("score").textContent = gameState.score;
    document.getElementById("level").textContent = gameState.level;
    document.getElementById("timer").textContent = Math.ceil(gameState.timeLeft);
    document.getElementById("lives").textContent = gameState.lives;
}

function showStartScreen() {
    document.getElementById("startScreen").classList.remove("hidden");
    document.getElementById("gameOverScreen").classList.add("hidden");
}

function hideStartScreen() {
    document.getElementById("startScreen").classList.add("hidden");
}

function showGameOverScreen(won = false) {
    document.getElementById("gameOverScreen").classList.remove("hidden");
    document.getElementById("gameOverTitle").textContent = won ? "CONGRATULATIONS!" : "GAME OVER";
    document.getElementById("finalScore").textContent = gameState.score;
    document.getElementById("finalLevel").textContent = gameState.level;
}

// Game Control Functions
function startGame() {
    hideStartScreen();
    gameState.gameStarted = true;
    gameState.gameOver = false;
    gameState.score = 0;
    gameState.level = 1;
    gameState.lives = 3;
    gameState.timeLeft = GAME_CONFIG.LEVEL_TIME;
    
    createLevel(1);
    updateUI();
    
    // Start background music
    playSound(220, 0.1, "sine");
}

function restartGame() {
    document.getElementById("gameOverScreen").classList.add("hidden");
    startGame();
}

function nextLevel() {
    gameState.level++;
    
    if (gameState.level > 3) {
        // Game completed!
        gameState.gameOver = true;
        showGameOverScreen(true);
        playSound(440, 1, "sine");
        return;
    }
    
    // Reset timer and create next level
    gameState.timeLeft = GAME_CONFIG.LEVEL_TIME;
    createLevel(gameState.level);
    
    // Level complete sound
    playSound(660, 0.5, "sine");
}

function gameOver() {
    gameState.gameOver = true;
    showGameOverScreen(false);
    playSound(110, 1, "sawtooth");
}

// Initialize when page loads
window.addEventListener("load", () => {
    gameInit();
    gameLoop();
});

// Handle visibility change (pause when tab not active)
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        gameState.paused = true;
    } else {
        gameState.paused = false;
    }
});
