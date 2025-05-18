let walletConnected = false;
let solanaBalance = 1000;

// Connect Wallet
document.getElementById('connect-wallet').addEventListener('click', () => {
  walletConnected = true;
  document.getElementById('wallet-status').innerText = 'Wallet Verbonden ✅';
});

// Toon rollen
function drawGrid(symbols) {
  const gameDiv = document.getElementById('game');
  gameDiv.innerHTML = '';
  symbols.flat().forEach(sym => {
    const cell = document.createElement('div');
    cell.classList.add('reel');
    cell.innerText = sym;
    if (sym === '🃏') cell.classList.add('wild-effect');
    gameDiv.appendChild(cell);
  });
}

// Genereer symbolen
function generateSymbols() {
  const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '🃏'];
  const grid = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    grid.push(row);
  }
  return grid;
}

// Winstberekening
function calculateWinnings(symbols) {
  let winnings = 0;
  for (let row of symbols) {
    if (row.every(sym => sym === row[0] || sym === '🃏')) {
      winnings += 100;
    }
  }
  return winnings;
}

// Gewone spin
document.getElementById('spin-button').addEventListener('click', () => {
  const symbols = generateSymbols();
  drawGrid(symbols);
  const win = calculateWinnings(symbols);
  if (win > 0) alert(`🎉 Gewonnen: ${win} punten!`);
});

// Spin met SOL
document.getElementById('sol-spin-button').addEventListener('click', () => {
  if (!walletConnected) return alert('Verbind eerst je wallet!');
  if (solanaBalance < 10) return alert('Niet genoeg SOL!');
  solanaBalance -= 10;
  document.getElementById('solana-balance').innerText = `💰 Solana Balance: ${solanaBalance} SOL`;

  const symbols = generateSymbols();
  drawGrid(symbols);
  const win = calculateWinnings(symbols);
  if (win > 0) {
    const solWin = win / 10;
    solanaBalance += solWin;
    document.getElementById('solana-balance').innerText = `💰 Solana Balance: ${solanaBalance} SOL`;
    alert(`🎉 Gewonnen: ${solWin} SOL!`);
  }
});
