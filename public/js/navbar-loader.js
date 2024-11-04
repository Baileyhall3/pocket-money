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
    if (collapseBtn && sideNav) {
        collapseBtn.addEventListener('click', function () {
            sideNav.classList.toggle('collapsed');
        });

        // Collapse the nav by default on mobile (screen width < 768px)
        if (window.innerWidth < 768) {
            sideNav.classList.add('collapsed');
        }
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth < 768) {
            sideNav.classList.add('collapsed');
        } else {
            sideNav.classList.remove('collapsed'); // Remove collapse on wider screens if needed
        }
    });

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
