"object" != typeof JSON && (JSON = {}), function () { "use strict"; var rx_one = /^[\],:{}\s]*$/, rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rx_four = /(?:^|:|,)(?:\s*\[)+/g, rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta, rep; function f(t) { return t < 10 ? "0" + t : t } function this_value() { return this.valueOf() } function quote(t) { return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function (t) { var e = meta[t]; return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' } function str(t, e) { var r, n, o, u, f, a = gap, i = e[t]; switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)), "function" == typeof rep && (i = rep.call(e, t, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, f = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (u = i.length, r = 0; r < u; r += 1)f[r] = str(r, i) || "null"; return o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]", gap = a, o } if (rep && "object" == typeof rep) for (u = rep.length, r = 0; r < u; r += 1)"string" == typeof rep[r] && (o = str(n = rep[r], i)) && f.push(quote(n) + (gap ? ": " : ":") + o); else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i)) && f.push(quote(n) + (gap ? ": " : ":") + o); return o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}", gap = a, o } } "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, JSON.stringify = function (t, e, r) { var n; if (indent = gap = "", "number" == typeof r) for (n = 0; n < r; n += 1)indent += " "; else "string" == typeof r && (indent = r); if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify"); return str("", { "": t }) }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) { var j; function walk(t, e) { var r, n, o = t[e]; if (o && "object" == typeof o) for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (void 0 !== (n = walk(o, r)) ? o[r] = n : delete o[r]); return reviver.call(t, e, o) } if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (t) { return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse") }) }();

function getLayerNames(arg) {
    var layerNames = [];
    var comp = app.project.activeItem;
    for (var i = 1; i <= comp.numLayers; i++) {
        layerNames.push(comp.layer(i).name);
    }

    return JSON.stringify(layerNames);
}

function osCheck() {
    var os = $.os;
    var match = os.indexOf("Windows");
    if (match != (-1)) {
        var userOS = "PC";
    } else {
        var userOS = "MAC";
    }
    return userOS;
}

//Does basic checks to make sure a given button can be clicked.
function checks() {
    //base checks before starting
    // if(debug.value) { writeToDebugFile("Making sure there's an active project...\n"); }
    // Check that a project exists
    if (app.project === null) {
        alert("Project does not exist!");
        return "Project does not exist!";
    }

    // if(debug.value) { writeToDebugFile("Making sure there's an active comp...\n"); }
    // Check that an active comp exists
    // if (app.project.activeItem === null) {
    //     alert("There is no active comp!");
    //     return "There is no active comp!";
    // }

    return true;
}


function getCurrentFilename() {
    //base checks before starting
    var baseChecks = checks();
    if(baseChecks != true) {
        return false;
    }
    //if for some reason this isn't saved we should save it with untitled
    if(app.project.file == null) {
        return "untitled";
    }
    //alert(new File($.fileName).name);
    return File.decode(app.project.file.name);
}

//finds # of adj layers used
function getNumberAdjustmentLayers() {
    var res = 0;
    var items = app.project.items;
    for(var i=1; i < items.length+1; i++) {
        if(items[i] instanceof CompItem) {
            //alert("found comp " + items[i].name);
            var comp = items[i];
            for(var j=1; j < comp.layers.length+1; j++) {
                if(comp.layers[j].adjustmentLayer) {
                    res++;
                    //alert("res: " + res);
                }
            }
        }
    }
    //alert("adj layerss: " + res);
    return res;
}

//finds # of precomps used
function getNumberPrecomps() {
    var res = 0;
    var items = app.project.items;
    for(var i=1; i < items.length+1; i++) {
        if(items[i] instanceof CompItem) {
            //alert("found comp " + items[i].name);
            var comp = items[i];
            for(var j=1; j < comp.layers.length+1; j++) {
                if(comp.layers[j].source instanceof CompItem) {
                    res++;
                    //alert("res: " + res);
                }
            }
        }
    }
    //alert("adj layerss: " + res);
    return res;
}

//finds # of layers used
function getNumberLayers() {
    var res = 0;
    var items = app.project.items;
    for(var i=1; i < items.length+1; i++) {
        if(items[i] instanceof CompItem) {
            //alert("found comp " + items[i].name);
            var comp = items[i];
            res += comp.layers.length;
        }
    }
    //alert("adj layerss: " + res);
    return res;
}

//finds # of layers used
function getNumberEffects() {
    var res = 0;
    var items = app.project.items;
    for(var i=1; i < items.length+1; i++) {
        if(items[i] instanceof CompItem) {
            //alert("found comp " + items[i].name);
            var comp = items[i];
            for(var j=1; j < comp.layers.length+1; j++) {
                try { 
                    res += comp.layers[j].effect.numProperties;
                } catch (e) {
                    //do nothing
                }
            }
        }
    }
    //alert("adj layerss: " + res);
    return res;
}

//finds # of layers used
function getNumberKeyframes() {
    var res = 0;
    var items = app.project.items;
    for(var i=1; i < items.length+1; i++) {
        if(items[i] instanceof CompItem) {
            //alert("found comp " + items[i].name);
            var comp = items[i];
            //iterate over all layers
            for(var j=1; j < comp.layers.length+1; j++) {
                //all fx on layer
                //can't iterate over fx on a layer so we have to try indices until it breaks
                var fx = true;
                var l=1;
                //iterate over all fx on layer
                while(fx) {
                    try {
                        var effect = comp.layer(j).Effects(l);
                        var effects = true;
                        var m=1;
                        //iterate over all props in the effect
                        while(effects) {
                            try {
                                if(effect.property(m).numKeys != undefined && effect.property(m).numKeys != null) {
                                    res += effect.property(m).numKeys;
                                }
                                m++;
                            } catch(error) {
                                effects = false;
                            }
                            //iterate over any subgroups in the effect
                            if(effect.property(m) instanceof PropertyGroup) {
                                var subEffect = effect.property(m);
                                var subfx = true;
                                var k=1;
                                while(subfx) {
                                    try {
                                        if(subEffect.property(k).numKeys != undefined && subEffect.property(k).numKeys != null) {
                                            res += subEffect.property(k).numKeys;
                                        }
                                        k++;
                                    } catch (error) {
                                        subfx = false;
                                    }
                                }
                            }
                        }
                        l++;
                    } catch(error) {
                        fx = false; //leave while loop
                    }
                }
            }

            //iterate over all layers again
            for(var j=1; j < comp.layers.length+1; j++) {
                //can't iterate over props on a layer so we have to try indices until it breaks
                var fx = true;
                var l=1;
                //iterate over all properties on layer
                while(fx) {
                    try {
                        var prop = comp.layer(j).property(l);
                        var props = true;
                        //add
                        try {
                            if(prop.numKeys != undefined && prop.numKeys != null) {
                                res += prop.numKeys;
                            }
                        } catch(error) {
                            props = false;
                        }
                        //iterate over any subgroups in the prop ie transform
                        if(prop instanceof PropertyGroup && prop.name != "Effects" && prop.numProperties != 0) {
                            var subProp = prop;
                            var subfx = true;
                            var k=1;
                            while(subfx) {
                                try {
                                    if(subProp.property(k).numKeys != undefined && subProp.property(k).numKeys != null) {
                                        res += subProp.property(k).numKeys;
                                    }
                                } catch (error) {
                                    subfx = false;
                                }
                                //iterate over any subsubgroups in the prop ie transform
                                if(subProp.property(k) instanceof PropertyGroup && subProp.property(k).name != "Effects" && subProp.property(k).numProperties != 0) {
                                    var subsubProp = subProp.property(k);
                                    var subsubfx = true;
                                    var m=1;
                                    while(subsubfx) {
                                        try {
                                            if(subsubProp.property(m).numKeys != undefined && subsubProp.property(m).numKeys != null) {
                                                res += subsubProp.property(m).numKeys;
                                            }
                                        } catch (error) {
                                            subsubfx = false;
                                        }
                                        m++;
                                    }
                                }
                                k++;
                            }
                        }
                        l++;
                    } catch(error) {
                        fx = false; //leave while loop
                    }
                }
            }
            //alert(comp.name + "\nkfs: " + res);
        }
    }
    //alert("kfs total: " + res);
    return res;
}

//finds # of files in project
function getNumberUnusedFiles() {
    var files = [];
    var items = app.project.items;
    //get a list of all files in pf
    for(var i=1; i < items.length+1; i++) {
        if(items[i] instanceof FootageItem) {
            files.push(items[i]);
        }
    }

    //if a file appears in a comp, remove it from list
    for(var i=1; i < items.length+1; i++) {
        if(items[i] instanceof CompItem) {
            //alert("found comp " + items[i].name);
            var comp = items[i];
            for(var j=1; j < comp.layers.length+1; j++) {
                if(new RegExp(files.join("|")).test(comp.layers[j].source)) {
                    files.splice(comp.layers[j].source, 1);
                }
            }
        }
    }
    //alert("file length: " + files.length);
    return files.length;
}

//finds # of each file in proj
//res[0] = video file total
//   [1] = image file total
//   [2] = audio file total
function getFileTypeTotals() {
    var res = [0, 0, 0];
    var items = app.project.items;
    //get a list of all files in pf
    for(var i=1; i < items.length+1; i++) {
        //make sure its a real file
        if(items[i] instanceof FootageItem) {
            if(items[i].mainSource instanceof FileSource) {
                //check if each type
                if(items[i].duration == 0) { //image
                    res[1]++;
                } else if(items[i].hasVideo) { //video
                    res[0]++;
                } else if(items[i].hasAudio) { //audio
                    res[2]++;
                }
            }
        }
    }

    return res;
}

//finds # of files in project
function getNumberFiles() {
    var res = 0;
    var items = app.project.items;
    for(var i=1; i < items.length+1; i++) {
        if(items[i] instanceof FootageItem) {
            res++;
        }
    }
    //alert("adj layerss: " + res);
    return res;
}

//finds most used effect in project file
function getPopularEffect() {
    var res = 0;
    var resName = "";
    var resCount = 0;
    var fxDict = {};
    var items = app.project.items;
    for(var i=1; i < items.length+1; i++) {
        if(items[i] instanceof CompItem) {
            //alert("found comp " + items[i].name);
            var comp = items[i];
            //iterate over all layers
            for(var j=1; j < comp.layers.length+1; j++) {
                //all fx on layer
                //can't iterate over fx on a layer so we have to try indices until it breaks
                var fx = true;
                var l=1;
                //iterate over all fx on layer
                while(fx) {
                    try {
                        var effect = comp.layer(j).Effects(l);
                        if(effect.matchName != "Channel Info") {
                            //if exists bump it
                            if(fxDict[effect.matchName] != undefined || fxDict[effect.matchName] != null) {
                                fxDict[effect.matchName]++;
                            } else {
                                fxDict[effect.matchName] = 1;
                            }
                            if(res == 0 || fxDict[effect.matchName] > fxDict[res]) {
                                res = effect.matchName;
                                resName = effect.name;
                                resCount = fxDict[res];
                            }
                        }
                        l++;
                    } catch(error) {
                        fx = false; //leave while loop
                    }
                }
            }
        }
    }
    //truncate any numbers from the end from duplicating fx
    resName = resName.replace(/ \d+$/, "");
    //alert("effect: " + res + ": " + fxDict[res]);
    if(resCount == 0) {
        return "N/A";
    }
    return resName + ", " + resCount;
}

//finds most used effect in project file
function getRenderTime() {
    var res = 0;
    var items = app.project.renderQueue.items;
    for(var i=1; i < items.length+1; i++) {
        res += items[i].elapsedSeconds;
    }
    //convert to hh:mm:ss
    var sec = parseInt(res, 10); 
    var hours = Math.floor(sec / 3600); 
    var minutes = Math.floor((sec - hours * 3600) / 60); 
    var seconds = sec - hours * 3600 - minutes * 60;
    if (hours < 10) {      hours = '0' + hours;    }
    if (minutes < 10) {      minutes = '0' + minutes;    }
    if (seconds < 10) {      seconds = '0' + seconds;    }
    if (hours == 0) {
      res = "0:" + minutes + ':' + seconds; // Return in MM:SS format
    } else {
      res = hours + ':' + minutes + ':' + seconds; // Return in HH:MM:SS format
    }
    //alert("effect: " + res + ": " + fxDict[res]);
    return res;
}

function getAppVersion() {
    return app.version.substring(0,4);
}