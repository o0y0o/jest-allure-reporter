# @0y0/jest-allure-reporter · [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/o0y0o/jest-allure-reporter/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/@0y0/jest-allure-reporter.svg)](https://www.npmjs.com/package/@0y0/jest-allure-reporter) ![Package Status](https://github.com/o0y0o/jest-allure-reporter/workflows/Package/badge.svg)

`@0y0/jest-allure-reporter` is a custom Jest reporter to compatible with Allure.

## Intsallation

```sh
npm install @0y0/jest-allure-reporter --save-dev
```

## Usage

```js
{
  reporters: [
    ['@0y0/jest-allure-reporter', {
      title: 'Allure Reports',
      srcDir: path.join(projectDir, 'src'),
      outputDir: path.join(projectDir, 'reports')
    }]
  ]
}
```

## License

[MIT](https://github.com/o0y0o/jest-allure-reporter/blob/master/LICENSE)
