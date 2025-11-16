// background.js

//thanks mf v3
//importScripts("settingshelp.js")
//importScripts("saveFile.js")

//region defs

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

function openLinkInBrowser() {
	chrome.storage.local.get("newwindow", function (newResult) {
		if (newResult.newwindow) {
			chrome.windows.create({ url: "https://chan.sankakucomplex.com", state: "maximized" })
		}
		else chrome.tabs.create({ url: "https://chan.sankakucomplex.com" });
	})
}





// region exec



chrome.runtime.onInstalled.addListener(function (details) {
	default_settings();
})

chrome.contextMenus.create({ contexts: ["image"], documentUrlPatterns: ["https://chan.sankakucomplex.com/*", "https://chan.sankakucomplex.com/en/*", "https://chan.sankakucomplex.com/en/posts/*"], id: "downloadbuttonId", title: "Download" })
chrome.contextMenus.create({ contexts: ["all"], id: "historymenubuttonId", title: "History" })
chrome.contextMenus.create({ contexts: ["action"], id: "settingsmenubuttonId", title: "Settings" })
chrome.contextMenus.create({ contexts: ["action"], id: "downloadmenubuttonId", title: "Download" })

chrome.contextMenus.onClicked.addListener((info, tab) => {
	console.log(info)
	console.log(tab)
	switch (info.menuItemId) {
		case "downloadbuttonId":
			chrome.tabs.sendMessage(tab.id, { message: "context_menu_clicked_download" })
			break;

		case "historymenubuttonId":
			chrome.tabs.create({ url: chrome.runtime.getURL("/history/history.html") })
			break;

		case "settingsmenubuttonId":
			chrome.tabs.create({ url: chrome.runtime.getURL("/settings/settings.html") })
			break;

		case "downloadmenubuttonId":
			chrome.tabs.create({ url: chrome.runtime.getURL("/downloader/downloader.html") })
			break;

		default:
			break;
	}
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	switch (request.message) {

		//for settings menu & popup window mdl. when the hell did chrome allow xhr to be used by extension pages?
		case "bcacher_save_file":
			bcacher_save_file(request.url, request.isMassDownload)
			break;

		case "saveToIndexedDB":
			// alert("hello")
			console.log(request)
			updateData({ postid: request.pid, base64: request.options[request.pid] })
			break;

		case "getBase64":
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

		case "content_script_download":

			chrome.storage.local.get(["mp4swebms", "enabled"], function (newResult) {

				enabled = newResult.enabled;

				var name = request.url.substr(34, 36)
				if (name[33] + name[34] + name[35] === "web") {
					name = name + "m"
				}

				//if is webm/mp4
				if (name[33] + name[34] + name[35] + name[36] === "webm" || name[33] + name[34] + name[35] === "mp4") {
					if (newResult.mp4swebms == true && positiveinstance == false && enabled == true) {
						var jijeirjIE = getArrayOfFormattedTagStrings(getimageTagsFromDocument(documentObjectM))
						var __chartag = jijeirjIE[0]
						var __artisttag = jijeirjIE[1]
						var __iptag = jijeirjIE[2]
						bcacher_save_file(request.url, false, $(documentObjectM.body).find("#stats").find("a")[0].title.substr(0, 10), __chartag, __artisttag, __iptag)
						positiveinstance = false;
					}
					else if (positiveinstance == true) {
						if ((enabled == true) || (positiveinstance == true)) {
							var jijeirjIE = getArrayOfFormattedTagStrings(getimageTagsFromDocument(documentObjectM))
							var __chartag = jijeirjIE[0]
							var __artisttag = jijeirjIE[1]
							var __iptag = jijeirjIE[2]
							bcacher_save_file(request.url, false, $(documentObjectM.body).find("#stats").find("a")[0].title.substr(0, 10), __chartag, __artisttag, __iptag)
							positiveinstance = false;
						}
						else { positiveinstance = false; }
					}
					else { }
				}

				//other
				else if (name[33] + name[34] + name[35] + name[36] != "webm" || name[33] + name[34] + name[35] != "mp4") {
					if ((enabled == true) || (positiveinstance == true)) {
						var jijeirjIE = getArrayOfFormattedTagStrings(getimageTagsFromDocument(documentObjectM))
						var __chartag = jijeirjIE[0]
						var __artisttag = jijeirjIE[1]
						var __iptag = jijeirjIE[2]
						bcacher_save_file(request.url, false, $(documentObjectM.body).find("#stats").find("a")[0].title.substr(0, 10), __chartag, __artisttag, __iptag)
						positiveinstance = false;
					}
					else { positiveinstance = false; }
				} 
			}) //chrome.storage.local.get
			break;

		default:

			break;
	}
});