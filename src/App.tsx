import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
    const [channelName, setChannelName] = useState<string>('');
    const [savedYoutuberSpeed, setSavedYoutuberSpeed] = useState<number>(-1);
    const [savedGlobalSpeed, setSavedGlobalSpeed] = useState<number>(-1);
    const [inputSpeed, setInputSpeed] = useState<number>(1);
    const [shownInputSpeed, setShownInputSpeed] = useState<string>('1');

    useEffect(() => {
        const queryInfo = { active: true, lastFocusedWindow: true };

        chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
            const url = tabs[0].url;
            if (!url || !url.includes("ab_channel=")) return;

            const message = {
                message: "Return Channel Info",
            }

            const queryInfo: chrome.tabs.QueryInfo = {
                active: true,
                currentWindow: true
            };
            chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
                const currentTabId = tabs[0].id;
                if (!currentTabId) {
                    return;
                }
                chrome.tabs.sendMessage(
                    currentTabId,
                    message,
                    (response) => {
                        setChannelName(response[0]);
                        setSavedYoutuberSpeed(response[1]);
                        setSavedGlobalSpeed(response[2]);
                    });
            });
        });
    }, []);

    const sendPlaybackChangeRequest = (ourMessage: string) => {
        const message = {
            message: ourMessage,
            value: inputSpeed
        }

        const queryInfo: chrome.tabs.QueryInfo = {
            active: true,
            currentWindow: true
        };
        chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
            const currentTabId = tabs[0].id;
            if (!currentTabId) {
                return;
            }
            chrome.tabs.sendMessage(
                currentTabId,
                message,
                (response) => {
                    if (ourMessage == "Change Youtuber Default" && response == "Success") {
                        setSavedYoutuberSpeed(inputSpeed);
                    } else if (ourMessage == "Change Global Default" && response == "Success") {
                        setSavedGlobalSpeed(inputSpeed);
                    } else if (ourMessage == "Remove Youtuber Default" && response == "Success") {
                        setSavedYoutuberSpeed(-1);
                    }
                });
        });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Nick's Playback Extension</h1>
                <p>Youtuber Name: {channelName != '' ? channelName : "N/A"}</p>
                <p>Saved Youtuber Speed: {savedYoutuberSpeed != -1 ? savedYoutuberSpeed : 'N/A'}</p>
                <p>Saved Global Speed: {savedGlobalSpeed != -1 ? savedGlobalSpeed : 'N/A'}</p>
                <input
                    type='number'
                    value={shownInputSpeed}
                    onChange={(e) => {
                        setShownInputSpeed(e.target.value);
                        if (e.target.value == '') return;
                        const parsedNum: number = parseFloat(e.target.value)
                        if (parsedNum > 16) {
                            setShownInputSpeed('16');
                            return;
                        } else if (parsedNum < 0.1 && parsedNum > 0) {
                            setShownInputSpeed('0.1');
                            return;
                        } else if (parsedNum < 0) {
                            setShownInputSpeed('0');
                            return;
                        }
                        if (parsedNum > 16 || parsedNum < 0.1) return;
                        setInputSpeed(parsedNum);
                    }}
                />
                <button onClick={(e) => { sendPlaybackChangeRequest("Change Global Default") }}>Save Global Default</button>
                <button onClick={(e) => { sendPlaybackChangeRequest("Change Youtuber Default") }}>Save Youtuber Default</button>
                <button onClick={(e) => { sendPlaybackChangeRequest("Change Playback Speed") }}>Set Current Video Speed</button>
                <button onClick={(e) => { sendPlaybackChangeRequest("Remove Youtuber Default") }}>Remove Saved Youtuber Default</button>
            </header>
        </div>
    );
};

export default App;