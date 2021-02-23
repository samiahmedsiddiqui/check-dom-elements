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
        const selector = 'script';
        // const parseUrl = url.parse(config.url, true);

        var pageContent = '';
        if (dom.window.document.querySelector(selector)) {
          pageContent = dom.window.document.querySelector(selector).innerHTML;
        } else {
          pageContent = response.data;
        }

        console.log(filePath);
        process.exit();

        resolve('passed');
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
