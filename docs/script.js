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
let uploadedFiles = [];

// Function to handle file upload
async function handleFileUpload() {
  const file = fileInput.files[0];

  if (!file) {
    showError('Please select a file to upload.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

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

    // Add file to upload list
    addFileToList(downloadLink, file.name, file.size);

    // Send download link to webhook
    await sendWebhookNotification(downloadLink);

    // Update file count and size
    updateFileCountAndSize();
  } catch (error) {
    console.error('Error uploading file:', error); // More detailed logging for debugging
    showError(`Error uploading ${file.name}: ${error.message}`);
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

  // Add file to uploaded files array
  uploadedFiles.push({ name, size, link });
}
// Function to send webhook notification
async function sendWebhookNotification(downloadLink) {
  try {
    const response = await fetch('https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX', {
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

// Function to show error messages
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

// Add event listener to upload button
uploadButton.addEventListener('click', handleFileUpload);

// Function to handle multiple file uploads
function handleMultipleFileUpload() {
  const files = fileInput.files;

  if (files.length === 0) {
    showError('Please select files to upload.');
    return;
  }

  try {
    // Add files to upload queue
    for (const file of files) {
      uploadQueue.push(file);
    }

    // Update upload queue
    updateUploadQueue();

    // Update file count and size
    updateFileCountAndSize();

    // Start uploading files
    uploadNextFile();
  } catch (error) {
    console.error('Error handling multiple file upload:', error); // More detailed logging for debugging
    showError(`Error uploading files: ${error.message}`);
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
    console.error('Error uploading file:', error); // More detailed logging for debugging
    showError(`Error uploading ${currentUpload.name}: ${error.message}`);
    uploadNextFile();
  }
}

// Add event listener to file input
fileInput.addEventListener('change', handleMultipleFileUpload);
