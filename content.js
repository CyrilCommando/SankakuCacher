getTheGodDamnLink();

addDownloadButton();

function favoriteDownloaded()
{
chrome.storage.local.get("autofav", function(result)
{
  if (result.autofav == true)
  {
    Favorite.create(19712056); return false;
    //$("#DownloadButton").click(function() { $(".favoriteIcon").trigger("click") })
    //$("#DownloadButton").click(function() { $("#headerthumbs").click(); })
    //$("#DownloadButton").click(function() { $("#headerthumbs ul li a").trigger("click") } )
  } 
  else{}
})
}




function addDownloadButton()
{

  var div = $("<div></div>");
  div.attr("style", "padding-top: 250px;")
  var element = $("<input>").attr("type", "button").attr("value", "Download").attr("id", "DownloadButton").click(getTheGodDamnLink2)
  var lowerelement = $("<input>").attr("type", "button").attr("value", "Download").attr("id", "DownloadButton2").click(getTheGodDamnLink2)
  div.append(element)

  // $("#post-content").before( "<div id=\"dlbutton\" style=\"padding-top: 250px\;\> <input type=\"button\" value=\"Download\"\> </div>");
  // var element = $("<input>").type("button").text("Download").onclick(getTheGodDamnLink2).style("padding-top: 250px;")
  
  $("#post-content").before(div);

  $("#post-content").attr("style", "padding-top: 0px;")

  $("#post-content").after(lowerelement)

  favoriteDownloaded();
} 

function getTheGodDamnLink()
  {
  var v = $("#image").attr("src");
  var y = $("#image-link").attr("href");

    if (y === undefined)
    {
      chrome.runtime.sendMessage({"message": "link", url: v})
    }

    else
    {
      chrome.runtime.sendMessage({"message": "link", url: y})
    }
  }

  function getTheGodDamnLink2()
  {
    var v = $("#image").attr("src");
    var y = $("#image-link").attr("href");
    var z = $("#image-link").attr("src");

      if (y === undefined)
      {
        chrome.runtime.sendMessage({message: "settoinstance"})
        chrome.runtime.sendMessage({"message": "link", url: v})
      }

      else if ((v === undefined) && (y === undefined))
      {
        chrome.runtime.sendMessage({message: "settoinstance"})
        chrome.runtime.sendMessage({"message": "link", url: z})
      }

      else
      {
        chrome.runtime.sendMessage({message: "settoinstance"})
        chrome.runtime.sendMessage({"message": "link", url: y})
      }
  }

  //chrome.downloads.download({url: y, saveAs: false})
  //sendMessage − chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if( request.message == "acquirelink" ) {
        getTheGodDamnLink2();
      }
    }
  );

  "<div id=\"dlbutton\" style=\"padding-top: 250px\;\> <input type=\"button\" value=\"Download\"\> </div>"