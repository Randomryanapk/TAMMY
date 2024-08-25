document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        creditCard: document.getElementById('creditCard').value,
        expDate: document.getElementById('expDate').value,
        cvv: document.getElementById('cvv').value,
        billingAddress: document.getElementById('billingAddress').value
    };

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Payment submitted successfully!');
        } else {
            alert('There was an error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
