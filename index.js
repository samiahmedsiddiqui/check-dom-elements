'use strict';

const httpList = require('./lib/http-list');
const fetchFromSitemap = require('./lib/fetch-from-sitemap');

/**
 * Main function that handles config, get URLs from sitemap and check version.
 */
async function checkJquery(config) {
  var urlsList = [];

  if (!config) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Missing required Parameters.');
    process.exit();
  } else if (!config.options) {
    config.options = {};
  }

  if (config.sitemaps) {
    urlsList = await fetchFromSitemap(config.sitemaps);
  }

  if (config.urls && Array.isArray(config.urls)) {
    urlsList = urlsList.concat(config.urls);
  }

  if (urlsList.length === 0) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: No URL(s) found.');
    process.exit();
  }

  const result = await httpList(urlsList, config.test, config.options);

  // Add empty line
  console.log();

  // Add empty line
  console.log();

  Object.values(result).forEach(val => console.log(val));

  // Add empty line
  console.log();
  console.log('\x1b[32m%s\x1b[0m', 'DOM elements checking process completed!')
}

module.exports = checkJquery;
