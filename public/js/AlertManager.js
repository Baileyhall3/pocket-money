class AlertManager {
    constructor() {
        this.defaultFadeOutTime = 3000; // 3 seconds
    }

    // Show an alert with the given parameters
    showAlert({ id = 'alert', title = '', body = '', type = 'success', fadeOutTime = this.defaultFadeOutTime }) {
        const alertElement = document.getElementById(id);
        if (!alertElement) return;

        // Update alert content
        alertElement.querySelector('h3').textContent = title;
        alertElement.querySelector('p').textContent = body;

        // Update alert style based on type
        alertElement.className = `alert ${type}`;

        // Display the alert
        alertElement.style.display = 'flex';

        // Automatically fade out after the specified time
        setTimeout(() => this.fadeOutAlert(id), fadeOutTime);

        // Attach close button functionality
        this.attachCloseEvent(id);
    }

    // Fade out the alert
    fadeOutAlert(alertId) {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.classList.add('fade-out');
            setTimeout(() => {
                alertElement.style.display = 'none';
                alertElement.classList.remove('fade-out');
            }, 500); // Match CSS transition duration
        }
    }

    // Attach close button functionality
    attachCloseEvent(alertId) {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            const closeButton = alertElement.querySelector('.close');
            if (closeButton) {
                closeButton.onclick = () => this.fadeOutAlert(alertId);
            }
        }
    }

    async sendNudgeAlert(targetPerson, currentUser) {
        try {
            const response = await fetch('/alerts/nudge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: targetPerson.id,
                    friendName: `${currentUser.first_name} ${currentUser.last_name}`,
                    sentById: currentUser.id,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Nudge alert created successfully:', result.message);

                // Show success alert to the current user
                this.showAlert({
                    title: 'Nudge Sent!',
                    body: `Your nudge to ${targetPerson.first_name} was successful.`,
                    type: 'success',
                });
            } else {
                console.error('Error creating nudge alert:', result.error);

                // Show error alert to the current user
                this.showAlert({
                    title: 'Nudge Failed',
                    body: 'Something went wrong while sending the nudge.',
                    type: 'error-alert',
                });
            }
        } catch (error) {
            this.networkError();           
            console.error('Error sending nudge alert:', error);
        }
    }

    async sendFriendRequest(targetPerson, currentUser) {
        try {
            const response = await fetch('/alerts/friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: targetPerson.id, friendName: currentUser.first_name + ' ' + currentUser.last_name, sentById: currentUser.id }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Friend request alert created successfully:', result.message);

                this.showAlert({
                    title: 'Friend Request Sent!',
                    body: `Your friend request to ${targetPerson.first_name} was successful.`,
                    type: 'success',
                });
            } else {
                console.error('Error creating friend request alert:', result.error);

                this.showAlert({
                    title: 'Friend Request Failed',
                    body: 'Something went wrong while sending the friend request.',
                    type: 'error-alert',
                });
            }
        } catch (error) {
            this.networkError(); 
            console.error('Error sending friend request alert:', error);
        }
    }

    async sendSharedAlert(targetPersonId, userName, item) {
        try {
            const response = await fetch('/alerts/shared', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: targetPersonId, friendName: userName, item: item }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Shared created successfully:', result.message);
            } else {
                console.error('Error creating shared alert:', result.error);
            }
        } catch (error) {
            this.networkError(); 
            console.error('Error sending shared alert:', error);
        }
    }

    // TODO: Finish this
    async sendMilestoneAlert(userId, potName, targetAmount, currentAmount) {
        try {
            const response = await fetch('/alerts/milestone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: targetPerson.id,
                    friendName: `${currentUser.first_name} ${currentUser.last_name}`,
                    sentById: currentUser.id,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Milestone alert created successfully:', result.message);

                // this.showAlert({
                //     title: 'Nudge Sent!',
                //     body: `Your nudge to ${targetPerson.first_name} was successful.`,
                //     type: 'milestone',
                // });
            } else {
                console.error('Error creating nudge alert:', result.error);
            }
        } catch (error) {
            this.networkError();           
            console.error('Error sending nudge alert:', error);
        }
    }

    networkError() {
        this.showAlert({
            title: 'Network Error',
            body: 'Unable to connect to the server. Please try again later.',
            type: 'error-alert',
        });
    }
}

const alertManager = new AlertManager();
window.alertManager = alertManager;
