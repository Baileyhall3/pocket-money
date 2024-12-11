class RefreshManager {
    constructor() {
        // Initialize with default headers for authenticated requests
        this.headers = {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };
    }

    async refreshAccounts() {
        try {
            const response = await fetch('/accounts', {
                headers: this.headers,
                credentials: 'same-origin',
            });
    
            if (response.status === 401) {
                return; // Unauthorized - let middleware handle this
            }
    
            if (!response.ok) throw new Error('Failed to refresh accounts');
    
            const accountsHTML = await response.text();
    
            // Parse the received HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(accountsHTML, 'text/html');
            const newAccountsContainer = doc.getElementById('accounts-container');
    
            if (newAccountsContainer) {
                const accountsContainer = document.getElementById('accounts-container');
                accountsContainer.innerHTML = newAccountsContainer.innerHTML; // Replace only inner content
            }
        } catch (error) {
            console.error('Error refreshing accounts:', error);
        }
    }

    async refreshBudgets() {
        try {
            const response = await fetch('/savings', {
                headers: this.headers,
                credentials: 'same-origin',
            });
    
            if (response.status === 401) {
                return;
            }
    
            if (!response.ok) throw new Error('Failed to refresh budgets');
            
            
            const savingsHTML = await response.text();
            
            // Parse the received HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(savingsHTML, 'text/html');
            const newBudgetsContainer = doc.getElementById('budgets-container');
            
            if (newBudgetsContainer) {
                const budgetsContainer = document.getElementById('budgets-container');
                budgetsContainer.innerHTML = newBudgetsContainer.innerHTML;
            }

            initBudgetCharts();
            
        } catch (error) {
            console.error('Error refreshing budgets:', error);
        }
    }

    async refreshPots() {
        try {
            const response = await fetch('/savings', {
                headers: this.headers,
                credentials: 'same-origin',
            });
    
            if (response.status === 401) {
                return;
            }
    
            if (!response.ok) throw new Error('Failed to refresh pots');
    
            const savingsHTML = await response.text();
    
            const parser = new DOMParser();
            const doc = parser.parseFromString(savingsHTML, 'text/html');
            const newPotsContainer = doc.getElementById('pots-container');
    
            if (newPotsContainer) {
                const potsContainer = document.getElementById('pots-container');
                potsContainer.innerHTML = newPotsContainer.innerHTML;
            }
    
            initPotCharts();
        } catch (error) {
            console.error('Error refreshing pots:', error);
        }
    }

    async refreshTransactions(item) {
        try {
            const endpointMap = {
                account: `/accounts/${item.id}/transactions`,
                budget: `/savings/budget/${item.id}/transactions`,
                pot: `/savings/pot/${item.id}/transactions`
            };
    
            const endpoint = endpointMap[item.type];
            if (!endpoint) throw new Error('Invalid item type for transactions');
    
            const response = await fetch(`${endpoint}?_=${Date.now()}`, {
                headers: this.headers,
                credentials: 'same-origin'
            });
    
            if (response.status === 401) return;
            if (!response.ok) throw new Error('Failed to refresh transactions');
    
            const transactionsHTML = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(transactionsHTML, 'text/html');
            const newTransactionsContent = newDoc.getElementById('transactions-container');
    
            const transactionsContainer = document.getElementById('transactions-container');
            if (transactionsContainer && newTransactionsContent) {
                transactionsContainer.innerHTML = newTransactionsContent.innerHTML;
                // Reinitialize JavaScript dependencies here
            }
        } catch (error) {
            console.error('Error refreshing transactions:', error);
        }
    }

    async refreshAlerts() {
        try {
            const response = await fetch('/alerts', {
                headers: this.headers,
                credentials: 'same-origin',
            });
    
            if (response.status === 401) {
                return;
            }
    
            if (!response.ok) throw new Error('Failed to refresh alerts');
    
            const alertsHTML = await response.text();
    
            const parser = new DOMParser();
            const doc = parser.parseFromString(alertsHTML, 'text/html');
            const newAlertsContainer = doc.getElementById('alerts-container');
    
            if (newAlertsContainer) {
                const alertsContainer = document.getElementById('alerts-container');
                alertsContainer.innerHTML = newAlertsContainer.innerHTML;
            }
    
            initPotCharts();
        } catch (error) {
            console.error('Error refreshing pots:', error);
        }
    }

    async refreshFriends() {
        try {
            const response = await fetch('/profile', {
                headers: this.headers,
                credentials: 'same-origin',
            });
    
            if (response.status === 401) {
                return;
            }
    
            if (!response.ok) throw new Error('Failed to refresh friends');
    
            const friendsHTML = await response.text();
    
            const parser = new DOMParser();
            const doc = parser.parseFromString(friendsHTML, 'text/html');
            const newFriendsContainer = doc.getElementById('friends-list');
    
            if (newFriendsContainer) {
                const friendsList = document.getElementById('friends-list');
                friendsList.innerHTML = newFriendsContainer.innerHTML;
            }
    
            initPotCharts();
        } catch (error) {
            console.error('Error refreshing pots:', error);
        }
    }  
    
}

window.RefreshManager = RefreshManager;
