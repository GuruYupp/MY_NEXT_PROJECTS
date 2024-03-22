module.exports = {
    // The list of files to lint.
    // "*.js": ["eslint"],
    // The folder to check.
    "src/**/*.tsx": ["prettier --write", "eslint --max-warnings 0 src/**/*.tsx"],
    "src/**/*.ts": ["prettier --write", "eslint --max-warnings 0  src/**/*.ts"],
    "src/**/*.scss": ["prettier --write"],
    "src/**/*.css": ["prettier --write"]
  };