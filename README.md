# FiveM-Server-Launcher


Self coded FiveM Server Launcher

### Launcher Preview

![Launcher Preview](https://i.imgur.com/J0DMKyy.jpg)


## Setup

### Make sure you have .NET Framework 4.7.2 installed

1. Open the .sln file then go to Form1.cs and edit those variables: 
      - Line 26 public string ipSRV = "localhost:30120"; (don't remove the **:30120**)
      - Line 27 public string DiscordLink = "https://discord.gg/GWZsjkJ";
      - Line 28 public string ts3IP = "";
    
2. Run the project, clicking in the play button

3. And you're done.

### You can create a setup file for your launcher, or distribute the .exe file + Newtonsoft.Json.dll files located in FiveMServerLauncher > bin > debug, always include the Newtonsoft.Json.dll file!

## Support
If you're having trouble setting up the launcher, feel free to join my discord server: https://discord.gg/GWZsjkJ


## Known issues

1. Launcher dosen't update
2. If you open the launcher while opening the server, the application will broke
3. Custom font doesn't load


## Next updates

- [ ] Player list
- [ ] Update launcher every minute
- [ ] Redisign
- [ ] Add server announcements/logs
- [ ] Connect the launcher with the server database

## Done
- [x] Added server status
- [x] Added player Count
- [x] connect to the server
- [x] hyperlinks to discord and teamspeak3
