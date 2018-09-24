var casper = require('casper').create();
//var vito = require('custom\\vito_prod.js');
//var fs = require('fs');

//var config = vito.getGlobalVariables();
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36 ';
//var fileExtension = 'pdf';
//var pdfSavePath = 'saved';
//var numberOfPdfBookPages = 672;
//var numberOfPdfBookPages = 2;
var loginWaitMilliseconds = 8000;
var initialPageLoadMilliseconds = 3000;

casper.userAgent(userAgent);
var startUrl = "https://www.scribd.com/login";
var sampleBook = "https://www.scribd.com/read/380705041/Spymaster-A-Thriller";
casper.start(startUrl);

var pageLoadedSelector = ".google_btn_label";
casper.waitForSelector(pageLoadedSelector,
	function pass() {
		this.echo("Title: " + casper.getTitle());
		
		var success = function () {
			casper.echo("log in succeed");
			loadBook(sampleBook, 8000);
		};

		var error = function(){
			casper.echo("Did not load ");
		};

		tryLogIn(success, error, loginWaitMilliseconds, '.nav_title');
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
		'input[name = login_or_email ]': "test-204607",
		'input[name = login_password ]': "test173ccnt",
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

function loadBook(bookUrl, waitMilliseconds){
	casper.then(function() {
		casper.thenOpen(bookUrl, function() {
			console.log('lets view book: ', bookUrl);
			casper.waitForSelector(
				"#reader_columns",
				function pass() {
					console.log("book loaded");
					get2Pages();
				},
				function fail() {
					console.log("book not loaded");
				},
				waitMilliseconds
			);
		});
	});
}

function get2Pages(){
	/*var twoPages = casper.evaluate(function() {
		return document.querySelector("#column_container").innerHTML;
	});*/
	
	casper.waitFor(function() {
		return this.evaluate(function() {    
			var images = document.getElementsByTagName('img');
			console.log(images.length);
			return Array.prototype.every.call(images, function(i) { 
				console.log("complete");
				return i.complete; 
			});
		});
	}, function then(){
		casper.capture('screenshots/test.png');
	}, null, 30000);
	
	/*
	casper.waitFor(function() {
		return this.evaluate(function() {
			return window.imagesNotLoaded == 0;
		});
	}, function then(){
		casper.capture('screenshots/test.png');
	}, null, 30000);*/
}

/*
casper.evaluate(function() {
    var images = document.getElementsByTagName('img');
    images = Array.prototype.filter.call(images, function(i) { return !i.complete; });
    window.imagesNotLoaded = images.length;
	console.log("images to load", window.imagesNotLoaded);
    Array.prototype.forEach.call(images, function(i) {
        i.onload = function() { 			
			window.imagesNotLoaded--; 
			console.log("images to load:", window.imagesNotLoaded);
		};
    });
});*/