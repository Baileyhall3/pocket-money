function openModal(modalId, itemData = {}) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("modal-close-animation");
        modal.classList.add("modal-open-animation");
        modal.style.display = "block";

        // Balance transfer modal
        if (modalId === 'balanceTransferModal' && itemData.accounts) {
            const fromAccountSelect = document.getElementById('fromAccount');
            const toAccountSelect = document.getElementById('toAccount');
            
            // Clear existing options
            fromAccountSelect.innerHTML = '<option value="" selected>-- Select Account --</option>';
            toAccountSelect.innerHTML = '<option value="" selected>-- Select Account --</option>';
            
            // Populate account options
            itemData.accounts.forEach(account => {
                const option = `<option value="${account.id}">${account.name} (£${account.balance})</option>`;
                fromAccountSelect.insertAdjacentHTML('beforeend', option);
                toAccountSelect.insertAdjacentHTML('beforeend', option);
            });

            const balanceTransferForm = document.getElementById('balanceTransferForm');
            if (balanceTransferForm) {
                balanceTransferForm.addEventListener('submit', async function (event) {
                    const isValid = validateForm(event, balanceTransferForm, 
                        ['fromAccount', 'toAccount', 'transferAmount']);
                    if (!isValid) return;
    
                    if (await transferBalance(event)) {
                        console.log('Transfer successful, closing modal and refreshing');
                        closeModal(modalId);
                        await refreshManager.refreshAccounts();
                    }
                });
            } else {
                console.log('Balance transfer form not found');
            }
        }
        

        attachCloseEvents();

        const errorMessage = modal.querySelector('#submit-error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }

        const categoryErrorMessage = document.getElementById('category-error-message');
        if (categoryErrorMessage) {
            categoryErrorMessage.textContent = '';
        }

        // Delete confirm modal
        if (modalId === 'deleteConfirmModal' && itemData) {
            const messageElement = modal.querySelector("#delete-message");
            if (messageElement) {
                messageElement.textContent = `Are you sure you want to delete this ${itemData.itemType}?`;
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

        let selectedCategoryElement = null;
        let selectedCategory = null;

        // Log transaction modal
        if (modalId == 'logTransactionModal') {
            const categoryElements = document.querySelectorAll(".category");
            selectedCategoryElement = document.querySelector(".selected-category");
    
            categoryElements.forEach(category => {
                categoryElements.forEach(cat => cat.classList.remove("selected"));
                category.addEventListener("click", function () {
                    const categoryId = this.getAttribute("data-id");
                    const categoryIconClass = this.querySelector("i").className;
                    const categoryName = this.querySelector("span").textContent;
                    const categoryType = this.getAttribute("data-type"); 
    
                    selectedCategory = { id: categoryId, icon: categoryIconClass, name: categoryName, type: categoryType };
    
                    categoryElements.forEach(cat => cat.classList.remove("selected"));
                    this.classList.add("selected");
                });
            });
    
            const formContainer = modal.querySelector('.modal-content');
            if (formContainer) {        
                document.getElementById('category-selection').style.display = 'block';
                document.getElementById('transaction-details').style.display = 'none';
            }

            if (itemData && Object.keys(itemData).length > 0) {
    
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

            if (itemData.itemType == 'recurrentTransaction') {
                const isRecurring = document.getElementById('recurring');
                isRecurring.checked = true;
                isRecurring.disabled = true;
            }

            const transactionForm = document.getElementById('logTransactionForm');
            if (transactionForm) {
                transactionForm.addEventListener('submit', async function (event) {
                    event.preventDefault();
                    const isValid = validateForm(event, transactionForm, 
                        ['transactionName', 'transactionAmount', 'transactionDate']);
                    if (!isValid) return;
    
                    const result = await createTransaction(event, selectedCategory, itemData);
                    if (result) {
                        closeModal(modalId);
                        await refreshManager.refreshTransactions(itemData);
                    }
                });
            }
        }

        // Remove participant modal
        if (modalId == 'removeParticipantModal') {
            if (itemData && Object.keys(itemData).length > 0) {

                const messageElement = modal.querySelector("#remove-message");
                if (messageElement) {
                    messageElement.textContent = `Are you sure you want to remove ${itemData.removeSelf ? 'yourself' : 'this participant'} from the ${itemData.itemType}?`;
                }
                
                let updatedItem = {};
                updatedItem.shared_with_id = null;
                updatedItem.itemType = itemData.itemType;
                updatedItem.id = itemData.id;

                const removeParticipantForm = modal.querySelector("#removeParticipantForm");
                if (removeParticipantForm) {
                    removeParticipantForm.onsubmit = function (e) {
                        e.preventDefault();
                        updateItem(updatedItem, itemData.removeSelf);
                    };
                }
            }
        }

        // Edit item modal
        if (modalId === 'itemDetailsModal' && itemData) {
            const itemName = document.getElementById('itemName');
            itemName.value = itemData.name || '';

            itemSharedWithId = document.getElementById('edit-shared-with');

            if (itemData.shared_with_id) {
                itemSharedWithId.value = itemData.shared_with_id;
            } else {
                itemSharedWithId.value = ''; // Default to empty if no shared_with_id
            }

            document.getElementById('item-created').innerText = `Created: ${DateUtils.toDateTime(itemData.created_at)}`; 

            let itemStartDate = null;
            let itemEndDate = null;
            let itemTargetAmount = null;
            let potTargeDate = null;
            let accountType = null;
            let accountBalance = null;
            let isActive = null;
            
            if (itemData.itemType == 'budget') {
                document.getElementById('budget-dates').style.display = 'flex';
                itemStartDate = document.getElementById('itemStartDate');
                itemEndDate = document.getElementById('itemEndDate');

                itemStartDate.value = DateUtils.toInputFormatDate(itemData.start_date) || '';
                itemEndDate.value = DateUtils.toInputFormatDate(itemData.end_date) || '';
            }

            if (itemData.itemType == 'pot') {
                document.getElementById('edit-pot-row').style.display = 'flex';
                potTargeDate = document.getElementById('editPotTargetDate');

                potTargeDate.value = DateUtils.toInputFormatDate(itemData.target_date) || '';
            }

            if (itemData.itemType == 'budget' || itemData.itemType == 'pot') {
                document.getElementById('item-actual-amounts').style.display = 'flex';

                itemTargetAmount = document.getElementById('itemTargetAmount');
                document.getElementById('itemActualAmount').value = itemData.actual_amount;
                itemTargetAmount.value = itemData.target_amount;
            }

            if (itemData.itemType === 'account') {
                document.getElementById('account-row').style.display = 'flex';
            
                accountBalance = document.getElementById('edit-account-balance');
                accountBalance.value = itemData.balance || 0;
            
                accountType = document.getElementById('edit-account-type');
                accountType.value = itemData.itemType || '';
            }

            if (itemData.itemType == 'budget' || itemData.itemType == 'account') {
                document.getElementById('itemActiveRow').style.display = 'flex';
                console.log(itemData)

                isActive = document.getElementById('editItemActive');
                isActive.checked = itemData.is_active;
            }
            
            const editItemForm = modal.querySelector("#editItemForm");
            if (editItemForm) {
                editItemForm.onsubmit = function (e) {
                    e.preventDefault();

                    let updatedItem = {};
                    if (itemName.value != itemData.name) {
                        updatedItem.name = itemName.value;
                    }
                    if (itemSharedWithId.value !== (itemData.shared_with_id || '')) {
                        updatedItem.shared_with_id = itemSharedWithId.value || null;
                    }
                    if (itemStartDate && itemStartDate.value != DateUtils.toInputFormatDate(itemData.start_date)) {
                        updatedItem.start_date = itemStartDate.value;
                    }
                    if (itemEndDate && itemEndDate.value != DateUtils.toInputFormatDate(itemData.end_date)) {
                        updatedItem.end_date = itemEndDate.value;
                    }
                    if (potTargeDate && potTargeDate != DateUtils.toInputFormatDate(itemData.target_date)) {
                        updatedItem.target_date = potTargeDate.value;
                    }
                    if (itemTargetAmount && itemTargetAmount.value != itemData.target_amount) {
                        updatedItem.target_amount = itemTargetAmount.value;
                    }
                    if (accountBalance && accountBalance.value != itemData.balance) {
                        updatedItem.balance = accountBalance.value;
                    }
                    if (accountType && accountType.value != itemData.itemType) {
                        updatedItem.itemType = accountType.value;
                    }
                    if (isActive && isActive.checked != itemData.is_active) {
                        updatedItem.is_active = isActive.checked;
                    }

                    if (Object.keys(updatedItem).length === 0) { 
                        document.getElementById('info-message').innerText = 'No fields found to update.';
                        alertManager.showAlert({
                            title: `No changes to save.`,
                            type: 'info',
                        });
                        return;
                    }

                    updatedItem.itemType = itemData.itemType;
                    updatedItem.id = itemData.id;

                    updateItem(updatedItem);
                };
            }
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
                event.preventDefault();
                const isValid = validateForm(event, newBudgetForm, 
                    ['budgetName', 'budgetAmount']);
                if (!isValid) return;
                
                const result = await createBudget(event);
                if (result) {
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

                const result = await createPot(event);
                if (result) {
                    closeModal(modalId);
                    await refreshManager.refreshPots();
                }
            });
        }

        window.switchViews = function (target) {
            categoryErrorMessage.textContent = '';
            if (selectedCategory) {
                selectedCategoryElement.querySelector("i").className = selectedCategory.icon;
                selectedCategoryElement.querySelector("i").title = selectedCategory.name;
                
                const catSelection = document.getElementById('category-selection');
                const transactionDetails = document.getElementById('transaction-details');

                catSelection.style.display = 'none';
                transactionDetails.style.display = 'none';
        
                if (target === 'categories') {
                    catSelection.style.display = 'block';
                } else if (target === 'details') {
                    transactionDetails.style.display = 'block';
                    
                    if (itemData.itemType == 'recurrentTransaction') {
                        // const isRecurring = document.getElementById('recurring');
                        // isRecurring.checked = true;
                        // isRecurring.disabled = true;
    
                        const recTransactionsSection = document.getElementById('rec-transactions-section'); 
                        if (!recTransactionsSection) { return; }
                        
                        recTransactionsSection.classList.toggle('visible');
                        recTransactionsSection.style.display = 'block';
                    }
                }
            } else {
                categoryErrorMessage.textContent = 'Select a category before continuing.';
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
    const selectedPartner = formData.get('joiningPartner');
    const data = {
        name: formData.get('accountName'),
        type: formData.get('accountType'),
        balance: parseFloat(formData.get('balance') || 0),
        sharedWithId: selectedPartner ? JSON.parse(selectedPartner).userId : null,
        isActive: formData.get('defaultAccount') || false,
    };

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
            if (result.account.shared_with_id) {
                const parsedPartner = JSON.parse(selectedPartner)
                await sendSharedAlert(result, result.account, parsedPartner);
            }
            alertManager.showAlert({
                title: 'Account created successfully!',
                type: 'success',
            });
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
    event.preventDefault();
    const modal = event.target.closest('.modal');
    const errorMessage = modal.querySelector('#submit-error-message');

    const formData = new FormData(event.target);
    const data = {
        name: formData.get('budgetName'),
        targetAmount: parseFloat(formData.get('budgetAmount') || 0),
        startDate: formData.get('budgetStartDate') ? new Date(formData.get('budgetStartDate')).toISOString().split('T')[0] : null,
        endDate: formData.get('budgetEndDate') ? new Date(formData.get('budgetEndDate')).toISOString().split('T')[0] : null,
        accountId: formData.get('accountId') || null,
        isActive: formData.get('activeBudget') === 'on',
        sharedWithId: formData.get('sharedWith') || null,
        includeRecurring: formData.get('importRecurring') === 'on',
    };

    if ((data.startDate && data.endDate) && data.startDate > data.endDate) {
        errorMessage.textContent = 'Budget start date must be before end date.';
        return false;
    }

    try {
        console.log('Sending budget data:', data);
        const response = await fetch('/budgets/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include' // Add this to include authentication cookies
        });

        // Log the raw response for debugging
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            errorMessage.textContent = 'Server returned invalid response. You may need to log in again.';
            return false;
        }

        if (response.ok && result.success) {
            alertManager.showAlert({
                title: 'Budget created successfully!',
                type: 'success',
            });
            return true;
        } else {
            throw new Error(result.error || 'Failed to create budget.');
        }
    } catch (error) {
        console.error('Error creating budget:', error);
        errorMessage.textContent = error.message || 'An error occurred. Please try logging in again.';
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
            alertManager.showAlert({
                title: 'Pot created successfully!',
                type: 'success',
            });
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
    const modal = event.target.closest('.modal');
    const errorMessage = modal.querySelector('#submit-error-message');
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('transactionName'),
        amount: parseFloat(formData.get('transactionAmount') || 0),
        type: selCategory.type,
        category: selCategory.name,
        dateMade: formData.get('transactionDate') ? new Date(formData.get('transactionDate')).toISOString().split('T')[0] : null,
        accountId: item.itemType == 'account' ? item.id : null,
        budgetId: item.itemType == 'budget' ? item.id : null,
        potId: item.itemType == 'pot' ? item.id : null,
        isRecurring: item.itemType == 'recurrentTransaction' ? true : (formData.get('recurring') || false),
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
        
        if (!response.ok || !result.success) {
            errorMessage.textContent = result.error || 'Failed to create transaction.';
            return false;
        }

        if (item.itemType == 'pot') {
            const percentage = (item.actual_amount / item.target_amount) * 100;
            if (percentage == 25 || percentage == 50 || percentage == 75 || percentage == 100) {
                alertManager.sendMilestoneAlert(item.user_id, item.name, item.target_amount, item.actual_amount);
            }
        }

        return true;
    } catch (error) {
        console.error('Error creating transaction:', error);
        errorMessage.textContent = error.message || 'An error occurred while creating the transaction.';
        return false;
    }
}

async function deleteItem(itemData) {
    try {
        // Ensure proper pluralization
        const endpoint = itemData.itemType === 'budget' || itemData.itemType === 'pot' ? `${itemData.itemType}s` : 'accounts';

        const response = await fetch(`/${endpoint}/${itemData.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            window.location.href = `/${itemData.itemType === 'account' ? 'accounts' : 'savings'}`;
            alertManager.showAlert({
                title: `${itemData.itemType.charAt(0).toUpperCase() + itemData.itemType.slice(1)} deleted successfully!`,
                type: 'success',
            });
        } else {
            const error = await response.json();
            alertManager.showAlert({
                title: `Failed to delete item: ${error.message}`,
                type: 'error-alert',
            });
        }
    } catch (err) {
        console.error('Error deleting item:', err);
        alertManager.showAlert({
            title: 'An error occurred while deleting the item.',
            type: 'error-alert',
        });
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

async function transferBalance(event) {
    event.preventDefault();
    console.log('Starting balance transfer');
    
    try {
        const formData = new FormData(event.target);
        const fromAccountId = formData.get('fromAccount');
        const toAccountId = formData.get('toAccount');
        const amount = parseFloat(formData.get('transferAmount') || 0);

        console.log('Form values:', { fromAccountId, toAccountId, amount });

        if (!fromAccountId || !toAccountId || !amount) {
            throw new Error('Please fill in all fields');
        }

        if (fromAccountId === toAccountId) {
            throw new Error('Cannot transfer to the same account');
        }

        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        const data = { fromAccountId, toAccountId, amount };
        console.log('Sending transfer request with data:', data);

        const response = await fetch('/accounts/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        if (!response.ok) {
            throw new Error(result.error || `Server error: ${response.status}`);
        }

        if (!result.success) {
            throw new Error(result.error || 'Transfer failed');
        }

        console.log('Transfer successful');
        alertManager.showAlert({
            title: 'Balance transferred successfully!',
            type: 'success',
        });
        return true;
    } catch (error) {
        console.error('Error transferring balance:', error);
        const errorMessage = document.getElementById('submit-error-message');
        if (errorMessage) {
            errorMessage.textContent = error.message || 'An error occurred during transfer';
        } else {
            console.error('Error message element not found');
            alertManager.showAlert({
                title: error.message || 'An error occurred during transfer',
                type: 'error-alert',
            });
        }
        return false;
    }
}

async function sendSharedAlert(itemType, item, parsedPartner) {
    const targetPersonId = item.shared_with_id;
    const userName = parsedPartner.userName;
    const formattedItem = { id: item.id, type: itemType.account ? 'Account' : (itemType.budget ? 'Budget' : 'Pot')}
    await alertManager.sendSharedAlert(targetPersonId, userName, formattedItem);
}

async function updateItem(item, isSelfRemoval = false) {
    const itemType = item.itemType === 'budget' || item.itemType === 'pot' ? `${item.itemType}` : 'account';
    const endpoint = isSelfRemoval ? 
        `/${itemType}s/${item.id}/leave` : 
        `/update-${itemType}/${item.id}`;

    delete item['itemType'];

    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });

        if (!response.ok) {
            throw new Error('Failed to update item');
        }

        if (isSelfRemoval) {
            // Redirect to the main listing page for this type of item
            window.location.href = `/${itemType == 'account' ? 'account' : 'saving'}s`;
            alertManager.showAlert({
                title: `Successfully left the ${itemType}!`,
                type: 'success',
            });
        } else {
            closeModal('itemDetailsModal');
            alertManager.showAlert({
                title: `Item Updated!`,
                type: 'success',
            });
            location.reload();
        }
    } catch (error) {
        console.error('Error updating item:', error);
        alertManager.showAlert({
            title: `Error updating item.`,
            type: 'error-alert',
        });
    }
}
