/* eslint-disable class-methods-use-this */

class AbstractInteraction {
    constructor(botController) {
        this.botController = botController;

        this.start();
    }

    getBotController() {
        return this.botController;
    }

    start() {
        throw new Error('start() method not implemented.');
    }
}

module.exports = AbstractInteraction;
