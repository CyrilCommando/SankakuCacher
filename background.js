// background.js
function openLinkInBrowser()
{
  chrome.tabs.create({url: "https://chan.sankakucomplex.com"})
}

//document.getElementById("link").click();

var positiveinstance;

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

    if (request.message === "chan")
    {
      openLinkInBrowser();
    }
    else if (request.message === "settoinstance")
    {
        positiveinstance = true; 
    }
    else if (request.message === "link")
    {

      var includeshttps = request.url[0] + request.url[1] + request.url[2] + request.url[3] + request.url[4];
      
      if (includeshttps == "https")
      {
        request.url = request.url.substring(6)
      } 

    var name = request.url.substr(35, 36)
    
    //var place = name[33] + name[34] + name[35]

    if (name[33] + name[34] + name[35] === "web")
    {
      name = name + "m"
    }

    var svfld ="SankakuCacher/"



    chrome.storage.local.get("savefolder", function(result) {
      if (result.savefolder == "SankakuCacher")
      {
        //break;
      }
      else {

        if (result.savefolder.substr(0, 1) == "/") {
          alert(result.savefolder.substr(0, 1))
          result.savefolder = result.savefolder.substr(1);
        } 
        svfld = result.savefolder + "/"}
    })
    
    chrome.storage.local.get("enabled", function(result) {
      enabled = result.enabled;
      if (name[33] + name[34] + name[35] === "webm" || "mp4")
      {
        chrome.storage.local.get("mp4swebms", function(result) {
          if (result.mp4swebms == true)
          {
            //continue;
          }
          else{}
        })
      }
      
      if ((enabled == true) || (positiveinstance == true))
      {
        chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
        positiveinstance = false;
      }
      else{positiveinstance = false;}
    })

  } });

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    //sendMessage − chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});