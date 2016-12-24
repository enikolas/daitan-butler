'use strict';

const _ = require('lodash');

const georgeReplies = [
    'George commitou? Não se preocupe, senhor. Estou aqui para limpar bagunças.',
    'Necessita de algum remédio para suportar o refactoring do código do George, meu senhor?',
    'Não fui contratado para limpar fezes, senhor. Manda o George limpar os feitos dele.',
    'Outro commit do George, senhor? Whisky saindo!',
    'Estou pensando em me demitir, senhor. O George dá muito trabalho.'
];

function GeorgeInteraction(botController) {
    this.botController = botController;

    this.start();
}

GeorgeInteraction.prototype.start = function start() {
    this.botController.hears(['george', 'George'], 'ambient', (butler, message) => {
        butler.reply(message, _.sample(georgeReplies));
    });
};

module.exports = GeorgeInteraction;
