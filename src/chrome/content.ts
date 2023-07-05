let channelName = '';
let channelDefault = -1;
let globalDefault = 2;

const changePlaybackSpeed = (speed: number) => {
    const videos = document.getElementsByTagName('video');
    if (videos.length == 0) return false;
    videos[0].playbackRate = speed;
    return true;
}

const messagesFromReactAppListener = (message: any, sender: any, response: any) => {
    if (
        sender.id === chrome.runtime.id &&
        message.message === 'Hello from React') {
        response('Hello from content.js');
    } else if (
        sender.id === chrome.runtime.id &&
        message.message === "Return Channel Info") {
        response([channelName, channelDefault, globalDefault]);
    } else if (
        sender.id === chrome.runtime.id &&
        message.message === "Change Playback Speed") {
        if (changePlaybackSpeed(message.value)) {
            response("Completed Playback Change");
        } else {
            response("Failed Playback Change");
        }
    } else if (
        sender.id === chrome.runtime.id &&
        message.message === "Change Youtuber Default") {

        chrome.storage.local.set({ [channelName]: message.value });

        if (changePlaybackSpeed(message.value)) {
            response("Success");
        } else {
            response("Fail");
        }
    } else if (
        sender.id === chrome.runtime.id &&
        message.message === "Change Global Default") {

        chrome.storage.local.set({ 'globalDefault': message.value }).then(() => {
            globalDefault = message.value
        });

        if (channelDefault != -1) {
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

        chrome.storage.local.remove([channelName]);

        response("Success");
    }
}

window.addEventListener("load", mainWrapper, false);

function mainWrapper() {
    setTimeout(() => {
        myMain();
    }, 1000);
}

function myMain() {
    /**
     * Fired when a message is sent from either an extension process or a content script.
     */
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

    let beenfound = false

    let targetNode = document.getElementById("content");
    if (!targetNode) {
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
            if (channelDefault == -1) {
                changePlaybackSpeed(globalDefault)
            } else {
                changePlaybackSpeed(channelDefault)
            }
        });
    });
}
export { }