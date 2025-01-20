//#region defs
class Booru 
{
	name;
	splitChar = "+";
	faviconloc;
	perPage;
	currentPageNumber;
	currentIndexPageHtml;
	currentPostPageHtml;
	getPostListPage = function(tags) {
		return `https://chan.sankakucomplex.com/posts/index.html?tags=${tags}&auto_page=t&page=${pagenumber}`
	}

	findPostIdOn_IndexPageHtmlElement = function(thumbnail) {
		return $(thumbnail).attr("href").substring(10,)
	}

	loadIndexPage = async function (urlFormattedTags, pagenumber) {
		this.currentIndexPageHtml = 
		
		await fetch(`https://chan.sankakucomplex.com/posts.html?tags=${urlFormattedTags}&auto_page=t&page=${pagenumber}`)
		.then(function(response) {
			// When the page is loaded convert it to text
			return response.text()
		})
		.then(function(html) {
			// Initialize the DOM parser
			var parser = new DOMParser();

			// Parse the text
			var doc = parser.parseFromString(html, "text/html");

			// You can now even select part of that html as you would in the regular DOM 
			// Example:
			// var docArticle = doc.querySelector('article').innerHTML;

			return doc.documentElement
		})
		.catch(function(err) {  
			console.log('Failed to fetch page: ', err);  
		});

	};
	getPostHtmlElementsOn_IndexPage = function () {
		var thumbs = Array.prototype.slice.call(this.currentIndexPageHtml.getElementsByClassName("post-preview-link"))
		return thumbs;
	}
	findThumbnailUrlOn_IndexPageHtmlElement = function (thumb) {
		return $(thumb).find("img")[0].src
	}
	
	findImageUrlFrom_IndexPageHtmlElement = function (thumb) {
		
	}

	uniqueScripts = function() {}
}

class Sankaku extends Booru
{
	name = "Sankaku"
	perPage = 25;
}

class Rule34 extends Booru
{
	name = "Rule34"
	perpage = 42;
}

class danbooru extends Booru
{
	name = "danbooru"
}

class BooruCacherState
{
    static limit = 20;
    static concurrentlimit = 5;
    static offset = 0;
    static downloadedPosts = 0;
	static concurrentImageTracker = 0;
	static concurrentLimitPoll;
	static pageNumber = 1;
}

var downloadedDlTrackDict = {};

var boorus = [new Sankaku, new Rule34]

var tags;

var booru_;

var postId;

var thumb_;

var downloadLink; //needed because we have to do images one by one so as not to overload the sites, to track concurrent dowlnoads. it's read and replaced on every download
//#endregion

//string, upload date
var uploadDate;

//html, the individual post page
var xhr_received_page;

//string array, tag array for individual post
var tag_array;

var thumbnail_title_tag_array = [];

//#region scripdefs

function adthumbnail(thumbel)
{
	var parent_div = $("<div></div>").attr({"id": postId+"_parent", "class": "preview-parent_div"})
	$(parent_div).append(`<img title="${thumbnail_title_tag_array}" id="${postId}" src="https:${booru_.findThumbnailUrlOn_IndexPageHtmlElement(thumbel).substring(17)}">`)
	$("#mppane").prepend(parent_div)
	$("#"+postId+"_parent").append("<div class=\"preview-menu_bar\"><div class=\"progress-menu_bar\" style=\"width: 10%;\"></div></div>")
	createReflection(postId)
}

function createReflection(pid)
{
	var cp = $("#"+pid).clone()
	$(cp).attr({"class": "", "id": pid+"_ref", "title": "", "muted": true})
	var div = $("<div></div>")
	$(div).attr("class", "tsbg")
	$(div).append(cp)
	$("#"+pid+"_parent").append(div)
	document.getElementById(pid+"_ref").muted = true
	document.getElementById(pid+"_ref").loop = false
	$(cp).parents("#"+pid+"_parent").children("#"+pid)[0].loop = false;
	var bts = $(cp).parents("#"+pid+"_parent").children("div.preview-menu_bar").clone()
	$(bts).css({"bottom": "-10px", "z-index": "1"})
	$("#"+pid+"_parent").children("div.tsbg").prepend(bts)
}

function dlItem()
{
    
    if (BooruCacherState.concurrentImageTracker < parseInt($("#mass_download_concurrentlimit").val()))
    {
        // console.log("dlitm")
        //chrome.runtime.sendMessage({"message": "bcacher_save_file", url: downloadLink, isMassDownload: true})
		thumbnail_title_tag_array = [];
		tag_array = getImageTags(xhr_received_page)

		tag_array.forEach(tg => {
			if ((tg.type == "character_tag") || (tg.type == "artist_tag"))
			{
				thumbnail_title_tag_array.push(tg.tag)
			}
		});
		
		var chartag = "";
		var ctlimit = 0;
		tag_array.forEach(tag => {
			if ((tag.type == "character_tag") && (ctlimit < 3) )
			{
				chartag = chartag.concat(tag.tag + " ")
				ctlimit++
			}
		});
		chartag = chartag.trimEnd()
		chartag = chartag.replaceAll(":", "_")

		var artisttag = "";
		var atlimit = 0;
		tag_array.forEach(tag => {
			if ((tag.type == "artist_tag") && (atlimit < 3))
			{
				artisttag = artisttag.concat(tag.tag + " ")
				atlimit++
			}
		});
		artisttag = artisttag.trimEnd()
		artisttag = artisttag.replaceAll(":", "_")

		// if (tag_array.length + 47 > 200)
		// {
			// var work = tag_array.split(" ")
			// var work2 = "";
			// var iter = 0;
			// for (let index = 0; index < 3 && index < work.length; index++) {
			// 	const tagstr = work[index];
			// 	work2 = work2.concat(work[index] + " ")
			// }
			// // while (work2.length + 47 + work[iter].length < 255) {
			// // 	work2 = work2.concat(work[iter] + " ")
			// // 	iter++
			// // }
			// tag_array = work2
			// tag_array = tag_array.trimEnd()
		// }
		bcacher_save_file(downloadLink, true, uploadDate, chartag, artisttag)
        clearInterval(BooruCacherState.concurrentLimitPoll)
        BooruCacherState.concurrentLimitPoll = undefined;
        BooruCacherState.downloadedPosts += 1;
    }
}

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
			if(condition())
			{
				resolve();
			}
		  	setTimeout(loop,0);
		}

		setTimeout(loop,0);
	})
  }

/**
 * 
 * @param {String} rawInput 
 * @param {Booru} booru 
 * @returns String
 * @summary splits tags with a split char
 */
function splitTagsSuitablyFromRawInput(rawInput, booru)
{
	let rawinput = rawInput;
	let x = rawinput.split(" ");
	let concatenated = "";
	let arr = Array.from(x);

	if (arr.length == 0) concatenated = rawinput;

	if (arr.length > 0)
	{
		arr.forEach(tag => {
			concatenated = concatenated + tag + booru.splitChar
		})
	}
	return concatenated;
}

async function start()
{
	chrome.storage.local.set({"mass_download_prevtags": document.getElementById("tags").value, "mass_download_concurrentlimit": document.getElementById("mass_download_concurrentlimit").value,"mass_download_limit": document.getElementById("mass_download_limit").value, "mass_download_offset": document.getElementById("mass_download_offset").value}, function()
	{
		//booru to use = page booru selected value
		for (let index = 0; index < boorus.length; index++) {
			const booru = boorus[index];
			if (booru.name == document.getElementById("booru").value)
			{
				booru_ = booru;
			}
		}

		let tags_ = document.getElementById("tags").value
		tags = splitTagsSuitablyFromRawInput(tags_, booru_)
		BooruCacherState.offset = document.getElementById("mass_download_offset").value
		BooruCacherState.concurrentlimit = document.getElementById("mass_download_concurrentlimit").value
		BooruCacherState.limit = document.getElementById("mass_download_limit").value
		massDownloadMaster(booru_)
	})
	
}

async function massDownloadMaster(booru, persist = false)
{
	let breakOutError = false;
	
	//
	//global
	if ((BooruCacherState.offset >= booru.perPage) && (!persist))
	{
		BooruCacherState.pageNumber = Math.ceil(((parseInt(BooruCacherState.offset) + 1) / booru.perPage))
		BooruCacherState.offset = BooruCacherState.offset - (booru.perPage * (Math.floor(BooruCacherState.pageNumber - 0.05)));
	}

	await booru.loadIndexPage(tags, BooruCacherState.pageNumber)

	//booru speciic call
	var thumbs = booru.getPostHtmlElementsOn_IndexPage()
	
	
	//booru specific filter method
	var popularExcludedArray = thumbs;
	



	for (let ind = BooruCacherState.offset; (ind < popularExcludedArray.length && BooruCacherState.limit > BooruCacherState.downloadedPosts); ind++) {
		const image = popularExcludedArray[ind]; 
		thumb_ = image;
		await xmlhttpReq(booru.findPostIdOn_IndexPageHtmlElement(image), undefined, false, false, BooruCacherState.downloadedPosts, BooruCacherState.limit)
		.catch(function(e_val)
		{
			breakOutError = true; 
			BooruCacherState.downloadedPosts = 0; 
			BooruCacherState.pageNumber = 1; 

			//rate limit            
			// console.log("rate limited - dld set to 0, pginc 1"); 
			// chrome.runtime.sendMessage({message: "alert", value: "image "+e_val+" out of " + $("#mass_download_limit").val() + " failed\nWait a minute and click download again. BooruCacherState.offset set to last successfully downloaded file"})
			// var v = parseInt($("#mass_download_BooruCacherState.offset").val())
			// $("#mass_download_BooruCacherState.offset").val( v + (e_val - 1))
			// chrome.storage.local.set({"mass_download_BooruCacherState.offset": parseInt($("#mass_download_BooruCacherState.offset").val())})
			//
		})
		if (breakOutError)
		{
			break;
		}
		postId = booru.findPostIdOn_IndexPageHtmlElement(image);
		BooruCacherState.concurrentLimitPoll = setInterval (dlItem, 500)
		// console.log(concurrentLimitPoll)

		await promiseWhen( function(){return BooruCacherState.concurrentLimitPoll == undefined;} )
		.then( function(){console.log('done');}, function(){console.log('timeout');} );

		adthumbnail(thumb_)

		BooruCacherState.concurrentImageTracker++


		if (  (ind == (booru.perPage -1)) && (BooruCacherState.limit > BooruCacherState.downloadedPosts)  )
		{
			console.log("reached end")
			BooruCacherState.pageNumber++
			//set BooruCacherState.offset to 0 V
			BooruCacherState.offset = 0;
			massDownloadMaster(booru, true)
			break;
		}

		if (  (ind < (booru.perPage - 1)) && (BooruCacherState.limit >= BooruCacherState.downloadedPosts) && (popularExcludedArray.length < booru.perPage) )
		{
			console.log("reached end of postlist")
			BooruCacherState.pageNumber = 1;
		}
	}



	//if downloaded images equals limit set dld to 0 & pginc to 1 for next
	if (BooruCacherState.downloadedPosts == BooruCacherState.limit)
	{
		BooruCacherState.downloadedPosts = 0
		BooruCacherState.pageNumber = 1;
	}
}
//#endregion


//#region exec
chrome.downloads.onCreated.addListener(downloaditem => 
{
	downloadedDlTrackDict[downloaditem.id] = {exists: true, pid: postId, item: downloaditem, uploddate: uploadDate, tags: tag_array};
})
chrome.downloads.onChanged.addListener(downloaddelta => 
{
	if (downloadedDlTrackDict[downloaddelta.id].exists)
	{
		if (downloaddelta.state)
		{
			if(downloaddelta.state.current == "complete")
			{
				if (downloadedDlTrackDict[downloaddelta.id].exists)
				{
					downloadedDlTrackDict[downloaddelta.id].item.state = downloaddelta.state.current
					BooruCacherState.concurrentImageTracker --
				}
			}
			if(downloaddelta.state.current == "interrupted")
			{
				BooruCacherState.concurrentImageTracker --
				console.log("resumed failed dl")
				setTimeout(() => {
					//chrome.runtime.sendMessage({"message": "bcacher_save_file", url: downloaddelta.url.current, isMassDownload: true})
					bcacher_save_file(downloaddelta.url.current, true, downloadedDlTrackDict[downloaddelta.id].uploddate, downloadedDlTrackDict[downloaddelta.id].tags)
					BooruCacherState.concurrentImageTracker ++
				}, 2500);
			}
		}
	}
    
})
chrome.storage.local.get(["mass_download_prevtags", "mass_download_concurrentlimit", "mass_download_limit", "mass_download_offset", "imgs"], function(rs){
	document.getElementById("mass_download_concurrentlimit").value = rs.mass_download_concurrentlimit
	document.getElementById("mass_download_limit").value = rs.mass_download_limit
	document.getElementById("mass_download_offset").value = rs.mass_download_offset
	document.getElementById("tags").value = rs.mass_download_prevtags
	if (rs.imgs == true)
	{
		document.getElementsByTagName("body")[0].style.backgroundImage = `url("../settings/bg/9c9cc066d95471087060c66f163c2b35.png")`
	}
	else
	{
		document.getElementsByTagName("body")[0].style.backgroundColor = "#000"
	}
})
// document.getElementById("mass_download_concurrentlimit").value = BooruCacherState.concurrentlimit
// document.getElementById("mass_download_limit").value = BooruCacherState.limit
// document.getElementById("mass_download_offset").value = BooruCacherState.offset
document.getElementById("downloadbutton").onclick = start;


setInterval(() => {
	//$("#e4a0f31879ef606824f70ff9_parent").find(".progress-menu_bar").css("width", "0%")
	Object.keys(downloadedDlTrackDict).forEach(key => {
		if ((downloadedDlTrackDict[key].item.state == "complete") && (downloadedDlTrackDict[key].progBar != "completed"))
		{
			downloadedDlTrackDict[key].progBar = "completed"
			$("#"+downloadedDlTrackDict[key].pid+"_parent").find(".progress-menu_bar").css("width", "100%")
		}
	});
}, 1000);


//#endregion













