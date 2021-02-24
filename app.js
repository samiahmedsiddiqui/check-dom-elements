'use strict';

const checkPage = require('./lib/check-page');
const fetchFromSitemap = require('./lib/fetch-from-sitemap');

/**
 * Show Progress.
 */
function printProgress(progress) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(progress);
}

/**
 * Main function that handles config, get URLs from sitemap and check version.
 */
async function checkJquery(config) {
  var convertUrls = [];

  if (config.sitemap) {
    convertUrls = await fetchFromSitemap(config.sitemap);
  } else if (config.urls && Array.isArray(config.urls) && config.urls.length > 0) {
    convertUrls = config.urls;
  } else {
    console.log('Sitemap or URLs are required and cannot be empty.');
  }

  if (convertUrls.length === 0) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: No URL(s) found.');
    process.exit();
  }

  const totalConversions = convertUrls.length;

  var attachedScripts = [];
  var converting = 0;
  var conversionProgress = 0;
  var progressMsg = 'Converting: 0% (0/' + totalConversions + ')';

  printProgress(progressMsg);
  for (const readUrl of convertUrls) {
    converting += 1;
    conversionProgress = ((converting / totalConversions) * 100).toFixed(0);

    const result = await checkPage(readUrl);
    attachedScripts = Object.assign({}, attachedScripts, result);

    progressMsg = 'Converting: ' + conversionProgress + '% (' + converting + '/' + totalConversions + ')';
    if (converting === totalConversions) {
      progressMsg = progressMsg + ', done';
    }

    printProgress(progressMsg);
  }

  // Add empty line
  console.log();

  // Add empty line
  console.log();

  Object.values(attachedScripts).forEach(val => console.log(val));

  // Add empty line
  console.log();

  console.log('\x1b[32m%s\x1b[0m', 'jQuery version process completed!')
}

module.exports = checkJquery;
