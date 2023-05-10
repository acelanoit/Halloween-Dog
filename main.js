// This line tells VS Code this is a canvas project and it will suggest built-in html canvas methods:
/** @type {HTMLCanvasElement} */

import Player from "./player.js";
import inputHandler from "./input.js";
import { Background } from "./background.js";
import { EnemyFly, EnemyBat, EnemyGroundZombie, EnemyPlant, EnemySpider } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load", function () {
    const loading = document.getElementById("loading");
    loading.style.display = "none";
    const canvas = document.getElementById("canvas1");
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    let reloadedOnce = false;
    function reloadOnce() {
        location.reload();
        reloadedOnce = true;
    }
    if (reloadedOnce = false) reloadOnce();

    // By default, canvas will be set to 300 x 150 px so we change the width and height here with the same values set in our style.css file:
    canvas.width = 960;
    canvas.height = 540;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 20;
            this.started = false;
            this.fullScreen = false;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new inputHandler(this);
            this.UI = new UI(this);
            this.score = 0;
            this.level = 1;
            this.maxEnergyBar = 100;
            this.maxParticles = 50;
            this.enemyInterval = 1000;
            this.debug = false;
            this.fontColor = "black";
            this.restart();
        }
        restart() {
            this.score >= this.winningScore ? this.level++ : this.level = 1;
            this.score = 0;
            this.winningScore = 15 + this.level * 5;
            this.speed = 0;
            this.maxSpeed = 2 + this.level * 2;
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.enemyTimer = 0;
            this.time = 15000 + this.level * 5000;
            this.gameOver = false;
            this.lives = 5;
            this.energyBar = 100;
            this.energyBarRecharging = false;
            this.energyBarColor = "#F94A29";
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.player.restart();
            if (this.started) {
                lastTime = null;
                animate(0);
            };
        }
        toggleFullScreen() {
            if (!document.fullscreenElement) {
                canvas.requestFullscreen()
                    .then(canvas.style.cursor = "none")
                    .catch(err => {
                        alert("Error, can't enable full-screen mode: " + err.message);
                    });
            } else {
                document.exitFullscreen();
                canvas.style.cursor = "auto";
            }
        }
        update(deltaTime) {
            this.time -= deltaTime;
            if (this.time < 0) this.time = 0;
            if (this.time <= 0 || this.score === this.winningScore) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // Handle enemies:
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);


                // if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });

            // We use the filter() method instead of the splice() method here because the former introduces a bug: when we splice out and remove enemy from the array while we are in the middle of cycling through that array, the index of all the following elements (enemy objects in our case) changes: because of that, their position is not calculated correctly for that loop and they jump around. Using filter() we only remove enemies that have markedForDeletion property set to true after we finish cycling through the entire array, so there are no problems with indexes and skipping positions. We do the same for particles, floating messages, and collision animation objects:
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            // Handle messages:
            this.floatingMessages.forEach(message => {
                message.update();
            });
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);

            // Handle particles:
            this.particles.forEach((particle) => {
                particle.update();
            });
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);

            // Limit max amount of particles:
            if (this.particles.length > this.maxParticles) {
                this.particles = this.particles.slice(0, this.maxParticles);

                // // Or simply:
                // this.particles.length = this.maxParticles;
            }

            // Handle collision sprites:
            this.collisions.forEach((collision) => {
                collision.update(deltaTime);
            });
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);

            // Handle energy bar:
            this.player.currentState === this.player.states[4] ? this.energyBar-- : this.energyBar++;
            if (this.energyBar <= 0) {
                this.energyBar = 0;
                this.energyBarRecharging = true;
                this.energyBarColor = "#E8D2A6";
            }
            else if (this.energyBar >= this.maxEnergyBar) {
                this.energyBar = this.maxEnergyBar;
                this.energyBarRecharging = false;
                this.energyBarColor = "#F94A29";
            }

        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy() {
            if (this.speed > 0) {
                switch (Math.floor(Math.random() * 3) + 1) {
                    case 1:
                        this.enemies.push(new EnemyPlant(this));
                        break;
                    case 2:
                        this.enemies.push(new EnemySpider(this));
                        break;
                    case 3:
                        this.enemies.push(new EnemyGroundZombie(this));
                    //     break;
                    // case 4:
                    //     this.enemies.push;
                    //     break;
                    // case 5:
                    //     this.enemies.push;
                    //     break;
                    // case 5:
                    //     this.enemies.push;
                }
            }
            Math.random() < 0.5 ? this.enemies.push(new EnemyFly(this)) : this.enemies.push(new EnemyBat(this));

            // Sort enemies inside the array in ascending order based on their Zindex property. This allows to specify the stack order of the different enemy types, as those with a higher zIndex value will be drawn after (and therefore on top of) those with a lower zIndex value:
            this.enemies.sort(function (a, b) {
                return a.zIndex - b.zIndex;
            });
        }
    }

    const game = new Game(canvas.width, canvas.height);
    game.draw(ctx);
    let lastTime = 0;

    function animate(timeStamp) {
        if (!lastTime) {
            lastTime = timeStamp; // set lastTime to current timestamp
            requestAnimationFrame(animate);
            return;
        }
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }
});