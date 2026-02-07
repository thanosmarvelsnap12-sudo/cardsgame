// Infinity Stone Constants and Helpers
export const INFINITY_STONES = [
    { name: 'Mind Stone', number: 1, color: '#FFD700', effect: 'mindStoneEffect' },
    { name: 'Soul Stone', number: 2, color: '#FF6B6B', effect: 'soulStoneEffect' },
    { name: 'Space Stone', number: 3, color: '#4ECDC4', effect: 'spaceStoneEffect' },
    { name: 'Power Stone', number: 4, color: '#9B59B6', effect: 'powerStoneEffect' },
    { name: 'Reality Stone', number: 5, color: '#E74C3C', effect: 'realityStoneEffect' },
    { name: 'Time Stone', number: 6, color: '#1ABC9C', effect: 'timeStoneEffect' }
];

export function getStoneColor(stoneName) {
    const stone = INFINITY_STONES.find(s => s.name === stoneName);
    return stone ? stone.color : '#FFFFFF';
}

export function getAllStoneNames() {
    return INFINITY_STONES.map(stone => stone.name);
}

export function isInfinityStone(cardName) {
    return INFINITY_STONES.some(stone => stone.name === cardName);
}

export function getStoneCounts() {
    return INFINITY_STONES.length; // Always 6
}
