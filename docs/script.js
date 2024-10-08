const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');

// Function to handle file upload
async function handleFileUpload() {
    const file = fileInput.files[0];

    if (!file) {
        showError('Please select a file to upload.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('https://file.io/', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const fileIoResponse = await response.json();
        const downloadLink = fileIoResponse.link;
        console.log('File.io response:', downloadLink); // Debug download link

        // Add file to upload list
        addFileToList(downloadLink);

        // Send download link to webhook
        await sendWebhookNotification(downloadLink);
    } catch (error) {
        console.error('Error uploading file:', error); // More detailed logging for debugging
        showError(`Error uploading ${file.name}: ${error.message}`);
    }
}

// Function to add file to upload list
function addFileToList(link) {
    const fileLink = document.createElement('a');
    fileLink.href = link;
    fileLink.target = '_blank';
    fileLink.textContent = link;
    uploadList.appendChild(fileLink);
}

// Function to send webhook notification
async function sendWebhookNotification(downloadLink) {
    try {
        const response = await fetch('https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `New file uploaded: ${downloadLink}`,
            }),
        });

        if (!response.ok) {
            throw new Error(`Webhook Error: ${response.status}`);
        }

        console.log('Webhook notification sent successfully'); // Log webhook success
    } catch (error) {
        console.error('Error sending webhook notification:', error); // Detailed logging for webhook errors
    }
}

// Function to show error messages
function showError(message) {
    errorMessage.textContent = message;
}

// Add event listener to upload button
uploadButton.addEventListener('click', handleFileUpload);
