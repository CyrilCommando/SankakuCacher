console.log("mdl mod imported")

//pg 1, 2 (element)
var mdl_listpage;

//current dl amount //page increment (number)
var mdl_pginc = 1;

var concurrentImageTracker = 0;

var mdl_linkarr = [];

var downloadLink;

var concurrentLimitPoll;

var dldimages = 0;

var createdDlDict = {};

chrome.downloads.onCreated.addListener(downloaditem => {
    createdDlDict[downloaditem.id] = true;
})

chrome.downloads.onChanged.addListener(downloaddelta => {
    console.log(downloaddelta)
    if (downloaddelta.state)
    {
        if(downloaddelta.state.current == "complete")
        {
            if (createdDlDict[downloaddelta.id])
            {
                console.log("dec 1")
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
    if ((index >= factor) && (persist == false))
    {
        mdl_pginc = Math.ceil(((index + 1) / factor))
        index = index - (factor * (Math.floor(mdl_pginc - 0.05)));
    }
    chrome.storage.local.set({"mass_download_prevtags": document.getElementById("tagsdownload").value})
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
    var ustr = `https://chan.sankakucomplex.com/?tags=${concatenated}&commit=Search&page=${mdl_pginc}`
    await xmlHttpReqforMDL(ustr)
    var thumbs = Array.prototype.slice.call(mdl_listpage.getElementsByClassName("thumb"))

    for (index = index; (index < thumbs.length && parseInt($("#mass_download_limit").val()) > dldimages); index++) {
        const element = thumbs[index];
        mdl_linkarr.push(element.firstChild.href) 
        await xmlhttpReq(element.id.substr(1,), undefined, false, false)
        concurrentLimitPoll = setInterval (dlItem, 500)
        console.log(concurrentLimitPoll)
        // concurrentLimitPoll = 1
        // await awaitIfUndefined()

            await promiseWhen(function(){
                return concurrentLimitPoll == undefined;
              }).then(function(){
                console.log('done');
              }, function (){
                console.log('timeout');
              });

        concurrentImageTracker++
        if ( (parseInt($("#mass_download_limit").val()) > dldimages) && (index == 19) )
        {
            console.log("reached end")
            mdl_pginc++
            //set index to 0 V
            initiateMdlWTags(0, true)
            break;
        }
    }
    if (dldimages == parseInt($("#mass_download_limit").val()))
    {
        dldimages = 0
        mdl_pginc = 1;
    }
}

function dlItem()
{
    
    if (concurrentImageTracker < parseInt($("#mass_download_concurrentlimit").val()))
    {console.log("dlitm")
        chrome.runtime.sendMessage({"message": "wow_a_function", url: downloadLink, isMassDownload: true})
        clearInterval(concurrentLimitPoll)
        concurrentLimitPoll = undefined;
        dldimages += 1;
    }
}

function awaitIfUndefined()
{
    console.log("promisebs")
    return new Promise(function(resolve, reject){
        setTimeout(() => {
            if(concurrentLimitPoll == undefined)
            {
                console.log("promisebsresolve")
                resolve()
            }
            else
            {
                console.log("promisebsreutn")
                return;
            }
        }, 500);
    })
}


// code
function promiseWhen(condition, timeout){
  if(!timeout){
    timeout = 99999;
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


// test case
var myInterval;

/**
 * page 1 ..., updates mdl pg w new pg
 */
async function xmlHttpReqforMDL(url)
{
  console.log(url)
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
        console.log(this.response)
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