function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const errorMessage = document.getElementById('errorMessage');
    const uploadList = document.getElementById('uploadList');
    errorMessage.textContent = '';  // Clear previous errors
    uploadList.innerHTML = '';      // Clear previous uploads

    if (!file) {
        errorMessage.textContent = 'Please select a file to upload.';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('https://file.io', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const fileLink = document.createElement('a');
            fileLink.href = data.link;
            fileLink.textContent = 'Download your file here';
            uploadList.appendChild(fileLink);
        } else {
            throw new Error(data.message || 'Upload failed');
        }
    })
    .catch(error => {
        errorMessage.textContent = 'Error uploading file: ' + error.message;
    });
}
