// background.js

browser.runtime.onInstalled.addListener(function(details)
{
  default_settings();
})

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

var positiveinstance = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    switch (request.message) {
      case "chan":

        openLinkInBrowser();
        break;

      case "settoinstance":

        positiveinstance = true; 
        break;

      case "alert":
        alert(request.value)
        break;

      case "fuckgoogle":
        browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
          browser.tabs.sendMessage(tabs[0].id, {message: tabs[0].url}, undefined)
      }) 
      break;

      case "link":
      
        chrome.storage.local.get(["savefolder", "mp4swebms", "enabled", "advanced_settings_object"], function(newResult) { 

        browser.tabs.query({active: true}).then(tab => {

          //do a proper regex for that then
          if (tab[0].url != "https://chan.sankakucomplex.com/") 
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