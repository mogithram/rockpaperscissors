// Game configuration
export const CONFIG = {
    TARGET_SCORE: 10,
    ROUND_DELAY: 1000,  
    WIN_MESSAGES: {
        win: "You Win!",
        lose: "You Lose!",
        draw: "Draw!"
    },
    SELECTORS: {
        resultMessage: '#result-message',
        playerScore: '#player-score',
        computerScore: '#computer-score'
    },
    EMOJIS: {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    },
    ANIMATIONS: ['pulse', 'spin', 'shake', 'bounce'],
    NEON_COLORS: {
        primary: '#7f5af0',
        secondary: '#2cb67d',
        accent: '#ff5680'
    },
    FLUID: {
        PARTICLE_COUNT: 100,
        PARTICLE_SIZE: 2,
        MOUSE_RADIUS: 100,
        VELOCITY: 0.95,
        COLOR: 'rgba(127, 90, 240, 0.5)'
    }
};
