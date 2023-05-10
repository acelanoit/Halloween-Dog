export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = "Creepster";
        this.livesImage = lives;
    }
    draw(context) {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "white";
        context.shadowBlur = 0;
        context.font = this.fontSize + "px " + this.fontFamily;
        context.textAlign = "left";
        context.fillStyle = this.game.fontColor;

        // Score:
        context.fillText("Score: " + this.game.score + "/" + this.game.winningScore, 20, 50);

        // Timer:
        context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
        context.fillText("Time: " + (this.game.time * 0.001).toFixed(1), 20, 80);

        //Lives:
        for (let i = 0; i < this.game.lives; i++) {
            context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
        }

        // Start screen:
        if (!this.game.started && !this.game.gameOver) {
            context.textAlign = "center";
            context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
            context.fillText("Controls:", this.game.width * 0.5, this.game.height * 0.5 - 200);
            context.fillText("Press a and d to move", this.game.width * 0.5, this.game.height * 0.5 - 160);
            context.fillText("Press s to crouch", this.game.width * 0.5, this.game.height * 0.5 - 120);
            context.fillText("Press w to jump", this.game.width * 0.5, this.game.height * 0.5 - 80);
            context.fillText("Press s while in the air to perform a diving attack", this.game.width * 0.5, this.game.height * 0.5 - 40);
            context.fillText("Hold down Enter to perform a rolling attack", this.game.width * 0.5, this.game.height * 0.5);
            context.fillText("Press f to toggle full-screen", this.game.width * 0.5, this.game.height * 0.5 + 40);
            context.font = this.fontSize * 1.5 + "px " + this.fontFamily;
            context.fillText("Press Spacebar to start game", this.game.width * 0.5, this.game.height * 0.5 + 100);
            context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
            context.fillText("If you dare...", this.game.width * 0.5, this.game.height * 0.5 + 140);
        }

        // Game over messages:
        if (this.game.gameOver) {
            context.textAlign = "center";
            context.font = this.fontSize * 2 + "px " + this.fontFamily;
            if (this.game.score >= this.game.winningScore) {
                context.fillText("Boo-yah", this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
                context.fillText("What are creatures of the night afraid of? YOU!!!", this.game.width * 0.5, this.game.height * 0.5 + 20);
                context.fillText("Press Spacebar to play the next level...", this.game.width * 0.5, this.game.height * 0.5 + 60);
            } else {
                context.fillText("Love at first bite?", this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
                context.fillText("Nope. Better luck next time!", this.game.width * 0.5, this.game.height * 0.5 + 20);
                context.fillText("Press Spacebar to restart", this.game.width * 0.5, this.game.height * 0.5 + 60);
            }
        }
        context.restore();

        // Energy bar:
        context.fillStyle = "grey";
        context.fillRect(20, 130, this.game.maxEnergyBar, 10);
        context.fillStyle = this.game.energyBarColor;
        context.fillRect(20, 130, this.game.energyBar, 10);
    }
}