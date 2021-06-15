document.getElementById("update").onclick = function () {
    xmlhttpReq();
};

document.getElementById("create").onclick = function () {
    addPreviewImg();
    console.log("created")
};

function xmlhttpReq(pid = "22405857", e, isPreview = true, isContextMenu = false)
{
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://cors-anywhere.herokuapp.com/"+"https://chan.sankakucomplex.com/post/show/"+pid);
    xhr.responseType = "document";
    xhr.send();
    return new Promise(function (resolve, reject) {
    xhr.onreadystatechange = function() {
    if (this.readyState !== 4) return;
    if (this.status >= 200 && this.status < 300) {

        //log image url
        //console.log("image link: "+$(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src"))
        
        if (isPreview)
        {
            $(".preview_image_or_video_tag").attr("src", $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src"))
            console.log("preview src updated")
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
        
        resolve(this.responseXML)
    }
    else
    {
        console.log("request failed")
        reject("failed")
    }
}
});
}

function createBase64Image(type = "preview") {
    // Create an empty canvas element
    if (type == "postpage") 
    {
        var img = document.getElementById("canvasimg");
    } else if (type == "preview") 
    {
        var img = document.getElementsByClassName("preview_image_or_video_tag")[0];
        img.crossOrigin = "anonymous";
    }
    var canvas = document.createElement("canvas");
    console.log(img.naturalWidth)
    console.log(img.naturalHeight)
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");
    console.log("b64 img created");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function removePreview(e) {
    $("#preview-all_container").remove();
}

function addPreviewImg() {
    removePreview();

    preview_all_container = $("<div></div>").attr({
        id: "preview-all_container"
    });
    preview_image_container = $("<div></div>").attr({
        id: "preview-image_container"
    });

    //xmlhttpReq();

    //create and attributes
    var preview = $("<img></img>");
    $(preview).attr("style", "max-width: 970px; max-height: 580px; border: 4px solid #bdbdbd;");
    $(preview).attr("src", "");
    $(preview).attr("class", "preview_image_or_video_tag");
    $(preview).attr("referrerpolicy", "no-referrer");

    //on load
    $(preview).on("load", function () {
        //console.log("preview size: " + this.width + "x" + this.height);
        //


        //

        //

        createBase64Image()

        //
    });

    //append image DOM element to image container
    $(preview_image_container).append(preview);

    //append preview image container to all container
    $(preview_all_container).append(preview_image_container);

    //append all
    $(document.getElementById("create")).before(preview_all_container);
}
