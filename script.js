let walletConnected = false;
let bonusSpinsRemaining = 0;
let isBonusGame = false;
let jackpotTriggered = false;

document.getElementById('connect-wallet').addEventListener('click', () => {
  walletConnected = true;
  document.getElementById('wallet-status').innerText = 'Wallet Verbonden ✅';
});

document.getElementById('spin').addEventListener('click', () => {
  const symbols = generateRandomSymbols();
  renderSymbols(symbols);
  const flatSymbols = symbols.flat();
  checkForBonus(flatSymbols);
});

document.getElementById('reset').addEventListener('click', () => {
  document.querySelectorAll('.reel').forEach(cell => cell.innerText = '');
});

function generateRandomSymbols() {
  const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '🃏']; // Wild = 🃏
  const result = [];
  for (let row = 0; row < 3; row++) {
    const rowSymbols = [];
    for (let col = 0; col < 3; col++) {
      const random = Math.floor(Math.random() * symbols.length);
      rowSymbols.push(symbols[random]);
    }
    result.push(rowSymbols);
  }
  return result;
}

function renderSymbols(symbols) {
  symbols.flat().forEach((sym, i) => {
    const cell = document.getElementById(`cell-${i}`);
    cell.innerText = sym;
    cell.classList.remove('wild-effect');
    if (sym === '🃏') {
      cell.classList.add('wild-effect');
    }
  });
}

function checkForBonus(symbols) {
  const wilds = symbols.filter(sym => sym === '🃏');
  if (wilds.length >= 3 && !isBonusGame) {
    startBonusGame();
  }
}

function startBonusGame() {
  bonusSpinsRemaining = 10;
  isBonusGame = true;
  showBonusPopup();
  updateBonusCounter();
  document.querySelectorAll('.reel').forEach(cell => {
    cell.classList.add('bonus-mode');
  });
}

function showBonusPopup(extra = false) {
  const popup = document.createElement('div');
  popup.innerText = extra ? '🎉 EXTRA BONUS SPINS!' : '🎰 BONUS GAME - 10 Gratis Spins!';
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.right = '20px';
  popup.style.backgroundColor = '#ff0';
  popup.style.padding = '12px';
  popup.style.fontSize = '20px';
  popup.style.fontWeight = 'bold';
  popup.style.borderRadius = '8px';
  popup.style.zIndex = '1000';
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 4000);
}

function updateBonusCounter() {
  let counter = document.getElementById('bonus-counter');
  if (!counter) {
    counter = document.createElement('div');
    counter.id = 'bonus-counter';
    counter.style.position = 'fixed';
    counter.style.top = '60px';
    counter.style.right = '20px';
    counter.style.backgroundColor = '#fff';
    counter.style.padding = '8px';
    counter.style.border = '2px solid #000';
    counter.style.zIndex = '1000';
    document.body.appendChild(counter);
  }
  counter.innerText = `Bonus Spins Over: ${bonusSpinsRemaining}`;
}
