console.log("content script injected")

try {
  document.getElementById("image").muted=true 
} catch (oh_no_it_wasnt_there_what_a_surprise_whatever_will_i_do) {
  
}

var video_Event_Fired_Once = false;

var postlist_preview_scale_factor = 2.0

var sbDisplaying = false;

var mouseBasePositionReceived = false;

var previousSizeValue;

//get the tab url
chrome.runtime.sendMessage({"message": "fuckgoogle"})

//listener to tab URL
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  localStorage.setItem('exoJsPop101Last', new Date().getTime());
  setInterval(() => {
    console.log('set')
    localStorage.setItem('exoJsPop101Last', new Date().getTime());
  }, 60000);

  if ( ( seconds(localStorage.getItem("plustitial"+"_last_run")) ) || ( seconds(localStorage.getItem("prestitial"+"_last_run")) ) )
  {
    localStorage.setItem("plustitial"+"_last_run", (new Date()).getTime());
    localStorage.setItem("prestitial"+"_last_run", (new Date()).getTime());
    chrome.runtime.sendMessage({message: "reload"})
  }

  mutationObserver.observe(document, observerOptions)

  if (request.message != "https://chan.sankakucomplex.com/")
  {
    //getHighestCharacterTag();
  }
  if (!request.message.match("https://chan.sankakucomplex.com/posts/*"))
  {
    chrome.storage.local.get(["scalersize"], function(result){
      if (true)
      {
        postlist_preview_scale_factor = result.scalersize
        sizeUpPreview()
        sizeApplication.observe(document.getElementsByClassName("content")[0], nOpts)
        paginatorObserver.observe(document.getElementsByClassName("content")[0], nOpts_)
        $(document).keydown(function(keyDownEvent) {
          if (keyDownEvent.keyCode === 17) {
              if (!sbDisplaying)
              {
                modHtml()
                sbDisplaying = true;
              }
          }
        });
        $(document).keyup(function(keyDownEvent) {
          if (keyDownEvent.keyCode === 17) {
              $("#sb").remove()
              sbDisplaying = false;
          }
        });
      }

    })
  }
  if (request.message.match("https://chan.sankakucomplex.com/*/*"))
  {
    chrome.storage.local.get(["HMenu_downloadanimatedgifs", "HMenu_downloadfullvideos", "resizecontent", "scrolltocontent"], function(result){

      if ($("#image").is("img"))
      {
        document.getElementById("image").crossOrigin = "anonymous"
        $("#image").on("load", function(e) {console.log("image loaded"); createHistoryMenuEntry(request.message.substr(41,), "Viewed", "postpage", document)})
      }
      
      else if ($("#image").is("video"))
      {
        // document.getElementById("image").crossOrigin = "anonymous"
        var vid = $("#image")
        // var src1 = "https:"
        var src2 = $(vid).find("source").attr("src")
        // var res = src1.concat(src2)
        $("#image").remove()
        $(vid).attr("src", src2)
        $(vid).attr("crossorigin", "anonymous")
        $(vid).attr("referrerpolicy", "no-referrer")
        $(vid).find("source").remove()
        $(vid).attr("autoplay", true)
        $("#post-content").append(vid)

        idName = "#image"

        watchBuffer = setInterval(updateProgressBar, 500)

        if(result.HMenu_downloadfullvideos)
        {
          $("#image").on("timeupdate", function(e) {console.log("video loaded"); 
          if ((!video_Event_Fired_Once) && (readyNow))
          {
            createHistoryMenuEntry(request.message.substr(41,), "Viewed", "postpage", document)
            video_Event_Fired_Once = true;
          }
          })
        }
        else if(result.HMenu_downloadfullvideos != true)
        {
          $("#image").on("progress", function(e) {console.log("video loaded"); 
          if ((!video_Event_Fired_Once) && (document.getElementById("image").currentTime > 0))
          {
            createHistoryMenuEntry(request.message.substr(41,), "Viewed", "postpage", document)
            video_Event_Fired_Once = true;
          }
          })
        }

      }
      // document.getElementById("image").crossOrigin = "anonymous"
      if (result.resizecontent == true)
      {
        if ($("#image").attr("width") > window.innerWidth)
        {
          $("#image").attr("width", window.innerWidth)
        }
        if ($("#image").attr("height") > window.innerHeight)
        {
          $("#image").attr("height", window.innerHeight)
          // if (document.getElementById("image").src.match(".gif"))
          // {
            $("#image").removeAttr("width")
          // }
        }
      }

      if (result.scrolltocontent == true)
      {
        window.scrollTo(undefined, document.getElementById("image").getBoundingClientRect().top)
      }

    })
    // if ($(document.getElementById("image")).is("img"))
    // {

      
      // var img = $("<img></img>").attr({"src": document.getElementById("image").src, "crossOrigin": "anonymous", "id": "canvasimg", "style": "display: none;"}).on("load", function(e){createHistoryMenuEntry(request.message.substr(42,), "Viewed", "postpage", document)})
      // $("#image").after(img)
    // }
  }
}
)

function modHtml()
{
  var div = "<div id=\"sb\" style=\"background-color: #d3d3d3d9;width: 254px;height: 65px;position: fixed;z-index: 10001;border-radius: 30px;\"><div id=\"words\" style=\"position: fixed;font-size: 12pt;left: 102px;font-family: monospace;\"><span style=\"-webkit-user-select: none;\">Scale:</span><h1 style=\"width: fit-content;position: relative;left: 96px;bottom: 14px;font-size: 19pt;-webkit-user-select: none;\">2.0</h1></div><div id=\"setcontainer\"><div id=\"button\" style=\"height: 20px;margin-left: auto;margin-right: auto;width: 20px;background-color: lightblue;margin-top: 18px;border-radius: 6px;position: relative;left: 0px;\"></div><div id=\"line\" style=\"height: 5px;width: 175px;background-color: black;margin-left: auto;margin-right: auto;top: 35px;\"></div></div></div>"
  $("#preview-parent_container").prepend(div)
  $("#words h1").text(postlist_preview_scale_factor)
  var buttonInitialValue = parseInt($("#button").css("left"))
  $(document).mousemove(function(mouseMoveEvent){

    if (mouseMoveEvent.which === 1)
    {
      if (!mouseBasePositionReceived)
      {
        mouseBasePos = mouseMoveEvent.clientX
        mouseBasePositionReceived = true;
      }

      if (mouseMoveEvent.clientX < mouseBasePos)
      {
        if (mouseBasePos - mouseMoveEvent.clientX > 1)
        {
          $("#button").css("left", (buttonInitialValue - (mouseBasePos - mouseMoveEvent.clientX)))

          
          switch (true) {
            case (Math.abs(buttonInitialValue) + Math.abs((mouseMoveEvent.clientX - mouseBasePos))) / 15 < 2:
              if ("1.9" != previousSizeValue)
              {
                chrome.storage.local.set({"scalersize": 1.9})
                $("#words h1").text("1.9")
                previousSizeValue = $("#words h1").text()
                postlist_preview_scale_factor = 1.9
                sizeUpPreview(true)
              }
              break;
            
            case (Math.abs(buttonInitialValue) + Math.abs((mouseMoveEvent.clientX - mouseBasePos))) / 15 < 3:
              if ("1.8" != previousSizeValue)
              {
                chrome.storage.local.set({"scalersize": 1.8})
                $("#words h1").text("1.8")
                previousSizeValue = $("#words h1").text()
                postlist_preview_scale_factor = 1.8
                sizeUpPreview(true)
              }
              break;
            
            case (Math.abs(buttonInitialValue) + Math.abs((mouseMoveEvent.clientX - mouseBasePos))) / 15 < 4:
              if ("1.7" != previousSizeValue)
              {                
                chrome.storage.local.set({"scalersize": 1.7})
                $("#words h1").text("1.7")
                previousSizeValue = $("#words h1").text()
                postlist_preview_scale_factor = 1.7
                sizeUpPreview(true)
              }
              break;

            case (Math.abs(buttonInitialValue) + Math.abs((mouseMoveEvent.clientX - mouseBasePos))) / 15 < 5:
              if ("1.6" != previousSizeValue)
              {                
                chrome.storage.local.set({"scalersize": 1.6})
                $("#words h1").text("1.6")
                previousSizeValue = $("#words h1").text()
                postlist_preview_scale_factor = 1.6
                sizeUpPreview(true)
              }
              break;

            case (Math.abs(buttonInitialValue) + Math.abs((mouseMoveEvent.clientX - mouseBasePos))) / 15 < 6:
              if ("1.5" != previousSizeValue)
              {                
                chrome.storage.local.set({"scalersize": 1.5})
                $("#words h1").text("1.5")
                previousSizeValue = $("#words h1").text()
                postlist_preview_scale_factor = 1.5
                sizeUpPreview(true)
              }
              break;

            // case (buttonInitialValue + (mouseMoveEvent.clientX - mouseBasePos)) / 15 < 6:
            //   $("#words h1").text("2.5")
            //   break;
            default:
              break;
          }
        }
      }

      else if (mouseMoveEvent.clientX > mouseBasePos)
      {
        if (mouseMoveEvent.clientX - mouseBasePos > 1)
        {
          $("#button").css("left", (buttonInitialValue + (mouseMoveEvent.clientX - mouseBasePos)))

            switch (true) {
              case (buttonInitialValue + (mouseMoveEvent.clientX - mouseBasePos)) / 15 < 1:
                if ("2.0" != previousSizeValue)
                {               
                  chrome.storage.local.set({"scalersize": 2.0})   
                  $("#words h1").text("2.0")
                  previousSizeValue = $("#words h1").text()
                  postlist_preview_scale_factor = 2.0
                  sizeUpPreview(true)
                }
                break;
              
              case (buttonInitialValue + (mouseMoveEvent.clientX - mouseBasePos)) / 15 < 2:
                if ("2.1" != previousSizeValue)
                {                  
                  chrome.storage.local.set({"scalersize": 2.1})
                  $("#words h1").text("2.1")
                  previousSizeValue = $("#words h1").text()
                  postlist_preview_scale_factor = 2.1
                  sizeUpPreview(true)
                }
                break;
              
              case (buttonInitialValue + (mouseMoveEvent.clientX - mouseBasePos)) / 15 < 3:
                if ("2.2" != previousSizeValue)
                {
                  chrome.storage.local.set({"scalersize": 2.2})
                  $("#words h1").text("2.2")
                  previousSizeValue = $("#words h1").text()
                  postlist_preview_scale_factor = 2.2
                  sizeUpPreview(true)
                }
                break;

              case (buttonInitialValue + (mouseMoveEvent.clientX - mouseBasePos)) / 15 < 4:
                if ("2.3" != previousSizeValue)
                {                  
                  chrome.storage.local.set({"scalersize": 2.3})
                  $("#words h1").text("2.3")
                  previousSizeValue = $("#words h1").text()
                  postlist_preview_scale_factor = 2.3
                  sizeUpPreview(true)
                }
                break;

              case (buttonInitialValue + (mouseMoveEvent.clientX - mouseBasePos)) / 15 < 5:
                if ("2.4" != previousSizeValue)
                {                  
                  chrome.storage.local.set({"scalersize": 2.4})
                  $("#words h1").text("2.4")
                  previousSizeValue = $("#words h1").text()
                  postlist_preview_scale_factor = 2.4
                  sizeUpPreview(true)
                }
                break;

              case (buttonInitialValue + (mouseMoveEvent.clientX - mouseBasePos)) / 15 < 6:
                if ("2.5" != previousSizeValue)
                {                  
                  chrome.storage.local.set({"scalersize": 2.5})
                  $("#words h1").text("2.5")
                  previousSizeValue = $("#words h1").text()
                  postlist_preview_scale_factor = 2.5
                  sizeUpPreview(true)
                }
                break;
              default:
                break;
            }
          
        }
      }
    }
  })
}

var sample_img_link;

function sizeUpPreview(newAge = false){
  var x = Array.prototype.slice.call(document.getElementsByClassName("preview"))

  var y = Array.prototype.slice.call(document.getElementsByClassName("thumb"))

  var z = Array.prototype.slice.call(document.getElementsByClassName("popular-preview-post"))

  const preview_max_value = 150

  const span_max_w = 170

  const span_max_h = 180
  
  x.forEach(async function(preview) {
    if (($(preview).attr("resized") == null) || ($(preview).attr("resized") != "true") || (newAge == true))
    {
      if (preview.width > preview.height)
      {
        $(preview).removeAttr("width")
        $(preview).css("height", 150 * postlist_preview_scale_factor)
        // await xmlhttpReq($(preview).parent().parent().attr("id").substr(1,), null, false)
        // if ($(xhr_received_page.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src") == undefined)
        // {
          // var w = $(preview).css("width")
          // var h = $(preview).css("height")
          // var r = $(preview).attr("resized")
          // var cs = $(preview).attr("class")
          // var vid = $("<video></video>")
          // $(vid).attr("class", cs)
          // $(vid).attr("id", "p_"+$(preview).parent().parent().attr("id").substr(1,))
          // $(vid).attr("autoplay", true)
          // $(vid).attr("loop", true)
          // $(vid).attr("resized", r)
          // $(vid).css("height", h)
          // $(vid).css("width", w)
          // $(vid).attr("src", $(xhr_received_page.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").attr("src"))
          // $(vid).attr("crossorigin", "anonymous")
          // $(vid).attr("referrerpolicy", "no-referrer")
          // $(preview).before($("<meta></meta>").attr({"name": "referrer", "content": "no-referrer"}))
          // $(preview).before(vid)
          // document.getElementById("p_"+$(preview).parent().parent().attr("id").substr(1,)).muted = true;
          // $(preview).remove()
        // }
        // else
        // {
          // $(preview).attr("src", $(xhr_received_page.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src"))
          // $(preview).attr("referrerpolicy", "no-referrer")
          // $(preview).attr("crossorigin", "anonymous")
        // }
      }
      else
      {
        $(preview).css("width", parseInt($(preview).attr("width")) * postlist_preview_scale_factor)
        $(preview).css("height", parseInt($(preview).attr("height")) * postlist_preview_scale_factor)
      }
      $(preview).attr("resized", "true")
      $(preview).css("position", "relative")
      if ($(preview).css("border").match("(none)"))
      {
        $(preview).css("border", "2px solid #1d205e00")
      }
    }
  });

  $("div.content").css("width", "auto")

  y.forEach(span => {
    if ((parseInt($(span).css("width")) == span_max_w) || (parseInt($(span).css("height")) == span_max_h) || (newAge == true))
    {
      if ($(span.parentElement).hasClass("popular-preview-post"))
      {

      }

      else
      {
        $(span).css("width", span_max_w * postlist_preview_scale_factor)
        $(span).css("height", span_max_h * postlist_preview_scale_factor)
      }

      var stimg = $(span).find("img.preview")[0]
      

        // console.log("high")
        $(span).css("width", (parseInt($(span).css("width"))  -  (parseInt($(span).css("width")) - stimg.width - 32)) )


      


        var ar = stimg.width/stimg.height
        // console.log("wide")
        // console.log(stimg.naturalWidth)
        // console.log(stimg.naturalHeight)
        // console.log(stimg.naturalWidth + ((270 - stimg.naturalHeight) * ar) + 32)
        if ($(span.parentElement).hasClass("popular-preview-post"))
        {
          $(span.parentElement).css("width", "570px")
          $(span.parentElement).css("height", "inherit")
          $(span).css("width", "-webkit-fill-available")
          $(span).css("margin-left", "16px")
          $(span).css("margin-right", "16px")
        }
        else
        {
          $(span).css("width", "fit-content")
          $(span).css("margin-left", "16px")
          $(span).css("margin-right", "16px")
        }

      $(span).css("height", (parseInt($(span).css("height"))  -  (parseInt($(span).css("height")) - parseInt($(stimg).css("height")) - 32)) )
    }
  });

  z.forEach(div => {
    if (parseInt($(div).css("width")) == span_max_w)
    {
      $(div).css("width", parseInt($(div).css("width")) * postlist_preview_scale_factor)
      $(div).css("height", "inherit")
    }
  });
}

function movePosts(mutationsList)
{
  $("div.content").children().each((ind, div)  => {
    if (div.hasAttribute("next-page-url"))
    {
      if ((!$(div).attr("next-page-url").match("page=2$")) && (div.id != "paginator"))
      {
        var d = div
        $(div).children().each((ind2, ele) => {
          $("div.content").children()[1].append(ele)
        })
      }
    }

  });
}

const mutationObserverTargetNode = document.querySelector("#someElement");
const observerOptions = {
  childList: true,
  // attributes: true,

  // Omit (or set to false) to observe only changes to the parent node
  subtree: true
}

const nOpts = {
  childList: true,
  // attributes: true,

  // Omit (or set to false) to observe only changes to the parent node
  subtree: true
}

const nOpts_ = {
  childList: true,
  // attributes: true,

  // Omit (or set to false) to observe only changes to the parent node
  subtree: false
}

$(".companion--row").remove();

$("#draggableElement").remove();

var paginatorObserver = new MutationObserver(movePosts)

var mutationObserver = new MutationObserver(clearb)

var sizeApplication = new MutationObserver(sizeUpPreview)

var context_menu_pid = undefined;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.message == "context_menu_clicked_download")
  {
    console.log("f m s")
    xmlhttpReq(context_menu_pid, operatingthumbnail, false, true);
  }
})

// clearbs();

//$("head").append( $("meta").attr({"content": "no-referrer", "name": "referrer"}) )

var operatingthumbnail;

var holdclicktimeout;

var hasHeldDownClick;

console.log(chrome.runtime.getURL("/history/history.html"))

apply();

prepare();

getTheGodDamnLink();

addDownloadButton();

var charactertag;

var dt;

var xhr_received_page;

var base64data;

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

/**make XMLHttpRequest for sample image base64*/
function newxmlHttpReq(url)
{
  console.log(url)
  var xhr22222222 = new XMLHttpRequest();

  xhr22222222.open("GET", url);
  xhr22222222.responseType = "blob";
  xhr22222222.send();
  return new Promise(function (resolve, reject) {
  xhr22222222.onreadystatechange = function() {
    if (this.readyState !== 4) return;
    if (this.status >= 200 && this.status < 300) {

      var reader = new FileReader();
      reader.readAsDataURL(this.response); 
      reader.onloadend = function() {
          var b64data = reader.result;                
          // document.getElementById("25333109").src = base64data;
          base64data = b64data;
          resolve("ggggfdgfgdfgfdgfdgfd")
      }
    }
    else{
      console.log("request failed")
      base64data = "data:,";
      reject("dfgdfgsfghdfghxfghfghdfhg ")
    }
}
});
}

function seconds(localStorageLastSetTimeInMilliseconds, interval = 21600) {
  //Math.round(((new Date()).getTime() - parseInt(timeInSeconds))/1000);
            //MILLISECONDS       //SECONDS                                  //SECONDS CONVERSION
            // console.log(new Date().getTime())
            // console.log(localStorageLastSetTimeInMilliseconds)
            // console.log(Math.round( ( new Date().getTime() - parseInt(localStorageLastSetTimeInMilliseconds) ) ) / 1000)
            // console.log(interval)
  if ( Math.round( ( new Date().getTime() - parseInt(localStorageLastSetTimeInMilliseconds) ) ) / 1000 > interval)
  {
    return true
  }

  else return false;
}

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
async function createHistoryMenuEntry(postid, menu, type, page)
{
  let ifExistsEntry = false;
  await createBase64Image(type, page)
  b64image = base64data;
  var options = {}
  options[''+postid]= b64image;
  console.log(options)
  imagedataentry = new ImageDataEntry(b64image)
  entry = new ListEntry(postid, Date.parse(new Date()), "https://chan.sankakucomplex.com/en/posts/"+postid, getImageTags(page))
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
            //console.log("searching through history entries")
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
    constructor (pid, date, posturl, tags)
    {
        this.pid = pid
        this.date = date
        this.posturl = posturl
        this.tags = tags
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
async function createBase64Image(type, page = undefined) {

  var resultVal;

  //postpage
  if (type == "postpage")
  {
    //var img = document.getElementById("canvasimg")

    //if a gif
    // if (document.getElementById("image-link").firstChild.nextSibling.src.substr(40, 36).match(/.gif$/))
    // {
      // var img = document.getElementById("image-link").firstChild.nextSibling
      // var canvas = document.createElement("canvas");
      // canvas.width = img.naturalWidth;
      // canvas.height = img.naturalHeight;

      // // Copy the image contents to the canvas
      // var ctx = canvas.getContext("2d");
      // ctx.drawImage(img, 0, 0);

      // var dataURL = canvas.toDataURL("image/jpeg", 1);
      // console.log("b64 img created")
      // setCssOnElement(document.getElementById("image-link").firstChild.nextSibling, "red", true)
      // base64data = dataURL;
    // }
    //if not a gif
    // else
    // {


      await obtainSynchronous(["HMenu_downloadanimatedgifs", "HMenu_downloadfullvideos"]).then(async function(resultval) {

        //if is a video
        if ($(page.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").attr("src") != undefined)
        {

          if (resultval.HMenu_downloadfullvideos == true)
          {
              await newxmlHttpReq($(page.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").attr("src")).catch(async function(rejectedval){
                console.log(rejectedval)
                await newxmlHttpReq($(page.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").attr("src"))
              })
              setCssOnElement(document.getElementById("image"), "red", true)
          }
          
          else if (resultval.HMenu_downloadfullvideos != true)
          {
            var img = document.getElementById("image")
            var canvas = document.createElement("canvas");


            canvas.width = img.videoWidth;
            canvas.height = img.videoHeight;

  
            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
  
            var dataURL = canvas.toDataURL("image/jpeg", 1);
            console.log("b64 img created")
            // setCssOnElement(document.getElementById("image-link").firstChild.nextSibling, "red", true)
            base64data = dataURL;
            setCssOnElement(document.getElementById("image"), "red", true)
          }

        }

        //not a video
        else if ($(page.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").attr("src") == undefined)
        {

          if ((resultval.HMenu_downloadanimatedgifs == true) || (document.getElementById("image-link").firstChild.nextSibling.src.match(".jpg")))
          {
              await newxmlHttpReq(document.getElementById("image-link").firstChild.nextSibling.src).catch(async function(rejectedval){
                await newxmlHttpReq(document.getElementById("image-link").firstChild.nextSibling.src)
              })
              if ((resultval.HMenu_downloadanimatedgifs == true) && (document.getElementById("image-link").firstChild.nextSibling.src.match(".gif")))
              setCssOnElement(document.getElementById("image"), "red", true)
          }
          
          else if (resultval.HMenu_downloadanimatedgifs != true)
          {
            var img = document.getElementById("image")
            var canvas = document.createElement("canvas");
 
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
  
            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
  
            var dataURL = canvas.toDataURL("image/jpeg", 1);
            console.log("b64 img created")
            // setCssOnElement(document.getElementById("image-link").firstChild.nextSibling, "red", true)
            base64data = dataURL;
            if (document.getElementById("image-link").firstChild.nextSibling.src.match(".gif"))
            {
              setCssOnElement(document.getElementById("image"), "red", true)
            }
          }

        }

      })    

      
    // }
  }
  
  //preview
  else if (type == "preview")
  {
    var img = document.getElementsByClassName("preview_image_or_video_tag")[0]

    //if a gif
    // if (document.getElementsByClassName("preview_image_or_video_tag")[0].src.substr(40, 36).match(/.gif$/))
    // {
    //   var canvas = document.createElement("canvas");
    //   canvas.width = img.naturalWidth;
    //   canvas.height = img.naturalHeight;

    //   // Copy the image contents to the canvas
    //   var ctx = canvas.getContext("2d");
    //   ctx.drawImage(img, 0, 0);

    //   var dataURL = canvas.toDataURL("image/jpeg", 1);
    //   console.log("b64 img created")
    //   setCssOnElement(img, "red", true)
    //   base64data = dataURL;
    // }
    //if not a gif
    // else
    // {

      await obtainSynchronous(["HMenu_downloadanimatedgifs", "HMenu_downloadfullvideos"]).then(async function(resultval) {

        //if is a video
        if ($(page.getElementById("image")).is("video"))
        {

          if (resultval.HMenu_downloadfullvideos == true)
          {
              await newxmlHttpReq(document.getElementsByClassName("preview_image_or_video_tag")[0].src).catch(async function(rejectedval){
                await newxmlHttpReq(document.getElementsByClassName("preview_image_or_video_tag")[0].src)
              })
              setCssOnElement(document.getElementsByClassName("preview_image_or_video_tag")[0], "red", true)
          }
          
          else if (resultval.HMenu_downloadfullvideos != true)
          {
            var canvas = document.createElement("canvas");


              canvas.width = img.videoWidth;
              canvas.height = img.videoHeight;
            
  
            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
  
            var dataURL = canvas.toDataURL("image/jpeg", 1);
            console.log("b64 img created")
            // setCssOnElement(document.getElementById("image-link").firstChild.nextSibling, "red", true)
            base64data = dataURL;
            setCssOnElement(document.getElementsByClassName("preview_image_or_video_tag")[0], "red", true)
          }

        }

        //not a video
        else if (!$(page.getElementById("image")).is("video"))
        {

          if ((resultval.HMenu_downloadanimatedgifs == true) || (page.getElementById("image").src.match(".jpg")))
          {
              //broke as of 09-12
              await newxmlHttpReq(page.getElementById("image").src).catch(async function(rejectedval){
                await newxmlHttpReq(page.getElementById("image").src)
              })

              // var canvas = document.createElement("canvas");

              // canvas.width = img.naturalWidth;
              // canvas.height = img.naturalHeight;
  
              // // Copy the image contents to the canvas
              // var ctx = canvas.getContext("2d");
              // ctx.drawImage(img, 0, 0);
    
              // var dataURL = canvas.toDataURL("image/jpeg", 1);
              // console.log("b64 img created")
              // // setCssOnElement(document.getElementById("image-link").firstChild.nextSibling, "red", true)
              // base64data = dataURL;

              if ((resultval.HMenu_downloadanimatedgifs == true) && (page.getElementById("image").src.match(".gif")))
              {
                setCssOnElement(document.getElementsByClassName("preview_image_or_video_tag")[0], "red", true)
              }
          }
          
          else if (resultval.HMenu_downloadanimatedgifs != true)
          {
            var canvas = document.createElement("canvas");

              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
  
            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
  
            var dataURL = canvas.toDataURL("image/jpeg", 1);
            console.log("b64 img created")
            // setCssOnElement(document.getElementById("image-link").firstChild.nextSibling, "red", true)
            base64data = dataURL;
            if (page.getElementById("image").src.match(".gif"))
            {
              setCssOnElement(document.getElementsByClassName("preview_image_or_video_tag")[0], "red", true)
            }
          }

        }

      })
    // }
  }
  // var canvas = document.createElement("canvas");
  // canvas.width = img.naturalWidth;
  // canvas.height = img.naturalHeight;

  // Copy the image contents to the canvas
  // var ctx = canvas.getContext("2d");
  // ctx.drawImage(img, 0, 0);

  // var dataURL = canvas.toDataURL("image/jpeg", 1);
  // console.log("b64 img created")
  // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

var isFullscreen = false;

var isNotFullscreenDimensionsHeight;
var isNotFullscreenDimensionsWidth;
var isNotFullscreenPositionVertical;
var isNotFullscreenPositionHorizontal;

var videoDuration;

var readyNow = false;

var idName;

function updateProgressBar(){
    if ($(idName).prop('readyState')) {
      videoDuration = $(idName).prop('duration');
        var buffered = $(idName).prop("buffered").end(0);
        var percent = 100 * buffered / videoDuration;

        //Your code here

        // console.log("what the fuc")

        console.log(buffered)
        console.log(videoDuration)

        //If finished buffering buffering quit calling it
        //call it anyway because firefox is weird as ass 2024-02-11
        if (Math.round(buffered) >= Math.round(videoDuration)) {
          readyNow = true;
                clearInterval(this.watchBuffer);
        }
    }
};
var watchBuffer;

function obtainSynchronous(vto)
{
  return new Promise(function(resolve, reject)
  {
    chrome.storage.local.get(vto, function(result)
    {
      resolve(result)
    })
  })
}

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
  $(".preview_image_or_video_tag").attr("style", "max-height: 100vh; max-width: 100%; border: 2px solid #bdbdbd;")
  $("#preview-image_container").attr("style", "width: fit-content;")
  $("#preview-all_container > div:nth-child(2)").css("display", "none")
  isFullscreen = true;
}

function undoFullScreen()
{
  $("#preview-all_container").attr("style", "position: relative;  z-index: 111111; display: inline-block; left: "+ isNotFullscreenPositionHorizontal +"px; top: "+ isNotFullscreenPositionVertical +"px;")
  $("#preview-image_container").attr("style", "")
  $(".preview_image_or_video_tag").attr("style", "border: 2px solid #bdbdbd; max-height: " + isNotFullscreenDimensionsHeight + "px; max-width: " + isNotFullscreenDimensionsWidth + "px;")
  $("#preview-all_container > div:nth-child(2)").css("display", "flex")
  isFullscreen = false;
}

/**
 * make & append video player
 */
function makeVideoPlayer(e)
{
  video_Event_Fired_Once = false;

  clearInterval(watchBuffer)
  watchBuffer = undefined;

  var videoDownloadType = undefined;

  chrome.storage.local.get("HMenu_downloadfullvideos", function(result){
    videoDownloadType = result.HMenu_downloadfullvideos;
  })
  //remove if it exists (it shouldn't)
  removePreview()

  postid = getPostIdOfHoveredImage(e.currentTarget)
  console.log(postid)
    
  preview_all_container = $("<div></div>").attr({"style": "position: relative; left: -1187px; z-index: 111111; display: inline-block;", "id": "preview-all_container"})

  //get position of thumb
  var topposition = e.currentTarget.getBoundingClientRect().top + window.scrollY;
  var bottomposition = e.currentTarget.getBoundingClientRect().bottom + window.scrollY;
  var leftposition = e.currentTarget.getBoundingClientRect().left;
  var rightposittion = e.currentTarget.getBoundingClientRect().right;
  thumbresheight = parseInt($(e.currentTarget).attr("height")) 
  thumbreswidth = e.currentTarget.clientWidth

  //create video player
  var preview = $("<video></video>");
  $(preview).attr("style", "max-width: 970px; max-height: 580px; border: 2px solid #bdbdbd;")
  $(preview).attr("src", "")
  $(preview).attr("class", "preview_image_or_video_tag")
  $(preview).attr("referrerpolicy", "no-referrer")
  $(preview).attr("controls", "")
  $(preview).attr("autoplay", "")
  $(preview).attr("loop", "")
  $(preview).attr("crossorigin", "anonymous")
  $(preview).attr("id", "vidp")

  //assign proper preview position on load
  $(preview).on("timeupdate", function() 
  {
    // console.log("preview size: "+$(this).width() + 'x' + $(this).height()); 

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
    
    idName = "#vidp"

    if (watchBuffer == undefined)
    {
      watchBuffer = setInterval(updateProgressBar, 500)
    }

    if (((!video_Event_Fired_Once) && (document.getElementsByClassName("preview_image_or_video_tag")[0].currentTime > 0) && (readyNow)) || ((videoDownloadType === false) && (!video_Event_Fired_Once) && (document.getElementsByClassName("preview_image_or_video_tag")[0].currentTime > 0)) )
    {
      createHistoryMenuEntry(postid, "Previewed", "preview", xhr_received_page)
      readyNow = false;
      videoDownloadType = undefined;
      video_Event_Fired_Once = true;
    }
  })

  //make metadata div //video container div & append video element to it
  var div = $("<div></div>").attr({"style": "width: 0px; height: 0px;"})
  $(div).attr("id", "preview-video_container")
  $(div).append($("<meta></meta>").attr({"name": "referrer", "content": "no-referrer"}))
  $(div).attr("style", "max-height: 580px;")
  $(div).append(preview)

  //append close button to video container
  var cb = createPreviewCloseButton();
  $(div).append(cb)

  

  //append preview
  $(preview_all_container).append(div)

  var favbarid = getLegacyPostIdOfHoveredImage(e.currentTarget)
  
  var globalfavbar = "<div style=\"\
    height: 120px;\
    width: auto;\
    background-color: #3e3e3e;\
    border: 2px solid darkgrey;\
    display: flex;\
    justify-content: space-evenly;\
    align-content: center;\
    align-items: center;\
\"><div id=\"rating\" style=\"display: inline-block;padding-bottom: 4px;margin-bottom: 20px;\"><ul class=\"unit-rating\">\
<li class=\"star-full\"><a href=\"#\" title=\"1 Star\" class=\"r1-unit\" onclick=\"javascript:Post.vote(1, "+favbarid+"); return false;\"></a></li>\
<li class=\"star-full\"><a href=\"#\" title=\"2 Stars\" class=\"r2-unit\" onclick=\"javascript:Post.vote(2, "+favbarid+"); return false;\"></a></li>\
<li class=\"star-full\"><a href=\"#\" title=\"3 Stars\" class=\"r3-unit\" onclick=\"javascript:Post.vote(3, "+favbarid+"); return false;\"></a></li>\
<li class=\"star-full\"><a href=\"#\" title=\"4 Stars\" class=\"r4-unit\" onclick=\"javascript:Post.vote(4, "+favbarid+"); return false;\"></a></li>\
<li class=\"star-full\"><a href=\"#\" title=\"5 Stars\" class=\"r5-unit\" onclick=\"javascript:Post.vote(5, "+favbarid+"); return false;\"></a></li>\
</ul></div>\
\
    <div id=\"add-to-favs\" style=\"\
    display: inline-block;\
    \
    background: center;\
    text-align: -webkit-center;\
    margin-bottom: 20px;\
\"><a class=\"favoriteIcon\" href=\"#\" onclick=\"Favorite.create("+favbarid+"); return false;\" title=\"Add to favorites\" style=\"\
    margin: 0;\
\"></a></div>\
\
\<div id=\"remove-from-favs\" style=\"\
\
background: center center;\
text-align: -webkit-center;\
margin-bottom: 20px;\
\"><a class=\"favoriteIcon clicked\" href=\"#\" onclick=\"Favorite.destroy("+favbarid+"); return false;\" title=\"Remove from favorites\" style=\"\
margin: 0;\
\"></a></div>\
</div>"

  $(preview_all_container).append(globalfavbar)


  //append all
  $("#preview-parent_container").append(preview_all_container)

  $(e.currentTarget).hasClass("favorited") ? $("#add-to-favs").css("display", "none") : $("#remove-from-favs").css("display", "none")

  document.getElementsByClassName("preview_image_or_video_tag")[0].muted = true;
}
/**only for videos now */
function createPreviewCloseButton()
{
  x = $("<div></div>").attr({"id": "preview-close_button", "style": "position: relative; left: 4px; bottom: 26px; height: 0; width: fit-content;"})
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
  i = $("<img>").attr({"src": chrome.runtime.getURL("fs1.png"), "style": "max-height: 20px; max-width: 34px; background-color: #dedede"}).hover(function(e){$(this).attr({"style": "max-height: 20px; max-width: 34px; background-color: #bdbdbd", "id": "fullscreen_button"})}, function(e){$(this).attr({"style": "background-color: #dedede; max-height: 20px; max-width: 34px;", "id": "fullscreen_button"})}).click(toggleFullscreen)
  return i
}

function createMenuBarDownloadButton()
{
  i = $("<img>").attr({"src": chrome.runtime.getURL("dl.png"), "style": "max-height: 20px; max-width: 34px; background-color: #dedede"}).hover(function(e){$(this).attr({"style": "max-height: 20px; max-width: 34px; background-color: #bdbdbd", "id": "download_button"})}, function(e){$(this).attr({"style": "background-color: #dedede; max-height: 20px; max-width: 34px;", "id": "download_button"})}).click(getTheGodDamnLink3)
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
  return $(image).parent().attr("href").substr(10,)
}

function getLegacyPostIdOfHoveredImage(image)
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
        $(e.currentTarget).on("click", function(e){ e.preventDefault(); hasHeldDownClick = false; $(e.currentTarget).off("click")})
        try 
        {
          setCssOnElement(operatingthumbnail)
          addPreviewImg(operatingthumbnail)
        } 
        catch (error) 
        {
          console.log(error)
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

function setCssOnElement(element, color = "springgreen", isAnActualElement = false)
{
  if (!isAnActualElement)
  {
    $(element.currentTarget).css({"transition": "outline 0.5s cubic-bezier(0, -2.37, 0.02, 4.64) 0s", "outline": "4px solid "+color+"", "animation-delay": "0.5s", "animation-duration": "0.1s", "animation-name": "continue"})
    setTimeout(() => {
      $(element.currentTarget).css({"transition": "", "outline": "", "animation-delay": "", "animation-duration": "", "animation-name": ""})
    }, 500);
  }
  else if (isAnActualElement)
  {
    $(element).css({"transition": "outline 0.5s cubic-bezier(0, -2.37, 0.02, 4.64) 0s", "outline": "4px solid "+color+"", "animation-delay": "0.5s", "animation-duration": "0.1s", "animation-name": "continue"})
    setTimeout(() => {
      $(element).css({"transition": "", "outline": "", "animation-delay": "", "animation-duration": "", "animation-name": ""})
    }, 500);
  }
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
  thumbreswidth = e.currentTarget.clientWidth

  var preview = $("<img></img>");
  $(preview).attr("style", "max-width: 970px; max-height: 580px; border: 2px solid #bdbdbd;") 
  $(preview).attr("src", "")
  $(preview).attr("class", "preview_image_or_video_tag")
  $(preview).attr("referrerpolicy", "no-referrer")
  $(preview).attr("crossorigin", "anonymous");
  $(preview).on("click", toggleFullscreen)

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
    h -= 120;

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

    $(e.currentTarget).hasClass("favorited") ? $("#add-to-favs").css("display", "none") : $("#remove-from-favs").css("display", "none")

    createHistoryMenuEntry(postid, "Previewed", "preview", xhr_received_page)

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


  var favbarid = getLegacyPostIdOfHoveredImage(e.currentTarget)

  var isfaved = $(e.currentTarget).hasClass("favorited")

var globalfavbar = "<div style=\"\
    height: 120px;\
    width: auto;\
    background-color: #3e3e3e;\
    border: 2px solid darkgrey;\
    display: flex;\
    justify-content: space-evenly;\
    align-content: center;\
    align-items: center;\
\"><div id=\"rating\" style=\"display: inline-block;padding-bottom: 4px;margin-bottom: 20px;\"><ul class=\"unit-rating\">\
<li class=\"star-full\"><a href=\"#\" title=\"1 Star\" class=\"r1-unit\" onclick=\"javascript:Post.vote(1, "+favbarid+"); return false;\"></a></li>\
<li class=\"star-full\"><a href=\"#\" title=\"2 Stars\" class=\"r2-unit\" onclick=\"javascript:Post.vote(2, "+favbarid+"); return false;\"></a></li>\
<li class=\"star-full\"><a href=\"#\" title=\"3 Stars\" class=\"r3-unit\" onclick=\"javascript:Post.vote(3, "+favbarid+"); return false;\"></a></li>\
<li class=\"star-full\"><a href=\"#\" title=\"4 Stars\" class=\"r4-unit\" onclick=\"javascript:Post.vote(4, "+favbarid+"); return false;\"></a></li>\
<li class=\"star-full\"><a href=\"#\" title=\"5 Stars\" class=\"r5-unit\" onclick=\"javascript:Post.vote(5, "+favbarid+"); return false;\"></a></li>\
</ul></div>\
\
    <div id=\"add-to-favs\" style=\"\
    display: inline-block;\
    \
    background: center;\
    text-align: -webkit-center;\
    margin-bottom: 20px;\
\"><a class=\"favoriteIcon\" href=\"#\" onclick=\"Favorite.create("+favbarid+"); return false;\" title=\"Add to favorites\" style=\"\
    margin: 0;\
\"></a></div>\
\
\<div id=\"remove-from-favs\" style=\"\
\
background: center center;\
text-align: -webkit-center;\
margin-bottom: 20px;\
\"><a class=\"favoriteIcon clicked\" href=\"#\" onclick=\"Favorite.destroy("+favbarid+"); return false;\" title=\"Remove from favorites\" style=\"\
margin: 0;\
\"></a></div>\
</div>"

  $(preview_all_container).append(globalfavbar)

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

/**
 * clears ads
 */
function clearbs() {
  setTimeout(() => {
    $("div[style*='-webkit-tap-highlight-color: transparent !important; background: none !important; border: 0px !important; display: block !important; height: 100vh !important; left: 0px !important; margin: 0px !important; outline: 0px !important; padding: 0px !important; position: fixed !important; top: 0px !important; width: 100vw !important; z-index: 2147483647 !important;'").remove();
    $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647;'").remove();
    $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647 !important;'").remove();
    $("div[style*='border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.3) 0px 3px 5px; cursor: pointer; display: flex; height: 100%; overflow: hidden; transform: translateX(0px); transition: background-color 0.3s ease 0s, transform 0.3s ease 0s; width: 100%;'").remove();
    $("body[style*='box-sizing: border-box; font: 16px / 1.4 medium-content-sans-serif-font, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, Montserrat, \"Open Sans\", \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; height: 100%; margin: 0px; overflow: hidden; padding: 8px; -webkit-tap-highlight-color: transparent; text-size-adjust: none; user-select: none; width: 100%; color: rgb(65, 74, 89);'").remove();
    $(".eww").remove()
    $("iframe").remove()
    // console.log("SankakuCacher: set localstorage")
    localStorage.setItem("plustitial"+"_last_run", (new Date()).getTime());
    localStorage.setItem("prestitial"+"_last_run", (new Date()).getTime());
    clearbs();
  }, 1000);
  }

function clearb(mutationRecord, mutationwatcher)
{
  $("div[style*='-webkit-tap-highlight-color: transparent !important; background: none !important; border: 0px !important; display: block !important; height: 100vh !important; left: 0px !important; margin: 0px !important; outline: 0px !important; padding: 0px !important; position: fixed !important; top: 0px !important; width: 100vw !important; z-index: 2147483647 !important;'").remove();
  $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647;'").remove();
  $("iframe[style*='border: none !important; bottom: 7px !important; display: block; height: 96px !important; max-width: 405px !important; position: fixed !important; right: 7px !important; top: auto !important; width: 100% !important; z-index: 2147483647 !important;'").remove();
  $("div[style*='border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.3) 0px 3px 5px; cursor: pointer; display: flex; height: 100%; overflow: hidden; transform: translateX(0px); transition: background-color 0.3s ease 0s, transform 0.3s ease 0s; width: 100%;'").remove();
  $("body[style*='box-sizing: border-box; font: 16px / 1.4 medium-content-sans-serif-font, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, Montserrat, \"Open Sans\", \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; height: 100%; margin: 0px; overflow: hidden; padding: 8px; -webkit-tap-highlight-color: transparent; text-size-adjust: none; user-select: none; width: 100%; color: rgb(65, 74, 89);'").remove();
  $(".eww").remove()
  $("iframe").remove()
  // console.log("SankakuCacher: set localstorage")
  localStorage.setItem("plustitial"+"_last_run", (new Date()).getTime());
  localStorage.setItem("prestitial"+"_last_run", (new Date()).getTime());
  $("div#adContainer").remove();
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
function getHighestCharacterTag()
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
  //post_id = document.getElementById("post-view").firstChild.nextSibling.innerText;

  $("#autofavscript").remove();

  var script = document.createElement("script");
  script.src = chrome.runtime.getURL("autofave.js")
  script.id = "autofavscript"
  document.body.appendChild(script);
}





/** adds autofav disabled script */

function addscript2()
{
  //post_id = document.getElementById("post-view").firstChild.nextSibling.innerText;

  $("#autofavscript").remove();

  var script = document.createElement("script");
  script.src = chrome.runtime.getURL("autofavd.js")
  script.id = "autofavscript"
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
    if (v != undefined)
    {
      chrome.runtime.sendMessage({"message": "link", url: v, character_tag: charactertag, date: dt})
    }
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

/**
 * download from preview or context menu
 */
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
  