var root = new Firebase('https://rau.firebaseio.com/');
var runesRef = root.child("runes");
var categoryPriorities = {};
var currentUser = null;

var pages = {
    /*login: new RauPage(function(){
            $('#loginBtn').text("Log in with Google");
        }, function(){
            $('#loginBtn').text("Log out");
        }),*/
    runes: new RauPage('runes', {
        setup: function()
        {
            runesRef.on("child_added", function(snap)
            {
                var val = snap.val();
                function addRow(name, codePoint, category, latin)
                {
                    $('#runeTable tr:last').after($('<tr>').attr("class", "generatedData").append($('<td>').attr("id", "rune_" + name.replace(" ", "_")).text(String.fromCharCode(codePoint)), $('<td>').attr("id", "rune_name_" + (latin != undefined ? latin : codePoint)).text(name), $('<td>').text(category), $('<td>').text(codePoint.toString(16).toUpperCase()), $('<td>').text(latin != undefined ? latin : "")));
                }
                addRow(snap.key(), val.codePoint, val.category, val.latin);
                if(val.pillared)
                {
                    addRow("pillared " + snap.key(), val.codePoint + 1, val.category, val.latin != undefined ? val.latin.toUpperCase() : undefined);
                }
            });
        },
        close: function()
        {
            runesRef.off();
        }
    }),
    dictionary: new RauPage('dictionary', {}),
    messaging: new RauPage('messaging', {
        setup: function()
        {
            var ref = root.child('messaging').child('broadcast');
            $('#messageInput').on("keypress.postMessage", function(e)
            {
                if(e.keyCode == 13 || e.keyCode == 10)//Safari on iPhone sends 10
                {
                    ref.push({
                        user: currentUser,
                        text: formatText($(this).val()),
                        time: Firebase.ServerValue.TIMESTAMP,
                        read: {
                            [currentUser]: true
                        }});
                    $(this).val('');
                    e.preventDefault();
                }
            });
            ref.orderByChild('time').on('child_added', function(snapshot)
            {
                var message = snapshot.val();
                var msg = $('<div>').prepend($('<span>').text(new Date(message.time).toLocaleString("en-GB")).attr("class", "messageComponentDate"));//, $("<br>"));
                $('#messageInput').before(msg);
                root.child('users').child(message.user).once('value', function(snap)
                {
                    msg.prepend($('<span>').text(snap.val().name).attr("class", "messageComponentName")).append($('<span>').text(message.text).attr("class", "messageComponentBody"));
                    msg.attr({"class": "generatedData message", "data-message-type": currentUser == message.user ? 's' : 'r'});
                    if(snap.child('colour').exists())
                    {
                        var c = snap.child('colour').val();
                        msg.css("background-color", "rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
                    }
                    //var scroll = $('#messageInput').offset().top + $('#messageInput').height() - $(window).height();
                    var scroll = $('footer').offset().top - $(window).height();
                    if(scroll > 0)
                    {
                        $("html, body").animate({scrollTop: scroll}, 0);
                    }
                    if(!message.read[currentUser])//Don't notify if you have already read it.
                    {
                        sendNotification(snap.val().name, message.text);
                        snapshot.ref().child('read').update({[currentUser]: true});
                    }
                });
            });
        },
        close: function()
        {
            root.child('messaging').child('broadcast').orderByChild('time').off();
            $('#messageInput').off("keypress.postMessage");
        }
    }),
    settings: new RauPage('settings', {
        setup: function()
        {
            var ref = root.child('users').child(currentUser);
            $('#userName').on('change.submit', function(e)
            {
                if($(this).val())
                {
                    ref.update({name: formatText($(this).val())});
                }
            });
            $('#userColour').on('change.submit', function(e)
            {
                $(this).val().replace(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/, function(match, r, g, b)
                {
                    ref.child('colour').update({r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16)});
                });
            });
            function setColour(r, g, b)
            {
                $('#userColour').val("#" + r.toString(16) + g.toString(16) + b.toString(16));
            }
            ref.on('child_changed', function(snap, prevChildKey)
            {
                if(snap.key() == 'name')
                {
                    $('#userName').val(snap.val());
                }
                if(snap.key() == 'colour')
                {
                    var c = snap.val();
                    setColour(c.r, c.g, c.b);
                }
            });
            ref.once('value', function(snap)
            {
                var val = snap.val();
                $('#userName').val(val.name);
                setColour(val.colour.r, val.colour.g, val.colour.b);
            })
        },
        close: function()
        {
            root.child('users').child(currentUser).off();
            $('#userName').off("change.postMessage");
            $('#userColour').off("change.postMessage");
        }
    })
}

$(document).ready(function()
{
    /*navigator.serviceWorker.register('rau.js', {scope: './'}).then(function(registration)
    {
        console.debug('succeeded registering');
    }).catch(function(error)
    {
        console.debug('failed registering', error);
    });*/
    if(window.Notification && Notification.permission != 'denied')
    {
        if(Notification.permission != 'granted')
        {
            Notification.requestPermission(function(status)
            {
                if(Notification.permission !== status)
                {
                    Notification.permission = status;
                }
            });
        }
    }
    var header = $('section.page-header');
    for(var page in pages)
    {
        pages[page].hide();
        header.append($('<a>').attr({'class': 'btn pages', id: page + 'Btn'}).text(page.charAt(0).toUpperCase() + page.substr(1)).on('click', {page: page}, function(e)
            {
                for(var p in pages)
                {
                    if(p == e.data.page)
                    {
                        pages[p].show();
                    }
                    else
                    {
                        pages[p].hide();
                    }
                }
            }));
    }
    root.onAuth(function(authData)
    {
        if(authData)
        {
            currentUser = authData.uid;
            // save the user's profile into the database so we can list users,
            // use them in Security and Firebase Rules, and show profiles
            var ref = root.child("users").child(authData.uid);
            ref.once("value", function(snap)
            {
                if(!snap.exists())
                {
                    var r = Math.floor((Math.random() * 0x3F) + 1) + 0xC0;
                    var g = Math.floor((Math.random() * 0x3F) + 1) + 0xC0;
                    var b = Math.floor((Math.random() * 0x3F) + 1) + 0xC0;
                    ref.set({
                        provider: authData.provider,
                        name: function(authData)
                            {
                                var n = authData[authData.provider].displayName;
                                return prompt("Enter your name", n) || n;
                            }(authData),
                        access: "basic",
                        colour: {r: r, g: g, b: b}
                    });
                }
                for(var page in pages)
                {
                    pages[page].setup();
                }
                login();
            }, function(error)
            {
                console.error("Error logging in", error);
            });
        }
        else
        {
            if(currentUser)
            {
                currentUser = null;
                for(var page in pages)
                {
                    pages[page].close();
                }
                $('.generatedData').remove();
            }
            logout();
        }
    });
    $('#logoutBtn').on('click', function(e)
    {
        e.preventDefault();
        root.unauth();
    });
    $('.loginBtn').on('click', function(e)
    {
        e.preventDefault();
        var provider = $(this).data('login-provider');
        root.authWithOAuthPopup(provider, function(error, authData)
        {
            authenticate(error, authData, provider, true);
        });
    });
    if(root.getAuth())//If already logged in, load as though logging in
    {
        login();
    }
    else
    {
        logout();
    }
});

function login()
{
    $('.loginBtn').hide();
    $('#logoutBtn').show();
    $('.pages').show();
    pages.messaging.show();
}
function logout()
{
    $('.loginBtn').show();
    $('#logoutBtn').hide();
    $('.pages').hide();
    for(var page in pages)
    {
        pages[page].hide();
    }
}

function RauPage(key, funcs)
{
    this.setup = funcs.setup || function(){};
    this.close = funcs.close || function(){};
    this.show = function(){
            $('#' + key + 'Screen').show();
            var f = funcs.onShow;
            if(f)
            {
                f();
            }
    };
    this.hide = function(){
            $('#' + key + 'Screen').hide();
            var f = funcs.onHide;
            if(f)
            {
                f();
            }
    };
    this.toJSON = function(){
        return "<RauPage>" + key;
    };
    this.data = {};
}

function formatText(text)
{
    return text.replace(/\\\\/g, "\\u5c")//change \\ to unicode string to be replaced later (enables escaping \)
        .replace(/(\\?)[{\(]lrau[:=]?\s*(.+?)[}\)]/ig, function(match, preSlash, runes)//Enable {rau: r1,r2...rn} input with single letters
        {
            if(preSlash)
            {
                return match.substr(1);
            }
            return runes.replace(/[^ ]/g, function(key)
            {
                var rune = $('#rune_' + $('#rune_name_' + key).text().replace(" ", "_")).text();
                return rune ? rune : "{NO RUNE FOUND: " + key + "}";
            });
        }).replace(/(\\?)[{\(]rau[:=]?\s*(((p(?:illared)?[_\- ]|\|)?([a-z]+))([,; ]+((p(?:illared)?[_\- ]|\|)?([a-z]+)))*)[}\)]/ig, function(match, preSlash, runes)//Enable {rau: r1,r2...rn} input
        {
            if(preSlash)
            {
                return match.substr(1);
            }
            return runes.replace(/(p(?:illared)?[_\- ]|\|)?([a-z]+)[,; ]*/ig, function(subMatch, pillared, key)
            {
                if(key.length == 1)
                {
                    if(pillared)
                    {
                        key = key.toUpperCase();
                    }
                    key = $('#rune_name_' + key).text().replace(" ", "_");
                }
                else if(pillared)
                {
                    key = "pillared_" + key;
                }
                var rune = $('#rune_' + key.toLowerCase()).text();
                return rune ? rune : "{NO RUNE FOUND: " + key + "}";
            });
        }).replace(/(\\?)\\u([0-9a-fA-F]+)/g, function(match, preSlash, hex)//enable unicode input, done last to convert escaped \ (\u5c) back to a single \ once it will no longer be part of any sequences
        {
            return preSlash == "\\" ? match.substr(1) : String.fromCharCode(parseInt(hex, 16));
        });
}

function authenticate(error, authData, provider, tryRedirect)
{
    if(error)
    {
        if(tryRedirect && error.code === "TRANSPORT_UNAVAILABLE")
        {
            // fall-back to browser redirects, and pick up the session
            // automatically when we come back to the origin page
            // second call will not have the tryRedirect parameter, so a recursive loop will never occur
            root.authWithOAuthRedirect(provider, authenticate);
        }
        else
        {
            console.error("Login Failed!", error);
        }
    }
    else
    {
        //console.log("Authenticated successfully with payload:", authData);
    }
}

function sendNotification(name, text)
{
    if(window.Notification)
    {
        if(Notification.permission == 'granted')
        {
            try
            {
                var n = new Notification("New rau message", {tag: 'rauMsg', body: name + ': ' + text});
            }
            catch(err)
            {
                console.info("New message\n" + name + ': ' + text);
            }
            /*navigator.serviceWorker.ready.then(function(registration)
            {
                registration.showNotification("New rau message", {tag: 'rauMsg', body: name + ': ' + text});
            });*/
        }
    }
    else
    {
        console.info("New message\n" + name + ': ' + text);
    }
}

function reSetRunes()
{
    root.child('fontData/sections').once('value', function(snap1)
    {
        snap1.forEach(function(snap)
        {
            categoryPriorities[snap.val()] = parseInt(snap.key(), 16);
        });
        addAllRunes();
    });
    
    root.child("accessLevels").once("value", function(snap)
    {
        snap.forEach(function(level)
        {
            root.child('accessLevels').child(level.key()).setPriority(level.val());
        });
    });
}

function addRune(runeName, rune)
{
    var i = (categoryPriorities[rune['category']] + rune['index']);
    var ref = runesRef.child(runeName)
    ref.setWithPriority(rune, i);
    ref.update({codePoint: i});
}

function addAllRunes()
{
    var runel = JSON.parse('{"ee": {"category": "letters", "pillared": true, "index": 0},'+
                            '"harr": {"category": "letters", "pillared": true, "index": 2},'+
                            '"korr": {"category": "letters", "pillared": true, "index": 4},'+
                            '"meh": {"category": "letters", "pillared": true, "index": 6},'+
                            '"sjuh": {"category": "letters", "pillared": true, "index": 8},'+
                            '"ja": {"category": "letters", "pillared": true, "index": 10},'+
                            '"chair": {"category": "letters", "pillared": true, "index": 12},'+
                            '"orr": {"category": "letters", "pillared": true, "index": 14},'+
                            '"leugh": {"category": "letters", "pillared": true, "index": 16},'+
                            '"varr": {"category": "letters", "pillared": true, "index": 18},'+
                            '"thorr": {"category": "letters", "pillared": true, "index": 20},'+
                            '"na": {"category": "letters", "pillared": true, "index": 22},'+
                            '"bair": {"category": "letters", "pillared": true, "index": 24},'+
                            '"duh": {"category": "letters", "pillared": true, "index": 26},'+
                            '"arr": {"category": "letters", "pillared": true, "index": 28},'+
                            '"so": {"category": "letters", "pillared": true, "index": 30},'+
                            '"torr": {"category": "letters", "pillared": true, "index": 32},'+
                            '"pair": {"category": "letters", "pillared": true, "index": 34},'+
                            '"eugh": {"category": "letters", "pillared": true, "index": 36},'+
                            '"go": {"category": "letters", "pillared": true, "index": 38},'+
                            '"ckhorr": {"category": "letters", "pillared": true, "index": 40},'+
                            '"djarr": {"category": "letters", "pillared": true, "index": 42},'+
                            '"roo": {"category": "letters", "pillared": true, "index": 44},'+
                            '"air": {"category": "letters", "pillared": true, "index": 46},'+
                            '"fee": {"category": "letters", "pillared": true, "index": 48},'+
                            '"eye": {"category": "letters", "index": 50},'+
                            '"oo": {"category": "letters", "index": 51},'+
                            '"atz": {"category": "numbers", "index": 0},'+
                            '"ohs": {"category": "numbers", "index": 1},'+
                            '"sjem": {"category": "numbers", "index": 2},'+
                            '"ohnoh": {"category": "numbers", "index": 3},'+
                            '"neve": {"category": "numbers", "index": 4},'+
                            '"fee-oh": {"category": "numbers", "index": 5},'+
                            '"tuvoh": {"category": "numbers", "index": 6},'+
                            '"este": {"category": "numbers", "index": 7},'+
                            '"elma": {"category": "numbers", "index": 8},'+
                            '"alnu": {"category": "numbers", "index": 9},'+
                            '"rau": {"category": "other", "index": 0},'+
                            '"ran": {"category": "other", "index": 1},'+
                            '"rull": {"category": "other", "index": 2},'+
                            '"rochk": {"category": "other", "index": 3},'+
                            '"vee": {"category": "other", "index": 4},'+
                            '"den": {"category": "other", "index": 5}}');
    for(var rune in runel)
    {
        addRune(rune, runel[rune]);
    }
}