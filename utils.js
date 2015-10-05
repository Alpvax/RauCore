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
/*var stPage = /\?.*page=(\d|\w+)/i.exec(document.location.href);
if(stPage && stPage[0])
{
    ALP_CONST.START_PAGE = stPage[1]
}*/
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

var entityMap = {
    "&" : "&amp;",
    "<" : "&lt;",
    ">" : "&gt;",
    "\"" : "&quot;",
    "'" : "&#39;",
    "/" : "&#x2F;",
    "\n": "<br>",
    "\t": "&nbsp&nbsp&nbsp&nbsp"
};

function formatHtml(string)
{
    return String(string).replace(/[&<>"'\/\n]/g, function(s)
    {
        return entityMap[s];
    });
}

(function()//setupConsole
{
    var methods = ['error', 'warn', 'info', 'log', 'debug'];
    for(var i in methods)
    {
        var method = methods[i];
        if(Function.prototype.bind)
        {
            console['o' + method] = Function.prototype.bind.call(console[method], console);
        }
        else
        {
            console['o' + method] = function()
            { 
                Function.prototype.apply.call(console.log, console, arguments);
            };
        }
        console[method] = function()
        {
            if(ALP_CONST.DEBUG & 1)
            {
                console['o' + method].apply(console, arguments);
            }
            if(ALP_CONST.DEBUG & 2)
            {
                var text = "";
                for(var j in arguments)
                {
                    var arg = arguments[j];
                    switch(typeof arg)
                    {
                        case "string":
                            text += formatHtml(arg);
                            break;
                        case "number":
                        case "boolean":
                            text += arg.toString();
                            break;
                        default:
                            text += JSON.stringify(arg);
                    }
                    text += "<br>";
                }
                $('.windowConsole').each(function()
                {
                    var type = $(this).data('consoleType');
                    if(type && type.indexOf(method.charAt(0)))
                    {
                        $(this).append(text);
                    }
                });
            }
        }
    }
}());

$(document).ready(function()
{
    if(ALP_CONST.DEBUG & 1)
    {
        console.log("DEBUG TO CONSOLE ENABLED");
    }
    if(ALP_CONST.DEBUG & 2)
    {
        console.log("DEBUG TO PAGE ENABLED");
    }
    else
    {
        $('.windowConsole').hide();
    }
});

function rgbToHtml(r, g, b)
{
    if(r.r != undefined)//r is an object with properties rgb
    {
        b = r.b;
        g = r.g;
        r = r.r;//Set r last
    }
    return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
}