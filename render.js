const ipcRenderer = require("electron").ipcRenderer;

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