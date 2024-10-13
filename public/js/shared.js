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
