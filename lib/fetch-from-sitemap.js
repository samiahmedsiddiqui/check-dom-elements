'use strict';

const axios = require('axios');
const xml2js = require('xml2js');

/**
 * Fetch Sitemap URL and dumb all the URLs from the XML to a variable.
 */
function fetchFromSitemap(sitemapUrl) {
  var fetchedUrls = [];

  return new Promise(function(resolve) {
    axios.get(sitemapUrl)
      .then(function(response) {
        if (response.status === 200) {
          if (response.data.indexOf('<?xml') !== -1) {
            const parser = new xml2js.Parser();

            parser.parseString(response.data, function(err, result) {
              for (const readUrl of result.urlset.url) {
                fetchedUrls.push(readUrl.loc[0]);
              }
            });
          } else {
            console.error('\x1b[31m%s\x1b[0m', 'Error: Not a XML file.');
          }
        }

        resolve(fetchedUrls);
      })
      .catch(function(error) {
        if (error.response && error.response.status) {
          console.error('\x1b[31m%s\x1b[0m', 'Error: Sitemap URL returns with status code ' + error.response.status);
        } else {
          console.error(error);
        }

        resolve(fetchedUrls);
      });
  });
}

module.exports = fetchFromSitemap;
