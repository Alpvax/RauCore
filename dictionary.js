var root = new Firebase('https://rau.firebaseio.com/');
root.authWithOAuthPopup("google", function(error, authData)
{
    if (error)
    {
        console.log("Login Failed!", error);
    }
    else
    {
        console.log("Authenticated successfully with payload:", authData);
    }
});
var runesRef = root.child("runes");
var catsRef = root.child("runeCategories");

setupRuneCallbacks(runesRef);
reSetRunes(runesRef);

getRuneRef(11, 'letters', function(ref)
{
    ref.on("value", function(snap)
    {
        console.log(snap.val());
    });
});

function getRuneNameFromIndex(index, category, callback)
{
    var query = runesRef.child(category).orderByPriority().endAt(index).limitToLast(1)
    query.on("value", function(querySnapshot)
    {
        if(querySnapshot.numChildren() == 1)
        {
            querySnapshot.forEach(function(rune)
            {
                console.log(rune.key());
                callback(runesRef.child(category).child(rune.key()));
            });
        }else
        {
            console.log("No match");
        }
    });
}

function setupRuneCallbacks(runesRef)
{
    runesRef.on("child_added", function(snapshot, prevkey)
    {
        var cat = catsRef.child(snapshot.val()['category']);
        var ref = cat.child(snapshot.key());
        ref.once("value", function(snap)
        {
            if(snap.val() === null)
            {
                ref.setWithPriority(true, snapshot.val()['index']);
                cat.child("numRunes").transaction(function(current)
                {
                    return (current || 0) + 1;
                });
            }
        });
    });
    /*catsRef.on("child_changed", function(snapshot)
    {
        runesRef.forEach(function(snap)
        {
            runesRef.child(snap.key()).setPriority(snap.val()[])
        });
    });*/
}

function reSetRunes(runesRef)
{
    //Uncomment to clear all additional rune data
    //runesRef.set(null);

    var runel = JSON.parse('{"ee": {"category": "letters", "pillared": true, "index": 0}, "harr": {"category": "letters", "pillared": true, "index": 2}, "korr": {"category": "letters", "pillared": true, "index": 4}, "meh": {"category": "letters", "pillared": true, "index": 6}, "sjuh": {"category": "letters", "pillared": true, "index": 8}, "ja": {"category": "letters", "pillared": true, "index": 10}, "chair": {"category": "letters", "pillared": true, "index": 12}, "orr": {"category": "letters", "pillared": true, "index": 14}, "leugh": {"category": "letters", "pillared": true, "index": 16}, "varr": {"category": "letters", "pillared": true, "index": 18}, "thorr": {"category": "letters", "pillared": true, "index": 20}, "na": {"category": "letters", "pillared": true, "index": 22}, "bair": {"category": "letters", "pillared": true, "index": 24}, "duh": {"category": "letters", "pillared": true, "index": 26}, "arr": {"category": "letters", "pillared": true, "index": 28}, "so": {"category": "letters", "pillared": true, "index": 30}, "torr": {"category": "letters", "pillared": true, "index": 32}, "pair": {"category": "letters", "pillared": true, "index": 34}, "eugh": {"category": "letters", "pillared": true, "index": 36}, "go": {"category": "letters", "pillared": true, "index": 38}, "ckhorr": {"category": "letters", "pillared": true, "index": 40}, "djarr": {"category": "letters", "pillared": true, "index": 42}, "roo": {"category": "letters", "pillared": true, "index": 44}, "air": {"category": "letters", "pillared": true, "index": 46}, "fee": {"category": "letters", "pillared": true, "index": 48}, "eye": {"category": "letters", "index": 50}, "oo": {"category": "letters", "index": 51}, "atz": {"category": "numbers", "index": 0}, "ohs": {"category": "numbers", "index": 1}, "sjem": {"category": "numbers", "index": 2}, "ohnoh": {"category": "numbers", "index": 3}, "neve": {"category": "numbers", "index": 4}, "fee-oh": {"category": "numbers", "index": 5}, "tuvoh": {"category": "numbers", "index": 6}, "este": {"category": "numbers", "index": 7}, "elma": {"category": "numbers", "index": 8}, "alnu": {"category": "numbers", "index": 9}, "rau": {"category": "other", "index": 0}, "ran": {"category": "other", "index": 1}, "rull": {"category": "other", "index": 2}, "rochk": {"category": "other", "index": 3}, "vee": {"category": "other", "index": 4}, "den": {"category": "other", "index": 5}}');
    //runesRef.set(runel);
    for(var rune in runel)
    {
        addRune(rune, runel[rune]);
    }
}

function addRune(runeName, rune)
{
    var i = rune['index'].toString();
    while(i.length < 3)//Copes with up to 999 runes
    {
        i = "0" + i;
    }
    console.log("Priority for " + rune + " is: " + i);
    runesRef.child(runeName).setWithPriority(rune, rune['category'] + i);
}