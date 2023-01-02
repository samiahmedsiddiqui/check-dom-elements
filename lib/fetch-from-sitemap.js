'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = __importDefault(require("xml2js"));
function fetchFromSitemap(sitemapUrl) {
    let errorMessage = 'Error: ' + sitemapUrl + ' returns with status code ';
    let fetchedUrls = [];
    return new Promise((resolve) => {
        axios_1.default.get(sitemapUrl)
            .then((response) => {
            if (response.status === 200) {
                if (response.data.indexOf('<?xml') === -1) {
                    console.error('\x1b[31m%s\x1b[0m', 'Error: Not a XML file.');
                }
                else {
                    const parser = new xml2js_1.default.Parser();
                    parser.parseString(response.data, (err, result) => {
                        for (const readUrl of result.urlset.url) {
                            fetchedUrls.push(readUrl.loc[0]);
                        }
                    });
                }
            }
            resolve(fetchedUrls);
        })
            .catch((error) => {
            if (error.response && error.response.status) {
                errorMessage += error.response.status;
                console.error('\x1b[31m%s\x1b[0m', errorMessage);
            }
            else {
                console.error(error);
            }
            resolve(fetchedUrls);
        });
    });
}
function fetchAllSitemaps(sitemapUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        const sitemapUrlsLists = [];
        const urlsList = [];
        let mergeLists = [];
        for (const sitemapUrl of sitemapUrls) {
            sitemapUrlsLists.push(fetchFromSitemap(sitemapUrl));
        }
        const allUrls = yield Promise.all(sitemapUrlsLists);
        for (const singleList of allUrls) {
            mergeLists = mergeLists.concat(singleList);
        }
        for (const singleUrl of mergeLists) {
            if (!urlsList.includes(singleUrl)) {
                urlsList.push(singleUrl);
            }
        }
        return urlsList;
    });
}
module.exports = fetchAllSitemaps;
