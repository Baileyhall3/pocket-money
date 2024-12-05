function openModal(modalId, itemData = {}) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Reset animation classes
        modal.classList.remove("modal-close-animation");
        modal.classList.add("modal-open-animation");
        modal.style.display = "block";

        attachCloseEvents();

        if (itemData) {
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

        const categories = document.querySelectorAll('.category');

        categories.forEach(category => {
            category.addEventListener('click', () => {
                console.log('working')
                // Remove active class from all categories
                categories.forEach(cat => cat.classList.remove('active'));

                // Add active class to the clicked category
                category.classList.add('active');
            });
        });
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