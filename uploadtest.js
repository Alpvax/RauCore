var inputRau = false;
$(document).ready(function()
{
    $('#messageInput').autogrow().on("keypress.rau", {callback: function(val)//onSubmit
    {
        var t = $(this);
        t.innerHeight(t.data('autogrow-start-height') || 1);//Resize on submit
    }}, function(e)//Send Message
    {
        var t = $(this)
        var c = t.caret();
        var val = t.val();
        if(c > 0 && val.substr(c - 1, 1) == "\\")
        {
            key = String.fromCharCode(e.which)
            var res = "\\" + key;
            switch(key)
            {
                case 'l'://\l changes input language
                    inputRau = !inputRau;
                    e.preventDefault();
                    res = "";
                    break;
                case '\\'://change \\ to unicode string to be replaced on submit (enables escaping \)
                    e.preventDefault();
                    res = "\\u5c";
                    break;
            }
            t.val(val.substr(0, c - 1) + res + val.substr(c));
            c += res.length - 1;
        }
        else if(e.which == 13 || e.which == 10)//Safari on iPhone sends 10
        {
            console.log("Submitting");
            if(e.data.callback)
            {
                e.data.callback.call(this, t.val());
            }
            t.val('');
            e.preventDefault();
        }
        else if(inputRau)
        {
            var rune = $('#rune_' + $('#rune_name_' + String.fromCharCode(e.which)).text().replace(" ", "_")).text();
            if(rune)
            {
                e.preventDefault();
                t.val(val.substr(0, c) + rune + val.substr(c));
                c++;
            }
        }
        t.caret(c);
    });
});