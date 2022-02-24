
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const score = document.getElementById('score');
const game_start_btn = document.getElementById('start_game');
const game_menu = document.getElementById('game_menu')
const end_score = document.getElementById('end_score')
const lifespan_html = document.getElementById('lifespan')
const attack_html = document.getElementById('attack')
const attack_area_html = document.getElementById('hello')
const attack_speed_html = document.getElementById('attack_speed')
class Player {
    constructor(x, y, radius, color, lifespan, attack, attack_area, attack_speed ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.lifespan = lifespan;
        this.attack = attack;
        this.attack_area = attack_area;
        this.attack_speed = attack_speed;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (keyD == true) {
          this.x += 1;
        }
        if (keyS == true) {
          this.y += 1;
        }
        if (keyA == true) {
          this.x--;
        }
        if (keyW == true) {
          this.y--;
        }
        if (this.x <= 0) {
            this.x = 0;
        }
        if (this.x >= canvas.width) {
            this.x = canvas.width;
        }
        if (this.y <= 0) {
            this.y = 0;
        }
        if (this.y >= canvas.height) {
            this.y = canvas.height;
        }
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color
        this.velocity = velocity;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color
        this.velocity = velocity;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}


const friction = 0.98;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

const x_center = canvas.width / 2;
const y_center = canvas.height / 2;
let player = new Player(x_center, y_center, 30, 'white', 100, 30, 250, 0.7);
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
    player = new Player(x_center, y_center, 30, "white", 100, 30, 250, 0.7);
    projectiles = [];
    enemies = [];
    particles = [];
    numer_score = 0;
    end_score.innerHTML = numer_score;
    score.innerHTML = numer_score;
    lifespan_html.innerHTML = player.lifespan;
    attack_html.innerHTML = player.attack;
    attack_area_html.innerHTML = player.attack_area;
    attack_speed_html.innerHTML = player.attack_speed;
}

let interval = setInterval(() => {
    const radius = 25 * Math.random() + 5;
    let x;
    let y;
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0  - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
    }
    else {
        y = Math.random() < 0.5 ? 0  - radius : canvas.height + radius;
        x = Math.random() * canvas.width;
    }
    // const x = Math.random() < 0.5 ? 0  - radius : canvas.width + radius;
    // const y = Math.random() < 0.5 ? 0  - radius : canvas.height + radius;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const angle = Math.atan2(player.y - y, player.x - x);
    const velocity = {
        x : Math.cos(angle) * 2,
        y : Math.sin(angle) * 2
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
}, 1000);
function getEnemies() {
    interval;
}

let animationId;
let numer_score = 0;
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw();
    particles.forEach((Particle, index) =>{
        if (Particle.alpha <= 0) {
            particles.splice(index, 1);
        }
        else {
            Particle.update();
        }
    });
    projectiles.forEach((Projectile, index) => {
        Projectile.update();
        let attack_dist = Math.hypot(player.x - Projectile.x, player.y - Projectile.y);
        // remove projectiles outside of the range
        if (attack_dist > player.attack_area ) {
            setTimeout(() => {
                projectiles.splice(index, 1);
                }, 0);

        }
    })
    enemies.forEach((Enemy, index) => {
        Enemy.update();
        const dist = Math.hypot(player.x - Enemy.x, player.y - Enemy.y);
        if (dist - Enemy.radius - player.radius < 0) {
            if (player.lifespan <= 10) {
                cancelAnimationFrame(animationId);
                end_score.innerHTML = numer_score;
                game_menu.style.display = 'flex';
                lifespan_html.innerHTML = 0;
            }
            else {
                setTimeout(() => {
                    enemies.splice(index, 1);
                    }, 0);
                player.lifespan = player.lifespan - 10 - player.lifespan * 0.09;
                lifespan_html.innerHTML = parseFloat(player.lifespan).toFixed(0);
            }
        }

        projectiles.forEach((Projectile, p_index) => {
            const dist = Math.hypot(Projectile.x - Enemy.x, Projectile.y - Enemy.y);
            if (dist - Enemy.radius - Projectile.radius < 1) {
                numer_score += 1;
                score.innerHTML = numer_score;
                for (let i = 0; i < Enemy.radius * 2; i++) {
                    particles.push(new Particle(Projectile.x, Projectile.y, Math.random() * 2, Enemy.color, {
                        x : (Math.random() - 0.5) * (Math.random() * 6),
                        y : (Math.random() - 0.5) * (Math.random() * 6)
                    })
                    )
                }

                if (Enemy.radius - 10 > 5) {
                    gsap.to(Enemy, {
                        radius: Enemy.radius - 10
                    })
                    Enemy.radius -= player.attack / 10;
                    setTimeout(() => {
                        projectiles.splice(p_index, 1);
                        }, 0);
                }
                else {
                    let randomized_add = Math.random() * 4;
                    if (randomized_add > 0 && randomized_add < 1) {
                        player.lifespan += 50;
                        lifespan_html.innerHTML = parseFloat(player.lifespan).toFixed(0);
                    }
                    else if (randomized_add > 1 && randomized_add < 2) {
                        player.attack += 5;
                        attack_html.innerHTML = player.attack;
                    }
                    else if (randomized_add > 2 && randomized_add < 3) {
                        player.attack_area += 50;
                        attack_area_html.innerHTML = player.attack_area;
                    }
                    else {
                        player.attack_speed += 0.2;
                        attack_speed_html.innerHTML = parseFloat(player.attack_speed).toFixed(2);
                    }
                    setTimeout(() => {
                    enemies.splice(index, 1);
                    projectiles.splice(p_index, 1);
                    }, 0);
                }
            }
        })
    })
    

}
  
window.addEventListener('click', (event)=>{
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    const velocity = {
        x : Math.cos(angle) * 2 * player.attack_speed,
        y : Math.sin(angle) * 2 * player.attack_speed
    }
    projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity))
});

// move system
//neccessary variables
let keyW = false;
let keyA = false;
let keyS = false;
let keyD = false;
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d
      keyD = true;
      break;
    case 83: //s
      keyS = true;
      break;
    case 65: //a
      keyA = true;
      break;
    case 87: //w
      keyW = true;
      break;
  }
}

function onKeyUp(event) {
  var keyCode = event.keyCode;

  switch (keyCode) {
    case 68: //d
      keyD = false;
      break;
    case 83: //s
      keyS = false;
      break;
    case 65: //a
      keyA = false;
      break;
    case 87: //w
      keyW = false;
      break;
  }
}

game_start_btn.addEventListener('click', ()=> {
    init();
    animate();
    getEnemies();
    game_menu.style.display = 'none';
});
