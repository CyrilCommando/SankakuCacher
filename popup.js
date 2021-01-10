go();

var enabledattr = document.getElementById("enabled");
var arrangefilesattr = document.getElementById("arrangefiles");
var savefolderattr = document.getElementById("savefolder");
var autofavattr = document.getElementById("autofav");

/*Open in New Window*/ document.getElementById("newwindow").onchange = function() {doc_onchanged(document.getElementById("newwindow"))}
/*autofav onchange*/document.getElementById("autofav").onchange = function() {doc_onchanged(autofavattr)}
/* Enabled onchange*/document.getElementById("enabled").onchange = function() {doc_onchanged(enabledattr)};
/*MP4's/WEBM's onchange*/document.getElementById("mp4swebms").onchange = function() {doc_onchanged(document.getElementById("mp4swebms"))}
/*Arrange Files onchange*/document.getElementById("arrangefiles").onchange = function() {doc_onchanged(arrangefilesattr)};
/*Save Folder onchange*/document.getElementById("savefolder").onchange = function() {doc_onchanged(savefolderattr)};
/*Delete Settings onclick*/document.getElementById("deletesettings").onclick = function() {delete_all_settings()};
/*Delete Images onclick*/ //document.getElementById("deleteimages").onclick = function() {delete_all_images()};
/*Default Settings onlick*/document.getElementById("defaultsettings").onclick = function() {default_settings(enabledattr, arrangefilesattr, savefolderattr)};
/*Open Folder onclick*/document.getElementById("openfolder").onclick = function() {chrome.downloads.showDefaultFolder()};
/*Download This onclick*/document.getElementById("DownloadThis").onclick = function() {sendMessage2()};
/*Chan onclick*/document.getElementById("chan").onclick = function() {sendMessage()};
/*Search Tags onclick*/document.getElementById("searchtags").onclick = function() {openLinkWithTags()};
/*SankakuIcon onclick*/document.getElementById("SankakuIcon").onclick = function() {sendMessage()};
/*MiddleClickFav onclick*/ document.getElementById("middleclickfav").onchange = function() {doc_onchanged(document.getElementById("middleclickfav"))};
/*History onclick*/ //document.getElementById("history").onclick = function() {window.open("/history/history.html")};

var x = Array.prototype.slice.call(document.getElementsByTagName("a"))

x.forEach(element => {
    if (element.id != "advl"){
  element.onclick = function(event){
      event.preventDefault()
      if(element.id == "chan")
      {
          sendMessage();
      }
    }
  }
});

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
    $("#savefolder").val(n3);
    $("#tagstosearch").val(n4);
    $("#autofav").attr("checked", n5)
    $("#newwindow").attr("checked", n6)
    $("#mp4swebms").attr("checked", n7)
    $("#middleclickfav").attr("checked", n8)
}

function delete_all_settings()
{
    chrome.storage.local.remove(["enabled", "mp4swebms", "arrangefiles", "savefolder", "prevsearch", "autofav", "newwindow", "middleclickfav", "advanced_settings_object"])
    //chrome.runtime.sendMessage({"message": "alert", value: "settings deleted"})
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
        default_settings();
        //chrome.runtime.sendMessage({"message": "alert", value: "SankakuCacher first-run options initialize, please re-open the page"})
    }
    else if (n1 == null || undefined)
    {
        default_settings()
        //chrome.runtime.sendMessage({"message": "alert", value: "SankakuCacher Enabled parameter missing, defaulting to enabled"})
    }
    else if (n2 == null || undefined)
    {
        default_settings()
        //chrome.runtime.sendMessage({"message": "alert", value: "SankakuCacher arrangefiles parameter corrupted/missing, setting to default false"})
    }
    else if (n3 == null || undefined)
    {   
        default_settings()
        //chrome.runtime.sendMessage({"message": "alert", value: "SankakuCacher savefolder parameter missing/corrupted, setting to default SankakuCacher"})
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