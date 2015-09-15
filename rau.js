var root = new Firebase('https://rau.firebaseio.com/');
var runesRef = root.child("runes");
var categoryPriorities = {};
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
                    name: authData.google.displayName,//TODO: allow users to set their name
                    access: "basic"
                });
            }
        }, function(error)
        {
            log("e", "%O", error);
        });
        loginSetup();
    }
    else
    {
        logoutSetup();
    }
});

function loginSetup()
{
    runesRef.on("child_added", function(snap)
    {
        var val = snap.val();
        function addRow(name, codePoint, category)
        {
            $('#runeTable tr:last').after($("<tr>").append($('<td>').attr("class", "rauText").text(String.fromCharCode(codePoint.toString())), $("<td>").text(name), $("<td>").text(category), $("<td>").text(codePoint.toString(16).toUpperCase())));
        }
        addRow(snap.key(), val.codePoint, val.category);
        if(val.pillared)
        {
            addRow("pillared " + snap.key(), val.codePoint + 1, val.category);
        }
    });
    login();
}
function logoutSetup()
{
    runesRef.off();
    logout();
}

function load()
{
    if(!ALP_CONST.DEBUG & 2)
    {
        $('#debugLog').hide();
    }
    if(root.getAuth())//If already logged in, load as though logging in
    {
        login();
    }
    else
    {
        logout();
    }
    $('#loginBtn').click(function(e)
    {
        e.preventDefault();
        if(root.getAuth())
        {
            root.unauth();
        }
        else
        {
            root.authWithOAuthPopup("google", function(error, authData)
            {
                authenticate(error, authData, true);
            });
        }
    });
}

function getRuneNameFromIndex(index, category, callback)
{
    var query = runesRef.child(category).orderByPriority().endAt(index).limitToLast(1)
    query.on("value", function(querySnapshot)
    {
        if(querySnapshot.numChildren() == 1)
        {
            querySnapshot.forEach(function(rune)
            {
                log('d', rune.key());
                callback(runesRef.child(category).child(rune.key()));
            });
        }else
        {
            log('l', "No match");
        }
    });
}

function authenticate(error, authData, tryRedirect)
{
    if(error)
    {
        if(tryRedirect && error.code === "TRANSPORT_UNAVAILABLE")
        {
            // fall-back to browser redirects, and pick up the session
            // automatically when we come back to the origin page
            // second call will not have the tryRedirect parameter, so a recursive loop will never occur
            root.authWithOAuthRedirect("google", authenticate);
        }
        else
        {
            log('e', "Login Failed!", error);
        }
    }
    else
    {
        //log('l', "Authenticated successfully with payload:", authData);
        //loginSetup();
    }
}

function login()
{
    $('#loginBtn').text("Log out");
    $('.login').hide();
    $('.pages').show();
    $('.runes').show();
}
function logout()
{
    $('#loginBtn').text("Log in with Google");
    $('.login').show();
    $('.pages').hide();
    $('.runes').hide();
    $('.dictionary').hide();
    $('.messaging').hide();
}

function reSetRunes()
{
    root.child('fontData/sections').once('value', function(snap1)
    {
        snap1.forEach(function(snap)
        {
            log('d', "%s: %O", snap.key(), snap.val());
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
    log('d', "Priority for %s is: %i + %i", runeName, categoryPriorities[rune['category']], rune['index']);
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