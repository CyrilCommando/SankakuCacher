// background.js

chrome.runtime.onInstalled.addListener(function(details)
{
  default_settings();
  // chrome.contextMenus.create({contexts: ["image"], documentUrlPatterns: ["https://chan.sankakucomplex.com/", "https://chan.sankakucomplex.com/?tags*", "https://chan.sankakucomplex.com/post/*"], id: "downloadbuttonId", onclick: function ()
  // {
  //   console.log("fuck me mommy")
  //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //     chrome.tabs.sendMessage(tabs[0].id, {message: "context_menu_clicked_download"})
  // }) 
  // }
  // , 
  // title:"Download"})
})

chrome.contextMenus.create({contexts: ["image"], documentUrlPatterns: ["https://chan.sankakucomplex.com/", "https://chan.sankakucomplex.com/?tags*", "https://chan.sankakucomplex.com/post/*"], id: "downloadbuttonId", onclick: function ()
{
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "context_menu_clicked_download"})
}) 
}
, 
title:"Download"})

chrome.contextMenus.create({contexts: ["all"], documentUrlPatterns: ["https://chan.sankakucomplex.com/", "https://chan.sankakucomplex.com/?tags*", "https://chan.sankakucomplex.com/post/*"], id: "historymenubuttonId", onclick: function ()
{
  chrome.tabs.create({url: chrome.extension.getURL("/history/history.html")})
}
, 
title:"History"})

chrome.contextMenus.create({contexts: ["browser_action"], documentUrlPatterns: [], id: "settingsmenubuttonId", onclick: function ()
{
  chrome.tabs.create({url: chrome.extension.getURL("/settings/settings.html")})
}
, 
title:"Settings"})

class AdvancedSettingsObject
{
    constructor(param1 = false, param2 = false) {
        this.character = param1;
        this.date = param2;
    }
}

function default_settings()
{
    var aso = new AdvancedSettingsObject();
    chrome.storage.local.set({"enabled": false, "mp4swebms": false, "arrangefiles": false, "savefolder": "SankakuCacher", "autofav": false, "newwindow": true, "middleclickfav": true, "advanced_settings_object": aso})
}

function xmlhttpReq(url)
{
  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    console.log("xhr SENT")
  }

  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {

      //if image link is undefined (if not an image)
      if ($(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src") == undefined)
      {
        //preview source link
        var v = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src");
        var y = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").attr("href");
      
        //download link for videos (unused probably)
        downloadLink = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").attr("src")
        wow_A_Function(downloadLink)
      }
      else{
        
        var v = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src");
        var y = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").attr("href");
      
        //download link for images
        if (y === undefined)
        {
          downloadLink = v
          wow_A_Function(downloadLink)
        }
      
        else
        {
          downloadLink = y
          wow_A_Function(downloadLink)
        }
      }
    }
}
}

var positiveinstance = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    switch (request.message) {

      //download from history menu
      case "xhr":
        xmlhttpReq(request.link)
        break;
      
      case "chan":

        openLinkInBrowser();
        break;

      case "setpostid":

        break;

      case "settoinstance":

        positiveinstance = true; 
        break;

      case "alert":
        alert(request.value)
        break;

      case "fuckgoogle":
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(sender.tab.id, {message: sender.tab.url}, undefined)
      }) 
      break;

      case "link":
      
        chrome.storage.local.get(["savefolder", "mp4swebms", "enabled", "advanced_settings_object"], function(newResult) { 

        chrome.tabs.getSelected(tab => {

          //do a proper regex for that then
          //fuck it
          if ((tab.url != "https://chan.sankakucomplex.com/") || (tab.url == "https://chan.sankakucomplex.com/"))
          {
          
            var includeshttps = request.url[0] + request.url[1] + request.url[2] + request.url[3] + request.url[4];
          
            if (includeshttps == "https")
            {
              request.url = request.url.substring(6)
            } 
      
            var name = request.url.substr(34, 36)
      
            if (name[33] + name[34] + name[35] === "web")
            {
              name = name + "m"
            }
      
            
            var svfld ="SankakuCacher/"
      
            
            if (newResult.savefolder == "SankakuCacher")
            {
              //break;
            }
            else 
            {
              //check if the input filename has a slash in it
              if (newResult.savefolder.substr(0, 1) == "/") 
              {
                alert(newResult.savefolder.substr(0, 1))
                newResult.savefolder = newResult.savefolder.substr(1);
              } 

              if (newResult.savefolder.substr(-1, 1) == "/")
              {
                alert(newResult.savefolder.substr(-1, 1))
                newResult.savefolder = newResult.savefolder.substr(-1,) 
              }

            svfld = newResult.savefolder + "/"
          
            }
              
            enabled = newResult.enabled;
            if (name[33] + name[34] + name[35] + name[36] === "webm" || name[33] + name[34] + name[35] === "mp4")
            {
                if (newResult.mp4swebms == true && positiveinstance == false && enabled == true)
                {
                  if (newResult.advanced_settings_object.character == true)
                  {
                    svfld = svfld + request.character_tag + "/"
                  }
                  if (newResult.advanced_settings_object.date == true)
                  {
                    svfld = svfld + request.date + "/"
                  }
                    chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                    positiveinstance = false;
                }
                else if (positiveinstance == true)
                {
                  if ((enabled == true) || (positiveinstance == true))
                  {
                    if (newResult.advanced_settings_object.character == true)
                    {
                      svfld = svfld + request.character_tag + "/"
                    }
                    if (newResult.advanced_settings_object.date == true)
                    {
                      svfld = svfld + request.date + "/"
                    }
                    chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                    positiveinstance = false;
                  }
                  else{positiveinstance = false;}
                }
                else{}
            } //if is webm/mp4
            else if (name[33] + name[34] + name[35] + name[36] != "webm" || name[33] + name[34] + name[35] != "mp4")
            {
              if ((enabled == true) || (positiveinstance == true))
              {
                  if (newResult.advanced_settings_object.character == true)
                  {
                    svfld = svfld + request.character_tag + "/"
                  }
                  if (newResult.advanced_settings_object.date == true)
                  {
                    svfld = svfld + request.date + "/"
                  }
                  if ((newResult.advanced_settings_object.character == false) && (newResult.advanced_settings_object.date == false))
                  {
                    // chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                    // positiveinstance = false;
                  }
                  chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                  positiveinstance = false;
              }
              else{positiveinstance = false;}
            } //if not webm/mp4
          } /*if url*/ else{} ////////callback fucking heck 
        }); //chrome.tabs.getSelected
      }) //chrome.storage.local.get
        break;

      default:

        break;
    }
});

function openLinkInBrowser()
{
  chrome.storage.local.get("newwindow", function (newResult) { 
    if (newResult.newwindow)
    {
      chrome.windows.create({url: "https://chan.sankakucomplex.com", state: "maximized"})
    }
    else chrome.tabs.create({url: "https://chan.sankakucomplex.com"});
  })
}

function getData(sKey) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(sKey, function(newResult) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(newResult);
      }
    });
  });
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    //sendMessage − chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

function wow_A_Function(download_link)
{
  chrome.storage.local.get(["savefolder", "advanced_settings_object"], function(newResult) { 

    chrome.tabs.getSelected(tab => {

      //do a proper regex for that then
      //fuck it
      if ((tab.url != "https://chan.sankakucomplex.com/") || (tab.url == "https://chan.sankakucomplex.com/"))
      {
      
        var includeshttps = download_link[0] + download_link[1] + download_link[2] + download_link[3] + download_link[4];
      
        if (includeshttps == "https")
        {
          download_link = download_link.substring(6)
        } 
  
        var name = download_link.substr(34, 36)
  
        if (name[33] + name[34] + name[35] === "web")
        {
          name = name + "m"
        }
  
        
        var svfld ="SankakuCacher/"
  
        
        if (newResult.savefolder == "SankakuCacher")
        {
          //break;
        }
        else 
        {
          //check if the input filename has a slash in it
          if (newResult.savefolder.substr(0, 1) == "/") 
          {
            alert(newResult.savefolder.substr(0, 1))
            newResult.savefolder = newResult.savefolder.substr(1);
          } 

          if (newResult.savefolder.substr(-1, 1) == "/")
          {
            alert(newResult.savefolder.substr(-1, 1))
            newResult.savefolder = newResult.savefolder.substr(-1,) 
          }

        svfld = newResult.savefolder + "/"
      
        }

        chrome.downloads.download({url: "https:" + download_link, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
      } /*if url*/ else{} ////////callback fucking heck 
    }); //chrome.tabs.getSelected
  }) //chrome.storage.local.get
}