module.exports = {
  preset: 'react-native',
  // React Navigation e react-native-screens publicam ESM e precisam passar pelo Babel.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-screens|react-native-safe-area-context)/)',
  ],
};
