'use strict';

const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

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
        const anchorTags = dom.window.document.querySelectorAll('a[target="_blank"]');

        let wrongRel = false;
        anchorTags.forEach(anchor => {
          if (!anchor.rel || (anchor.rel !== 'noopener' && anchor.rel !== 'home' && anchor.rel !== 'lightframe[width:400px;]')) {
            wrongRel = true;
            return false;
          }
        });

        let addPage = {};
        if (wrongRel) {
          addPage[filePath] = filePath;
        }

        resolve(addPage);
      })
      .catch(function(error) {
        console.log(error)
        if (error.response && error.response.status) {
          resolve(error.response.status);
        } else {
          resolve('failed');
        }
      });
  });
}

module.exports = scriptSources;
