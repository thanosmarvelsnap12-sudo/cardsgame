// IMAGE MANAGER - Handles loading and displaying images

class ImageManager {
    constructor() {
        this.images = new Map();
        this.loaded = false;
        this.loadingPromises = [];
    }
    
    // Preload all images
    async preloadImages() {
        console.log('Starting image preload...');
        
        const imagesToLoad = [];
        
        // Load card images
        for (const [cardName, path] of Object.entries(IMAGE_CONFIG.cards)) {
            imagesToLoad.push(this.loadImage(cardName, path));
        }
        
        // Load other assets
        for (const [tokenName, path] of Object.entries(IMAGE_CONFIG.tokens)) {
            imagesToLoad.push(this.loadImage(`token_${tokenName}`, path));
        }
        
        for (const [uiName, path] of Object.entries(IMAGE_CONFIG.ui)) {
            imagesToLoad.push(this.loadImage(`ui_${uiName}`, path));
        }
        
        try {
            await Promise.all(imagesToLoad);
            this.loaded = true;
            console.log('All images loaded successfully!');
            return true;
        } catch (error) {
            console.warn('Some images failed to load:', error);
            // Continue anyway with fallback images
            return false;
        }
    }
    
    // Load single image
    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (this.images.has(key)) {
                resolve(this.images.get(key));
                return;
            }
            
            const img = new Image();
            
            img.onload = () => {
                this.images.set(key, img);
                console.log(`✓ Loaded: ${key}`);
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`✗ Failed to load: ${src}`);
                // Use fallback
                const fallback = this.createFallbackImage(key);
                this.images.set(key, fallback);
                resolve(fallback);
            };
            
            // Start loading
            img.src = src;
        });
    }
    
    // Create fallback image when real image fails
    createFallbackImage(key) {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 180;
        const ctx = canvas.getContext('2d');
        
        // Choose color based on card type
        let bgColor, borderColor;
        
        if (key.includes('Stone') || key.includes('stone')) {
            bgColor = '#2a0a4a';
            borderColor = '#FFD700';
        } else if (key.includes('Thanos') || key.includes('thanos')) {
            bgColor = '#6B2D5C';
            borderColor = '#FF6B6B';
        } else {
            bgColor = '#1a1a2e';
            borderColor = '#4ECDC4';
        }
        
        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 120, 180);
        
        // Draw border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(2, 2, 116, 176);
        
        // Draw card name
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        
        // Extract short name for display
        const displayName = key.split(' ')[0];
        ctx.fillText(displayName, 60, 90);
        
        // Draw card number
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 24px Arial';
        const cardNumber = this.getCardNumberFromName(key);
        ctx.fillText(cardNumber, 60, 130);
        
        // Convert to Image object
        const img = new Image();
        img.src = canvas.toDataURL();
        img.isFallback = true;
        return img;
    }
    
    // Helper to get card number from name
    getCardNumberFromName(name) {
        const numberMap = {
            'Nebula': 1, 'Spider-Man': 1, 'Star-Lord': 1,
            'Black Widow': 2, 'Gamora': 2, 'Ant-Man & Wasp': 2,
            'Captain America': 3, 'Hulk': 3, 'Thor': 3,
            'Black Panther': 4, 'Falcon': 4, 'Doctor Strange': 4,
            'Scarlet Witch': 5, 'Vision': 5,
            'Captain Marvel': 6, 'Iron Man': 6,
            'Mind Stone': 1, 'Soul Stone': 2, 'Space Stone': 3,
            'Power Stone': 4, 'Reality Stone': 5, 'Time Stone': 6,
            'Outrider': 2, 'Corvus Glaive': 2, 'Black Dwarf': 3,
            'Proxima Midnight': 4, 'Ebony Maw': 5, 'Thanos': 7
        };
        return numberMap[name] || '?';
    }
    
    // Get loaded image
    getImage(key) {
        return this.images.get(key) || this.createFallbackImage(key);
    }
    
    // Get card image by name
    getCardImage(cardName) {
        return this.getImage(cardName);
    }
    
    // Get card image URL (for CSS backgrounds)
    getCardImageUrl(cardName) {
        const img = this.getCardImage(cardName);
        return img.src || IMAGE_CONFIG.defaultCard;
    }
    
    // Check if all images loaded
    isLoaded() {
        return this.loaded;
    }
    
    // Clear all images
    clear() {
        this.images.clear();
        this.loaded = false;
    }
}

// Create global instance
const imageManager = new ImageManager();
