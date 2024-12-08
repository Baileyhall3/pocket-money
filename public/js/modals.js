function openModal(modalId, itemData = {}) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("modal-close-animation");
        modal.classList.add("modal-open-animation");
        modal.style.display = "block";

        attachCloseEvents();

        const refreshManager = new RefreshManager();

        const errorMessage = modal.querySelector('#submit-error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }

        if (Object.keys(itemData).length > 0) {
            const modalHeader = modal.querySelector('.modal-header h2');
            if (modalHeader && itemData.type && itemData.id) {
                modalHeader.textContent = `New Transaction for ${itemData.type} ${itemData.id}`;
            }

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

        const transactionForm = document.getElementById('logTransactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', function (event) {
                const isValid = validateForm(event, transactionForm, 
                    ['transactionName', 'transactionAmount', 'transactionDate']);
                if (!isValid) return;

                console.log("Transaction form submitted successfully");
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
            newBudgetForm.addEventListener('submit', function (event) {
                const isValid = validateForm(event, newBudgetForm, 
                    ['budgetName', 'budgetAmount']);
                if (!isValid) return;

                console.log("New budget form submitted successfully");
            });
        }

        const newPotForm = document.getElementById('newPotForm');
        if (newPotForm) {
            newPotForm.addEventListener('submit', function (event) {
                const isValid = validateForm(event, newPotForm, 
                    ['potName', 'savingGoal']);
                if (!isValid) return;

                console.log("New pot form submitted successfully");
            });
        }

        const categoryElements = document.querySelectorAll(".category");
        const selectedCategoryElement = document.querySelector(".selected-category");
        let selectedCategory = null;

        categoryElements.forEach(category => {
            category.addEventListener("click", function () {
                const categoryId = this.getAttribute("data-id");
                const categoryIconClass = this.querySelector("i").className;
                const categoryName = this.querySelector("span").textContent;

                selectedCategory = { id: categoryId, icon: categoryIconClass, name: categoryName };

                categoryElements.forEach(cat => cat.classList.remove("selected"));
                this.classList.add("selected");
            });
        });

        window.switchViews = function () {
            const errorMessage = document.getElementById('category-error-message');
            errorMessage.textContent = '';
            if (selectedCategory) {
                selectedCategoryElement.querySelector("i").className = selectedCategory.icon;
                selectedCategoryElement.querySelector("i").title = selectedCategory.name;
                // selectedCategoryElement.insertAdjacentHTML("beforeend", `<span>${selectedCategory.name}</span>`);

                const formContainer = document.querySelector('.modal-content');
                formContainer.classList.toggle('show-transaction-details');

                document.getElementById('category-selection').style.display = 
                    formContainer.classList.contains('show-transaction-details') ? 'none' : 'block';
                document.getElementById('transaction-details').style.display = 
                    formContainer.classList.contains('show-transaction-details') ? 'block' : 'none';
            } else {
                errorMessage.textContent = 'Select a category before continuing.';
            }
        };

    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
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
        shared_with_id: formData.get('joiningPartner') || null,
        is_active: formData.get('defaultAccount') || false,
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
            // alert('Account created successfully!');
            return true;
        } else {
            throw new Error(result.error || 'Failed to create account.');
        }
    } catch (error) {
        // Handle errors
        console.error('Error creating account:', error);
        document.getElementById('submit-error-message').textContent = error.message;
        return false;
    }
}
