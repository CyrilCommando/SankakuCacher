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
    var x = document.getElementById("tagsdownload").value;
    x = x.split(" ");
    var concatenated;
    var iterate = 0;
    var arr = Array.from(x);
        arr.forEach(element => {
        if ((concatenated == undefined) && (arr.length != 1))
        {
            concatenated = element + "+";
            iterate = iterate++
        }
        else if ((concatenated == undefined) && (arr.length == 1))
        {
            concatenated = element;
        }
        else if ((arr.length > iterate) && (concatenated != undefined))
        {
            concatenated = concatenated + element + "+" 
            iterate = iterate++;
        }
       else
       {
        concatenated = concatenated + element;
       }
    });
    //

    //load page & save into mdl_listpage
    var ustr = `https://chan.sankakucomplex.com/?tags=${concatenated}&commit=Search&page=${mdl_pginc}`
    await xmlHttpReqforMDL(ustr)

    
    var thumbs = Array.prototype.slice.call(mdl_listpage.getElementsByClassName("thumb"))
    var popularExcludedArray = [];
    for (let index = 0; index < thumbs.length; index++) {
        const element = thumbs[index];
        if (element.parentElement.className != "popular-preview-post")
        {
            popularExcludedArray.push(element)
        }
    }
    

    for (let ind = index; (ind <= popularExcludedArray.length && parseInt($("#mass_download_limit").val()) > dldimages); ind++) {
        const image = popularExcludedArray[ind]; 
        await xmlhttpReq(image.id.substr(1,), undefined, false, false)
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


        if (  (ind == 20) && (parseInt($("#mass_download_limit").val()) > dldimages)  )
        {
            console.log("reached end")
            mdl_pginc++
            //set index to 0 V
            initiateMdlWTags(0, true)
            break;
        }
    }



    //if downloaded images equals limit set dld to 0 & pginc to 1 for next
    if (dldimages == parseInt($("#mass_download_limit").val()))
    {
        dldimages = 0
        mdl_pginc = 1;
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
    timeout = 10000;
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