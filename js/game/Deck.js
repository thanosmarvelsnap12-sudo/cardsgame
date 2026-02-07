// Deck Management Class
class Deck {
    constructor(cards = []) {
        this.cards = [...cards];
        this.discardPile = [];
    }
    
    // Shuffle the deck using Fisher-Yates algorithm
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this;
    }
    
    // Draw a card from the top
    draw() {
        if (this.cards.length === 0) {
            // If deck is empty, reshuffle discard pile
            this.reshuffleFromDiscard();
        }
        return this.cards.length > 0 ? this.cards.pop() : null;
    }
    
    // Draw multiple cards
    drawMultiple(count) {
        const drawnCards = [];
        for (let i = 0; i < count; i++) {
            const card = this.draw();
            if (card) {
                drawnCards.push(card);
            }
        }
        return drawnCards;
    }
    
    // Add a card to the top of the deck
    addToTop(card) {
        this.cards.push(card);
    }
    
    // Add a card to the bottom of the deck
    addToBottom(card) {
        this.cards.unshift(card);
    }
    
    // Add a card to the discard pile
    discard(card) {
        this.discardPile.push(card);
    }
    
    // Reshuffle discard pile back into deck
    reshuffleFromDiscard() {
        if (this.discardPile.length > 0) {
            this.cards = [...this.discardPile];
            this.shuffle();
            this.discardPile = [];
            return true;
        }
        return false;
    }
    
    // Get number of cards in deck
    getCount() {
        return this.cards.length;
    }
    
    // Get number of cards in discard pile
    getDiscardCount() {
        return this.discardPile.length;
    }
    
    // Check if deck is empty
    isEmpty() {
        return this.cards.length === 0;
    }
    
    // Check if discard pile is empty
    isDiscardEmpty() {
        return this.discardPile.length === 0;
    }
    
    // Get all cards (for debugging)
    getAllCards() {
        return [...this.cards];
    }
    
    // Get all discarded cards
    getAllDiscarded() {
        return [...this.discardPile];
    }
    
    // Clear the deck
    clear() {
        this.cards = [];
        this.discardPile = [];
    }
    
    // Get card at specific position (for peeking)
    peek(index = 0) {
        if (index >= 0 && index < this.cards.length) {
            return this.cards[this.cards.length - 1 - index];
        }
        return null;
    }
    
    // Look at top N cards without removing them
    peekTop(count) {
        const result = [];
        for (let i = 0; i < count && i < this.cards.length; i++) {
            result.push(this.peek(i));
        }
        return result;
    }
}
