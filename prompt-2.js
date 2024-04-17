let search = ""

//Starts the request to the main process
function startRequest(path, searchTerm, depth = -1) {
    search = searchTerm
    requestFileStructure(path, depth)
}

function requestFileStructure(path, depth) {
    window['prompt-2'].getFileStructure(path, depth)
}

//gets all of the leys and puts them into an array
function objectToArray(obj) {
    let arr = []
    Object.keys(obj).forEach(key => {
        if(typeof obj[key] === "object") {
            objectToArray(obj[key]).forEach(el => arr.push(el))
        } else {
            arr.push(obj[key])
        }
    })
    return arr
}

//This code is run when the files are fetched
window['prompt-2'].fullfilledFileStructure(value => {
    console.log(value)
    window['prompt-2'].clearSearchPrevention()
    let simplified = objectToArray(value)
    let matchSearch = []
    simplified.forEach(path => {
        if(path?.includes(search)) {
            matchSearch.push(path)
        }
    })
    fileSearchOutput.innerHTML = ""
    matchSearch.forEach(match => {
        fileSearchOutput.insertAdjacentHTML('beforeend', `<div class="file-search-output">${match}</div>`)
    })
})

const folderInput = document.getElementById('folder-input')
const searchTerm = document.getElementById('search-term')
const depthInput = document.getElementById('depth-input')
const fileSearchOutput = document.getElementById('file-search-output-area')

//whenever an input has the enter key pressed the validateRequest if started
folderInput.addEventListener('keypress', (event) => {
    if(event.key === "Enter") {validateRequest()}
})

//whenever an input has the enter key pressed the validateRequest if started
searchTerm.addEventListener('keypress', (event) => {
    if(event.key === "Enter") {validateRequest()}
})

//whenever an input has the enter key pressed the validateRequest if started
depthInput.addEventListener('keypress', (event) => {
    if(event.key === "Enter") {validateRequest()}
})

//checks the rquest for errors and then goes through with the code
function validateRequest() {
    if(depthInput.value === "") depthInput.value = "-1"
    if(Number(depthInput.value) < -1) {
        window.alert("Depth can only be greater than -1")
    }
    startRequest(folderInput.value, searchTerm.value, Number(depthInput.value))

}