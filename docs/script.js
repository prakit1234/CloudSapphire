// Google Drive API details
const FOLDER_ID = 'YOUR_FOLDER_ID'; // Replace with your actual Google Drive folder ID
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your Google API Client ID
const REDIRECT_URI = 'http://localhost:8080'; // Make sure this matches the redirect URI in Google Cloud Console

let ACCESS_TOKEN = ''; // This will hold your access token

// Function to authorize and get the access token
function authorize() {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/drive.file&access_type=offline&include_granted_scopes=true&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&client_id=${CLIENT_ID}`;
    window.location.href = authUrl;
}

// Check if we have an access token in the URL after redirect
if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    ACCESS_TOKEN = hashParams.get('access_token');
    window.history.replaceState({}, document.title, window.location.pathname); // Clear the URL
}

if (!ACCESS_TOKEN) {
    authorize();
}

// Elements
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');

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

        if (!response.ok) {
            throw new Error('Error uploading file');
        }

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


