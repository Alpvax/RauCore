var root = new Firebase('https://rau.firebaseio.com/');
var categoryPriorities = {};
var currentUser = null;
var currentPage = null;

var pages = {
    runes: new RauPage('runes', {
        setup: function()
        {
            root.child('runes').on("child_added", function(snap)
            {
                var val = snap.val();
                function addRow(name, codePoint, category, latin)
                {
                    $('#runeTable tr:last').after($('<tr>').attr("class", "generatedData").append($('<td>').attr("id", "rune_" + name.replace(" ", "_")).text(String.fromCharCode(codePoint)), $('<td>').attr("id", "rune_name_" + (latin != undefined ? latin : codePoint)).text(name), $('<td>').text(codePoint.toString(16).toUpperCase()), $('<td>').text(latin != undefined ? latin : ""), $('<td>').text(category)));
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
            root.child('runes').off();
        }
    }),
    dictionary: new RauPage('dictionary', {}),
    messaging: new RauPage('messaging', {
        init: function()
        {
            this.scrollMessages = function(time)
            {
                var scroll = $('footer').offset().top - $(window).height();
                if(scroll > 0)
                {
                    $("html, body").animate({scrollTop: scroll}, time != undefined ? time : 250);
                }
            };
        },
        setup: function()
        {
            var msgRauPage = this;
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
            root.child('users').on('child_changed', function(snap)
            {
                var val = snap.val();
                $('.messageComponentName[data-message-author="' + snap.key() + '"]').text(val.name).css("color", "rgb(" + val.colour.r + ", " + val.colour.g + ", " + val.colour.b + ")");
            });
            ref.orderByChild('time').on('child_added', function(snapshot)
            {
                var message = snapshot.val();
                var msg = $('<div>').prepend($('<span>').text(new Date(message.time).toLocaleString("en-GB")).attr("class", "messageComponentDate")).attr({"class": "generatedData message", "data-message-type": currentUser == message.user ? 's' : 'r'});
                $('#messageList').append(msg);
                root.child('users').child(message.user).once('value', function(snap)
                {
                    var author = $('<span>').text(snap.val().name).attr({"class": "messageComponentName", "data-message-author": message.user});
                    msg.prepend(author).append($('<span>').text(message.text).attr("class", "messageComponentBody"));
                    if(snap.child('colour').exists())
                    {
                        var c = snap.child('colour').val();
                        author.css("color", "rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
                        //msg.css("background-color", "rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
                    }
                    msgRauPage.scrollMessages(0);
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
        },
        onShow: function()
        {
            this.scrollMessages();
            $('#messageInput').focus();
        }
    }),
    settings: new RauPage('settings', {
        setup: function()
        {
            $('#userName').on('change.submit', function(e)
            {
                if($(this).val())
                {
                    ref.update({name: formatText($(this).val())});
                }
            });
            $('#userColour').on('change', function(e)
            {
                $(this).val().replace(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/, function(match, r, g, b)
                {
                    ref.child('colour').update({r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16)});
                });
            });
            var ref = root.child('users').child(currentUser);
            ref.on('child_changed', function(snap, prevChildKey)
            {
                if(snap.key() == 'name')
                {
                    $('#userName').val(snap.val());
                }
                if(snap.key() == 'colour')
                {
                    var c = snap.val();
                    $('#userColour').val(rgbToHtml(c));
                }
            });
            ref.once('value', function(snap)
            {
                var val = snap.val();
                $('#userName').val(val.name);
                $('#userColour').val(rgbToHtml(val.colour));
            })
        },
        close: function()
        {
            root.child('users').child(currentUser).off();
            $('#userName').off('change.submit');
            $('#userColour').off('change.submit');
        }
    })
}

$(document).ready(function()
{
    setupConstantEvents();
    if(window.Notification && Notification.permission != 'denied' && Notification.permission != 'granted')
    {
        Notification.requestPermission(function(status)
        {
            if(Notification.permission !== status)
            {
                Notification.permission = status;
            }
        });
    }
    var header = $('section.page-header');
    for(var page in pages)
    {
        header.append($('<a>').attr({'class': 'btn pageBtn', id: page + 'Btn'}).text(page.charAt(0).toUpperCase() + page.substr(1)).on('click', {page: page}, function(e)
            {
                pages[e.data.page].show();
            }));
    }
    root.onAuth(loginChanged);
    if(root.getAuth())//If already logged in, load as though logging in
    {
        login();
    }
    else
    {
        logout();
    }
});

function setupConstantEvents()
{
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
}

function login()
{
    $('.loginBtn').hide();
    $('#logoutBtn').show();
    $('.pageBtn').show();
    pages.messaging.show();
}
function logout()
{
    $('#logoutBtn').hide();
    $('.pageBtn').hide();
    $('.loginBtn').show();
    pages[currentPage].hide();
}

function RauPage(key, funcs)
{
    this.key = key;
    if(funcs.init)
    {
        funcs.init.call(this);
    }
    this.setup = funcs.setup ? funcs.setup.bind(this) : function(){};
    this.close = funcs.close ? funcs.close.bind(this) : function(){};
    this.show = function(){
        if(currentPage != null)
        {
            pages[currentPage].hide();
        }
        currentPage = this.key;
        $('#' + key + 'Screen').show();
        if(funcs.onShow)
        {
            funcs.onShow.call(this);
        }
    };
    this.hide = function(){
        currentPage = null;
        $('#' + key + 'Screen').hide();
        if(funcs.onHide)
        {
            funcs.onHide.call(this);
        }
    };
    this.toJSON = function(){
        return "<RauPage>" + key;
    };
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

function loginChanged(authData)
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
                //TODO better colour generation
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
        });
    }
    else
    {
        if(currentUser)
        {
            for(var page in pages)
            {
                pages[page].close();
            }
            $('.generatedData').remove();
            currentUser = null;
        }
        logout();
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