"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const jsdom_1 = __importDefault(require("jsdom"));
const url_1 = require("url");
function scriptSources(filePath, configOptions) {
    const { JSDOM } = jsdom_1.default;
    return new Promise(function (resolve) {
        axios_1.default.get(filePath, configOptions)
            .then(function (response) {
            const dom = new JSDOM(response.data);
            const imgTags = dom.window.document.querySelectorAll('img');
            let pageImages = 'Src, Alt, Title\n';
            imgTags.forEach(image => {
                if (image.hasAttribute('data-src')) {
                    pageImages += image.getAttribute('data-src');
                }
                else {
                    pageImages += image.src;
                }
                pageImages += ', ';
                if (image.alt) {
                    pageImages += image.alt.replace(/,/g, '&#44;');
                }
                else {
                    pageImages += '';
                }
                pageImages += ', ';
                if (image.title) {
                    pageImages += image.title.replace(/,/g, '&#44;');
                }
                else {
                    pageImages += '';
                }
                pageImages += '\n';
            });
            let pathname = new url_1.URL(filePath).pathname;
            const urlPath = pathname.replace(/^\/|\/$/g, '');
            const folder = urlPath.substring(0, urlPath.lastIndexOf('/') + 1);
            let filename = urlPath.substring(urlPath.lastIndexOf('/') + 1);
            if (filename === '') {
                filename = 'index';
            }
            if (folder && !fs_1.default.existsSync('build/' + folder)) {
                fs_1.default.mkdirSync('build/' + folder, { recursive: true });
            }
            fs_1.default.writeFile('build/' + folder + '/' + filename + '.csv', pageImages, function (err) {
                if (err) {
                    throw err;
                }
            });
            resolve({});
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
