//get the tab url
chrome.runtime.sendMessage({"message": "fuckgoogle"})

//listener to tab URL
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message != "https://chan.sankakucomplex.com/")
  {
    getImageTags();
  }
  if (request.message.match("(https:\/\/chan\.sankakucomplex\.com\/post\/show\/)[1-9]*"))
  {
    if ($(document.getElementById("image")).is("img"))
    {
      //document.getElementById("image").crossOrigin = "anonymous"
      var img = $("<img></img>").attr({"src": document.getElementById("image").src, "crossOrigin": "anonymous", "id": "canvasimg", "style": "display: none;"}).on("load", function(e){createHistoryMenuEntry(request.message.substr(42,), "Viewed", "postpage")})
      $("#image").after(img)
    }
  }
}
)

var context_menu_pid = undefined;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.message == "context_menu_clicked_download")
  {
    console.log("f m s")
    xmlhttpReq(context_menu_pid, operatingthumbnail, false, true);
  }
})

clearbs();

//$("head").append( $("meta").attr({"content": "no-referrer", "name": "referrer"}) )

var operatingthumbnail;

var holdclicktimeout;

var hasHeldDownClick;

console.log(chrome.extension.getURL("/history/history.html"))

apply();

prepare();

getTheGodDamnLink();

addDownloadButton();

var charactertag;

var dt;

aparse();

var downloadLink;

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

/**prepare DOM for preview*/
function prepare()
{
  preview_parent_container = $("<div></div>").attr({"style": "height: 0px;", "id": "preview-parent_container"})
  
  $("div#news-ticker").before(preview_parent_container)
}

/**
 * 
 * @param {string} postid 
 * @param {string} menu 
 * @param {string} type 
 * type "postpage", "preview" or "download"
 */
function createHistoryMenuEntry(postid, menu, type)
{
  let ifExistsEntry = false;
  b64image = createBase64Image(type)
  var options = {}
  options[''+postid]= b64image;
  console.log(options)
  imagedataentry = new ImageDataEntry(b64image)
  entry = new ListEntry(postid, Date.parse(new Date()), "https://chan.sankakucomplex.com/post/show/"+postid)
  chrome.storage.local.get([menu], function(result) {
    try {
      operlist = new History(result[menu].list);
      var iteration = 1;
      operlist.list.forEach(historyEntry => {
        if (historyEntry.pid == postid)
        {
          console.log("history entry exists. removing & adding")
          operlist.list.splice(operlist.list.indexOf(historyEntry), 1)
          operlist.list.push(entry)
        }
        else if (historyEntry.pid != postid)
        {
          if (iteration + 1 > operlist.list.length)
          {
            console.log("added new history entry to history db")
            operlist.list.push(entry)
          }
          else
          {
            console.log("searching through history entries")
            iteration += 1
          }
        }
      });
    } catch (error) {
      console.log(error)
      console.log("first time menu list creation")
      operlist = new History([]);
      operlist.list.push(entry)
    }
    var sets = {}
    sets[menu] = operlist
    chrome.storage.local.set(sets)
  })
  // chrome.storage.local.remove(postid, function(x){console.log("removed "+postid)})
  chrome.storage.local.get([postid], function(result){
    if ((result[postid] == undefined) || (result[postid] == "data:,"))
    {
      chrome.storage.local.set(options, function(x){console.log("set "+postid)})
    }
    else if ((result[postid] != undefined) || (result[postid] != "data:,"))
    {
      console.log("post id "+postid+" appears to already exist in database. not overwriting")
    }
  })
}

class DatabaseLookupTable
{

}

class ImageDataEntry
{
  constructor(pid, base64)
  {
    //this.pid = pid
    this.b64image = base64
  }
}

class ListEntry 
{
    constructor (pid, date, posturl)
    {
        this.pid = pid
        this.date = date
        this.posturl = posturl
    }
}

class History
{
    constructor (list)
    {
        this.list = list;
    }
}

/**create base 64 image from preview tab */
function createBase64Image(type) {
  // Create an empty canvas element
  if (type == "postpage")
  {
    var img = document.getElementById("canvasimg")
  }
  else if (type == "preview")
  {
    var img = document.getElementsByClassName("preview_image_or_video_tag")[0]
    img.crossOrigin = "anonymous";
  }
  var canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // Copy the image contents to the canvas
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Get the data-URL formatted image
  // Firefox supports PNG and JPEG. You could check img.src to
  // guess the original format, but be aware the using "image/jpg"
  // will re-encode the image.
  var dataURL = canvas.toDataURL("image/png");
  console.log("b64 img created")
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

var isFullscreen = false;

var isNotFullscreenDimensionsHeight;
var isNotFullscreenDimensionsWidth;
var isNotFullscreenPositionVertical;
var isNotFullscreenPositionHorizontal;

function toggleFullscreen()
{
  if (isFullscreen)
  {
    undoFullScreen()
  }
  else if (!isFullscreen)
  {
    makeFullScreen()
  }
}

function makeFullScreen()
{
  $("#preview-all_container").attr("style", "position: fixed; display: flex; background-color: #0808089e; height: 100vh; width: 100%; justify-content: center; align-items: center; z-index: 111111;")
  $(".preview_image_or_video_tag").attr("style", "max-height: 100vh; max-width: 100%; border: 4px solid #bdbdbd;")
  $("#preview-image_container").attr("style", "width: fit-content;")
  isFullscreen = true;
}

function undoFullScreen()
{
  $("#preview-all_container").attr("style", "position: relative;  z-index: 111111; display: inline-block; left: "+ isNotFullscreenPositionHorizontal +"px; top: "+ isNotFullscreenPositionVertical +"px;")
  $("#preview-image_container").attr("style", "")
  $(".preview_image_or_video_tag").attr("style", "border: 4px solid #bdbdbd; max-height: " + isNotFullscreenDimensionsHeight + "px; max-width: " + isNotFullscreenDimensionsWidth + "px;")
  isFullscreen = false;
}

function makeVideoPlayer(e)
{
  //remove if it exists (it shouldn't)
  removePreview()

    
  preview_all_container = $("<div></div>").attr({"style": "position: relative; left: -1187px; z-index: 111111; display: inline-block;", "id": "preview-all_container"})

  //get position of thumb
  var topposition = e.currentTarget.getBoundingClientRect().top + window.scrollY;
  var bottomposition = e.currentTarget.getBoundingClientRect().bottom + window.scrollY;
  var leftposition = e.currentTarget.getBoundingClientRect().left;
  var rightposittion = e.currentTarget.getBoundingClientRect().right;
  thumbresheight = parseInt($(e.currentTarget).attr("height")) 
  thumbreswidth = parseInt($(e.currentTarget).attr("width"))

  //create video player
  var preview = $("<video></video>");
  $(preview).attr("style", "max-width: 970px; max-height: 580px; border: 4px solid #bdbdbd;")
  $(preview).attr("src", "")
  $(preview).attr("class", "preview_image_or_video_tag")
  $(preview).attr("referrerpolicy", "no-referrer")
  $(preview).attr("controls", "")
  $(preview).attr("autoplay", "")
  $(preview).attr("loop", "")

  //assign proper preview position on load
  $(preview).on("progress", function() 
  {
    console.log("preview size: "+$(this).width() + 'x' + $(this).height()); 

    var h = topposition; 
    h -= $(this).height(); 
    h -= 8; 
    //assign vertical position
    //check if vertical position is out of bounds
    if (h <0)
    {
      h = 0 + window.scrollY;
      $("#preview-all_container").css("top", h); 
    }
    else{$("#preview-all_container").css("top", h); }

    var lp = leftposition; 
    lp -= $(this).width() * 0.5; 
    lp += thumbreswidth * 0.5; 
    //assign horizontal position
    //check if horizontal position is out of bounds
    if (lp<0)
    {
      lp = 0;
      $("#preview-all_container").css("left", lp);
    }
    else if(lp+$(this).width()>$(window).width())
    {
      lp = $(window).width() - $(this).width()
      lp -= 8
      $("#preview-all_container").css("left", lp);
    }
    else{$("#preview-all_container").css("left", lp);}

    //fix preview-close_button position
    $("#preview-close_button").css("bottom", $(this).height() + 4)
  })

  //make metadata div //video container div & append video element to it
  var div = $("<div></div>").attr({"style": "width: 0px; height: 0px;"})
  $(div).attr("id", "preview-video_container")
  $(div).append($("<meta></meta>").attr({"name": "referrer", "content": "no-referrer"}))
  $(div).attr("style", "max-width: 970px; max-height: 580px;")
  $(div).append(preview)

  //append close button to video container
  var cb = createPreviewCloseButton();
  $(div).append(cb)
  
  //append preview
  $(preview_all_container).append(div)

  //append all
  $("#preview-parent_container").append(preview_all_container)

  document.getElementsByClassName("preview_image_or_video_tag")[0].muted = true;
}
/**only for videos now */
function createPreviewCloseButton()
{
  x = $("<div></div>").attr({"id": "preview-close_button", "style": "position: relative; left: 4px; bottom: 26px; width: fit-content;"})
  y = $("<input>").attr({"type": "button", "value": "x", "style": "padding: 0px; width: 34px; height: 20px;"})
  $(y).on("click", function(e) {removePreview();})
  $(x).append(y)
  return x;
}

//
function createPreviewMenuBar()
{
  var div = $("<div></div>").attr({"id": "preview-menu_bar", "style": "display: flex;justify-content: space-between; max-height: 25px; margin-top: -25px;"}) //position: relative;bottom: 25px;
  cb = createMenuBarCloseButton();
  dlb = createMenuBarDownloadButton();
  fsb = createMenuBarFullscreenButton();
  $(div).append(cb, dlb, fsb)
  return div;
}

function createMenuBarFullscreenButton()
{
  i = $("<img>").attr({"src": chrome.extension.getURL("fs1.png"), "style": "max-height: 20px; max-width: 34px; background-color: #dedede"}).hover(function(e){$(this).attr({"style": "max-height: 20px; max-width: 34px; background-color: #bdbdbd", "id": "fullscreen_button"})}, function(e){$(this).attr({"style": "background-color: #dedede; max-height: 20px; max-width: 34px;", "id": "fullscreen_button"})}).click(toggleFullscreen)
  return i
}

function createMenuBarDownloadButton()
{
  i = $("<img>").attr({"src": chrome.extension.getURL("dl.png"), "style": "max-height: 20px; max-width: 34px; background-color: #dedede"}).hover(function(e){$(this).attr({"style": "max-height: 20px; max-width: 34px; background-color: #bdbdbd", "id": "download_button"})}, function(e){$(this).attr({"style": "background-color: #dedede; max-height: 20px; max-width: 34px;", "id": "download_button"})}).click(getTheGodDamnLink3)
  return i;
}

function createMenuBarCloseButton()
{
  y = $("<input>").attr({"type": "button", "value": "x", "style": "padding: 0px; width: 34px; height: 20px;", "id": "close_button"})
  $(y).on("click", function(e) {removePreview();})
  return y;
}
//

function generateBase64Entry()
{
  
}

/**
 * 
 * @param {Image} image 
 * @returns {string} postID
 */
function getPostIdOfHoveredImage(image)
{
  return $(image).parent().parent().attr("id").substr(1,)
}

/**apply event handlers to thumbnails on screen*/
function apply()
{
setTimeout(() => {
  apply();
  //console.log("apply")
}, 500);
$("div#content").find("img.preview").off("mouseenter mouseleave")
$("div#content").find("img.preview").hover(setPreviewImage, unsetPreviewImage)
$("div#sp1").remove();

$(".thumblink").off("mousedown")
$(".thumblink").on("mousedown", function(e)
{
  if (e.buttons == 1) {
    holdclicktimeout = setTimeout(() => {
      hasHeldDownClick = true;
      if (hasHeldDownClick)
      {
        $(".thumblink").off("click")
        $(e.currentTarget).on("click", function(e){console.log("we made it here boys"); e.preventDefault(); hasHeldDownClick = false; $(e.currentTarget).off("click")})
        try 
        {
          setCssOnElement(operatingthumbnail)
          addPreviewImg(operatingthumbnail)
        } 
        catch (error) 
        {
          console.log("weren't hovering over a thumbnail")
        }
      }
    }, 500);
  }
  if (e.buttons == 2)
  {
    let postid = getPostIdOfHoveredImage(operatingthumbnail.currentTarget)
    console.log(postid)
  
    context_menu_pid = postid;

    //chrome.runtime.sendMessage({"message": "setpostid", pid: postid})

    //xmlhttpReq(postid, operatingthumbnail, false, true);
  }
})

$(".thumblink").off("mouseup")
$(".thumblink").on("mouseup", function(e)
{
  clearTimeout(holdclicktimeout)
  hasHeldDownClick = false;
})

}

function setCssOnElement(element)
{
  $(element.currentTarget).css({"transition": "outline 0.5s cubic-bezier(0, -2.37, 0.02, 4.64) 0s", "outline": "4px solid springgreen", "animation-delay": "0.5s", "animation-duration": "0.1s", "animation-name": "continue"})
  setTimeout(() => {
    $(element.currentTarget).css({"transition": "", "outline": "", "animation-delay": "", "animation-duration": "", "animation-name": ""})
  }, 500);
}

function unsetPreviewImage(e)
{
  operatingthumbnail = undefined;
}

function setPreviewImage(e)
{
  operatingthumbnail = e;
}

/**add preview image to container*/
function addPreviewImg(e)
{
  removePreview()
    
  preview_all_container = $("<div></div>").attr({"style": "position: relative; left: -1187px; z-index: 111111; display: inline-block;", "id": "preview-all_container"})
  preview_image_container = $("<div></div>").attr({"id": "preview-image_container"})

  postid = getPostIdOfHoveredImage(e.currentTarget)
  console.log(postid)

  xmlhttpReq(postid, e);

  //thumb position and preview size
  var topposition = e.currentTarget.getBoundingClientRect().top + window.scrollY;
  var bottomposition = e.currentTarget.getBoundingClientRect().bottom + window.scrollY;
  var leftposition = e.currentTarget.getBoundingClientRect().left;
  var rightposittion = e.currentTarget.getBoundingClientRect().right;
  thumbresheight = parseInt($(e.currentTarget).attr("height")) 
  thumbreswidth = parseInt($(e.currentTarget).attr("width"))

  var preview = $("<img></img>");
  $(preview).attr("style", "max-width: 970px; max-height: 580px; border: 4px solid #bdbdbd;") 
  $(preview).attr("src", "")
  $(preview).attr("class", "preview_image_or_video_tag")
  $(preview).attr("referrerpolicy", "no-referrer")

  //assign preview image position
  $(preview).on("load", function() 
  {
    console.log("preview size: "+this.width + 'x' + this.height);
    isNotFullscreenDimensionsHeight = this.height;
    isNotFullscreenDimensionsWidth = this.width;
    //

    //calc top pos
    var h= topposition; 
    h -= this.height; 
    h -= 8; 

    //assign vertical position
    //check if vertical position is out of bounds
    if (h <0)
    {
      h = 0 + window.scrollY;
      $("#preview-all_container").css("top", h); 
      isNotFullscreenPositionVertical = h;
    }
    else{$("#preview-all_container").css("top", h); isNotFullscreenPositionVertical = h; }
    
    //

    
    //

    //calc vert pos
    var lp = leftposition; 
    lp -= this.width * 0.5; 
    lp += thumbreswidth * 0.5; 

    //assign horizontal position
    //check if horizontal position is out of bounds
    if (lp<0)
    {
      lp = 0;
      $("#preview-all_container").css("left", lp);
      isNotFullscreenPositionHorizontal = lp;
    }
    else if(lp+$(this).width()>$(window).width())
    {
      lp = $(window).width() - $(this).width()
      lp-=8
      $("#preview-all_container").css("left", lp);
      isNotFullscreenPositionHorizontal = lp;
    }
    else{$("#preview-all_container").css("left", lp); isNotFullscreenPositionHorizontal = lp;}

    createHistoryMenuEntry(postid, "Previewed", "preview")

    //
  })

  //append image DOM element to image container
  $(preview_image_container).append(preview)

  //append close button to preview image container
  // var cb = createPreviewCloseButton();
  // $(preview_image_container).append(cb)

  //append menu bar to preview image container
  mb = createPreviewMenuBar()
  $(preview_image_container).append(mb)

  //append preview image container to all container
  $(preview_all_container).append(preview_image_container)

  //append all
  $("#preview-parent_container").append(preview_all_container)
}

/**remove preview-all_container */
function removePreview(e)
{
  $("#preview-all_container").remove()
  isFullscreen = false;
  isNotFullscreenDimensionsHeight = undefined;
  isNotFullscreenDimensionsWidth = undefined;
  isNotFullscreenPositionVertical = undefined;
  isNotFullscreenPositionHorizontal = undefined;
}

function clearbs() {
  setTimeout(() => {
    $("div[style*='-webkit-tap-highlight-color: transparent !important; background: none !important; border: 0px !important; display: block !important; height: 100vh !important; left: 0px !important; margin: 0px !important; outline: 0px !important; padding: 0px !important; position: fixed !important; top: 0px !important; width: 100vw !important; z-index: 2147483647 !important;'").remove();
    $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647;'").remove();
    $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647 !important;'").remove();
    $("div[style*='border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.3) 0px 3px 5px; cursor: pointer; display: flex; height: 100%; overflow: hidden; transform: translateX(0px); transition: background-color 0.3s ease 0s, transform 0.3s ease 0s; width: 100%;'").remove();
    $("body[style*='box-sizing: border-box; font: 16px / 1.4 medium-content-sans-serif-font, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, Montserrat, \"Open Sans\", \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; height: 100%; margin: 0px; overflow: hidden; padding: 8px; -webkit-tap-highlight-color: transparent; text-size-adjust: none; user-select: none; width: 100%; color: rgb(65, 74, 89);'").remove();
    $(".eww").remove()
    $("iframe").remove()
    clearbs();
  }, 1000);
  }

/**add script button for adding fav class and creatting relative create function for IMG element*/
function addInvisibleScriptButton(post_id, element)
{
  post_id = post_id;

  var button = document.createElement("button");
  button.id = "invisiblescriptbutton"
  if (!$(element).find("img").hasClass("favorited"))
  {
    $(element).find("img").addClass("favorited")
    button.setAttribute("onclick", "var post_id = " + post_id + "; Favorite.create(post_id)")
    button.setAttribute("style", "width: 0px; height: 0px;")
  }
  else if ($(element).find("img").hasClass("favorited"))
  {
    $(element).find("img").removeClass("favorited")
    button.setAttribute("onclick", "var post_id = " + post_id + "; Favorite.destroy(post_id)")
    button.setAttribute("style", "width: 0px; height: 0px;")
  }
  document.body.appendChild(button);
}

/**parse entire dom for thumbnail elements and apply custom */
function aparse() {

  setTimeout(() => {
    aparse();
  }, 500);

var x = Array.prototype.slice.call(document.getElementsByClassName("thumb"))

x.forEach(element => {
  $(element).children("a").attr("class", "thumblink")
});
preventdefaultthumblink();
}

/**prevent default thumblink behavior and handle */
function preventdefaultthumblink()
{
  chrome.storage.local.get(["middleclickfav"], function(result) {



    if (result.middleclickfav == true) {
    //console.log("result was true")
    
    var thumblinks = Array.prototype.slice.call(document.getElementsByClassName("thumblink"))

    thumblinks.forEach(element => {

      //get post id of element
      var pid = $(element).parent().attr("id").substr(1,)

      //when clicking thumbnail element
      element.onauxclick = (e => { 
        e.preventDefault()

        //for each thumblink apply auxclick
        if(e.button == 1)
          {//alert("how did it get here")
            addInvisibleScriptButton(pid, element);
            $("#invisiblescriptbutton").trigger("click")
            console.log("middleclick")
          }
        $("#invisiblescriptbutton").remove();
      })
    });     }   else{}    }) //////////////////////CALLBACK FUCKING HECK
}


/**get image tags (if url ==) */
function getImageTags()
{
  elearr = Array.prototype.slice.call(document.getElementById("tag-sidebar").getElementsByClassName("tag-type-character"))

  var highest;
  var lowesttag;
  var tagname;

  //character tags (find lowest)
  for (let index = 0; index < elearr.length; index++) {
    element = elearr[index];
    console.log($(element).find("span span").text())
    this_number = parseInt($(element).find("span span").text())
      if (index == 0) 
      {
        highest = this_number;
        lowesttag = element;
        tagname = ($(element).find(":first-child").text())
        tagname = tagname.substr(0, tagname.length - 1)
        console.log(tagname)
      }
      else if (this_number <= highest)
      {
          highest = this_number;
          lowesttag = element;
          tagname = ($(element).find(":first-child").text())
          tagname = tagname.substr(0, tagname.length - 1)
          console.log(tagname)

      }
      else //(this_number >= highest) 
      {
      }
  }
console.log(highest + " " + tagname)
charactertag = tagname;

//date
//if (ds == enabled)

date = new Date();
time = createTime(date.getDate(), date.getMonth() +1, date.getFullYear())
dt = time;


}

function createTime(day, m, y)
{
  time = y + "-" + m + "-" + day; 
  return time;
}


/** adds autofav enabled script */
   
function addscript()
{
  post_id = document.getElementById("post-view").firstChild.nextSibling.innerText;


  var script = document.createElement("script");
  script.id = "autofavscript"
  script.innerHTML = "customfavfunction = function(){var post_id = document.getElementById(\"post-view\").firstChild.nextSibling.innerText; var enabled = true; if (enabled == true) {Favorite.create(post_id)}}"
  document.body.appendChild(script);
}





/** adds autofav disabled script */

function addscript2()
{
  post_id = document.getElementById("post-view").firstChild.nextSibling.innerText;

  var script = document.createElement("script");
  script.id = "autofavscript"
  script.innerHTML = "customfavfunction = function(){var post_id = document.getElementById(\"post-view\").firstChild.nextSibling.innerText; var enabled = false; if (enabled == true) {Favorite.create(post_id)}}"
  document.body.appendChild(script);
}







/** adds download buttons to content */
function addDownloadButton()
{

  var div = $("<div></div>");
  div.attr("style", "padding-top: 250px;")
  var button = $("<input>").attr("type", "button").attr("value", "Download").attr("id", "DownloadButton").click(getTheGodDamnLink2).attr("onclick", "customfavfunction();")
  var lowerbutton = $("<input>").attr("type", "button").attr("value", "Download").attr("id", "DownloadButton2").click(getTheGodDamnLink2).attr("onclick", "customfavfunction();")

  div.append(button)
  
  $("#post-content").before(div);

  $("#post-content").attr("style", "padding-top: 0px;")

  $("#post-content").after(lowerbutton)
} 

/**get the link to src image URL (on /post/show/*) */
function getTheGodDamnLink()
{
  var v = $("#image").attr("src");
  var y = $("#image-link").attr("href");

  if (y === undefined)
  {
    chrome.runtime.sendMessage({"message": "link", url: v, character_tag: charactertag, date: dt})
  }

  else
  {
    chrome.runtime.sendMessage({"message": "link", url: y, character_tag: charactertag, date: dt})
  }
}

  /**get the link to src image URL (on /post/show/* if image is maximized && || instance download) */
function getTheGodDamnLink2()
{
  var v = $("#image").attr("src");
  var y = $("#image-link").attr("href");
  var z = $("#image-link").attr("src");

  if (y === undefined)
  {
    chrome.runtime.sendMessage({message: "settoinstance"})
    chrome.runtime.sendMessage({"message": "link", url: v, character_tag: charactertag, date: dt})
  }

  else if ((v === undefined) && (y === undefined))
  {
    chrome.runtime.sendMessage({message: "settoinstance"})
    chrome.runtime.sendMessage({"message": "link", url: z, character_tag: charactertag, date: dt})
  }

  else
  {
    chrome.runtime.sendMessage({message: "settoinstance"})
    chrome.runtime.sendMessage({"message": "link", url: y, character_tag: charactertag, date: dt})
  }
}

function getTheGodDamnLink3()
{
  console.log("success")
  console.log(downloadLink)
  
    chrome.runtime.sendMessage({message: "settoinstance"})
    chrome.runtime.sendMessage({"message": "link", url: downloadLink, character_tag: charactertag, date: dt})
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if( request.message == "acquirelink" ) {
    getTheGodDamnLink2();
  }

  if (request.message == "urlresp")
  {
    console.log(request.tab.url)
    console.log("SankakuCacherX")
  }

  if (request.message == "change_autofav_variable")
  {
    chrome.storage.local.get(['autofav'], function(result) {
      
      if (result.autofav == true)
      {
        $("#autofavscript").remove();
        addscript();
      }

      else if (result.autofav == false)
      {
        $("#autofavscript").remove();
        addscript2();
      }
    })
  }
}
);

  "<div id=\"dlbutton\" style=\"padding-top: 250px\;\> <input type=\"button\" value=\"Download\"\> </div>"
  