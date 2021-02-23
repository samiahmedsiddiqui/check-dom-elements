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

  console.log(convertUrls)

  /*
  const afterConvert = config.afterConvert ? config.afterConvert : '';
  const beforeConvert = config.beforeConvert ? config.beforeConvert : '';
  const destinationPath = config.destination ? config.destination : 'build';
  const htmlSelector = config.selector ? config.selector : '';
  */
  const totalConversions = convertUrls.length;

  var converting = 0;
  var conversionProgress = 0;
  var conversionFailed = 0;
  var failedList = {};
  var progressMsg = 'Converting: 0% (0/' + totalConversions + ')';

  printProgress(progressMsg);
  /*
  if (destinationPath && !fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }
  */

  for (const readUrl of convertUrls) {
    converting += 1;
    conversionProgress = ((converting / totalConversions) * 100).toFixed(0);

    const result = await checkPage(readUrl);
    /*
    if (!result || result !== 'passed') {
      conversionFailed += 1;
      if (result === 'failed') {
        if (!failedList['others']) {
          failedList['others'] = [];
        }
        failedList['others'].push(readUrl);
      } else {
        if (!failedList[result]) {
          failedList[result] = [];
        }
        failedList[result].push(readUrl);
      }
    }*/

    progressMsg = 'Converting: ' + conversionProgress + '% (' + converting + '/' + totalConversions + ')';
    if (converting === totalConversions) {
      progressMsg = progressMsg + ', done';
    }

    printProgress(progressMsg);
  }

  // Add empty line
  console.log();

  console.log('\x1b[32m%s\x1b[0m', 'jQuery version process completed!')
}

module.exports = checkJquery;
