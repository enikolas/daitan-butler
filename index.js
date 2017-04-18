require('dotenv').config();
const BotKit = require('botkit');
const interactions = require('./interactions');

const MAX_RETRIES = 10;

function makeBotController() {
    const controller = BotKit.slackbot({
        debug: false,
        require_delivery: true
    });

    controller.interactions = {};

    Object.keys(interactions).forEach((interactionName) => {
        controller.interactions[interactionName] = new (interactions[interactionName])(controller);
    });

    return controller;
}

function makeBot(controller, slackToken) {
    return controller.spawn({ token: slackToken, retry: MAX_RETRIES });
}

function sleepGracefully() {
    process.exit(0);
}

function putBotToSleep(bot) {
    console.log('\nBT butler is going to sleep now...');

    bot.destroy();
}

function setUpGlobalHandlers(bot) {
    process.on('SIGTERM', sleepGracefully);
    process.on('SIGINT', sleepGracefully);
    process.on('exit', putBotToSleep.bind(null, bot));
}

function wakeBotUp(butler) {
    butler.startRTM((err) => {
        if (err) {
            return void console.error('Butler could not wake up. Reason:', err.message);
        }

        console.log('Butler has woken up and will start serving masters...');
    });
}

function startButlerBot(controller) {
    const butler = makeBot(controller, process.env.SLACK_TOKEN);

    setUpGlobalHandlers(butler);
    wakeBotUp(butler);

    return butler;
}

const botController = makeBotController();

startButlerBot(botController);
