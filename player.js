import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessages } from "./floatingMessages.js";

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById("player");
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 8;

        // The spritesheets we are using were designed for lower frame rate, so we want to slow down the sprite animation. this.fps will affect horizontal navigation within player spritesheet, how fast we swap between individual animation frames. Nothing else will be affected, the rest of the game will run at 60 fps on most computers, where deltaTime will be around 16.7 ms (1000 ms/60 fps):
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;

        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
    }
    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);

        // Horizontal movement:
        this.x += this.speed;
        if (!input.includes("s") && !input.includes("a") && this.currentState !== this.states[6] && input.includes("d")) this.speed = this.maxSpeed;
        else if (!input.includes("s") && !input.includes("d") && this.currentState !== this.states[6] && input.includes("a")) this.speed = -this.maxSpeed;
        else this.speed = 0;

        // Prevent player from moving off-screen (horizontally):
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // Vertical movement:
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        // Prevent player from moving off-screen (vertically):
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;

        // Sprite animation:
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else this.frameTimer += deltaTime;
    }
    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    // This utility method will return true if player is on the ground:
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {

                // Collision detected: remove enemy, add collision animation to array, increase score if player is invulnerable, otherwise play hit animation and reduce lives (only if player is not already on Hit state):
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessages("+1", enemy.x, enemy.y, 150, 50));
                } else if (this.currentState !== this.states[6]) {
                    this.setState(6, 0);
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }
            }
        });
    }
    restart() {
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.frameTimer = 0;
        this.speed = 0;
    }
}