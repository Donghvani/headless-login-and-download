var casper = require('casper').create();
var vito = require('custom\\vito_prod.js');

var config = vito.getGlobalVariables();
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36 ';
var fileExtension = 'pdf';
var pdfSavePath = 'saved';
//var numberOfPdfBookPages = 672;
var numberOfPdfBookPages = 2;
var loginWaitMilliseconds = 7000;
var initialPageLoadMilliseconds = 3000;

casper.userAgent(userAgent);
casper.start(config.loginUrl);

casper.waitForSelector("form",
	function pass() {
		this.echo("Title: " + casper.getTitle());

		var success = function () {
			casper.echo("Title: " + casper.getTitle());
			var pdfUrls = getDownloadFileUrls(config.pdfFilebasePath, numberOfPdfBookPages, fileExtension);
			download(pdfUrls, pdfSavePath, fileExtension);
		};

		var error = function(){
			casper.echo("Did not load " + config.loggedInCheckElementSelector);
		};

		tryLogIn(success, error, loginWaitMilliseconds, config.loggedInCheckElementSelector);

	},
	function fail() {
		this.echo("Did not load login form");
	},
	initialPageLoadMilliseconds
);

casper.run();

/**
 * Try to login, CHECK fillSelectors before use
 * @param onSuccess function gets called if login succeeds
 * @param onError function gets called if login fails
 * @param waitMilliseconds time to wait after login form submit
 * @param elementSelectorOnLoggedIdHomePage html element selector,
 * 	login succeed if element exists on the page after form submit
 */
function tryLogIn(onSuccess, onError, waitMilliseconds, elementSelectorOnLoggedIdHomePage){
	casper.fillSelectors('form', {
		'input[name = username ]': config.username,
		'input[name = password ]': config.password,
	}, true);

	casper.waitForSelector(
		elementSelectorOnLoggedIdHomePage,
		function pass() {
			onSuccess();
		},
		function fail() {
			onError();
		},
		waitMilliseconds
	);
}

/**
 * Download files
 * @param urls, array of file urls which gets downloaded
 * @param path, local file path where downloaded files will be saved
 * @param extension, saved file extensions
 */
function download(urls, path, extension) {
	for (var pdfIndex = 0; pdfIndex < urls.length; pdfIndex++) {
		casper.download(urls[pdfIndex], path + '/' + pdfIndex + '.' + extension);
	}
}

/**
 * Get file urls for download
 * @param filebasePath, common name string for all files
 * @param numberOfPages, number of pages
 * @param extension, file extensions
 * @returns {Array}
 */
function getDownloadFileUrls(filebasePath, numberOfPages, extension) {
	var urls = [];
	for (var pageIndex = 1; pageIndex < numberOfPages + 1; pageIndex++) {
		var fileName = pageIndex;
		if (pageIndex < 10) {
			fileName = '0' + fileName;
		}
		urls.push(filebasePath + fileName + '.' + extension);
	}
	return urls;
}