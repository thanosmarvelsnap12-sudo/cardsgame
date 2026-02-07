// Card Class Definition
class Card {
    constructor(name, number, effect, isInfinityStone = false, shuffleBack = false) {
        this.name = name;
        this.number = parseInt(number);
        this.effect = effect;
        this.isInfinityStone = isInfinityStone;
        this.shuffleBack = shuffleBack;
        this.isRevealed = false;
    }
    
    getDescription() {
        const effectDescriptions = {
            'guessThanosHand': 'Guess a number. If Thanos has it, defeat one.',
            'peekAtThanosCard': 'Let another Hero peek at Thanos\'s hand.',
            'mayFightThanos': 'You may fight Thanos.',
            'takePowerToken': 'Take 1 Power Token.',
            'rearrangeHeroDeck': 'Look at top 3 Hero cards, rearrange them.',
            'compelFight': 'Force a Hero (or yourself) to fight Thanos.',
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
        
        return effectDescriptions[this.effect] || this.effect;
    }
    
    executeEffect(game, player, target = null) {
        console.log(`Executing ${this.name} effect: ${this.effect}`);
        // Effect execution logic will be handled in the Game class
        return { success: true, effect: this.effect, card: this };
    }
    
    toJSON() {
        return {
            name: this.name,
            number: this.number,
            effect: this.effect,
            isInfinityStone: this.isInfinityStone,
            shuffleBack: this.shuffleBack,
            description: this.getDescription()
        };
    }
}
