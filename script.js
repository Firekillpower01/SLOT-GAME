let walletAddress = null;
let demoSolBalance = 1.0;
let spinCost = 0.01;
let points = 10000;
let currentBet = 100;
const symbols = ['🍒', '🍋', '🍊', '🍉', '💎', '⭐', '7️⃣'];

const pointsDisplay = document.getElementById('points');
const betDisplay = document.getElementById('bet');
const messageDisplay = document.getElementById('message');
const reelsContainer = document.getElementById('reels');
const leaderboardList = document.getElementById('leaderboard-list');

// 🔊 Geluiden
const soundSpin = new Audio('sounds/spin.mp3');
const soundWin = new Audio('sounds/win.mp3');
const soundLose = new Audio('sounds/lose.mp3');

// 🎰 Genereer 5 kolommen × 3 rijen
function createReels() {
    reelsContainer.innerHTML = '';
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            cell.classList.add('reel');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            reelsContainer.appendChild(cell);
        }
    }
}
createReels();

// 🔁 Spin
function spin() {
    if (demoSolBalance < spinCost) {
        messageDisplay.textContent = "Niet genoeg demo SOL!";
        return;
    }

    soundSpin.play();
    demoSolBalance -= spinCost;
    updateCryptoBalance();

    const allReels = document.querySelectorAll('.reel');
    allReels.forEach(reel => {
        reel.classList.remove('win');
        setTimeout(() => {
            reel.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        }, 100);
    });

    setTimeout(checkWin, 600);
}

// ✅ Winlijncontrole (alle horizontale en diagonale lijnen)
function checkWin() {
    const grid = Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => {
            return document.querySelector(`.reel[data-row="${row}"][data-col="${col}"]`);
        })
    );

    let winningLines = [];

    // Horizontaal
    for (let row = 0; row < 3; row++) {
        if (grid[row].every(cell => cell.innerText === grid[row][0].innerText)) {
            winningLines.push(grid[row]);
        }
    }

    // Diagonaal ↘️
    if (grid[0][0].innerText === grid[1][1].innerText &&
        grid[1][1].innerText === grid[2][2].innerText &&
        grid[2][2].innerText === grid[0][0].innerText) {
        winningLines.push([grid[0][0], grid[1][1], grid[2][2]]);
    }

    // Diagonaal ↙️
    if (grid[0][4].innerText === grid[1][3].innerText &&
        grid[1][3].innerText === grid[2][2].innerText &&
        grid[2][2].innerText === grid[0][4].innerText) {
        winningLines.push([grid[0][4], grid[1][3], grid[2][2]]);
    }

    if (winningLines.length > 0) {
        soundWin.play();
        let winnings = currentBet * winningLines.length * 5;
        points += winnings;
        messageDisplay.textContent = `🎉 Gewonnen: ${winnings} punten!`;
        updatePoints();

        // Highlight winst
        winningLines.flat().forEach(cell => cell.classList.add('win'));

        updateLeaderboard();
    } else {
        soundLose.play();
        messageDisplay.textContent = "❌ Geen winst, probeer opnieuw!";
    }
}

function updatePoints() {
    pointsDisplay.textContent = `Points: ${points}`;
}

function updateCryptoBalance() {
    document.getElementById('crypto-balance').textContent = `Demo Balance: ${demoSolBalance.toFixed(3)} SOL`;
}

// 🏆 Leaderboard
function updateLeaderboard() {
    let scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
    scores.push(points);
    scores = scores.sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(scores));

    leaderboardList.innerHTML = '';
    scores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1}: ${score} punten`;
        leaderboardList.appendChild(li);
    });
}

// 🧠 Bet logica
document.getElementById('increase-bet').addEventListener('click', () => {
    currentBet += 10;
    betDisplay.textContent = `Inzet: ${currentBet}`;
});

document.getElementById('decrease-bet').addEventListener('click', () => {
    if (currentBet > 10) {
        currentBet -= 10;
        betDisplay.textContent = `Inzet: ${currentBet}`;
    }
});

document.getElementById('spin-button').addEventListener('click', spin);
document.getElementById('bet-demo-sol').addEventListener('click', spin);

// Wallet connectie (vereenvoudigd)
document.getElementById('connect-wallet').addEventListener('click', async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            walletAddress = response.publicKey.toString();
            document.getElementById('wallet-status').textContent = `Wallet verbonden: ${walletAddress}`;
        } catch {
            alert("Verbinding geweigerd");
        }
    } else {
        alert("Installeer Phantom Wallet extensie");
    }
});

updatePoints();
updateLeaderboard();
