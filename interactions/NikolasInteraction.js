const AbstractInteraction = require('../helpers/AbstractInteraction');

class NikolasInteraction extends AbstractInteraction {
    start() {
        this.getBotController().hears('nikolas', ['direct_message', 'direct_mention'], (butler, message) => {
            butler.reply(message, 'Senhor Nikolas precisa fazer a barba, meu bom senhor.');
        });
    }
}

module.exports = NikolasInteraction;
