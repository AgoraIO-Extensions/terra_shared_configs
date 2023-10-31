module.exports = {
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!(@agoraio-extensions)/)'],
  testRegex: 'src/__tests__/.*\\.(test|spec)\\.[jt]sx?$',
};
