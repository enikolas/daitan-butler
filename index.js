require('dotenv').config();
const BotKit = require('botkit');
const interactions = require('./interations');

const controller = BotKit.slackbot({
    debug: false,
    require_delivery: true
});

controller.interactions = {};

Object.keys(interactions).forEach((interactionName) => {
    controller.interactions[interactionName] = new (interactions[interactionName])(controller);
});

const butler = controller.spawn({ token: process.env.SLACK_TOKEN });

butler.startRTM((err) => {
    if (err) {
        console.error('Butler could not wake up. Reason:', err.message);

        return void process.exit(1);
    }

    console.log('Butler has woken up and will start serving masters...');
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('exit', () => {
    console.log('\nBT butler is going to sleep now...');

    butler.destroy();
});
