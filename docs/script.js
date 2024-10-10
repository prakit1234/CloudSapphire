const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');
const progressBar = document.getElementById('progressBar');
const fileCount = document.getElementById('fileCount');
const totalSize = document.getElementById('totalSize');

let uploadQueue = [];
let currentUpload = null;
let uploadedFiles = getAllFilesFromLocalStorage(); // Load files from local storage on page load

// Function to handle file upload using XMLHttpRequest
function handleFileUpload() {
  const file = fileInput.files[0];

  if (!file) {
    showError('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://ufile.io/upload', true);

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

    // Check if the server returned JSON or plain text
    if (xhr.status === 200 && xhr.getResponseHeader('content-type').includes('application/json')) {
      try {
        const responseJson = JSON.parse(xhr.responseText);
        const downloadLink = responseJson.download_link || 'Link not found';
        addFileToList(downloadLink, file.name, file.size);

        await sendWebhookNotificationWithRetries(downloadLink);
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
}

// Function to send webhook notification with retry mechanism
async function sendWebhookNotificationWithRetries(downloadLink, retries = 3) {
  const webhookUrl = 'https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX';
  const webhookData = `download_link=${encodeURIComponent(downloadLink)}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: webhookData,
      });

      if (response.ok) {
        return; // Exit function if the request was successful
      } else {
        console.error(`Webhook attempt ${attempt} failed: HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`Error sending webhook notification on attempt ${attempt}:`, error);
    }
  }
  showError('Failed to send webhook notification after multiple attempts.');
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

// Function to add file to upload list safely
function addFileToList(link, name, size) {
  const file = { link, name, size };
  uploadedFiles.push(file);

  const listItem = document.createElement('li');
  const linkElement = document.createElement('a');
  linkElement.href = link;
  linkElement.target = '_blank';
  linkElement.textContent = name;

  const sizeElement = document.createElement('span');
  sizeElement.textContent = ` (${size} bytes)`;

  listItem.appendChild(linkElement);
  listItem.appendChild(sizeElement);
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
