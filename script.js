let walletConnected = false;
let points = 1000;
let bonusSpinsRemaining = 0;
let isBonusGame = false;
let jackpotTriggered = false;

document.getElementById('connect-wallet').addEventListener('click', () => {
  walletConnected = true;
  document.getElementById('wallet-status').innerText = 'Wallet Verbonden ✅';
});

const gameBoard = document.getElementById('game');
const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '🃏']; // 🃏 is wild

function createBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const reel = document.createElement('div');
    reel.className = 'reel';
    reel.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    gameBoard.appendChild(reel);
  }
}

function generateRandomSymbols() {
  const reels = [];
  for (let i = 0; i < 9; i++) {
    reels.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  return reels;
}

function updateBoard(reels) {
  const elements = document.querySelectorAll('.reel');
  elements.forEach((el, i) => {
    el.innerText = reels[i];
    el.classList.remove('wild-effect');
  });
}

function checkLines(reels) {
  const winLines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];
  let totalWin = 0;

  for (const line of winLines) {
    const lineSymbols = line.map(i => reels[i]);
    const wilds = lineSymbols.filter(s => s === '🃏').length;
    const baseSymbol = lineSymbols.find(s => s !== '🃏');

    if (lineSymbols.every(s => s === baseSymbol || s === '🃏')) {
      const multiplier = (wilds === 3 ? 10 : wilds === 2 ? 4 : wilds === 1 ? 2 : 1) * (isBonusGame ? 2 : 1);
      const win = 10 * multiplier;
      totalWin += win;

      line.forEach(i => {
        const el = document.querySelectorAll('.reel')[i];
        if (reels[i] === '🃏') {
          el.classList.add('wild-effect');
          el.innerText = '🔥';
        }
      });

      if (wilds === 3 && isBonusGame && !jackpotTriggered) {
        jackpotTriggered = true;
        showPopup('🎉 JACKPOT! x500 GEWONNEN!', 'red');
        totalWin += 500;
      }

      if (wilds === 3 && isBonusGame) {
        bonusSpinsRemaining += 10;
        showPopup('🎉 10 EXTRA BONUS SPINS!', '#ff0');
        updateBonusCounter();
      }

      if (win >= 100) showPopup(`💰 MEGA WIN: ${win} punten!`, 'gold');
    }
  }
  return totalWin;
}

function showPopup(message, bg) {
  const popup = document.createElement('div');
  popup.className = 'big-win-popup';
  popup.innerText = message;
  popup.style.background = bg;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 4000);
}

function startBonusGame() {
  bonusSpinsRemaining = 10;
  isBonusGame = true;
  jackpotTriggered = false;
  updateBonusCounter();
  showPopup('🎰 BONUS GAME - 10 Gratis Spins!', '#ff0');
  document.querySelectorAll('.reel').forEach(r => r.classList.add('bonus-mode'));
}

function updateBonusCounter() {
  let counter = document.getElementById('bonus-counter');
  if (!counter) {
    counter = document.createElement('div');
    counter.id = 'bonus-counter';
    document.body.appendChild(counter);
  }
  counter.innerText = `Bonus Spins Over: ${bonusSpinsRemaining}`;
  if (bonusSpinsRemaining <= 0) {
    counter.remove();
    isBonusGame = false;
    document.querySelectorAll('.reel').forEach(r => r.classList.remove('bonus-mode'));
  }
}

function spin() {
  if (!walletConnected) {
    alert('Verbind eerst je wallet.');
    return;
  }

  if (!isBonusGame && points < 10) {
    alert('Niet genoeg punten!');
    return;
  }

  const newSymbols = generateRandomSymbols();
  updateBoard(newSymbols);
  const win = checkLines(newSymbols);

  if (isBonusGame) {
    bonusSpinsRemaining--;
    updateBonusCounter();
  } else {
    points -= 10;
  }

  points += win;
  document.getElementById('points').innerText = points;

  if (newSymbols.filter(s => s === '🃏').length >= 3 && !isBonusGame) {
    startBonusGame();
  }
}

document.getElementById('spin-button').addEventListener('click', spin);

createBoard();
