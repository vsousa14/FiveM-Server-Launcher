const ipcRenderer = require("electron").ipcRenderer;
const find = require('find-process');

const addNumber = () => {
    ipcRenderer.send(
        "counter",
        document.querySelector("#c").innerText
    );
}

const removeNumber = () => {
    ipcRenderer.send(
        "counterMinus",
        document.querySelector("#c").innerText
    );
}

ipcRenderer.on("updateNumber", (event, data) => {
    let numberTag = document.querySelector("#c");
    numberTag.innerText = data;
});

const checkprocess = () => {
    var isOpened = false;
    find('name', 'FiveM', true)
  .then(function (list) {
    console.log('there are %s FiveM process(es)', list.length);
    if(list.length > 0){
        isOpened = true;
    }else{
        isOpened = false;
    }
    ipcRenderer.send(
        "fivemOpened",
        isOpened
    );
  });
 
}

ipcRenderer.on("fivemCheck", (event, data) => {
    alert(data);
});

ipcRenderer.on("updateStatus", (event, data) => {
    let numberTag = document.querySelector("#c");
    numberTag.innerText = data;
});