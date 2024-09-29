const isTestMode = false;

let apiBaseUrl = '';

if (isTestMode) {
    apiBaseUrl = 'http://localhost:8080';
} else {
    apiBaseUrl = 'https://every-taxis-hug.loca.lt';
}

export const config = {
    apiBaseUrl
};