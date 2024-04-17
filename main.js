const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')
const fs = require('fs')

/* 
This program uses Node.Js and Electron.Js
This allows for interprocess communication, which means that the js prompt files coomunicate with this one through preload.js

To run the code, type "npm run start" in the terminal
If Node is not on your machine it may not work

*/


var searchedPaths = []

function getFolders(fileLocation, depth = -1) {
    
    //checks if a folder has been seen before, and if so then it will not go through with the process
    let exit = false
    searchedPaths.forEach(pa => {
        if(fileLocation.match(/\/[a-zA-Z\d]+?$/)[0] === pa) {
            //console.log(searchedPaths)
            exit = true
        }
    })

    if(exit) return
    if(searchedPaths.includes(fileLocation)) return []
    searchedPaths.push(fileLocation.match(/\/[a-zA-Z\d]+$/)[0])
    
    let folderStructure = {}

    //recursive approach, all elements are output from the operation, and then they are searched
    //if an element is a file, then it's information is input
    //if it is a directory then the function is called again with a different fileLocation and depth (if necessary)
    fs.readdirSync(fileLocation, {'withFileTypes': true}).forEach(element => {
        
        if(path.extname(element.name) !== "") {
            folderStructure[element.name] = path.join(element.path, element.name)
        } else if(path.extname(element.name) === "") {
            
            if(depth === -1) {
                folderStructure[element.name] = getFolders(path.join(element.path, element.name), -1)
            } else if(depth > 0) {
                folderStructure[element.name] = getFolders(path.join(element.path, element.name), depth - 1)
            }
        }
    })
    
    return folderStructure

}

ipcMain.on('validate-path', (event, pathName) => {
    if(fs.existsSync(pathName)) {
        event.reply('good-path')
    } else {
        event.reply('bad-path')
    }
})

ipcMain.on('get-directories', (_event, folderPath, depth) => {
    _event.reply('fulfilled-file-strucuture', getFolders(folderPath, depth))
})

ipcMain.on('reset-searched', () => {
    searchedPaths = []
})


const createWindow = () => {
    const win = new BrowserWindow({
        widht: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})