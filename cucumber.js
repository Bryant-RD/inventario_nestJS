// module.exports = {
//   default: {
//     requireModule: ['tsconfig-paths/register', 'ts-node/register'],
//     require: ['features/steps_definitions/**/*.ts', 'features/support/**/*.ts'],
//     paths: ['features/**/*.feature'],
//     format: ['progress-bar', 'json:reports/cucumber-report.json'],
//     worldParameters: {},
//   },
// };


module.exports = {
  default: {
    require: [
      './test/jest.setup.ts',                // <-- primero el setup para crypto
      'features/support/**/*.ts',            // <-- hooks y world
      'features/steps_definitions/**/*.ts'   // <-- luego los steps
    ],
    requireModule: [
      'ts-node/register',                    // <-- correr TS
      'tsconfig-paths/register'              // <-- soportar "paths" en tsconfig
    ],
    paths: ['features/**/*.feature'],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    worldParameters: {},
  },
};