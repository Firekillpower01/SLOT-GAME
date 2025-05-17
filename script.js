const spinBtn = document.getElementById('spinBtn');
const message = document.getElementById('message');
const pointsDisplay = document.getElementById('points');
const wagerInput = document.getElementById('wager');
const decreaseWagerBtn = document.getElementById('decreaseWager');
const increaseWagerBtn = document.getElementById('increaseWager');
const reelsContainer = document.querySelector('.reels');

// Sound files
const spinSound = new Audio('spin-sound.mp3');
const winSound = new Audio('win-sound.mp3');
const loseSound = new Audio('lose-sound.mp3');
const bonusSound = new Audio('bonus-sound.mp3');

// Symbols
const symbols = ['🍒', '🍋', '🍊', '🔔', '🍀', '💎', '7️⃣', '💰'];

// Initialize game state
let points = 10000;  // Starting points
let wager = 100;  // Default wager

// Update points display
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

// Function to play sounds
function playSound(sound) {
  sound.play();
}

// Spin reels function
function spinReels() {
  // Get wager value from input
  wager = parseInt(wagerInput.value);
  
  if (wager <= 0 || wager > points) {
    message.textContent = `Invalid wager! You have ${points} points. Please enter a valid wager.`;
    return;
  }

  points -= wager;  // Deduct wager
  updatePoints();  // Update points display

  message.textContent = 'Spinning...';

  // Play spin sound
  playSound(spinSound);

  // Add spinning animation
  const reels = document.querySelectorAll('.reel');
  reels.forEach((reel, index) => {
    reel.classList.add('active');  // Spin effect
    setTimeout(() => {
      reel.classList.remove('active');
    }, 2000);  // Duration of the spin
  });

  // After 2 seconds, show random symbols
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

// Check win and bonus
function checkWin(reelSymbols) {
  const isWin = reelSymbols.every(symbol => symbol === reelSymbols[0]);

  const bonusCount = reelSymbols.filter(symbol => symbol === '💰').length;
  const isBonus = bonusCount >= 3;

  if (isBonus) {
    message.textContent = 'Bonus Round Activated! 🎉';
    playSound(bonusSound);
    startBonusRound();
  } else if (isWin) {
    const payout = getRandomPayout();
    points += wager * payout;
    updatePoints();
    message.textContent = `You win! Payout: x${payout}`;
    playSound(winSound);
    document.body.style.background = 'linear-gradient(45deg, #f1c40f, #e67e22)';
    const winElements = document.querySelectorAll('.reel');
    winElements.forEach((reel) => reel.classList.add('win-animation'));
  } else {
    message.textContent = 'Try again!';
    playSound(loseSound);
    document.body.style.background = 'linear-gradient(45deg, #0f0e34, #232c52)';
  }
}

// Bonus round function
function startBonusRound() {
  setTimeout(() => {
    message.textContent = 'Bonus Round Over! 🎁';
    document.body.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
  }, 3000);
}

// Random payout multiplier
function getRandomPayout() {
  return Math.floor(Math.random() * 5) + 1;
}

// Increase/Decrease wager buttons
decreaseWagerBtn.addEventListener('click', () => {
  wager = Math.max(1, wager - 100);
  wagerInput.value = wager;
});

increaseWagerBtn.addEventListener('click', () => {
  wager = Math.min(10000, wager + 100);
  wagerInput.value = wager;
});

// Spin button
spinBtn.addEventListener('click', spinReels);

// Initialize the game
generateReels();
updatePoints();
