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

let soundEnabled = true;

// Geluid toggle knop
const soundToggleBtn = document.createElement('button');
soundToggleBtn.id = 'sound-toggle';
soundToggleBtn.innerText = '🔊';
soundToggleBtn.style.position = 'fixed';
soundToggleBtn.style.top = '10px';
soundToggleBtn.style.right = '10px';
soundToggleBtn.style.zIndex = '1000';
document.body.appendChild(soundToggleBtn);

soundToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  bgMusic.volume = soundEnabled ? 0.5 : 0;
  spinSound.muted = !soundEnabled;
  winSound.muted = !soundEnabled;
  loseSound.muted = !soundEnabled;
  soundToggleBtn.innerText = soundEnabled ? '🔊' : '🔇';
});

// Muziek toggle via M toets
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
const increaseBetBtn = document.getElementById('increase-bet');
increaseBetBtn.addEventListener('click', () => {
  if (points >= currentBet + 10) {
    currentBet += 10;
    betDisplay.innerText = `Inzet: ${currentBet}`;
  } else {
    messageDisplay.innerText = "Niet genoeg punten!";
  }
});

const decreaseBetBtn = document.getElementById('decrease-bet');
decreaseBetBtn.addEventListener('click', () => {
  if (currentBet > 10) {
    currentBet -= 10;
    betDisplay.innerText = `Inzet: ${currentBet}`;
  }
});

// Spin knoppen
const spinButton = document.getElementById('spin-button');
const solSpinButton = document.getElementById('bet-demo-sol');

spinButton.addEventListener('click', handlePointSpin);
solSpinButton.addEventListener('click', handleSolSpin);

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
  if (soundEnabled) spinSound.play();

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
    [0, 1, 2], [3, 4, 5], [6, 7, 8],       // Horizontaal
    [0, 3, 6], [1, 4, 7], [2, 5, 8],       // Verticaal
    [0, 4, 8], [2, 4, 6],                 // Diagonaal
    [0, 4, 5], [3, 4, 8], [1, 4, 6]        // Extra creatieve lijnen
  ];

  const values = reels.map(r => r.textContent);
  let totalWinnings = 0;
  let winningLines = [];

  reels.forEach(r => {
    r.classList.remove('winline');
    r.classList.remove('flash');
    const existingOverlay = r.querySelector('.win-amount');
    if (existingOverlay) r.removeChild(existingOverlay);
  });

  const overlayLines = [];

  for (let line of winlines) {
    if (values[line[0]] === values[line[1]] && values[line[1]] === values[line[2]]) {
      winningLines.push(line);
    }
  }

  if (winningLines.length > 0) {
    const winnings = currentBet * 10 * winningLines.length;
    totalWinnings += winnings;

    winningLines.forEach(line => {
      const coords = [];
      line.forEach(index => {
        reels[index].classList.add('winline');
        reels[index].classList.add('flash');
        const winAmountTag = document.createElement('div');
        winAmountTag.className = 'win-amount';
        winAmountTag.textContent = `+${currentBet * 10}`;
        reels[index].appendChild(winAmountTag);

        const rect = reels[index].getBoundingClientRect();
        coords.push({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      });
      overlayLines.push(coords);
    });

    if (mode === 'points') {
      points += totalWinnings;
      pointsDisplay.textContent = `Points: ${points}`;
    }

    messageDisplay.textContent = `🎉 Gewonnen! ${totalWinnings} punten!`;
    if (soundEnabled) winSound.play();

    drawWinlines(overlayLines);

    if (totalWinnings >= currentBet * 10 * 2) {
      setTimeout(() => {
        alert(`🔥 Grote winst! Je won ${totalWinnings} punten!`);
      }, 700);
    }
  } else {
    if (mode === 'points') {
      messageDisplay.textContent = "Helaas, probeer opnieuw.";
    }
    if (soundEnabled) loseSound.play();
  }
}

function drawWinlines(lines) {
  const existingCanvas = document.getElementById('winlines-canvas');
  if (existingCanvas) existingCanvas.remove();

  const canvas = document.createElement('canvas');
  canvas.id = 'winlines-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.strokeStyle = 'gold';
  ctx.lineWidth = 3;

  lines.forEach(coords => {
    ctx.beginPath();
    coords.forEach((pt, index) => {
      if (index === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
  });

  setTimeout(() => canvas.remove(), 1200);
}

function updateCryptoBalance() {
  cryptoBalance.textContent = `Demo Balance: ${demoSolBalance.toFixed(3)} SOL`;
}
