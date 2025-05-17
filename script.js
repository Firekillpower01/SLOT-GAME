const spinBtn = document.getElementById('spinBtn');
const message = document.getElementById('message');
const pointsDisplay = document.getElementById('points');
const wagerInput = document.getElementById('wager');
const reelsContainer = document.querySelector('.reels');

// Symbols to display
const symbols = ['🍒', '🍋', '🍊', '🔔', '🍀', '💎', '7️⃣', '💰'];  // Added bonus symbol 💰

// Load the sound files
const spinSound = new Audio('spin-sound.mp3');
const winSound = new Audio('win-sound.mp3');
const loseSound = new Audio('lose-sound.mp3');
const bonusSound = new Audio('bonus-sound.mp3');  // Added bonus sound

let points = 10000;  // Starting points
let wager = 100;  // Default wager

// Update points display
function updatePoints() {
  pointsDisplay.textContent = `Points: ${points}`;
}

// Generate the initial slot reels
function generateReels() {
  reelsContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const reel = document.createElement('div');
    reel.classList.add('reel');
    reel.dataset.reelIndex = i;
    reelsContainer.appendChild(reel);
  }
}

// Function to play sound
function playSound(sound) {
  sound.play();
}

// Function to spin reels
function spinReels() {
  // Get the wager value from the input
  wager = parseInt(wagerInput.value);
  
  if (wager <= 0 || wager > points) {
    message.textContent = `Invalid wager! You have ${points} points. Please enter a valid wager.`;
    return;
  }

  points -= wager;  // Deduct wager from points
  updatePoints();  // Update points display
  
  message.textContent = 'Spinning...';
  
  // Play the spin sound
  playSound(spinSound);

  // Add the spinning effect to each reel
  for (let i = 0; i < 5; i++) {
    const reel = document.querySelector(`[data-reel-index="${i}"]`);
    reel.classList.add('active');
  }

  setTimeout(() => {
    // After the spinning animation, assign random symbols
    const reelSymbols = [];
    for (let i = 0; i < 5; i++) {
      const reel = document.querySelector(`[data-reel-index="${i}"]`);
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      reel.textContent = randomSymbol;
      reelSymbols.push(randomSymbol);
      reel.classList.remove('active');
    }
    checkWin(reelSymbols);  // Pass the symbols to check for a win or bonus
  }, 2000); // 2 seconds spin time
}

// Check if the user won or triggered a bonus round
function checkWin(reelSymbols) {
  // Check for 3 matching symbols
  const isWin = reelSymbols.every(symbol => symbol === reelSymbols[0]);

  // Check if Bonus round should be triggered
  const bonusCount = reelSymbols.filter(symbol => symbol === '💰').length;
  const isBonus = bonusCount >= 3;  // If we get 3 or more Bonus symbols, trigger bonus

  if (isBonus) {
    message.textContent = 'Bonus Round Activated! 🎉';
    playSound(bonusSound);  // Play the bonus sound
    startBonusRound();
  } else if (isWin) {
    const payout = getRandomPayout();  // Random payout multiplier
    points += wager * payout;  // Update points based on wager and payout
    updatePoints();
    message.textContent = `You win! Payout: x${payout} 🎉`;
    playSound(winSound);  // Play the win sound
    document.body.style.background = 'linear-gradient(45deg, #fd084e, #1e2a47)';
  } else {
    message.textContent = 'Try again!';
    playSound(loseSound);  // Play the lose sound
    document.body.style.background = 'linear-gradient(45deg, #1e2a47, #fd084e)';
  }
}

// Start the bonus round
function startBonusRound() {
  // You can add your own bonus round logic here
  // For example, showing a bonus wheel or awarding extra points

  setTimeout(() => {
    message.textContent = 'Bonus Round Over! 🎁';
    // Reset the game or do something else here
    document.body.style.background = 'linear-gradient(45deg, #00c6ff, #0072ff)';
  }, 3000); // Bonus round lasts for 3 seconds
}

// Random payout system (multiplier)
function getRandomPayout() {
  // Random payout from 1x to 5x for winning lines
  return Math.floor(Math.random() * 5) + 1;
}

// Attach event listener to Spin button
spinBtn.addEventListener('click', spinReels);
generateReels();
updatePoints();
