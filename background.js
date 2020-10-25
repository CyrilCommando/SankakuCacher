// background.js
function openLinkInBrowser()
{
  chrome.storage.local.get("newwindow", function (result) { 
    if (result.newwindow)
    {
      chrome.windows.create({url: "https://chan.sankakucomplex.com", state: "maximized"})
    }
    else chrome.tabs.create({url: "https://chan.sankakucomplex.com"});
  })
}

//document.getElementById("link").click();

var positiveinstance = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {


    //cs.sankakucomplex.com/data/07/93/07931420dae514273fcc74d558cf1d78.jpg?e=1569160039&m=BpaLQUW5X4YC1cAlWLnr4Q
    //cs.sankakucomplex.com/data/48/e7/48e7fcc8474d2ba8c04500a3e5b34401.png?e=1573833330&m=zm9Pk4o5f2WvA3--hK9XfA

    // switch (request.message) {
    //   case "chan":
    //     openLinkInBrowser();
    //     break;
    
    //   default:
    //     break;
    // }


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

      case "link":
        //alert(request.url) ////////////////////////
        
        var includeshttps = request.url[0] + request.url[1] + request.url[2] + request.url[3] + request.url[4];
      
        if (includeshttps == "https")
        {
          request.url = request.url.substring(6)
        } 
  
        var name = request.url.substr(34, 36)
      
        //var place = name[33] + name[34] + name[35]
  
        if (name[33] + name[34] + name[35] === "web")
        {
          name = name + "m"
        }
  
        
        var svfld ="SankakuCacher/"
  
  
  
        getData('savefolder').then(function(result) {
          if (result.savefolder == "SankakuCacher")
          {
            //break;
          }
          else 
          {

            //check if the input filename has a slash in it
            if (result.savefolder.substr(0, 1) == "/") 
            {
              alert(result.savefolder.substr(0, 1))
              result.savefolder = result.savefolder.substr(1);
            } 

            if (result.savefolder.substr(-1, 1) == "/")
            {
              alert(result.savefolder.substr(-1, 1))
              result.savefolder = result.savefolder.substr(-1,) 
            }

          svfld = result.savefolder + "/"}
          })
      
          getData('enabled').then(function(result) {
            enabled = result.enabled;
            if (name[33] + name[34] + name[35] + name[36] === "webm" || name[33] + name[34] + name[35] === "mp4")
            {
              getData('mp4swebms').then(function(result) {
                if (result.mp4swebms == true && positiveinstance == false && enabled == true)
                {
                    chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                    positiveinstance = false;
                }
                else if (positiveinstance == true)
                {
                  if ((enabled == true) || (positiveinstance == true))
                  {
                    //alert("https:" + request.url)
                    //alert(svfld + name)
                    chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                    positiveinstance = false;
                  }
                  else{positiveinstance = false;}
                }
                else{}
              });
            }
            else if (name[33] + name[34] + name[35] + name[36] != "webm" || name[33] + name[34] + name[35] != "mp4")
            {
              if ((enabled == true) || (positiveinstance == true))
              {
                //alert("https:" + request.url)
                //alert(svfld + name)
                chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                positiveinstance = false;
              }
              else{positiveinstance = false;}
            }
          })
          break;

        default:

          break;
    }
});

function getData(sKey) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(sKey, function(result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(result);
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