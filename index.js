require('dotenv').config();
const BotKit = require('botkit');
const interactions = require('./interations');

let botSleptGracefully = false;

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
    return controller.spawn({ token: slackToken });
}

function wakeButlerUp(butler) {
    butler.startRTM((err) => {
        if (err) {
            console.error('Butler could not wake up. Reason:', err.message);
            console.log('Retrying...');

            setTimeout(wakeButlerUp, 8000);

            return;
        }

        console.log('Butler has woken up and will start serving masters...');
    });
}

function setUpErrorHandlers(controller, bot) {
    controller.on('rtm_close', () => {
        if (botSleptGracefully) return;

        wakeButlerUp(bot);
    });

    process.on('SIGTERM', () => process.exit(0));
    process.on('SIGINT', () => process.exit(0));
    process.on('exit', () => {
        console.log('\nBT butler is going to sleep now...');

        botSleptGracefully = true;
        bot.destroy();
    });
}

const botController = makeBotController();
const butler = makeBot(botController, process.env.SLACK_TOKEN);

// Handle global errors and error events
setUpErrorHandlers(botController, butler);

// Butler, go to work;
wakeButlerUp(butler);
