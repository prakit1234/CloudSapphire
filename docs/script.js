const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadList = document.getElementById('uploadList');
const errorMessage = document.getElementById('errorMessage');
const webhookUrl = "https://ptb.discord.com/api/webhooks/1292501408746180678/SbDR8QTAt2uIl85-qPohWU7jt_nhSaI9eGJXx-LWhXxbgaV1lrikWlXcLK1XBoNO4yaX"; // Replace with your Discord webhook URL

// MongoDB connection string
const url = 'mongodb://hmmmmsaphhie_zippersets:3955448ddbf6ebabb6740b4f7af41d8c9a377949@t3nif.h.filess.io:27018/hmmmmsaphhie_zippersets';
const dbName = 'hmmmmsaphhie_zippersets';
const collectionName = 'files';

// Replace <username> and <password> with your actual MongoDB Atlas credentials
const username = 'hmmmmsaphhie_zippersets';
const password = '3955448ddbf6ebabb6740b4f7af41d8c9a377949';

const connectionString = `mongodb+srv://${username}:${password}@cluster0.filess.io/?retryWrites=true&w=majority`;

// Import the MongoDB Node.js Driver library
import { MongoClient } from 'mongodb';

uploadButton.addEventListener('click', async () => {
    const files = fileInput.files;

    if (files.length === 0) {
        showError('Please select a file to upload.');
        return;
    }

    errorMessage.textContent = ''; // Clear previous errors

    for (const file of files) {
        const downloadLink = await uploadFile(file);
        if (downloadLink) {
            addFileToList(downloadLink);
            await sendToWebhook(downloadLink);
            await saveToDatabase(downloadLink);
        }
    }
});

// Function to upload a file to Uguu.se
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://uguu.se/upload.php', {
            method: 'POST',
            body: formData,
        });

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const responseText = await response.text();
        const downloadLinkMatch = responseText.match(/https:\/\/uguu\.se\/[a-zA-Z0-9]+/);
        if (downloadLinkMatch) {
            const downloadLink = downloadLinkMatch[0];
            console.log('Uguu.se response:', downloadLink); // Debug download link
            return downloadLink;
        } else {
            throw new Error('Failed to extract download link from Uguu.se response');
        }
    } catch (error) {
        console.error('Error uploading file:', error); // More detailed logging for debugging
        showError(`Error uploading ${file.name}: ${error.message}`);
        return null;
    }
}

// Function to display the file download link
function addFileToList(link) {
    const fileLink = document.createElement('a');
    fileLink.href = link;
    fileLink.target = '_blank';
    fileLink.textContent = link;
    uploadList.appendChild(fileLink);
}

// Function to send the download link to a Discord webhook
async function sendToWebhook(link) {
    const payload = {
        content: `New file uploaded: ${link}`,
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Webhook Error: ${response.status}`);
        }

        console.log('Webhook notification sent successfully'); // Log webhook success
    } catch (error) {
        console.error('Error sending to webhook:', error); // Detailed logging for webhook errors
    }
}

// Function to save the download link to your MongoDB database
async function saveToDatabase(link) {
    try {
        // Connect to the database
        const client = new MongoClient(connectionString);
        await client.connect();

        // Get a reference to the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the download link into the collection
        const result = await collection.insertOne({ downloadLink: link });

        console.log('Database updated successfully');
    } catch (err) {
        console.error('Error saving to database:', err);
    } finally {
        // Close the client
        await client.close();
    }
}

// Function to show error messages
function showError(message) {
    errorMessage.textContent = message;
}
