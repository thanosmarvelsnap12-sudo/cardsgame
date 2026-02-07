// Main Game Controller
import Game from './game/Game.js';
import GameBoard from './ui/GameBoard.js';
import GameLog from './ui/GameLog.js';
import ModalManager from './ui/Modals.js';

class InfinityGauntletGame {
    constructor() {
        this.game = new Game();
        this.gameBoard = null;
        this.gameLog = null;
        this.modalManager = null;
        this.playerCount = 0;
        
        this.init();
    }
    
    init() {
        // Initialize setup screen
        this.initSetupScreen();
        
        // Initialize UI components
        this.gameLog = new GameLog();
        this.modalManager = new ModalManager();
        
        // Add initial log message
        this.gameLog.addEntry('Welcome to Infinity Gauntlet: A Love Letter Game!', 'setup');
    }
    
    initSetupScreen() {
        const countButtons = document.querySelectorAll('.count-btn');
        const startGameBtn = document.getElementById('start-game-btn');
        const playerNamesDiv = document.getElementById('player-names');
        
        // Set default player count to 3
        this.playerCount = 3;
        countButtons[1].classList.add('active');
        this.createPlayerInputs(3);
        
        // Player count selection
        countButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                countButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.playerCount = parseInt(btn.dataset.count);
                this.createPlayerInputs(this.playerCount);
            });
        });
        
        // Start game button
        startGameBtn.addEventListener('click', () => this.startGame());
    }
    
    createPlayerInputs(count) {
        const playerNamesDiv = document.getElementById('player-names');
        if (!playerNamesDiv) return;
        
        playerNamesDiv.innerHTML = '';
        
        // Create player name inputs
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'player-input';
            
            const label = document.createElement('label');
            label.textContent = i === 0 ? 'Player 1 (Default Thanos)' : `Player ${i + 1}`;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Player ${i + 1} Name`;
            input.value = `Player ${i + 1}`;
            input.id = `player-${i}-name`;
            
            div.appendChild(label);
            div.appendChild(input);
            playerNamesDiv.appendChild(div);
        }
        
        // Create Thanos selector
        const thanosDiv = document.createElement('div');
        thanosDiv.className = 'player-input';
        thanosDiv.innerHTML = `
            <label>Thanos is:</label>
            <select id="thanos-select">
                ${Array.from({length: count}, (_, i) => 
                    `<option value="${i}" ${i === 0 ? 'selected' : ''}>Player ${i + 1}</option>`
                ).join('')}
            </select>
        `;
        playerNamesDiv.appendChild(thanosDiv);
    }
    
    startGame() {
        // Get player names
        const playerNames = [];
        const thanosSelect = document.getElementById('thanos-select');
        const thanosPlayerIndex = thanosSelect ? parseInt(thanosSelect.value) : 0;
        
        for (let i = 0; i < this.playerCount; i++) {
            const input = document.getElementById(`player-${i}-name`);
            const name = input ? input.value.trim() || `Player ${i + 1}` : `Player ${i + 1}`;
            playerNames.push(name);
        }
        
        // Initialize the game
        const success = this.game.initialize(playerNames, thanosPlayerIndex);
        
        if (success) {
            // Initialize game board
            this.gameBoard = new GameBoard(this.game);
            this.gameBoard.init();
            
            // Switch to game screen
            document.getElementById('setup-screen').classList.remove('active');
            document.getElementById('game-screen').classList.add('active');
            
            // Render initial game state
            this.gameBoard.render();
            
            // Add game start log
            this.gameLog.addEntry(`Game started with ${this.playerCount} players!`, 'setup');
            this.gameLog.addEntry(`${this.game.thanos.name} is Thanos.`, 'setup');
        }
    }
    
    restartGame() {
        // Reset game
        this.game.reset();
        
        // Clear UI
        if (this.gameBoard) {
            this.gameBoard.clearSelection();
        }
        
        // Return to setup screen
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('setup-screen').classList.add('active');
        
        // Reset UI components
        this.gameLog.clear();
        this.gameLog.addEntry('Game reset. Ready to start new game!', 'setup');
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new InfinityGauntletGame();
});
