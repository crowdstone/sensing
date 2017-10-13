// karma-istanbul
// ==============
//
// Main entry point for the karma-istanbul module.
// Exposes the reporter plugins.

module.exports = {
	'reporter:istanbul': ['type', require('./reporter')]
}