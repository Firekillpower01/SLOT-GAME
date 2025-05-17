const spinBtn = document.getElementById('spinBtn');
const message = document.getElementById('message');
const pointsDisplay = document.getElementById('points');
const wagerInput = document.getElementById('wager');
const decreaseWagerBtn = document.getElementById('decreaseWager');
const increaseWagerBtn = document.getElementById('increaseWager');
const reelsContainer = document.querySelector('.reels-container');

// Sound files (ensure these files exist in your project directory)
const spinSound = new Audio('spin-sound.mp3');
const winSound = new Audio('win-sound.mp3');
const loseSound = new Audio('lose-sound.mp3');
const bonusSound = new Audio('bonus-sound.mp3');

// Symbols (including wild symbol 🌟)
const symbols = ['🍒', '🍋', '🍊', '🔔', '🍀', '💎', '7️⃣', '💰', '🌟']; // Wild Symbol added

let points = 10000;
let wager = 100;
let wildSymbol = '🌟';

// Update the points display
function updatePoints() {
  pointsDisplay.textContent = `Points: ${points}`;
}

// Generate the reels
function generateReels() {
  reelsContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const reel = document.createElement('div');
    reel.classList.add('reel');
    reel.dataset.reelIndex = i;
    reelsContainer.appendChild(reel);
  }
}

// Spin the reels
function spinReels() {
  wager = parseInt(wagerInput.value);

  if (wager <= 0 || wager > points) {
    message.textContent = `Invalid wager! You have ${points} points.`;
    return;
  }

  points -= wager;
  updatePoints();
  message.textContent = 'Spinning...';
  playSound(spinSound);

  const reels = document.querySelectorAll('.reel');
  reels.forEach((reel, index) => {
    reel.classList.add('active');
    setTimeout(() => {
      reel.classList.remove('active');
    }, 2000);
  });

  setTimeout(() => {
    const reelSymbols = [];
    reels.forEach((reel) => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      reel.textContent = randomSymbol;
      reelSymbols.push(randomSymbol);
    });
    checkWin(reelSymbols);
  }, 2000);
}

// Check win conditions
function checkWin(reelSymbols) {
  const isWin = reelSymbols.every(symbol => symbol === reelSymbols[0]);
  const isWild = reelSymbols.includes(wildSymbol);

  const bonusCount = reelSymbols.filter(symbol => symbol === '💰').length;
  const isBonus = bonusCount >= 3;

  if (isBonus) {
    message.textContent = 'Bonus Round Activated!';
    playSound(bonusSound);
    startBonusRound();
  } else if (isWin || isWild) {
    const payout = isWild ? 3 : 1;
    points += wager * payout;
    updatePoints();
    message.textContent = `You win! Payout: x${payout}`;
    playSound(winSound);
    displayWinEffects();
  } else {
    message.textContent = 'Try again!';
    playSound(loseSound);
  }
}

// Display visual effects on win
function displayWinEffects() {
  document.body.style.background = 'linear-gradient(45deg, #f1c40f, #e67e22)';
  setTimeout(() => {
    document.body.style.background = 'linear-gradient(45deg, #232c52, #0f0e34)';
  }, 1500);
}

// Bonus round animation
function startBonusRound() {
  setTimeout(() => {
    message.textContent = 'Bonus Round Over!';
    document.body.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
  }, 3000);
}

// Random payout multiplier
function getRandomPayout() {
  return Math.floor(Math.random() * 5) + 1;
}

// Adjust wager
decreaseWagerBtn.addEventListener('click', () => {
  wager = Math.max(1, wager - 100);
  wagerInput.value = wager;
});

increaseWagerBtn.addEventListener('click', () => {
  wager = Math.min(10000, wager + 100);
  wagerInput.value = wager;
});

// Spin button functionality
spinBtn.addEventListener('click', spinReels);

// Initialize the game
generateReels();
updatePoints();
