// Function to find users (client-side)
function searchUsers(inputId, listId) {
    const searchInput = document.getElementById(inputId);
    const usersList = document.getElementById(listId);

    if (!searchInput || !usersList) return;

    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        const friends = usersList.getElementsByClassName('friend-row');

        Array.from(friends).forEach(friend => {
            const friendName = friend.getAttribute('data-name').toLowerCase();
            if (friendName.includes(filter)) {
                friend.style.display = ''; // Show the friend
            } else {
                friend.style.display = 'none'; // Hide the friend
            }
        });
    });
}

// Function to search and filter transactions (client-side)
function searchTransactions(searchInputId, listClass, filterCategoryId, startDateId, endDateId) {
    const searchInput = document.getElementById(searchInputId);
    const transactionListItems = document.querySelectorAll(`.${listClass}`);
    const filterCategory = document.getElementById(filterCategoryId);
    const startDate = document.getElementById(startDateId);
    const endDate = document.getElementById(endDateId);

    if (!searchInput || !transactionListItems.length) return;

    function filterTransactions() {

        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = filterCategory ? filterCategory.value : 'all';
        const start = startDate ? new Date(startDate.value) : null;
        const end = endDate ? new Date(endDate.value) : null;
        
        console.log(filterCategory.value)

        transactionListItems.forEach(item => {
            const nameElement = item.querySelector('strong');
            const name = nameElement ? nameElement.innerText.toLowerCase() : '';

            const category = item.getAttribute('data-category') || '';
            const dateMade = new Date(item.getAttribute('data-date') || '');


            const matchesSearch = name.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
            const matchesDateRange = (!start || (dateMade && dateMade >= start)) && 
                                    (!end || (dateMade && dateMade <= end));
            debugger;
            // Instead of hiding the item, highlight it with a yellow background
            if (matchesSearch || matchesCategory || matchesDateRange) {
                item.style.backgroundColor = 'yellow'; // Highlight the matching item
            } else {
                item.style.backgroundColor = ''; // Remove the highlight if it doesn't match
            }

            debugger;
        });
    }

    // Attach event listeners for search and filtering
    searchInput.addEventListener('input', filterTransactions);
    filterCategory && filterCategory.addEventListener('change', filterTransactions);
    startDate && startDate.addEventListener('change', filterTransactions);
    endDate && endDate.addEventListener('change', filterTransactions);
}

