const ipcRenderer = require("electron").ipcRenderer;
const find = require('find-process');
const CFG = require("./config.json");
var IPServer = CFG.servers[0].ip;
var svpos = 0;

const fs = require('fs');
const regedit = require('regedit');
const Shell = require('node-powershell');
regedit.setExternalVBSLocation('resources/regedit/vbs')
var DIR_FiveM = "";

const openDiscord = () => {
    ipcRenderer.send("opendc"
    );
}

const addNumber = () => {
    ipcRenderer.send(
        "counter",
        document.querySelector("#c").innerText
    );
}

const minimizeApp = () => {
    ipcRenderer.send("minimizeApp")
}

const closeApp = () => {
    ipcRenderer.send("appClose")
}

if(CFG.servers.length > 1){
    let container = document.getElementById("cnt");

    let lArrow = document.createElement("span");
    lArrow.id = "la";
    lArrow.style.display = "none";
    lArrow.className = "material-icons";
    lArrow.innerText = "arrow_back_ios";
    lArrow.style.cursor = "pointer";
    container.prepend(lArrow);

    let rArrow = document.createElement("span");
    rArrow.id = "lr";
    rArrow.className = "material-icons";
    rArrow.innerText = "arrow_forward_ios";
    rArrow.style.cursor = "pointer";
    container.appendChild(rArrow);
    lArrow.onclick = () =>{serverSwitcher(0,lArrow ,rArrow);};
    rArrow.onclick = () =>{serverSwitcher(1,lArrow ,rArrow);};
    serverSwitcher(null, lArrow, rArrow);
}else{
    serverSwitcher(null, null, null);
}


var isOnline = false;
function serverSwitcher(pos, lArrow, rArrow){
    
    let totalPlayers = document.getElementById("totalPlayers");
    totalPlayers.innerText = `Loading`;
    let plist = document.getElementById("plist");
    plist.textContent = "";

    let svtotal = CFG.servers.length - 1;

        if(pos == 1 || pos == null){
            if(pos != null){
                svpos += 1;
            }
            if(svpos>svtotal){
                //DO NOTHING AND REMOVE RIGHT ARROW (return)
                rArrow.style.display = "none";
                return;
            }
            ;
            if(svpos==svtotal){
                rArrow.style.display = "none";
            }else{
                rArrow.style.display = "flex";
            }
            if(svpos > 0){
                lArrow.style.display = "flex";
            }else{
                lArrow.style.display = "none";
            }
            IPServer = CFG.servers[svpos].ip
        }
        if(pos == 0){
            svpos -= 1;    
            if(svpos< 0){
                //DO NOTTING AND REMOVE LEFT ARROW (return)
                lArrow.style.display = "none";
                return;
            }
            if(svpos==svtotal){
                lArrow.style.display = "none";
             } else{
                rArrow.style.display = "flex";
            }
    
            if(svpos == 0){
                lArrow.style.display = "none";
            }
    
            if(svpos < svtotal){
                rArrow.style.display = "flex";
            }else{
                rArrow.style.display = "none";
            }
            IPServer = CFG.servers[svpos].ip;
        }
       
        ipcRenderer.send(
            "serverStatus",
            CFG.servers[svpos].ip
        );

    let svnamePlaceHolder = document.getElementById("sv-name");
    let svStatusPlaceHolder = document.getElementById("sv-stat");
    let playBtn = document.getElementById("sv-join");

    svStatusPlaceHolder.style.backgroundColor = "grey";
    svStatusPlaceHolder.style.boxShadow = "0px 0px 4px 3px rgba(24, 24, 24, 0.25)";
    svStatusPlaceHolder.classList.add("animStatus");
    playBtn.innerText = "hourglass_empty"

    svnamePlaceHolder.innerText = CFG.servers[svpos].svname;
    ipcRenderer.on("StatusChecker", (event, data) => {
        if(data){
            isOnline = true;
            svStatusPlaceHolder.style.backgroundColor = "var(--green)";
            svStatusPlaceHolder.style.boxShadow = "0px 0px 4px 3px rgba(51, 255, 0, 0.25)";
            svStatusPlaceHolder.classList.remove("animStatus");
             //Get Directory FiveM
 regedit.list("HKCU\\SOFTWARE\\CitizenFX\\FiveM\\", function(err, result) {
    $.each(result, function(index, data) {
        if (data.values["Last Run Location"].value) {
            DIR_FiveM = data.values["Last Run Location"].value;
            if (fs.existsSync(DIR_FiveM)) {
                $("#sv-join").prop("disabled", false).text("play_circle_filled");
            } else {
                $("#sv-join").prop("disabled", true).text("close");
            }
            return;
        }
    });
});

$("#sv-join").on("click", function(){
    if (fs.existsSync(DIR_FiveM)) {
        $("#sv-join").prop("disabled", true);
        
        StartFiveM();

        setTimeout(function(){
            $("#sv-join").prop("disabled", false);
        }, 2000);
    }
});

if(isOnline){
    ipcRenderer.send(
        "getConnectedPlayers",
        CFG.servers[svpos].ip
    );
    ipcRenderer.on("listPlayers", (event, data) => {
        let totalPlayers = document.getElementById("totalPlayers");
        totalPlayers.innerText = `${data.length} Players Connected`;
        let plist = document.getElementById("plist");
        plist.textContent = "";
        if(data.length > 0){
            for(var y = 0; y <= data.length - 1; y++){
                let item = document.createElement("span");
                item.innerText = data[y].name;
                plist.appendChild(item);
            }
        }else{
            let item = document.createElement("span");
            item.innerText = "No data to display";
            item.style.opacity = "0.8";
            plist.appendChild(item);
        }
       
    });
}

        }else{
            isOnline = false;
            svStatusPlaceHolder.style.backgroundColor = "var(--red)";
            svStatusPlaceHolder.style.boxShadow = "0px 0px 4px 3px rgba(255, 0, 0, 0.25);";
            playBtn.setAttribute("disabled", true);
            playBtn.innerText = "signal_wifi_connected_no_internet_4";
            svStatusPlaceHolder.classList.remove("animStatus");

            let totalPlayers = document.getElementById("totalPlayers");
            totalPlayers.innerText = `Server Offline`;
            let plist = document.getElementById("plist");
            plist.textContent = "";
        }
    });
 }



function StartFiveM(){
    const ps = new Shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });
    
    ps.addCommand(`start fivem://connect/${IPServer}`);
    ps.invoke().then(output => {
        console.log(output);
    }).catch(err => {
        console.log(err);
    });

}