let walletAddress = null;
let demoSolBalance = 1.0; // demo balans
let spinCost = 0.01;
let points = 10000;
let currentBet = 10;

const walletStatus = document.getElementById('wallet-status');
const cryptoBalance = document.getElementById('crypto-balance');
const pointsDisplay = document.getElementById('points');
const betDisplay = document.getElementById('bet');
const messageDisplay = document.getElementById('message');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

// Wallet verbinden
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

// Spin-knop
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

  const reelValues = ['🍒', '🍋', '🍊', '🍉', '💎', '⭐', '7️⃣'];

  function spinReel(reel) {
    const randomSymbol = reelValues[Math.floor(Math.random() * reelValues.length)];
    reel.innerText = randomSymbol;
  }

  spinReel(reel1);
  spinReel(reel2);
  spinReel(reel3);

  // Simuleer resultaat
  setTimeout(() => {
    const result = [reel1.innerText, reel2.innerText, reel3.innerText];
    if (result[0] === result[1] && result[1] === result[2]) {
      let winnings = currentBet * 10;
      points += winnings;
      pointsDisplay.innerText = `Points: ${points}`;
      messageDisplay.innerText = `🎉 Je hebt gewonnen! ${winnings} punten!`;
    } else {
      messageDisplay.innerText = "Helaas, probeer opnieuw!";
    }
  }, 1000);
});

// Demo SOL inzet
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
  spinReels();

  let winst = Math.random() < 0.3 ? 0.03 : 0;
  demoSolBalance += winst;
  updateCryptoBalance();
  showResultMessage(winst);
});

// Functie: demo balans bijwerken
function updateCryptoBalance() {
  cryptoBalance.textContent = `Demo Balance: ${demoSolBalance.toFixed(3)} SOL`;
}

// Functie: animatie voor spin
function spinReels() {
  const reels = document.querySelectorAll('.reel');
  reels.forEach((reel) => {
    reel.classList.add('spin-animation');
    setTimeout(() => {
      reel.classList.remove('spin-animation');
    }, 500);
  });
}

// Functie: resultaat tonen
function showResultMessage(winAmount) {
  if (winAmount > 0) {
    messageDisplay.textContent = `🎉 Je hebt ${winAmount.toFixed(2)} SOL gewonnen!`;
  } else {
    messageDisplay.textContent = `❌ Geen winst deze ronde. Probeer opnieuw!`;
  }
}
