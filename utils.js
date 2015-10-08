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

function escapeHtml(string)
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
                            text += escapeHtml(arg);
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

function firebaseAuthenticate(ref, provider, callback)//Callback should accept error, authData
{
    root.authWithOAuthPopup(provider, function(error, authData)
    {
        if(error && ref && error.code === "TRANSPORT_UNAVAILABLE")
        {
            // fall-back to browser redirects, and pick up the session
            // automatically when we come back to the origin page
            // second call will not have the tryRedirect parameter, so a recursive loop will never occur
            ref.authWithOAuthRedirect(provider, callback);
        }
        else
        {
            callback(error, authData);
        }
    });
}

function DateDayHelper(date)
{
    this.date = date || new Date();
    this.modifyDays = function(days, keepDayTime)
    {
        var d = this.date;
        var args = [null, d.getFullYear(), d.getMonth(), d.getDate() + (days ? days : 0)];//null as first term for instantiation
        if(keepDayTime)
        {
            Array.prototype.push.apply(args, [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()]);
        }
        return new (Function.prototype.bind.apply(Date, args));
    };
}

/* Popup handling code, ensure you have included the #popupOverlay css */
$('#popupOverlay').on('click', function(e)
{
    if($(e.target).is('#popupOverlay'))
    {
        $(this).data("currentPopup").hide();
    }
});

function Popup(innerSelector, onSubmit)
{
    var self = this;
    this.inner = innerSelector instanceof jQuery ? innerSelector : $(innerSelector);
    this.onSubmit = onSubmit instanceof Function ? onSubmit : undefined;
    this.show = function()
    {
        $('#popupOverlay').data("currentPopup", this).show();
        this.inner.show();
    }.bind(this);
    this.hide = function()
    {
        $('#popupOverlay').data("currentPopup", null).hide();
        this.inner.hide();
    }.bind(this);
    this.submit = function()
    {
        if(this.onSubmit)
        {
            this.onSubmit.call(this);
        }
        this.hide();
    }.bind(this);
    inner.find('.popupSubmit').on('click', function(e)
    {
        self.submit();
    });
 }