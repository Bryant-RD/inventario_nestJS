module.exports = {
  default: {
    requireModule: ['tsconfig-paths/register', 'ts-node/register'],
    require: ['features/steps_definitions/**/*.ts', 'features/support/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    publishQuiet: true,
    worldParameters: {},
  },
};