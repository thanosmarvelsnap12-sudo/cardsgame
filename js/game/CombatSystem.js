// Combat System
class CombatSystem {
    static fight(attacker, defender, attackerCardIndex = 0, defenderCardIndex = 0) {
        // Validate both players have cards
        if (attacker.hand.length === 0 || defender.hand.length === 0) {
            return {
                success: false,
                message: 'One or both players have no cards to fight with'
            };
        }
        
        // Get the cards being used in combat
        const attackerCard = attacker.hand[attackerCardIndex];
        const defenderCard = defender.hand[defenderCardIndex];
        
        if (!attackerCard || !defenderCard) {
            return {
                success: false,
                message: 'Invalid card selection for combat'
            };
        }
        
        // Calculate base values
        let attackerValue = attackerCard.number;
        let defenderValue = defenderCard.number;
        
        // Apply power tokens
        let attackerUsedToken = false;
        let defenderUsedToken = false;
        
        if (attacker.tokens > 0) {
            attackerValue += 2;
            attackerUsedToken = true;
        }
        
        if (defender.tokens > 0) {
            defenderValue += 2;
            defenderUsedToken = true;
        }
        
        // Determine winner
        let winner = null;
        let loser = null;
        let winningCard = null;
        let losingCard = null;
        let message = '';
        
        if (attackerValue > defenderValue) {
            // Attacker wins
            winner = attacker;
            loser = defender;
            winningCard = attackerCard;
            losingCard = defenderCard;
            message = `${attacker.name}'s ${attackerCard.name} (${attackerValue}) defeats ${defender.name}'s ${defenderCard.name} (${defenderValue})`;
        } else if (defenderValue > attackerValue) {
            // Defender wins
            winner = defender;
            loser = attacker;
            winningCard = defenderCard;
            losingCard = attackerCard;
            message = `${defender.name}'s ${defenderCard.name} (${defenderValue}) defeats ${attacker.name}'s ${attackerCard.name} (${attackerValue})`;
        } else {
            // Tie
            message = `Tie! ${attacker.name}'s ${attackerCard.name} (${attackerValue}) vs ${defender.name}'s ${defenderCard.name} (${defenderValue})`;
        }
        
        return {
            success: true,
            winner,
            loser,
            winningCard,
            losingCard,
            attackerValue,
            defenderValue,
            attackerUsedToken,
            defenderUsedToken,
            message,
            isTie: winner === null
        };
    }
    
    static canPlayerFight(player) {
        return player.hand.length > 0;
    }
    
    static calculateCardValue(cardNumber, hasToken) {
        return hasToken ? cardNumber + 2 : cardNumber;
    }
    
    static getWinningCard(attackerCard, defenderCard, attackerHasToken, defenderHasToken) {
        const attackerValue = this.calculateCardValue(attackerCard.number, attackerHasToken);
        const defenderValue = this.calculateCardValue(defenderCard.number, defenderHasToken);
        
        if (attackerValue > defenderValue) return attackerCard;
        if (defenderValue > attackerValue) return defenderCard;
        return null; // Tie
    }
    
    static simulateFight(attackerCard, defenderCard, attackerTokens, defenderTokens) {
        const attackerValue = attackerCard.number + (attackerTokens > 0 ? 2 : 0);
        const defenderValue = defenderCard.number + (defenderTokens > 0 ? 2 : 0);
        
        if (attackerValue > defenderValue) {
            return { winner: 'attacker', attackerValue, defenderValue };
        } else if (defenderValue > attackerValue) {
            return { winner: 'defender', attackerValue, defenderValue };
        } else {
            return { winner: 'tie', attackerValue, defenderValue };
        }
    }
}
