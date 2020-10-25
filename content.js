getTheGodDamnLink();

addDownloadButton();

// addmiddleclickscript();

chrome.storage.local.get(["autofav"], function(result)
{
  if (result.autofav == true)
  {
    addscript();
  }
  else if (result.autofav == false)
  {
    addscript2();
  }
})







function addmiddleclickscript()
{

}






function addscript()
{
  // var script = $("<script> </script>")
  // script.attr("src", "autofavscript.js")
  // script.attr("type", "text/javascript") 

  // $("head").append(script);

  post_id = document.getElementById("post-view").firstChild.nextSibling.innerText;
  // alert(post_id)


  var script = document.createElement("script");
  script.innerHTML = "customfavfunction = function(){var post_id = document.getElementById(\"post-view\").firstChild.nextSibling.innerText; var enabled = true; if (enabled == true) {Favorite.create(post_id)}}"
  document.body.appendChild(script);
}







function addscript2()
{
  post_id = document.getElementById("post-view").firstChild.nextSibling.innerText;
  // alert(post_id)


  var script = document.createElement("script");
  script.innerHTML = "customfavfunction = function(){var post_id = document.getElementById(\"post-view\").firstChild.nextSibling.innerText; var enabled = false; if (enabled == true) {Favorite.create(post_id)}}"
  document.body.appendChild(script);
}








function addDownloadButton()
{

  var div = $("<div></div>");
  div.attr("style", "padding-top: 250px;")
  var button = $("<input>").attr("type", "button").attr("value", "Download").attr("id", "DownloadButton").click(getTheGodDamnLink2).attr("onclick", "customfavfunction();")
  var lowerbutton = $("<input>").attr("type", "button").attr("value", "Download").attr("id", "DownloadButton2").click(getTheGodDamnLink2).attr("onclick", "customfavfunction();")

  div.append(button)

  // $("#post-content").before( "<div id=\"dlbutton\" style=\"padding-top: 250px\;\> <input type=\"button\" value=\"Download\"\> </div>");
  // var element = $("<input>").type("button").text("Download").onclick(getTheGodDamnLink2).style("padding-top: 250px;")
  
  $("#post-content").before(div);

  $("#post-content").attr("style", "padding-top: 0px;")

  $("#post-content").after(lowerbutton)
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
    // alert("here is where it is!")
    // console.log("here is where it also is!")
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
      if (request.message == "change_autofav_variable")
      {
        // alert("content listener");
        chrome.storage.local.get(['autofav'], function(result) {
          if (result.autofav == true)
          {
            document.body.lastChild.remove();
            addscript();
          }
          else if (result.autofav == false)
          {
            document.body.lastChild.remove();
            addscript2();
          }
        })
        // chrome.runtime.sendMessage({"message": "alert", "value": "content listener"});
      }
    }
  );

  "<div id=\"dlbutton\" style=\"padding-top: 250px\;\> <input type=\"button\" value=\"Download\"\> </div>"
  