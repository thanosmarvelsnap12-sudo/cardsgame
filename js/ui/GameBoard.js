// Game Board UI Manager with Image Support
class GameBoard {
    constructor(game, useImages = true) {
        this.game = game;
        this.selectedCard = null;
        this.selectedTarget = null;
        this.useImages = useImages; // IMAGE SUPPORT: Track image usage
    }
    
    // Initialize event listeners
    init() {
        console.log('Initializing GameBoard...');
        
        // Play card button
        const playCardBtn = document.getElementById('play-card-btn');
        if (playCardBtn) {
            playCardBtn.addEventListener('click', () => this.playSelectedCard());
        }
        
        // End turn button
        const endTurnBtn = document.getElementById('end-turn-btn');
        if (endTurnBtn) {
            endTurnBtn.addEventListener('click', () => this.endTurn());
        }
        
        // View rules button
        const viewRulesBtn = document.getElementById('view-rules-btn');
        if (viewRulesBtn) {
            viewRulesBtn.addEventListener('click', () => this.showRules());
        }
        
        // Restart button
        const restartBtn = document.getElementById('restart-game-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartGame());
        }
        
        // Listen for game log events
        window.addEventListener('gameLog', (event) => {
            this.addLogMessage(event.detail.message, event.detail.type);
        });
        
        // Initialize modals
        this.initModals();
        
        console.log('GameBoard initialized successfully');
    }
    
    initModals() {
        console.log('Initializing modals...');
        
        // Modal cancel buttons
        const modalCancel = document.getElementById('modal-cancel');
        if (modalCancel) {
            modalCancel.addEventListener('click', () => this.hideModal('card'));
        }
        
        const targetCancel = document.getElementById('target-cancel');
        if (targetCancel) {
            targetCancel.addEventListener('click', () => this.hideModal('target'));
        }
        
        const closeRulesBtn = document.getElementById('close-rules-btn');
        if (closeRulesBtn) {
            closeRulesBtn.addEventListener('click', () => this.hideModal('rules'));
        }
        
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.restartGame());
        }
        
        const mainMenuBtn = document.getElementById('main-menu-btn');
        if (mainMenuBtn) {
            mainMenuBtn.addEventListener('click', () => this.returnToMainMenu());
        }
        
        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        console.log('Modals initialized');
    }
    
    // Render the entire game board
    render() {
        console.log('Rendering game board...');
        this.renderLifeBars();
        this.renderDecks();
        this.renderTokens();
        this.renderStones();
        this.renderPlayerHands();
        this.updateGameInfo();
        this.updateActionButtons();
        console.log('Game board rendered');
    }
    
    renderLifeBars() {
        const heroMaxLife = this.game.getHeroStartLife(this.game.playerCount);
        const thanosMaxLife = 20;
        
        const heroLifeFill = document.getElementById('hero-life-fill');
        const thanosLifeFill = document.getElementById('thanos-life-fill');
        const heroLifeText = document.getElementById('hero-life-text');
        const thanosLifeText = document.getElementById('thanos-life-text');
        
        if (heroLifeFill) {
            heroLifeFill.style.width = `${(this.game.heroLife / heroMaxLife) * 100}%`;
        }
        if (thanosLifeFill) {
            thanosLifeFill.style.width = `${(this.game.thanosLife / thanosMaxLife) * 100}%`;
        }
        if (heroLifeText) {
            heroLifeText.textContent = `${this.game.heroLife}/${heroMaxLife}`;
        }
        if (thanosLifeText) {
            thanosLifeText.textContent = `${this.game.thanosLife}/${thanosMaxLife}`;
        }
    }
    
    renderDecks() {
        const heroDeckCount = document.getElementById('hero-deck-count');
        const thanosDeckCount = document.getElementById('thanos-deck-count');
        
        if (heroDeckCount) {
            heroDeckCount.textContent = this.game.heroDeck.getCount();
        }
        if (thanosDeckCount) {
            thanosDeckCount.textContent = this.game.thanosDeck.getCount();
        }
    }
    
    renderTokens() {
        const thanosTokens = document.getElementById('thanos-tokens');
        const tokensPileCount = document.getElementById('tokens-pile-count');
        
        if (thanosTokens) {
            thanosTokens.textContent = this.game.thanos.tokens;
        }
        if (tokensPileCount) {
            tokensPileCount.textContent = this.game.powerTokens;
        }
        
        // Update hero tokens in list
        const heroesList = document.getElementById('heroes-list');
        if (heroesList) {
            heroesList.innerHTML = '';
            this.game.heroes.forEach(hero => {
                const heroTag = document.createElement('div');
                heroTag.className = `hero-tag ${hero.id === this.game.currentPlayer?.id ? 'current' : ''}`;
                heroTag.innerHTML = `
                    <span>${hero.name}</span>
                    <span class="token-count">${hero.tokens}</span>
                    <i class="fas fa-bolt"></i>
                `;
                heroesList.appendChild(heroTag);
            });
        }
    }
    
    renderStones() {
        const stonesContainer = document.getElementById('stones-container');
        if (!stonesContainer) return;
        
        stonesContainer.innerHTML = '';
        
        const stones = ['Mind Stone', 'Soul Stone', 'Space Stone', 'Power Stone', 'Reality Stone', 'Time Stone'];
        stones.forEach(stoneName => {
            const stoneSlot = document.createElement('div');
            const isCollected = this.game.infinityStonesCollected.includes(stoneName);
            stoneSlot.className = `stone-slot ${isCollected ? 'collected' : ''}`;
            stoneSlot.title = stoneName;
            
            if (isCollected) {
                // IMAGE SUPPORT: Try to use image if available
                if (this.useImages && typeof imageManager !== 'undefined' && imageManager.isLoaded()) {
                    try {
                        const imageUrl = imageManager.getCardImageUrl(stoneName);
                        stoneSlot.style.backgroundImage = `url('${imageUrl}')`;
                        stoneSlot.classList.add('has-image');
                        stoneSlot.innerHTML = `<i class="fas fa-check"></i>`;
                    } catch (error) {
                        // Fallback to icon
                        stoneSlot.innerHTML = `<i class="fas fa-gem"></i>`;
                    }
                } else {
                    stoneSlot.innerHTML = `<i class="fas fa-gem"></i>`;
                }
                stoneSlot.style.color = this.getStoneColor(stoneName);
            } else {
                stoneSlot.textContent = '?';
            }
            
            stonesContainer.appendChild(stoneSlot);
        });
    }
    
    getStoneColor(stoneName) {
        const colors = {
            'Mind Stone': '#FFD700',
            'Soul Stone': '#FF6B6B',
            'Space Stone': '#4ECDC4',
            'Power Stone': '#9B59B6',
            'Reality Stone': '#E74C3C',
            'Time Stone': '#1ABC9C'
        };
        return colors[stoneName] || '#FFFFFF';
    }
    
    renderPlayerHands() {
        console.log('Rendering player hands...');
        
        // IMAGE SUPPORT: Use game's render method if available
        if (this.game && this.game.renderPlayerHandsWithImages) {
            this.game.renderPlayerHandsWithImages(this.useImages);
            console.log('Used image-aware render method');
        } else {
            // Fallback to manual render
            this.renderThanosHand();
            this.renderHeroHands();
            console.log('Used fallback render method');
        }
    }
    
    renderThanosHand() {
        const thanosHandDiv = document.getElementById('thanos-hand');
        if (!thanosHandDiv) return;
        
        thanosHandDiv.innerHTML = '';
        
        this.game.thanos.hand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index, 'thanos');
            thanosHandDiv.appendChild(cardElement);
        });
    }
    
    renderHeroHands() {
        const heroesHandsDiv = document.getElementById('heroes-hands');
        if (!heroesHandsDiv) return;
        
        heroesHandsDiv.innerHTML = '';
        
        this.game.heroes.forEach(hero => {
            const heroHandDiv = document.createElement('div');
            heroHandDiv.className = 'hero-hand-container';
            
            const heroLabel = document.createElement('div');
            heroLabel.className = 'hero-label';
            heroLabel.textContent = `${hero.name}${hero.id === this.game.currentPlayer?.id ? ' (Current)' : ''}`;
            heroHandDiv.appendChild(heroLabel);
            
            const cardsDiv = document.createElement('div');
            cardsDiv.className = 'hero-cards';
            
            hero.hand.forEach((card, index) => {
                const cardElement = this.createCardElement(card, index, 'hero', hero.id);
                cardsDiv.appendChild(cardElement);
            });
            
            heroHandDiv.appendChild(cardsDiv);
            heroesHandsDiv.appendChild(heroHandDiv);
        });
    }
    
    createCardElement(card, index, playerType, heroId = null) {
        // IMAGE SUPPORT: Use game's createCardElement if available
        if (this.game && this.game.createCardElement) {
            return this.game.createCardElement(card, index, playerType, heroId, this.useImages);
        }
        
        // Fallback to basic card
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${playerType}-card ${card.isInfinityStone ? 'infinity-stone' : ''}`;
        
        // Check if this card is selected
        if (this.selectedCard && 
            this.selectedCard.index === index && 
            this.selectedCard.playerType === playerType &&
            this.selectedCard.heroId === heroId) {
            cardDiv.classList.add('selected');
        }
        
        cardDiv.dataset.index = index;
        if (playerType === 'hero') {
            cardDiv.dataset.heroId = heroId;
        }
        cardDiv.dataset.playerType = playerType;
        
        cardDiv.innerHTML = `
            <div class="card-number">${card.number}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-effect">${card.getDescription ? card.getDescription() : card.effect || ''}</div>
        `;
        
        // Add click event
        cardDiv.addEventListener('click', () => this.selectCard(card, index, playerType, heroId));
        
        return cardDiv;
    }
    
    selectCard(card, index, playerType, heroId = null) {
        const currentPlayer = this.game.currentPlayer;
        if (!currentPlayer) return;
        
        // Only allow current player to select their own cards
        if (playerType === 'thanos' && !currentPlayer.isThanos) return;
        if (playerType === 'hero' && currentPlayer.id !== heroId) return;
        
        // Toggle selection
        if (this.selectedCard && 
            this.selectedCard.index === index && 
            this.selectedCard.playerType === playerType &&
            this.selectedCard.heroId === heroId) {
            this.selectedCard = null;
        } else {
            this.selectedCard = { card, index, playerType, heroId };
        }
        
        this.renderPlayerHands();
        this.updateActionButtons();
    }
    
    updateGameInfo() {
        const currentPlayerDisplay = document.getElementById('current-player-display');
        const gamePhaseDisplay = document.getElementById('game-phase');
        
        if (currentPlayerDisplay && this.game.currentPlayer) {
            currentPlayerDisplay.textContent = `Current: ${this.game.currentPlayer.name}`;
        }
        if (gamePhaseDisplay) {
            gamePhaseDisplay.textContent = `Turn ${this.game.currentTurn}`;
        }
    }
    
    updateActionButtons() {
        const playCardBtn = document.getElementById('play-card-btn');
        const endTurnBtn = document.getElementById('end-turn-btn');
        
        if (!playCardBtn || !endTurnBtn) return;
        
        let isCurrentPlayer = false;
        if (this.selectedCard && this.game.currentPlayer) {
            if (this.selectedCard.playerType === 'thanos') {
                isCurrentPlayer = this.game.currentPlayer.isThanos;
            } else {
                isCurrentPlayer = this.game.currentPlayer.id === this.selectedCard.heroId;
            }
        }
        
        playCardBtn.disabled = !isCurrentPlayer;
        endTurnBtn.disabled = !this.game.currentPlayer;
    }
    
    playSelectedCard() {
        if (!this.selectedCard || !this.game.currentPlayer) {
            console.log('No card selected or no current player');
            return;
        }
        
        const { index, playerType, heroId } = this.selectedCard;
        const player = playerType === 'thanos' ? this.game.thanos : 
                      this.game.heroes.find(h => h.id === heroId);
        
        if (!player) {
            console.error('Player not found!');
            return;
        }
        
        console.log(`Playing card: ${player.name}'s card at index ${index}`);
        
        const result = this.game.playCard(player, index);
        
        if (result.success) {
            console.log('Card played successfully');
            this.selectedCard = null;
            this.render();
            
            // Check for game over
            if (result.gameOver) {
                console.log('Game over detected:', result.gameOver);
                this.showGameOver(result.gameOver);
            }
        } else {
            console.log('Card play failed:', result.message);
            this.addLogMessage(result.message, 'error');
        }
    }
    
    endTurn() {
        console.log('Ending turn...');
        this.game.nextTurn();
        this.selectedCard = null;
        this.render();
        console.log('Turn ended');
    }
    
    showGameOver(result) {
        console.log('Showing game over screen');
        
        const gameOverModal = document.getElementById('game-over-modal');
        const gameOverTitle = document.getElementById('game-over-title');
        const gameOverMessage = document.getElementById('game-over-message');
        
        if (!gameOverModal || !gameOverTitle || !gameOverMessage) {
            console.error('Game over modal elements not found!');
            return;
        }
        
        if (result === 'THANOS_SNAP' || (result && result.winner === 'THANOS')) {
            gameOverTitle.textContent = 'THANOS WINS!';
            gameOverTitle.style.color = '#ff6b6b';
            gameOverMessage.textContent = result === 'THANOS_SNAP' 
                ? 'Thanos has collected all 6 Infinity Stones and snaps his fingers! The universe falls to dust.' 
                : 'Thanos has defeated all the Heroes and achieved ultimate power!';
        } else {
            gameOverTitle.textContent = 'HEROES WIN!';
            gameOverTitle.style.color = '#4ecdc4';
            gameOverMessage.textContent = 'The Heroes have defeated Thanos and saved the universe!';
        }
        
        gameOverModal.classList.add('active');
        console.log('Game over modal shown');
    }
    
    showRules() {
        console.log('Showing rules');
        const rulesModal = document.getElementById('rules-modal');
        if (rulesModal) {
            rulesModal.classList.add('active');
        }
    }
    
    hideModal(modalType) {
        console.log(`Hiding modal: ${modalType}`);
        
        const modals = {
            'card': 'card-modal',
            'target': 'target-modal',
            'rules': 'rules-modal',
            'gameOver': 'game-over-modal'
        };
        
        const modalId = modals[modalType];
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        }
    }
    
    restartGame() {
        console.log('Restarting game...');
        this.hideModal('gameOver');
        
        // Reset game via main controller if available
        if (window.gameInstance) {
            window.gameInstance.restartGame();
        } else {
            // Fallback: Return to setup screen
            document.getElementById('game-screen').classList.remove('active');
            document.getElementById('setup-screen').classList.add('active');
            this.clearSelection();
        }
        
        console.log('Game restart initiated');
    }
    
    returnToMainMenu() {
        console.log('Returning to main menu...');
        this.hideModal('gameOver');
        
        // Reset game via main controller if available
        if (window.gameInstance) {
            window.gameInstance.restartGame();
        } else {
            // Fallback
            document.getElementById('game-screen').classList.remove('active');
            document.getElementById('setup-screen').classList.add('active');
            this.clearSelection();
        }
    }
    
    addLogMessage(message, type = '') {
        const logMessages = document.getElementById('log-messages');
        if (!logMessages) return;
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}] ${message}`;
        
        logMessages.appendChild(logEntry);
        logMessages.scrollTop = logMessages.scrollHeight;
    }
    
    clearSelection() {
        console.log('Clearing selection');
        this.selectedCard = null;
        this.selectedTarget = null;
        this.renderPlayerHands();
        this.updateActionButtons();
    }
    
    // IMAGE SUPPORT: Set image usage
    setUseImages(useImages) {
        this.useImages = useImages;
        console.log(`Image usage set to: ${useImages}`);
    }
    
    // IMAGE SUPPORT: Check if images are loaded
    areImagesLoaded() {
        return this.useImages && typeof imageManager !== 'undefined' && imageManager.isLoaded();
    }
}
