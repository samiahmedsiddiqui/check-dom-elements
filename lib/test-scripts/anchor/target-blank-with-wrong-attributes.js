"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = __importDefault(require("jsdom"));
function scriptSources(filePath, configOptions) {
    const { JSDOM } = jsdom_1.default;
    return new Promise(function (resolve) {
        axios_1.default.get(filePath, configOptions)
            .then(function (response) {
            const dom = new JSDOM(response.data);
            const anchorTags = dom.window.document.querySelectorAll('a[target="_blank"]');
            let addPage = {};
            anchorTags.forEach(anchor => {
                if (!anchor.rel || (anchor.rel !== 'noopener' && anchor.rel !== 'home' && anchor.rel !== 'lightframe[width:400px;]')) {
                    addPage[filePath] = filePath;
                    return false;
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
