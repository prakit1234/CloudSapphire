const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');
const webhookUrl = "YOUR_DISCORD_WEBHOOK_URL"; // Replace with your Discord webhook URL

uploadButton.addEventListener('click', async () => {
    const files = fileInput.files;

    if (files.length === 0) {
        showError('Please select a file to upload.');
        return;
    }

    errorMessage.textContent = ''; // Clear previous errors

    for (const file of files) {
        const downloadLink = await uploadFile(file);
        if (downloadLink) {
            addFileToList(downloadLink);
            await sendToWebhook(downloadLink);
        }
    }
});

// Function to upload a file to GoFile.io
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://api.gofile.io/uploadFile', {
            method: 'POST',
            body: formData,
        });

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('GoFile response:', data); // Debug response from GoFile.io

        // Check if the API returned an "ok" status
        if (data.status === 'ok') {
            console.log('File uploaded successfully:', data.data.downloadPage); // Debug download link
            return data.data.downloadPage; // Return download link
        } else {
            throw new Error(data.message || 'Failed to upload');
        }
    } catch (error) {
        console.error('Error uploading file:', error); // More detailed logging for debugging
        showError(`Error uploading ${file.name}: ${error.message}`);
        return null;
    }
}

// Function to display the file download link
function addFileToList(link) {
    const fileLink = document.createElement('a');
    fileLink.href = link;
    fileLink.target = '_blank';
    fileLink.textContent = link;
    uploadList.appendChild(fileLink);
}

// Function to send the download link to a Discord webhook
async function sendToWebhook(link) {
    const payload = {
        content: `New file uploaded: ${link}`,
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Webhook Error: ${response.status}`);
        }

        console.log('Webhook notification sent successfully'); // Log webhook success
    } catch (error) {
        console.error('Error sending to webhook:', error); // Detailed logging for webhook errors
    }
}

// Function to show error messages
function showError(message) {
    errorMessage.textContent = message;
}

