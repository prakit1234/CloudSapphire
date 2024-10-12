const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const maxParticles = 200; // Increased number of particles

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2; // Random size between 2 and 7
        this.speedX = Math.random() * 3 - 1.5; // Random speed in x direction
        this.speedY = Math.random() * 3 - 1.5; // Random speed in y direction
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off the edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Fade out particles
        if (this.size > 0.1) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = `rgba(0, 217, 255, ${this.size / 7})`; // Fade based on size
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let particle of particlesArray) {
        particle.update();
        particle.draw();
    }
    requestAnimationFrame(animateParticles);
}

// Start the animation
initParticles();
animateParticles();

