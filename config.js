const isTestMode = false;

let apiBaseUrl = '';

if (isTestMode) {
    apiBaseUrl = 'http://localhost:8080';
} else {
    apiBaseUrl = 'https://curly-numbers-throw.loca.lt';
}

export const config = {
    apiBaseUrl
};