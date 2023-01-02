'use strict';

const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
 * Fetch DOM Elements and Page URL where the metas found.
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
        const titleMeta = dom.window.document.querySelector('title');
        const robotsMeta = dom.window.document.querySelectorAll('meta');

        let addPage = {};
        let metaInfo = {};

        if (titleMeta) {
          metaInfo['title'] = titleMeta.innerHTML;
        }

        robotsMeta.forEach(robot => {
          let metaName = '';

          if (robot.name) {
            metaName = robot.name;
          } else if (robot.property) {
            metaName = robot.property;
          }

          if (metaName !== '') {
            metaInfo[metaName] = robot.getAttribute('content');
          }
        });

        if (metaInfo !== '') {
          const metaInfoSorted = Object.keys(metaInfo).sort().reduce((res, key) => (res[key] = metaInfo[key], res), {});
          addPage[filePath] = JSON.stringify(metaInfoSorted);
        }

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
