class Enemy {
    constructor() {
        this.frameX = 0;
        this.frameY = 0;

        // The spritesheets we are using were designed for lower frame rate, so we want to slow down the sprite animation. this.fps will affect horizontal navigation within player spritesheet, how fast we swap between individual animation frames. Nothing else will be affected, the rest of the game will run at 60 fps on most computers, where deltaTime will be around 16.7 ms (1000 ms/60 fps):
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }
    update(deltaTime) {
        // Movement:
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;

        // Animation:
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else this.frameTimer += deltaTime;

        // Mark for deletion if off screen:
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

export class EnemyFly extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.zIndex = 0;
        this.width = 60;
        this.height = 44;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = enemy_fly;
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }
    update(deltaTime) {
        super.update(deltaTime);
        this.angle += this.va;

        // Math.sin() is a function related to math and trigonometry and it returns numbers between -1 and 1.
        this.y += Math.sin(this.angle);
    }
}

export class EnemyBat extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.zIndex = -1;
        this.width = 87.8;
        this.height = 62;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = enemy_bat;
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }
    update(deltaTime) {
        super.update(deltaTime);
        this.angle += this.va;

        // Math.sin() is a function related to math and trigonometry and it returns numbers between -1 and 1.
        this.y += Math.sin(this.angle);
    }
}

export class EnemyPlant extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.zIndex = -3;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
        this.image = enemy_plant;
    }
}

export class EnemyGroundZombie extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.zIndex = -4;
        this.width = 120;
        this.height = 90;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 7;
        this.image = enemy_ground_zombie;
    }
}

export class EnemySpider extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.zIndex = -2;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
        this.image = enemy_spider_big;
    }
    update(deltaTime) {
        super.update(deltaTime);

        // Make spiders move up and down:
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;

        // Mark for deletion if off screen:
        if (this.y < -this.height) this.markedForDeletion = true;
    }
    draw(context) {
        super.draw(context);

        // Draw the web:
        context.beginPath();
        context.moveTo(this.x + this.width / 2, 0);
        context.lineTo(this.x + this.width / 2, this.y + 50);
        context.stroke();
    }
}