import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.tabs.onUpdated.addListener(
	function (tabId, changeInfo, tab) {
		// read changeInfo data and do something with it
		// like send the new url to contentscripts.js
		if (changeInfo.url && changeInfo.url.indexOf("linkedin.com/in/") > -1) {
			chrome.browserAction.setBadgeBackgroundColor({ color: "red" })
			chrome.browserAction.setBadgeText({ text: "Nwf" });
		}
		else if (changeInfo.url && changeInfo.url.indexOf("linkedin.com/in/") == -1) {
			chrome.browserAction.setBadgeText({ text: null });
		}
	}
);

