import { Dust, Fire, Splash } from "./particles.js";

// This enum object is here to give me more readable values to the numbers that represent states:
const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6
}

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

// In each state we can limit what keys player will react to and we can write logic that defines behaviour for each key press separately:

export class Sitting extends State {
    constructor(game) {
        super("SITTING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 5;
    }
    handleInput(input) {
        if ((input.includes("a") || input.includes("d")) && !input.includes("s")) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes("Enter") && this.game.energyBar > 0 && !this.game.energyBarRecharging) {
            this.game.player.setState(states.ROLLING, 2);
        } else if (!input.includes("s") && input.includes("w")) {
            this.game.player.setState(states.JUMPING, 2);
        }
    }
}

export class Running extends State {
    constructor(game) {
        super("RUNNING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3;
    }
    handleInput(input) {

        // The unshift() method adds new elements to the beginning of an array. The unshift() method overwrites the original array. We use the unshift() method instead of the push() method so that in main.js we keep the new particles and remove the old ones (if their index exceeds the value of maxParticles):
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.85));
        if (input.includes("s")) {
            this.game.player.setState(states.SITTING, 0);
        } else if (input.includes("w")) {
            this.game.player.setState(states.JUMPING, 1);
        } else if (input.includes("Enter") && this.game.energyBar > 0 && !this.game.energyBarRecharging) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Jumping extends State {
    constructor(game) {
        super("JUMPING", game);
    }
    enter() {
        if (this.game.player.onGround()) this.game.player.vy -= 27;
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;
    }
    handleInput(input) {

        // When we enter the Jumping state, this.player.vy is set to -30, and we start adding player.weight to it inside player.update(), so it goes all the way to 0 and into positive numbers. At the point vy reaches 0, we're at the peak of jump, and as it goes into positive numbers, player is falling back down, so that's when we set state to Falling:
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes("Enter") && this.game.energyBar > 0 && !this.game.energyBarRecharging) {
            this.game.player.setState(states.ROLLING, 2);
        } else if (input.includes("s")) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super("FALLING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
    }
    handleInput(input) {
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes("s")) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Rolling extends State {
    constructor(game) {
        super("ROLLING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 5;
        this.game.player.frameY = 6;
    }
    handleInput(input) {

        // The unshift() method adds new elements to the beginning of an array. The unshift() method overwrites the original array. We use the unshift() method instead of the push() method so that in main.js we keep the new particles and remove the old ones (if their index exceeds the value of maxParticles):
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if ((!input.includes("Enter") || this.game.energyBar <= 0) && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if ((!input.includes("Enter") || this.game.energyBar <= 0) && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes("Enter") && input.includes("w") && this.game.player.onGround()) {
            this.game.player.vy -= 27;
        }
        else if (input.includes("s") && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Diving extends State {
    constructor(game) {
        super("DIVING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 5;
        this.game.player.frameY = 6;
        this.game.player.vy = 15;
    }
    handleInput() {

        // The unshift() method adds new elements to the beginning of an array. The unshift() method overwrites the original array. We use the unshift() method instead of the push() method so that in main.js we keep the new particles and remove the old ones (if their index exceeds the value of maxParticles):
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            for (let i = 0; i < 30; i++) {
                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));
            }
        }
    }
}

export class Hit extends State {
    constructor(game) {
        super("HIT", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
    }
    handleInput() {

        // Switch to running or falling animation (depending on player's position) after hit animation is finished:
        if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        }
    }
}