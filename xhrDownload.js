/**
 * 
 * @summary 
 */
function xmlhttpReq2(url) {
	var xhr = new XMLHttpRequest();

	xhr.onload = function () {
		console.log("xhr SENT")
	}

	xhr.open("GET", url);
	xhr.responseType = "document";
	xhr.send();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {

			chrome.storage.local.get(["character_tag_limit", "artist_tag_limit", "IP_tag_limit"], function (newResult) {

				xhr_received_page = this.responseXML

				//if image link is undefined (if not an image)
				if ($(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src") == undefined) {
					//preview source link
					var v = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src");
					var y = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").attr("href");

					//download link for videos (unused probably)
					downloadLink = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("video").attr("src")
					var tagarr = getArrayOfFormattedTagStrings(getImageTagsFromDocument(xhr_received_page), newResult.character_tag_limit, newResult.artist_tag_limit, newResult.IP_tag_limit)
					var chartag = tagarr[0]
					var artisttag = tagarr[1]
					var iptag = tagarr[2]
					var uploadDate = $(this.responseXML.body).find("#stats").find("a")[0].title.substr(0, 10)
					bcacher_save_file(downloadLink, false, uploadDate, chartag, artisttag, iptag)
				}
				else {

					var v = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").find("img").attr("src");
					var y = $(this.responseXML.body).find("div#content").find("div#post-view").find("div.content").find("div#post-content").find("#image-link").attr("href");

					//download link for images
					if (y === undefined) {
						downloadLink = v
						var tagarr = getArrayOfFormattedTagStrings(getImageTagsFromDocument(xhr_received_page, newResult.character_tag_limit, newResult.artist_tag_limit, newResult.IP_tag_limit))
						var chartag = tagarr[0]
						var artisttag = tagarr[1]
						var iptag = tagarr[2]
						var uploadDate = $(this.responseXML.body).find("#stats").find("a")[0].title.substr(0, 10)
						bcacher_save_file(downloadLink, false, uploadDate, chartag, artisttag, iptag)
					}

					else {
						downloadLink = y
						var tagarr = getArrayOfFormattedTagStrings(getImageTagsFromDocument(xhr_received_page), newResult.character_tag_limit, newResult.artist_tag_limit, newResult.IP_tag_limit)
						var chartag = tagarr[0]
						var artisttag = tagarr[1]
						var iptag = tagarr[2]
						var uploadDate = $(this.responseXML.body).find("#stats").find("a")[0].title.substr(0, 10)
						bcacher_save_file(downloadLink, false, uploadDate, chartag, artisttag, iptag)
					}
				}

			})
		};
	}
}