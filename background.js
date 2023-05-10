class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.x2 = this.width;
        this.y = 0;
    }
    update() {
        if (this.x < -this.width) this.x = this.width - this.game.speed * this.speedModifier + this.x2;
        else this.x -= this.game.speed * this.speedModifier;
        if (this.x2 < -this.width) this.x2 = this.width - this.game.speed * this.speedModifier + this.x;
        else this.x2 -= this.game.speed * this.speedModifier;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game) {
        this.game = game;
        this.width = 960;
        this.height = 540;
        this.layer1image = layer1;
        this.layer2image = layer2;
        this.layer3image = layer3;
        this.layer4image = layer4;
        this.layer5image = layer5;

        // Using different speed modifiers for each layer allows us to create a parallax effect:
        this.layer1 = new Layer(this.game, this.width, this.height, 0.2, this.layer1image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.4, this.layer2image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.6, this.layer3image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4image);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5image);

        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
    }
    update() {
        this.backgroundLayers.forEach(layer => layer.update());
    }
    draw(context) {
        this.backgroundLayers.forEach(layer => layer.draw(context));
    }
}