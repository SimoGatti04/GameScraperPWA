const isTestMode = false;

let apiBaseUrl = '';

if (isTestMode) {
    apiBaseUrl = 'http://localhost:8080';
} else {
    apiBaseUrl = 'gamescraper.simogatti.site';
}

export const config = {
    apiBaseUrl
};