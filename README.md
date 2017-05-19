# daitan-butler
The DaitanGroup butler. The ultimate development team helper.

### Requirements

* NodeJS >= 6.x.x
* Yarn (Optional, but recommended)
* A ```.env``` file within project's root  with the following content:

```sh
SLACK_TOKEN=<SLACK-BOT-TOKEN>
STORE_PARAPHRASE=<ANY-ENCRYPTION-PASSWORD>
TIMEKEEPER_URL=<TARGET-TIMEKEEPER-URL>
```

### Running

(At project's root)

1. ```yarn``` or ```npm install```
2. ```yarn run start``` or ```npm start```

### Running as a background process

(At project's root)

1. ```yarn``` or ```npm install```
2. ```yarn run forever``` or ```npm run forever``` OR:
    - ```yarn run forever:start``` or ```npm run forever:start```to start the bot process in background
    - ```yarn run forever:logs``` or ```npm run forever:logs``` to show the process logs
    - ```yarn run forever:stop``` or ```npm run forever:stop``` to kill the bot process

### Development & Contributing

* The bot is built using the awesome [Botkit](https://github.com/howdyai/botkit)
* To add a Bot interaction just follow the following steps:
    1. Create a file called ```<NameOfInteraction>Interaction.js``` inside the ```interactions/``` folder
    2. Inside the file require() ```helpers/AbstractInteraction.js```
    3. Write a class that extends the ```AbstractInteraction``` class with the same name as the file (e.g: ```<NameOfInteraction>Interaction```)
    4. Implement the ```start()``` method
    5. Export only the class from the file
    6. Add it to the exported map object inside ```interactions/index.js```
* Please follow [AirBnB JS Style](https://github.com/airbnb/javascript) (with some overrides, as seen in ```.eslintrc.js``` in project's root)
* ```yarn run lint``` or ```npm run lint``` often (It is run as a pre-commit hook anyway)
* No test suite yet, but comming (PRs around that are very welcome)
* PR away!
