"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function printProgress(progressList, totalList) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('Processing ' + progressList + ' of ' + totalList + ' ...	');
}
function httpList(urlsList, testElement, configOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const httpStatus = [];
        const testScript = require('./test-scripts/' + testElement);
        const totalUrls = urlsList.length;
        var combineResults = [];
        var currentProgress = 0;
        var maxLimit = 0;
        printProgress(currentProgress, totalUrls);
        for (const checkUrl of urlsList) {
            httpStatus.push(testScript(checkUrl, configOptions));
            currentProgress += 1;
            maxLimit += 1;
            printProgress(currentProgress, totalUrls);
            if (maxLimit === 10) {
                yield Promise.all(httpStatus);
                maxLimit = 0;
            }
        }
        const httpResults = yield Promise.all(httpStatus);
        for (const status of httpResults) {
            combineResults = Object.assign({}, combineResults, status);
        }
        return combineResults;
    });
}
module.exports = httpList;
