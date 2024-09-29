import { renderGameList } from './gameList.js';
import { showGameDetailsScreen } from './gameDetailsScreen.js';
import { config } from "../config.js";

const API_URL = config.apiBaseUrl;

let gameData = null;

async function fetchActiveTrackers() {
    const response = await fetch(`${API_URL}/tracker/active-games`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'bypass-tunnel-reminder': 'true',
            'access-control-allow-origin': '*',
        },
        rejectUnauthorized: false
    });
    return response.json();
}

async function fetchGameData(gameName) {
    const response = await fetch(`${API_URL}/api/gameData/${gameName}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'bypass-tunnel-reminder': 'true',
            'access-control-allow-origin': '*',
        },
        rejectUnauthorized: false
    });
    return response.json();
}

async function initApp() {
    const activeTrackers = await fetchActiveTrackers();
    gameData = await Promise.all(activeTrackers.map(fetchGameData));
    renderGameList(gameData);

    document.addEventListener('showGameDetails', (e) => {
        const clickedGameTitle = e.detail;
        showGameDetailsScreen(gameData, clickedGameTitle);
    });

    document.addEventListener('showGameList', () => {
        const appElement = document.getElementById('app');
        appElement.innerHTML = '<div id="gameList"></div>';
        renderGameList(gameData);
    });
}

async function addNewTracker(gameName) {
    const body = JSON.stringify({gameName});
    const response = await fetch(`${API_URL}/tracker/add-game`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'bypass-tunnel-reminder': 'true',
            'access-control-allow-origin': '*',
        },
        body: JSON.stringify({ gameName }),
        rejectUnauthorized: false
    });
    if (response.ok) {
        const newGameData = await fetchGameData(gameName);
        gameData.push(newGameData);
        renderGameList(gameData);
    }
}

initApp();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

export { addNewTracker };

