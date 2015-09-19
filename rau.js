var root = new Firebase('https://rau.firebaseio.com/');
var runesRef = root.child("runes");
var categoryPriorities = {};

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
                function addRow(name, codePoint, category)
                {
                    $('#runeTable tr:last').after($('<tr>').attr("class", "generatedData").append($('<td>').attr("class", "rauText").text(String.fromCharCode(codePoint)), $('<td>').text(name), $('<td>').text(category), $('<td>').text(codePoint.toString(16).toUpperCase())));
                }
                addRow(snap.key(), val.codePoint, val.category);
                if(val.pillared)
                {
                    addRow("pillared " + snap.key(), val.codePoint + 1, val.category);
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
            $('#messageInput').keypress(function(e)
            {
                if(e.keyCode == 13)
                {
                    ref.push({user: root.getAuth().uid, text: $('#messageInput').val()});
                    $('#messageInput').val('');
                }
            });
            ref.on('child_added', function(snapshot)
            {
                var message = snapshot.val();
                root.child('users').child(message.user).once('value', function(snap)
                {
                    displayChatMessage(snap.val().name, message.text);
                });
            });
            function displayChatMessage(name, text)
            {
                $('#messageInput').before($('<div/>').text(text).prepend($('<em/>').text(name + ': ')).attr("class", "generatedData"));
                $('#messagingScreen')[0].scrollTop = $('#messagingScreen')[0].scrollHeight;
            };
        },
        close: function()
        {
            root.child('messaging').child('broadcast').off();
        },
        onShow: function()
        {
            $('#messageInput').focus();
        }
    })
}

$(document).ready(function()
{
    if(!(ALP_CONST.DEBUG & 2))
    {
        $('#debugLog').hide();
    }
    var last = "logout";
    for(var page in pages)
    {
        pages[page].hide();
        $('#' + last + 'Btn').after($('<a>').attr({'class': 'btn pages', id: page + 'Btn'}).text(page[0].toUpperCase() + page.substr(1)).on('click', {page: page}, function(e)
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
        last = page;
    }
    root.onAuth(function(authData)
    {
        if(authData)
        {
            // save the user's profile into the database so we can list users,
            // use them in Security and Firebase Rules, and show profiles
            var ref = root.child("users").child(authData.uid);
            ref.once("value", function(snap)
            {
                if(!snap.exists())
                {
                    ref.set({
                        provider: authData.provider,
                        name: function(authData)
                            {
                                var n = authData[authData.provider].displayName;
                                return prompt("Enter your name", n) || n;
                            }(authData),
                        access: "basic"
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
            for(var page in pages)
            {
                pages[page].close();
            }
            $('.generatedData').remove();
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
        console.log("Authenticated successfully with payload:", authData);
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