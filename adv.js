/*character onchange*/ document.getElementById("character").onchange = function() {doc_onchanged(document.getElementById("character"))}
/*date onchange*/document.getElementById("date").onchange = function() {doc_onchanged(document.getElementById("date"))}

var characterenabled;
var dateenabled;
var setsobj;

class AdvancedSettingsObject
{
    constructor(param1, param2) {
        this.character = param1;
        this.date = param2;
    }
}

function doc_onchanged(htmlelement){
    switch (htmlelement.id)
    {
        case "character":
        {
            characterenabled = htmlelement.checked;
            setsobj = new AdvancedSettingsObject(characterenabled, dateenabled)
            chrome.storage.local.set({"advanced_settings_object": setsobj})
            break;
        }
        case "date":
        {
            dateenabled = htmlelement.checked;
            setsobj = new AdvancedSettingsObject(characterenabled, dateenabled)
            chrome.storage.local.set({"advanced_settings_object": setsobj})
            break;
        }  
    }
    //var x = document.getElementById("savefolder");
    //chrome.storage.local.set({"savefolder": htmlelement.value})
}

chrome.storage.local.get(["advanced_settings_object"], function(result) {
    console.log('character: ' + result.advanced_settings_object.character)
    console.log('date: ' + result.advanced_settings_object.date)
    //setthethings(result.enabled, result.arrangefiles, result.savefolder);
    update_options_page(result.advanced_settings_object.character, result.advanced_settings_object.date);
  })


function update_options_page(n1, n2)
{
$("#character").attr("checked", n1);
$("#date").attr("checked", n2);
}

























//why doesn't this work??
// ele = document.getElementById("tag-sidebar").getElementsByClassName("tag-type-character")

// elearr = Array.prototype.slice.call(ele)

// elearr.forEach(() => {
//     console.log(this.class)
// });