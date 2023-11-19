let channelName = '';
let channelDefault = -1;
let globalDefault = 2;

// Change the playback speed of the video
const changePlaybackSpeed = (speed: number) => {
    const videos = document.getElementsByTagName('video');
    if (videos.length === 0) {
        console.log("No videos found");
        return false;
    };

    videos[0].playbackRate = speed;
    return true;
}

// Check the playback speed of the video
const checkPlaybackSpeed = () => {
    const videos = document.getElementsByTagName('video');
    if (videos.length === 0) {
        console.log("No videos found");
        return false;
    };

    return videos[0].playbackRate;
}

// Listener for messages from the React app
const messagesFromReactAppListener = (message: any, sender: any, response: any) => {
    // Basic checking message
    if (
        sender.id === chrome.runtime.id &&
        message.message === 'Hello from React') {
        response('Hello from content.js');
    } else if (
        sender.id === chrome.runtime.id &&
        message.message === "Return Channel Info") {
        // Get the channel name
        let channelElement = document.getElementById("channel-name");

        // Check to see if the channel name is valid and if it has changed
        // If it has changed, then update the channel name and the channel default
        // This is needed to make sure that the channel default is updated when the video changes in Youtube's modal design
        if (channelElement && channelElement.children[0] && channelElement.children[0].children[0] && channelElement.children[0].children[0].children[0] && channelElement.children[0].children[0].children[0].textContent) {
            if (channelElement.children[0].children[0].children[0].textContent !== channelName) {
                channelName = channelElement.children[0].children[0].children[0].textContent;
                chrome.storage.local.get(channelName).then((result) => {
                    if (result[channelName]) {
                        channelDefault = result[channelName];
                    } else {
                        channelDefault = -1;
                    }
                });
            }
        }
        response([channelName, channelDefault, globalDefault]);

    } else if (
        sender.id === chrome.runtime.id &&
        message.message === "Change Playback Speed") {
        // Change the playback speed
        if (changePlaybackSpeed(message.value)) {
            response("Completed Playback Change");
        } else {
            response("Failed Playback Change");
        }

    } else if (
        sender.id === chrome.runtime.id &&
        message.message === "Change Youtuber Default") {
        // Change the youtuber default
        chrome.storage.local.set({ [channelName]: message.value });

        if (changePlaybackSpeed(message.value)) {
            response("Success");
        } else {
            response("Fail");
        }

    } else if (
        sender.id === chrome.runtime.id &&
        message.message === "Change Global Default") {
        
        // Change the global default
        chrome.storage.local.set({ 'globalDefault': message.value }).then(() => {
            globalDefault = message.value
        });

        if (channelDefault !== -1) {
            response("Success");
            return;
        }

        if (changePlaybackSpeed(message.value)) {
            response("Success");
        } else {
            response("Fail");
        }

    } else if (
        sender.id === chrome.runtime.id &&
        message.message === "Remove Youtuber Default") {

        // Remove the youtuber default
        chrome.storage.local.remove([channelName]);
        changePlaybackSpeed(globalDefault);

        response("Success");
    }
}
// Wait for the page to load and then run mainWrapper
window.addEventListener('load', myMain);

function myMain() {
    // Remove the listener if it already exists
    if (chrome.runtime.onMessage.hasListener(messagesFromReactAppListener)) {
        chrome.runtime.onMessage.removeListener(messagesFromReactAppListener);
    }
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

    let beenfound = false

    let targetNode = document.getElementById("content");
    while (targetNode === null) {
        setTimeout(() => {
            targetNode = document.getElementById("content");
        }, 1000);
    }

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList: any, observer: any) => {
        for (const mutation of mutationList) {
            if (!beenfound && document.getElementById("channel-name")) {
                beenfound = true;
                // @ts-ignore
                channelName = document.getElementById("channel-name").children[0].children[0].children[0].textContent
                doc_loaded();
                observer.disconnect();
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode!, config);
}

function doc_loaded() {
    chrome.storage.local.get(channelName).then((result) => {
        if (result[channelName]) {
            channelDefault = result[channelName];
        }
        chrome.storage.local.get('globalDefault').then((result) => {
            if (result['globalDefault']) {
                globalDefault = result['globalDefault'];
            }
            if (channelDefault === -1) {
                changePlaybackSpeed(globalDefault)
            } else {
                changePlaybackSpeed(channelDefault)
            }
        });
    });
}

// Have timer run every second to check if the video has changed
// If it has, then change the playback speed
setInterval(() => {
    // Checking to see if an ad is playing on the video
    // If so, set the speed to be 16x
    const ad = document.getElementsByClassName("video-ads ytp-ad-module");
    if (ad.length !== 0 && ad[0].children.length !== 0) {
        changePlaybackSpeed(16);
        return;
    } else if (checkPlaybackSpeed() !== channelDefault && checkPlaybackSpeed() !== globalDefault) {
        changePlaybackSpeed(channelDefault == -1 ? globalDefault : channelDefault);
    }
}, 1500);

export { }