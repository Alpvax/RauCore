var root = new Firebase('https://rau.firebaseio.com/');
var runes = root.child("runes");

getRuneRef(1, 'letters');

function getRuneRef(index, category)
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
                return runes.child(category).child(rune.key());
            });
        }else
        {
            console.log("No match");
        }
    });
}