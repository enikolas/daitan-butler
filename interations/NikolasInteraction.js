function NikolasInteraction(botController) {
    this.botController = botController;

    this.start();
}

NikolasInteraction.prototype.start = function start() {
    this.botController.hears('nikolas', ['direct_message', 'direct_mention'], (butler, message) => {
        butler.reply(message, 'Senhor Nikolas precisa fazer a barba, meu bom senhor.');
    });
};

module.exports = NikolasInteraction;
