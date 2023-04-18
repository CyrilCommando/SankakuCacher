/**
 * 
 * @summary welcome to crazy wario's wario microgame emporium
 */
function xmlhttpReq2(url)
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