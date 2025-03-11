// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let leftOutCount = 0; // Contador de pelotas que salen por la izquierda

// Cargar la imagen de fondo
const backgroundImage = new Image();
backgroundImage.src = 'cofi.jpg';

// Cargar la imagen de la pelota
const ballImage = new Image();
ballImage.src = 'uno.jpeg'; // Asegúrate de que el archivo está en la misma carpeta

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size; // Tamaño de la pelota
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.drawImage(ballImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.size / 2 <= 0 || this.y + this.size / 2 >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        if (this.x - this.size / 2 <= 0) {
            leftOutCount++; // Aumenta el contador si la pelota sale por la izquierda
        }
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 1); // Velocidad aleatoria
        this.speedY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 1);
    }

    // Método para detectar colisión con la paleta
    checkCollision(paddle) {
        if (this.x - this.size / 2 < paddle.x + paddle.width &&
            this.x + this.size / 2 > paddle.x &&
            this.y + this.size / 2 > paddle.y &&
            this.y - this.size / 2 < paddle.y + paddle.height) {
            // Rebotar la pelota al tocar la paleta
            this.speedX = -this.speedX;
        }
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
    }

    draw(color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    // Movimiento de la paleta automática (IA)
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        this.balls = [];
        for (let i = 0; i < 30; i++) {
            let size = Math.random() * 20 + 10; // Tamaño aleatorio entre 10 y 30
            this.balls.push(new Ball(canvas.width / 2, canvas.height / 2, size, (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 1), (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 1)));
        }
        this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 100, true); // Controlado por el jugador
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100); // Controlado por la computadora
        this.keys = {}; // Para capturar las teclas
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Dibujar imagen de fondo
        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw('green');
        this.paddle2.draw('red');
        ctx.fillStyle = 'white';
        ctx.fillText(`Perdidas: ${leftOutCount}`, 20, 20);
    }

    update() {
        this.balls.forEach(ball => {
            ball.move();
            ball.checkCollision(this.paddle1);
            ball.checkCollision(this.paddle2);
            if (ball.x - ball.size / 2 <= 0 || ball.x + ball.size / 2 >= canvas.width) {
                ball.reset();
            }
        });

        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        this.paddle2.autoMove(this.balls[0]);
    }

    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();
