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
    var ref = root.child('runes').child(runeName)
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