/**
 * Show Progress of HTTP Status.
 *
 * @param int progressStatus Currently Processing URL(s).
 * @param int totalList Total URL(s) needs to be processed.
 */
function printProgress (progressList, totalList) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write('Processing ' + progressList + ' of ' + totalList + ' ...	');
}

/**
 * List down all the URLs/elements as per test result.
 *
 * @param array  urlsList List of URLs.
 * @param string testElement Name of the test.
 * @param object configOptions config options for Axios like HTTP Auth etc.
 *
 * @returns array Result of each requested with its status code etc.
 */
async function httpList (urlsList: string[], testElement: string, configOptions: {}) {
  const httpStatus = [];
  // Include the test file.
  const testScript = require('./test-scripts/' + testElement);
  const totalUrls = urlsList.length;

  var combineResults: string[] = [];
  var currentProgress = 0;
  var maxLimit = 0;

  printProgress(currentProgress, totalUrls);
  for (const checkUrl of urlsList) {
    httpStatus.push(testScript(checkUrl, configOptions));
    currentProgress += 1;
    maxLimit += 1;

    printProgress(currentProgress, totalUrls);

    // Resolve previous promises before pushing more.
    if (maxLimit === 10) {
      await Promise.all(httpStatus);
      maxLimit = 0;
    }
  }

  const httpResults = await Promise.all(httpStatus);
  for (const status of httpResults) {
    combineResults = Object.assign({}, combineResults, status);
  }

  return combineResults;
}

module.exports = httpList;
