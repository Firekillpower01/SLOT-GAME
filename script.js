// Variables
let points = 10000;
let currentBet = 100;
let symbols = ['🍒', '🍋', '🍊', '🍉', '7️⃣', '🍀'];
let reel1, reel2, reel3;
let isSpinning = false;

// Initialize Reels and Controls
window.onload = function () {
    reel1 = document.getElementById('reel1');
    reel2 = document.getElementById('reel2');
    reel3 = document.getElementById('reel3');
    
    updateDisplay();

    document.getElementById('spin-button').addEventListener('click', spin);
    document.getElementById('increase-bet').addEventListener('click', increaseBet);
    document.getElementById('decrease-bet').addEventListener('click', decreaseBet);
};

// Update Points Display
function updateDisplay() {
    document.getElementById('points').innerText = `Points: ${points}`;
    document.getElementById('message').innerText = `Bet: ${currentBet} Points`;
}

// Spin the Reels
function spin() {
    if (isSpinning || points < currentBet) {
        return;
    }

    // Deduct the bet
    points -= currentBet;
    updateDisplay();

    // Start spinning
    isSpinning = true;
    document.getElementById('spin-button').disabled = true;
    
    let spin1 = Math.floor(Math.random() * symbols.length);
    let spin2 = Math.floor(Math.random() * symbols.length);
    let spin3 = Math.floor(Math.random() * symbols.length);

    reel1.innerText = symbols[spin1];
    reel2.innerText = symbols[spin2];
    reel3.innerText = symbols[spin3];

    // Simulate reel spinning with delay
    setTimeout(() => {
        checkWin(spin1, spin2, spin3);
        isSpinning = false;
        document.getElementById('spin-button').disabled = false;
    }, 1000);
}

// Check Win Condition
function checkWin(symbol1, symbol2, symbol3) {
    if (symbol1 === symbol2 && symbol2 === symbol3) {
        points += currentBet * 10; // Payout multiplier for matching symbols
        document.getElementById('message').innerText = `You Win! Payout: ${currentBet * 10} Points!`;
    } else {
        document.getElementById('message').innerText = "Try Again!";
    }

    updateDisplay();
}

// Increase Bet Amount
function increaseBet() {
    if (points >= currentBet + 100) {
        currentBet += 100;
        updateDisplay();
    }
}

// Decrease Bet Amount
function decreaseBet() {
    if (currentBet > 100) {
        currentBet -= 100;
        updateDisplay();
    }
}
