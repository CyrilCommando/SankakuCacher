//image64ToImage();

//var toggled=false;

var dynamicobjectobject = {};

var image_postid;

var current_page = 1;

var pages_added = false;

var page_image_limit = 50 //999999999999;

var transform_ratio = window.outerWidth / 738

var ws_transform_ratio = 0.60

var transform_ratio_ws = (window.outerWidth / 738) + (window.outerWidth / 738 * ws_transform_ratio)

var history_entry_list;

var search_bar;

var sb_text;

var timeout;

var timeout2;

var lessthan5mssincelastkeypressed = false;

document.getElementById("menu").onchange = function(e) {
  pages_added = false; 
  populateList()
}

populateList()

document.getElementById("sb").oninput = function(e) {
  if (e.target.value == "") {
    pages_added = false;
    search_bar = false; sb_text = e.target.value; populateList(); 
  } else {
    search_bar = true; sb_text = e.target.value; populateList(1, true);
  }
  }

chrome.contextMenus.remove("Hide")

chrome.contextMenus.create({contexts: ["image"], documentUrlPatterns: [chrome.extension.getURL("/history/history.html")], id: "Hide", onclick: function ()
{
  editHistoryMenuEntry(document.getElementById("menu").value, image_postid, true)
}
, 
title:"Hide"})

// createImagefromUrl(base64)

function getHistoryMenuEntries()
{
  chrome.storage.local.get(["Previewed"], function(result) {
      operlist = new History(result.Previewed.list);
      operlist.list.forEach(historyEntry => {
        console.log(historyEntry)
      });
  })
}

function editHistoryMenuEntry(menu, postid, hidden)
{
  chrome.storage.local.get([menu], function(result) {
      operlist = new History(result[menu].list);
      operlist.list.forEach(historyEntry => {
        if (historyEntry.pid == postid)
        {
          historyEntry.hidden = hidden
          mObj = {}
          mObj[''+menu]= operlist;
          chrome.storage.local.set(mObj)
          console.log("hid "+postid+": "+hidden)
        }
      });
  })
}

class History
{
    constructor (list)
    {
        this.list = list;
    }
}

function apply_to_anchors()
{
  var anchors = Array.prototype.slice.call(document.getElementsByTagName("a"))

anchors.forEach(element => {
        element.onclick = function(event){
        event.preventDefault()
        if(element.innerText != current_page)
        {
          anchors.forEach(numbertwo => {
            $(numbertwo).attr("style", "")
          });
          $(element).attr("style", "text-decoration: underline;")
          current_page = element.innerText;
          populateList(element.innerText, search_bar, true)
        }
        }
});
}

function createPreviewMenuBar(posturl)
{
  var div = $("<div></div>").attr({"class": "preview-menu_bar"}) //position: relative;bottom: 25px;
  dlb = createMenuBarDownloadButton(posturl);
  //fsb = createMenuBarFullscreenButton();
  ob = createMenuBarOpenButton(posturl)
  $(div).append(dlb, ob)
  return div;
}

function createMenuBarDownloadButton(posturl)
{
  i = $("<img>").attr({"src": chrome.extension.getURL("dl.png"), "style": "max-height: 20px; max-width: 34px; background-color: #dedede"}).hover(function(e){$(this).attr({"style": "max-height: 20px; max-width: 34px; background-color: #bdbdbd", "id": "download_button"})}, function(e){$(this).attr({"style": "background-color: #dedede; max-height: 20px; max-width: 34px;", "id": "download_button"})}).click(function(){chrome.runtime.sendMessage({"message": "xhr", "link": posturl})})
  return i;
}

function createMenuBarFullscreenButton()
{
  i = $("<img>").attr({"src": chrome.extension.getURL("fs1.png"), "style": "max-height: 20px; max-width: 34px; background-color: #dedede"}).hover(function(e){$(this).attr({"style": "max-height: 20px; max-width: 34px; background-color: #bdbdbd", "id": "fullscreen_button"})}, function(e){$(this).attr({"style": "background-color: #dedede; max-height: 20px; max-width: 34px;", "id": "fullscreen_button"})}).click(console.log("thats a nice placeholder dude"))
  return i
}

function createMenuBarOpenButton(posturl)
{
  i = $("<img>").attr({"src": chrome.extension.getURL("open.png"), "style": "max-height: 20px; max-width: 34px; background-color: #dedede"}).hover(function(e){$(this).attr({"style": "max-height: 20px; max-width: 34px; background-color: #bdbdbd", "id": "open_button"})}, function(e){$(this).attr({"style": "background-color: #dedede; max-height: 20px; max-width: 34px;", "id": "open_button"})}).click(function(){chrome.tabs.create({url: posturl})})
  return i
}

/**
 * takes div & checks size
 */
function checkSize(e)
{
  // e = document.getElementById(e.id)
  console.log("checksize")
  var h = e.getBoundingClientRect().top
  var lp = e.getBoundingClientRect().left
  var rp = e.getBoundingClientRect().right
  var bp = e.getBoundingClientRect().bottom
  console.log(h)
  console.log(lp)

  if (e.firstChild.width > e.firstChild.height)
  {
    var use_transform_ratio = transform_ratio_ws
  }
  else{
    var use_transform_ratio = transform_ratio
  }

  var transformed_image_height = e.firstChild.height * use_transform_ratio + ((3 * use_transform_ratio) * 2)
  var transformed_image_width = e.firstChild.width * use_transform_ratio + ((3 * use_transform_ratio) * 2)

    //assign vertical position
    //check if vertical position is out of bounds
    //(treat size as box)
    if ((use_transform_ratio * e.firstChild.height - e.firstChild.height) / 2 > h)
    {                       //219.7                  156           54.925
      $(e).css("top", Math.abs(((transformed_image_height - e.firstChild.height) / 2) - h) ) 
      //isNotFullscreenPositionVertical = h;
    }
    else if(bp + (use_transform_ratio * e.firstChild.height - e.firstChild.height ) /2 >window.innerHeight)
    {
      $(e).css("bottom", Math.abs(bp + (transformed_image_height - e.firstChild.height) /2 - window.innerHeight));
      //isNotFullscreenPositionHorizontal = lp;
    }
    else
    {
      //$(e).css("top", h); //isNotFullscreenPositionVertical = h; 
    }
    
    //

    
    //

    //assign horizontal position
    //check if horizontal position is out of bounds
    if ((use_transform_ratio* e.firstChild.width - e.firstChild.width) /2 > lp)
    {
      $(e).css("left", Math.abs((transformed_image_width - e.firstChild.width) / 2) - lp)
      //isNotFullscreenPositionHorizontal = lp;
    }
    else if(rp + (use_transform_ratio * e.firstChild.width - e.firstChild.width) /2 >$(window).width())
    {
      $(e).css("right", Math.abs(rp + (transformed_image_width - e.firstChild.width) /2 - $(window).width()));
      //isNotFullscreenPositionHorizontal = lp;
    }
    else
    {
      //$(e).css("left", lp); //isNotFullscreenPositionHorizontal = lp;
    }
}

/**
 * takes a div & checks transform
 */
function toggleTransform(element)
{
  transform_ratio_ws = (window.outerWidth / 738) + (window.outerWidth / 738 * ws_transform_ratio)
  transform_ratio = 3.0//window.outerWidth / 738
  var toggled = false;
  for (const key in dynamicobjectobject) {
    if (key == element.id) 
    {
      toggled = dynamicobjectobject[key];
    }
    else if (key != element.id)
    {
      continue;
    }
  }
  if (!toggled)
  {
    if (element.firstChild.width > element.firstChild.height)
    {
      //while bigger than the screen (height)
      while (element.firstChild.height * transform_ratio_ws + ((3 * transform_ratio_ws) * 2) > window.innerHeight) {
        transform_ratio_ws -= 0.01
      }
      //while bigger than the screen (width)
      while (element.firstChild.width * transform_ratio_ws + ((3 * transform_ratio_ws) * 2) > window.innerWidth) {
        transform_ratio_ws -= 0.01
      }
      //while bigger than full image res
      while (element.firstChild.width * transform_ratio_ws + ((3 * transform_ratio_ws) * 2) > element.firstChild.naturalWidth) {
        transform_ratio_ws -= 0.01
      }
      $(element).attr("style", "transform: scale("+transform_ratio_ws+"); position: relative; z-index: 2;")
    }
    else{
      //while bigger than the screen
      while (element.firstChild.height * transform_ratio + ((3 * transform_ratio) * 2) > window.innerHeight) {
        transform_ratio -= 0.01
      }
      //while bigger than full image res
      while (element.firstChild.height * transform_ratio + ((3 * transform_ratio) * 2) > element.firstChild.naturalHeight) {
        transform_ratio -= 0.01
      }
      $(element).attr("style", "transform: scale("+transform_ratio+"); position: relative; z-index: 2;")
    }
    var img = $(element).children("img").attr("style", "outline: 3px solid yellow;")
    //toggled=true;
    addDynamicToggledVariableToObject(element.id, true)
    // setTimeout(() => {
      checkSize(element)
    // }, 65);
  }
  else if (toggled)
  {
    $(element).attr("style", "")
    $(element).children("img").attr("style", "")
    //toggled=false;
    addDynamicToggledVariableToObject(element.id, false)
  }
}

function addDynamicToggledVariableToObject(id, toggled)
{
  dynamicobjectobject[id] = toggled;
}

/**
 * populates list & adds pages
 */
function populateList(selectedpage = 1, sb = false, sbpersistent = false)
{
  while (document.getElementById("mppane").firstChild) {
    document.getElementById("mppane").removeChild(document.getElementById("mppane").firstChild);
  }
  var x = document.getElementById("menu").value
  console.log(x)
  //get array by menu selected
  chrome.storage.local.get([x], function(result){
    while (document.getElementById("mppane").firstChild) {
      document.getElementById("mppane").removeChild(document.getElementById("mppane").firstChild);
    }
    history_entry_list = result
    console.log(result)
    try {
      //sort array by date
      result[x].list.sort(function(a, b){return b.date - a.date});
      
      //add pages by length / page_image_limit
      if (!sb)
      {
          if (!pages_added){
            pages_added = true;
            addpages(Math.ceil(result[x].list.length/page_image_limit))
          }
        }

      //god fuck i hate the way indexes are counted

      if (sb)
      {
        var excluded_items_array = {};
        excluded_items_array.list = [];
        result[x].list.forEach(HistoryMenuEntry => {
          try {
            HistoryMenuEntry.tags.forEach(tag => {
              if (tag.tag.match("("+sb_text+")"))
              {
                if(!excluded_items_array.list.includes(HistoryMenuEntry))
                {
                  excluded_items_array.list.push(HistoryMenuEntry)
                }
              }
            });
          } catch (error) {
            console.log ("many images don't have tags! old version images must be updated if you want to search for them by tags!")
          }
        });
      }

      if ((sb == true) && (sbpersistent == false))
      {
        addpages(Math.ceil(excluded_items_array.list.length/page_image_limit))
      }

      if (sb)
      {
        var use_array = excluded_items_array
      }

      if(!sb)
      {
        var use_array = result[x]
      }

      // if (sb_text == "")
      // {
      //   addpages(Math.ceil(result[x].list.length/page_image_limit))
      // }

      return_Limited_Array(selectedpage, use_array).forEach(obj => {
        if (!obj.hidden)
        {
          image = new Image();
          image.id = obj.pid
          image.className = "preview_image"
          parent_div = $("<div></div>").attr({"id": obj.pid+"_parent", "class": "preview-parent_div"})
          $(parent_div).append(image)
          $("#mppane").append(parent_div)
          updateImagewithBase64(obj.pid)
          mb = createPreviewMenuBar(obj.posturl)
          $("#"+obj.pid+"_parent").append(mb)
        }
        else{console.log("hid "+obj.pid)}
      });

      //assign transform to images
      var preview_images = Array.prototype.slice.call(document.getElementsByClassName("preview_image"))

      preview_images.forEach(element => {
        element.onclick = function() {toggleTransform(element.parentElement)}
      });

      //track which image to hide
      Array.prototype.slice.call(document.getElementsByClassName("preview_image")).forEach(element => {
        $(element).mousedown(function(e){
          if (e.which == 3)
          {
            image_postid = e.currentTarget.id;
          }
        })
      });
      
    } catch (error) {
      console.log(error)
      console.log("history list not defined")
    }
  })
}

/**
 * return array limited by pagenumber & shuffled by selectedpage
 */
function return_Limited_Array(selectedpage, result)
{
  var beginning_index = selectedpage * page_image_limit - page_image_limit - 1;
  var newarray;
  if (beginning_index < 0)
  {
    beginning_index = 0, newarray = result.list.slice(beginning_index, beginning_index + page_image_limit)
    return newarray
  }
  else if (beginning_index > 0)
  {
    newarray = result.list.slice(beginning_index + 1, beginning_index + page_image_limit + 1)
    return newarray
  }
  else{}
}

function addpages(pagecount)
{
  while (document.getElementById("pageselect").firstChild) {
    document.getElementById("pageselect").removeChild(document.getElementById("pageselect").firstChild);
  }
let elementarray = [];
for (let index = 0; index < pagecount; index++) 
{
  elementarray.push($("<a></a>").attr({"id": "PageNumberId_"+ (index + 1), "class": "page_number_select", "href": "/"}).text((index+1)));
}
elementarray.forEach(item => {
  $("#pageselect").append(item)
});

apply_to_anchors();

$("#PageNumberId_1").attr("style", "text-decoration: underline;")

current_page = 1;

}

function updateImagewithBase64(pid)
{
  chrome.storage.local.get([pid], function(result){
    //console.log(result)
    document.getElementById(pid).src = "data:image/png;base64,"+result[pid];
  })
}

function createImagefromUrl(url)
{
    image = new Image();
    image.src = url;
    image.onload = function() {
        $("#mppane").append(image)
        var x = Array.prototype.slice.call(document.getElementsByTagName("img"))

        x.forEach(element => {
          element.onclick = function() {toggleTransform(element)}
        });
    }
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function image64ToImage() {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = base64;
      image.onload = function() {
          $("#mppane").append(image)
        resolve(this);
      };
      image.onerror = function() {
        reject(this);
      };
    });
  }
  