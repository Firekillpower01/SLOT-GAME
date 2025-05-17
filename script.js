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

const reels = document.querySelectorAll('.reel');

// 🎵 GELUIDSEFFECTEN
const spinSound = new Audio('sounds/spin.mp3');
const winSound = new Audio('sounds/win.mp3');
const loseSound = new Audio('sounds/lose.mp3');

// Wallet connectie
const connectWallet = async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const response = await window.solana.connect();
      walletAddress = response.publicKey.toString();
      walletStatus.textContent = `Wallet verbonden: ${walletAddress}`;
      updateCryptoBalance();
    } catch (err) {
      console.error("Wallet connectie geannuleerd");
    }
  } else {
    alert("Installeer Phantom Wallet extensie om verbinding te maken.");
  }
};
document.getElementById('connect-wallet').addEventListener('click', connectWallet);

// Inzet verhogen
document.getElementById('increase-bet').addEventListener('click', () => {
  if (points >= currentBet + 10) {
    currentBet += 10;
    betDisplay.innerText = `Inzet: ${currentBet}`;
  } else {
    messageDisplay.innerText = "Niet genoeg punten voor deze inzet!";
  }
});

// Inzet verlagen
document.getElementById('decrease-bet').addEventListener('click', () => {
  if (currentBet > 10) {
    currentBet -= 10;
    betDisplay.innerText = `Inzet: ${currentBet}`;
  }
});

// SPIN
document.getElementById('spin-button').addEventListener('click', () => {
  if (!walletAddress) {
    messageDisplay.innerText = "Verbind eerst je wallet om te spinnen!";
    return;
  }

  if (demoSolBalance < spinCost) {
    messageDisplay.innerText = "Niet genoeg demo SOL! Verhoog je demo balance.";
    return;
  }

  demoSolBalance -= spinCost;
  updateCryptoBalance();
  messageDisplay.innerText = "Spinning...";
  spinSound.play();

  spinReels(() => {
    const symbols = Array.from(reels).map(r => r.innerText);
    const middleRow = [symbols[2], symbols[5], symbols[8], symbols[11], symbols[14]];

    if (middleRow.every(sym => sym === middleRow[0])) {
      let winnings = currentBet * 10;
      points += winnings;
      pointsDisplay.innerText = `Points: ${points}`;
      messageDisplay.innerText = `🎉 Winst! ${winnings} punten!`;
      winSound.play();
    } else {
      messageDisplay.innerText = "❌ Geen winst, probeer opnieuw!";
      loseSound.play();
    }
  });
});

// DEMO SOL
document.getElementById('bet-demo-sol').addEventListener('click', () => {
  if (!walletAddress) {
    messageDisplay.textContent = "Verbind eerst je wallet om te spelen!";
    return;
  }

  if (demoSolBalance < 0.01) {
    messageDisplay.textContent = "Niet genoeg demo SOL!";
    return;
  }

  demoSolBalance -= 0.01;
  updateCryptoBalance();
  spinSound.play();

  spinReels(() => {
    const winAmount = Math.random() < 0.3 ? 0.03 : 0;
    demoSolBalance += winAmount;
    updateCryptoBalance();
    if (winAmount > 0) {
      messageDisplay.textContent = `🎉 Je hebt ${winAmount.toFixed(2)} SOL gewonnen!`;
      winSound.play();
    } else {
      messageDisplay.textContent = `❌ Geen winst deze ronde. Probeer opnieuw!`;
      loseSound.play();
    }
  });
});

// Functie: Crypto balans bijwerken
function updateCryptoBalance() {
  cryptoBalance.textContent = `Demo Balance: ${demoSolBalance.toFixed(3)} SOL`;
}

// 🎰 Reel spin animatie + symbolen update
function spinReels(callback) {
  const symbols = ['🍒', '🍋', '🍊', '🍉', '💎', '⭐', '7️⃣'];
  reels.forEach((reel, index) => {
    reel.classList.add('spin-animation');
    setTimeout(() => {
      reel.classList.remove('spin-animation');
      reel.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      if (index === reels.length - 1 && typeof callback === 'function') {
        callback();
      }
    }, 300 + index * 100); // beetje vertraging tussen reels
  });
}
