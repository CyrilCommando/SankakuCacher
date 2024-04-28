console.log("mdl mod imported")

//pg 1, 2 (element)
var mdl_listpage;

//current dl amount //page increment (number)
/**
 * page increment (number)
 */
var mdl_pginc = 1;

var concurrentImageTracker = 0;

/**
 * link array for image pages?
 * unused?
 */

var downloadLink;

var concurrentLimitPoll;

var dldimages = 0;

var createdDlDict = {};

var breakOutError = false;

var end_Of_Postlist = false;

chrome.downloads.onCreated.addListener(downloaditem => {
    createdDlDict[downloaditem.id] = true;
})

chrome.downloads.onChanged.addListener(downloaddelta => {
    // console.log(downloaddelta)
    if (downloaddelta.state)
    {
        if(downloaddelta.state.current == "complete")
        {
            if (createdDlDict[downloaddelta.id])
            {
                // console.log("dec 1")
                concurrentImageTracker --
            }
        }
        if(downloaddelta.state.current == "interrupted")
        {
            concurrentImageTracker --
            console.log("resumed failed dl")
            setTimeout(() => {
                chrome.runtime.sendMessage({"message": "wow_a_function", url: downloaddelta.url.current, isMassDownload: true})
                // chrome.downloads.resume(downloaddelta.id)
                concurrentImageTracker ++
            }, 2500);
        }
    }
})

MDL_update()

function MDL_update()
{
    chrome.storage.local.get(["mass_download_limit", "mass_download_concurrentlimit", "mass_download_offset", "mass_download_prevtags"], function(result){
        $("#mass_download_limit").val(result.mass_download_limit);
        $("#mass_download_concurrentlimit").val(result.mass_download_concurrentlimit);
        $("#mass_download_offset").val(result.mass_download_offset);
        $("#tagsdownload").val(result.mass_download_prevtags)
    })
}

async function initiateMdlWTags(index = parseInt ($("#mass_download_offset").val()), persist = false)
{
    breakOutError = false;

    const factor = 20
    
    //populate page increment (page to use) & index if index >= factor
    if ((index >= factor) && (persist == false))
    {
        mdl_pginc = Math.ceil(((index + 1) / factor))
        index = index - (factor * (Math.floor(mdl_pginc - 0.05)));
    }

    //set prevtags
    chrome.storage.local.set({"mass_download_prevtags": document.getElementById("tagsdownload").value})

    // split tags
    let rawinput = document.getElementById("tagsdownload").value;
    let x = rawinput.split(" ");
    var concatenated = "";
    var arr = Array.from(x);

    if (arr.length == 0) concatenated = rawinput;

    if (arr.length > 0)
    {
        arr.forEach(tag => {
            concatenated = concatenated + tag + "+"
        })
    }
     
    //

    //load page & save into mdl_listpage    https://chan.sankakucomplex.com/posts/index.html?auto_page=t&next=34733274&page=3
    var ustr = `https://chan.sankakucomplex.com/posts.html?tags=${concatenated}&auto_page=t&page=${mdl_pginc}`
    await xmlHttpReqforMDL(ustr)

    
    var thumbs = Array.prototype.slice.call(mdl_listpage.getElementsByClassName("post-preview-link"))
    var popularExcludedArray = [];
    for (let index = 0; index < thumbs.length; index++) {
        const element = thumbs[index];
        if ($(element.parentElement).hasClass("popular-preview-post") || $(element.parentElement.parentElement).hasClass("has-mail"))
        {
            
        }

        else
        {
            popularExcludedArray.push(element)
        }
    }
    

    for (let ind = index; (ind < popularExcludedArray.length && parseInt($("#mass_download_limit").val()) > dldimages); ind++) {
        const image = popularExcludedArray[ind]; 
        await xmlhttpReq($(image).attr("href").substring(10,), undefined, false, false, dldimages, $("#mass_download_limit").val()).catch(function(e_val){
            breakOutError = true; 
            dldimages = 0; 
            mdl_pginc = 1; 
            // console.log("rate limited - dld set to 0, pginc 1"); 
            // chrome.runtime.sendMessage({message: "alert", value: "image "+e_val+" out of " + $("#mass_download_limit").val() + " failed\nWait a minute and click download again. Offset set to last successfully downloaded file"})
            // var v = parseInt($("#mass_download_offset").val())
            // $("#mass_download_offset").val( v + (e_val - 1))
            // chrome.storage.local.set({"mass_download_offset": parseInt($("#mass_download_offset").val())})
        })
        if (breakOutError)
        {
            break;
        }
        concurrentLimitPoll = setInterval (dlItem, 500)
        // console.log(concurrentLimitPoll)

            await promiseWhen(function(){
                return concurrentLimitPoll == undefined;
              }).then(function(){
                console.log('done');
              }, function (){
                console.log('timeout');
              });

        concurrentImageTracker++


        if (  (ind == 19) && (parseInt($("#mass_download_limit").val()) > dldimages)  )
        {
            console.log("reached end")
            mdl_pginc++
            //set index to 0 V
            initiateMdlWTags(0, true)
            break;
        }

        if (  (ind < 19) && (parseInt($("#mass_download_limit").val()) >= dldimages) && (popularExcludedArray.length < 20) )
        {
            console.log("reached end of postlist")
            end_Of_Postlist = true;
            mdl_pginc = 1;
        }
    }



    //if downloaded images equals limit set dld to 0 & pginc to 1 for next
    if (dldimages == parseInt($("#mass_download_limit").val()))
    {
        dldimages = 0
        mdl_pginc = 1;
    }

    if (end_Of_Postlist)
    {
        // chrome.runtime.sendMessage({message: "alert", value: "End of posts!"})
        // end_Of_Postlist = false;
    }
}

function dlItem()
{
    
    if (concurrentImageTracker < parseInt($("#mass_download_concurrentlimit").val()))
    {
        // console.log("dlitm")
        chrome.runtime.sendMessage({"message": "wow_a_function", url: downloadLink, isMassDownload: true})
        clearInterval(concurrentLimitPoll)
        concurrentLimitPoll = undefined;
        dldimages += 1;
    }
}


// code
function promiseWhen(condition, timeout){
  if(!timeout){
    timeout = 999999;
  }
  return new Promise(function(resolve, reject)
  {
    setTimeout(function(){
        reject();
      }, timeout);
      function loop(){
        if(condition()){
          resolve();
        }
        setTimeout(loop,0);
      }
      setTimeout(loop,0);
  })
}


/**
 * page 1 ..., updates mdl pg w new pg
 */
async function xmlHttpReqforMDL(url)
{
//   console.log(url)
  var xhr22222222 = new XMLHttpRequest();
  var gettedCredentials;
//   await async function (){
//     return new Promise(function (resolve, reject){
//       chrome.storage.local.get(["userlogin", "userpasshash"], async function (result){
//         gettedCredentials.userlogin = result.userlogin
//         gettedCredentials.userpasshash = result.userpasshash
//         resolve("uselessresolvexd")
//       })
//     })
//   }()

  xhr22222222.open("GET", url);
  xhr22222222.withCredentials = true;
  xhr22222222.responseType = "document";
  xhr22222222.send();
  return new Promise(function (resolve, reject) {
  xhr22222222.onreadystatechange = function() {
    if (this.readyState !== 4) return;
    if (this.status >= 200 && this.status < 300) {

        mdl_listpage = this.response
        // console.log(this.response)
        resolve("sdsdsd")
    }
    else{
      console.log("request failed")
      mdl_listpage = undefined
      console.log(this.response)
      reject("dfgdfgsfghdfghxfghfghdfhg ")
    }
}
});
}