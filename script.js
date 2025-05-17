document.getElementById('bet-demo-sol').addEventListener('click', () => {
  if (!walletAddress) {
    messageDisplay.textContent = "Verbind eerst je wallet om te spelen!";
    return;
  }

  if (demoSolBalance < 0.01) {
    messageDisplay.textContent = "Niet genoeg demo SOL! Verhoog je saldo.";
    return;
  }

  demoSolBalance -= 0.01;
  updateCryptoBalance();

  // Simuleer de spin
  spinReels();
  messageDisplay.textContent = "Je hebt 0.01 SOL ingezet!";
});
let walletAddress = null;
let demoSolBalance = 1.0; // 1 SOL als beginsaldo voor demo
let spinCost = 0.01;

const walletStatus = document.getElementById('wallet-status');
const cryptoBalance = document.getElementById('crypto-balance');

// Koppel Phantom Wallet
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

// Update demo balance
function updateCryptoBalance() {
  cryptoBalance.textContent = `Demo Balance: ${demoSolBalance.toFixed(3)} SOL`;
}
document.getElementById('bet-demo-sol').addEventListener('click', () => {
  if (!walletAddress) {
    messageDisplay.textContent = "Verbind eerst je wallet om te spelen!";
    return;
  }

  if (demoSolBalance < 0.01) {
    messageDisplay.textContent = "Niet genoeg demo SOL! Verhoog je saldo.";
    return;
  }

  demoSolBalance -= 0.01;
  updateCryptoBalance();

  // Simuleer de spin
  spinReels();
  messageDisplay.textContent = "Je hebt 0.01 SOL ingezet!";
});


let points = 10000;
let currentBet = 10;

const pointsDisplay = document.getElementById('points');
const betDisplay = document.getElementById('bet');
const messageDisplay = document.getElementById('message');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

document.getElementById('spin-button').addEventListener('click', () => {
  if (!walletAddress) {
    messageDisplay.textContent = "Verbind eerst je wallet om te spinnen!";
    return;
  }

  if (demoSolBalance < spinCost) {
    messageDisplay.textContent = "Niet genoeg SOL (demo)! Verhoog je demo balance.";
    return;
  }

  demoSolBalance -= spinCost;
  updateCryptoBalance();

  // ... jouw bestaande spin logica hieronder
});


// Verhoog de inzet
document.getElementById('increase-bet').addEventListener('click', () => {
    if (points >= currentBet + 10) {
        currentBet += 10;
        betDisplay.innerText = `Inzet: ${currentBet}`;
    } else {
        messageDisplay.innerText = "Niet genoeg punten voor deze inzet!";
    }
});

// Verlaag de inzet
document.getElementById('decrease-bet').addEventListener('click', () => {
    if (currentBet > 10) {
        currentBet -= 10;
        betDisplay.innerText = `Inzet: ${currentBet}`;
    }
});

// Spin-knop
document.getElementById('spin-button').addEventListener('click', () => {
    if (points < currentBet) {
        messageDisplay.innerText = "Je hebt niet genoeg punten om te spelen!";
        return;
    }

    // Verminder punten op basis van de inzet
    points -= currentBet;
    pointsDisplay.innerText = `Points: ${points}`;

    // Simuleer het draaien van de rollen
    messageDisplay.innerText = "Draaiende rollen...";

    const reelValues = ['🍒', '🍋', '🍊', '🍉', '💎', '⭐', '7️⃣'];

    function spinReel(reel) {
        const randomSymbol = reelValues[Math.floor(Math.random() * reelValues.length)];
        reel.innerText = randomSymbol;
    }

    spinReel(reel1);
    spinReel(reel2);
    spinReel(reel3);

    // Simuleer een resultaat en bepaal de uitbetaling
    setTimeout(() => {
        const result = [reel1.innerText, reel2.innerText, reel3.innerText];
        if (result[0] === result[1] && result[1] === result[2]) {
            let winnings = currentBet * 10; // 10x uitbetaling voor drie dezelfde symbolen
            points += winnings;
            pointsDisplay.innerText = `Points: ${points}`;
            messageDisplay.innerText = `Je hebt gewonnen! ${winnings} punten!`;
        } else {
            messageDisplay.innerText = "Helaas, probeer het opnieuw!";
        }
    }, 1000);
});
document.getElementById('bet-demo-sol').addEventListener('click', () => {
  if (!walletAddress) {
    messageDisplay.textContent = "Verbind eerst je wallet om te spelen!";
    return;
  }

  if (demoSolBalance < 0.01) {
    messageDisplay.textContent = "Niet genoeg demo SOL! Verhoog je saldo.";
    return;
  }

  demoSolBalance -= 0.01;
  updateCryptoBalance();

  // Simuleer de spin
  spinReels();
  messageDisplay.textContent = "Je hebt 0.01 SOL ingezet!";
});
