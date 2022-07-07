module.exports = {
  extends: ['stylelint-config-prettier'],
  plugins: ['stylelint-scss'],
  rules: {
    'at-rule-no-unknown': [true, {ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen']}],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': [true, {ignoreAtRules: ['function', 'if', 'each', 'include', 'mixin', 'else', 'return', 'tailwind']}],
  },
};
