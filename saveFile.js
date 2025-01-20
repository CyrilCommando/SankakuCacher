function bcacher_save_file(download_link, isMassDownload = false, date = "", charactertags ="")
{
	chrome.storage.local.get(["savefolder", "advanced_settings_object", "mass_download_prevtags", "date", "md5", "character"], function(newResult) { 

		var includeshttps = download_link[0] + download_link[1] + download_link[2] + download_link[3] + download_link[4];
		
		if (includeshttps == "https")
		{
			download_link = download_link.substring(6)
		} 

		var name = download_link.substr(34, 36)

		if (name[33] + name[34] + name[35] === "web")
		{
			name = name + "m"
		}

		
		var svfld ="SankakuCacher/"

		
		if (newResult.savefolder == "SankakuCacher")
		{
			//break;
		}
		else 
		{
			//check if the input filename has a slash in it
			if (newResult.savefolder.substr(0, 1) == "/") 
			{
			alert(newResult.savefolder.substr(0, 1))
			newResult.savefolder = newResult.savefolder.substr(1);
			} 

			if (newResult.savefolder.substr(-1, 1) == "/")
			{
			alert(newResult.savefolder.substr(-1, 1))
			newResult.savefolder = newResult.savefolder.substr(-1,) 
			}

		svfld = newResult.savefolder + "/"
		
		}

		console.log(isMassDownload)
		if (isMassDownload)
		{
			if (newResult.mass_download_prevtags != "")
			{
				svfld += newResult.mass_download_prevtags.replaceAll(":", "_")
				svfld = svfld.replaceAll(">=", "greater_than_")
				svfld = svfld.replaceAll("<=", "less_than_")
				svfld += "/"
			}
			else if (newResult.mass_download_prevtags == "")
			{
				svfld += "homepage"
				svfld += "/"
			}
		}
		console.log(svfld)

		chrome.downloads.download({url: "https:" + download_link, filename: svfld + (`${newResult.date ? date + " ": ""}` + `${newResult.character ? charactertags + " ": ""}` + name).trimStart(), saveAs: false, conflictAction: "overwrite"})
 		//chrome.tabs.getSelected
  	})//chrome.storage.local.get
}