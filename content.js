chrome.runtime.sendMessage({"message": "fuckgoogle"})

clearbs();

function clearbs() {
setTimeout(() => {
  $("div[style*='-webkit-tap-highlight-color: transparent !important; background: none !important; border: 0px !important; display: block !important; height: 100vh !important; left: 0px !important; margin: 0px !important; outline: 0px !important; padding: 0px !important; position: fixed !important; top: 0px !important; width: 100vw !important; z-index: 2147483647 !important;'").remove();
  $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647;'").remove();
  $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647 !important;'").remove();
  $("div[style*='border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.3) 0px 3px 5px; cursor: pointer; display: flex; height: 100%; overflow: hidden; transform: translateX(0px); transition: background-color 0.3s ease 0s, transform 0.3s ease 0s; width: 100%;'").remove();
  clearbs();
}, 1000);
}

$("head").append( $("meta").attr({"content": "no-referrer", "name": "referrer"}) )

//$("#header").after($("<img>").attr("src", "https://s.sankakucomplex.com/data/00/12/00120841727b9e1ad63a70d9d461e4f6.jpg?e=1609773527&m=i910QNZ1m-VnyYgdy9K-3A"))

var operatingthumbnail;

var isPreviewTimeoutGoing;

var timeout;

var isPopupPreviewTimeoutGoing;

var hovertimeout;

var holdclicktimeout;

var hasHeldDownClick;

// document.onmouseup = function (e) {
//   hasHeldDownClick = false;
// }

// document.onmousedown = function(e) {
//   if (e.buttons == 1) {
//     hasHeldDownClick = true;
//     e.preventDefault();
//     setTimeout(() => {
//       if (hasHeldDownClick)
//       {
//       try {
//         addPreviewImg(operatingthumbnail)
//       } catch (error) {
//         console.log("weren't hovering over a thumbnail")
//       }
//       }
//     }, 1000);
//   }
// };

apply();

prepare();

function prepare()
{
  popup_image_container = $("<div></div>").attr({"style": "height: 0px;", "id": "popup_image_container"})
  preview_popup_image = $("<div></div>").attr({"style": "position: relative; left: -1187px; z-index: 111111; display: inline-block;", "id": "preview_popup_image"})
  preview_image_image = $("<div></div>").attr({"id": "preview_image_image"})
  $(preview_popup_image).append(preview_image_image)
  $(popup_image_container).append(preview_popup_image)
  $("div#news-ticker").before(popup_image_container)
}

function xmlhttpReq(pid, e)
{
//   $.ajax({
//     url: "https://chan.sankakucomplex.com/post/show/23537167", 
//     cache: false,
//     success: function(response) {
//       $(response).find("#content")
//         //alert(response); // works as expected (returns all html)
//         // returns [object Object]
//     }
// });
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    //console.log(this.responseXML.title);
    console.log("xhr SENT")
  }
  xhr.open("GET", "https://chan.sankakucomplex.com/post/show/"+pid);
  xhr.responseType = "document";
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      //console.log($(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").attr("href"))
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
      //newxmlhttpReq("https:" + $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").attr("href"))
      
    }
}
}

function makeVideoPlayer(e)
{
  var div = $("<div></div>").attr({"style": "width: 0px; height: 0px;"})

  var preview = $("<video></video>");
  var topposition = e.currentTarget.getBoundingClientRect().top + window.scrollY;
  var bottomposition = e.currentTarget.getBoundingClientRect().bottom + window.scrollY;
  var leftposition = e.currentTarget.getBoundingClientRect().left;
  var rightposittion = e.currentTarget.getBoundingClientRect().right;
  thumbresheight = parseInt($(e.currentTarget).attr("height")) // post id = ($(e.currentTarget).parent.attr("href").substr(10,)) 
  thumbreswidth = parseInt($(e.currentTarget).attr("width"))

  //widthvalue
  leftposition -= this.width * 0.5
  //verticalposition = bottomposition - thumbresheight + 2;
  verticalposition = topposition - this.height * 1.0;
  horizontalposition = leftposition //- thumbreswidth * 0.5;

  if (thumbresheight > thumbreswidth)
  {
    // horizontalposition -= thumbreswidth * 0.1
  }
  //console.log(xhr.responseXML)
  $(preview).attr("style", "position: absolute; left: "+horizontalposition+"px; top: "+verticalposition+"px; width: 450px; max-width: 450px; max-height: 442px; z-index: 11111; border: 4px solid #bdbdbd;")
  $(preview).attr("src", "")
  $(preview).attr("class", "preview_popup")
  $(preview).attr("referrerpolicy", "no-referrer")
  $(preview).attr("controls", "")
  $(preview).attr("autoplay", "")
  $(preview).attr("loop", "")
  $(preview).attr("muted", true)

  $(preview).on("load", function() { console.log(this.width + 'x' + this.height)})

  $(div).append($("meta").attr({"name": "referrer", "content": "no-referrer"}))
  $(div).attr("style", "position: absolute; left: "+horizontalposition+"px; top: "+verticalposition+"px; width: 450px; max-width: 450px; max-height: 442px; z-index: 11111; border: 4px solid #bdbdbd;")
  $(div).append(preview)

  $("#content").after(div)
}

function newxmlhttpReq(imageurl)
{
//   $.ajax({
//     url: "https://chan.sankakucomplex.com/post/show/23537167", 
//     cache: false,
//     success: function(response) {
//       $(response).find("#content")
//         //alert(response); // works as expected (returns all html)
//         // returns [object Object]
//     }
// });
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    //console.log(this.responseXML.title);
  }
  xhr.open("GET", imageurl);
  //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.responseType = "document";
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      console.log(imageurl)
      console.log(this.responseXML)
      console.log($(this.responseXML.body).find("img").attr("src"))
    }
}
}

function getResOfThumb(element)
{
  
}

function getPostIdOfHoveredImage(image)
{
  return $(image).parent().parent().attr("id").substr(1,)
}

function apply()
{
setTimeout(() => {
  apply();
  console.log("apply")
}, 1000);
$("div#content").find("img.preview").off("mouseenter mouseleave")
$("div#content").find("img.preview").hover(setPreviewImage, unsetPreviewImage)
$("div#sp1").remove();

// $(".thumblink").off("contextmenu")
// $(".thumblink").contextmenu(function(e) {
//   if (e.buttons == 5 || 1)
//   {
//     console.log("contextmenu buttons was "+e.buttons)
//     e.preventDefault();
//     // try {
//     //   addPreviewImg(operatingthumbnail)
//     // } catch (error) {
//     //   console.log("weren't hovering over a thumbnail")
//     // }
//   }
// })

// $(".thumblink").off("click")
// $(".thumblink").click(function(e) {
//   // console.log("click buttons was "+e.buttons)
//   if (e.buttons == 6 || 2)
//   {
//     e.preventDefault();
//       // try {
//       //   addPreviewImg(operatingthumbnail)
//       // } catch (error) {
//       //   console.log("weren't hovering over a thumbnail")
//       // }
//   }
// })

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

function unsetPreviewImage(e)
{
  operatingthumbnail = undefined;
}

function setPreviewImage(e)
{
  operatingthumbnail = e;
}

function timeoutonhover(e)
{
  isPopupPreviewTimeoutGoing = true;
  hovertimeout = setTimeout(() => {
    addPreviewImg(e);
  }, 1000);
}

function addPreviewImg(e)
{
  $("#preview_popup_image").css("left", "-1187px")  
  $(".preview_popup").remove()
  // if (isPreviewTimeoutGoing)
  // {
  //   clearTimeout(timeout);
  // }
  // else if ((isPreviewTimeoutGoing && isPopupPreviewTimeoutGoing) || (isPopupPreviewTimeoutGoing && isPreviewTimeoutGoing == false)){
  // operatingthumbnail = e.currentTarget;
  // isPreviewTimeoutGoing = false;
  // console.log($(e.currentTarget).parent().attr("href"))
  postid = getPostIdOfHoveredImage(e.currentTarget)
  console.log(postid)
  //xhr = 
  //newxmlhttpReq() 
  xmlhttpReq(postid, e);
  //console.log(e.currentTarget.getBoundingClientRect().top)
  var preview = $("<img></img>");
  var topposition = e.currentTarget.getBoundingClientRect().top + window.scrollY;
  var bottomposition = e.currentTarget.getBoundingClientRect().bottom + window.scrollY;
  var leftposition = e.currentTarget.getBoundingClientRect().left;
  var rightposittion = e.currentTarget.getBoundingClientRect().right;
  thumbresheight = parseInt($(e.currentTarget).attr("height")) // post id = ($(e.currentTarget).parent.attr("href").substr(10,)) 
  thumbreswidth = parseInt($(e.currentTarget).attr("width"))

  //widthvalue
  //leftposition -= parseInt($(".preview_popup").height()) * 0.5;
  //console.log($(".preview_popup").height())

  //verticalposition = bottomposition - thumbresheight + 2;

  //final height value
  //verticalposition = topposition - parseInt($(".preview_popup").height()) * 1.0;

  //final width value
  //horizontalposition = leftposition //- thumbreswidth * 0.5;
  
  thumbmiddle = leftposition + thumbreswidth * 0.5;

  previewmiddle = thumbmiddle;

  if (thumbresheight > thumbreswidth)
  {
    // horizontalposition -= thumbreswidth * 0.1
  }
  //console.log(xhr.responseXML)                                                                            position: absolute; left: -1187px; z-index: 11111; 
  $(preview).attr("style", "max-width: 663px; max-height: 540px; border: 4px solid #bdbdbd;") //472 //442 //540 //width 486 //width 450 //width 560 //width 663
  $(preview).attr("src", "")
  $(preview).attr("class", "preview_popup")
  $(preview).attr("referrerpolicy", "no-referrer")

  //assign the preview image widtth
  $(preview).on("load", function() 
  {
    console.log("preview size: "+this.width + 'x' + this.height); var h= topposition; h -= this.height; h -= 8; $("#preview_popup_image").css("top", h); var lp = leftposition; lp -= this.width * 0.5; lp += thumbreswidth * 0.5; $("#preview_popup_image").css("left", lp);  //$(".preview_popup").attr()
  })

  $("#preview_image_image").append(preview)
//}
}

function removePreviewImg(e)
{

  $("#preview_popup_image").css("left", "-1187px")  
  $(".preview_popup").remove()
  // if(isPopupPreviewTimeoutGoing)
  // {
  //   clearTimeout(hovertimeout)
  //   isPopupPreviewTimeoutGoing = false;
  // }

  
  // isPreviewTimeoutGoing = true;
  // timeout = setTimeout(() => {
  //   if (isPreviewTimeoutGoing)
  //   {
  //   //// $("#preview_popup_image").css("left", "-1187px")  
  //   //// $(".preview_popup").remove()
  //   isPreviewTimeoutGoing = false;
  //   }
  //   else{}
  // }, 1500);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message != "https://chan.sankakucomplex.com/")
  {
    getImageTags();
  }
}
)

getTheGodDamnLink();

addDownloadButton();

//addInvisibleScriptButton();

var charactertag;

var dt;

aparse();

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
      console.log("result was true")
    var thumblinks = Array.prototype.slice.call(document.getElementsByClassName("thumblink"))
    thumblinks.forEach(element => {

      //get post id of element
      var pid = $(element).parent().attr("id").substr(1,)
      //change button script to match post id upon hovering for each element
      //$(element).hover(function () {$("#invisiblescriptbutton").attr("onclick", "middleclickfav("+pid+");")}, function () {$("#invisiblescriptbutton").removeAttr("onclick")})

      //when clicking thumbnail element
      element.onauxclick = (e => { 
        e.preventDefault()
        // chrome.storage.local.get("middleclickfav", () => 
        //   {
            
        //   })
        if(e.button == 1)
          {//alert("how did it get here")
            addInvisibleScriptButton(pid, element);
            $("#invisiblescriptbutton").trigger("click")
            //$(element).attr("onauxclick", "middleclickfav("+pid+");")
            console.log("middleclick")
            //addmiddleclickscript(pid);
          }
        $("#invisiblescriptbutton").remove();
      })
    });     }   else{}    }) //////////////////////CALLBACK FUCKING HECK
}

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



function getImageTags()
{
  elearr = Array.prototype.slice.call(document.getElementById("tag-sidebar").getElementsByClassName("tag-type-character"))

  var highest;
  var lowesttag;
  var tagname;
//character tags
for (let index = 0; index < elearr.length; index++) {
  element = elearr[index];
  console.log($(element).find("span span").text())
  this_number = parseInt($(element).find("span span").text())
  //if ((this_number >= highest) || (index == 0))
    if (index == 0) 
    {
      highest = this_number;
    }
    else if (this_number <= highest)
    {
        highest = this_number;
        lowesttag = element;
        tagname = ($(element).find(":first-child").text())
        tagname = tagname.substr(0, tagname.length - 1)
        console.log($(element).find(":first-child").text())

    }
    else //(this_number >= highest) 
    {
    }
}
console.log(highest + " " + tagname)
charactertag = tagname;

//date
//if (ds == enabled)
{
  date = new Date();
  time = createTime(date.getDate(), date.getMonth() +1, date.getFullYear())
  dt = time;
}

}

function createTime(day, m, y)
{
  time = y + "-" + m + "-" + day; 
  return time;
}

function addmiddleclickscript(post_id)
{
  post_id = post_id;
  // alert(post_id)


  var script = document.createElement("script");
  script.id = "midlclickfavsets"
  script.innerHTML = "middleclickfav = function(){var post_id = " + post_id + "; Favorite.create(post_id)}"
  document.body.appendChild(script);
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
  script.id = "autofavscript"
  script.innerHTML = "customfavfunction = function(){var post_id = document.getElementById(\"post-view\").firstChild.nextSibling.innerText; var enabled = true; if (enabled == true) {Favorite.create(post_id)}}"
  document.body.appendChild(script);
}







function addscript2()
{
  post_id = document.getElementById("post-view").firstChild.nextSibling.innerText;
  // alert(post_id)


  var script = document.createElement("script");
  script.id = "autofavscript"
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
      chrome.runtime.sendMessage({"message": "link", url: v, character_tag: charactertag, date: dt})
    }

    else
    {
      chrome.runtime.sendMessage({"message": "link", url: y, character_tag: charactertag, date: dt})
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

  //chrome.downloads.download({url: y, saveAs: false})
  //sendMessage − chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)

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
        // alert("content listener");
        chrome.storage.local.get(['autofav'], function(result) {
          if (result.autofav == true)
          {
            //document.body.lastChild.remove();
            $("#autofavscript").remove();
            addscript();
          }
          else if (result.autofav == false)
          {
            //document.body.lastChild.remove();
            $("#autofavscript").remove();
            addscript2();
          }
        })
        // chrome.runtime.sendMessage({"message": "alert", "value": "content listener"});
      }
      // if (request.message == "change_middleclick_variable")
      // {
      //   // alert("content listener");
      //   chrome.storage.local.get(['middleclickfav'], function(result) {
      //     if (result.middleclickfav == true)
      //     {
      //       $("#invisiblescriptbutton").remove();
      //       addscript();
      //     }
      //     else if (result.middleclickfav == false)
      //     {
      //       $("#invisiblescriptbutton").remove();
      //       addscript2();
      //     }
      //   })
      //   // chrome.runtime.sendMessage({"message": "alert", "value": "content listener"});
      // }
    }
  );

  "<div id=\"dlbutton\" style=\"padding-top: 250px\;\> <input type=\"button\" value=\"Download\"\> </div>"
  