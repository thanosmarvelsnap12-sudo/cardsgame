// Player Class
class Player {
    constructor(id, name, isThanos = false) {
        this.id = id;
        this.name = name;
        this.isThanos = isThanos;
        this.hand = [];
        this.tokens = 0;
        this.discard = [];
        this.isActive = true;
    }
    
    // Add a card to hand
    addToHand(card) {
        if (card) {
            this.hand.push(card);
            return true;
        }
        return false;
    }
    
    // Remove a card from hand by index
    removeFromHand(cardIndex) {
        if (cardIndex >= 0 && cardIndex < this.hand.length) {
            return this.hand.splice(cardIndex, 1)[0];
        }
        return null;
    }
    
    // Add power token
    addToken() {
        this.tokens++;
    }
    
    // Spend a power token (for fights)
    spendToken() {
        if (this.tokens > 0) {
            this.tokens--;
            return true;
        }
        return false;
    }
    
    // Discard a card
    discardCard(card) {
        this.discard.push(card);
    }
    
    // Check if player has a card with specific number
    hasCardNumber(number) {
        return this.hand.some(card => card.number === number);
    }
    
    // Get all cards with specific number
    getCardsByNumber(number) {
        return this.hand.filter(card => card.number === number);
    }
    
    // Get hand size
    getHandSize() {
        return this.hand.length;
    }
    
    // Clear hand (for game reset)
    clearHand() {
        this.hand = [];
    }
    
    // Get player info
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            isThanos: this.isThanos,
            handSize: this.hand.length,
            tokens: this.tokens,
            isActive: this.isActive
        };
    }
    
    // Check if player has any Infinity Stones
    hasInfinityStones() {
        return this.hand.some(card => card.isInfinityStone);
    }
    
    // Get Infinity Stones in hand
    getInfinityStones() {
        return this.hand.filter(card => card.isInfinityStone);
    }
}
