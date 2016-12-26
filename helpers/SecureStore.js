'use strict';

const low = require('lowdb');
const _ = require('lodash');
const SecureSerializer = require('./SecureSerializer');

function createStore(storeName, serializer) {
    return low(`${storeName}.json`, {
       format: {
           deserialize: serializer.deserialize.bind(serializer),
           serialize: serializer.serialize.bind(serializer)
       }
    });
}

function SecureStore(storeName, serializer) {
    this.store = createStore(storeName, serializer);
}

SecureStore.prototype.set = function set(name, value) {
    this.store.set(name, value).value();

    return this;
};

SecureStore.prototype.get = function get(name) {
    return this.store.get(name).value();
};

SecureStore.prototype.has = function has(name) {
    return this.store.has(name).value();
};

SecureStore.prototype.delete = function _delete(name) {
    this.store.unset(name).value();

    return this;
};

module.exports = SecureStore;
module.exports.global = new SecureStore('global', new SecureSerializer(process.env.STORE_PARAPHRASE));
