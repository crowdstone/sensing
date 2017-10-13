# foglet-scripts
[![Build Status](https://travis-ci.org/RAN3D/foglet-scripts.svg?branch=master)](https://travis-ci.org/RAN3D/foglet-scripts)

Build and test foglet applications with minimal configuration.

# Installation

```
npm i --save-dev foglet-scripts
```

# Usage

```
Usage: foglet-scripts [options] [command]

 Build and test foglet applications with minimal configuration


 Options:

   -V, --version  output the version number
   -h, --help     output usage information


 Commands:

   build       Build foglet application using Webpack
   test        Run tests with Karma using the specified browsers
   start       Start signaling server at http://localhost:3000
   help [cmd]  display help for [cmd]
```

# Getting started

## Building foglet applications

Builds are triggered using `foglet-scripts build` command.

Build configuration is specified in the `package.json`:

```json
"foglet-scripts": {
  "build": {
    "entry": "./index.js",
    "output": {
      "filename": "bundle.js"
    }
  }
}
```

By default, `foglet-scripts` looks for `index.js` at the root of the project, use it
as the entry file for the application/library and output the bundle in `dist/`.
Source maps are automatically generated alongside the bundle.

The build can be configured with more options, the same as [Webpack build configuration](https://webpack.js.org/configuration/).

### Authoring a library

By default, `foglet-scripts` builds web applications, *e.g.* React or Angular applications.

If you want to build a library, you can use the same options as webpack for [authoring libraries](https://webpack.js.org/guides/author-libraries/).


```json
"foglet-scripts": {
  "build": {
    "entry": "./awesome-library.js",
    "output": {
      "filename": "awesome-library.bundle.js",
      "library": "awesomeLibrary",
      "libraryTarget": "umd",
      "umdNamedDefine": true
    }
  }
}
```

## Testing foglet applications

Install some Karma launchers to execute tests against browsers, *e.g.* Firefox.

```
npm i --save-dev karma-firefox-launcher
```

Then, add the following configuration to your `package.json`:

```json
"scripts": {
  "test": "foglet-scripts test"
},
...
"foglet-scripts": {
    "browsers": [
      "Firefox"
    ]
  }
```

Now, let's write a tiny test and put it in a file in the **tests/** directory at the root of your project.
```javascript
describe('some awesome test', () => {
  it('should work great!', () => {
    assert.isOk(true)
  })
})
```

Finally, let's test!
```
npm test
```

# Linting

By default, `foglet-scripts` apply [standard linter](https://standardjs.com/) to all javascript files.
If you want to turn it on/off, use the `lint` option in the configuration:

```json
"foglet-scripts": {
  "lint": false
}
```

# Testing environment

This package runs tests using [Karma](https://karma-runner.github.io/1.0/index.html) with:

* [Mocha](https://mochajs.org/) as the testing framework.
* [Chai](http://chaijs.com/), with the [assert API](http://chaijs.com/api/assert/), as the assertion library.
* [Webpack](https://webpack.js.org/) as a build tool.
* [Babel](https://babeljs.io/) with the [env preset](https://github.com/babel/babel-preset-env) for transpilling tests scripts.
* [Standard](https://standardjs.com/) to lint files.
