// Game Log Manager
class GameLog {
    constructor() {
        this.logMessages = document.getElementById('log-messages');
        this.maxEntries = 50;
        this.entries = [];
        this.init();
    }
    
    init() {
        // Clear initial placeholder
        if (this.logMessages) {
            this.logMessages.innerHTML = '';
        }
        
        // Listen for game log events
        window.addEventListener('gameLog', (event) => {
            this.addEntry(event.detail.message, event.detail.type);
        });
    }
    
    addEntry(message, type = 'info') {
        if (!this.logMessages) return;
        
        const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message,
            type
        };
        
        this.entries.push(entry);
        
        // Keep only the last maxEntries
        if (this.entries.length > this.maxEntries) {
            this.entries.shift();
        }
        
        this.render();
    }
    
    render() {
        if (!this.logMessages) return;
        
        this.logMessages.innerHTML = '';
        
        this.entries.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${entry.type}`;
            logEntry.textContent = `[${entry.timestamp}] ${entry.message}`;
            this.logMessages.appendChild(logEntry);
        });
        
        // Scroll to bottom
        this.logMessages.scrollTop = this.logMessages.scrollHeight;
    }
    
    clear() {
        this.entries = [];
        if (this.logMessages) {
            this.logMessages.innerHTML = '';
        }
    }
    
    getEntries() {
        return [...this.entries];
    }
    
    addImportant(message) {
        this.addEntry(message, 'important');
    }
    
    addError(message) {
        this.addEntry(message, 'error');
    }
    
    addThanos(message) {
        this.addEntry(message, 'thanos');
    }
    
    addHero(message) {
        this.addEntry(message, 'hero');
    }
    
    addCardPlay(message) {
        this.addEntry(message, 'card-play');
    }
    
    addLifeLoss(message) {
        this.addEntry(message, 'life-loss');
    }
    
    addInfinityStone(message) {
        this.addEntry(message, 'infinity-stone');
    }
}
