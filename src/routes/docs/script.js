const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');
const progressBar = document.getElementById('progressBar');
const fileCount = document.getElementById('fileCount');
const totalSize = document.getElementById('totalSize');

let uploadedFiles = getAllFilesFromLocalStorage(); // Load files from local storage on page load

// Function to handle file upload using XMLHttpRequest
function handleFileUpload() {
    const files = fileInput.files;

    if (!files.length) {
        showError('Please select a file to upload.');
        return;
    }

    Array.from(files).forEach(file => {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://file.io', true);

        // Update progress bar during file upload
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                progressBar.value = progress;
            }
        };

        // Handle successful upload
        xhr.onload = async () => {
            console.log('Server response:', xhr.responseText); // Debugging response

            if (xhr.status === 200) {
                try {
                    const responseJson = JSON.parse(xhr.responseText);
                    const downloadLink = responseJson.link || 'Link not found';
                    addFileToList(downloadLink, file.name, file.size);

                    // Send webhook notification with the uploaded file links
                    await sendWebhookNotification(downloadLink, file.name);
                    updateFileCountAndSize();
                } catch (error) {
                    showError(`Unexpected response format: ${error.message}`);
                }
            } else {
                console.error('Unexpected server response:', xhr.responseText);
                showError('The server returned an unexpected response. Please check the upload URL or try again later.');
            }
        };

        // Handle network errors
        xhr.onerror = () => {
            showError('Network error while uploading file.');
        };

        xhr.send(formData);
    });
}

// Function to send webhook notification
async function sendWebhookNotification(downloadLink, fileName) {
    const webhookUrl = 'https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX'; // Replace with your webhook URL
    const webhookData = `content=NEW FILE UPLOADED!!\nUploaded File: ${fileName}\nDownload Link: ${downloadLink}`;

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: webhookData,
        });

        if (!response.ok) {
            throw new Error(`Webhook Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending webhook notification:', error);
    }
}

// Function to add file to local storage
function addFileToLocalStorage(file) {
    const storedFiles = localStorage.getItem('files');
    const files = storedFiles ? JSON.parse(storedFiles) : [];
    files.push(file);
    localStorage.setItem('files', JSON.stringify(files));
}

// Function to get all files from local storage
function getAllFilesFromLocalStorage() {
    const storedFiles = localStorage.getItem('files');
    return storedFiles ? JSON.parse(storedFiles) : [];
}

// Function to remove file from local storage
function removeFileFromLocalStorage(fileLink) {
    const storedFiles = localStorage.getItem('files');
    if (storedFiles) {
        const files = JSON.parse(storedFiles);
        const index = files.findIndex((file) => file.link === fileLink);
        if (index !== -1) {
            files.splice(index, 1);
            localStorage.setItem('files', JSON.stringify(files));
        }
    }
}

// Function to add file to upload list
function addFileToList(link, name, size) {
    const file = { link, name, size };
    uploadedFiles.push(file);

    const listItem = document.createElement('div');
    listItem.classList.add('file-card');

    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.target = '_blank';
    linkElement.textContent = name;

    const sizeElement = document.createElement('span');
    sizeElement.textContent = ` (${size} bytes)`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        removeFileFromLocalStorage(link);
        uploadedFiles = uploadedFiles.filter(f => f.link !== link);
        uploadList.removeChild(listItem);
        updateFileCountAndSize();
    };

    listItem.appendChild(linkElement);
    listItem.appendChild(sizeElement);
    listItem.appendChild(deleteButton);
    uploadList.appendChild(listItem);

    addFileToLocalStorage(file);
    updateFileCountAndSize();
}

// Function to update file count and total size
function updateFileCountAndSize() {
    const totalBytes = uploadedFiles.reduce((acc, file) => acc + file.size, 0);
    fileCount.textContent = `Uploaded Files: ${uploadedFiles.length}`;
    totalSize.textContent = `Total Size: ${totalBytes} bytes`;
}

// Function to display error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Load files from local storage to display on page load
function initializeUploadList() {
    uploadedFiles.forEach((file) => {
        addFileToList(file.link, file.name, file.size);
    });
}

// Event listeners
uploadButton.addEventListener('click', handleFileUpload);

// Initialize the upload list on page load
initializeUploadList();
