
const spinBtn = document.getElementById('spinBtn');
const message = document.getElementById('message');
const reelsContainer = document.querySelector('.reels');

// Symbols to display
const symbols = ['🍒', '🍋', '🍊', '🔔', '🍀', '💎', '7️⃣'];

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

// Function to spin reels
function spinReels() {
  message.textContent = 'Spinning...';
  let spinning = true;
  
  // Add the spinning effect to each reel
  for (let i = 0; i < 5; i++) {
    const reel = document.querySelector(`[data-reel-index="${i}"]`);
    reel.classList.add('active');
  }

  setTimeout(() => {
    // After the spinning animation, assign random symbols
    for (let i = 0; i < 5; i++) {
      const reel = document.querySelector(`[data-reel-index="${i}"]`);
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      reel.textContent = randomSymbol;
      reel.classList.remove('active');
    }
    checkWin();
  }, 2000); // 2 seconds spin time
}

// Check if the user won
function checkWin() {
  const reels = document.querySelectorAll('.reel');
  const values = Array.from(reels).map(reel => reel.textContent);
  
  // Check for 3 matching symbols
  const isWin = values.every(symbol => symbol === values[0]);

  if (isWin) {
    message.textContent = 'You win! 🎉';
    document.body.style.background = 'linear-gradient(45deg, #fd084e, #1e2a47)';
  } else {
    message.textContent = 'Try again!';
    document.body.style.background = 'linear-gradient(45deg, #1e2a47, #fd084e)';
  }
}

// Attach event listener to Spin button
spinBtn.addEventListener('click', spinReels);
generateReels();
    