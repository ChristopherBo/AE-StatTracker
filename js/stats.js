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
	statsFilePath = home + '/Documents/stats.txt';

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

	//block ae from using ALL keys while this window is active
	//keyRegisterOverride();

	// alert(path.slice(60, path.length));

	//can run a given function in aftereffects.jsx
	// interface.evalScript('testFunction()', function(res) {
	// 	//anon function to do whatever you want with the result from the test function
	// 	alert("anon func");
	// });

	//wait 2000 ms THEN run the stuff inside
	// setTimeout(function() {
	// 	//the stuff inside
	// }, 2000);

}());

//if checkbox not checked gray out/disable keybinds
var nodes;
function toggleBinds(e) {
	if(!$('custombinds-checkbox').checked) {
		// alert("unchecked");
		$('binds').style.color = 'grey';
		nodes = document.querySelectorAll("input[type=text]");
		for (var i=0; i<nodes.length; i++) {
			nodes[i].style.color = 'grey';
			nodes[i].setAttribute("readonly", "true");
		}
	} else {
		// alert("checked");
		$('binds').style.color = 'white';
		nodes = document.querySelectorAll("input[type=text]");
		for (var i=0; i<nodes.length; i++) {
			nodes[i].style.color = 'white';
			nodes[i].removeAttribute("readonly");
		}
	}
}

//listen for color theme changing
function changeTheme(e) {
	//alert(e.target.value);
	//change color of bgnd text boxes
	nodes = document.querySelectorAll("input[type=text]");
	for (var i=0; i<nodes.length; i++) {
		nodes[i].style.backgroundColor = e.target.value;
	}
	nodes = document.querySelectorAll("button");
	for (var i=0; i<nodes.length; i++) {
		nodes[i].style.backgroundColor = e.target.value;
	}

	nodes = document.getElementsByClassName('container');
	for (var i=0; i<nodes.length; i++) {
		//document.getElementsByClassName('container')[i].childNodes[3].style.backgroundColor = e.target.value;
		if(!document.getElementsByClassName('container')[i].childNodes[1].checked) {
			document.getElementsByClassName('container')[i].childNodes[3].style.backgroundColor = e.target.value;
		} else {
			document.getElementsByClassName('container')[i].childNodes[3].style.backgroundColor = "#D7D7D7";
		}
	}

	$('color-picker').style.backgroundColor = e.target.value;
}

//check if checkbox checked or unchecked to make sure its being the right color
function toggleCheckbox(e) {
	//alert(e.currentTarget.id + " " + e.currentTarget.checked);
	if(!e.currentTarget.checked) {
		e.currentTarget.parentNode.childNodes[3].style.backgroundColor = $('color-picker').value;
	} else {
		e.currentTarget.parentNode.childNodes[3].style.backgroundColor = "#D7D7D7";
	}
}


function statsClick() {
	//alert("stats click");
	interface.requestOpenExtension("com.ahr.stattracker.stats.panel");
}

function setupClick() {
	//alert("setting up...");
	interface.evalScript('setupEnv()', function(res) {
		//alert("res: " + res);
		$('status').innerText = res;
	});
}

function nextClick() {
	interface.evalScript('nextButton(' + $('renderqueue-checkbox').checked + ', ' + $('custombinds-checkbox').checked + ')', function(res) {
		//alert("res: " + res);
		$('status').innerText = res;
	});
}

function backClick() {
	interface.evalScript('backButton()', function(res) {
		//alert("res: " + res);
		$('status').innerText = res;
	});
}

function forwardClick() {
	interface.evalScript('forwardButton()', function(res) {
		//alert("res: " + res);
		$('status').innerText = res;
	});
}

function keyframeClick() {
	interface.evalScript('keyframeButton()', function(res) {
		//alert("res: " + res);
		$('status').innerText = res;
	});
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
				if(lines[i].split(",")[0] !== undefined) {
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
	});
}

//get the current pf name every 5 seconds
function getCurrentFilename() {
	interface.evalScript('getCurrentFilename()', function(res) {
		//alert("res: " + res);
		currentFilename = res;
	});
	setTimeout(getCurrentFilename, 5000);
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