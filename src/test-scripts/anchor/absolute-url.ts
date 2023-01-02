import axios from 'axios';
import jsdom from 'jsdom';

/**
 * Fetch DOM Elements and Page URL where the absolute URL is used.
 *
 * @param string filePath URL that needs to be crawled.
 * @param object configOptions config options for Axios like HTTP Auth etc.
 *
 * @returns array Page URL if absolute URL is used in the `href`.
 */
function scriptSources (filePath: string, configOptions: {}) {
  const { JSDOM } = jsdom;

  return new Promise(function (resolve) {
    axios.get(filePath, configOptions)
      .then(function (response) {
        const dom = new JSDOM(response.data);
        const anchorTags = dom.window.document.querySelectorAll('a');

        let addPage = {};
        anchorTags.forEach(anchor => {
          if (anchor.href) {
            let anchorUrl = anchor.href;
            if (anchorUrl.indexOf('about:blank') !== 0 && anchorUrl.indexOf('/') !== 0 && anchorUrl.indexOf('#') !== 0 && anchorUrl.indexOf('?') !== 0) {
              addPage[filePath] = filePath;
              return false;
            }
          }
        });

        resolve(addPage);
      })
      .catch(function (error) {
        console.log('Error occurred on: ', filePath);
        console.log('Error Details: ', error);

        let addPage = {};
        addPage[filePath] = 'ERROR OCCURRED ...';

        resolve({});
      });
  });
}

module.exports = scriptSources;
