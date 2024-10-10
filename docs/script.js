// Get HTML elements
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');
const progressBar = document.getElementById('progressBar');
const queueList = document.getElementById('queueList');
const fileCount = document.getElementById('fileCount');
const totalSize = document.getElementById('totalSize');

// Initialize variables
let uploadQueue = [];
let currentUpload = null;
let uploadedFiles = [];

// Function to handle file upload
async function handleFileUpload() {
    try {
        // Get selected file
        const file = fileInput.files[0];

        // Check if file is selected
        if (!file) {
            throw new Error('Please select a file to upload.');
        }

        // Add file to upload queue
        uploadQueue.push(file);
        updateUploadQueue();
        updateFileCountAndSize();

        // Start uploading files if no current upload
        if (!currentUpload) {
            uploadNextFile();
        }
    } catch (error) {
        console.error('Error handling file upload:', error);
        showError(error.message);
    }
}

// Function to update the upload queue
function updateUploadQueue() {
    // Clear queue list
    queueList.innerHTML = '';

    // Add files to queue list
    uploadQueue.forEach((file, index) => {
        const queueItem = document.createElement('li');
        queueItem.textContent = file.name;
        queueList.appendChild(queueItem);
    });
}

// Function to update the file count and size
function updateFileCountAndSize() {
    // Calculate total files and size
    const totalFiles = uploadQueue.length + uploadedFiles.length;
    const totalFileSize = uploadQueue.reduce((acc, file) => acc + file.size, 0) + uploadedFiles.reduce((acc, file) => acc + file.size, 0);

    // Update file count and size
    fileCount.textContent = `Total Files: ${totalFiles}`;
    totalSize.textContent = `Total Size: ${formatFileSize(totalFileSize)}`;
}

// Function to format file size
function formatFileSize(size) {
    // Check file size and format accordingly
    if (size < 1024) {
        return `${size} bytes`;
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
}

// Function to upload the next file in the queue
async function uploadNextFile() {
    try {
        // Check if upload queue is empty
        if (uploadQueue.length === 0) {
            currentUpload = null;
            return;
        }

        // Get next file from upload queue
        currentUpload = uploadQueue.shift();
        updateUploadQueue();
        updateFileCountAndSize();

        // Create form data
        const formData = new FormData();
        formData.append('file', currentUpload);

        // Upload file
        const response = await fetch('https://ufile.io/upload', {
            method: 'POST',
            body: formData,
            onUploadProgress: (event) => {
                const progress = Math.round((event.loaded / event.total) * 100);
                progressBar.value = progress;
            },
        });

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        // Get response data
        const ufileResponse = await response.json();
        const downloadLink = ufileResponse.url;
        console.log('Ufile response:', downloadLink); // Debug download link

        // Add file to uploaded files
        uploadedFiles.push({ name: currentUpload.name, size: currentUpload.size, link: downloadLink });

        // Add file to upload list
        addFileToList(downloadLink, currentUpload.name, currentUpload.size);

        // Send webhook notification
        await sendWebhookNotification(downloadLink);

        // Upload next file
        uploadNextFile();
    } catch (error) {
        console.error('Error uploading file:', error);
        showError(`Error uploading ${currentUpload.name}: ${error.message}`);
        uploadNextFile();
    }
}

// Function to send webhook notification
async function sendWebhookNotification(downloadLink) {
    try {
        // Replace with your webhook URL
        const webhookUrl = 'https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX';

        // Create webhook request
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application /json',
            },
            body: JSON.stringify({
                content: `New file uploaded: ${downloadLink}`,
            }),
        });

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`Webhook Error: ${response.status}`);
        }

        console.log('Webhook notification sent successfully'); // Log webhook success
    } catch (error) {
        console.error('Error sending webhook notification:', error);
    }
}

// Function to add file to upload list
function addFileToList(link, name, size) {
    // Create file card
    const fileCard = document.createElement('div');
    fileCard.classList.add('file-card');

    // Create file link
    const fileLink = document.createElement('a');
    fileLink.href = link;
    fileLink.target = '_blank';
    fileLink.textContent = link;

    // Create file delete button
    const fileDeleteButton = document.createElement('button');
    fileDeleteButton.textContent = 'Delete';
    fileDeleteButton.onclick = () => {
        const index = uploadedFiles.findIndex((file) => file.link === link);
        if (index !== -1) {
            uploadedFiles.splice(index, 1);
            updateFileCountAndSize();
            fileCard.remove();
        }
    };

    // Add file link and delete button to file card
    fileCard.appendChild(fileLink);
    fileCard.appendChild(fileDeleteButton);

    // Add file card to upload list
    uploadList.appendChild(fileCard);
}

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Add event listener to upload button
uploadButton.addEventListener('click', handleFileUpload);
