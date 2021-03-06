const crypto = require('crypto');

const paraphrases = new WeakMap();
const encryptionAlgorithm = 'aes256';

function encrypt(paraphrase, str) {
    const cipher = crypto.createCipher(encryptionAlgorithm, paraphrase);

    return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
}

function decrypt(paraphrase, str) {
    const decipher = crypto.createDecipher(encryptionAlgorithm, paraphrase);

    return decipher.update(str, 'hex', 'utf8') + decipher.final('utf8');
}

class SecureSerializer {
    constructor(paraphrase) {
        paraphrases.set(this, paraphrase);
    }

    serialize(obj) {
        const str = JSON.stringify(obj);

        return encrypt(paraphrases.get(this), str);
    }

    deserialize(str) {
        const decrypted = decrypt(paraphrases.get(this), str);

        return JSON.parse(decrypted);
    }
}

module.exports = SecureSerializer;
