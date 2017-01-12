const defaultFetcher = require('request');

function toBase64(str) {
    return new Buffer(str).toString('base64');
}

function TokenGenerator(fetcher) {
    this.fetcher = fetcher || defaultFetcher;
}

TokenGenerator.prototype.setUsername = function setUsername(username) {
    this.username = username;

    return this;
};

TokenGenerator.prototype.setPassword = function setPassword(password) {
    this.password = password;

    return this;
};

TokenGenerator.prototype._loginIntoIDesk = function logIntoIDesk(oneTimeToken) {
    const cookieJar = this.fetcher.jar();

    return new Promise((resolve, reject) => {
        this.fetcher.post({
            url: 'https://idesk.bt.com/dana-na/auth/url_default/login.cgi',
            form: {
                username: this.username,
                token: oneTimeToken,
                password: `#${this.password}|${oneTimeToken}`,
                typedpassword: this.password,
                realm: 'Siteminder',
                btnSubmit: 'Sign In'
            },
            jar: cookieJar
        }, (err, response, body) => {
            if (err) {
                return void reject(err);
            }

            if (response.statusCode > 399) {
                return void reject(new Error(`Was not able to log into IDesk, failed with ${response.statusCode} code. Info: \n ${body}`));
            }

            if (response.headers.location.includes('failed')) {
                return void reject(new Error('Was not able to log into IDesk, Bad credentials or one time token.'));
            }

            resolve(cookieJar);
        });
    });
};

TokenGenerator.prototype._generateToken = function generateToken(sessionCookieJar) {
    return new Promise((resolve, reject) => {
        this.fetcher.post({
            url: 'https://idesk.bt.com/svnauthenticator/service/SvnAuthenticator/,DanaInfo=collaborate.bt.com,SSL,dom=1,CT=sxml+',
            headers: { 'Content-Type': 'text/xml' },
            jar: sessionCookieJar,
            body: (
`<soapenv:Envelope xmlns:ns="http://collaborate.bt.com/svn/rsa/2010/02" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Body>
        <username>${toBase64(this.username)}</username>
        <password>${toBase64(this.password)}</password>
    </soapenv:Body>
</soapenv:Envelope>`
            )
        }, (err, response, body) => {
            if (err) {
                return void reject(err);
            }

            if (response.statusCode > 399) {
                return void reject(new Error(`Was not able to generate token, failed with ${response.statusCode} code. Info: \n ${body}`));
            }

            const pattern = /(authtoken:[a-z0-9]+)/;
            const matches = pattern.exec(body);

            resolve(matches[0]);
        });
    });
};

TokenGenerator.prototype.generate = function generate(oneTimeToken) {
    if (!this.username) {
        return Promise.reject(new Error('Username was not set. Cannot generate token without the IDesk username.'));
    }

    if (!this.password) {
        return Promise.reject(new Error('Password was not set. Cannot generate token without the IDesk password.'));
    }

    if (!oneTimeToken) {
        return Promise.reject(new Error('One Time Token was not provided.'));
    }

    return this._loginIntoIDesk(oneTimeToken)
        .then(sessionCookieJar => this._generateToken(sessionCookieJar));
};

module.exports = TokenGenerator;
