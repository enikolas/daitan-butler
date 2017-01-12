const low = require('lowdb');
const SecureSerializer = require('./SecureSerializer');

function createStore(filename, serializer) {
    const options = {};

    if (serializer) {
        options.format = {
            deserialize: serializer.deserialize.bind(serializer),
            serialize: serializer.serialize.bind(serializer)
        };
    }

    return low(filename, options);
}

class FileStorage {
    constructor(storeName, serializer) {
        this.store = createStore(storeName, serializer);
    }

    set(name, value) {
        this.store.set(name, value).value();

        return this;
    }

    get(name) {
        return this.store.get(name).value();
    }

    has(name) {
        return this.store.has(name).value();
    }

    ['delete'](name) {
        this.store.unset(name).value();

        return this;
    }
}

module.exports = FileStorage;
module.exports.global = new FileStorage('global.json', new SecureSerializer(process.env.STORE_PARAPHRASE));
