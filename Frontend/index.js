const body = document.getElementById("body")
const USERID = 1
const USERNAME = "Tom"

let baseUrl = "http://localhost:3000"

//GRID VARIABLES
let words = [] // List of words
let grid = []

let difficulty = undefined
let selected = []
let validMoves = [] 
let renderDisplay = document.querySelector("#renderDisplay")


//GRID VARIABLES END HERE

//WORD VARIABLES

let easyWords = []
let mediumWords = []
let hardWords = []

//WORD VARIABLES END HERE


//*DOM FUNCTIONS
document.addEventListener("DOMContentLoaded", function (event) {
    populateWords()

    setInterval(function(){ //TEsts populating wordlist
        sampleWords("easy")
        populateWordList()
    }, 3000)
    renderHome()
})

document.addEventListener("click", function(e){
    // console.dir(e.target.dataset.id)
    switch (e.target.dataset.id) {
        case "home":
            renderHome()
            break;
        case "word-data":
            renderWordData()
            break;
        case "login":
            renderLogin()
            break;
        case "rules":
            renderRules()
            break;
        case "new-game-hard":
            transitionToGrid("hard")
            break;
        case "submit-new-game":
            console.log(e.target)
            break;
        case "submit-username":
            e.preventDefault()
            console.log(e.target)
            break;
        default:
            break;
    }
})

//DOM FUNCTIONS END HERE

// MENU FUNCTIONS
const renderHome = () => {
    // when home is selected returns to the home page
    // welcome user and asks them if they want to play a game
    let wordList = document.getElementsByClassName("contentRight")[0]
    if (wordList){
        wordList.remove()
    }
    if (USERID){

        renderDisplay.innerHTML = `
        <div class="menu">
            <h1 class="menuItem">Welcome, ${USERNAME}</h1>

            <h1 class="menuItem">Would you like to play a new game?</h1>
            
            <button class="menuItem" data-id="submit-new-game"> New Game </button>
        </div>
        `
    } else {
        renderDisplay.innerHTML = `
        <div class="menu">
            <h1 class="menuItem">Hello!</h1>
            <h1 class="menuItem">Welcome to Wordsley, a word search game, please sign in below</h1>
            <form class="menuItem">
                <label for="username">Username:</label><br>
                <input type="text" id="username" name="username">
                <input type="submit" value="Submit" data-id="submit-username">
            </form>
        </div>
        `
    }
}
const renderWordData = () => {
    console.log("worddata")
    // going to give a user links to open another window showing word selection data
}
const renderLogin = () => {
    console.log("login")
    // brings them to the eddit username page
}
const renderRules = () => {
    console.log("rules")
    // renders the rules page
}

// MENU FUNCTIONS END HERE


//SETTING SELECTION FUNCTIONS


//SETTING SELECTION FUNCTIONS END HERE


// POPULATES WORDS
function populateWords(){
    fetch(`${baseUrl}/words`)
    .then(res => res.json())
    .then(data => {
        data.forEach(i => {
            switch(i.puzzle_setting_id){
                case 1:
                    easyWords.push(i.word)
                break;
                case 2:
                    mediumWords.push(i.word)
                break;
                case 3:
                    hardWords.push(i.word)
                break
            }
        })
    })
}

function sampleWords(diffculty){ //populateWords() Must be invokved prior ot this
    words = [] //Resets wordlist
    switch(diffculty){
        case "easy":
            for(let i = 0; 6 > i; i++){
                words.push(easyWords[Math.floor(Math.random() * easyWords.length)])
            }
        break;
        case "medium":
            for(let i = 0; 8 > i; i++){
                words.push(mediumWords[Math.floor(Math.random() * mediumWords.length)])
            }
        break;
        case "hard":
            for(let i = 0; 10 > i; i++){
                words.push(hardWords[Math.floor(Math.random() * hardWords.length)])
            }
        break;
    }
}

function populateWordList(){ //Words must not be empty, invoke sampleWords prior to running this.
    let masterList = document.querySelector("#displayWords")

   masterList.innerHTML = `Word List` //Resets previous html

    words.forEach(renderWord =>{
        let displayElement = document.createElement("LI")
        displayElement.className = "wordListLi"
        displayElement.innerHTML = `${renderWord}`
        masterList.appendChild(displayElement)
    })
}

// POPULATE WORD FUNCTION ENDS HERE

//* GRID FUNCTIONS
function transitionToGrid(gridType){ //Call this method, with it's arguement, a difficulty to transition to grid.
    if(gridType !== "easy" && gridType !== "medium" && gridType !== "hard") return //Early exit if difficulty not valid

    let gridMainContent = document.createElement("div") //Creates grid
    gridMainContent.innerHTML = `
    <div class="timerBar">
        <div id="timer"> <h3>Timer:</h3>
            <div class="timer">
            </div>
        </div>
        <div id="word">
            <h3>Word:</h3>
            <div id="display_word"class="wordBox">
            </div>
            <button> Check Word </button>
        </div>
    </div>
    <div id="${gridType}-grid" class="contentWindow"></div>
    
    </div>
    `
    // <div class="wordList">
    //     <h1>High Scores</h1>
    //     <ul class="wordsUl"></ul>
    // </div>

    let highScoresRightDisplay = document.createElement("div") //Creates Highscores on Right
    highScoresRightDisplay.setAttribute("class", "contentRight")

    highScoresRightDisplay.innerHTML = `
        <h1 id="displayWords"> Word List</h1>
    `

    renderDisplay.parentNode.appendChild(highScoresRightDisplay)

    renderDisplay.appendChild(gridMainContent)
    //populateWordList()
    populate(gridType)
}

function populate(gridType){ //Populates grid & adds click support. Note: GRID MUST BE CREATED PRIOR TO CALLING
    let n = undefined //Takes "easy", "medium", "hard" as arguements

    switch(gridType){
        case "easy":
            n = 13
        break;
        case "medium":
            n = 16
        break;
        case "hard":
            n = 20
        break;
    }

    if(n == undefined){
        console.log("invalid input")
        return
    }

    let grid = [...Array(n)].map(e => Array(n).fill(0))
    let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    //letters = letters.map(e => e = "E")
    for(let i = 0; grid.length > i; i++){
        for(let j = 0; grid[0].length > j; j++){
            let newEle = document.createElement("div")
            grid[i][j] = letters[Math.floor(Math.random() * 26)]
            newEle.setAttribute("class", "element")
            newEle.innerText = grid[i][j]
            newEle.id = `${i}_${j}`
            document.querySelector(`#${gridType}-grid`).appendChild(newEle)
        }
    }
    difficulty = `${gridType}-grid`
    loadContentWindowFunctions() //Loads content functionality
}

function clear(){
    selected = []
    validMoves = []
}

function getCords(id){
    return [parseInt(id.match(/^\d+/)[0]), parseInt(id.match(/\d+$/)[0])]
}

function newSequence(xy){
    clear()
    selected.push([`${xy[0]}_${xy[1]}`, document.getElementById(`${xy[0]}_${xy[1]}`).innerText]) //Example output ["3_6", "C"]

    validMoves.push(`${xy[0]+1}_${xy[1]}`)
    validMoves.push(`${xy[0]-1}_${xy[1]}`)
    validMoves.push(`${xy[0]}_${xy[1]+1}`)
    validMoves.push(`${xy[0]}_${xy[1]-1}`)
    updateGrid()
}

function addSelection(xy){
    let coords = selected.map(e=> e[0])
    if(coords.includes(`${xy[0]}_${xy[1]}`)){return}

    validMoves = []
    let id = [`${xy[0]}_${xy[1]}`]
    selected.push([`${xy[0]}_${xy[1]}`, document.getElementById(id).innerText])
    if(!(selected.includes(`${xy[0]+1}_${xy[1]}`))){validMoves.push(`${xy[0]+1}_${xy[1]}`)}
    if(!(selected.includes(`${xy[0]-1}_${xy[1]}`))){validMoves.push(`${xy[0]-1}_${xy[1]}`)}
    if(!(selected.includes(`${xy[0]}_${xy[1]+1}`))){validMoves.push(`${xy[0]}_${xy[1]+1}`)}
    if(!(selected.includes(`${xy[0]}_${xy[1]-1}`))){validMoves.push(`${xy[0]}_${xy[1]-1}`)}
    updateGrid()
}

function delMostRecent(){
    if(selected.length == 1){
        clear() 
        updateGrid() 
        return
    }
    selected.pop()
    let xy = getCords(selected[selected.length-1][0])
    validMoves = []
    if(!(selected.includes(`${xy[0]+1}_${xy[1]}`))){validMoves.push(`${xy[0]+1}_${xy[1]}`)}
    if(!(selected.includes(`${xy[0]-1}_${xy[1]}`))){validMoves.push(`${xy[0]-1}_${xy[1]}`)}
    if(!(selected.includes(`${xy[0]}_${xy[1]+1}`))){validMoves.push(`${xy[0]}_${xy[1]+1}`)}
    if(!(selected.includes(`${xy[0]}_${xy[1]-1}`))){validMoves.push(`${xy[0]}_${xy[1]-1}`)}
    updateGrid()
}

function updateGrid(){
    let grids = document.querySelector(`#${difficulty}`)
    let selectedCoords = selected.map(e => e[0])
    for(let i = 0; Math.sqrt(grids.childNodes.length) > i; i++){
        for(let j = 0; Math.sqrt(grids.childNodes.length) > j; j++){
            if(selectedCoords[selectedCoords.length - 1] == `${i}_${j}`){
                document.getElementById(`${i}_${j}`).setAttribute("class", "element del")
            }else if(selectedCoords.includes(`${i}_${j}`)){
                document.getElementById(`${i}_${j}`).setAttribute("class", "element selected")
            }else if( validMoves.includes(`${i}_${j}`)){
                document.getElementById(`${i}_${j}`).setAttribute("class", "element valid")
            }
            else{
                document.getElementById(`${i}_${j}`).setAttribute("class", "element")
            }
        }
    }
} 

function loadContentWindowFunctions(){
    document.querySelector(".contentWindow").addEventListener("click", (e) => {
        if(e.target.className !== undefined){ //
            if(selected.length == 0){ //First element in sequence?
               newSequence(getCords(e.target.id))
            }else if(selected.length > 0 && e.target.id == selected[selected.length -1][0]){ //Unselects from first element
                  delMostRecent()
                  updateGrid()
            } else if (selected.length > 19){ // Clears if selected length is greater than 19
                clear()
                updateGrid()
            }else if(validMoves.includes(e.target.id)){ //
                addSelection(getCords(e.target.id))
            }
            else{
              newSequence(getCords(e.target.id))
            }
  
            let result = selected.map(e => e[1]).join("")
            document.querySelector("#display_word").innerText = result
  
            if(words.includes(result)){
                console.log("found!")
            }
        }
    })

    document.querySelector("#displayWords").addEventListener("click", function(e){
        if(e.target.parentNode.id == "displayWords"){
            e.target.innerHTML = `<strike>${e.target.innerHTML}</strike>`
        }
        if(e.target.parentNode.parentNode.id == "displayWords"){
            e.target.parentNode.innerHTML = e.target.innerText
        }
    })
}
// GRID FUNCTIONS END HERE