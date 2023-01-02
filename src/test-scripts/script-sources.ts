import axios from 'axios';
import jsdom from 'jsdom';

/**
 * Fetch DOM Elements and return list of scripts src.
 *
 * @param string filePath URL that needs to be crawled.
 * @param object configOptions config options for Axios like HTTP Auth etc.
 *
 * @returns array List of scripts that are used on the page.
 */
function scriptSources (filePath: string, configOptions: {}) {
  const { JSDOM } = jsdom;

  return new Promise(function (resolve) {
    axios.get(filePath, configOptions)
      .then(function (response) {
        const dom = new JSDOM(response.data);
        const scriptTags = dom.window.document.querySelectorAll('script');

        const scriptSrc: { [key: string]: string } = {};
        scriptTags.forEach(tag => {
          if (tag.src) {
            scriptSrc[tag.src] = tag.src;
          }
        });

        resolve(scriptSrc);
      })
      .catch(function (error) {
        console.log('Error occurred on: ', filePath);
        console.log('Error Details: ', error);

        resolve({});
      });
  });
}

module.exports = scriptSources;
