function default_settings()
{
    var aso = new AdvancedSettingsObject();
    chrome.storage.local.set({"enabled": false, "mp4swebms": false, "arrangefiles": false, "savefolder": "SankakuCacher", "autofav": false, "newwindow": false, "middleclickfav": true, "advanced_settings_object": aso, "mass_download_limit": 20, "mass_download_concurrentlimit": 5, "mass_download_offset": 0, "HMenu_downloadanimatedgifs": false, "HMenu_downloadfullvideos": false, "resizecontent": true, "scrolltocontent": true})
    //chrome.runtime.sendMessage({"message": "alert", value: "Settings set to default"})
}

function delete_all_settings()
{
    chrome.storage.local.remove(["enabled", "mp4swebms", "arrangefiles", "savefolder", "prevsearch", "autofav", "newwindow", "middleclickfav", "advanced_settings_object", "mass_download_limit", "mass_download_concurrentlimit", "mass_download_offset"])
    //chrome.storage.local.clear()
    chrome.runtime.sendMessage({"message": "alert", value: "settings deleted"})
    default_settings()
}

class AdvancedSettingsObject
{
    constructor(param1 = false, param2 = false) {
        this.character = param1;
        this.date = param2;
    }
}

function doc_onchanged(htmlelement){
    switch (htmlelement.id)
    {
        case "enabled":
        {
            chrome.storage.local.set({"enabled": htmlelement.checked})
            break;
        }
        case "arrangefiles":
        {
            chrome.storage.local.set({"arrangefiles": htmlelement.checked})
            break;
        }
        case "savefolder":
        {
            chrome.storage.local.set({"savefolder": htmlelement.value})
            break;
        }
        case "mp4swebms":

            chrome.storage.local.set({"mp4swebms": htmlelement.checked})
            break;

        case "autofav":

            chrome.storage.local.set({"autofav": htmlelement.checked})
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "change_autofav_variable"})
            }) 
            
            break;
            
        case "newwindow":

            chrome.storage.local.set({"newwindow": htmlelement.checked})
            break;
            
        case "middleclickfav":
            chrome.storage.local.set({"middleclickfav": htmlelement.checked})
            // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //     chrome.tabs.sendMessage(tabs[0].id, {message: "change_middleclick_variable"})
            // }) 
            break;

        case "mass_download_limit":
            
            chrome.storage.local.set({"mass_download_limit": htmlelement.value})
            break;
            
        case "mass_download_concurrentlimit":
            
            chrome.storage.local.set({"mass_download_concurrentlimit": htmlelement.value})
            break;

        case "mass_download_offset":
            
            chrome.storage.local.set({"mass_download_offset": htmlelement.value})
            break;

        case "HMenu_downloadanimatedgifs":

            chrome.storage.local.set({"HMenu_downloadanimatedgifs": htmlelement.checked})
            break;

        case "HMenu_downloadfullvideos":

            chrome.storage.local.set({"HMenu_downloadfullvideos": htmlelement.checked})
            break;
        
        case "resizecontent":

            chrome.storage.local.set({"resizecontent": htmlelement.checked})
            break;

        case "scrolltocontent":

            chrome.storage.local.set({"scrolltocontent": htmlelement.checked})
            break;
    }
    //var x = document.getElementById("savefolder");
    //chrome.storage.local.set({"savefolder": htmlelement.value})
}