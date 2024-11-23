document.addEventListener("DOMContentLoaded", function () {
    // Highlight active link
    const currentPath = window.location.pathname.replace(/^\//, "");

    // Select all nav links
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Loop through each link to check if its href matches any part of the current path
    navLinks.forEach(link => {
        // Remove leading "/" from link href to match against currentPath
        const linkPath = link.getAttribute('href').replace(/^\//, "");

        // Check if the current path includes the link path (for nested routes)
        if (currentPath.includes(linkPath)) {
            link.classList.add('active'); // Add active class to the matching link
        } else {
            link.classList.remove('active'); // Remove active class from non-matching links
        }
    });

    // Collapse navigation functionality
    const collapseBtn = document.getElementById('collapse-btn');
    const sideNav = document.getElementById('side-nav');
    const overlay = document.getElementById('overlay');

    function isOnMobile() {
        return window.innerWidth < 768;
    }

    if (collapseBtn && sideNav && overlay) {
        // Toggle sideNav on button click
        collapseBtn.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent click from propagating to document
            sideNav.classList.toggle('collapsed');

            // Show or hide overlay based on nav state
            if (isOnMobile()) {
                if (sideNav.classList.contains('collapsed')) {
                    overlay.classList.remove('visible'); // Hide overlay
                } else {
                    overlay.classList.add('visible'); // Show overlay
                }
            }
            
        });

        // Function to handle outside click only on mobile
        function handleOutsideClick(event) {
            if (isOnMobile() && 
                !sideNav.contains(event.target) && 
                !collapseBtn.contains(event.target)) {
                sideNav.classList.add('collapsed');
                overlay.classList.remove('visible'); // Hide overlay
            }
        }

        // Only add the listener for outside clicks on mobile
        function enableMobileNavCollapse() {
            if (isOnMobile()) {
                sideNav.classList.add('collapsed'); // Collapse by default on mobile
                document.addEventListener('click', handleOutsideClick);
                overlay.classList.remove('visible'); // Ensure overlay is hidden
            } else {
                document.removeEventListener('click', handleOutsideClick);
                sideNav.classList.remove('collapsed'); // Ensure nav is shown on desktop
                overlay.classList.remove('visible'); // Ensure overlay is hidden
            }
        }

        // Initial check
        enableMobileNavCollapse();

        // Re-check on window resize
        window.addEventListener('resize', enableMobileNavCollapse);
    }

    // Profile dropdown toggle
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', function () {
            profileDropdown.classList.toggle('open');
        });
    }

    // Add dropdown toggle
    const addBtn = document.getElementById('add-btn');
    const addDropdown = document.getElementById('add-dropdown');
    if (addBtn && addDropdown) {
        addBtn.addEventListener('click', function () {
            addDropdown.classList.toggle('open');
        });
    }

    // Alerts dropdown toggle
    const alertsBtn = document.getElementById('alerts-btn');
    const alertsDropdown = document.getElementById('alerts-dropdown');
    if (alertsBtn && alertsDropdown) {
        alertsBtn.addEventListener('click', function () {
            alertsDropdown.classList.toggle('open');
        });
    }

});

function toggleDropdown(event) {
    event.preventDefault(); // Prevent navigating to "#"

    const dropdown = event.target.closest(".nav-dropdown");
    const subLinks = document.getElementById('subLinks');
    dropdown.classList.toggle("open");
    subLinks.classList.toggle("open");
}