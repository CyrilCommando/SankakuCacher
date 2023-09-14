/**make XMLHttpRequest with PID and image DOM element (2nd var UNUSED) ((DOUBLE SYKE IT ACTUALLY IS USED!!! FUCK*/
function xmlhttpReq(pid, e, isPreview = true, isContextMenu = false, ind, limit)
{
  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    // console.log("xhr SENT")
  }

  xhr.open("GET", "https://chan.sankakucomplex.com/post/show/"+pid);
  xhr.responseType = "document";
  xhr.send();
  return new Promise(function (resolve, reject) {
  xhr.onreadystatechange = function() {
    if (this.readyState !== 4) return;
    if (this.status >= 200 && this.status < 300) {

      xhr_received_page = this.responseXML

      //log image url
      console.log("image link: "+$(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src"))

      //log video url
      console.log("video link: "+$(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").find("source").attr("src"))

      //if image link is undefined (if not an image)
      if ($(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src") == undefined)
      {
        if (isPreview)
        {
          $("#preview-all_container").remove()
          makeVideoPlayer(e)
          $(".preview_image_or_video_tag").attr("src", $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").find("source").attr("src"))
        }
        //preview source link
        var v = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src");
        var y = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").attr("href");
      
        //download link for videos (unused probably)
        downloadLink = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").find("source").attr("src")
      }
      else{
        if (isPreview)
        {
          $(".preview_image_or_video_tag").attr("src", $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src"))
        }
        var v = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src");
        var y = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").attr("href");
      
        //download link for images
        if (y === undefined)
        {
          downloadLink = v
        }
      
        else
        {
          downloadLink = y
        }
      }
      
      if (isContextMenu)
      {
        getTheGodDamnLink3()
      }
      resolve(this.responseXML)
    }
    else{
      console.log("request failed")
      if (this.status == 429) 
      {
        chrome.runtime.sendMessage({message: "alert", value: "Rate limited - " + ind + " out of " + limit + " images downloaded"})
      }
      reject(ind + 1, this.status)
    }
}
});
}