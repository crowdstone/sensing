var istanbul = require('istanbul'),
  path = require('path'),
  util = require('util'),
  Report = istanbul.Report,
  Store = istanbul.Store,
  Collector = istanbul.Collector


function IstanbulReporter(rootConfig, logger, emitter, helper) {
  var log = logger.create('istanbul-reporter')

  var config = rootConfig.istanbulReporter || {}
  var basePath = rootConfig.basePath
  var reporters = config.reporters || []
  var coverages = undefined


  this.onRunStart = function(browsers) {
    coverages = {}
  }

  this.onBrowserComplete = function(browser, result) {
    addCoverage(browser, result.coverage)
  }

  this.onSpecComplete = function(browser, result) {
    addCoverage(browser, result.coverage)
  }

  this.onRunComplete = function(browsers, results) {
    reporters.forEach(function(reporterConfig) {
      browsers.forEach(function(browser) {
        var coverage = coverages[browser.id]
        if (!coverage) return

        var collector = new istanbul.Collector(),
          outputDir = helper.normalizeWinPath(
            path.resolve(basePath, generateOutputDir(browser.name,
              reporterConfig.dir || config.dir,
              reporterConfig.subdir || config.subdir
            ))
          ),
          toDisk = reporterConfig.type && reporterConfig.type.match(/^(text|text-summary|in-memory)$/) && !reporterConfig.file,
          options = Object.assign({}, config, reporterConfig, {
            dir: outputDir,
            browser: browser,
            emitter: emitter
          }),
          newCoverage = {}

        for (var out in coverage) {
          newCoverage[path.join(outputDir, diffString(out, outputDir))] = coverage[out]
        }
        collector.add(newCoverage)

        var reporter = istanbul.Report.create(reporterConfig.type || 'html', options)
        if (!toDisk) {
          writeReport(reporter, collector)
          return
        }

        helper.mkdirIfNotExists(outputDir, function() {
          log.debug('Writing coverage to %s', outputDir)
          writeReport(reporter, collector)
        })

        return
      })
    })
  }

  function addCoverage(browser, coverage) {
    if (coverage)
      coverages[browser.id] = coverage
  }

  function diffString(path, target) {
    for (var i = 0, l = path.length; i < l; i++) {
      if (path.charAt(i) != target.charAt(i)) {
        return path.substr(i)
      }
    }
  }

  function generateOutputDir(browserName, dir, subdir) {
    dir = dir || 'coverage'
    subdir = subdir || browserName

    if (typeof subdir == 'function')
      subdir = subdir(browserName)

    return path.join(dir, subdir)
  }

  function writeReport(reporter, collector) {
    try {
      if (typeof config.onWriteReport === 'function') {
        var newCollector = config.onWriteReport(collector)
        if (typeof newCollector === 'object') {
          collector = newCollector
        }
      }
      reporter.writeReport(collector, true)
    } catch (e) {
      log.error(e)
    }
  }
}

IstanbulReporter.$inject = ['config', 'logger', 'emitter', 'helper']

module.exports = IstanbulReporter