// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  spawnTrail(e.clientX, e.clientY);
});

function spawnTrail(x, y) {
  const trail = document.createElement('div');
  trail.classList.add('cursor-trail');
  trail.style.left = x + 'px';
  trail.style.top = y + 'px';
  document.body.appendChild(trail);

  setTimeout(() => {
    trail.style.transition = 'opacity 0.5s ease';
    trail.style.opacity = '0';
  }, 50);

  setTimeout(() => trail.remove(), 600);
}

// ── PAGE TRANSITION ──
const overlay = document.getElementById('overlay');

function navigateTo(url) {
  overlay.classList.add('fade-in');
  setTimeout(() => {
    window.location.href = url;
  }, 600);
}

// Fade in on page load
window.addEventListener('load', () => {
  overlay.style.opacity = '1';
  overlay.style.transition = 'none';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.8s ease';
      overlay.style.opacity = '0';
    });
  });
});

// Explore button click
const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
  exploreBtn.addEventListener('click', () => navigateTo('pages/work.html'));
}

// Nav link transitions
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(link.getAttribute('href'));
  });
});

// ── STAR PARTICLES ──
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let mouseX = -999;
let mouseY = -999;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const stars = [];
const STAR_COUNT = 120;
const REPEL_RADIUS = 80;
const REPEL_STRENGTH = 0.4;

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    baseX: 0,
    baseY: 0,
    vx: 0,
    vy: 0,
    radius: Math.random() * 1.2 + 0.2,
    opacity: Math.random() * 0.7 + 0.1,
    speed: Math.random() * 0.15 + 0.05,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleDir: Math.random() > 0.5 ? 1 : -1,
  });
}

stars.forEach(star => {
  star.baseX = star.x;
  star.baseY = star.y;
});

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    // Twinkle
    star.opacity += star.twinkleSpeed * star.twinkleDir;
    if (star.opacity >= 0.8 || star.opacity <= 0.05) star.twinkleDir *= -1;

    // Slow drift
    star.baseY += star.speed;
    if (star.baseY > canvas.height) {
      star.baseY = 0;
      star.baseX = Math.random() * canvas.width;
      star.x = star.baseX;
      star.y = star.baseY;
    }

    // Repel from cursor
    const dx = star.x - mouseX;
    const dy = star.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < REPEL_RADIUS) {
      const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
      star.vx += (dx / dist) * force * REPEL_STRENGTH;
      star.vy += (dy / dist) * force * REPEL_STRENGTH;
    }

    // Drift back to base position
    star.vx += (star.baseX - star.x) * 0.03;
    star.vy += (star.baseY - star.y) * 0.03;

    // Dampen velocity
    star.vx *= 0.85;
    star.vy *= 0.85;

    star.x += star.vx;
    star.y += star.vy;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

drawStars();