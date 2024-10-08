const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');
const webhookUrl = "https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX"; // Replace with your Discord webhook URL
const dropboxToken = "sl.B-bbbJMsu5xHRHBul3dsxUC5m4UA96KHkL40PgorsnO85jx5oQieGlI-XAaVXhfIxm1_8RrtMa5QrLUpnd5nLWlsJ4-MuOOd9xQce8ML33G30SYx2a5rdmmiAnUQB2utvo-kplonE-Ff"; // Replace with your Dropbox token

async function uploadFiles() {
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
}

// Function to upload a file to Dropbox
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${dropboxToken}`,
                'Content-Type': 'application/octet-stream',
                'Dropbox-API-Arg': JSON.stringify({
                    'path': `/${file.name}`,
                    'mode': 'add',
                    'autorename': true,
                    'mute': false
                })
            },
            body: file
        });

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const responseJson = await response.json();
        if (responseJson.path_display) {
            const downloadLink = `https://www.dropbox.com/s/${responseJson.path_display.replace(/^\/(.*)$/, '$1')}`;
            console.log('Dropbox response:', downloadLink); // Debug download link
            return downloadLink;
        } else {
            throw new Error('Failed to upload file to Dropbox');
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
