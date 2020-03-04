const body = document.getElementById("body")
const USERID = 1
const USERNAME = "Tom"

let baseUrl = "http://localhost:3000"

//GRID VARIABLES
let words = [] // List of words
let grid = []

let easyID = ''
let mediumID = ''
let hardID = ''
let timer = 1800
let pause = true

let difficulty = "easy"
let selected = []
let validMoves = [] 
let renderDisplay = document.querySelector("#renderDisplay")

setInterval(updateTimer, 1000); //Updates timer every 1 second, if pause is false

//GRID VARIABLES END HERE

//WORD VARIABLES

let easyWords = []
let mediumWords = []
let hardWords = []

//WORD VARIABLES END HERE


//*DOM FUNCTIONS
document.addEventListener("DOMContentLoaded", function (event) {
    populateWords()
    renderHome()
    //renderLogin()
})

document.addEventListener("click", function(e){
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
            renderSettingsWindow()
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
            
            <button class="submitButton" data-id="submit-new-game"> New Game </button>
            <button class="submitButton" data-id="logout"> Logout </button>
            <button class="submitButton" data-id="edit-username"> Edit Username </button>
            <button class="submitButton" data-id="delete-username"> Delete Username </button>
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
            if(i.puzzle_setting_id % 3 == 1){
                easyWords.push(i.word)
            }else if(i.puzzle_setting_id % 3 == 2){ 
                mediumWords.push(i.word)
            }else if(i.puzzle_setting_id % 3 == 0){
                hardWords.push(i.word)
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
            <div class="timer"> &nbsp; <strong id="minSec">${Math.floor(timer/60)}:${("0" + (timer%60).toString()).slice(-2)}</strong>
            </div>
        </div>
        <div id="word">
            <h3>Word:</h3>
            <div id="display_word"class="wordBox">
            </div>&nbsp
            <button> Check Word </button>&nbsp
            <button id="resetWord">Reset Word </button>
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

    document.querySelector("#resetWord").addEventListener("click", function(e) {
        clear()
        updateGrid()
        document.querySelector("#display_word").innerText = ""
    })

    pause = false
}

function updateTimer(val = 1){
    if(!pause){
        timer -= val
        document.querySelector("#minSec").innerText = `${Math.floor(timer/60)}:${("0" + (timer%60).toString()).slice(-2)}`
    }
}


// GRID FUNCTIONS END HERE


// SETTINGS WINDOW FUNCTIONS 
function renderSettingsWindow() {
    document.querySelector("#renderDisplay").innerHTML = `
    <div id="difficulty">
        <h2>&nbsp;Choose Difficulty</h2>

        <div style="display: flex;">
        <form id="difficultySetting">
                <input type="radio" name="difficulty" value="easy" checked>
                <label for="easy">Easy</label>
                <input type="radio" name="difficulty" value="medium">
                <label for="medium">Medium</label>
                <input type="radio" name="difficulty" value="hard">
                <label for="hard">Hard</label>
        </form>
        </div>
        <br>
        <h2>&nbsp;Set Timer</h2>
        <div style="display: flex;">
        <form id="timer">
            <input type="radio" name="timer" value="10m">
            <label for="10m">10 Min</label>
            <input type="radio" name="timer" value="20m">
            <label for="20m">20 Min</label>
            <input type="radio" name="timer" value="30m" checked>
            <label for="30m">30 Min</label>
        </form>
        </div>
        <br>
        
        <p id="configDesc"><h3>Configuration Description:</h3> <br>
        <li id="displaySize"><strong>Grid Size:</strong> 13x13 (169 Elements)</li>
        <li id="displayTimer"> <strong>Timer:</strong> 30 Minutes</li>
        <li id="displayWords"><strong>Word List Length:</strong> 6 Words</li>
            <br>
            <li id="editDistanceCheck">Words Will Be <strong>Especially Distinct</strong> From Each Other</li>
            <li id="minLengthDisplay">Each Word Will Be <strong>3-6 Characters</strong> Long</li>
            <li id="dataSetLength">Words Pulled From: <strong>Easy</strong> Dataset of <strong>896</strong> words</li>
        </p>
        <button id="submitConfig"> Start Game </button>
        <br>
        </div>
        
        `
    loadSettingsWindowFunctions()
}


function loadSettingsWindowFunctions() {
    document.querySelector("#timer").addEventListener("change", function(e){
        initializeTimer(e.target.value)
    })

    document.querySelector("#difficultySetting").addEventListener("change", function(e){
        updateDifficulty(e.target.value)
    })

    document.querySelector("#submitConfig").addEventListener("click", function(e){
        event.target.parentNode.remove()
        transitionToGrid(`${difficulty}`)
        populateWordList()
    })
}

function initializeTimer(newTimer){
    if(newTimer.match(/^\d+m$/)){
        timer = parseInt(newTimer.match(/\d+/)*60)
    }
    document.querySelector("#displayTimer").innerHTML = `<strong>Timer:</strong> ${newTimer.match(/\d+/)} Minutes`
}

function updateDifficulty(newDifficulty){
    
    switch(newDifficulty){
        case 'easy':
            difficulty = "easy"
            sampleWords("easy")
            document.querySelector("#displaySize").innerHTML = `<strong>Grid Size:</strong> 13x13 (169 Elements)`
            document.querySelector("#displayWords").innerHTML = `<strong>Word List Length:</strong> 6 Words`

            document.querySelector("#editDistanceCheck").innerHTML = `Words Will Be <strong>Especially Distinct</strong> From Each Other`
            document.querySelector("#minLengthDisplay").innerHTML = `Each Word Will Be <strong>3-6 Characters</strong> Long`
            document.querySelector("#dataSetLength").innerHTML = `Words Pulled From: <strong>Easy</strong> Dataset of <strong>${easyWords.length}</strong> words`
        break;

        case 'medium':
            difficulty = "medium"
            sampleWords("medium")
            document.querySelector("#displaySize").innerHTML = `<strong>Grid Size:</strong> 16x16 (256 Elements)`
            document.querySelector("#displayWords").innerHTML = `<strong>Word List Length:</strong> 8 Words`

            document.querySelector("#editDistanceCheck").innerHTML = `Words Will Be <strong>Atleast Slightly Distinct</strong> From Each Other`
            document.querySelector("#minLengthDisplay").innerHTML = `Each Word Will Be <strong>5-8 Characters</strong> Long`
            document.querySelector("#dataSetLength").innerHTML = `Words Pulled From: <strong>Medium</strong> Dataset of <strong>${mediumWords.length}</strong> words`
        break;

        case 'hard':
            difficulty = "hard"
            sampleWords("hard")
            document.querySelector("#displaySize").innerHTML = `<strong>Grid Size:</strong> 20x20 (400 Elements)`
            document.querySelector("#displayWords").innerHTML = `<strong>Word List Length:</strong> 10 Words`

            document.querySelector("#editDistanceCheck").innerHTML = `Words Will Have <strong>No Distinction Check</strong>`
            document.querySelector("#minLengthDisplay").innerHTML = `Each Word Will Be <strong>8+ Characters</strong> Long`
            document.querySelector("#dataSetLength").innerHTML = `Words Pulled From: <strong>Hard</strong> Dataset of <strong>${hardWords.length}</strong> words`
        break;
    }

    //document.querySelector("#displayWords").innerHTML = `<strong>Word List Length: </strong> x `
}

// SETTINGS WINDOW FUNCTIONS END HERE