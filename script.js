const spinBtn = document.getElementById('spinBtn');
const message = document.getElementById('message');
const reelsContainer = document.querySelector('.reels');

const symbols = ['A', 'K', 'Q', 'J', '10', 'Book', 'Rich Wilde', 'Anubis', 'Horus', 'Osiris'];

let isSpinning = false;

function generateReels() {
  reelsContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const reel = document.createElement('div');
    reel.classList.add('reel');
    reel.dataset.reelIndex = i;
    reelsContainer.appendChild(reel);
  }
}

function spinReels() {
  if (isSpinning) return;
  isSpinning = true;
  spinBtn.disabled = true;
  message.textContent = 'Spinning...';

  const spinResults = [];

  for (let i = 0; i < 5; i++) {
    const reel = document.querySelector(`[data-reel-index="${i}"]`);
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    spinResults.push(randomSymbol);
    reel.textContent = randomSymbol;
  }

  checkWin(spinResults);
}

function checkWin(results) {
  const uniqueSymbols = [...new Set(results)];
  if (uniqueSymbols.length === 1) {
    message.textContent = `🎉 You won with ${results[0]}!`;
  } else {
    message.textContent = 'No win this time.';
  }

  isSpinning = false;
  spinBtn.disabled = false;
}

spinBtn.addEventListener('click', spinReels);
generateReels();
