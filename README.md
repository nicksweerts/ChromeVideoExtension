## Brief Description

This Chrome extension allows you to set and save playback speed for specific YouTube channels and global defaults. It allows you to set speeds between 0.1x and 16x. It also automatically speeds up any ads that are playing to 16x speed, which acts as a pseudo-adblock.

## Instructions on How to Run
- run 'npm install' in bash while in the 'ChromeVideoExtension' directory
- run 'npm run build' in bash while in the 'ChromeVideoExtension' directory
- In your Chrome browser, go to chrome://extensions/
  - change into Developer mode for extensions
  - click 'load unpacked'
  - navigate to and select 'ChromeVideoExtension' directory
  - The app should now be ready to be used


## Instructions on How to Use
You must first pin the extension:
![image](https://github.com/nicksweerts/ChromeVideoExtension/assets/80731633/420da6c4-ee73-4214-8572-1518da8323f3)

Then, on any YouTube page with a video, you will be able to click on the icon in the top right corner of Chrome to bring up the Playback controller:
![image](https://github.com/nicksweerts/ChromeVideoExtension/assets/80731633/435223d8-0cb4-45ed-aa1a-8373343e4f1d)
![image](https://github.com/nicksweerts/ChromeVideoExtension/assets/80731633/b2095998-1a48-459c-aa43-eed1ce195d9f)

In this controller, you will be able to see the current channel of the video playing and the current global default.
To set the channel default or a new global default, you must input the desired speed into the text box and then press the corresponding save button.

The extension's logic makes it so that on any YouTube video, it will default to the saved channel speed or the saved global default if no channel speed has been saved.
Finally, the extension will automatically detect any ads that are playing and set the speed to 16x while they play to speed through them quickly.

Thank you for checking out this project!
