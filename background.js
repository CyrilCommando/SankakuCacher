// background.js


//thanks mf v3
//importScripts("settingshelp.js")
//importScripts("saveFile.js")


function wow_A_Function(download_link, isMassDownload = false)
{
  chrome.storage.local.get(["savefolder", "advanced_settings_object", "mass_download_prevtags"], function(newResult) { 



      //do a proper regex for that then
      //fuck it

      
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

        console.log(isMassDownload)
        if (isMassDownload)
        {
          if (newResult.mass_download_prevtags != "")
          {
            svfld += newResult.mass_download_prevtags.replaceAll(":", "_")
            svfld = svfld.replaceAll(">=", "greater_than_")
            svfld = svfld.replaceAll("<=", "less_than_")
            svfld += "/"
          }
          else if (newResult.mass_download_prevtags == "")
          {
            svfld += "homepage"
            svfld += "/"
          }
        }
        console.log(svfld)

        chrome.downloads.download({url: "https:" + download_link, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
       /*if url*/  ////////callback fucking heck 
 //chrome.tabs.getSelected
  }) //chrome.storage.local.get
}

function default_settings()
{
    var aso = new AdvancedSettingsObject();
    chrome.storage.local.set({"enabled": false, "mp4swebms": false, "arrangefiles": false, "savefolder": "SankakuCacher", "autofav": false, "newwindow": false, "middleclickfav": true, "advanced_settings_object": aso, "mass_download_limit": 20, "mass_download_concurrentlimit": 5, "mass_download_offset": 0, "HMenu_downloadanimatedgifs": false, "HMenu_downloadfullvideos": false, "resizecontent": true, "scrolltocontent": true})
    chrome.runtime.sendMessage({"message": "alert", value: "Settings set to default"})
}

function delete_all_settings()
{
    chrome.storage.local.remove(["enabled", "mp4swebms", "arrangefiles", "savefolder", "prevsearch", "autofav", "newwindow", "middleclickfav", "advanced_settings_object", "mass_download_limit", "mass_download_concurrentlimit", "mass_download_offset"])
    //chrome.storage.local.clear()
    chrome.runtime.sendMessage({"message": "alert", value: "settings deleted"})
    default_settings()
}

class AdvancedSettingsObject
{
    constructor(param1 = false, param2 = false) {
        this.character = param1;
        this.date = param2;
    }
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

        case "mass_download_limit":
            
            chrome.storage.local.set({"mass_download_limit": htmlelement.value})
            break;
            
        case "mass_download_concurrentlimit":
            
            chrome.storage.local.set({"mass_download_concurrentlimit": htmlelement.value})
            break;

        case "mass_download_offset":
            
            chrome.storage.local.set({"mass_download_offset": htmlelement.value})
            break;

        case "HMenu_downloadanimatedgifs":

            chrome.storage.local.set({"HMenu_downloadanimatedgifs": htmlelement.checked})
            break;

        case "HMenu_downloadfullvideos":

            chrome.storage.local.set({"HMenu_downloadfullvideos": htmlelement.checked})
            break;
        
        case "resizecontent":

            chrome.storage.local.set({"resizecontent": htmlelement.checked})
            break;

        case "scrolltocontent":

            chrome.storage.local.set({"scrolltocontent": htmlelement.checked})
            break;
    }
    //var x = document.getElementById("savefolder");
    //chrome.storage.local.set({"savefolder": htmlelement.value})
}





























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

chrome.contextMenus.create({contexts: ["image"], documentUrlPatterns: ["https://chan.sankakucomplex.com/", "https://chan.sankakucomplex.com/?tags*", "https://chan.sankakucomplex.com/post/*"], id: "downloadbuttonId", title:"Download"})

chrome.contextMenus.create({contexts: ["all"], documentUrlPatterns: ["https://chan.sankakucomplex.com/", "https://chan.sankakucomplex.com/?tags*", "https://chan.sankakucomplex.com/post/*"], id: "historymenubuttonId", title:"History"})

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
