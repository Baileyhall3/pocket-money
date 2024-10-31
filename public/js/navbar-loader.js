document.addEventListener("DOMContentLoaded", function () {
    // Highlight active link
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a'); // Select all nav links
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active'); // Add active class to the current page's link
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

    // Mobile nav drawer functionality
    // const mobileCollapseBtn = document.getElementById('mobile-collapse-btn');
    // const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    // if (mobileCollapseBtn && mobileNavDrawer) {
    //     mobileCollapseBtn.addEventListener('click', function () {
    //         mobileNavDrawer.classList.toggle('open');
    //     });

    //     // Close mobile nav drawer if clicked outside
    //     window.addEventListener('click', function (event) {
    //         if (!mobileNavDrawer.contains(event.target) && !mobileCollapseBtn.contains(event.target)) {
    //             mobileNavDrawer.classList.remove('open');
    //         }
    //     });
    // }

    // const userName = localStorage.getItem('userName');

    // if (userName) {
    //     document.getElementById('user-name').textContent = userName;
    // }

    // Log out functionality
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/login.html'; // Redirect to login page after logout
        });
    }
});
