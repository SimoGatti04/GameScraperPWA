import { renderGameList } from './gameList.js';
import { showGameDetailsScreen } from './gameDetailsScreen.js';
import { config } from "../config.js";

const API_URL = config.apiBaseUrl;

let gameData = null;

async function fetchGameData() {
    const response = await fetch(`${API_URL}/api/gameData`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'bypass-tunnel-reminder': 'true'
        },
        rejectUnauthorized: false
    });
    return response.json();
}


async function initApp() {
    gameData = await fetchGameData();
    renderGameList(gameData);

    document.addEventListener('showGameDetails', (e) => {
        showGameDetailsScreen(gameData);
    });

    document.addEventListener('showGameList', () => {
        const appElement = document.getElementById('app');
        appElement.innerHTML = '<div id="gameList"></div>';
        renderGameList(gameData);
    });
}

initApp();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}