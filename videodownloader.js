var casper = require('casper').create({
	pageSettings: {
		webSecurityEnabled: false,
		resourceTimeout: 240000
	}
});

var vito = require('custom\\videodonwloader_prod.js');
var fs = require('fs');

var config = vito.getGlobalVariables();
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36 ';
var savePath = 'saved/';

casper.userAgent(userAgent);
casper.start();

var toBeDownloaded = [];

casper.then(function () {
	var topics = config.topics;
	for (var topicIndex = 0; topicIndex < topics.length; topicIndex++) {
		var topic = topics[topicIndex];
		var topicDirectory = savePath + topicIndex + '.' + topic.title;
		if (createDirectory(topicDirectory)) {
			var chapters = topic.chapters;
			for (var chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
				var chapter = chapters[chapterIndex];
				var chapterDirectory = topicDirectory + '/' + chapterIndex + '.' + chapter.title;
				if (createDirectory(chapterDirectory)) {
					var videos = chapter.videos;
					for (var videoIndex = 0; videoIndex < videos.length; videoIndex++) {
						var video = videos[videoIndex];
						var videoDirectory = chapterDirectory + '/' + videoIndex + '.' + video.title;
						if (createDirectory(videoDirectory)) {
							download(video.url, videoDirectory, video.numberOfParts, config.extension);
						}
					}
				}
			}
		}
	}
});

casper.then(function () {
	var targetFile = 'generatedcode.js';
	
	var fsImportString = "var fs = require('fs');";
	fs.write(targetFile, fsImportString, 'a');
	
	var importString = 'var casper = require(\'casper\').create({\n' +
		'\tpageSettings: {\n' +
		'\t\twebSecurityEnabled: false,\n' +
		'\t\tresourceTimeout: 240000\n' +
		'\t}\n' +
		'});\n';
	fs.write(targetFile, importString, 'a');

	var userAgentString = 'var userAgent = \'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36 \';\n';
	fs.write(targetFile, userAgentString, 'a');

	var setUserAgentString = 'casper.userAgent(userAgent);\n';
	fs.write(targetFile, setUserAgentString, 'a');

	var startString = 'casper.start();\n';
	fs.write(targetFile, startString, 'a');

	var safeDownloadString = 'var safeDownload = function(downloadPath, savePath){\n' + 
		'\tif (!fs.exists(savePath) || fs.size(savePath) == 0){\n' + 
		'\t\tcasper.download(downloadPath, savePath); \n' +
		'\t}\n' +
		'}\n';
	fs.write(targetFile, safeDownloadString, 'a');
	
	var arrayString = 'var toBeDownloaded =' + JSON.stringify(toBeDownloaded, null, '\t');
	fs.write(targetFile, arrayString + ';\n', 'a');

	for (var downloadIndex = 0; downloadIndex < toBeDownloaded.length; downloadIndex++) {
		var codeString =
			'casper.then(function() { this.echo("' + downloadIndex + '"); safeDownload(toBeDownloaded[' + downloadIndex + '].file, toBeDownloaded[' + downloadIndex + '].saveFile); });\n';
		fs.write(targetFile, codeString, 'a');
		casper.echo(toBeDownloaded.length - downloadIndex);
	}

	var runString = 'casper.run(function () {\n' +
		'\tthis.echo(\'Finished generating code file.\');\n' +
		'\tthis.exit();\n' +
		'});\n';
	fs.write(targetFile, runString, 'a');
});

casper.run(function () {
	this.echo('Finished generating code file.');
	this.exit();
});

function download(baseUrl, savePath, numberOfFiles, extension) {
	for (var fileIndex = 0; fileIndex < numberOfFiles; fileIndex++) {
		var tempFile = baseUrl + fileIndex + extension;
		var saveFile = savePath + '/' + fileIndex + extension;
		//casper.download(tempFile, saveFile);
		toBeDownloaded.push({
			file: tempFile,
			saveFile: saveFile
		});
		casper.echo(tempFile);
	}
}

function createDirectory(path) {
	if (fs.isDirectory(path)) {
		return true;
	}
	return fs.makeDirectory(path);
}