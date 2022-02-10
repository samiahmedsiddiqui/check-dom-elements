'use strict';

const axios = require('axios');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
// const { URL } = require('url');
const { URL } = require('url');


/**
 * Fetch DOM Elements and Page URL where the wrong attributes found.
 *
 * @param array  filePath URL that needs to be crawled.
 * @param object configOptions config options for Axios like HTTP Auth etc.
 *
 * @returns array Page URL if wrong rel found with `target="_blank"`.
 */
function scriptSources(filePath, configOptions) {
  return new Promise(function(resolve) {
    axios.get(filePath, configOptions)
      .then(function(response) {
        const dom = new JSDOM(response.data);
        const imgTags = dom.window.document.querySelectorAll('img');

        let pageImages = 'Src, Alt, Title\n';
        imgTags.forEach(image => {
          if (image.hasAttribute('data-src')) {
            pageImages += image.getAttribute('data-src');
          } else {
            pageImages += image.src;
          }

          pageImages += ', ';

          if (image.alt) {
            // @todo Fix Comma issue.
            pageImages += image.alt.replace(/,/g, '&#44;');
          } else {
            pageImages += '';
          }

          pageImages += ', ';

          if (image.title) {
            // @todo Fix Comma issue.
            pageImages += image.title.replace(/,/g, '&#44;');
          } else {
            pageImages += '';
          }

          pageImages += '\n';
        });

        let pathname = new URL(filePath).pathname;
        const urlPath = pathname.replace(/^\/|\/$/g, '');
        const folder = urlPath.substring(0, urlPath.lastIndexOf('/') + 1);

        let filename = urlPath.substring(urlPath.lastIndexOf('/') + 1);
        if (filename === '') {
          filename = 'index';
        }

        if (folder && !fs.existsSync('build/' + folder)) {
          fs.mkdirSync('build/' + folder, { recursive: true });
        }

        fs.writeFile('build/' + folder + '/' + filename + '.csv', pageImages, function(err) {
          if (err) {
            throw err;
          }
        });

        resolve({});
      })
      .catch(function(error) {
        console.log('Error occurred on: ', filePath);
        console.log('Error Details: ', error);

        let addPage = {};
        addPage[filePath] = 'ERROR OCCURRED ...';

        resolve({});
      });
  });
}

module.exports = scriptSources;
