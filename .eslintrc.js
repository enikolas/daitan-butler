module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "env": {
        "node": true
    },
    "rules": {
        "indent": ["error", 4],
        "comma-dangle": ["error", "never"],
        "no-underscore-dangle": "off",
        "consistent-return": ["error", {"treatUndefinedAsUnspecified": true}],
        "no-void": "off"
    }
};