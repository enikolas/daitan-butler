# daitan-butler
The DaitanGroup butler. The ultimate development team helper.

### Requirements

* NodeJS >= 4.4.x
* Yarn (Optional, but recommended)
* A ```.env``` file within project's root  with the following content:

```sh
SLACK_TOKEN=<SLACK-BOT-TOKEN>
STORE_PARAPHRASE=<ANY-ENCRYPTION-PASSWORD>
```

### Running

(At project's root)

1. ```yarn``` or ```npm install```
2. ```yarn run start``` or ```npm start```

### Development & Contributing

* Please follow [AirBnB JS Style](https://github.com/airbnb/javascript) (with some overrides, as seen in ```.eslintrc.js``` in project's root)
* ```yarn run lint``` or ```npm run lint``` often (It is run as a pre-commit hook anyway)
* No test suite yet, but comming (PRs around that are very welcome)
* PR away!
