// ... (bestaande code blijft gelijk)

let bonusSpinsRemaining = 0;
let isBonusGame = false;

function startBonusGame() {
  bonusSpinsRemaining = 10;
  isBonusGame = true;
  showBonusPopup();
  updateBonusCounter();
}

function showBonusPopup() {
  const popup = document.createElement('div');
  popup.id = 'bonus-popup';
  popup.innerText = '🎰 BONUS GAME - 10 Gratis Spins!';
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
  }
}

function calculateWinnings(symbols, bet, elements) {
  let winnings = 0;
  let wildCount = 0;

  const isWinningLine = symbols.every((sym, _, arr) => sym === arr[0] || sym === '🃏');

  if (isWinningLine) {
    wildCount = symbols.filter(sym => sym === '🃏').length;

    // Voeg wild effect toe
    symbols.forEach((sym, i) => {
      if (sym === '🃏') animateWildSymbol(elements[i]);
    });

    let baseMultiplier = 10;
    let wildMultiplier = 1;
    if (wildCount === 1) wildMultiplier = 2;
    else if (wildCount === 2) wildMultiplier = 4;
    else if (wildCount === 3) wildMultiplier = 10;

    if (isBonusGame) wildMultiplier *= 2;

    winnings = bet * baseMultiplier * wildMultiplier;
  }

  return { winnings, wildCount };
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

const style = document.createElement('style');
style.innerHTML = `
  .wild-effect {
    animation: flameSpark 1.2s ease-out;
    position: relative;
    z-index: 2;
  }
  @keyframes flameSpark {
    0% { box-shadow: 0 0 5px red; transform: scale(1); }
    50% { box-shadow: 0 0 20px orange, 0 0 30px yellow; transform: scale(1.1); }
    100% { box-shadow: 0 0 5px red; transform: scale(1); }
  }
`;
document.head.appendChild(style);
