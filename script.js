let points = 10000;
let currentBet = 10;

const pointsDisplay = document.getElementById('points');
const betDisplay = document.getElementById('bet');
const messageDisplay = document.getElementById('message');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

document.getElementById('increase-bet').addEventListener('click', () => {
    if (points >= currentBet + 10) {
        currentBet += 10;
        betDisplay.innerText = `Inzet: ${currentBet}`;
    } else {
        messageDisplay.innerText = "Niet genoeg punten voor deze inzet!";
    }
});

document.getElementById('decrease-bet').addEventListener('click', () => {
    if (currentBet > 10) {
        currentBet -= 10;
        betDisplay.innerText = `Inzet: ${currentBet}`;
    }
});

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
