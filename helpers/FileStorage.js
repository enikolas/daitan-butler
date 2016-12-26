'use strict';

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

function FileStorage(storeName, serializer) {
    this.store = createStore(storeName, serializer);
}

FileStorage.prototype.set = function set(name, value) {
    this.store.set(name, value).value();

    return this;
};

FileStorage.prototype.get = function get(name) {
    return this.store.get(name).value();
};

FileStorage.prototype.has = function has(name) {
    return this.store.has(name).value();
};

FileStorage.prototype.delete = function _delete(name) {
    this.store.unset(name).value();

    return this;
};

module.exports = FileStorage;
module.exports.global = new FileStorage('global.json', new SecureSerializer(process.env.STORE_PARAPHRASE));
