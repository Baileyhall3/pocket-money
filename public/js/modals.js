function openModal(modalId, itemData = {}) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        attachCloseEvents();

        // If itemData is provided, update the modal header and populate hidden fields
        if (itemData) {
            // Update the modal header with type and id
            const modalHeader = modal.querySelector('.modal-header h2');
            if (modalHeader && itemData.type && itemData.id) {
                modalHeader.textContent = `New Transaction for ${itemData.type} ${itemData.id}`;
            }

            // Clear existing hidden fields to prevent duplicates
            const form = modal.querySelector('form#logTransactionForm');
            form.querySelectorAll('.dynamic-field').forEach(el => el.remove());

            // Add hidden fields for each property in itemData
            for (const [key, value] of Object.entries(itemData)) {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = key;
                hiddenInput.value = value;
                hiddenInput.classList.add('dynamic-field');
                form.appendChild(hiddenInput);
            }
        }
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