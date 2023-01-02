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
                }
                else if (robot.property) {
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
            .catch(function (error) {
            let addPage = {};
            addPage[filePath] = 'ERROR OCCURRED ...';
            resolve(addPage);
        });
    });
}
module.exports = scriptSources;
