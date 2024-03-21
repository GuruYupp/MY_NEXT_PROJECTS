module.exports = {
    // The list of files to lint.
    // "*.js": ["eslint"],
    // The folder to check.
    "src/**/*.tsx": ["prettier --write", "eslint --max-warnings 0 ."],
    "src/**/*.ts": ["prettier --write", "eslint --max-warnings 0 ."]
  };