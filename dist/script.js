const CONFIG = {
  name: 'Alperen',
  birthYear: 2015,
  birthdayHasPassedThisYear: true,
  musicFile: 'assets/dogum-gunu-sarkisi.mp3'
};

const currentYear = new Date().getFullYear();
const age = currentYear - CONFIG.birthYear - (CONFIG.birthdayHasPassedThisYear ? 0 : 1);
document.querySelectorAll('[data-age]').forEach(el => el.textContent = age);
document.querySelectorAll('h1 span, #finaleTitle span').forEach(el => el.textContent = CONFIG.name.toUpperCase() + (el.closest('h1') ? '' : '!'));

const music = document.getElementById('birthdayMusic');
const villagerSound = document.getElementById('villagerSound');
const soundButton = document.getElementById('soundButton');
let musicReady = false;
let missionsComplete = false;
music.volume = .45;

async function toggleMusic(forcePlay = false) {
  try {
    if (music.paused || forcePlay) {
      await music.play();
      soundButton.classList.add('playing');
      soundButton.querySelector('.sound-label').textContent = 'Çalıyor';
      musicReady = true;
    } else {
      music.pause();
      soundButton.classList.remove('playing');
      soundButton.querySelector('.sound-label').textContent = 'Müzik';
    }
  } catch (_) {
    soundButton.querySelector('.sound-label').textContent = 'Dosya ekle';
  }
}

soundButton.addEventListener('click', () => toggleMusic());
document.getElementById('startButton').addEventListener('click', () => {
  document.getElementById('missions').scrollIntoView({behavior:'smooth'});
});

const cards = [...document.querySelectorAll('.mission-card')];
const unlockCard = index => {
  const card = cards[index];
  card.classList.remove('locked');
  card.classList.add('active');
  card.querySelector('.mission-state').textContent = 'AKTİF';
};
const completeCard = index => {
  const card = cards[index];
  card.classList.remove('active');
  card.classList.add('complete');
  card.querySelector('.mission-state').textContent = 'TAMAM';
};

let diamondCount = 0;
document.querySelectorAll('.hidden-diamond').forEach(diamond => diamond.addEventListener('click', () => {
  if (diamond.classList.contains('found')) return;
  diamond.classList.add('found');
  diamondCount++;
  document.getElementById('diamondCount').textContent = diamondCount;
  document.getElementById('diamondProgress').style.width = `${diamondCount * 20}%`;
  if (diamondCount === 5) { completeCard(0); unlockCard(1); setTimeout(() => cards[1].scrollIntoView({behavior:'smooth',block:'center'}), 500); }
}));

let powerCount = 0;
document.querySelectorAll('.power-options button').forEach(option => option.addEventListener('click', () => {
  option.classList.toggle('selected');
  powerCount = document.querySelectorAll('.power-options .selected').length;
  if (powerCount > 3) { option.classList.remove('selected'); powerCount--; return; }
  document.getElementById('powerCount').textContent = powerCount;
  document.getElementById('powerProgress').style.width = `${powerCount / 3 * 100}%`;
  if (powerCount === 3) { completeCard(1); unlockCard(2); setTimeout(() => cards[2].scrollIntoView({behavior:'smooth',block:'center'}), 500); }
}));

document.querySelectorAll('.phrase').forEach(button => button.addEventListener('click', () => {
  const feedback = document.getElementById('phraseFeedback');
  if (button.dataset.correct === 'true') {
    feedback.textContent = 'Kapı açıldı! ✦';
    completeCard(2);
    missionsComplete = true;
    document.getElementById('treasure').classList.add('unlocked');
    document.getElementById('cakeSection').classList.add('unlocked');
    setTimeout(() => document.getElementById('treasure').scrollIntoView({behavior:'smooth'}), 500);
  } else {
    if (button.dataset.sound === 'villager') {
      villagerSound.currentTime = 0;
      villagerSound.play().catch(() => {});
    }
    feedback.textContent = 'Hmm… başka bir söz dene!';
    button.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'none'}],{duration:250});
  }
}));

const candleHolder = document.getElementById('candles');
const candlesLeft = document.getElementById('candlesLeft');
let remaining = age;

function buildCandles() {
  candleHolder.innerHTML = '';
  remaining = age;
  candlesLeft.textContent = remaining;
  for (let i=0; i<age; i++) {
    const candle = document.createElement('button');
    candle.className = 'candle';
    candle.style.animationDelay = `${i * 45}ms`;
    candle.setAttribute('aria-label', `${i+1}. mumu söndür`);
    candle.innerHTML = '<span class="flame"></span>';
    candle.addEventListener('click', () => extinguish(candle), {once:true});
    candleHolder.appendChild(candle);
  }
}

function extinguish(candle) {
  candle.classList.add('out');
  remaining--;
  candlesLeft.textContent = remaining;
  if ('vibrate' in navigator) navigator.vibrate(25);
  if (remaining === 0) setTimeout(showFinale, 650);
}

function showFinale() {
  const finale = document.getElementById('finale');
  finale.classList.add('show');
  finale.setAttribute('aria-hidden','false');
  const colors = ['#42e5e2','#ffd75d','#ff6687','#8de36c','#fff'];
  const box = document.getElementById('confetti');
  box.innerHTML = '';
  for (let i=0; i<70; i++) {
    const bit = document.createElement('span');
    bit.style.left = Math.random()*100+'%';
    bit.style.background = colors[i%colors.length];
    bit.style.animationDelay = Math.random()*2+'s';
    bit.style.animationDuration = 2.2+Math.random()*2+'s';
    box.appendChild(bit);
  }
}

document.getElementById('replayButton').addEventListener('click', () => {
  document.getElementById('finale').classList.remove('show');
  document.getElementById('finale').setAttribute('aria-hidden','true');
  buildCandles();
});

buildCandles();
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

let cakeMusicTriggered = false;
const cakeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting || cakeMusicTriggered || !missionsComplete) return;
  cakeMusicTriggered = true;
  toggleMusic(true);
}), {threshold:.3});
cakeObserver.observe(document.getElementById('cakeSection'));
