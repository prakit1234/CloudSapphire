
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');
const progressBar = document.getElementById('progressBar');
const queueList = document.getElementById('queueList');
const fileCount = document.getElementById('fileCount');
const totalSize = document.getElementById('totalSize');

let uploadQueue = [];
let currentUpload = null;
let uploadedFiles = JSON.parse(sessionStorage.getItem('uploadedFiles')) || [];

// Function to handle file upload
async function handleFileUpload() {
    const file = fileInput.files[0];

    if (!file) {
        showError('Please select a file to upload.');
        return;
    }

    uploadQueue.push(file);
    updateUploadQueue();
    updateFileCountAndSize();

    if (!currentUpload) {
        uploadNextFile();
    }
}

// Function to update the upload queue
function updateUploadQueue() {
    queueList.innerHTML = '';

    uploadQueue.forEach((file, index) => {
        const queueItem = document.createElement('li');
        queueItem.textContent = file.name;
        queueList.appendChild(queueItem);
    });
}

// Function to update the file count and size
function updateFileCountAndSize() {
    const totalFiles = uploadQueue.length + uploadedFiles.length;
    const totalFileSize = uploadQueue.reduce((acc, file) => acc + file.size, 0) + uploadedFiles.reduce((acc, file) => acc + file.size, 0);

    fileCount.textContent = `Total Files: ${totalFiles}`;
    totalSize.textContent = `Total Size: ${formatFileSize(totalFileSize)}`;
}

// Function to format file size
function formatFileSize(size) {
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
    if (uploadQueue.length === 0) {
        currentUpload = null;
        return;
    }

    currentUpload = uploadQueue.shift();
    updateUploadQueue();
    updateFileCountAndSize();

    try {
        const formData = new FormData();
        formData.append('file', currentUpload);

        const response = await fetch('https://ufile.io/upload', {
            method: 'POST',
            body: formData,
            onUploadProgress: (event) => {
                const progress = Math.round((event.loaded / event.total) * 100);
                progressBar.value = progress;
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const ufileResponse = await response.json();
        const downloadLink = ufileResponse.url;
        console.log('Ufile response:', downloadLink); // Debug download link

        // Add file to uploaded files
        uploadedFiles.push({ name: currentUpload.name, size: currentUpload.size, link: downloadLink });
        sessionStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

        // Add file to upload list
        addFileToList(downloadLink);

        // Send webhook notification
        await sendWebhookNotification(downloadLink);

        uploadNextFile();
    } catch (error) {
        console.error('Error uploading file:', error); // More detailed logging for debugging
        showError(`Error uploading ${currentUpload.name}: ${error.message}`);
        uploadNextFile();
    }
}

// Function to send webhook notification
async function sendWebhookNotification(downloadLink) {
    try {
        const webhookUrl = 'https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX'; // Replace with your webhook URL
        const response = await fetch(webhookUrl, {
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

// Function to add file to upload list
function addFileToList(link) {
    const fileCard = document.createElement('div');
    fileCard.classList.add('file-card');

    const fileLink = document.createElement('a');
    fileLink.href = link;
    fileLink .target = '_blank';
    fileLink.textContent = link;

    const fileDeleteButton = document.createElement('button');
    fileDeleteButton.textContent = 'Delete';
    fileDeleteButton.onclick = () => {
        const index = uploadedFiles.findIndex((file) => file.link === link);
        if (index !== -1) {
            uploadedFiles.splice(index, 1);
            sessionStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
            updateFileCountAndSize();
            fileCard.remove();
        }
    };

    fileCard.appendChild(fileLink);
    fileCard.appendChild(fileDeleteButton);
    uploadList.appendChild(fileCard);
}

// Function to show error messages
function showError(message) {
    errorMessage.textContent = message;
}

// Add event listener to upload button
uploadButton.addEventListener('click', handleFileUpload);

// Initialize uploaded files
uploadedFiles.forEach((file) => {
    addFileToList(file.link);
});
updateFileCountAndSize();
