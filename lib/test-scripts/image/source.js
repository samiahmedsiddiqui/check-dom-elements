"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = __importDefault(require("jsdom"));
function imageSources(filePath, configOptions) {
    const { JSDOM } = jsdom_1.default;
    return new Promise(function (resolve) {
        axios_1.default.get(filePath, configOptions)
            .then(function (response) {
            const dom = new JSDOM(response.data);
            const imageTags = dom.window.document.querySelectorAll('img');
            let imageSrc = {};
            imageTags.forEach(tag => {
                let imageSource = '';
                if (tag.getAttribute('data-src')) {
                    imageSource = tag.getAttribute('data-src');
                }
                else if (tag.src) {
                    imageSource = tag.src;
                }
                if (imageSource !== '') {
                    imageSrc[imageSource] = imageSource;
                }
            });
            resolve(imageSrc);
        })
            .catch(function (error) {
            console.log('Error occurred on: ', filePath);
            console.log('Error Details: ', error);
            resolve({});
        });
    });
}
module.exports = imageSources;
