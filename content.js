//get the tab url
chrome.runtime.sendMessage({"message": "fuckgoogle"})

//listener to tab URL
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message != "https://chan.sankakucomplex.com/")
  {
    getImageTags();
  }
}
)

clearbs();

//$("head").append( $("meta").attr({"content": "no-referrer", "name": "referrer"}) )

var operatingthumbnail;

var holdclicktimeout;

var hasHeldDownClick;

apply();

prepare();

getTheGodDamnLink();

addDownloadButton();

var charactertag;

var dt;

aparse();

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
  popup_image_container = $("<div></div>").attr({"style": "height: 0px;", "id": "popup_image_container"})
  preview_popup_image = $("<div></div>").attr({"style": "position: relative; left: -1187px; z-index: 111111; display: inline-block;", "id": "preview_popup_image"})
  preview_image_image = $("<div></div>").attr({"id": "preview_image_image"})
  $(preview_popup_image).append(preview_image_image)
  $(popup_image_container).append(preview_popup_image)
  $("div#news-ticker").before(popup_image_container)
}

//make XMLHttpRequest with PID and image DOM element
function xmlhttpReq(pid, e)
{
  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    console.log("xhr SENT")
  }

  xhr.open("GET", "https://chan.sankakucomplex.com/post/show/"+pid);
  xhr.responseType = "document";
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {

      //log image url
      console.log("image link: "+$(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src"))

      //log video url
      console.log("video link: "+$(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").attr("src"))

      //if image link is undefined
      if ($(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src") == undefined)
      {
        $(".preview_popup").remove()
        makeVideoPlayer(e)
        $(".preview_popup").attr("src", $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").attr("src"))
      }
      else{
        $(".preview_popup").attr("src", $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src"))
      }
      
    }
}
}

function makeVideoPlayer(e)
{
  //remove if it exists (it shouldn't)
  $("#preview_popup_image").css("left", "-1187px")  
  $(".preview_popup").remove()
  $("#video_container_div").remove()
  $("#preview_close_button").remove()

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
  $(preview).attr("class", "preview_popup")
  $(preview).attr("referrerpolicy", "no-referrer")
  $(preview).attr("controls", "")
  $(preview).attr("autoplay", "")
  $(preview).attr("loop", "")
  $(preview).attr("muted", "")

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
      $("#preview_popup_image").css("top", h); 
    }
    else{$("#preview_popup_image").css("top", h); }

    var lp = leftposition; 
    lp -= $(this).width() * 0.5; 
    lp += thumbreswidth * 0.5; 
    //assign horizontal position
    //check if horizontal position is out of bounds
    if (lp<0)
    {
      lp = 0;
      $("#preview_popup_image").css("left", lp);
    }
    else if(lp+$(this).width()>$(window).width())
    {
      lp = $(window).width() - $(this).width()
      $("#preview_popup_image").css("left", lp);
    }
    else{$("#preview_popup_image").css("left", lp);}

    //fix preview_close_button position
    $("#preview_close_button").css("bottom", $(this).height() + 4)
  })

  //make metadata div
  var div = $("<div></div>").attr({"style": "width: 0px; height: 0px;"})
  $(div).attr("id", "video_container_div")
  $(div).append($("<meta></meta>").attr({"name": "referrer", "content": "no-referrer"}))
  $(div).attr("style", "max-width: 970px; max-height: 580px;")
  $(div).append(preview)

  //append preview
  $("#preview_image_image").append(div)

  //append close button
  var cb = createPreviewCloseButton();
  $("#preview_image_image").append(cb)
}

function createPreviewCloseButton()
{
  x = $("<div></div>").attr({"id": "preview_close_button", "style": "position: relative; left: 4px; bottom: 26px; width: fit-content;"})
  y = $("<input>").attr({"type": "button", "value": "x", "style": "padding: 0px; width: 34px; height: 20px;"})
  $(y).on("click", function(e) {removePreviewImg();})
  $(x).append(y)
  return x;
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
  $("#preview_popup_image").css("left", "-1187px")  
  $(".preview_popup").remove()
  $("#video_container_div").remove()
  $("#preview_close_button").remove()

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
  $(preview).attr("class", "preview_popup")
  $(preview).attr("referrerpolicy", "no-referrer")

  //assign preview image position
  $(preview).on("load", function() 
  {
    console.log("preview size: "+this.width + 'x' + this.height);
    var h= topposition; 
    h -= this.height; 
    h -= 8; 
    if (h <0)
    {
      h = 0 + window.scrollY;
      $("#preview_popup_image").css("top", h); 
    }
    else{$("#preview_popup_image").css("top", h); }
    
    var lp = leftposition; 
    lp -= this.width * 0.5; 
    lp += thumbreswidth * 0.5; 
    if (lp<0)
    {
      lp = 0;
      $("#preview_popup_image").css("left", lp);
    }
    else if(lp+$(this).width()>$(window).width())
    {
      lp = $(window).width() - $(this).width()
      $("#preview_popup_image").css("left", lp);
    }
    else{$("#preview_popup_image").css("left", lp);}
  })

  //append preview
  $("#preview_image_image").append(preview)

  //append close button
  var cb = createPreviewCloseButton();
  $("#preview_image_image").append(cb)
}

function removePreviewImg(e)
{

  $("#preview_popup_image").css("left", "-1187px")  
  $(".preview_popup").remove()
  $("#video_container_div").remove()
  $("#preview_close_button").remove()
}

function clearbs() {
  setTimeout(() => {
    $("div[style*='-webkit-tap-highlight-color: transparent !important; background: none !important; border: 0px !important; display: block !important; height: 100vh !important; left: 0px !important; margin: 0px !important; outline: 0px !important; padding: 0px !important; position: fixed !important; top: 0px !important; width: 100vw !important; z-index: 2147483647 !important;'").remove();
    $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647;'").remove();
    $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647 !important;'").remove();
    $("div[style*='border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.3) 0px 3px 5px; cursor: pointer; display: flex; height: 100%; overflow: hidden; transform: translateX(0px); transition: background-color 0.3s ease 0s, transform 0.3s ease 0s; width: 100%;'").remove();
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
  