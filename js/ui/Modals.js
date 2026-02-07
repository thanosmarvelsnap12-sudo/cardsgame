// Modal Manager
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.callbacks = {};
        this.init();
    }
    
    init() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hide();
            }
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.hide();
            }
        });
    }
    
    showCardSelection(title, cards, maxSelect, callback) {
        const modal = document.getElementById('card-modal');
        const titleEl = document.getElementById('modal-title');
        const cardsContainer = document.getElementById('modal-cards');
        
        if (!modal || !titleEl || !cardsContainer) return;
        
        titleEl.textContent = title;
        cardsContainer.innerHTML = '';
        
        const selectedCards = [];
        
        cards.forEach((card, index) => {
            const cardEl = this.createCardElement(card, index);
            cardEl.addEventListener('click', () => {
                if (selectedCards.includes(card)) {
                    // Deselect
                    selectedCards.splice(selectedCards.indexOf(card), 1);
                    cardEl.classList.remove('selected');
                } else {
                    if (selectedCards.length < maxSelect) {
                        selectedCards.push(card);
                        cardEl.classList.add('selected');
                    }
                }
                
                if (selectedCards.length === maxSelect) {
                    this.hide();
                    if (callback) callback(selectedCards);
                }
            });
            
            cardsContainer.appendChild(cardEl);
        });
        
        this.activeModal = modal;
        modal.classList.add('active');
        
        // Store callback for cancel
        this.callbacks.card = callback;
    }
    
    showTargetSelection(title, targets, callback) {
        const modal = document.getElementById('target-modal');
        const titleEl = document.getElementById('target-modal-title');
        const optionsContainer = document.getElementById('target-options');
        
        if (!modal || !titleEl || !optionsContainer) return;
        
        titleEl.textContent = title;
        optionsContainer.innerHTML = '';
        
        targets.forEach(target => {
            const option = document.createElement('div');
            option.className = 'target-option';
            option.textContent = target.name;
            option.addEventListener('click', () => {
                this.hide();
                if (callback) callback(target);
            });
            optionsContainer.appendChild(option);
        });
        
        this.activeModal = modal;
        modal.classList.add('active');
        
        // Store callback for cancel
        this.callbacks.target = callback;
    }
    
    showNumberSelection(title, numbers, callback) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <div class="number-selection">
                    ${numbers.map(num => `
                        <button class="number-btn" data-number="${num}">${num}</button>
                    `).join('')}
                </div>
                <button class="btn-secondary cancel-btn">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const number = parseInt(btn.dataset.number);
                document.body.removeChild(modal);
                if (callback) callback(number);
            });
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        this.activeModal = modal;
    }
    
    showConfirm(title, message, callback) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="btn-primary confirm-yes">Yes</button>
                    <button class="btn-secondary confirm-no">No</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.confirm-yes').addEventListener('click', () => {
            document.body.removeChild(modal);
            if (callback) callback(true);
        });
        
        modal.querySelector('.confirm-no').addEventListener('click', () => {
            document.body.removeChild(modal);
            if (callback) callback(false);
        });
        
        this.activeModal = modal;
    }
    
    showGameOver(winner, message) {
        const modal = document.getElementById('game-over-modal');
        const titleEl = document.getElementById('game-over-title');
        const messageEl = document.getElementById('game-over-message');
        
        if (!modal || !titleEl || !messageEl) return;
        
        if (winner === 'THANOS') {
            titleEl.textContent = 'THANOS WINS!';
            titleEl.style.color = '#ff6b6b';
        } else {
            titleEl.textContent = 'HEROES WIN!';
            titleEl.style.color = '#4ecdc4';
        }
        
        messageEl.textContent = message;
        
        this.activeModal = modal;
        modal.classList.add('active');
    }
    
    showRules() {
        const modal = document.getElementById('rules-modal');
        if (modal) {
            this.activeModal = modal;
            modal.classList.add('active');
        }
    }
    
    hide() {
        if (this.activeModal) {
            this.activeModal.classList.remove('active');
            
            // If it's a dynamically created modal, remove it
            if (!this.activeModal.id && this.activeModal.parentNode) {
                this.activeModal.parentNode.removeChild(this.activeModal);
            }
            
            this.activeModal = null;
            
            // Clear callbacks
            this.callbacks = {};
        }
    }
    
    createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card modal-card';
        cardDiv.innerHTML = `
            <div class="card-number">${card.number}</div>
            <div class="card-name">${card.name}</div>
        `;
        return cardDiv;
    }
    
    isModalVisible() {
        return this.activeModal !== null;
    }
}
