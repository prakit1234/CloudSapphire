// script.js

const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');

// Google Drive API details
const FOLDER_ID = 'YOUR_FOLDER_ID'; // Replace with your actual Google Drive folder ID
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'; // Replace with your Google Drive API access token

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
        }
    }
});

// Function to upload a file to Google Drive
async function uploadFile(file) {
    const url = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id`;

    const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: [FOLDER_ID]
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({ 'Authorization': `Bearer ${ACCESS_TOKEN}` }),
            body: form
        });

        const data = await response.json();
        return `https://drive.google.com/file/d/${data.id}/view`; // Return the file link
    } catch (error) {
        console.error('Error uploading file:', error);
        errorMessage.textContent = 'Error uploading file. Please try again.';
        return null;
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

