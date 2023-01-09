const fs = require('fs'); //for file writing later
var statsFilePath = null;
var currentFilename = null;

//nice shortcut functions
function $(id) {
    return document.getElementById(id);
}

function $$(name, number) {
    return document.getElementsByTagName(name)[number];
}

var interface = new CSInterface();
(function () {
	var path, slash;
	path = location.href;
	if(getOS() == "MAC") {
		slash = "/";
		path = path.substring(0, path.length - 11);
	}
	if(getOS() == "WIN") {
		slash = "/";
		path = path.substring(8, path.length - 11);
	}

	//find and set statsfilepath
	var home = require("os").homedir();
	statsFilePath = home + '/stats.txt';
	try {
		if (!fs.existsSync(statsFilePath)) {
			fs.open(statsFilePath, 'w', function (err, file) {
				if (err) throw err;
			});
		}
	} catch(err) {}

	//get stats and fill in the table
	getCurrentFilename();
	setTimeout(readTimer, 1000);

	interface.evalScript('getNumberAdjustmentLayers()', function(res) {
		//alert("adj layers: " + res);
		$('adj-layers').innerText = res;
	});

	interface.evalScript('getNumberPrecomps()', function(res) {
		//alert("adj layers: " + res);
		$('precomp-layers').innerText = res;
	});

	interface.evalScript('getNumberLayers()', function(res) {
		//alert("adj layers: " + res);
		$('layers-total').innerText = res;
	});

	interface.evalScript('getNumberEffects()', function(res) {
		//alert("adj layers: " + res);
		$('effects-total').innerText = res;
	});

	interface.evalScript('getNumberKeyframes()', function(res) {
		//alert("adj layers: " + res);
		$('keyframes-total').innerText = res;
	});

	interface.evalScript('getFileTypeTotals()', function(res) {
		//alert("adj layers: " + res);
		res = res.replace(/[|]/, "").split(",");
		$('video-file-total').innerText = res[0];
		$('image-file-total').innerText = res[1];
		$('audio-file-total').innerText = res[2];
	});

	interface.evalScript('getNumberUnusedFiles()', function(res) {
		//alert("adj layers: " + res);
		$('unused-file-total').innerText = res;
	});

	interface.evalScript('getNumberFiles()', function(res) {
		//alert("adj layers: " + res);
		$('file-total').innerText = res;
	});

	interface.evalScript('getPopularEffect()', function(res) {
		//alert("adj layers: " + res);
		$('popular-effect').innerText = res;
	});

	interface.evalScript('getRenderTime()', function(res) {
		//alert("adj layers: " + res);
		$('render-time').innerText = res;
	});

	//get crash total
	interface.evalScript('getAppVersion()', function(res) {
		//alert("adj layers: " + res);
		var crashFilePath = home + '/AppData/Roaming/Adobe/After Effects/' + res + '/logs';
		//alert(crashFilePath);
		fs.readdir(crashFilePath, (err, files) => {
			//alert(files.length);
			$('crash-total').innerText = files.length;
		});
		
	});
}());

//when html opens check for changed theme; if changed go change it
function applyChangedTheme() {
	//go find the changed theme
	//read existing files contents
	var color = "";
	var altcolor = "";
	var textcolor = "";
	fs.readFile(statsFilePath, (error, data) => {
		if(error) { throw error; }

		var lines = data.toString().split("\n");
		//find existing entry if exists
		for(var i=0; i < lines.length; i++) {
			//alert("line: " + i + ": " + lines[i] + "\n" + lines[i].split(",")[0]);
			if("mainhexcolor" == lines[i].split(",")[0]) {
				color = lines[i].split(",")[1];
				//alert("mainhexcolor found: " + color);
			} else if("althexcolor" == lines[i].split(",")[0]) {
				altcolor = lines[i].split(",")[1];
				//alert("althexcolor found: " + altcolor);
			} else if("texthexcolor" == lines[i].split(",")[0]) {
				textcolor = lines[i].split(",")[1];
				//alert("texthexcolor found: " + textcolor);
			}
		}
		
		//change the proper stuff to change if color isnt null
		if(color != "") {
			//change color of things
			applyChangedColorTheme(color);
		}

		if(altcolor != "") {
			applyChangedAltTheme(altcolor);
		}

		if(textcolor != "") {
			applyChangedTextTheme(textcolor);
		}
	});
}
applyChangedTheme();

function applyChangedColorTheme(color) {
	document.body.style.backgroundColor = color;

	try {
		$('color-picker').style.backgroundColor = color;
		$('color-picker').value = color;
		$('color-picker').jscolor.fromString(color);

		$('color-picker-alt').style.backgroundColor = color;
		$('color-picker-text').style.backgroundColor = color;
	} catch(e) {}
}

function applyChangedAltTheme(altcolor) {
	try {
		var rows = document.getElementsByTagName('tr');
		for(var i=0; i<rows.length; i++) {
			// alert(getComputedStyle(rows[i]).backgroundColor);
			if(getComputedStyle(rows[i]).backgroundColor != 'rgba(0, 0, 0, 0)') {
				rows[i].style.backgroundColor = altcolor;
			}
		}
	} catch(e) {}

	try {
		var topnav = document.getElementsByTagName('a');
		for(var i=0; i<topnav.length; i++) {
			//alert(getComputedStyle(topnav[i]).backgroundColor);
			if(getComputedStyle(topnav[i]).backgroundColor != 'rgba(0, 0, 0, 0)') {
				topnav[i].style.backgroundColor = altcolor;
			}
		}
		$('color-picker-alt').jscolor.fromString(altcolor);
	} catch(e) {}

	try {
		var topnav = document.getElementsByTagName('hr');
		for(var i=0; i<topnav.length; i++) {
			//alert(getComputedStyle(topnav[i]).backgroundColor);
			topnav[i].style.borderColor = altcolor;
		}
		$('color-picker-alt').jscolor.fromString(altcolor);
	} catch(e) {}

	try {
		document.getElementById('stats-button').style.backgroundColor = altcolor;
	} catch(e) {}
}

function applyChangedTextTheme(textcolor) {
	document.body.style.color = textcolor;
	try {
		$('preferencesSection').style.color = textcolor;
		document.getElementsByTagName('p')[0].style.color = textcolor;
		$('color-picker').style.color = textcolor;
		$('color-picker-alt').style.color = textcolor;
		$('color-picker-text').style.color = textcolor;	

		$('color-picker-text').jscolor.fromString(textcolor);
	} catch(e) {}

	try {
		var textnodes = document.getElementsByTagName('td');
		for(var i=0; i < textnodes.length; i++) {
			textnodes[i].style.color = textcolor;
		}
	} catch(e) {}

	try {
		var topp = document.getElementsByTagName('a');
		for(var i=0; i < topp.length; i++) {
			topp[i].style.color = textcolor;
		}
	} catch(e) {}

	try {
		document.getElementById('stats-button').style.color = textcolor;
	} catch(e) {}
}

function getOS() {
	var userAgent = window.navigator.userAgent,
	platform = window.navigator.platform,
	macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
	windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
	os = null;

	if(macosPlatforms.indexOf(platform) != -1) {
		os = "MAC";
	} else if(windowsPlatforms.indexOf(platform) != -1) {
		os = "WIN";
	}
	return os;
}

//read timer
function readTimer() {
	//sleep(5000); //make sure timer actually gets setup first
	fs.readFile(statsFilePath, (error, data) => {
		if(error) {
			throw error;
		}
		var lines = data.toString().split("\n");
		var total = "00:00:00";
		//find existing entry
		for(var i=0; i < lines.length; i++) {
			if(lines[i] != "") {
				if(lines[i].split(",")[0] !== undefined && lines[i].split(",")[0] != "mainhexcolor" && lines[i].split(",")[0] != "althexcolor"&& lines[i].split(",")[0] != "texthexcolor") {
					//alert(lines[i].split(",")[0] + "," + currentFilename);
					if(currentFilename == lines[i].split(",")[0]) {
						$('time-currentPF').innerText = lines[i].split(",")[1];
					}
					//alert("adding " + lines[i].split(",")[1] + " to total");
					total = addTimestamps(total, lines[i].split(",")[1]);
					//alert("total: " + total);
				}
			}
		}

		$('time-total').innerText = total;
		setTimeout(readTimer, 1000);
	});
}

//get the current pf name every 5 seconds
function getCurrentFilename() {
	interface.evalScript('getCurrentFilename()', function(res) {
		//alert("res: " + res);
		if(currentFilename != res) {
			//do regex matching- if it has auto-save 4, copy, etc at the end remove that
			//remove aep too
			res = res.replace(".aep", "");
			res = res.replace(/ \d+$/, "");
			res = res.replace(" auto-save", "");
			res = res.replace(" copy", "");
			currentFilename = res;
		}
	});
	setTimeout(getCurrentFilename, 1000);
}

//add two timecode times
function addTimestamps(time1, time2) {
	if(time1 == "00:00:00") {
		return time2;
	}
	//break down timestamps
	var tokens1 = time1.split(":");
	var hours1 = parseInt(tokens1[0]);
	var minutes1 = parseInt(tokens1[1]);
	var seconds1 = parseInt(tokens1[2]);

	var tokens2 = time2.split(":");
	var hours2 = parseInt(tokens2[0]);
	var minutes2 = parseInt(tokens2[1]);
	var seconds2 = parseInt(tokens2[2]);

	var hours = 0;
	var minutes = 0;
	var seconds = 0;

	//increment
	seconds = seconds1 + seconds2;
	if(seconds >= 60) {
		seconds -= 60; minutes++;
	}
	minutes += minutes1 + minutes2;
	if(minutes >= 60) {
		minutes -= 60; hours++;
	}
	hours += hours1 + hours2;

	//fit to string formatting
	if(seconds < 10) {
		seconds = '0' + seconds.toString();
	}
	if(minutes < 10) {
		minutes = '0' + minutes.toString();
	}
	
	//return
	var res = hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();
	return res;
}