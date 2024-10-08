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

    const webhookPayload = {
      content: `New file uploaded: ${downloadLink}`,
      embeds: [
        {
          title: file.name,
          description: `File uploaded by ${fileInput.value}`,
          fields: [
            {
              name: 'File Size',
              value: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              inline: true,
            },
            {
              name: 'File Type',
              value: file.type,
              inline: true,
            },
          ],
          footer: {
            text: `Uploaded at ${new Date().toLocaleString()}`,
          },
        },
      ],
    };

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook Error: ${webhookResponse.status}`);
    }

    console.log('Webhook notification sent successfully'); // Log webhook success

    const webhookResponseJson = await webhookResponse.json();
    console.log('Webhook response:', webhookResponseJson); // Debug webhook response
  } catch (error) {
    console.error('Error uploading file:', error); // More detailed logging for debugging
    alert(`Error uploading file: ${error.message}`);
  }
});
