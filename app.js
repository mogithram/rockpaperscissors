import { CONFIG } from './config.js';

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

// Hide game elements initially
document.querySelectorAll('.game-container, .controls, #result-message').forEach(el => {
    el.style.visibility = 'hidden';
});

// Show game elements when start button is clicked
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    document.querySelectorAll('.game-container, .controls, #result-message').forEach(el => {
        el.style.visibility = 'visible';
    });
});

class FluidSimulation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.init();
    }

    init() {
        this.canvas.className = 'particle-canvas';
        document.body.prepend(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        for (let i = 0; i < CONFIG.FLUID.PARTICLE_COUNT; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            if (this.mouse.x && this.mouse.y) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.hypot(dx, dy);
                
                if (distance < CONFIG.FLUID.MOUSE_RADIUS) {
                    particle.vx += (dx / distance) * 0.2;
                    particle.vy += (dy / distance) * 0.2;
                }
            }

            particle.vx *= CONFIG.FLUID.VELOCITY;
            particle.vy *= CONFIG.FLUID.VELOCITY;
            
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            this.ctx.fillStyle = CONFIG.FLUID.COLOR;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, CONFIG.FLUID.PARTICLE_SIZE, 0, Math.PI * 2);
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize fluid simulation
new FluidSimulation();

const resultMessage = document.querySelector(CONFIG.SELECTORS.resultMessage);
const playerScoreEl = document.querySelector(CONFIG.SELECTORS.playerScore);
const computerScoreEl = document.querySelector(CONFIG.SELECTORS.computerScore);

let playerScore = 0;
let computerScore = 0;

document.querySelectorAll('.choice-btn').forEach(button => {
    socket.on('game_result', (data) => {


resultMessage.textContent = data.result === "win" ? "You Win!" : "You Lose!";

        resultMessage.style.visibility = 'visible';  // Ensure result message is visible
    });

    button.addEventListener('click', () => playRound(button.dataset.choice));
});

function updateHandDisplay(displayElement, choice) {
    const handImage = displayElement.querySelector('.hand-image');
    const animations = CONFIG.ANIMATIONS;
    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
    
    // Reset and apply new animation
    handImage.style.animation = 'none';
    void handImage.offsetHeight; // Trigger reflow
    handImage.textContent = CONFIG.EMOJIS[choice];
    handImage.style.animation = `${randomAnim} 0.8s ease`;
    
    // Keep existing scale effect
    handImage.style.transform = 'scale(1.2)';
    setTimeout(() => handImage.style.transform = 'scale(1)', 200);
}

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(player, computer) {
    if (player === computer) return 'draw';
    const wins = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
    return wins[player] === computer ? 'win' : 'lose';
}

function updateScore(result) {
    if (result === 'win') playerScore++;
    if (result === 'lose') computerScore++;

    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;

    // Check if anyone has won
    const checkWin = () => {
        console.log(`Player Score: ${playerScore}, Computer Score: ${computerScore}`);

        // Ensure the game shows the winner when a score threshold is met
        if (playerScore >= CONFIG.TARGET_SCORE) {
            resultMessage.textContent = `You Win the Game! First to ${CONFIG.TARGET_SCORE}`;
            resultMessage.style.visibility = 'visible';  // Make the message visible
            resetScores();
        } else if (computerScore >= CONFIG.TARGET_SCORE) {
            resultMessage.textContent = `Computer Wins the Game! First to ${CONFIG.TARGET_SCORE}`;
            resultMessage.style.visibility = 'visible';  // Make the message visible
            resetScores();
        }
    };

    // Set delay before checking for the winner
    setTimeout(checkWin, CONFIG.ROUND_DELAY);
}

function resetScores() {
    // Reset player and computer scores
    playerScore = 0;
    computerScore = 0;
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
}

function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    
    // Update the display of hands
    updateHandDisplay(document.getElementById('player-hand'), playerChoice);
    updateHandDisplay(document.getElementById('computer-hand'), computerChoice);
    
    // Show the round result message (win, lose, draw)
    resultMessage.textContent = CONFIG.WIN_MESSAGES[result];
    resultMessage.style.visibility = 'visible';  // Ensure result message is visible immediately
    updateScore(result);
}
