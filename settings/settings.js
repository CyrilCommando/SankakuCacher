go();

var enabledattr = document.getElementById("enabled");
var arrangefilesattr = document.getElementById("arrangefiles");
var savefoldereles = document.getElementsByClassName("savefolder");
var autofavattr = document.getElementById("autofav");

/*Open in New Window*/ document.getElementById("newwindow").onchange = function() {doc_onchanged(document.getElementById("newwindow"))}
/*autofav onchange*/document.getElementById("autofav").onchange = function() {doc_onchanged(autofavattr)}
/* Enabled onchange*/document.getElementById("enabled").onchange = function() {doc_onchanged(enabledattr)};
/*MP4's/WEBM's onchange*/document.getElementById("mp4swebms").onchange = function() {doc_onchanged(document.getElementById("mp4swebms"))}
/*Arrange Files onchange*/document.getElementById("arrangefiles").onchange = function() {doc_onchanged(arrangefilesattr)};
/*Save Folder onchange*/document.getElementsByClassName("savefolder").onchange = function(e) {doc_onchanged(e.currentTarget)};
/*Delete Settings onclick*/document.getElementById("deletesettings").onclick = function() {delete_all_settings()};
/*Delete Images onclick*/ //document.getElementById("deleteimages").onclick = function() {delete_all_images()};
/*Default Settings onlick*/document.getElementById("defaultsettings").onclick = function() {default_settings()};
/*Open Folder onclick*/document.getElementById("openfolder").onclick = function() {chrome.downloads.showDefaultFolder()};
/*Search Tags onclick*/document.getElementById("searchtags").onclick = function() {openLinkWithTags()};
/*MiddleClickFav onclick*/ document.getElementById("middleclickfav").onchange = function() {doc_onchanged(document.getElementById("middleclickfav"))};
/*History onclick*/ //document.getElementById("history").onclick = function() {window.open("/history/history.html")};

class AdvancedSettingsObject
{
    constructor(param1 = false, param2 = false) {
        this.character = param1;
        this.date = param2;
    }
}

$("#tagstosearch").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#searchtags").click();
    }
});


function makehttpReq()
{
    var httpreq = new XMLHttpRequest();
    var url = "https://chan.sankakucomplex.com/post/index"
    httpreq.open("GET", url)
    httpreq.send();
}

function openLinkWithTags()
{
    chrome.storage.local.set({"prevsearch": document.getElementById("tagstosearch").value})
    var x = document.getElementById("tagstosearch").value;
    x = x.split(" ");
    var concatenated;
    var iterate = 0;
    var arr = Array.from(x);
        arr.forEach(element => {
        if ((concatenated == undefined) && (arr.length != 1))
        {
            concatenated = element + "+";
            iterate = iterate++
        }
        else if ((concatenated == undefined) && (arr.length == 1))
        {
            concatenated = element;
        }
        else if ((arr.length > iterate) && (concatenated != undefined))
        {
            concatenated = concatenated + element + "+" 
            iterate = iterate++;
        }
       else
       {
        concatenated = concatenated + element;
       }
    });
    chrome.tabs.create({url: `https://chan.sankakucomplex.com/?tags=${concatenated}&commit=Search`})
}

function go(){

        chrome.storage.local.get(["enabled", "arrangefiles", "savefolder", "prevsearch", "autofav", "newwindow", "mp4swebms", "middleclickfav"], function(result) {
            console.log('extension enabled: ' + result.enabled)
            console.log('arrangefiles value currently is ' + result.arrangefiles)
            console.log('savefolder value currently is ' + result.savefolder);
            console.log('previous search value currently is ' + result.prevsearch);
            setthethings(result.enabled, result.arrangefiles, result.savefolder);
            update_options_page(result.enabled, result.arrangefiles, result.savefolder, result.prevsearch, result.autofav, result.newwindow, result.mp4swebms, result.middleclickfav);
          })
}

function update_options_page(n1, n2, n3, n4, n5, n6, n7, n8)
{
    $("#enabled").attr("checked", n1);
    $("#arrangefiles").attr("checked", n2);
    var savs = document.getElementsByClassName("savefolder")
    savs = Array.prototype.slice.call(savs)
    savs.forEach(element => {
        element.value = n3
    });
    $("#tagstosearch").val(n4);
    $("#autofav").attr("checked", n5)
    $("#newwindow").attr("checked", n6)
    $("#mp4swebms").attr("checked", n7)
    $("#middleclickfav").attr("checked", n8)
}

function delete_all_settings()
{
    chrome.storage.local.remove(["enabled", "mp4swebms", "arrangefiles", "savefolder", "prevsearch", "autofav", "newwindow", "middleclickfav", "advanced_settings_object"])
    chrome.runtime.sendMessage({"message": "alert", value: "settings deleted"})
    default_settings()
}

function default_settings()
{
    var aso = new AdvancedSettingsObject();
    chrome.storage.local.set({"enabled": false, "mp4swebms": false, "arrangefiles": false, "savefolder": "SankakuCacher", "autofav": false, "newwindow": true, "middleclickfav": true, "advanced_settings_object": aso})
    chrome.runtime.sendMessage({"message": "alert", value: "Settings set to default"})
}

function doc_onchanged(htmlelement){
    switch (htmlelement.id)
    {
        case "enabled":
        {
            chrome.storage.local.set({"enabled": htmlelement.checked})
            break;
        }
        case "arrangefiles":
        {
            chrome.storage.local.set({"arrangefiles": htmlelement.checked})
            break;
        }
        case "savefolder":
        {
            chrome.storage.local.set({"savefolder": htmlelement.value})
            break;
        }
        case "mp4swebms":

            chrome.storage.local.set({"mp4swebms": htmlelement.checked})
            break;

        case "autofav":

            chrome.storage.local.set({"autofav": htmlelement.checked})
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "change_autofav_variable"})
            }) 
            
            break;
            
        case "newwindow":

            chrome.storage.local.set({"newwindow": htmlelement.checked})
            break;
            
        case "middleclickfav":
            chrome.storage.local.set({"middleclickfav": htmlelement.checked})
            // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //     chrome.tabs.sendMessage(tabs[0].id, {message: "change_middleclick_variable"})
            // }) 
            break;
    }
}
function setthethings(n1, n2, n3){
    if ((n1 == undefined) && (n2 == undefined))
    {
        default_settings()
    }
    else if (n1 == null || undefined)
    {
        default_settings()
    }
    else if (n2 == null || undefined)
    {
        default_settings()
    }
    else if (n3 == null || undefined)
    {   
        default_settings()
    } 
}