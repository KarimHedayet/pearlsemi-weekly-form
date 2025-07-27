// script.js

// IMPORTANT: REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const SCRIPT_WEB_APP_URL = 'https://script.google.com/a/macros/pearlsemi.com/s/AKfycbwGi1AfEYTpzEEpUdJ7O9MD8jReD6Rw5z8VgkrKkvu6Nr8BWCVzINItGIo6GzklOVAKzQ/exec';

document.addEventListener('DOMContentLoaded', () => {
    const weeklyForm = document.getElementById('weeklyForm');
    const clearButton = document.getElementById('clearButton');
    const messageDiv = document.getElementById('message');

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`; // Add type class (success/error)
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000); // Hide message after 5 seconds
    }

    // --- Form Submission Handler ---
    weeklyForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = true; // Disable button to prevent multiple submissions
        submitButton.textContent = 'Submitting...';

        // Get form data
        const formData = {
            teamMemberName: document.getElementById('teamMemberName').value,
            teamMemberEmail: document.getElementById('teamMemberEmail').value,
            weeklyTaskProgress: document.getElementById('weeklyTaskProgress').value,
            // !!! IMPORTANT: Add more fields here matching your HTML input 'name' attributes
            // Example: yourNewQuestionName: document.getElementById('yourNewQuestionId').value,
        };

        try {
            const response = await fetch(SCRIPT_WEB_APP_URL, {
                method: 'POST',
                mode: 'cors', // Required for cross-origin requests
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Send data as JSON
            });

            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message, 'success');
                weeklyForm.reset(); // Clear form on success
            } else {
                showMessage(result.message || 'An error occurred during submission.', 'error');
                console.error('Apps Script Error:', result);
            }
        } catch (error) {
            showMessage('Network error or unexpected response. Please try again.', 'error');
            console.error('Fetch Error:', error);
        } finally {
            submitButton.disabled = false; // Re-enable button
            submitButton.textContent = 'Submit Form';
        }
    });

    // --- Clear Form Button Handler ---
    clearButton.addEventListener('click', () => {
        weeklyForm.reset(); // Resets all form fields
        showMessage('Form cleared!', 'success');
    });
});
