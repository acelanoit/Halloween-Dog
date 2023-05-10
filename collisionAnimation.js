export class CollisionAnimation {
    constructor(game, x, y) {
        this.game = game;
        this.image = collisionAnimation;
        this.spriteWidth = 100;
        this.spriteHeight = 90;
        this.sizeModifier = Math.random() + 0.5;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.frameX = 0;
        this.maxFrame = 4;
        this.markedForDeletion = false;

        // The spritesheets we are using were designed for lower frame rate, so we want to slow down the sprite animation. this.fps will affect horizontal navigation within player spritesheet, how fast we swap between individual animation frames. Nothing else will be affected, the rest of the game will run at 60 fps on most computers, where deltaTime will be around 16.7 ms (1000 ms/60 fps):
        this.fps = Math.random() * 10 + 5;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    update(deltaTime) {
        this.x -= this.game.speed;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            }
            else this.markedForDeletion = true;
        } else this.frameTimer += deltaTime;
        if (this.frameX > this.maxFrame) this.markedForDeletion = true;

    }
}