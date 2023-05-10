export default class inputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];

        window.addEventListener("keydown", e => {

            // Start game:
            if (e.code === "Space" && !this.game.started) {
                this.game.started = true;
                this.game.restart();
            }

            // Restart game:
            if (e.code === "Space" && this.game.gameOver) this.game.restart();

            else if ((e.key === "s" ||
                e.key === "w" ||
                e.key === "a" ||
                e.key === "d" ||
                e.key === "Enter"
            ) && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }

            // Toggle full-screen:
            else if (e.key === "f") this.game.toggleFullScreen();

            // Toggle debug mode:
            else if (e.key === "t") this.game.debug = !this.game.debug;
        });
        window.addEventListener("keyup", e => {
            if (e.key === "s" ||
                e.key === "w" ||
                e.key === "a" ||
                e.key === "d" ||
                e.key === "Enter"
            ) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}