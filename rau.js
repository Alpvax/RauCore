var root = new Firebase('https://rau.firebaseio.com/');

var RAU_settings = {
    startPage: "messaging",//Start page
    currentPage: "messaging",//Start page
    messagesAfterTime: new DateDayHelper().modifyDays(-3).getTime()//past 3 days and today (total 4 days)
};

var pages = {
    runes: new RauPage('runes', "\uE100"),
    dictionary: new RauPage('dictionary', "\uE00E"),
    messaging: new RauPage('messaging', "\uE006", {
        scrollMessages: function(time, messageList)
        {
            var f = $('footer');
            var scroll = f.offset().top + f.outerHeight(true) - $(window).height();
            if(scroll > 0)
            {
                $('html, body')/*messageList*/.animate({scrollTop: scroll}, time != undefined ? time : 250);
            }
        },
        addMessageToPage: function(snapshot)
        {
            var page = snapshot.ref().parent().key();
            var message = snapshot.val();
            var msg = $('<div>', {"class": "generatedData message"}).prepend($('<span>', {"class": "messageComponentDate"}).text(new Date(message.time).toLocaleString("en-GB"))).addClass(message.user == root.getAuth().uid ? 'sent' : 'recieved');
            var list = $('.messageList').filter(function()
            {
                return $(this).data("conversation") == page;
            }).append(msg);
            root.child('users').child(message.user).once('value', function(snap)//Get username and colour
            {
                var author = $('<span>', {"class": "messageComponentName"}).text(snap.val().name).data("msgAuthor", message.user);
                msg.prepend(author).append($('<span>', {"class": "messageComponentBody"}).text(message.text));
                if(snap.child('colour').exists())
                {
                    var c = snap.child('colour').val();
                    author.css("color", "rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
                }
                if(list.hasClass('selected'))
                {
                    pages.messaging.scrollMessages(0, list);
                }
                if(!message.read[root.getAuth().uid])//Don't notify if you have already read it.
                {
                    sendNotification(snap.val().name, message.text);
                    snapshot.ref().child('read').update({[root.getAuth().uid]: true});
                }
            });
        },
        showList: function(identifier)
        {
            if(identifier)
            {
                $('.messageList.selected').removeClass("selected");
                this.currentList = identifier;
            }
            if($('.messageList.selected').length < 1)
            {
                $('.messageList').filter(function()
                {
                    return $(this).data("conversation") == pages.messaging.data.currentList;
                }).addClass("selected");
            }
            pages.messaging.show();
        },
        onShow: function()
        {
            this.scrollMessages();
            $('#messageInput').focus();
        }
    }, {currentList: "broadcast"}),
    settings: new RauPage('settings', "\uE01E")
}

$(document).ready(function()
{
    root.onAuth(loginChanged);
    //Desktop notifications
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
    
    setupJqueryEvents();
    setupPopups();
    var header = $('nav.page-header');
    for(var page in pages)
    {
        header.append($('<a>', {'class': 'btn pageBtn', id: page + 'Btn'}).text(pages[page].label).data("rauPage", page).on('click', function(e)
            {
                pages[$(this).data("rauPage")].show();
            }));
    }
    if(root.getAuth())//If already logged in, load as though logging in
    {
        login();
    }
    else
    {
        logout();
    }
});

//Display
function login()
{
    $('.loginBtn').hide();
    $('.pageBtn').show();
    pages[RAU_settings.startPage].show();
}
function logout()
{
    $('.pageBtn').hide();
    $('.loginBtn').show();
    pages[RAU_settings.currentPage].hide();
}

function setupJqueryEvents()
{
    $('#logoutBtn').on('click', function(e)//Log out
    {
        e.preventDefault();
        root.unauth();
    });
    $('.loginBtn').on('click', function(e)//Log in
    {
        e.preventDefault();
        var provider = $(this).data('login-provider');
        firebaseAuthenticate(root, provider, function(error, authData)
        {
            if(error)
            {
                console.error("Login Failed!", error);
            }
            else
            {
                //console.log("Authenticated successfully with payload:", authData);
            }
        });
    });
    $('#messageInput').autogrow({animate: false}).on("keypress", function(e)//Send Message
    {
        if(e.keyCode == 13 || e.keyCode == 10)//Safari on iPhone sends 10
        {
            root.child("messaging/" + pages.messaging.data.currentList).push({
                user: root.getAuth().uid,
                text: formatText($(this).val()),
                time: Firebase.ServerValue.TIMESTAMP,
                read: {
                    [root.getAuth().uid]: true
                }});
            $(this).val('');
            $(this).prop("rows", 1);
            e.preventDefault();
            $(this).trigger("keyup");//Resize on submit
        }
    });
    $('#conversationSelect').on('change', function(e)//Change conversation
    {
        var val = $(this).val();
        if(!val)//New conversation
        {
            popups.newConversation.show();
        }
        pages.messaging.showList(val);
    });
    $('#userName').on('change', function(e)//Change name
    {
        if($(this).val())
        {
            root.child('users').child(root.getAuth().uid).update({name: formatText($(this).val())});
        }
    });
    $('#userColour').on('change', function(e)//Change name colour
    {
        $(this).val().replace(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/, function(match, r, g, b)
        {
            root.child('users').child(root.getAuth().uid).child('colour').update({r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16)});
        });
    });
}

var popups = {};

function setupPopups()
{
    popups.newConversation = new Popup($('#newConversation'), function(e)
    {
        var input = $('#convName');
        if(!input.val())
        {
            alert("Group name must not be blank");
            input.focus();
            return true;//Keep the popup open
        }
        else
        {
            var val = input.val();
            for(var i in this.users)
            {
                root.child("users/" + this.users[i] + "/conversations").push(val);
            }
            input.val('');
            $('#conversationSelect').val(val);
            pages.messaging.showList(val);
        }
        $('datalist#otherUsers').remove();
    }, function()//onCreate
    {
        var self = this;
        this.users = [];
        this.userNames = [];
        this.addUser = function(uid, name)
        {
            this.users.push(uid);
            this.userNames.push(name);
        }.bind(this);
        this.addUser(root.getAuth().uid, $('#userName').val());
        this.refreshNames = function()
        {
            $('datalist#otherUsers').remove();
            var list = $('<datalist>', {id: "otherUsers"}).css("display", "none");
            root.child('users').once('value', function(snapshot)
            {
                snapshot.forEach(function(snap)
                {
                    var key = snap.key();
                    if(self.users.indexOf(key) < 0)//Prevent duplicates
                    {
                        list.append($('<option>', {id: "userName-" + key, value: snap.val().name}));
                    }
                });
            });
            $('body').append(list);
            $('#invitedUsers').html('');
            for(var i in this.userNames)
            {
                $('#invitedUsers').append($('<span>').text(this.userNames[i]), $('<br>'));
            }
        }.bind(this);
        this.refreshNames();
        $('#convName').focus();
    });
    $('#addUser').on('click', function(e)
    {
        var input = $('#addUserInput');
        var val = input.val();
        if(val)
        {
            var user = $('datalist#otherUsers option').filter(function()
            {
                return $(this).val() == val;
            });
            if(user.length > 0)
            {
                popups.newConversation.addUser(user.prop("id").substr(9), val);
                input.val("");
            }
            else
            {
                alert("No user found called: \"" + val + "\"");
            }
        }
        popups.newConversation.refreshNames();
    });
}

//Database hooks
function setupDataHooks()
{
    root.child('runes').on("child_added", function(snap)
    {
        var val = snap.val();
        function addRow(name, codePoint, category, latin)
        {
            $('#runeTable tr:last').after($('<tr>', {"class": "generatedData"}).append($('<td>', {id: "rune_" + name.replace(" ", "_")}).text(String.fromCharCode(codePoint)), $('<td>', {"id": "rune_name_" + (latin != undefined ? latin : codePoint)}).text(name), $('<td>').text(codePoint.toString(16).toUpperCase()), $('<td>').text(latin != undefined ? latin : ""), $('<td>').text(category)));
        }
        addRow(snap.key(), val.codePoint, val.category, val.latin);
        if(val.pillared)
        {
            addRow("pillared " + snap.key(), val.codePoint + 1, val.category, val.latin != undefined ? val.latin.toUpperCase() : undefined);
        }
    });
    root.child('users/' + root.getAuth().uid + "/conversations").orderByValue().on('child_added', function(snap)//Add conversation to messages page
    {
        var key = snap.key();
        var val = snap.val();
        $('#conversationSelect option.optionStart').nextUntil($('option.optionStop').next()).each(function()
        {
            var option = $('<option>', {"class": "generatedData", value: key}).text(val);
            if($(this).is(".optionStop") || $(this).text() > val)
            {
                $(this).before(option);
            }
        });
        $('#messageInput').before($('<div>', {"class": "generatedData messageList"}).data("conversation", key));
        root.child('messaging').child(key).orderByChild('time').startAt(RAU_settings.messagesAfterTime).on('child_added', pages.messaging.addMessageToPage);
    });
    root.child('messaging').child("broadcast").orderByChild('time').startAt(RAU_settings.messagesAfterTime).on('child_added', pages.messaging.addMessageToPage);//Add broadcast to messages page
    root.child('users').on('child_added', function(snap)//Populate userName datalist, set settings page fields
    {
        var val = snap.val();
        if(snap.key() == root.getAuth().uid)
        {
            $('#userName').val(val.name);
            $('#userColour').val(rgbToHtml(val.colour));
        }
    });
    root.child('users').on('child_changed', function(snap)//Handle updating user names when they are changed (Including colour)
    {
        var val = snap.val();
        var colour = rgbToHtml(val.colour);
        $('.messageComponentName').filter(function()
        {
            return $(this).data("msgAuthor") == snap.key();
        }).text(val.name).css("color", colour);
        if(snap.key() == root.getAuth().uid)
        {
            $('#userName').val(val.name);
            $('#userColour').val(colour);
        }
    });
}

function RauPage(key, label, funcs, data)
{
    this.key = key;
    this.label = label;
    this.show = function(){
        if(RAU_settings.currentPage != this.key)
        {
            pages[RAU_settings.currentPage].hide();
            RAU_settings.currentPage = this.key;
        }
        $('#' + key + 'Screen').show();
        if(funcs && funcs.onShow)
        {
            funcs.onShow.call(this);
        }
    };
    this.hide = function(){
        $('#' + key + 'Screen').hide();
        if(funcs && funcs.onHide)
        {
            funcs.onHide.call(this);
        }
    };
    if(funcs)
    {
        for(var func in funcs)//add all additional functions to the page
        {
            if(["key", "label", "show", "onShow", "hide", "onHide"].indexOf(func) < 0)//If not already handled/disallowed
            {
                this[func] = funcs[func].bind(this);
            }
        }
    }
    this.data = data || {};
}

/**
* onLogin/onLogout
* Extracted from doc.ready to kepp clean
*/
function loginChanged(authData)
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
            setupDataHooks();
            login();
        });
    }
    else
    {
        $('.generatedData').remove();
        logout();
    }
}

/** Easy rune input */
function formatText(text)
{
    return text.replace(/\\\\/g, "\\u5c")//change \\ to unicode string to be replaced later (enables escaping \)
        .replace(/(\\?)[{\(]rau[:=]?\s*(.+?)[}\)]/ig, function(match, preSlash, runes)//Enable {rau: r1,r2...rn} input with single letters
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
        }).replace(/(\\?)[{\(]nrau[:=]?\s*(((p(?:illared)?[_\- ]|\|)?([a-z]+))([,; ]+((p(?:illared)?[_\- ]|\|)?([a-z]+)))*)[}\)]/ig, function(match, preSlash, runes)//Enable {rau: r1,r2...rn} input
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

/** Send desktop notification */
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