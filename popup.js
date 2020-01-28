go();

var enabledattr = document.getElementById("enabled");
var arrangefilesattr = document.getElementById("arrangefiles");
var savefolderattr = document.getElementById("savefolder");

/* Enabled onchange*/document.getElementById("enabled").onchange = function() {doc_onchanged(enabledattr)};
/*MP4's/WEBM's onchange*/document.getElementById("mp4swebms").onchange = function() {doc_onchanged(document.getElementById("mp4swebms"))}
/*Arrange Files onchange*/document.getElementById("arrangefiles").onchange = function() {doc_onchanged(arrangefilesattr)};
/*Save Folder onchange*/document.getElementById("savefolder").onchange = function() {doc_onchanged(savefolderattr)};
/*Delete Settings onclick*/document.getElementById("deletesettings").onclick = function() {delete_all_settings()};
/*Delete Images onclick*/document.getElementById("deleteimages").onclick = function() {delete_all_images()};
/*Default Settings onlick*/document.getElementById("defaultsettings").onclick = function() {default_settings(enabledattr, arrangefilesattr, savefolderattr)};
/*Open Folder onclick*/document.getElementById("openfolder").onclick = function() {chrome.downloads.showDefaultFolder()};
/*Download This onclick*/document.getElementById("DownloadThis").onclick = function() {sendMessage2()};
/*Chan onclick*/document.getElementById("chan").onclick = function() {sendMessage()};
/*Search Tags onclick*/document.getElementById("searchtags").onclick = function() {openLinkWithTags()};
/*SankakuIcon onclick*/document.getElementById("SankakuIcon").onclick = function() {sendMessage()};


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

function sendMessage()
{
    chrome.runtime.sendMessage({message: "chan"})
}

function sendMessage2()
{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "acquirelink"})
    }) 
}

function go(){

        chrome.storage.local.get(["enabled", "arrangefiles", "savefolder", "prevsearch"], function(result) {
            console.log('extension enabled: ' + result.enabled)
            console.log('arrangefiles value currently is ' + result.arrangefiles)
            console.log('savefolder value currently is ' + result.savefolder);
            console.log('previous search value currently is ' + result.prevsearch);
            setthethings(result.enabled, result.arrangefiles, result.savefolder);
            update_options_page(result.enabled, result.arrangefiles, result.savefolder, result.prevsearch);
          })
}

function update_options_page(n1, n2, n3, n4)
{
    $("#enabled").attr("checked", n1);
    $("#arrangefiles").attr("checked", n2);
    $("#savefolder").val(n3);
    $("#tagstosearch").val(n4);
}

function delete_all_settings()
{
    chrome.storage.local.remove(["enabled", "mp4swebms", "arrangefiles", "savefolder", "prevsearch"])
    alert("settings deleted")
}

function default_settings()
{
    chrome.storage.local.set({"enabled": true, "mp4swebms": true, "arrangefiles": false, "savefolder": "SankakuCacher"})
    alert("Settings set to default")
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
            chrome.storage.local.set({"mp4swebms": htmlelement.value})
            break;

    }
    //var x = document.getElementById("savefolder");
    //chrome.storage.local.set({"savefolder": htmlelement.value})
}

/*chrome.storage.local.get(['key'], function(result) {
    console.log('Value currently is ' + result.key);
  });      */

function setthethings(n1, n2, n3){
    //alert("SankakuCacher save dir is " + n3);
    if ((n1 == undefined) && (n2 == undefined))
    {
    chrome.storage.local.set({"enabled": true, "arrangefiles": false, "savefolder": "SankakuCacher"}, alert("SankakuCacher first-run options initialize, please re-open the page"));
    }
    else if (n1 == null || undefined)
    {
        chrome.storage.local.set({"enabled": true}, alert("SankakuCacher Enabled parameter missing, defaulting to enabled"));
    }
    else if (n2 == null || undefined)
    {
        chrome.storage.local.set({"arrangefiles": false}, alert("SankakuCacher arrangefiles parameter corrupted/missing, setting to default false"));
    }
    else if (n3 == null || undefined)
    {   
        chrome.storage.local.set({"savefolder": "SankakuCacher"}, alert("SankakuCacher savefolder parameter missing/corrupted, setting to default SankakuCacher"));
    } 
}


//$("#inputfield").text("SankakuCacher/")

//var x = $("#arrangefiles").attr(href);

/*get element by id "#savefolder"*/ //          var x = $("#savefolder").attr(value); 
/*change element to whatever in a file*/ //x.value = getValue();
/*function getValue(string){
    config.js //read the place
}*/
// chrome.browserAction.onClicked.addListener(function() {
//     alert(x)}
// )