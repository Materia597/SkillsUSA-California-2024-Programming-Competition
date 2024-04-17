const {contextBridge, ipcRenderer} = require('electron')

//These are meant for communicating between the prompt javascript files and the main.js file

contextBridge.exposeInMainWorld('prompt-2', {
    getFileStructure: (folderPath, depth) => ipcRenderer.send('get-directories', folderPath, depth),
    fullfilledFileStructure: (callback) => ipcRenderer.on('fulfilled-file-strucuture', (_event, value) => callback(value)),
    clearSearchPrevention: () => ipcRenderer.send('reset-searched'),
})