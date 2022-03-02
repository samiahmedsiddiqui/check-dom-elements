'use strict';

const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
 * Fetch DOM Elements and return list of image src.
 *
 * @param array  filePath URL that needs to be crawled.
 * @param object configOptions config options for Axios like HTTP Auth etc.
 *
 * @returns array List of images that are used on the page.
 */
function imageSources(filePath, configOptions) {
  return new Promise(function(resolve) {
    axios.get(filePath, configOptions)
      .then(function(response) {
        const dom = new JSDOM(response.data);
        const imageTags = dom.window.document.querySelectorAll('img');

        var imageSrc = {};
        imageTags.forEach(tag => {
          let imageSource = '';
          if (tag.getAttribute('data-src')) {
            imageSource = tag.getAttribute('data-src');
          } else if (tag.src) {
            imageSource = tag.src;
          }

          if (imageSource !== '') {
            imageSrc[imageSource] = imageSource;
          }
        });

        resolve(imageSrc);
      })
      .catch(function(error) {
        console.log('Error occurred on: ', filePath);
        console.log('Error Details: ', error);

        resolve({});
      });
  });
}

module.exports = imageSources;
