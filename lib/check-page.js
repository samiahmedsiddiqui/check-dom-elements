'use strict';

const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
 * Fetch Page, select script tag.
 */
function checkPage(filePath) {
  return new Promise(function(resolve) {
    axios.get(filePath)
      .then(function(response) {
        const dom = new JSDOM(response.data);
        const scriptTags = dom.window.document.querySelectorAll('script');

        var scriptSrc = {};
        scriptTags.forEach(tag => {
          if (tag.src) {
            scriptSrc[tag.src] = tag.src;
          }
        });

        resolve(scriptSrc);
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

module.exports = checkPage;
