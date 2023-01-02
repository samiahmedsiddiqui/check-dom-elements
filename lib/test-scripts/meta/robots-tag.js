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
            const robotsMeta = dom.window.document.querySelectorAll('meta[name="robots"]');
            let addPage = {};
            robotsMeta.forEach(robot => {
                addPage[filePath] = robot.getAttribute('content');
            });
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
