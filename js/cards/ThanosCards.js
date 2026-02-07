// Thanos Card Definitions
const THANOS_CARDS = [
    // Infinity Stones
    { name: 'Mind Stone', number: 1, effect: 'mindStoneEffect', isInfinityStone: true, shuffleBack: true },
    { name: 'Soul Stone', number: 2, effect: 'soulStoneEffect', isInfinityStone: true, shuffleBack: true },
    { name: 'Space Stone', number: 3, effect: 'spaceStoneEffect', isInfinityStone: true, shuffleBack: true },
    { name: 'Power Stone', number: 4, effect: 'powerStoneEffect', isInfinityStone: true, shuffleBack: true },
    { name: 'Reality Stone', number: 5, effect: 'realityStoneEffect', isInfinityStone: true, shuffleBack: true },
    { name: 'Time Stone', number: 6, effect: 'timeStoneEffect', isInfinityStone: true, shuffleBack: true },
    
    // Other Thanos Cards
    { name: 'Outrider', number: 2, effect: 'outriderEffect', isInfinityStone: false, shuffleBack: false },
    { name: 'Outrider', number: 2, effect: 'outriderEffect', isInfinityStone: false, shuffleBack: false },
    { name: 'Corvus Glaive', number: 2, effect: 'corvusGlaiveEffect', isInfinityStone: false, shuffleBack: false },
    { name: 'Black Dwarf', number: 3, effect: 'blackDwarfEffect', isInfinityStone: false, shuffleBack: false },
    { name: 'Proxima Midnight', number: 4, effect: 'proximaEffect', isInfinityStone: false, shuffleBack: false },
    { name: 'Ebony Maw', number: 5, effect: 'ebonyMawEffect', isInfinityStone: false, shuffleBack: false },
    { name: 'Thanos', number: 7, effect: 'thanosEffect', isInfinityStone: false, shuffleBack: true }
];

class ThanosCard {
    constructor(data) {
        this.name = data.name;
        this.number = data.number;
        this.effect = data.effect;
        this.isInfinityStone = data.isInfinityStone;
        this.shuffleBack = data.shuffleBack;
    }
    
    getDescription() {
        const descriptions = {
            'mindStoneEffect': 'Guess a number. Defeat all opponents with that number.',
            'soulStoneEffect': 'Choose opponent. Defeat their card if it\'s 3 or higher.',
            'spaceStoneEffect': 'Fight up to 2 different opponents.',
            'powerStoneEffect': 'Take 3 Power Tokens.',
            'realityStoneEffect': 'Draw 2 cards, then place 2 from hand on bottom of deck.',
            'timeStoneEffect': 'Copy effect of another Thanos card in discard.',
            'outriderEffect': 'Choose opponent and guess a number. If they have it, defeat it.',
            'corvusGlaiveEffect': 'Choose opponent. Defeat their card if it\'s 3 or lower.',
            'blackDwarfEffect': 'You may fight an opponent.',
            'proximaEffect': 'Take 1 Power Token.',
            'ebonyMawEffect': 'Draw 1 card, then place 1 from hand on bottom of deck.',
            'thanosEffect': 'Cannot be played.'
        };
        return descriptions[this.effect] || this.effect;
    }
}

export function createThanosDeck() {
    return THANOS_CARDS.map(data => new ThanosCard(data));
}

export function getInfinityStones() {
    return THANOS_CARDS.filter(card => card.isInfinityStone);
}
