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

    async refreshTransactions() {
        try {
            const response = await fetch('/api/transactions', {
                headers: this.headers,
                credentials: 'same-origin' // Include cookies in the request
            });

            if (response.status === 401) {
                // If unauthorized, don't redirect - let the server middleware handle it
                return;
            }

            if (!response.ok) throw new Error('Failed to refresh transactions');

            const transactionsHTML = await response.text();

            const transactionsContainer = document.getElementById('transactions-container');
            if (transactionsContainer) {
                transactionsContainer.outerHTML = transactionsHTML;
            }
        } catch (error) {
            console.error('Error refreshing transactions:', error);
        }
    }
}

window.RefreshManager = RefreshManager;
