// script.js

const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');

// Google Drive API details
const CLIENT_ID = '477947393379-vhhn7f3u3tiiahkh00h5fugtmc5cohb4.apps.googleusercontent.com'; // Replace with your actual Google API client ID
const FOLDER_ID = '1nvkZ_De-gIi3-IAT7dPrrd2YNaRCGV2z'; // Replace with your actual Google Drive folder ID
const SCOPES = 'https://www.googleapis.com/auth/drive.file'; // Scope for file access

// Authenticate and get access token
async function authenticate() {
    const authWindow = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${window.location.origin}&response_type=token&scope=${SCOPES}`,
        '_blank',
        'width=600,height=400'
    );

    // Wait for the user to complete authentication
    window.addEventListener('message', async (event) => {
        if (event.origin !== window.location.origin) return; // Ensure message is from the same origin
        const { access_token } = event.data;
        if (access_token) {
            localStorage.setItem('access_token', access_token); // Store access token
            uploadButton.disabled = false; // Enable upload button
        }
    });
}

// Trigger authentication when the page loads
window.onload = () => {
    if (!localStorage.getItem('access_token')) {
        authenticate(); // Authenticate if no access token is stored
    } else {
        uploadButton.disabled = false; // Enable upload button
    }
};

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
    const ACCESS_TOKEN = localStorage.getItem('access_token'); // Get the stored access token
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

