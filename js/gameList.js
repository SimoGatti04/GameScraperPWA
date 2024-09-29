import { addNewTracker } from './app.js';

export function renderGameList(gameData) {
    const gameListElement = document.getElementById('gameList');
    gameListElement.innerHTML = '';

    gameData.forEach(game => {
        const gamePreview = createGamePreview(game);
        gameListElement.appendChild(gamePreview);
    });

    // Add a button to create new trackers
    const addTrackerButton = document.createElement('button');
    addTrackerButton.textContent = 'Add New Tracker';
    addTrackerButton.addEventListener('click', () => {
        const gameName = prompt('Enter the name of the game to track:');
        if (gameName) {
            addNewTracker(gameName);
        }
    });
    gameListElement.appendChild(addTrackerButton);
}

function createGamePreview(game) {
    const preview = document.createElement('div');
    preview.classList.add('game-preview');
    preview.dataset.title = game.title;

    const priceComparison = comparePrices(game.currentLowestPrice.price, game.previousLowestPrice.price);
    const priceColor = getPriceColor(priceComparison);

    preview.innerHTML = `
        <h2>${game.title}</h2>
        <p>Prezzo più basso: <span style="color: ${priceColor}">${game.currentLowestPrice.price}</span></p>
    `;

    preview.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('showGameDetails', { detail: game.title }));
    });

    return preview;
}

function comparePrices(current, previous) {
    if (current < previous) return 'minore';
    if (current > previous) return 'maggiore';
    return 'uguale';
}

function getPriceColor(comparison) {
    switch (comparison) {
        case 'minore': return 'green';
        case 'maggiore': return 'red';
        case 'uguale': return 'yellow';
    }
}