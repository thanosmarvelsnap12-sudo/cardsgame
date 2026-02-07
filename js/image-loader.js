// js/image-loader.js

class AssetLoader {
    constructor() {
        // Asset configuration with correct paths
        this.assets = {
            characters: {
                thanos: 'assets/characters/thanos.png',
                ebonyMaw: 'assets/characters/ebony-maw.png',
                corvusGlaive: 'assets/characters/corvus-glaive.png',
                proximaMidnight: 'assets/characters/proxima-midnight.png',
                blackDwarf: 'assets/characters/black-dwarf.png'
            },
            stones: {
                powerStone: 'assets/stones/power-stone@3x.png',
                timeStone: 'assets/stones/time-stone@3x.png',
                mindStone: 'assets/stones/mind-stone@3x.png',
                realityStone: 'assets/stones/reality-stone@3x.png',
                spaceStone: 'assets/stones/space-stone@1x.png',
                soulStone: 'assets/stones/soul-stone@1x.png'
            },
            enemies: {
                outriders: 'assets/enemies/outriders.png'
            }
        };
        
        // Store loaded images
        this.loadedImages = {};
        this.failedImages = [];
        
        // Progress callback
        this.onProgress = null;
        
        console.log('🎮 AssetLoader initialized with', this.countAssets(), 'assets');
    }
    
    // Count total assets
    countAssets() {
        let count = 0;
        for (const category in this.assets) {
            count += Object.keys(this.assets[category]).length;
        }
        return count;
    }
    
    // Load all assets
    async loadAll() {
        console.log('🔄 Loading all assets...');
        
        const totalAssets = this.countAssets();
        let loadedCount = 0;
        
        // Update progress
        if (this.onProgress) {
            this.onProgress(loadedCount, totalAssets);
        }
        
        // Load assets by category
        const categories = Object.keys(this.assets);
        let allSuccess = true;
        
        for (const category of categories) {
            console.log(`📦 Loading ${category}...`);
            
            const assetPromises = [];
            const categoryAssets = this.assets[category];
            
            for (const [name, path] of Object.entries(categoryAssets)) {
                assetPromises.push(
                    this.loadSingleAsset(name, path, category)
                        .then(success => {
                            loadedCount++;
                            if (this.onProgress) {
                                this.onProgress(loadedCount, totalAssets);
                            }
                            if (!success) {
                                allSuccess = false;
                            }
                            return success;
                        })
                );
            }
            
            // Wait for category to load
            await Promise.all(assetPromises);
        }
        
        console.log(allSuccess ? '✅ All assets loaded' : '⚠️ Some assets failed');
        return allSuccess;
    }
    
    // Load single image asset
    async loadSingleAsset(name, path, category = '') {
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                console.log(`✅ Loaded: ${name} from ${path}`);
                this.loadedImages[name] = {
                    image: img,
                    path: path,
                    category: category,
                    width: img.width,
                    height: img.height
                };
                resolve(true);
            };
            
            img.onerror = () => {
                console.error(`❌ Failed to load: ${name} from ${path}`);
                this.failedImages.push({ name, path, category });
                
                // Create fallback graphic
                const fallback = this.createFallbackGraphic(name, category);
                this.loadedImages[name] = {
                    image: fallback,
                    path: path,
                    category: category,
                    width: 200,
                    height: 200,
                    isFallback: true
                };
                
                resolve(false);
            };
            
            // Set source (this starts loading)
            img.src = path;
            
            // Add timeout for very slow loads
            setTimeout(() => {
                if (!img.complete) {
                    console.warn(`⏰ Timeout loading: ${name}`);
                    img.onerror(new Error('Load timeout'));
                }
            }, 10000); // 10 second timeout
        });
    }
    
    // Create fallback graphic for failed images
    createFallbackGraphic(name, category) {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // Set colors based on category
        let bgColor, textColor;
        
        switch(category) {
            case 'characters':
                bgColor = '#e74c3c'; // Red
                textColor = '#ecf0f1';
                break;
            case 'stones':
                bgColor = '#3498db'; // Blue
                textColor = '#ecf0f1';
                break;
            case 'enemies':
                bgColor = '#2ecc71'; // Green
                textColor = '#2c3e50';
                break;
            default:
                bgColor = '#95a5a6'; // Gray
                textColor = '#2c3e50';
        }
        
        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 200, 200);
        
        // Draw border
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(5, 5, 190, 190);
        
        // Draw text
        ctx.fillStyle = textColor;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Format name for display
        const displayName = name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace('Stone', ' Stone');
        
        // Split text if too long
        const words = displayName.split(' ');
        let y = 80;
        
        for (const word of words) {
            ctx.fillText(word, 100, y);
            y += 25;
        }
        
        // Add category label
        ctx.font = '12px Arial';
        ctx.fillText(`[${category}]`, 100, 160);
        
        return canvas;
    }
    
    // Get a loaded image
    getImage(name) {
        const asset = this.loadedImages[name];
        return asset ? asset.image : null;
    }
    
    // Get image info
    getImageInfo(name) {
        return this.loadedImages[name] || null;
    }
    
    // Check if image loaded successfully
    isLoaded(name) {
        return !!this.loadedImages[name];
    }
    
    // Check if image is fallback
    isFallback(name) {
        const asset = this.loadedImages[name];
        return asset ? !!asset.isFallback : false;
    }
    
    // Get list of failed images
    getFailedImages() {
        return this.failedImages;
    }
    
    // Get all loaded images by category
    getImagesByCategory(category) {
        const result = {};
        for (const [name, asset] of Object.entries(this.loadedImages)) {
            if (asset.category === category) {
                result[name] = asset;
            }
        }
        return result;
    }
}

// Export for ES6 modules
export { AssetLoader };
