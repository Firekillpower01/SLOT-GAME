let walletConnected = false;
let balance = 100;
const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '🃏']; // 🃏 = wild

document.getElementById('connect-wallet').addEventListener('click', () => {
  walletConnected = true;
  document.getElementById('wallet-status').innerText = 'Wallet Verbonden ✅';
});

function updateBalance() {
  document.getElementById('balance').innerText = `Saldo: ${balance} SOL`;
}

function generateRandomGrid() {
  const grid = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const randSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      grid.push(randSymbol);
    }
  }
  return grid;
}

function drawGrid(grid) {
  const game = document.getElementById('game');
  game.innerHTML = '';
  grid.forEach(symbol => {
    const cell = document.createElement('div');
    cell.classList.add('reel');
    cell.innerText = symbol;
    if (symbol === '🃏') cell.classList.add('wild-effect');
    game.appendChild(cell);
  });
}

function calculateWin(grid, bet) {
  let win = 0;
  const lines = [
    [0, 1, 2], // bovenste rij
    [3, 4, 5], // midden
    [6, 7, 8], // onder
    [0, 4, 8], // diagonaal
    [2, 4, 6]  // diagonaal
  ];
  lines.forEach(line => {
    const lineSymbols = line.map(i => grid[i]);
    const allSame = lineSymbols.every(sym => sym === lineSymbols[0] || sym === '🃏');
    if (allSame) {
      const wildCount = lineSymbols.filter(sym => sym === '🃏').length;
      const base = 10;
      const multiplier = wildCount === 3 ? 10 : (wildCount === 2 ? 4 : (wildCount === 1 ? 2 : 1));
      win += base * multiplier;
    }
  });
  return win * bet;
}

function spin(bet = 0) {
  if (bet > balance) {
    alert("Onvoldoende saldo!");
    return;
  }

  const grid = generateRandomGrid();
  drawGrid(grid);

  const winnings = calculateWin(grid, bet);
  balance = balance - bet + winnings;
  updateBalance();

  if (winnings > 0) {
    alert(`🎉 Gewonnen: ${winnings} SOL!`);
  }
}

document.getElementById('spin-free').addEventListener('click', () => spin(0));
document.getElementById('spin-sol').addEventListener('click', () => spin(1));

window.onload = () => {
  drawGrid(generateRandomGrid());
  updateBalance();
};
