go();

// /*Open in New Window*/ document.getElementById("newwindow").onchange = function() {doc_onchanged(document.getElementById("newwindow"))}
// /*autofav onchange*/document.getElementById("autofav").onchange = function() {doc_onchanged(document.getElementById("autofav"))}
// /* Enabled onchange*/document.getElementById("enabled").onchange = function() {doc_onchanged(document.getElementById("enabled"))};
// /*MP4's/WEBM's onchange*/document.getElementById("mp4swebms").onchange = function() {doc_onchanged(document.getElementById("mp4swebms"))}
// /*Arrange Files onchange*/document.getElementById("arrangefiles").onchange = function() {doc_onchanged(document.getElementById("arrangefiles"))};
// /*Save Folder onchange*/document.getElementById("savefolder").onchange = function() {doc_onchanged(document.getElementById("savefolder"))};
// /*Delete Settings onclick*/document.getElementById("deletesettings").onclick = function() {delete_all_settings()};
// /*Delete Images onclick*/ //document.getElementById("deleteimages").onclick = function() {delete_all_images()};
// /*Default Settings onlick*/document.getElementById("defaultsettings").onclick = function() {default_settings()};
// /*Open Folder onclick*/document.getElementById("openfolder").onclick = function() {chrome.downloads.showDefaultFolder()};
// /*Download This onclick*/document.getElementById("DownloadThis").onclick = function() {sendMessage2()};
// /*Chan onclick*/document.getElementById("chan").onclick = function() {sendMessage()};
// /*Search Tags onclick*/document.getElementById("searchtags").onclick = function() {openLinkWithTags()};
// /*SankakuIcon onclick*/document.getElementById("SankakuIcon").onclick = function() {sendMessage()};
// /*MiddleClickFav onclick*/ document.getElementById("middleclickfav").onchange = function() {doc_onchanged(document.getElementById("middleclickfav"))};
// /*History onclick*/ //document.getElementById("history").onclick = function() {window.open("/history/history.html")};

// /*limit onchange */ document.getElementById("mass_download_limit").onchange = function() {doc_onchanged(document.getElementById("mass_download_limit"))};
// /*concurrent limit onchange */ document.getElementById("mass_download_concurrentlimit").onchange = function() {doc_onchanged(document.getElementById("mass_download_concurrentlimit"))};
// /*offset onchange */ document.getElementById("mass_download_offset").onchange = function() {doc_onchanged(document.getElementById("mass_download_offset"))};
// /*Download Button onclick*/document.getElementById("mass_download_downloadbutton").onclick = function() {initiateMdlWTags()};

$(".hoverb").on("click",  function(e) {
    switch (e.currentTarget.innerText) {
        case "Download":
            chrome.tabs.create({url: chrome.runtime.getURL("/downloader/downloader.html")})
            break;

        case "History":
            chrome.tabs.create({url: chrome.runtime.getURL("/history/history.html")})
            break;

        case "Settings":
            chrome.tabs.create({url: chrome.runtime.getURL("/settings/settings.html")})
            break;
    
        default:
            break;
    } 
})



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

/**
 * send message to background script to open chan in a new tab
 */
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

        chrome.storage.local.get(["enabled", "arrangefiles", "savefolder", "prevsearch", "autofav", "newwindow", "mp4swebms", "middleclickfav", "mass_download_limit", "mass_download_concurrentlimit", "mass_download_offset"], function(result) {
            console.log('extension enabled: ' + result.enabled)
            console.log('arrangefiles value currently is ' + result.arrangefiles)
            console.log('savefolder value currently is ' + result.savefolder);
            console.log('previous search value currently is ' + result.prevsearch);
            setthethings(result.enabled, result.arrangefiles, result.savefolder);
            update_options_page(result.enabled, result.arrangefiles, result.savefolder, result.prevsearch, result.autofav, result.newwindow, result.mp4swebms, result.middleclickfav, result.mass_download_limit, result.mass_download_concurrentlimit, result.mass_download_offset);
          })
}

function update_options_page(n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11)
{
    $("#enabled").attr("checked", n1);
    $("#arrangefiles").attr("checked", n2);
    $("#savefolder").val(n3);
    $("#tagstosearch").val(n4);
    $("#autofav").attr("checked", n5)
    $("#newwindow").attr("checked", n6)
    $("#mp4swebms").attr("checked", n7)
    $("#middleclickfav").attr("checked", n8)
    $("#mass_download_limit").val(n9);
    $("#mass_download_concurrentlimit").val(n10);
    $("#mass_download_offset").val(n11);
}

/*chrome.storage.local.get(['key'], function(result) {
    console.log('Value currently is ' + result.key);
  });      */

function setthethings(n1, n2, n3){
    //alert("SankakuCacher save dir is " + n3);
    if ((n1 == undefined) && (n2 == undefined))
    {
        default_settings()
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