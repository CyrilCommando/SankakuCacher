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
/*scrolltocontent onclick*/ document.getElementById("scrolltocontent").onchange = function() {doc_onchanged(document.getElementById("scrolltocontent"))};
/*resizecontent onclick*/ document.getElementById("resizecontent").onchange = function() {doc_onchanged(document.getElementById("resizecontent"))};

/*limit onchange */ document.getElementById("mass_download_limit").onchange = function() {doc_onchanged(document.getElementById("mass_download_limit"))};
/*concurrent limit onchange */ document.getElementById("mass_download_concurrentlimit").onchange = function() {doc_onchanged(document.getElementById("mass_download_concurrentlimit"))};
/*offset onchange */ document.getElementById("mass_download_offset").onchange = function() {doc_onchanged(document.getElementById("mass_download_offset"))};
/*Download Button onclick*/document.getElementById("mass_download_downloadbutton").onclick = function() {initiateMdlWTags()};

//animated gifs onclick
document.getElementById("HMenu_downloadanimatedgifs").onclick = function() {doc_onchanged(document.getElementById("HMenu_downloadanimatedgifs"))}

//full videos onclick
document.getElementById("HMenu_downloadfullvideos").onclick = function() {doc_onchanged(document.getElementById("HMenu_downloadfullvideos"))}

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

        chrome.storage.local.get(["enabled", "arrangefiles", "savefolder", "prevsearch", "autofav", "newwindow", "mp4swebms", "middleclickfav", "HMenu_downloadanimatedgifs", "HMenu_downloadfullvideos", "scrolltocontent", "resizecontent"], function(result) {
            console.log('extension enabled: ' + result.enabled)
            console.log('arrangefiles value currently is ' + result.arrangefiles)
            console.log('savefolder value currently is ' + result.savefolder);
            console.log('previous search value currently is ' + result.prevsearch);
            setthethings(result.enabled, result.arrangefiles, result.savefolder);
            update_options_page(result.enabled, result.arrangefiles, result.savefolder, result.prevsearch, result.autofav, result.newwindow, result.mp4swebms, result.middleclickfav, result.HMenu_downloadanimatedgifs, result.HMenu_downloadfullvideos, result.scrolltocontent, result.resizecontent);
          })
}

function update_options_page(n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12)
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
    $("#HMenu_downloadanimatedgifs").attr("checked", n9)
    $("#HMenu_downloadfullvideos").attr("checked", n10)
    $("#scrolltocontent").attr("checked", n11)
    $("#resizecontent").attr("checked", n12)
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