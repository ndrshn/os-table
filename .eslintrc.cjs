module.exports = {
  extends: [
    // By extending from a plugin config, we can get recommended rules without having to add them manually.
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:import/recommended',
    'eslint-config-prettier',
  ],
  settings: {
    // Tells eslint how to resolve imports
    'import/resolver': {
      node: {
        paths: ['lib'],
        extensions: ['.js', '.vue'],
      },
    },
  },
  rules: {
    // Add your own rules here to override ones from the extended configs.
  },
};
