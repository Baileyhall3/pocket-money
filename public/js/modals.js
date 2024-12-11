function openModal(modalId, itemData = {}) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("modal-close-animation");
        modal.classList.add("modal-open-animation");
        modal.style.display = "block";

        const formContainer = modal.querySelector('.modal-content');
        if (formContainer) {        
            document.getElementById('category-selection').style.display = 'block';
            document.getElementById('transaction-details').style.display = 'none';
        }

        attachCloseEvents();

        const refreshManager = new RefreshManager();

        const errorMessage = modal.querySelector('#submit-error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }

        if (modalId === 'deleteConfirmModal' && itemData) {
            const messageElement = modal.querySelector("#delete-message");
            if (messageElement) {
                messageElement.textContent = `Are you sure you want to delete this ${itemData.type}?`;
            }

            const deleteForm = modal.querySelector("#deleteConfirmForm");
            if (deleteForm) {
                deleteForm.onsubmit = function (e) {
                    e.preventDefault();
                    deleteItem(itemData);
                };
            }
        }

        let item = {};

        if (Object.keys(itemData).length > 0) {
            // const modalHeader = modal.querySelector('.modal-header h2');
            // if (modalHeader && itemData.type && itemData.id) {
            //     modalHeader.textContent = `New Transaction for ${itemData.name}`;
            //     
            // }
            item = { id: itemData.id, type: itemData.type }

            const form = modal.querySelector('form#logTransactionForm');
            form.querySelectorAll('.dynamic-field').forEach(el => el.remove());

            for (const [key, value] of Object.entries(itemData)) {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = key;
                hiddenInput.value = value;
                hiddenInput.classList.add('dynamic-field');
                form.appendChild(hiddenInput);
            }
        }

        const categoryElements = document.querySelectorAll(".category");
        const selectedCategoryElement = document.querySelector(".selected-category");
        let selectedCategory = null;

        categoryElements.forEach(category => {
            categoryElements.forEach(cat => cat.classList.remove("selected"));
            category.addEventListener("click", function () {
                const categoryId = this.getAttribute("data-id");
                const categoryIconClass = this.querySelector("i").className;
                const categoryName = this.querySelector("span").textContent;
                const categoryType = this.getAttribute("data-type"); // Retrieve the category type

                selectedCategory = { id: categoryId, icon: categoryIconClass, name: categoryName, type: categoryType };

                // categoryElements.forEach(cat => cat.classList.remove("selected"));
                this.classList.add("selected");
            });
        });

        const transactionForm = document.getElementById('logTransactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', async function (event) {
                const isValid = validateForm(event, transactionForm, 
                    ['transactionName', 'transactionAmount', 'transactionDate']);
                if (!isValid) return;

                if (createTransaction(event, selectedCategory, item)) {
                    closeModal(modalId);
                    await refreshManager.refreshTransactions(item);
                }
            });
        }

        const newAccountForm = document.getElementById('newAccountForm');
        if (newAccountForm) {
            newAccountForm.addEventListener('submit', async function (event) {
                const isValid = validateForm(event, newAccountForm, 
                    ['accountName', 'accountType']);
                if (!isValid) return;

                if (createAccount(event)) {
                    closeModal(modalId);
                    await refreshManager.refreshAccounts();
                }
            });
        }

        const newBudgetForm = document.getElementById('newBudgetForm');
        if (newBudgetForm) {
            newBudgetForm.addEventListener('submit', async function (event) {
                const isValid = validateForm(event, newBudgetForm, 
                    ['budgetName', 'budgetAmount']);
                if (!isValid) return;

                if (createBudget(event)) {
                    closeModal(modalId);
                    await refreshManager.refreshBudgets();
                }
            });
        }

        const newPotForm = document.getElementById('newPotForm');
        if (newPotForm) {
            newPotForm.addEventListener('submit', async function (event) {
                const isValid = validateForm(event, newPotForm, 
                    ['potName', 'savingGoal']);
                if (!isValid) return;

                if (createPot(event)) {
                    closeModal(modalId);
                    await refreshManager.refreshPots();
                }
            });
        }

        window.switchViews = function (target) {
            const errorMessage = document.getElementById('category-error-message');
            errorMessage.textContent = '';
            if (selectedCategory) {
                selectedCategoryElement.querySelector("i").className = selectedCategory.icon;
                selectedCategoryElement.querySelector("i").title = selectedCategory.name;
                // selectedCategoryElement.insertAdjacentHTML("beforeend", `<span>${selectedCategory.name}</span>`);
                
                const catSelection = document.getElementById('category-selection');
                const transactionDetails = document.getElementById('transaction-details');

                catSelection.style.display = 'none';
                transactionDetails.style.display = 'none';
        
                if (target === 'categories') {
                    catSelection.style.display = 'block';
                } else if (target === 'details') {
                    transactionDetails.style.display = 'block';
                }
            } else {
                errorMessage.textContent = 'Select a category before continuing.';
            }
        };

    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        clearValues(modalId)
        modal.style.display = "none";
    }
}

function attachCloseEvents() {
    const closeButtons = document.querySelectorAll(".close");

    closeButtons.forEach(function (closeBtn) {
        closeBtn.onclick = function () {
            closeModal(closeBtn.closest(".modal").id);
        };
    });

    window.onclick = function (event) {
        if (event.target.classList.contains("modal")) {
            console.log(event.target)
            event.target.style.display = "none";
        }
    };
}

function validateForm(event, form, requiredFieldIds) {
    event.preventDefault();
    const errorMessage = form.querySelector('#submit-error-message');
    errorMessage.textContent = '';

    const missingFields = requiredFieldIds.filter(id => {
        const field = document.getElementById(id);
        return !field || !field.value.trim();
    });

    if (missingFields.length > 0) {
        errorMessage.textContent = 'All fields must be filled in.';
        return false;
    }

    return true;
}

async function createAccount(event) {
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('accountName'),
        type: formData.get('accountType'),
        balance: parseFloat(formData.get('balance') || 0),
        sharedWithId: formData.get('joiningPartner') || null,
        isActive: formData.get('defaultAccount') || false,
    };

    console.log(data)

    try {
        const response = await fetch('/accounts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return true;
        } else {
            throw new Error(result.error || 'Failed to create account.');
        }
    } catch (error) {
        console.error('Error creating account:', error);
        document.getElementById('submit-error-message').textContent = error.message;
        return false;
    }
}

async function createBudget(event) {
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('budgetName'),
        targetAmount: parseFloat(formData.get('budgetAmount') || 0),
        startDate: formData.get('budgetStartDate') ? new Date(formData.get('budgetStartDate')).toISOString().split('T')[0] : null,
        endDate: formData.get('budgetEndDate') ? new Date(formData.get('budgetEndDate')).toISOString().split('T')[0] : null,
        accountId: formData.get('accountId') || null,
        isActive: formData.get('activeBudget') || false,
        sharedWithId: formData.get('sharedWith') || null
    };

    try {
        console.log('Sending budget data:', data);
        const response = await fetch('/budgets/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return true;
        } else {
            throw new Error(result.error || 'Failed to create budget.');
        }
    } catch (error) {
        console.error('Error creating budget:', error);
        document.getElementById('submit-error-message').textContent = error.message;
        return false;
    }
}

async function createPot(event) {
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('potName'),
        targetAmount: parseFloat(formData.get('savingGoal') || 0),
        targetDate: formData.get('targetDate') ? new Date(formData.get('targetDate')).toISOString().split('T')[0] : null,
        sharedWithId: formData.get('sharedWith') || null,
        participants: [],
    };

    console.log(data)

    try {
        const response = await fetch('/pots/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return true;
        } else {
            throw new Error(result.error || 'Failed to create pot.');
        }
    } catch (error) {
        console.error('Error creating pot:', error);
        document.getElementById('submit-error-message').textContent = error.message;
        return false;
    }
}

async function createTransaction(event, selCategory, item) {
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('transactionName'),
        amount: parseFloat(formData.get('transactionAmount') || 0),
        type: selCategory.type,
        category: selCategory.name,
        dateMade: formData.get('transactionDate') ? new Date(formData.get('transactionDate')).toISOString().split('T')[0] : null,
        accountId: item.type == 'account' ? item.id : null,
        budgetId: item.type == 'budget' ? item.id : null,
        potId: item.type == 'pot' ? item.id : null,
        isRecurring: formData.get('recurring') || false,
        recurrency: formData.get('transactionFrequency') || null,
        recurrentEnd: formData.get('transactionEndDate') ? new Date(formData.get('transactionEndDate')).toISOString().split('T')[0] : null,
    };

    try {
        const response = await fetch('/transactions/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const accountUpdateResponse = await updateItemBalance(
                item.id,
                item.type,
                data.type === 'income' ? data.amount : -data.amount
            );

            if (!accountUpdateResponse.ok) {
                throw new Error('Failed to update account balance.');
            }
            return true;
        } else {
            throw new Error(result.error || 'Failed to create transaction.');
        }
    } catch (error) {
        console.error('Error creating transaction:', error);
        document.getElementById('submit-error-message').textContent = error.message;
        return false;
    }
}

async function updateItemBalance(itemId, type, amountChange) {
    try {
        let response = null;
        if (type == 'account') {
            response = await fetch(`/accounts/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ balanceChange: amountChange }),
            });
        }
        else if (type == 'budget') {
            response = await fetch(`/budgets/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ actualAmountChange: amountChange }),
            });
        }
        else if (type == 'pot') {
            response = await fetch(`/pots/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ actualAmountChange: amountChange }),
            });
        }

        return response;
    } catch (error) {
        console.error('Error updating account balance:', error);
        return { ok: false };
    }
}

async function deleteItem(itemData) {
    try {
        let response = null;
        if (itemData.type == 'budget') {
            response = await fetch(`/budgets/${itemData.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        else if (itemData.type == 'pot') {
            response = await fetch(`/pots/${itemData.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        else if (itemData.type == 'account') {
            response = await fetch(`/accounts/${itemData.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        if (response.ok) {
            alert(`${itemData.type} deleted successfully!`);
            window.location.href = '/' + (itemData.type == 'account' ? 'accounts' : 'savings')
        } else {
            const error = await response.json();
            alert(`Failed to delete item: ${error.message}`);
        }
    } catch (err) {
        console.error('Error deleting item:', err);
        alert('An error occurred while deleting the item.');
    }
}

function clearValues(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const form = modal.querySelector('form');
    if (form) {
        // Reset all form fields to their default values
        form.reset();

        const recurringCheckbox = form.querySelector('input[name="recurring"]');
        if (recurringCheckbox) recurringCheckbox.checked = false;

        const transactionFrequencyField = form.querySelector('input[name="transactionFrequency"]');
        if (transactionFrequencyField) transactionFrequencyField.value = '';

        const transactionEndDateField = form.querySelector('input[name="transactionEndDate"]');
        if (transactionEndDateField) transactionEndDateField.value = '';

        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');
    }
}