var root = new Firebase('https://rau.firebaseio.com/');
var runes = root.child("runes");
//TODO: move .runes.categories to .runeCategories
//reSetRunes(runes);

setupRuneCallbacks(runes);

getRuneRef(11, 'letters', function(ref)
{
    ref.on("value", function(snap)
    {
        console.log(snap.val());
    });
});

function getRuneRef(index, category, callback)
{
    var query = runes.child(category).orderByPriority().endAt(index).limitToLast(1)
    query.on("value", function(querySnapshot)
    {
        if(querySnapshot.numChildren() == 1)
        {
            // Data is ordered by increasing height, so we want the first entry
            querySnapshot.forEach(function(rune)
            {
                console.log(rune.key());
                callback(runes.child(category).child(rune.key()));
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
            //TODO: on rune added
        });
}

function reSetRunes(runesRef)
{
    //Uncomment to clear all additional rune data
    //runesRef.set(null);

    var runel = JSON.parse('{"ee": {"category": "letters", "pillared": true, "index": 0}, "harr": {"category": "letters", "pillared": true, "index": 2}, "korr": {"category": "letters", "pillared": true, "index": 4}, "meh": {"category": "letters", "pillared": true, "index": 6}, "sjuh": {"category": "letters", "pillared": true, "index": 8}, "ja": {"category": "letters", "pillared": true, "index": 10}, "chair": {"category": "letters", "pillared": true, "index": 12}, "orr": {"category": "letters", "pillared": true, "index": 14}, "leugh": {"category": "letters", "pillared": true, "index": 16}, "varr": {"category": "letters", "pillared": true, "index": 18}, "thorr": {"category": "letters", "pillared": true, "index": 20}, "na": {"category": "letters", "pillared": true, "index": 22}, "bair": {"category": "letters", "pillared": true, "index": 24}, "duh": {"category": "letters", "pillared": true, "index": 26}, "arr": {"category": "letters", "pillared": true, "index": 28}, "so": {"category": "letters", "pillared": true, "index": 30}, "torr": {"category": "letters", "pillared": true, "index": 32}, "pair": {"category": "letters", "pillared": true, "index": 34}, "eugh": {"category": "letters", "pillared": true, "index": 36}, "go": {"category": "letters", "pillared": true, "index": 38}, "ckhorr": {"category": "letters", "pillared": true, "index": 40}, "djarr": {"category": "letters", "pillared": true, "index": 42}, "roo": {"category": "letters", "pillared": true, "index": 44}, "air": {"category": "letters", "pillared": true, "index": 46}, "fee": {"category": "letters", "pillared": true, "index": 48}, "eye": {"category": "letters", "index": 50}, "oo": {"category": "letters", "index": 51}, "atz": {"category": "numbers", "index": 0}, "ohs": {"category": "numbers", "index": 1}, "sjem": {"category": "numbers", "index": 2}, "ohnoh": {"category": "numbers", "index": 3}, "neve": {"category": "numbers", "index": 4}, "fee-oh": {"category": "numbers", "index": 5}, "tuvoh": {"category": "numbers", "index": 6}, "este": {"category": "numbers", "index": 7}, "elma": {"category": "numbers", "index": 8}, "alnu": {"category": "numbers", "index": 9}, "rau": {"category": "other", "index": 0}, "ran": {"category": "other", "index": 1}, "rull": {"category": "other", "index": 2}, "rochk": {"category": "other", "index": 3}, "vee": {"category": "other", "index": 4}, "den": {"category": "other", "index": 5}}');

    var cat = runesRef.child("categories");
    var o = {};

    for(var rune in runel)
    {
        if(!o[runel[rune]['category']])
        {
            o[runel[rune]['category']] = {'len': 0, 'list': []};
        }
        o[runel[rune]['category']]['len'] = (o[runel[rune]['category']]['len'] || 0) + (runel[rune]['pillared'] ? 2 : 1);
        o[runel[rune]['category']]['list'].push(rune);
        runesRef.child(rune).set(runel[rune]);
    }
    for(var v in o)
    {
        var cat = runesRef.child('categories').child(v);
        cat.set({'numRunes': o[v]['len']});
        var l = cat.child('list');
        for(var i in o[v]['list'])
        {
            l.child(o[v]['list'][i]).setWithPriority(true, runel[o[v]['list'][i]]['index']);
        }
    }
    for(var rune in runel)
    {
        console.log("Priority for " + rune + " is: " + runel[rune]['index'] + o[runel[rune]['category']]['len']);
        runesRef.child(rune).setPriority(runel[rune]['index'] + o[runel[rune]['category']]['len']);
    }
}