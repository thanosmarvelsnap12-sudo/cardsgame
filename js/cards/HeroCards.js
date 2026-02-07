// Hero Card Definitions
const HERO_CARDS = [
    // Number 1 Cards
    { name: 'Nebula', number: 1, effect: 'guessThanosHand' },
    { name: 'Spider-Man', number: 1, effect: 'guessThanosHand' },
    { name: 'Star-Lord', number: 1, effect: 'guessThanosHand' },
    
    // Number 2 Cards
    { name: 'Black Widow', number: 2, effect: 'peekAtThanosCard' },
    { name: 'Gamora', number: 2, effect: 'peekAtThanosCard' },
    { name: 'Ant-Man & Wasp', number: 2, effect: 'peekAtThanosCard' },
    
    // Number 3 Cards
    { name: 'Captain America', number: 3, effect: 'mayFightThanos' },
    { name: 'Hulk', number: 3, effect: 'mayFightThanos' },
    { name: 'Thor', number: 3, effect: 'mayFightThanos' },
    
    // Number 4 Cards
    { name: 'Black Panther', number: 4, effect: 'takePowerToken' },
    { name: 'Falcon', number: 4, effect: 'takePowerToken' },
    { name: 'Doctor Strange', number: 4, effect: 'takePowerToken' },
    
    // Number 5 Cards
    { name: 'Scarlet Witch', number: 5, effect: 'rearrangeHeroDeck' },
    { name: 'Vision', number: 5, effect: 'rearrangeHeroDeck' },
    
    // Number 6 Cards
    { name: 'Captain Marvel', number: 6, effect: 'compelFight' },
    { name: 'Iron Man', number: 6, effect: 'compelFight' }
];

class HeroCard {
    constructor(data) {
        this.name = data.name;
        this.number = data.number;
        this.effect = data.effect;
        this.isInfinityStone = false;
        this.shuffleBack = false;
    }
    
    getDescription() {
        const descriptions = {
            'guessThanosHand': 'Guess a number. If Thanos has it, defeat one.',
            'peekAtThanosCard': 'Let another Hero peek at Thanos\'s hand.',
            'mayFightThanos': 'You may fight Thanos.',
            'takePowerToken': 'Take 1 Power Token.',
            'rearrangeHeroDeck': 'Look at top 3 Hero cards, rearrange them.',
            'compelFight': 'Force a Hero (or yourself) to fight Thanos.'
        };
        return descriptions[this.effect] || this.effect;
    }
}

export function createHeroDeck() {
    return HERO_CARDS.map(data => new HeroCard(data));
}

export function getHeroCardCounts() {
    const counts = {};
    HERO_CARDS.forEach(card => {
        counts[card.number] = (counts[card.number] || 0) + 1;
    });
    return counts;
}
