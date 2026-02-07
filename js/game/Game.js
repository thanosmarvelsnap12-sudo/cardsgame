import Deck from './Deck.js';
import Player from './Player.js';
import CombatSystem from './CombatSystem.js';
import { createHeroDeck } from '../cards/HeroCards.js';
import { createThanosDeck } from '../cards/ThanosCards.js';
import { INFINITY_STONES } from '../cards/InfinityStones.js';

// Main Game Class
class Game {
    constructor() {
        this.players = [];
        this.thanos = null;
        this.heroes = [];
        this.currentPlayer = null;
        this.currentTurn = 0;
        this.heroLife = 0;
        this.thanosLife = 20;
        this.heroDeck = new Deck();
        this.thanosDeck = new Deck();
        this.powerTokens = 20;
        this.infinityStonesCollected = [];
        this.gamePhase = 'setup'; // setup, playing, gameover
        this.selectedCard = null;
        this.selectedTarget = null;
        this.gameLog = [];
        this.playerCount = 0;
        this.isTwoPlayerGame = false;
        this.useImages = true; // IMAGE SUPPORT: Enable/disable images
    }
    
    // Initialize the game with players
    initialize(playerNames, thanosPlayerIndex) {
        this.playerCount = playerNames.length;
        this.isTwoPlayerGame = this.playerCount === 2;
        
        // Create players
        this.players = [];
        this.heroes = [];
        
        playerNames.forEach((name, index) => {
            const isThanos = index === thanosPlayerIndex;
            const player = new Player(index, name, isThanos);
            this.players.push(player);
            
            if (isThanos) {
                this.thanos = player;
            } else {
                this.heroes.push(player);
            }
        });
        
        // Set hero life based on player count
        this.heroLife = this.getHeroStartLife(this.playerCount);
        
        // Create and shuffle decks
        this.heroDeck = new Deck(createHeroDeck());
        this.thanosDeck = new Deck(createThanosDeck());
        this.heroDeck.shuffle();
        this.thanosDeck.shuffle();
        
        // Deal initial cards
        // Thanos gets 2 cards
        const thanosInitialCards = this.thanosDeck.drawMultiple(2);
        thanosInitialCards.forEach(card => {
            this.thanos.addToHand(card);
        });
        
        // Heroes get 1 card each
        this.heroes.forEach(hero => {
            const card = this.heroDeck.draw();
            if (card) {
                hero.addToHand(card);
            }
        });
        
        // Set starting player
        this.currentPlayer = this.thanos;
        this.gamePhase = 'playing';
        this.currentTurn = 1;
        
        this.addLog(`Game started! ${this.thanos.name} is Thanos and begins the game.`, 'setup');
        this.addLog(`Heroes start with ${this.heroLife} life.`, 'setup');
        
        return true;
    }
    
    // Get starting life for heroes based on player count
    getHeroStartLife(playerCount) {
        const lifeMap = {
            2: 20,  // 2 players
            3: 24,  // 3 players
            4: 28,  // 4 players
            5: 32,  // 5 players
            6: 36   // 6 players
        };
        return lifeMap[playerCount] || 20;
    }
    
    // IMAGE SUPPORT: Create card element with optional image background
    createCardElement(card, index, playerType, heroId = null, useImages = true) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${playerType}-card ${card.isInfinityStone ? 'infinity-stone' : ''}`;
        
        // Store data attributes
        cardDiv.dataset.index = index;
        cardDiv.dataset.cardName = card.name;
        cardDiv.dataset.cardNumber = card.number;
        
        if (playerType === 'hero') {
            cardDiv.dataset.heroId = heroId;
        }
        cardDiv.dataset.playerType = playerType;
        
        // IMAGE SUPPORT: Add image background if available and enabled
        if (useImages && typeof imageManager !== 'undefined' && imageManager.isLoaded()) {
            try {
                const imageUrl = imageManager.getCardImageUrl(card.name);
                cardDiv.style.backgroundImage = `url('${imageUrl}')`;
                cardDiv.style.backgroundSize = 'cover';
                cardDiv.style.backgroundPosition = 'center';
                cardDiv.classList.add('has-image');
                
                // Check if this is a fallback image
                const img = imageManager.getCardImage(card.name);
                if (img && img.isFallback) {
                    cardDiv.classList.add('is-fallback');
                }
            } catch (error) {
                console.warn(`Failed to set image for ${card.name}:`, error);
                cardDiv.classList.add('image-failed');
            }
        } else {
            cardDiv.classList.add('no-image');
        }
        
        // Card content (overlay on image or standalone)
        const effectText = card.getDescription ? card.getDescription() : 
                          (card.effect || 'No effect description');
        
        cardDiv.innerHTML = `
            <div class="card-content">
                <div class="card-number">${card.number}</div>
                <div class="card-name">${card.name}</div>
                <div class="card-effect">${effectText}</div>
            </div>
        `;
        
        // Add hover effect
        cardDiv.addEventListener('mouseenter', () => {
            if (!cardDiv.classList.contains('selected')) {
                cardDiv.style.transform = 'translateY(-8px) scale(1.03)';
                cardDiv.style.zIndex = '100';
            }
        });
        
        cardDiv.addEventListener('mouseleave', () => {
            if (!cardDiv.classList.contains('selected')) {
                cardDiv.style.transform = '';
                cardDiv.style.zIndex = '';
            }
        });
        
        return cardDiv;
    }
    
    // IMAGE SUPPORT: Update stone display with optional images
    updateStoneDisplayWithImages(useImages = true) {
        const stonesContainer = document.getElementById('stones-container');
        if (!stonesContainer) return;
        
        stonesContainer.innerHTML = '';
        
        const stones = ['Mind Stone', 'Soul Stone', 'Space Stone', 
                       'Power Stone', 'Reality Stone', 'Time Stone'];
        
        stones.forEach(stoneName => {
            const stoneSlot = document.createElement('div');
            const isCollected = this.infinityStonesCollected.includes(stoneName);
            stoneSlot.className = `stone-slot ${isCollected ? 'collected' : ''}`;
            stoneSlot.title = `${stoneName}${isCollected ? ' (Collected)' : ' (Missing)'}`;
            
            if (isCollected) {
                if (useImages && typeof imageManager !== 'undefined') {
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
                stoneSlot.style.color = '#666';
            }
            
            stonesContainer.appendChild(stoneSlot);
        });
    }
    
    // Helper method for stone colors
    getStoneColor(stoneName) {
        const colors = {
            'Mind Stone': '#FFD700',     // Gold
            'Soul Stone': '#FF6B6B',     // Red
            'Space Stone': '#4ECDC4',    // Teal
            'Power Stone': '#9B59B6',    // Purple
            'Reality Stone': '#E74C3C',  // Orange-red
            'Time Stone': '#1ABC9C'      // Green
        };
        return colors[stoneName] || '#FFFFFF';
    }
    
    // IMAGE SUPPORT: Render player hands with optional images
    renderPlayerHandsWithImages(useImages = true) {
        // Thanos hand
        const thanosHandDiv = document.getElementById('thanos-hand');
        if (thanosHandDiv) {
            thanosHandDiv.innerHTML = '';
            
            this.thanos.hand.forEach((card, index) => {
                const cardElement = this.createCardElement(card, index, 'thanos', null, useImages);
                
                // Add click handler for card selection
                cardElement.addEventListener('click', () => {
                    // Remove selection from all cards
                    document.querySelectorAll('.card.selected').forEach(card => {
                        card.classList.remove('selected');
                    });
                    
                    // Select this card
                    cardElement.classList.add('selected');
                    
                    // Update action buttons
                    const playCardBtn = document.getElementById('play-card-btn');
                    if (playCardBtn) {
                        playCardBtn.disabled = false;
                    }
                    
                    // Store selected card info
                    if (window.gameInstance && window.gameInstance.gameBoard) {
                        window.gameInstance.gameBoard.selectedCard = {
                            card,
                            index,
                            playerType: 'thanos',
                            heroId: null
                        };
                    }
                });
                
                thanosHandDiv.appendChild(cardElement);
            });
        }
        
        // Heroes hands
        const heroesHandsDiv = document.getElementById('heroes-hands');
        if (heroesHandsDiv) {
            heroesHandsDiv.innerHTML = '';
            
            this.heroes.forEach(hero => {
                const heroHandDiv = document.createElement('div');
                heroHandDiv.className = 'hero-hand-container';
                
                const heroLabel = document.createElement('div');
                heroLabel.className = 'hero-label';
                const isCurrentPlayer = hero.id === this.currentPlayer?.id;
                heroLabel.textContent = `${hero.name}${isCurrentPlayer ? ' (Current)' : ''}`;
                if (isCurrentPlayer) {
                    heroLabel.classList.add('current-player');
                }
                heroHandDiv.appendChild(heroLabel);
                
                const cardsDiv = document.createElement('div');
                cardsDiv.className = 'hero-cards';
                
                hero.hand.forEach((card, index) => {
                    const cardElement = this.createCardElement(card, index, 'hero', hero.id, useImages);
                    
                    // Add click handler for card selection
                    cardElement.addEventListener('click', () => {
                        // Only allow current player to select their cards
                        if (hero.id !== this.currentPlayer?.id) {
                            return;
                        }
                        
                        // Remove selection from all cards
                        document.querySelectorAll('.card.selected').forEach(card => {
                            card.classList.remove('selected');
                        });
                        
                        // Select this card
                        cardElement.classList.add('selected');
                        
                        // Update action buttons
                        const playCardBtn = document.getElementById('play-card-btn');
                        if (playCardBtn) {
                            playCardBtn.disabled = false;
                        }
                        
                        // Store selected card info
                        if (window.gameInstance && window.gameInstance.gameBoard) {
                            window.gameInstance.gameBoard.selectedCard = {
                                card,
                                index,
                                playerType: 'hero',
                                heroId: hero.id
                            };
                        }
                    });
                    
                    cardsDiv.appendChild(cardElement);
                });
                
                heroHandDiv.appendChild(cardsDiv);
                heroesHandsDiv.appendChild(heroHandDiv);
            });
        }
        
        // Update stone display
        this.updateStoneDisplayWithImages(useImages);
    }
    
    // Play a card
    playCard(player, cardIndex, target = null) {
        // Validate it's player's turn
        if (!this.isPlayerTurn(player)) {
            return { success: false, message: 'Not your turn' };
        }
        
        // Validate card index
        if (cardIndex < 0 || cardIndex >= player.hand.length) {
            return { success: false, message: 'Invalid card index' };
        }
        
        const card = player.hand[cardIndex];
        
        // Special case: Thanos card cannot be played
        if (card.name === 'Thanos') {
            this.addLog(`${player.name} cannot play the Thanos card!`, 'error');
            return { success: false, message: 'Thanos card cannot be played' };
        }
        
        // Remove card from hand
        const playedCard = player.removeFromHand(cardIndex);
        
        // Add to discard
        if (player.isThanos) {
            this.thanosDeck.discard(playedCard);
        } else {
            this.heroDeck.discard(playedCard);
        }
        
        this.addLog(`${player.name} plays ${playedCard.name}`, 'card-play');
        
        // Execute card effect
        const effectResult = this.executeCardEffect(playedCard, player, target);
        
        // Check for Infinity Stone collection
        if (playedCard.isInfinityStone && player.isThanos) {
            if (!this.infinityStonesCollected.includes(playedCard.name)) {
                this.infinityStonesCollected.push(playedCard.name);
                this.addLog(`Thanos collects the ${playedCard.name}!`, 'infinity-stone');
                
                // Check for Snap win
                if (this.infinityStonesCollected.length === 6) {
                    return { 
                        success: true, 
                        gameOver: 'THANOS_SNAP',
                        message: 'Thanos collects all Infinity Stones!' 
                    };
                }
            }
        }
        
        // Redraw for player
        this.redrawCard(player);
        
        return { 
            success: true, 
            message: `Played ${playedCard.name}`,
            card: playedCard,
            effectResult
        };
    }
    
    // Execute card effect
    executeCardEffect(card, player, target = null) {
        // This is a simplified version - in a full implementation,
        // each effect would have its own detailed logic
        const effect = card.effect;
        let result = { effect, executed: true };
        
        switch (effect) {
            case 'takePowerToken':
            case 'proximaEffect':
                this.takePowerToken(player);
                result.message = `${player.name} takes 1 Power Token`;
                break;
                
            case 'powerStoneEffect':
                this.takePowerToken(player, 3);
                result.message = `${player.name} takes 3 Power Tokens`;
                break;
                
            default:
                result.message = `${player.name} uses ${card.name}'s ability`;
        }
        
        this.addLog(result.message, 'card-effect');
        return result;
    }
    
    // Redraw a card for player
    redrawCard(player) {
        if (player.isThanos) {
            const newCard = this.thanosDeck.draw();
            if (newCard) {
                player.addToHand(newCard);
            }
        } else {
            const newCard = this.heroDeck.draw();
            if (newCard) {
                player.addToHand(newCard);
            } else {
                // Reshuffle hero discard if deck is empty
                if (this.heroDeck.getDiscardCount() > 0) {
                    this.heroDeck.reshuffleFromDiscard();
                    const reshuffledCard = this.heroDeck.draw();
                    if (reshuffledCard) {
                        player.addToHand(reshuffledCard);
                        this.addLog('Hero deck reshuffled from discard!', 'deck');
                    }
                }
            }
        }
    }
    
    // Defeat a card
    defeatCard(player, cardIndex) {
        const card = player.removeFromHand(cardIndex);
        if (!card) {
            return { success: false, message: 'No card to defeat' };
        }
        
        // Add to appropriate discard
        if (player.isThanos) {
            this.thanosDeck.discard(card);
            
            // Check if card should shuffle back
            if (card.shuffleBack) {
                setTimeout(() => {
                    this.thanosDeck.addToBottom(card);
                    const discardIndex = this.thanosDeck.discardPile.indexOf(card);
                    if (discardIndex > -1) {
                        this.thanosDeck.discardPile.splice(discardIndex, 1);
                    }
                    this.addLog(`${card.name} is shuffled back into Thanos's deck.`, 'shuffle');
                }, 1000);
            }
        } else {
            this.heroDeck.discard(card);
        }
        
        // Team loses life
        if (player.isThanos) {
            this.thanosLife = Math.max(0, this.thanosLife - 1);
            this.addLog(`Thanos loses 1 Life! (Now: ${this.thanosLife})`, 'life-loss');
        } else {
            this.heroLife = Math.max(0, this.heroLife - 1);
            this.addLog(`Heroes lose 1 Life! (Now: ${this.heroLife})`, 'life-loss');
        }
        
        // Redraw for player
        this.redrawCard(player);
        
        return { success: true, card, message: `${player.name}'s ${card.name} was defeated` };
    }
    
    // Take power tokens
    takePowerToken(player, count = 1) {
        const tokensToTake = Math.min(count, this.powerTokens);
        if (tokensToTake > 0) {
            for (let i = 0; i < tokensToTake; i++) {
                player.addToken();
            }
            this.powerTokens -= tokensToTake;
            return tokensToTake;
        }
        return 0;
    }
    
    // Move to next turn
    nextTurn() {
        if (this.gamePhase !== 'playing') return null;
        
        const currentIndex = this.players.indexOf(this.currentPlayer);
        let nextIndex = (currentIndex + 1) % this.players.length;
        
        this.currentPlayer = this.players[nextIndex];
        
        // If we've completed a full round, increment turn counter
        if (nextIndex === 0) {
            this.currentTurn++;
        }
        
        this.addLog(`${this.currentPlayer.name}'s turn begins.`, 'turn');
        
        return this.currentPlayer;
    }
    
    // Check if it's player's turn
    isPlayerTurn(player) {
        return this.currentPlayer && this.currentPlayer.id === player.id;
    }
    
    // Check win conditions
    checkWinConditions() {
        if (this.heroLife <= 0) {
            return { winner: 'THANOS', type: 'LIFE', message: 'Heroes have no life remaining' };
        }
        
        if (this.thanosLife <= 0) {
            return { winner: 'HEROES', type: 'LIFE', message: 'Thanos has no life remaining' };
        }
        
        if (this.infinityStonesCollected.length === 6) {
            return { winner: 'THANOS', type: 'SNAP', message: 'Thanos collected all Infinity Stones' };
        }
        
        return null;
    }
    
    // End the game
    endGame(reason) {
        this.gamePhase = 'gameover';
        
        const winCondition = this.checkWinConditions();
        if (winCondition) {
            this.addLog(`=== GAME OVER ===`, 'game-over');
            this.addLog(`${winCondition.winner} WIN! ${winCondition.message}`, 'game-over');
            return winCondition;
        }
        
        return { winner: 'UNKNOWN', type: 'OTHER', message: 'Game ended' };
    }
    
    // Get current game state
    getGameState() {
        return {
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                isThanos: p.isThanos,
                handSize: p.hand.length,
                tokens: p.tokens,
                hand: p.hand.map(c => ({ name: c.name, number: c.number }))
            })),
            currentPlayer: this.currentPlayer ? this.currentPlayer.id : null,
            heroLife: this.heroLife,
            thanosLife: this.thanosLife,
            heroDeckCount: this.heroDeck.getCount(),
            thanosDeckCount: this.thanosDeck.getCount(),
            powerTokens: this.powerTokens,
            infinityStonesCollected: this.infinityStonesCollected,
            turn: this.currentTurn,
            phase: this.gamePhase,
            useImages: this.useImages
        };
    }
    
    // Add log entry
    addLog(message, type = 'info') {
        const entry = {
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message,
            type
        };
        this.gameLog.push(entry);
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Dispatch event for UI updates
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('gameLog', { detail: entry });
            window.dispatchEvent(event);
        }
        
        return entry;
    }
    
    // Get game log
    getLog() {
        return this.gameLog;
    }
    
    // IMAGE SUPPORT: Set image usage
    setUseImages(useImages) {
        this.useImages = useImages;
    }
    
    // IMAGE SUPPORT: Check if images are available
    hasImages() {
        return typeof imageManager !== 'undefined' && imageManager.isLoaded();
    }
    
    // Reset the game
    reset() {
        this.players = [];
        this.thanos = null;
        this.heroes = [];
        this.currentPlayer = null;
        this.currentTurn = 0;
        this.heroLife = 0;
        this.thanosLife = 20;
        this.heroDeck = new Deck();
        this.thanosDeck = new Deck();
        this.powerTokens = 20;
        this.infinityStonesCollected = [];
        this.gamePhase = 'setup';
        this.selectedCard = null;
        this.selectedTarget = null;
        this.gameLog = [];
        this.playerCount = 0;
        this.isTwoPlayerGame = false;
        this.useImages = true;
    }
}
