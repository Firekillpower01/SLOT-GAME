let walletConnected = false;

document.getElementById('connect-wallet').addEventListener('click', () => {
  walletConnected = true;
  document.getElementById('wallet-status').innerText = 'Wallet Verbonden ✅';
});

function generateRandomSymbols() {
  const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '🃏']; // '🃏' is wild
  const result = [];
  for (let row = 0; row < 3; row++) {
    const reelRow = [];
    for (let col = 0; col < 3; col++) {
      const randIndex = Math.floor(Math.random() * symbols.length);
      reelRow.push(symbols[randIndex]);
    }
    result.push(reelRow);
  }
  return result;
}
// ... (bestaande code blijft gelijk)

let bonusSpinsRemaining = 0;
let isBonusGame = false;
let jackpotTriggered = false;

function startBonusGame() {
  bonusSpinsRemaining = 10;
  isBonusGame = true;
  jackpotTriggered = false;
  showBonusPopup();
  updateBonusCounter();
  setReelsToBonusMode();
}

function showBonusPopup(extra = false) {
  const popup = document.createElement('div');
  popup.id = 'bonus-popup';
  popup.innerText = extra ? '🎉 10 EXTRA BONUS SPINS!' : '🎰 BONUS GAME - 10 Gratis Spins!';
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.right = '20px';
  popup.style.backgroundColor = '#ff0';
  popup.style.padding = '12px';
  popup.style.fontSize = '20px';
  popup.style.fontWeight = 'bold';
  popup.style.borderRadius = '8px';
  popup.style.zIndex = '1000';
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 4000);
}

function updateBonusCounter() {
  let counter = document.getElementById('bonus-counter');
  if (!counter) {
    counter = document.createElement('div');
    counter.id = 'bonus-counter';
    counter.style.position = 'fixed';
    counter.style.top = '60px';
    counter.style.right = '20px';
    counter.style.backgroundColor = '#fff';
    counter.style.padding = '8px';
    counter.style.border = '2px solid #000';
    counter.style.zIndex = '1000';
    document.body.appendChild(counter);
  }
  counter.innerText = `Bonus Spins Over: ${bonusSpinsRemaining}`;
  if (bonusSpinsRemaining <= 0) {
    counter.remove();
    isBonusGame = false;
    resetReelsToNormal();
  }
}

function calculateWinnings(symbols, bet, elements) {
  let winnings = 0;
  let wildCount = 0;
  const isWinningLine = symbols.every((sym, _, arr) => sym === arr[0] || sym === '🃏');
  if (isWinningLine) {
    wildCount = symbols.filter(sym => sym === '🃏').length;

    symbols.forEach((sym, i) => {
      if (sym === '🃏') animateWildSymbol(elements[i]);
      if (sym === '🃏') elements[i].innerText = '🔥WILD🔥';
    });

    let baseMultiplier = 10;
    let wildMultiplier = 1;
    if (wildCount === 1) wildMultiplier = 2;
    else if (wildCount === 2) wildMultiplier = 4;
    else if (wildCount === 3) {
      wildMultiplier = 10;
      if (isBonusGame) {
        bonusSpinsRemaining += 10;
        updateBonusCounter();
        showBonusPopup(true);
      }
      if (!jackpotTriggered) jackpotCheck();
    }

    if (isBonusGame) wildMultiplier *= 2;
    winnings = bet * baseMultiplier * wildMultiplier;
    if (winnings >= bet * 10) showBigWinPopup(winnings);
  }
  return { winnings, wildCount };
}

function jackpotCheck() {
  // logica voor dubbele 3 wilds triggeren (placeholder)
  // bij echte implementatie tel je wild-lines per bonus game
  jackpotTriggered = true;
  const popup = document.createElement('div');
  popup.className = 'big-win-popup';
  popup.innerText = '🎉 JACKPOT! x500 GEWONNEN!';
  popup.style.background = 'red';
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 5000);
}

function checkForBonus(symbols) {
  if (symbols.filter(sym => sym === '🃏').length >= 3 && !isBonusGame) {
    startBonusGame();
  }
}

function animateWildSymbol(element) {
  element.classList.add('wild-effect');
  setTimeout(() => element.classList.remove('wild-effect'), 1200);
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

  let hue = 0;
  const animateLines = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'gold';

    lines.forEach(coords => {
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.beginPath();
      coords.forEach((pt, index) => {
        if (index === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    });

    hue = (hue + 3) % 360;
  };

  const interval = setInterval(animateLines, 60);
  setTimeout(() => {
    clearInterval(interval);
    canvas.remove();
  }, 1500);
}

function showBigWinPopup(amount) {
  const popup = document.createElement('div');
  popup.className = 'big-win-popup';
  popup.innerText = `💰 MEGA WIN: ${amount} punten!`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 4000);
}

function setReelsToBonusMode() {
  document.querySelectorAll('.reel').forEach(reel => {
    reel.classList.add('bonus-mode');
  });
}

function resetReelsToNormal() {
  document.querySelectorAll('.reel').forEach(reel => {
    reel.classList.remove('bonus-mode');
  });
}

const style = document.createElement('style');
style.innerHTML = `
  .wild-effect {
    animation: flameSpark 1.2s ease-out infinite alternate;
    position: relative;
    color: red;
    font-weight: bold;
  }
  @keyframes flameSpark {
    0% { text-shadow: 0 0 5px red; transform: scale(1); }
    50% { text-shadow: 0 0 20px orange, 0 0 30px yellow; transform: scale(1.2); }
    100% { text-shadow: 0 0 5px red; transform: scale(1); }
  }
  .big-win-popup {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: gold;
    padding: 20px 40px;
    font-size: 28px;
    font-weight: bold;
    border: 4px solid #000;
    border-radius: 12px;
    z-index: 1001;
    animation: popupScale 0.6s ease-out;
  }
  @keyframes popupScale {
    0% { transform: scale(0.5) translate(-50%, -50%); }
    100% { transform: scale(1) translate(-50%, -50%); }
  }
  .reel.bonus-mode {
    border: 2px solid #f0f;
    background: rgba(255, 255, 0, 0.1);
  }
`;
document.head.appendChild(style);
