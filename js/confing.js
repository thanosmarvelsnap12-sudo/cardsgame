// IMAGE CONFIGURATION
// Update these paths to match YOUR image files

const IMAGE_CONFIG = {
    // Default fallback image (safe SVG)
    defaultCard: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMWExYTJlIiBzdHJva2U9IiM0ZWNkYzQiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjYwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q0FSRDwvdGV4dD48L3N2Zz4=',
    
    // Card image paths - UPDATE THESE!
    cards: {
        // Hero Cards
        'Nebula': 'assets/cards/heroes/nebula.png',
        'Spider-Man': 'assets/cards/heroes/spider-man.png',
        'Star-Lord': 'assets/cards/heroes/star-lord.png',
        'Black Widow': 'assets/cards/heroes/black-widow.png',
        'Gamora': 'assets/cards/heroes/gamora.png',
        'Ant-Man & Wasp': 'assets/cards/heroes/ant-man-wasp.png',
        'Captain America': 'assets/cards/heroes/captain-america.png',
        'Hulk': 'assets/cards/heroes/hulk.png',
        'Thor': 'assets/cards/heroes/thor.png',
        'Black Panther': 'assets/cards/heroes/black-panther.png',
        'Falcon': 'assets/cards/heroes/falcon.png',
        'Doctor Strange': 'assets/cards/heroes/doctor-strange.png',
        'Scarlet Witch': 'assets/cards/heroes/scarlet-witch.png',
        'Vision': 'assets/cards/heroes/vision.png',
        'Captain Marvel': 'assets/cards/heroes/captain-marvel.png',
        'Iron Man': 'assets/cards/heroes/iron-man.png',
        
        // Thanos Cards
        'Mind Stone': 'assets/cards/stones/mind-stone.png',
        'Soul Stone': 'assets/cards/stones/soul-stone.png',
        'Space Stone': 'assets/cards/stones/space-stone.png',
        'Power Stone': 'assets/cards/stones/power-stone.png',
        'Reality Stone': 'assets/cards/stones/reality-stone.png',
        'Time Stone': 'assets/cards/stones/time-stone.png',
        'Outrider': 'assets/cards/thanos/outrider.png',
        'Corvus Glaive': 'assets/cards/thanos/corvus-glaive.png',
        'Black Dwarf': 'assets/cards/thanos/black-dwarf.png',
        'Proxima Midnight': 'assets/cards/thanos/proxima-midnight.png',
        'Ebony Maw': 'assets/cards/thanos/ebony-maw.png',
        'Thanos': 'assets/cards/thanos/thanos.png'
    },
    
    // Other assets
    tokens: {
        power: 'assets/tokens/power-token.png'
    },
    
    // UI elements
    ui: {
        cardBack: 'assets/ui/card-back.png',
        infinityGauntlet: 'assets/ui/infinity-gauntlet.png',
        heroBackground: 'assets/ui/hero-bg.png',
        thanosBackground: 'assets/ui/thanos-bg.png'
    }
};

// Function to get image path for a card
function getCardImage(cardName) {
    return IMAGE_CONFIG.cards[cardName] || IMAGE_CONFIG.defaultCard;
}

// Function to check if images exist
async function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}
