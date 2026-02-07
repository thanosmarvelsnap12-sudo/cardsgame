// js/image-loader.js
class AssetLoader {
    constructor() {
        this.assets = {
            characters: {
                thanos: 'assets/characters/thanos.png',
                ebonyMaw: 'assets/characters/ebony-maw.png',
                corvusGlaive: 'assets/characters/corvus-glaive.png',
                proximaMidnight: 'assets/characters/proxima-midnight.png',
                blackDwarf: 'assets/characters/black-dwarf.png'
            },
            stones: {
                power: 'assets/stones/power-stone@3x.png',
                time: 'assets/stones/time-stone@3x.png',
                mind: 'assets/stones/mind-stone@3x.png',
                reality: 'assets/stones/reality-stone@3x.png',
                space: 'assets/stones/space-stone@1x.png',
                soul: 'assets/stones/soul-stone@1x.png'
            },
            enemies: {
                outriders: 'assets/enemies/outriders.png'
            }
        };
        
        this.loadedImages = {};
        this.failedImages = [];
    }
    
    async loadAll() {
        console.log('🔄 Loading Infinity Gauntlet assets...');
        
        const promises = [];
        
        // Load all assets
        for (const category in this.assets) {
            for (const name in this.assets[category]) {
                promises.push(this.loadImage(name, this.assets[category][name], category));
            }
        }
        
        await Promise.allSettled(promises);
        
        if (this.failedImages.length > 0) {
            console.warn('⚠️ Some images failed to load:', this.failedImages);
            return false;
        }
        
        console.log('✅ All assets loaded successfully!');
        return true;
    }
    
    async loadImage(name, path, category = '') {
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                this.loadedImages[name] = img;
                console.log(`✅ Loaded: ${path}`);
                resolve(true);
            };
            
            img.onerror = () => {
                console.error(`❌ Failed to load: ${path}`);
                this.failedImages.push(path);
                
                // Create fallback colored rectangle
                const canvas = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                
                // Different colors for different categories
                const colors = {
                    characters: '#e74c3c',
                    stones: '#3498db',
                    enemies: '#2ecc71'
                };
                
                ctx.fillStyle = colors[category] || '#95a5a6';
                ctx.fillRect(0, 0, 200, 200);
                ctx.fillStyle = 'white';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(name.toUpperCase(), 100, 100);
                
                this.loadedImages[name] = canvas;
                resolve(false);
            };
            
            img.src = path;
        });
    }
    
    getImage(name) {
        return this.loadedImages[name] || null;
    }
}

// Usage in your game:
/*
const loader = new AssetLoader();
const success = await loader.loadAll();

if (!success) {
    // Show "Skip image loading" option
    document.getElementById('skip-loading').style.display = 'block';
}

// Get image when needed
const thanosImage = loader.getImage('thanos');
*/
