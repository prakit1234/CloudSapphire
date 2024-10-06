// Discord webhook URL to receive file upload notifications
const DISCORD_WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX'; // Replace with your actual Discord webhook URL

// Elements
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');

// Event listener for the upload button
uploadButton.addEventListener('click', async () => {
    const files = fileInput.files;

    // Check if files are selected
    if (files.length === 0) {
        errorMessage.textContent = 'Please select a file to upload.';
        return;
    } else {
        errorMessage.textContent = ''; // Clear previous errors
    }

    // Loop through each file and upload
    for (const file of files) {
        try {
            const uploadResult = await uploadFile(file);
            if (uploadResult) {
                addFileToList(uploadResult); // Add the file link to the display list
                await sendToDiscord(uploadResult); // Send the file link to Discord
            }
        } catch (error) {
            console.error('Upload error for file:', file.name, error);
            errorMessage.textContent += `Error uploading ${file.name}: ${error.message}\n`; // Append errors
        }
    }
});

// Function to upload a file to AnonFiles
async function uploadFile(file) {
    const url = 'https://api.anonfiles.com/upload';

    const formData = new FormData();
    formData.append('file', file); // Append the file to the form data

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the upload was successful
        if (data.status) {
            console.log(`File uploaded successfully: ${data.data.file.url.full}`); // Log success
            return data.data.file.url.full; // Return the download link
        } else {
            throw new Error('Error uploading file: ' + (data.error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // Re-throw error for handling in the caller function
    }
}

// Function to send the uploaded file link to Discord
async function sendToDiscord(link) {
    const payload = {
        content: `A new file has been uploaded: ${link}`,
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Check if the response from Discord is ok
        if (!response.ok) {
            throw new Error(`Error sending to Discord: ${response.statusText}`);
        }
        console.log('File link sent to Discord successfully.'); // Log success
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}

// Function to add uploaded file link to the list
function addFileToList(link) {
    const fileLink = document.createElement('a');
    fileLink.href = link; // Set the href to the uploaded file's link
    fileLink.target = '_blank'; // Open link in new tab
    fileLink.textContent = link; // Set link text
    uploadList.appendChild(fileLink); // Append the link to the upload list
}

