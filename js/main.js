// MAIN GAME CONTROLLER - UPDATED WITH IMAGE SUPPORT

class InfinityGauntletGame {
    constructor() {
        this.game = null;
        this.gameBoard = null;
        this.gameLog = null;
        this.modalManager = null;
        this.playerCount = 0;
        this.useImages = true; // Enable/disable image loading
        this.imagesLoaded = false;
        
        this.init();
    }
    
    async init() {
        console.log('Initializing Infinity Gauntlet Game...');
        
        // Initialize setup screen
        this.initSetupScreen();
        
        // Initialize loading screen handlers
        this.initLoadingScreen();
        
        // Initialize UI components
        this.gameLog = new GameLog();
        this.modalManager = new ModalManager();
        
        // Initialize image manager
        imageManager.init();
        
        // Add initial log message
        this.gameLog.addEntry('Welcome to Infinity Gauntlet: A Love Letter Game!', 'setup');
        
        console.log('Game initialized successfully');
    }
    
    initSetupScreen() {
        console.log('Initializing setup screen...');
        
        const countButtons = document.querySelectorAll('.count-btn');
        const startGameBtn = document.getElementById('start-game-btn');
        
        // Set default player count to 3
        this.playerCount = 3;
        if (countButtons[1]) {
            countButtons[1].classList.add('active');
        }
        this.createPlayerInputs(3);
        
        // Player count selection
        countButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                countButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.playerCount = parseInt(btn.dataset.count);
                this.createPlayerInputs(this.playerCount);
                console.log(`Player count set to: ${this.playerCount}`);
            });
        });
        
        // Start game button
        startGameBtn.addEventListener('click', () => this.startGame());
        
        console.log('Setup screen initialized');
    }
    
    initLoadingScreen() {
        console.log('Initializing loading screen...');
        
        const skipBtn = document.getElementById('skip-loading-btn');
        const retryBtn = document.getElementById('retry-loading-btn');
        
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                console.log('Skipping image loading');
                this.useImages = false;
                this.hideLoadingScreen();
                this.initializeGame();
            });
        }
        
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                console.log('Retrying image loading');
                this.retryImageLoading();
            });
        }
        
        console.log('Loading screen initialized');
    }
    
    createPlayerInputs(count) {
        const playerNamesDiv = document.getElementById('player-names');
        if (!playerNamesDiv) {
            console.error('Player names div not found!');
            return;
        }
        
        playerNamesDiv.innerHTML = '';
        
        console.log(`Creating inputs for ${count} players`);
        
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
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
            this.updateLoadingProgress('Starting image loading...', 0);
            console.log('Loading screen shown');
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
            console.log('Loading screen hidden');
        }
    }
    
    updateLoadingProgress(message, percent) {
        const loadingText = document.getElementById('loading-text');
        const progressFill = document.getElementById('progress-fill');
        
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        if (progressFill) {
            progressFill.style.width = `${Math.min(100, percent)}%`;
        }
        
        console.log(`Loading progress: ${percent}% - ${message}`);
    }
    
    async retryImageLoading() {
        console.log('Retrying image loading...');
        this.useImages = true;
        await this.loadImages();
    }
    
    async loadImages() {
        if (!this.useImages) {
            console.log('Image loading disabled by user');
            this.hideLoadingScreen();
            this.initializeGame();
            return;
        }
        
        this.showLoadingScreen();
        
        try {
            // Show initial progress
            this.updateLoadingProgress('Initializing image loader...', 5);
            
            // Load images with progress updates
            const success = await imageManager.preloadImages((progress, message) => {
                this.updateLoadingProgress(message, progress);
            });
            
            this.imagesLoaded = success;
            
            if (success) {
                this.updateLoadingProgress('All images loaded successfully!', 100);
                console.log('✅ Image loading complete');
                
                // Brief pause to show completion
                await new Promise(resolve => setTimeout(resolve, 800));
                
            } else {
                this.updateLoadingProgress('Some images failed to load. Using fallback graphics.', 100);
                console.log('⚠️ Image loading completed with some failures');
                
                // Brief pause to show message
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            
            this.hideLoadingScreen();
            this.initializeGame();
            
        } catch (error) {
            console.error('❌ Image loading failed:', error);
            this.updateLoadingProgress('Image loading failed. Using fallback graphics.', 100);
            
            // Brief pause to show error
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.hideLoadingScreen();
            this.initializeGame();
        }
    }
    
    async startGame() {
        console.log('Starting game...');
        
        // Get player names
        const playerNames = [];
        const thanosSelect = document.getElementById('thanos-select');
        const thanosPlayerIndex = thanosSelect ? parseInt(thanosSelect.value) : 0;
        
        console.log(`Thanos player index: ${thanosPlayerIndex}`);
        
        for (let i = 0; i < this.playerCount; i++) {
            const input = document.getElementById(`player-${i}-name`);
            const name = input ? input.value.trim() || `Player ${i + 1}` : `Player ${i + 1}`;
            playerNames.push(name);
            console.log(`Player ${i + 1}: ${name}`);
        }
        
        // Validate player names
        if (playerNames.length === 0) {
            alert('Please enter player names!');
            return;
        }
        
        // Load images first, then initialize game
        await this.loadImages();
    }
    
    initializeGame() {
        console.log('Initializing game logic...');
        
        // Get player names again
        const playerNames = [];
        const thanosSelect = document.getElementById('thanos-select');
        const thanosPlayerIndex = thanosSelect ? parseInt(thanosSelect.value) : 0;
        
        for (let i = 0; i < this.playerCount; i++) {
            const input = document.getElementById(`player-${i}-name`);
            const name = input ? input.value.trim() || `Player ${i + 1}` : `Player ${i + 1}`;
            playerNames.push(name);
        }
        
        // Create game instance
        this.game = new Game();
        
        // Initialize the game
        const success = this.game.initialize(playerNames, thanosPlayerIndex);
        
        if (!success) {
            console.error('Failed to initialize game!');
            alert('Failed to initialize game. Please try again.');
            return;
        }
        
        // Initialize game board with image support
        this.gameBoard = new GameBoard(this.game, this.useImages);
        this.gameBoard.init();
        
        // Switch to game screen
        const setupScreen = document.getElementById('setup-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (setupScreen && gameScreen) {
            setupScreen.classList.remove('active');
            gameScreen.classList.add('active');
            console.log('Switched to game screen');
        }
        
        // Render initial game state
        if (this.gameBoard) {
            this.gameBoard.render();
            console.log('Game board rendered');
        }
        
        // Add game start log entries
        this.gameLog.addEntry(`🎮 Game started with ${this.playerCount} players!`, 'setup');
        this.gameLog.addEntry(`👑 ${this.game.thanos.name} is Thanos.`, 'setup');
        
        if (this.useImages && imageManager.isLoaded()) {
            this.gameLog.addEntry('🖼️ Card images loaded successfully.', 'setup');
        } else if (!this.useImages) {
            this.gameLog.addEntry('🎨 Using fallback card graphics (images disabled).', 'setup');
        } else {
            this.gameLog.addEntry('⚠️ Some images failed to load. Using fallback graphics.', 'warning');
        }
        
        this.gameLog.addEntry('✅ Game is ready! Thanos begins the first turn.', 'important');
        
        console.log('✅ Game initialization complete!');
    }
    
    restartGame() {
        console.log('Restarting game...');
        
        // Reset game
        if (this.game) {
            this.game.reset();
        }
        
        // Reset image manager
        imageManager.clear();
        this.imagesLoaded = false;
        this.useImages = true;
        
        // Clear UI
        if (this.gameBoard) {
            this.gameBoard.clearSelection();
        }
        
        // Clear game log
        this.gameLog.clear();
        
        // Return to setup screen
        const gameScreen = document.getElementById('game-screen');
        const setupScreen = document.getElementById('setup-screen');
        
        if (gameScreen && setupScreen) {
            gameScreen.classList.remove('active');
            setupScreen.classList.add('active');
        }
        
        // Reinitialize setup
        this.createPlayerInputs(this.playerCount);
        
        // Add reset log message
        this.gameLog.addEntry('🔄 Game reset. Ready to start a new game!', 'setup');
        
        console.log('Game restarted successfully');
    }
    
    returnToMainMenu() {
        console.log('Returning to main menu...');
        
        // Hide any open modals
        if (this.modalManager) {
            this.modalManager.hide();
        }
        
        // Reset game state
        this.restartGame();
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting game...');
    
    // Create global game instance
    window.gameInstance = new InfinityGauntletGame();
    
    // Also make it available as just 'game' for convenience
    window.game = window.gameInstance;
    
    console.log('Game instance created and ready!');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => modal.classList.remove('active'));
        }
        
        // Quick start with Enter on setup screen
        if (e.key === 'Enter' && document.getElementById('setup-screen').classList.contains('active')) {
            document.getElementById('start-game-btn').click();
        }
    });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Game tab is now hidden');
    } else {
        console.log('Game tab is now visible');
        // You could add resume logic here if needed
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.gameInstance && window.gameInstance.gameBoard) {
        // Re-render game board on resize for responsive adjustments
        window.gameInstance.gameBoard.render();
    }
});
