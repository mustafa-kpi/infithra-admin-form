// This script populates the account number dropdown in subscription-creator.html
function populateAccountDropdown() {
    fetch(`${apiURL}/system/client/accounts`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${cognitoToken}`,
            'x-origin-ip': originIP,
            'x-otp': otp,
            "x-compression": false,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const select = document.querySelector('#accountNumber');
            select.innerHTML = '<option value="">Select Account</option>';
            data.data.forEach(account => {
                const option = document.createElement('option');
                option.value = account.accountId;
                option.text = `${account.accountId} : ${account.name}`;
                select.appendChild(option);
            });
            $('#accountNumber').selectpicker('refresh');
        })
        .catch(error => console.error('Error fetching clients:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('#accountNumber')) {
        populateAccountDropdown();
    }
});
