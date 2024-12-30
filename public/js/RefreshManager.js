class RefreshManager {
    constructor() {
        // Initialize with default headers for authenticated requests
        this.headers = {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };
        this.doughNutCharts = {};
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

                // Reinitialize all budget charts
                const budgetCharts = budgetsContainer.querySelectorAll('canvas[id^="budget-chart-"]');
                budgetCharts.forEach(canvas => {
                    const budgetId = canvas.id.replace('budget-chart-', '');
                    this.refreshBudgetChart(canvas.id, budgetId);
                });
            }
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

                // Reinitialize all pot charts
                const potCharts = potsContainer.querySelectorAll('canvas[id^="pot-chart-"]');
                potCharts.forEach(canvas => {
                    const potId = canvas.id.replace('pot-chart-', '');
                    this.refreshPotChart(canvas.id, potId);
                });
            }
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

            const chartId = `${item.type}-chart-${item.id}`;
            if (item.type == 'pot') {
                this.refreshPotChart(chartId, item.id);
            } else if (item.type == 'budget') {
                this.refreshBudgetChart(chartId, item.id);
            } else {
                location.reload();
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
    
        } catch (error) {
            console.error('Error refreshing pots:', error);
        }
    }

    async refreshProfile() {
        try {
            const response = await fetch('/profile', {
                headers: this.headers,
                credentials: 'same-origin',
            });
    
            if (response.status === 401) {
                return;
            }
    
            if (!response.ok) throw new Error('Failed to refresh friends');
    
            const profileHTML = await response.text();
    
            const parser = new DOMParser();
            const doc = parser.parseFromString(profileHTML, 'text/html');
            const newProfileContainer = doc.getElementById('user-profile');
    
            if (newProfileContainer) {
                const userProfile = document.getElementById('user-profile');
                userProfile.innerHTML = newProfileContainer.innerHTML;
            }
    
        } catch (error) {
            console.error('Error refreshing pots:', error);
        }
    }

    async refreshPotChart(chartId, potId) {
        const updatedData = await this.fetchChartData(`/savings/pot-data/${potId}`);
        if (!updatedData) return;

        if (this.doughNutCharts[chartId]) {
            this.doughNutCharts[chartId].destroy();
            delete this.doughNutCharts[chartId];
        }

        this.doughNutCharts[chartId] = this.createDoughnutChart(chartId, updatedData.actual_amount, updatedData.target_amount, false);
    }

    async refreshBudgetChart(chartId, budgetId) {
        const updatedData = await this.fetchChartData(`/savings/budget-data/${budgetId}`);
        if (!updatedData) return;

        if (this.doughNutCharts[chartId]) {
            this.doughNutCharts[chartId].destroy();
            delete this.doughNutCharts[chartId];
        }

        this.doughNutCharts[chartId] = this.createDoughnutChart(chartId, updatedData.actual_amount, updatedData.target_amount, true);
    }

    async fetchChartData(apiEndpoint) {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                console.error(`Failed to fetch chart data from ${apiEndpoint}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching chart data: ${error}`);
            return null;
        }
    }

    createDoughnutChart(chartId, actual, total, reverse) {
        const ctx = document.getElementById(chartId)?.getContext('2d');

        if (!ctx) {
            console.error(`Canvas with ID ${chartId} not found.`);
            return null;
        }

        const percentage = (actual / total) * 100;
        let actualColor = '';
        if (reverse) {
            actualColor = 
                percentage > 75 ? '#FF0000' : 
                percentage > 25 ? '#FFA500' : 
                '#45a049';
        } else {
            actualColor = 
                percentage > 75 ? '#45a049' : 
                percentage > 25 ? '#FFA500' : 
                '#FF0000';
        }

        // Create the doughnut chart
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [actual, total - actual],
                    backgroundColor: [actualColor, '#C0C0C0'],
                    hoverOffset: 4,
                }],
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const label = tooltipItem.dataIndex === 0 ? 'Actual' : 'Remaining';
                                return `${label}: £${tooltipItem.raw}`;
                            },
                        },
                    },
                },
            },
        });

        this.doughNutCharts = this.doughNutCharts || {};
        this.doughNutCharts[chartId] = chart;

        return chart;
    }
    
}

const refreshManager = new RefreshManager
window.refreshManager = refreshManager;
