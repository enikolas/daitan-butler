const store = require('../helpers/FileStorage').global;

class SecureHelper {
    constructor(appName, slackUsername) {
        this.credentialsKey = `credentias.${appName}.${slackUsername}`;
    }

    isPasswordStored() {
        return store.has(this.credentialsKey);
    }

    getUser() {
        const credentials = store.get(this.credentialsKey);

        return credentials;
    }

    setUser(user) {
        store.set(this.credentialsKey, user);
    }
}

module.exports = SecureHelper;
