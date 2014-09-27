var casper = require('casper').create({
	verbose: false,
	logLevel: "info"
});

var utils = require('utils');

var url = 'http://google.com',
	resultIndex = -1,
	pageCounter = 1;
	// imgCounter = 0;

// set up variables
var target = getHost(casper.cli.get("target")),
	searchQuery = casper.cli.get("query").split("-").join(" ");

var UAStrings = [
	// 'Mozilla/5.0 (Linux; android 4.2.2; en-us; SAMSUNG SCH-I545 Build/JDQ39) ApplKit/535.19 (KHTML, like Gecko)',
	// 'Mozilla/5.0 (Linux; Android 4.2.2; SCH-I545 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.166 Mobile Safari/537.36',
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:30.0) Gecko/20100101 Firefox/30.0',
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.77.4 (KHTML, like Gecko) Version/7.0.5 Safari/537.77.4',
	'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36',
	'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.67 Safari/537.36',
	'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0',
	// 'Mozilla/5.0 (X11; OpenBSD amd64; rv:28.0) Gecko/20100101 Firefox/28.0',
	// 'Mozilla/5.0 (X11; Linux x86_64; rv:28.0) Gecko/20100101 Firefox/28.0',
	'Mozilla/5.0 (Windows NT 6.1; rv:27.3) Gecko/20130101 Firefox/27.3',
	'Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:27.0) Gecko/20121011 Firefox/27.0',
	'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
	'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)'
	// 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
	// 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A4449d Safari/9537.53',
	// 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
	// 'Mozilla/5.0 (iPad; CPU OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A501 Safari/9537.53',
	// 'Mozilla/5.0 (Android; Tablet; rv:14.0) Gecko/14.0 Firefox/14.0',
	// 'Mozilla/5.0 (Android; Mobile; rv:14.0) Gecko/14.0 Firefox/14.0'
	// 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
	// 'Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
	// 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
	// 'Mozilla/5.0 (Linux; Android 4.1.2; Nexus 7 Build/JZ054K) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19'
]; 

// set bot user agent string
var UANumber = randomIntFromInterval(1, UAStrings.length);
casper.echo(UAStrings[UANumber]);
casper.userAgent(UAStrings[UANumber]);


casper.on('error', function(msg, backtrace) {
	this.evaluate(function(msg) {
		var oReq = new XMLHttpRequest();
		oReq.open("get", 'http://104.131.214.240:3000/error/' + msg, true);
		oReq.send(null);
		this.die(msg);
	}, msg);	
});

casper.on('event', function(msg, backtrace) {
	this.evaluate(function(msg) {
		var oReq = new XMLHttpRequest();
		oReq.open("get", 'http://104.131.214.240:3000/event/' + msg, true);
		oReq.send(null);
		this.echo(oReq.responseText);
	}, msg);	

});


// Connect to Google
var startTime = 0;
casper.start(url, function(res) {
	if (res.status !== 200) {
		this.die('Failed to connect to: ' + url);
	} else if (res.status === 200) {
		this.echo('Connected to: ' + res.url);
		startTime = new Date();
	}
});


// Enter search query
casper.then(function typeQuery() {

	// this.emit('event', 'Searching Google for target: ' + target + ' with query: ' + searchQuery);

	// wait before entering query
	var waitTime = randomIntFromInterval(1, 5) * 1000;
	this.wait(waitTime, function() {
		// start search query
	    this.sendKeys('form[action="/search"]', searchQuery);
	});
});

// Submit search query
casper.then(function submitQuery() {
	// if results didn't auto populate
	if (!this.exists('h3.r a')) {

		// submit search query by any means possible
		if (this.exists('#gbqfba')) {
			this.click('#gbqfba');
		} else if (this.exists('#gbqfb')) {
			this.click('#gbqfb');
		} else {
			var evt = document.createEvent('KeyboardEvent');
		    evt.initKeyboardEvent('keypress', true, true, window, 0, 0, 0, 0, 0, 13);
		    document.dispatchEvent(evt);
		}
	} 
});

// Look for target on SERPS
casper.then(function parseResults() {
	// how long are we scanning this results page (between 1 and 20 seconds)
	var waitTime = randomIntFromInterval(5, 30) * 1000;
	casper.emit('event', 'Scanning page ' + pageCounter + ' for: ' + waitTime / 1000  + ' seconds.')
	
	this.wait(waitTime, function() {

		// still no results??? die!
		if (!this.exists('h3.r a')) {
			this.capture('captures/noresults.png');
			this.die("Couldn't get search results");
		}

		// evaluate results and look for our target page
		var results = this.evaluate(searchResults);
		results.forEach(function(result, index) {
			
			// if we find our target store the index
			result = getHost(result.url);
			if (result == target) {
				resultIndex = index + 1;
			}

		}, this);

		// take snapshot of serps for debugging
		// this.capture('captures/goresults' + imgCounter + '.png');
		// imgCounter++;

		if (resultIndex < 0) {

			if (fityFity()) {
				var randomResult = randomIntFromInterval(1, results.length);
				this.thenClick('#rso li:nth-of-type(' + randomResult + ') h3.r a', function() {
					casper.emit('event', 'Clicked random result')
				});
				var quickFast = randomIntFromInterval(3, 20) * 1000;
				this.wait(quickFast, function() {
					casper.emit('event', 'Going back to SERP');
					this.back();
				});
			}

			if(!this.exists('#pnnext')) {
				this.emit('error', "Reached end of search results with 0 matches.");
				this.die("Reached end of search results with 0 matches.")
			}

			this.wait(2500, function() {
				pageCounter++;
				this.thenClick('#pnnext', parseResults);
			});
		}
	});

});


// Click link for target page
casper.then(function clickTarget() {
	var waitTime = randomIntFromInterval(1, 5) * 1000;
	this.wait(waitTime, function() {	

		this.emit('event', 'Found target. Clicking link...');
		
		var selectorString = '#rso li:nth-of-type(' + resultIndex + ') h3.r a';
		this.click(selectorString);
	});
});


// Browse around target website
casper.then(function navigatePage() {

	var waitTime = randomIntFromInterval(55, 140) * 1000;
	
	this.wait(2000, function() {
		this.emit('event', 'Browsing page for: ' + waitTime / 1000 + ' seconds');
	});

	this.wait(waitTime, function() {

		var nextPage = randomIntFromInterval(1, 16);
		if (nextPage % 4 !== 0) {
			var scrollDistance = randomIntFromInterval (200, 800);
			this.scrollTo(scrollDistance, scrollDistance);

			var selectorString = 'a:nth-of-type(' + nextPage + ')';
			if (this.exists(selectorString)) {
				casper.emit('event', 'Clicking another link');
				this.thenClick(selectorString, navigatePage);
			}
		}
	});
});


casper.then(function finishedRun() {
	var endTime = new Date();
	var diff = endTime - startTime;

	casper.emit('event', 'Run has completed in: ' + Math.floor(diff / 1000) + ' seconds');

	this.wait(2000, function() {
		casper.emit('event', 'Waiting for next run to start...');
	});
});


casper.run();


// Script functions
function searchResults() {
	var results = document.querySelectorAll('h3.r a');
	return Array.prototype.map.call(results, function(e) {
		return {
			url: e.href,
			text: e.textContent,
			html: e.innerHTML
		}
	});
}

function pageLinks() {
	var links = document.querySelectorAll('a');
	return Array.prototype.map.call(links, function(e) {
		return {
			url: e.href,
			text: e.textContent,
			html: e.innerHTML
		}
	});
}


// Utility functions
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getHost(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.host.replace("www.", "");
}

function fityFity() {
	var num = Math.floor(Math.random()*(2-1+1)+1)
	if (num === 2) {
		return true;
	} else return false;
}