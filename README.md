# FiveM-Server-Launcher

### Launcher Preview

![Launcher Preview](https://cdn.discordapp.com/attachments/731815909928337448/984213151656595557/unknown.png)

## Game Overlay (BETA)
![Overlay Preview](https://cdn.discordapp.com/attachments/777950852451139704/1028810513817284608/unknown.png)
If you set `useOverlay` to `true`, you will be able to change server while connected to a server (pressing `Alt+Shift+S`), but be aware that his feature is not finished yet, so you might find some issues.

## Setup

Setup video https://www.youtube.com/watch?v=rWFMe7yaKwM

If you have troubles setting up or have a suggestion, please join my discord server (link below)

- Make sure you have NodeJs installed in your machine
- open your terminal and run `npm i`, make sure that you're in the root folder of the launcher
- edit `config.json` with your preferences, in the svname you can type your server name, and in the ip field you will add the numbers and letters after the `cfx.re/join/`
- to build the application, install electron builder using `npm i --save-dev electron-builder`, go to `package.json` move electron from `dependencies` to `devDependencies` and in the scripts part create this script `"build": "electron-builder"` add the code below after the scripts, open a new terminal and run the script you created using `npm run build`

## package.json build settings
"build":{
    "appId": "SOUSA Launcher",
    "win":{
      "target": [
        "nsis"
      ],
      "icon":"icon.ico"
    },
    "nsis":{
      "oneClick":true,
      "installerIcon":"icon.ico",
      "uninstallerIcon":"icon.ico",
      "uninstallDisplayName": "SOUSA Launcher Uninstaller",
      "license":"license.md",
      "allowToChangeInstallationDirectory":false
    },
    "extraResources": [
      {
        "from": "node_modules/regedit/vbs",
        "to": "regedit/vbs",
        "filter": [
          "**/*"
        ]
      }
    ]
  },

## Changing application style
tutorial coming soon

## Better support
if this didn't help you, you can use the forums on my discord : https://discord.gg/GWZsjkJ
