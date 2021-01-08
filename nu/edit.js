function addPreviewImg(e)
{

  $("#preview_popup_image").css("left", "-1187px")  
  $(".preview_popup").remove()


  postid = getPostIdOfHoveredImage(e.currentTarget)


  xmlhttpReq(postid, e);

  //get position and size of thumbnail 
  var topposition = e.currentTarget.getBoundingClientRect().top + window.scrollY;
  var bottomposition = e.currentTarget.getBoundingClientRect().bottom + window.scrollY;
  var leftposition = e.currentTarget.getBoundingClientRect().left;
  var rightposittion = e.currentTarget.getBoundingClientRect().right;
  thumbresheight = parseInt($(e.currentTarget).attr("height")) // post id = ($(e.currentTarget).parent.attr("href").substr(10,)) 
  thumbreswidth = parseInt($(e.currentTarget).attr("width"))

  
  //create image and assign attrs
  var preview = $("<img></img>");
  $(preview).attr("style", "max-width: 663px; max-height: 540px; border: 4px solid #bdbdbd;") //472 //442 //540 //width 486 //width 450 //width 560 //width 663
  $(preview).attr("src", "")
  $(preview).attr("class", "preview_popup")
  $(preview).attr("referrerpolicy", "no-referrer")

  
  //assign the preview image widtth
  $(preview).on("load", function() 
  {
    console.log("preview size: "+this.width + 'x' + this.height); 

    var h = topposition; 
    h -= this.height; 
    h -= 8; 
    //assign vertical position
    $("#preview_popup_image").css("top", h); 

    var lp = leftposition; 
    lp -= this.width * 0.5; 
    lp += thumbreswidth * 0.5; 
    //assign horizontal position
    $("#preview_popup_image").css("left", lp);
  })

  //append preview
  $("#preview_image_image").append(preview)
}




function makeVideoPlayer(e)
{
  //remove if it exists (it shouldn't)
  $("#preview_popup_image").css("left", "-1187px")  
  $(".preview_popup").remove()

  //get position of thumb
  var topposition = e.currentTarget.getBoundingClientRect().top + window.scrollY;
  var bottomposition = e.currentTarget.getBoundingClientRect().bottom + window.scrollY;
  var leftposition = e.currentTarget.getBoundingClientRect().left;
  var rightposittion = e.currentTarget.getBoundingClientRect().right;
  thumbresheight = parseInt($(e.currentTarget).attr("height")) 
  thumbreswidth = parseInt($(e.currentTarget).attr("width"))

  //create video player
  $(preview).attr("style", "width: 450px; max-width: 663px; max-height: 540px; border: 4px solid #bdbdbd;")
  $(preview).attr("src", "")
  $(preview).attr("class", "preview_popup")
  $(preview).attr("referrerpolicy", "no-referrer")
  $(preview).attr("controls", "")
  $(preview).attr("autoplay", "")
  $(preview).attr("loop", "")
  $(preview).attr("muted", true)

  $(preview).on("load", function() 
  {
    console.log("preview size: "+this.width + 'x' + this.height); 

    var h = topposition; 
    h -= this.height; 
    h -= 8; 
    //assign vertical position
    $("#preview_popup_image").css("top", h); 

    var lp = leftposition; 
    lp -= this.width * 0.5; 
    lp += thumbreswidth * 0.5; 
    //assign horizontal position
    $("#preview_popup_image").css("left", lp);
  })

  //make metadata div
  var div = $("<div></div>").attr({"style": "width: 0px; height: 0px;"})
  $(div).append($("meta").attr({"name": "referrer", "content": "no-referrer"}))
  $(div).attr("style", "width: 450px; max-width: 663px; max-height: 540px; border: 4px solid #bdbdbd;")
  $(div).append(preview)

  //append preview
  $("#preview_image_image").append(div)
}