export function showGameDetailsScreen(gameData, clickedGameTitle) {
    const mainElement = document.getElementById('app');
    mainElement.innerHTML = '';

    const game = gameData.find(g => g.title === clickedGameTitle);
    const detailsScreen = createDetailsScreen(game);
    mainElement.appendChild(detailsScreen);
}


function createDetailsScreen(game) {
    const screen = document.createElement('div');
    screen.classList.add('game-details-screen');

    screen.innerHTML = `
        <button id="backButton">Torna alla lista</button>
        <h1>${game.title}</h1>
        <div class="price-overview">
            <p>Prezzo più basso generale: ${game.overallMinPrice}</p>
            <p>Prezzo medio generale: ${game.overallAveragePrice}</p>
        </div>
        <div class="site-prices">
            ${game.siteData.map(site => createSitePriceInfo(site, game.overallAveragePrice)).join('')}
        </div>
        <div class="price-history">
            ${createPriceHistoryChart(game.siteData, game.overallLowestPrices)}
        </div>
    `;

    screen.querySelector('#backButton').addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('showGameList'));
    });

    return screen;
}

function createSitePriceInfo(siteData, overallAveragePrice) {
    const currentPrice = parseFloat(siteData.currentPrice.price.replace(/[^0-9.]/g, ''));
    const averagePrice = parseFloat(siteData.averagePrice);
    let lastPrice;
    if (siteData.priceHistory.length > 1) {
        lastPrice = siteData.priceHistory[siteData.priceHistory.length - 2].price;
    }
    else {
        lastPrice = siteData.currentPrice.price;
    }

    const vsAverage = getPriceComparisonText(currentPrice, averagePrice);
    const vsOverall = getPriceComparisonText(currentPrice, overallAveragePrice);
    const vsLast = getPriceComparisonText(currentPrice, lastPrice);

    return `
        <div class="site-price">
            <h3>${siteData.site}</h3>
            <p>Prezzo attuale: ${siteData.currentPrice.price}</p>
            <p>Prezzo minimo: ${siteData.minPrice.price}</p>
            <p>Prezzo medio: ${siteData.averagePrice}</p>
            <p>Il prezzo attuale è <span style="color: ${getPriceColor(vsAverage)}">${vsAverage}</span> della media del sito</p>
            <p>Il prezzo attuale è <span style="color: ${getPriceColor(vsOverall)}">${vsOverall}</span> della media generale</p>
            <p>Il prezzo attuale è <span style="color: ${getPriceColor(vsLast)}">${vsLast}</span> dell'ultimo prezzo</p>
            <p>Trend: <span style="color: ${getTrendColor(siteData.trend.direction)}">${getTrendText(siteData.trend.direction)}</span> (${siteData.trend.change} negli ultimi ${siteData.trend.period})</p>
        </div>
    `;
}

function createPriceHistoryChart(siteData, overallLowestPrices) {
    const chartContainer = document.createElement('div');
    chartContainer.innerHTML = `
        <canvas id="priceHistoryChart"></canvas>
        <canvas id="overallLowestPriceChart"></canvas>
    `;

    setTimeout(() => {
        createSitePriceChart(siteData);
        createOverallLowestPriceChart(overallLowestPrices);
    }, 0);

    return chartContainer.innerHTML;
}

function createSitePriceChart(siteData) {
    const ctx = document.getElementById('priceHistoryChart').getContext('2d');
    const siteColors = {
        'Gamivo': 'rgba(255, 165, 0, 0.8)',
        'Eneba': 'rgba(128, 0, 128, 0.8)',
        'G2A': 'rgba(0, 191, 255, 0.8)',
        'Kinguin': 'rgba(255, 0, 0, 0.8)'
    };

    const datasets = siteData.map(site => ({
        label: site.site,
        data: site.priceHistory.map(entry => ({
            x: new Date(entry.timestamp),
            y: typeof entry.price === 'string' ? parseFloat(entry.price.replace(/[^0-9.]/g, '')) : entry.price
        })),
        borderColor: siteColors[site.site],
        backgroundColor: siteColors[site.site],
        fill: false
    }));

    new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Cronologia prezzi per sito'
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'dd/MM/yy HH:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Data e Ora'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Prezzo'
                    }
                }
            }
        }
    });
}

function createOverallLowestPriceChart(overallLowestPrices) {
    const ctx = document.getElementById('overallLowestPriceChart').getContext('2d');

    let data = [];
    if (Array.isArray(overallLowestPrices)) {
        data = overallLowestPrices.map(entry => ({
            x: new Date(entry.timestamp),
            y: entry.price
        }));
    } else if (typeof overallLowestPrices === 'object') {
        data = Object.entries(overallLowestPrices).map(([timestamp, price]) => ({
            x: new Date(timestamp),
            y: price
        }));
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Prezzo più basso generale',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'transparent',
                fill: true
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Cronologia del prezzo più basso generale'
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'dd/MM/yy HH:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Data e Ora'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Prezzo'
                    }
                }
            }
        }
    });
}

function getPriceComparisonText(current, comparison) {
    if (current < comparison) return 'minore';
    if (current > comparison) return 'maggiore';
    return 'uguale';
}

function getPriceColor(comparison) {
    switch (comparison) {
        case 'minore': return 'green';
        case 'maggiore': return 'red';
        case 'uguale': return 'yellow';
    }
}

function getTrendText(trend) {
    switch (trend) {
        case 'decreasing': return 'in diminuzione';
        case 'increasing': return 'in aumento';
        default: return 'stabile';
    }
}

function getTrendColor(trend) {
    switch (trend) {
        case 'decreasing': return 'green';
        case 'increasing': return 'red';
        default: return 'yellow';
    }
}
