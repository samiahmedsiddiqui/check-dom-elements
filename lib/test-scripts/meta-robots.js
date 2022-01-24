'use strict';

const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
 * Fetch DOM Elements and Page URL where the meta robots found.
 *
 * @param array  filePath URL that needs to be crawled.
 * @param object configOptions config options for Axios like HTTP Auth etc.
 *
 * @returns array Page URL if `name="robots"` found.
 */
function scriptSources(filePath, configOptions) {
  return new Promise(function(resolve) {
    axios.get(filePath, configOptions)
      .then(function(response) {
        const dom = new JSDOM(response.data);
        const robotsMeta = dom.window.document.querySelectorAll('meta[name="robots"]');

        let addPage = {};
        robotsMeta.forEach(robot => {
          addPage[filePath] = robot.getAttribute('content');
        });

        resolve(addPage);
      })
      .catch(function(error) {
        // console.log('Error occurred on: ', filePath);
        // console.log('Error Details: ', error);

        let addPage = {};
        addPage[filePath] = 'ERROR OCCURRED ...';

        resolve(addPage);
      });
  });
}

module.exports = scriptSources;
