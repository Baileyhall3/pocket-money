function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        attachCloseEvents();
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