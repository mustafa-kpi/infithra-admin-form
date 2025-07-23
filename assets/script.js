let apiURL;
let cognitoToken, otp, originIP, otpExpiry, userModal, selectedEnv;

const getCognitoCredentials = () => {
    const environment = sessionStorage.getItem('selectedEnv');

    switch (environment) {
      case "local":
        return {
            poolID: "us-east-1_B0evpPXDl",
            clientID: "68cf37qtu8rusjha7ot8f20q3m",
            region: "us-east-1"
        };
      case "development":
        return {
            poolID: "us-east-1_B0evpPXDl",
            clientID: "68cf37qtu8rusjha7ot8f20q3m",
            region: "us-east-1"
        };
      case "staging":
        return {
            poolID: "us-east-1_QQBXg3f2l",
            clientID: "2qpj2s3vv3jninl7hoql5nf5du",
            region: "us-east-1"
        };
      case "production":
        return {
            poolID: "me-south-1_qcoTXCxZJ",
            clientID: "3c9bc02c962pu6foj4vkkas0eo",
            region: "me-south-1"
        };
      default:
        return {};
    }
  };

window.onload = async () => {
    console.log("🟢 Document loaded");

    const ipResponse = await fetch('https://api64.ipify.org?format=json');
    const ipData = await ipResponse.json();
    originIP = ipData.ip;

    cognitoToken = sessionStorage.getItem('cognitoToken');
    otp = sessionStorage.getItem('x-otp');
    selectedEnv = sessionStorage.getItem('selectedEnv');
    console.log("📩 ~ otp:", otp);

    if(selectedEnv){
        apiURL = getApiUrlByEnvironment(selectedEnv);
        apiManintenanceURL = getApiManintenanceUrlByEnvironment(selectedEnv);

    }else{
        updateApiURL('local')
    }

    if (!cognitoToken || !otp) {
        console.log("🚫 ~ Missing cognitoToken or otp. Redirecting to login.");

        if (!window.location.href.includes('login')) {
            window.location.href = 'login.html';
            return;
        }
    }

    // Custom logic for this specific HTML page
    if (window.location.href.includes('company.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('editId');
        if(editId) {
            editCompany(editId);
        } else {
            fetchCompanies();
        }
        console.log("✅ Company Page functions initialized");
    }

    if (window.location.href.includes('company-view.html')) {
        fetchAndPopulateCompany();
        console.log("✅ Company View Page functions initialized");
    }

    if(window.location.href.includes('system-control')) {
        populateClients();
        populateModels();
        fetchMigrationFiles();
        console.log("✅ System Page functions initialized");
    }

    if(window.location.href.includes('subscription-creator')) {
        populateAccountDropdown();
        console.log("✅ System Page functions initialized");
    }

    if(window.location.href.includes('system-maintenance')) {
        loadCurrentMaintenance();
        loadMaintenanceHistory();

        // Set default date to today and time to next hour
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        const startTime = `${String(nextHour.getHours()).padStart(2, '0')}:${String(nextHour.getMinutes()).padStart(2, '0')}`;
        const endTime = `${String(nextHour.getHours() + 1).padStart(2, '0')}:${String(nextHour.getMinutes()).padStart(2, '0')}`;

        document.getElementById('date').value = today;
        document.getElementById('startTime').value = startTime;
        document.getElementById('endTime').value = endTime;
    }

};


function getApiUrlByEnvironment(environment) {
    switch (environment) {
        case 'local': return 'http://localhost:5303';
        case 'development': return 'https://api.development.infithra.com';
        case 'staging': return 'https://api.staging.infithra.com';
        case 'production': return 'https://api.infithra.com';
        default: return 'http://localhost:5303';
    }
}
function getApiManintenanceUrlByEnvironment(environment) {
    switch (environment) {
        case 'local': return 'http://localhost:3000';
        case 'development': return 'https://api-status.infithra.com';
        case 'staging': return 'https://api-status.infithra.com';
        case 'production': return 'https://api-status.infithra.com';
        default: return 'http://localhost:3000';
    }
}
function updateApiURL(selectedEnv) {
    sessionStorage.setItem('selectedEnv', selectedEnv);
    apiURL = getApiUrlByEnvironment(selectedEnv);
    apiManintenanceURL = getApiManintenanceUrlByEnvironment(selectedEnv);
    console.log(`🌍 Environment set to: ${selectedEnv}`);
    console.log(`🔗 API URL updated to: ${apiURL}`);
     console.log(`🔗 Manintenance API URL updated to: ${apiManintenanceURL}`);
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login.html';
}

function showApiLoader(isLoading, text) {
    const apiLoaderDiv = document.getElementById('apiLoader');
    const apiLoaderText = apiLoaderDiv.querySelector('#loaderText');
    if (isLoading) {
        apiLoaderText.textContent = text
        apiLoaderDiv.style.display = 'flex';
    } else {
        apiLoaderDiv.style.display = 'none';
    }
}
