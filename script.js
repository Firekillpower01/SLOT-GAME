let walletAddress = null;
let demoSolBalance = 1.0;
let spinCost = 0.01;
let points = 10000;
let currentBet = 100;

const walletStatus = document.getElementById('wallet-status');
const cryptoBalance = document.getElementById('crypto-balance');
const pointsDisplay = document.getElementById('points');
const betDisplay = document.getElementById('bet');
const messageDisplay = document.getElementById('message');

const reels = [];
for (let i = 0; i < 9; i++) {
  reels.push(document.getElementById(`r${i}`));
}

// Geluiden
const spinSound = new Audio('sounds/spin.mp3');
const winSound = new Audio('sounds/win.mp3');
const loseSound = new Audio('sounds/lose.mp3');
const bgMusic = new Audio('sounds/music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;
bgMusic.play().catch(() => {});

// Muziek toggle
document.addEventListener('keydown', (e) => {
  if (e.key === 'm') {
    bgMusic.paused ? bgMusic.play() : bgMusic.pause();
  }
});

// Wallet verbinden
const connectWalletButton = document.getElementById('connect-wallet');
if (connectWalletButton) {
  connectWalletButton.addEventListener('click', async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        walletAddress = response.publicKey.toString();
        walletStatus.textContent = `Wallet verbonden: ${walletAddress}`;
        updateCryptoBalance();
      } catch {
        console.error("Wallet connectie geannuleerd");
      }
    } else {
      alert("Installeer Phantom Wallet extensie.");
    }
  });
}

// Inzet aanpassen
document.getElementById('increase-bet').addEventListener('click', () => {
  if (points >= currentBet + 10) {
    currentBet += 10;
    betDisplay.innerText = `Inzet: ${currentBet}`;
  } else {
    messageDisplay.innerText = "Niet genoeg punten!";
  }
});

document.getElementById('decrease-bet').addEventListener('click', () => {
  if (currentBet > 10) {
    currentBet -= 10;
    betDisplay.innerText = `Inzet: ${currentBet}`;
  }
});

document.getElementById('spin-button').addEventListener('click', handlePointSpin);
document.getElementById('bet-demo-sol').addEventListener('click', handleSolSpin);

function handlePointSpin() {
  if (points < currentBet) {
    messageDisplay.innerText = "Niet genoeg punten voor deze spin!";
    return;
  }

  points -= currentBet;
  pointsDisplay.textContent = `Points: ${points}`;
  playSpin('points');
}

function handleSolSpin() {
  if (!walletAddress) {
    messageDisplay.innerText = "Verbind eerst je wallet!";
    return;
  }
  if (demoSolBalance < 0.01) {
    messageDisplay.innerText = "Niet genoeg demo SOL!";
    return;
  }

  demoSolBalance -= 0.01;
  updateCryptoBalance();
  playSpin('sol');

  const winAmount = Math.random() < 0.3 ? 0.03 : 0;
  demoSolBalance += winAmount;
  updateCryptoBalance();
  if (winAmount > 0) {
    messageDisplay.textContent = `🎉 Je won ${winAmount.toFixed(2)} SOL!`;
  } else {
    messageDisplay.textContent = `❌ Geen winst, probeer opnieuw.`;
  }
}

function playSpin(mode) {
  const reelValues = ['🍒', '🍋', '🍊', '🍉', '💎', '⭐', '7️⃣', '🍇', '🍌'];
  spinSound.play();

  reels.forEach(reel => {
    const symbol = reelValues[Math.floor(Math.random() * reelValues.length)];
    reel.textContent = symbol;
    reel.classList.add('spin-animation');
    setTimeout(() => reel.classList.remove('spin-animation'), 500);
  });

  setTimeout(() => {
    checkWinline(mode);
  }, 600);
}

function checkWinline(mode) {
  const winlines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontaal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticaal
    [0, 4, 8], [2, 4, 6]            // Diagonaal
  ];

  const values = reels.map(r => r.textContent);
  let won = false;

  for (let line of winlines) {
    if (values[line[0]] === values[line[1]] && values[line[1]] === values[line[2]]) {
      won = true;
      break;
    }
  }

  if (won) {
    const winnings = currentBet * 10;
    if (mode === 'points') {
      points += winnings;
      pointsDisplay.textContent = `Points: ${points}`;
      messageDisplay.textContent = `🎉 Gewonnen! ${winnings} punten!`;
    }
    winSound.play();
  } else {
    if (mode === 'points') {
      messageDisplay.textContent = "Helaas, probeer opnieuw.";
    }
    loseSound.play();
  }
}

function updateCryptoBalance() {
  cryptoBalance.textContent = `Demo Balance: ${demoSolBalance.toFixed(3)} SOL`;
}
