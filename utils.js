var ALP_CONST = {};
var debug = /\?.*debug(=(\d))?/i.exec(document.location.href);
if(debug && debug[0])
{
    ALP_CONST.DEBUG = debug[2] || 3;
}
else
{
    ALP_CONST.DEBUG = 0;
}
if(ALP_CONST.DEBUG & 1)
{
    console.log("DEBUG TO CONSOLE ENABLED");
}
if(ALP_CONST.DEBUG & 2)
{
    console.log("DEBUG TO PAGE ENABLED");
}
/*var stPage = /\?.*page=(\d|\w+)/i.exec(document.location.href);
if(stPage && stPage[0])
{
    ALP_CONST.START_PAGE = stPage[1]
}*/
//Prevent use of cached scripts
/*var r = Date.now();
document.getElementById("zedFunctions").src = "functions.js?" + r;
document.getElementById("zedCanvas").src = "canvas.js?" + r;*/
//Fallback for when google CDN is inaccessible. Assumes also unable to get JQuery mobile
if(typeof $ == "undefined")
{
    var e = document.getElementById("jQuery");
    console.log("Unable to get jQuery from CDN: " + e.src + "\nUsing fallback version.")
    var p = e.parentElement;
    p.removeChild(e);
    e = document.createElement("script");
    e.id = "jQuery";
    e.src = "libs/jquery-2.1.4.min.js";
    p.appendChild(e);
    //document.getElementById("jQueryMobile").src = "libs/jQueryMobile/jquery.mobile-1.4.5.min.js";
}
else
{
    //document.getElementById("jQueryMobile").src = "https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js";
}

function escapeHtml(string)
{
    return String(string).replace(/[&<>"'\/\n]/g, function(s)
    {
        return entityMap[s];
    });
}

function log(logType)
{
    var options = {};
    options.logType = logType;
    //swap first parameter for options so arguments can be passed easily
    logType = options;
    if(!(ALP_CONST.DEBUG & 1))
    {
        options.noConsole = true;
    }
    var r = getLogHTML.apply(this, arguments);
    var error = r.type == "error";
    if(ALP_CONST.DEBUG & 2)
    {
        $("#debugLog").innerHTML += "<br>" + (error ? '<span class="errorLog">' : "") + r.text + (error ? '</span>' : "");
    }
}

function getLogHTML(logOptions)
{
    var level = "log";
    var args = Array.prototype.slice.call(arguments, 1);
    if(logOptions.logType)
    {
        var l = /^[ewild]/i.exec(logOptions.logType);
        switch(l[0])
        {
            case "e":
                level = "error";
                break;
            case "w":
                level = "warn";
                break;
            case "i":
                level = "info";
                break;
            case "d":
                level = "debug";
                break;
        }
    }
    if(!logOptions.noConsole)
    {
        console[level].apply(console, args);
    }
    return {
        text: consoleFormat.apply(this, args),
        type: level
    }
}
function stringFormat(format)
{
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, index)
    { 
        return typeof args[index] != 'undefined' ? args[index] : match;
    });
}
var logSpanNo = 0;
function consoleFormat(format)
{
    var index = 0;
    var styled = false;
    var args = arguments;
    return format.replace(/%([sdifoOc])/g, function(match, type)
    {
        var arg = typeof args[++index] != 'undefined' ? escapeHtml(args[index]) : match;
        switch(type)
        {
            case "s":
                return "" + arg;
            case "d":
            case "i":
                return parseInt(arg);
            case "f":
                return parseFloat(arg);
            case "o":
            case "O":
                return JSON.stringify(arg, null, "\t");
            case "c":
                var id = "conLogSpan" + logSpanNo++;
                var x = document.getElementById("conLogStyles") || (function(){
                                                                        var x = document.createElement("style");
                                                                        document.head.appendChild(x);
                                                                        return x;
                                                                    })();
                var t = document.createTextNode("#" + id + "{" + arg + "}");
                x.appendChild(t);
                styled = true;
                return "<span id=\"" + id + "\">";
        }
    }) + (styled ? "</span>" : "");
}