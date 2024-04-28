// background.js


//thanks mf v3
importScripts("settingshelp.js")
importScripts("saveFile.js")


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

chrome.contextMenus.create({contexts: ["image"], documentUrlPatterns: ["https://chan.sankakucomplex.com/*", "https://chan.sankakucomplex.com/en/*", "https://chan.sankakucomplex.com/en/posts/*"], id: "downloadbuttonId", title:"Download"})

chrome.contextMenus.create({contexts: ["all"], documentUrlPatterns: ["https://chan.sankakucomplex.com/*", "https://chan.sankakucomplex.com/en/*", "https://chan.sankakucomplex.com/en/posts/*"], id: "historymenubuttonId", title:"History"})

chrome.contextMenus.create({contexts: ["action"], id: "settingsmenubuttonId", title:"Settings"})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(info)
  console.log(tab)
  switch (info.menuItemId) {
    case "downloadbuttonId":
      chrome.tabs.sendMessage(tab.id, {message: "context_menu_clicked_download"})
      break;
  
    case "historymenubuttonId":
      chrome.tabs.create({url: chrome.runtime.getURL("/history/history.html")})
      break;
      
    case "settingsmenubuttonId":
      chrome.tabs.create({url: chrome.runtime.getURL("/settings/settings.html")})
      break;

    default:
      break;
  }
})

var positiveinstance = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    switch (request.message) {
      
      //for settings menu & popup window mdl. when the hell did chrome allow xhr to be used by extension pages?
      case"wow_a_function":
      wow_A_Function(request.url, request.isMassDownload)
        break;
      
      case "reload":
        chrome.tabs.reload(sender.tab.id)
        break;

      //download from history menu // broke as of 2022-09-11, mf v3
      case "xhr":
        //xmlhttpReq(request.link)
        alert("still using XHR! REPORT THIS AS BUG")
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
          chrome.tabs.sendMessage(sender.tab.id, {message: sender.tab.url, tSender: sender.tab.id}, undefined)
      }) 
      break;

      case "link":
      
        chrome.storage.local.get(["savefolder", "mp4swebms", "enabled", "advanced_settings_object"], function(newResult) { 

        chrome.tabs.query({active: true}, (tab) => {

          var tab = tab[0]

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
        }); //chrome.tabs.query
      }) //chrome.storage.local.get
        break;

      default:

        break;
    }
});

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    //sendMessage − chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.set({"fixlatency": true})
})



///////////////
///////////////
///////////////
///////////////
///////////////
///////////////
///////////////
///////////////



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