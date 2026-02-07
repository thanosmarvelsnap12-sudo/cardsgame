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
            const stoneSlot
