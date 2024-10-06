// Discord webhook URL to receive file upload notifications
const DISCORD_WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL'; // Replace with your actual Discord webhook URL

// Elements
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');

uploadButton.addEventListener('click', async () => {
    const files = fileInput.files;

    if (files.length === 0) {
        errorMessage.textContent = 'Please select a file to upload.';
        return;
    } else {
        errorMessage.textContent = ''; // Clear previous errors
    }

    for (const file of files) {
        const uploadResult = await uploadFile(file);
        if (uploadResult) {
            addFileToList(uploadResult);
            await sendToDiscord(uploadResult);
        }
    }
});

// Function to upload a file to AnonFiles
async function uploadFile(file) {
    const url = 'https://api.anonfiles.com/upload';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.status) {
            return data.data.file.url.full; // Return the download link
        } else {
            throw new Error('Error uploading file: ' + data.error.message);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        errorMessage.textContent = 'Error uploading file. Please try again.';
        return null;
    }
}

// Function to send the uploaded file link to Discord
async function sendToDiscord(link) {
    const payload = {
        content: `A new file has been uploaded: ${link}`,
    };

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}

// Function to add uploaded file link to the list
function addFileToList(link) {
    const fileLink = document.createElement('a');
    fileLink.href = link;
    fileLink.target = '_blank';
    fileLink.textContent = link;
    uploadList.appendChild(fileLink);
}


