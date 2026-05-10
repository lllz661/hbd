let audioContext = null;
let analyser = null;
let microphone = null;
let isListening = false;
let candlesBlown = 0;
const totalCandles = 5;
const candleFlames = document.querySelectorAll('.flame');
const candleSmokes = document.querySelectorAll('.smoke');
const micButton = document.getElementById('micButton');
const instruction = document.getElementById('instruction');
const greetingsSection = document.getElementById('greetingsSection');
const body = document.body;

let currentCardIndex = 0;
const cards = document.querySelectorAll('.card');
const totalCards = cards.length;
const prevArrow = document.getElementById('prevArrow');
const nextArrow = document.getElementById('nextArrow');
const dotsContainer = document.getElementById('dotsContainer');

const backToTopBtn = document.createElement('button');
backToTopBtn.classList.add('back-to-top');
backToTopBtn.innerHTML = '🎂';
backToTopBtn.title = 'Вернуться к торту';
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

function createDots() {
  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToCard(i));
    dotsContainer.appendChild(dot);
  }
}

function updateCards() {
  cards.forEach((card, index) => {
    card.classList.remove('active', 'prev');
    if (index === currentCardIndex) {
      card.classList.add('active');
    } else if (index < currentCardIndex) {
      card.classList.add('prev');
    }
  });

  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentCardIndex);
  });

  prevArrow.disabled = currentCardIndex === 0;
  nextArrow.disabled = currentCardIndex === totalCards - 1;
}

function nextCard() {
  if (currentCardIndex < totalCards - 1) {
    currentCardIndex++;
    updateCards();
  }
}

function prevCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    updateCards();
  }
}

function goToCard(index) {
  currentCardIndex = index;
  updateCards();
}

document.addEventListener('keydown', (e) => {
  if (!greetingsSection.classList.contains('show')) return;
  if (e.key === 'ArrowRight') nextCard();
  if (e.key === 'ArrowLeft') prevCard();
});

let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
  if (!greetingsSection.classList.contains('show')) return;
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;
  if (diff > 50) nextCard();
  if (diff < -50) prevCard();
});

function blowOutAllCandles() {
  candleFlames.forEach((flame, index) => {
    if (!flame.classList.contains('out')) {
      flame.classList.add('out');
      const smoke = candleSmokes[index];
      smoke.classList.add('show');
      setTimeout(() => smoke.classList.remove('show'), 1500);
    }
  });
  
  candlesBlown = totalCandles;
  allCandlesBlownOut();
}

function allCandlesBlownOut() {
  stopMicrophone();
  
  body.classList.add('candles-out');
  
  instruction.innerHTML = ' Ура! Свечи задуты! ';
  instruction.style.animation = 'none';
  
  micButton.style.display = 'none';
  
  setTimeout(launchConfetti, 300);
  setTimeout(launchConfetti, 600);
  setTimeout(launchConfetti, 900);
  
  setTimeout(() => {
    greetingsSection.classList.add('show');
    setTimeout(() => {
      greetingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }, 1500);
}

function detectBlow() {
  if (!analyser) return;
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  const average = sum / dataArray.length;
  
  const threshold = 30;
  
  if (average > threshold && candlesBlown < totalCandles) {
    blowOutAllCandles();
  }
  
  if (isListening && candlesBlown < totalCandles) {
    requestAnimationFrame(detectBlow);
  }
}

async function startMicrophone() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    microphone.connect(analyser);
    
    isListening = true;
    micButton.textContent = ' Слушаю... Дуй сильнее!';
    micButton.classList.add('listening');
    instruction.textContent = ' Дуй в микрофон! (или хлопни в ладоши)';
    
    detectBlow();
    
  } catch (error) {
    console.error('Ошибка доступа к микрофону:', error);
    alert('Не удалось получить доступ к микрофону. Нажми "Задуть свечи" ещё раз и разреши доступ к микрофону.');
    instruction.textContent = '👆 Микрофон недоступен. Нажимай на свечи!';
    enableClickFallback();
  }
}

function stopMicrophone() {
  isListening = false;
  if (audioContext) {
    audioContext.close().catch(() => {});
    audioContext = null;
    analyser = null;
    microphone = null;
  }
  micButton.classList.remove('listening');
}

function toggleMicrophone() {
  if (candlesBlown >= totalCandles) return;
  
  if (isListening) {
    stopMicrophone();
    micButton.textContent = ' Задуть свечи!';
    instruction.textContent = ' Нажми кнопку и подуй в микрофон, чтобы задуть свечи!';
  } else {
    startMicrophone();
  }
}

function enableClickFallback() {
  candleFlames.forEach(flame => {
    flame.style.cursor = 'pointer';
    flame.addEventListener('click', blowOutAllCandles);
  });
  micButton.style.display = 'none';
}

function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.5 }
  });
  
  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.5 }
    });
  }, 200);
  
  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.5 }
    });
  }, 400);
}

createDots();
updateCards();

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.warn('Микрофон не поддерживается');
  instruction.textContent = '👆 Микрофон не поддерживается. Нажимай на свечи!';
  enableClickFallback();
}