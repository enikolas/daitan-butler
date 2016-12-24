'use strict';

const TokenGenerator = require('../helpers/TokenGenerator');
const store = require('../helpers/SecureStore').global;

function getCredentialsKey(conversation) {
    return `credentials.${conversation.context.user}`;
}

function getBot(conversation) {
    return conversation.context.bot;
}

function TokenInteraction(botController) {
    this.botController = botController;

    this.start();
}

TokenInteraction.prototype._handleConversation = function handleConversationStart(err, convo) {
    const credentialsKey = getCredentialsKey(convo);
    const botRemembersUser = store.has(credentialsKey);
    let username = '';
    let password = '';
    let oneTimeToken = '';

    convo.say('Olá, senhor!');
    convo.say('Necessita de um token SVN? Isso não vai demorar nada, meu senhor.');

    if (!botRemembersUser) {
        convo.ask('Por favor senhor, me forneça seu usuário do IDesk (EIN)?', response => {
            username = response.text.trim();

            convo.next();
        });

        convo.ask('E sua senha? (Não sepreocupe senhor, eu sou muito confiável)', response => {
            password = response.text.trim();

            convo.next();
        });
    } else {
        const credentials = store.get(credentialsKey);
        username = credentials.username;
        password = credentials.password;

        convo.say('Eu lembro das suas credenciais, não precisa me fornecer de novo.');
    }

    convo.ask(`${botRemembersUser ? 'Só uma coisa' : 'Uma ultima coisa'}: Seu One Time Token? Não se preocupe, eu aguardo.`, response => {
        oneTimeToken = response.text.trim();

        getBot(convo).reply(convo.source_message, 'Gerando seu token, senhor. Só um momento...', err => {
            if (err) {
                convo.say('Não consegui gerar su token, senhor. Tente novamente mais tarde.');

                return convo.next();
            }

            const tokenGenerator = new TokenGenerator();

            tokenGenerator.setUsername(username);
            tokenGenerator.setPassword(password);

            tokenGenerator.generate(oneTimeToken).then(token => {
                store.set(credentialsKey, {username, password});

                convo.say('Aqui está o seu novo token:');
                convo.say(`\`\`\`${token}\`\`\``);
                convo.say('Ele expirará se não usá-lo por duas horas. Fico feliz em servi-lo.');
            }, err => {
                store.delete(credentialsKey);

                convo.say('Algo deu errado senhor, infelizmente não consegui gerar seu token.');
                convo.say(`O servidor de tokens me respondeu: "${err.message}"`);
                convo.say('Por favor, verifique suas credenciais e tente novamente.');
            }).then(() => {
                convo.next();
            });
        });
    });
};

TokenInteraction.prototype.start = function start() {
    this.botController.hears(['token', 'Token'], ['direct_message', 'direct_mention'], (butler, message) => {
        butler.startPrivateConversation(message, this._handleConversation.bind(this));
    });
};

module.exports = TokenInteraction;
