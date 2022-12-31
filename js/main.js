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

// function goIntoJSX() {
	
// 	}

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

//increment the timer every second
function incrementTimer() {
	//get stuff from html
	var time = $('stopwatch').innerText;
	var tokens = time.split(":");
	var hours = parseInt(tokens[0]);
	var minutes = parseInt(tokens[1]);
	var seconds = parseInt(tokens[2]);

	//increment
	seconds++;
	if(seconds >= 60) {
		seconds -= 60; minutes++;
	}
	if(minutes >= 60) {
		minutes -= 60; hours++;
	}

	//fit to string formatting
	if(seconds < 10) {
		seconds = '0' + seconds.toString();
	}
	if(minutes < 10) {
		minutes = '0' + minutes.toString();
	}
	
	//return
	var res = hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();
	$('stopwatch').innerText = res;
	saveTimer(res);
	setTimeout(incrementTimer, 1000);
}

function saveTimer(timer) {
	//read existing files contents
	fs.readFile(statsFilePath, (error, data) => {
		if(error) {
			throw error;
		}
		var lines = data.toString().split("\n");
		var foundFile = false;
		//find existing entry
		for(var i=0; i < lines.length; i++) {
			//currentFilename = getCurrentFilename(); //ie script testing.aep
			if(currentFilename == lines[i].split(",")[0] && currentFilename !== null) {
				foundFile = true;
				// alert(data.toString().replace(new RegExp(`${currentFilename},.*`, 'g'), "gaming"));
				// sleep(2000);
				fs.writeFile(statsFilePath, data.toString().replace(new RegExp(`${currentFilename},.*`, 'g'), currentFilename + "," + timer), err => {
					if (err) {
					  alert(err);
					  return;
					}
					//file written successfully
				});
			}
		}

		if(foundFile == false && currentFilename !== null) {
			//if not found create entry for it
			fs.appendFile(statsFilePath, currentFilename + "," + timer + "\n", err => {
				if (err) {
				  alert(err);
				  return;
				}
				//file written successfully
			});
		}
	});
	//document.location.pathname.replaceAll("%20", " ").replace("index.html", "stats.txt")
}
incrementTimer();

//get the current pf name every 5 seconds
getCurrentFilename();
function getCurrentFilename() {
	interface.evalScript('getCurrentFilename()', function(res) {
		//alert("res: " + res);
		currentFilename = res;
	});
	setTimeout(getCurrentFilename, 5000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}