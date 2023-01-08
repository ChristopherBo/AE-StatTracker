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
	//save the theme into stats.txt
	//if it DNE add it; if it exists replace it
	var foundFile = false;
	fs.readFile(statsFilePath, (error, data) => {
		if(error) { throw error; }

		var lines = data.toString().split("\n");
		//find existing entry if exists
		for(var i=0; i < lines.length; i++) {
			if("hexcolor" == lines[i].split(",")[0]) {
				//it exists, replace it
				foundFile = true;
				fs.writeFile(statsFilePath, data.toString().replace(new RegExp(`\nhexcolor,.*`, 'g'), "\nhexcolor," + e.target.value), err => {
					if (err) { alert(err); return; }
				});
			}
		}

		//dne, add it
		if(foundFile == false) {
			fs.appendFile(statsFilePath, "hexcolor," + e.target.value + "\n", err => {
				if (err) { alert(err); return; }
			});
		}

		applyChangedColorTheme(e.target.value);
	});
}

//listen for color theme changing
function changeAltTheme(e) {
	//save the theme into stats.txt
	//if it DNE add it; if it exists replace it
	var foundAltColor = false;
	fs.readFile(statsFilePath, (error, data) => {
		if(error) { throw error; }

		var lines = data.toString().split("\n");
		//find existing entry if exists
		for(var i=0; i < lines.length; i++) {
			if("althexcolor" == lines[i].split(",")[0]) {
				//it exists, replace it
				foundAltColor = true;
				fs.writeFile(statsFilePath, data.toString().replace(new RegExp(`althexcolor,.*`, 'g'), "althexcolor," + e.target.value), err => {
					if (err) { alert(err); return; }
				});
			}
		}

		//dne, add it
		if(foundAltColor == false) {
			fs.appendFile(statsFilePath, "althexcolor," + e.target.value + "\n", err => {
				if (err) { alert(err); return; }
			});
		}

		applyChangedAltTheme(e.target.value);
	});
}

//listen for color theme changing
function changeTextTheme(e) {
	//alert("text")
	//save the theme into stats.txt
	//if it DNE add it; if it exists replace it
	var foundTextColor = false;
	fs.readFile(statsFilePath, (error, data) => {
		//alert("read");
		if(error) { throw error; }
		var lines = data.toString().split("\n");
		//find existing entry if exists
		for(var i=0; i < lines.length; i++) {
			//alert(lines[i]);
			if("texthexcolor" == lines[i].split(",")[0]) {
				//it exists, replace it
				//alert("true, " + lines[i]);
				foundTextColor = true;
				fs.writeFile(statsFilePath, data.toString().replace(new RegExp(`texthexcolor,.*`, 'g'), "texthexcolor," + e.target.value), err => {
					if (err) { alert(err); return; }
				});
			}
		}
		if(foundTextColor == false) {
			//alert("false, " + e.target.value);
			fs.appendFile(statsFilePath, "texthexcolor," + e.target.value + "\n", err => {
				if (err) { alert(err); return; }
			});
		}
		applyChangedTextTheme(e.target.value);
	});
}

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
			if("hexcolor" == lines[i].split(",")[0]) {
				color = lines[i].split(",")[1];
				//alert("hexcolor found: " + color);
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

//setup timer at start. make sure if pf was opened before we set timer to correct time
function setTimer() {
	//sleep(5000); //make sure timer actually gets setup first
	fs.readFile(statsFilePath, (error, data) => {
		if(error) {
			throw error;
		}
		var lines = data.toString().split("\n");
		var foundFile = false;
		//find existing entry
		for(var i=0; i < lines.length; i++) {
			//alert(lines[i].split(",")[0] + "," + currentFilename);
			if(currentFilename == lines[i].split(",")[0]) {
				foundFile = true;
				$('stopwatch').innerText = lines[i].split(",")[1];
				break;
			}
		}

		// //if not found create entry for it
		// if(foundFile == false && currentFilename !== null) {
		// 	$('stopwatch').innerText = "0:00:00";
		// 	fs.appendFile(statsFilePath, currentFilename + ",0:00:00\n", err => {
		// 		if (err) {
		// 		  alert(err);
		// 		  return;
		// 		}
		// 		//file written successfully
		// 	});
		// }
	});
	incrementTimer();
}
getCurrentFilename();

//only do stopwatch stuff if we're on the main page
try {
	if(document.getElementById('stats-button').innerText == 'Stats') {
		setTimeout(setTimer, 1000);
	}
} catch(e) {}

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

//increment the timer every second
function incrementTimestamp(time) {
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
	return res;
}

//save the timer to stats file
function saveTimer(timer) {
	//make sure file actually exists before saving data to it
	try {
		if (!fs.existsSync(statsFilePath)) {
			fs.open(statsFilePath, 'w', function (err, file) {
				if (err) throw err;
			});
		}
	} catch(err) {}

	//read existing files contents
	fs.readFile(statsFilePath, (error, data) => {
		if(error) { throw error; }

		var lines = data.toString().split("\n");
		var foundFile = false;
		//find existing entry
		for(var i=0; i < lines.length; i++) {
			//currentFilename = getCurrentFilename(); //ie script testing.aep
			if(currentFilename == lines[i].split(",")[0] && currentFilename !== null) {
				foundFile = true;
				var time = lines[i].split(",")[1];
				
				//if for some reason it's NaN:NaN:NaN kill everything and redo it
				if(time == "NaN:NaN:NaN") {
					$('stopwatch').innerText = "0:00:00";
					fs.writeFile(statsFilePath, data.toString().replace(new RegExp(`${currentFilename},.*`, 'g'), currentFilename + ",00:00:00"), err => {
						if (err) { alert(err); return; }
					});
				} else {
					//if current time isnt the time in the file + 1sec fallback to file time + 1sec
					var incrementedTime = incrementTimestamp(time); //current time in file + 1 sec
					if(timer != incrementedTime) {
						$('stopwatch').innerText = incrementedTime;
						timer = incrementedTime;
					}
					fs.writeFile(statsFilePath, data.toString().replace(new RegExp(`${currentFilename},.*`, 'g'), currentFilename + "," + timer), err => {
						if (err) { alert(err); return; }
					});
				}
			}
		}

		//if not found create entry for it
		if(foundFile == false && currentFilename !== null) {
			$('stopwatch').innerText = "0:00:00";
			fs.appendFile(statsFilePath, currentFilename + "," + timer + "\n", err => {
				if (err) { alert(err); return; }
			});
		}
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