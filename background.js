// background.js

//thanks mf v3
importScripts("settingshelp.js")
importScripts("saveFile.js")

const DB_NAME = 'SankakuCacherDB';
const DB_VERSION = 1;
const OBJECT_STORE_NAME = 'Image_Post_Data';

let db; // To hold the database connection

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Check if the object store already exists
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        const objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'postid', autoIncrement: false });
        // Optionally create indexes
        objectStore.createIndex('postid', 'postid');
        console.log('Database upgraded or created.');
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Database opened successfully.');
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      reject(event.target.error);
    };
  });
};

// Call this function somewhere in your service worker's setup
openDatabase();

const addData = (object) => {
  return new Promise(async (resolve, reject) => {
    if (!db) {
      await openDatabase();
    }

    const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
    console.log(object)
    const request = objectStore.add(object);

    request.onsuccess = (event) => {
      console.log('Data added successfully:', event.target.result); // event.target.result contains the new key if autoIncrement was used
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('Error adding data:', event.target.error);
      reject(event.target.error);
    };
  });
};

// Example usage:
// addData({ name: 'Product A', category: 'Electronics', price: 99.99 });

// Assuming 'db' is your opened IDBDatabase object and 'myObjects' is an object store

const getSingleData = (key) => {
  return new Promise((resolve, reject) => {
    const objectStore = db.transaction([OBJECT_STORE_NAME], 'readonly').objectStore([OBJECT_STORE_NAME]);
    const request = objectStore.get(key); // This operation runs within an implicit transaction

    request.onsuccess = (event) => {
      console.log('Data retrieved successfully:', event.target.result);
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const updateData = (object) => {
  return new Promise(async (resolve, reject) => {
    if (!db) {
      await openDatabase();
    }

    const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
    const request = objectStore.put(object); // Assuming your object has an 'id' property

    request.onsuccess = (event) => {
      console.log('Data updated successfully:', event.target.result);
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('Error updating data:', event.target.error);
      reject(event.target.error);
    };
  });
};

// Example usage:
// updateData({ id: 1, name: 'Updated Product A', category: 'Electronics', price: 109.99 });

const deleteData = (key) => {
  return new Promise(async (resolve, reject) => {
    if (!db) {
      await openDatabase();
    }

    const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
    const request = objectStore.delete(key);

    request.onsuccess = (event) => {
      console.log('Data deleted successfully.');
      resolve();
    };

    request.onerror = (event) => {
      console.error('Error deleting data:', event.target.error);
      reject(event.target.error);
    };
  });
};

var positiveinstance = false;

chrome.runtime.onInstalled.addListener(function(details)
{
  default_settings();
})

chrome.contextMenus.create({contexts: ["image"], documentUrlPatterns: ["https://chan.sankakucomplex.com/*", "https://chan.sankakucomplex.com/en/*", "https://chan.sankakucomplex.com/en/posts/*"], id: "downloadbuttonId", title:"Download"})
chrome.contextMenus.create({contexts: ["all"], id: "historymenubuttonId", title:"History"})
chrome.contextMenus.create({contexts: ["action"], id: "settingsmenubuttonId", title:"Settings"})
chrome.contextMenus.create({contexts: ["action"], id: "downloadmenubuttonId", title:"Download"})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(info)
  console.log(tab)
  switch (info.menuItemId) {
    case "downloadbuttonId":
      chrome.tabs.sendMessage(tab.id, {message: "context_menu_clicked_download"})
      break;
  
    case "historymenubuttonId":
      chrome.tabs.create({url: chrome.runtime.getURL("/history/history.html")})
      break;
      
    case "settingsmenubuttonId":
      chrome.tabs.create({url: chrome.runtime.getURL("/settings/settings.html")})
      break;

    case "downloadmenubuttonId":
      chrome.tabs.create({url: chrome.runtime.getURL("/downloader/downloader.html")})
      break;

    default:
      break;
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    switch (request.message) {
      
      //for settings menu & popup window mdl. when the hell did chrome allow xhr to be used by extension pages?
      case"bcacher_save_file":
      bcacher_save_file(request.url, request.isMassDownload)
        break;
      
      case"saveToIndexedDB":
      // alert("hello")
      console.log(request)
      updateData({postid: request.pid, base64: request.options[request.pid]})
        break;
      
      case"getBase64":
        getSingleData(request.pid).then((result) => {
          console.log("result is " + result);
          sendResponse({ pid: request.pid, base64: result.base64 });
        }).catch((error) => {
          console.error("Error retrieving data:", error);
          sendResponse({ error: "Failed to retrieve data" });
        });
        return true; // Keep the message channel open for asynchronous response
        break;

      case "settoinstance":

        positiveinstance = true; 
        break;

        case "link":
      
        chrome.storage.local.get(["savefolder", "mp4swebms", "enabled", "advanced_settings_object"], function(newResult) { 

        chrome.tabs.query({active: true}, (tab) => {

          var tab = tab[0]
          
          var includeshttps = request.url[0] + request.url[1] + request.url[2] + request.url[3] + request.url[4];
        
          if (includeshttps == "https")
          {
            request.url = request.url.substring(6)
          } 
    
          var name = request.url.substr(34, 36)
    
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
            
          enabled = newResult.enabled;
          if (name[33] + name[34] + name[35] + name[36] === "webm" || name[33] + name[34] + name[35] === "mp4")
          {
              if (newResult.mp4swebms == true && positiveinstance == false && enabled == true)
              {
                if (newResult.advanced_settings_object.character == true)
                {
                  svfld = svfld + request.character_tag + "/"
                }
                if (newResult.advanced_settings_object.date == true)
                {
                  svfld = svfld + request.date + "/"
                }
                  chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                  positiveinstance = false;
              }
              else if (positiveinstance == true)
              {
                if ((enabled == true) || (positiveinstance == true))
                {
                  if (newResult.advanced_settings_object.character == true)
                  {
                    svfld = svfld + request.character_tag + "/"
                  }
                  if (newResult.advanced_settings_object.date == true)
                  {
                    svfld = svfld + request.date + "/"
                  }
                  chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                  positiveinstance = false;
                }
                else{positiveinstance = false;}
              }
              else{}
          } //if is webm/mp4
          else if (name[33] + name[34] + name[35] + name[36] != "webm" || name[33] + name[34] + name[35] != "mp4")
          {
            if ((enabled == true) || (positiveinstance == true))
            {
                if (newResult.advanced_settings_object.character == true)
                {
                  svfld = svfld + request.character_tag + "/"
                }
                if (newResult.advanced_settings_object.date == true)
                {
                  svfld = svfld + request.date + "/"
                }
                if ((newResult.advanced_settings_object.character == false) && (newResult.advanced_settings_object.date == false))
                {
                  // chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                  // positiveinstance = false;
                }
                chrome.downloads.download({url: "https:" + request.url, filename: svfld + name, saveAs: false, conflictAction: "overwrite"})
                positiveinstance = false;
            }
            else{positiveinstance = false;}
          } //if not webm/mp4
      }); //chrome.tabs.query
    }) //chrome.storage.local.get
      break;

      default:

        break;
    }
});

//shouldn't be needed but for big history menus. unlimitedstorage was not built for this workload, no fix except for unlimitedstorage rewrite
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.set({"fixlatency": true})
})



///////////////
///////////////
///////////////
///////////////
///////////////
///////////////
///////////////
///////////////



function openLinkInBrowser()
{
  chrome.storage.local.get("newwindow", function (newResult) { 
    if (newResult.newwindow)
    {
      chrome.windows.create({url: "https://chan.sankakucomplex.com", state: "maximized"})
    }
    else chrome.tabs.create({url: "https://chan.sankakucomplex.com"});
  })
}

function getData(sKey) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(sKey, function(newResult) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(newResult);
      }
    });
  });
}