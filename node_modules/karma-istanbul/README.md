# karma-istanbul

> Generate code coverage using [Istanbul].

## Installation

The easiest way is to install `karma-istanbul` as a `devDependency`,
by running

```bash
npm install karma karma-istanbul --save-dev
```

## Examples

```javascript
// karma.conf.js
module.exports = function(config) {
  config.set({
    files: [
      'src/**/*.js',
      'test/**/*.js'
    ],

    // coverage reporter generates the coverage
    reporters: ['progress', 'istanbul'],

    // optionally, configure the reporter
    istanbulReporter: {
      dir : 'coverage/',
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
        { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
      ]
    }
  });
};
```

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com
[Istanbul]: https://github.com/tao-zeng/karma-istanbul
