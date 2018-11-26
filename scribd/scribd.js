var casper = require("casper").create();
var page = require('webpage').create();
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36 ';
var loginWaitMilliseconds = 8000;
var initialPageLoadMilliseconds = 3000;
var pageNumber = 0;
var rightArrow = 'a.right_arrow';
var pageLoadedSelector = ".google_btn_label";

casper.userAgent(userAgent);
var startUrl = "https://www.scribd.com/login";
var sampleBook = "https://www.scribd.com/read/380705041/Spymaster-A-Thriller";
casper.start(startUrl);

casper.page.paperSize = {
  width: '11in',
  height: '8.5in',
  orientation: 'landscape',
  border: '0.4in'
};

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
		casper.then(function(){
			casper.wait(5000, function(){
				casper.capture('screenshots/page1.png');
			});
		});
		
		casper.waitForSelector(
			rightArrow,
			function pass() {
				screenShotNextPage();
				screenShotNextPage();
				screenShotNextPage();
				screenShotNextPage();
			},
			function fail() {
				console.log("Failed right button click");
			},
			8000
		);
		
	}, null, 30000);
}

function screenShotNextPage(){
	casper.click(rightArrow);				
	casper.then(function(){
		casper.wait(5000, function(){
			pageNumber++;
			//casper.capture('screenshots/'+ pageNumber +'.png');
			//casper.capture('screenshots/'+ pageNumber +'.pdf');
			page.render('screenshots/'+ pageNumber +'.png');
		});
	});	
}