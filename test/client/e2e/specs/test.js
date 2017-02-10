/*eslint-env node */
// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
	'default e2e tests': function(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
		const devServer = browser.globals.devServerURL;

		browser
      .url(devServer)
      .waitForElementVisible('#outer_wrapper', 5000)
      .assert.elementPresent('.header')
      .assert.containsText('.header', 'System Status');
	},
	'test search': function(browser) {
		browser
      .setValue('input[type=search]', 'on')
      .waitForElementVisible('.suggestion', 1000)
      .assert.containsText('.suggestion', 'one')
      .clearValue('input[type=search]')
      .setValue('input[type=search]', 'tw')
      .waitForElementVisible('.suggestion', 1000)
      .assert.containsText('.suggestion', 'two')
      .end();
	}
};
