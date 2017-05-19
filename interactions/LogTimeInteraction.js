const AbstractInteraction = require('../helpers/AbstractInteraction');
const TimekeeperHelper = require('../helpers/TimekeeperHelper');
const SecureHelper = require('../helpers/SecureHelper');

function getBot(conversation) {
    return conversation.context.bot;
}

function handleConversation(err, convo) {
    const secureHelper = new SecureHelper('timekeeper', convo.context.user);
    const logTime = {};

    let user = {};

    convo.say('Olá, senhor!');
    convo.say('Necessita apontar suas horas trabalhadas? Isso não vai demorar nada, meu senhor.');

    if (!secureHelper.isPasswordStored()) {
        convo.ask('Por favor senhor, me forneça seu usuário do site de apontamento de horas:', (response) => {
            user.username = response.text.trim();

            convo.next();
        });

        convo.ask('E sua senha? (Não sepreocupe senhor, eu sou muito confiável)', (response) => {
            user.password = response.text.trim();
            secureHelper.setUser(user);

            convo.next();
        });
    } else {
        user = secureHelper.getUser();

        convo.say('Eu lembro das suas credenciais, não precisa me fornecer de novo.');
    }

    convo.ask('Qual dia você deseja apontar? (Formato: yyyy-MM-dd. Exemplo: 2017-12-25',
        (response) => {
            logTime.date = response.text.trim();

            convo.next();
        });

    convo.ask('Qual o horario que você chegou neste dia? (Formato: hh:mm. Exemplo: 8:45', (response) => {
        logTime.arrivedTime = response.text.trim();

        convo.next();
    });

    convo.ask('Quantas horas você trabalhou nesse dia? (Formato: hh:mm. Exemplo: 8:00', (response) => {
        logTime.workedTime = response.text.trim();

        const waitMessage = 'Não gostaria de tomar um café, enquanto aponto suas horas para você?';

        getBot(convo).reply(convo.source_message, waitMessage, (replyErr) => {
            if (replyErr) {
                convo.say('Me perdoe mestre, mas não consegui realizar o apontamento.');
                convo.say('Tente novamente mais tarde.');

                return void convo.next();
            }

            const timekeeperHelper = new TimekeeperHelper(user, logTime);

            timekeeperHelper.logTime(() => {
                convo.say('Apontamento realizado com sucesso. É um prazer servi-lo mestre.');
                convo.next();
            });
        });
    });
}

class LogTimeInteraction extends AbstractInteraction {
    start() {
        this.getBotController().hears('apontamento', ['direct_message'], (butler, message) => {
            butler.startPrivateConversation(message, handleConversation);
        });
    }
}

module.exports = LogTimeInteraction;
