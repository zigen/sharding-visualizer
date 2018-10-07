module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": ["eslint:recommended", "plugin:flowtype/recommended"],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "globals": {
    "THREE": true
  },
  "plugins": [
    "react",
    "flowtype"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
