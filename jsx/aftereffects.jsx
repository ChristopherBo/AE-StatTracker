"object" != typeof JSON && (JSON = {}), function () { "use strict"; var rx_one = /^[\],:{}\s]*$/, rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rx_four = /(?:^|:|,)(?:\s*\[)+/g, rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta, rep; function f(t) { return t < 10 ? "0" + t : t } function this_value() { return this.valueOf() } function quote(t) { return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function (t) { var e = meta[t]; return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' } function str(t, e) { var r, n, o, u, f, a = gap, i = e[t]; switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)), "function" == typeof rep && (i = rep.call(e, t, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, f = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (u = i.length, r = 0; r < u; r += 1)f[r] = str(r, i) || "null"; return o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]", gap = a, o } if (rep && "object" == typeof rep) for (u = rep.length, r = 0; r < u; r += 1)"string" == typeof rep[r] && (o = str(n = rep[r], i)) && f.push(quote(n) + (gap ? ": " : ":") + o); else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i)) && f.push(quote(n) + (gap ? ": " : ":") + o); return o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}", gap = a, o } } "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, JSON.stringify = function (t, e, r) { var n; if (indent = gap = "", "number" == typeof r) for (n = 0; n < r; n += 1)indent += " "; else "string" == typeof r && (indent = r); if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify"); return str("", { "": t }) }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) { var j; function walk(t, e) { var r, n, o = t[e]; if (o && "object" == typeof o) for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (void 0 !== (n = walk(o, r)) ? o[r] = n : delete o[r]); return reviver.call(t, e, o) } if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (t) { return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse") }) }();
var twixFolder = null;
var twixtored = [];

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

function setupEnv() {
    //alert("in jsx");

    //base checks before starting
    var baseChecks = checks();
    if(baseChecks != true) {
        return baseChecks;
    }

    // if(debug.value) { writeToDebugFile("Starting...\n"); }
    app.beginUndoGroup("Twixtor Assistor Setup");

    //do stuff here

    app.endUndoGroup();

    return "Setup Complete!";
}

//checks if Twixtor is installed
function checkForTwixtor(){
    var effects = app.effects;
    for (var i = 0; i < effects.length; i++){
        if (effects[i].displayName == "Twixtor Pro") {
            return true;
        }
    }
    return false;
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
    if (app.project.activeItem === null) {
        alert("There is no active comp!");
        return "There is no active comp!";
    }

    return true;
}


function getCurrentFilename() {
    //base checks before starting
    var baseChecks = checks();
    if(baseChecks != true) {
        return false;
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