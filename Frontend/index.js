const body = document.getElementById("body")
let USERID = ''
let USERNAME = ""

let baseUrl = "http://localhost:3000"

//GRID VARIABLES
let words = [] // List of words
let grid = []

let easyID = ''
let mediumID = ''
let hardID = ''
let timer = 300
let originTimer = 300
let pause = true
let patternType = "linearWords"

let score = 0
let matchByMultipler = 0
let difficultyMultipler = 0 
let timerMultipler = 0

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
    //renderSettingsWindow()
    //renderLogin()
})

document.addEventListener("click", function(e){
    // console.log(e.target)
    switch (e.target.dataset.id) {
        case "home":
            renderHome()
            break;
        case "word-data":
            renderWordData()
            break;
        case "sign-up":
            e.preventDefault()
            renderSignUp()
            break;
        case "logout":
            logout()
            break;
        case "rules":
            renderRules()
            break;
        case "edit-username":
            renderEditUsername()
            break;
        // case "rulesExit":
        //     renderHome()
        //     break;
        case "delete-username":
            deleteUsername(USERID)
            break;
        // case "new-game-hard":
        //     transitionToGrid("hard")
        //     break;
        case "submit-new-game":
            renderSettingsWindow()
            break;
            case "login-username":
                e.preventDefault()
                getUsername(document.querySelector("#login-username").value)
                //usernameFetch(e.target.parentNode.children[2].value)
                break;
        case "signup-username":
            e.preventDefault()
            postSignUp(document.querySelector("#signup-username").value)
            //usernameFetch(e.target.parentNode.children[2].value)
            break;
        case "edit-username-submit":
            e.preventDefault()
            editUsername(document.querySelector("#edit-username").value, USERID);
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
            
            <button class="submitButton" data-id="submit-new-game"> New Game </button><br>
            <button class="submitButton" data-id="edit-username"> Edit Username </button><br>
            <button class="submitButton" data-id="delete-username"> Delete Username </button>
        `
    } else {
        renderDisplay.innerHTML = `
        <div class="menu">
            <h1 class="menuItem">Hello!</h1>
            <h1 class="menuItem">Welcome to Wordsley, a word search game, please sign in below</h1>
            <form class="menuItem">
                <label for="username">Username:</label><br>
                <input type="text" id="login-username" name="username" >
                <input type="submit" value="Submit" data-id="login-username">
            </form>
            <p class="menuItem"> Don't have an account yet? <a href="" data-id="sign-up"> Sign up </a> </p>
        </div>
        `
    }
}
const login = document.getElementById("login-status")
const logout = () => {
    USERNAME = ""
    USERID = ''
    login.innerText = "Login"
    login.dataset.id = "login"
    renderHome()
}
const renderWordData = () => {
    console.log("worddata")
    // going to give a user links to open another window showing word selection data
}
const renderSignUp = () => {
    renderDisplay.innerHTML = `
        <div class="menu">
            <h1 class="menuItem">Hello!</h1>
            <h1 class="menuItem">Welcome to Wordsley, a word search game, please sign in below</h1>
            <h4 class="menuItem" id="signUpMenu">Create Username:</h4>
            <form class="menuItem" id="signUpMenu">
                <label for="username">Username:</label><br>
                <input type="text" id="signup-username" name="username" >
                <input type="submit" value="Sign up" data-id="signup-username">
            </form>
        </div>
        `
}

let overlay = document.getElementById("overlay")

const renderRules = () => {
    overlay.innerHTML = `
        <div id="rulesMenu">
            <br>
            <h1 class="menuItem">Rules!</h1>
            <div id="rulesMenuElements">
                <h3 class="rulesH3"> Settings: </h3>
                <ul>
                    <li class="rulesLi">Choose your difficulty! But beware - the harder your choice the larger the grid!</li>
                    <li class="rulesLi">Set your time! But beware - the lower the harder the game!</li>
                </ul>
            </div>
            <div id="rulesMenuElements">
                <h3 class="rulesH3"> Gameplay: </h3>
                <ol>
                    <li class="rulesLi">The game has begun! Review the game layout. At the top left you will notice a timer counting down! The game is on! Once the time runs out the game is over.</li>
                    <li class="rulesLi">At the top left you can find the word bar. As you select words you will see them come into being in this bar. You can check the word against your wordlist by pressing "Check Word" or clear your word by pressing "Reset Word"</li>
                    <li class="rulesLi">The game board consists of what appears to be random letters! The words are hidden here. Try clicking on the letters, they turn grey and green squares appaer next to them! The green squares indicate places you can click! Note: you can't click past the board, on words that have been found, or on letters you've already selected! If you find a word, it should turn green! If not try clicking "Check Word"</li>
                    <li class="rulesLi">Your word list resides on the right side of your game board. You might notice it labeled "Word List". It is your objective to find these words as fast as possible!</li>
                </ol>
            </div>


        `
}

const renderEditUsername = () => {
    renderDisplay.innerHTML = `
        <div class="menu">
            <h1 class="menuItem">Edit Username:</h1>
            <h1 class="menuItem">Please enter changes and click submit to save changes.</h1>
            <form class="menuItem">
                <label for="username">Username:</label><br>
                <input type="text" id="edit-username" name="username" value="${USERNAME}">
                <input type="submit" value="Submit" data-id="edit-username-submit">
            </form>
        </div>
    `
}
// MENU FUNCTIONS END HERE

// FETCH FUNCTIONS

const getUsername = (username) => {
    
    fetch(`${baseUrl}/users/${username}`)
    .then(resp => resp.json())
    .then(user => {
        if (user){
            USERNAME = user.username
            USERID = user.id
            login.innerText = "Logout"
            login.dataset.id = "logout"
            renderHome()
        } else {
            alert("Invalid Username")
        }
    })
    .catch(error => {
        console.log(error)
    })
}

const postSignUp = (username) => {
    let user = {username: username}
    // console.log(user)
    fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(user)
    })
    .then(resp => resp.json())
    .then(user => {
        USERNAME = user.username
        USERID = user.id
        login.innerText = "Logout"
        login.dataset.id = "logout"
        renderHome()
    })
    
}

const editUsername = (username, id) => {
    let user = {id: id, username: username}
    // console.log(user)
    fetch(`${baseUrl}/users/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(user)
    })
    .then(resp => resp.json())
    .then(user => {
        console.log(user)
        USERNAME = user.username
        USERID = user.id
        login.innerText = "Logout"
        login.dataset.id = "logout"
        renderHome()
    })
}

const deleteUsername = (id) => {
    fetch(`${baseUrl}/users/${id}`, { method: "DELETE" })
    .then(user => {
        USERNAME = ""
        USERID = ""
        renderHome()
    })
}

// FETCH FUNCTIONS END HERE

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
        sampleWords("easy")
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
    score = 0

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
            <button id="resetWord">Reset Word </button>
        </div>
    </div>
    &nbsp;&nbsp;<h3><div>Score: <strong id="score">${score}</strong></div></h3>
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
        <h2 id="displayWords"> Word List</h2>
    `

    renderDisplay.parentNode.appendChild(highScoresRightDisplay)

    renderDisplay.appendChild(gridMainContent)
    //populateWordList()
    populate(gridType)
}

function populate(gridType){ //Populates grid & adds click support. Note: GRID MUST BE CREATED PRIOR TO CALLING
    let n = undefined //Takes "easy", "medium", "hard" as arguements
    let analysis = undefined
    let letterSum = 0
    let wordListCharLength = 0
    let rng = undefined
    let curveRating = 0

    switch(gridType){
        case "easy":
            n = 13
            analysis = easyWords
            rng = 0.35
            curveRating = 0.3
        break;
        case "medium":
            n = 16
            analysis = mediumWords
            rng = 0.5
            curveRating = 0.4
        break;
        case "hard":
            n = 20
            analysis = hardWords
            rng = 0.65
            curveRating = 0.55
        break;
    }

    if(n == undefined){
        console.log("invalid input")
        return
    }

    let letterFrequency = new Array(26).fill(0)

    analysis.forEach(elem => {
        for(let i = 0; elem.length > i; i++){
            letterFrequency[elem[i].charCodeAt(0)-97]++ //Converts letter to ASCII for array mapping
            letterSum++
        }
    })

    words.forEach(elem => { //Gets character length of wordlist
        for(let i = 0; elem.length > i; i++){
            wordListCharLength++
        }
    })

    words.forEach(elem => { //Evens out character distribution if letter occurs less then 2% of the time
        for(let i = 0; elem.length > i; i++){
            if(letterSum/50 > letterFrequency[elem[i].charCodeAt(0)-97]){
                letterFrequency[elem[i].charCodeAt(0)-97] = Math.floor(letterSum/33)
            }
        }
    })

    for(let i = 1; letterFrequency.length > i; i++){ // Makes array aggregate sum
        letterFrequency[i] += letterFrequency[i-1]
    }
    letterSum = letterFrequency[letterFrequency.length - 1]


    let grid = [...Array(n)].map(e => Array(n).fill(0))
    

    function getLetter(){ //Gets letter from letter frequency, used in actual population
        let rand = Math.floor(Math.random() * letterSum)
        if(letterFrequency[0] > rand){
            return 0
        }
        for(let i = 1; letterFrequency.length > i; i++){
            if(rand >= letterFrequency[i-1] && letterFrequency[i] >= rand){
                return i
            }
        }
    }

    for(let i = 0; grid.length > i; i++){
        for(let j = 0; grid[0].length > j; j++){
            let newEle = document.createElement("div")
            grid[i][j] = String.fromCharCode(getLetter()+65)
            newEle.setAttribute("class", "element")
            newEle.innerText = grid[i][j]
            newEle.id = `${i}_${j}`
            document.querySelector(`#${gridType}-grid`).appendChild(newEle)
        }
    }

    let placed = []
    let vertical = []
    let verticalObstacles = {}
    let alreadyPlaced = []

    if(patternType == "linearWords"){
        for(let i = 0; n > i; i++){
            verticalObstacles[i] = []
        }

            words.forEach((val)=> {
                if(Math.random() > 0.5){
                let rand = Math.floor(Math.random() * n)
                while(placed.includes(rand)){
                    rand = Math.floor(Math.random() * n)
                }
                placed.push(rand)

                let startingPos = Math.floor(Math.random() * (n-val.length))

                if(Math.random() > rng){
                    for(let i = 0; val.length > i; i++){
                    document.getElementById(`${rand}_${startingPos + i}`).innerText = val[i].toString().toUpperCase()
                    verticalObstacles[rand].push(startingPos + i)//rand
                }
                } else{
                    for(let i = 0; val.length > i; i++){
                        document.getElementById(`${rand}_${startingPos + i}`).innerText = val[val.length - i - 1].toString().toUpperCase()
                        verticalObstacles[rand].push(startingPos + i)//rand
                    }
                }
                } else{
                    vertical.push(val)
                }
            })
            for(let i = 0; vertical.length > i; i++){
                let rand = Math.floor(Math.random() * (n -vertical[i].length))
                let column = Math.floor(Math.random() * (n -vertical[i].length))
                let valid = false
            
                while(valid == false){
                    let sequence = true
                    for(let j = 0; vertical[i].length > j; j++){
                        if(verticalObstacles[column + j].includes(rand) || alreadyPlaced.includes(rand)){
                            sequence = false
                        }
                    }
                    if(sequence == false){
                        column = Math.floor(Math.random() * (n -vertical[i].length))
                        rand = Math.floor(Math.random() * (n -vertical[i].length))
                    }else if(sequence == true){
                        alreadyPlaced.push(rand)
                        valid = true
                    }
                }

                if(Math.random() > rng){
                    for(let j = 0; vertical[i].length > j; j++){
                        document.getElementById(`${column + j}_${rand}`).innerText = vertical[i][j].toString().toUpperCase()
                    }
                } else{
                    for(let j = 0; vertical[i].length > j; j++){
                        document.getElementById(`${column + j}_${rand}`).innerText = vertical[i][vertical[i].length -j -1].toString().toUpperCase()
                    }
                }
            }
    } else if(patternType == "curvedWords"){
        let cache = []
        words.forEach(curvedWord => {
            let curr = [...Array(curvedWord.length)].map(e => Array(2).fill(0))
            let index = ["0_0"]


            curr[0] = [0,0]
            let rand = Math.random()
            if(0.25 > rand){
                curr[1] = [0,1]
                index.push("0_1")
            } else if(0.5 > rand){
                curr[1] = [1,0]
                index.push("1_0")
            } else if ( 0.75 > rand){
                curr[1] = [-1, 0]
                index.push("-1_0")
            } else if ( 1 > rand){
                curr[1] = [0,-1]
                index.push("0_-1")
            }

            
            for(let i = 2; curvedWord.length > i ; i++){
                if(Math.random() > (1 - curveRating)){
                    let prep = true
                    let curve = Math.random()
                    while(prep){
                        curve = Math.random()
                            if(0.25 > curve && !(index.includes(`${curr[i-1][0] + 1}_${curr[i-1][1]}`))){
                                index.push(`${curr[i-1][0] + 1}_${curr[i-1][1]}`)
                                curr[i] = [curr[i-1][0] + 1, curr[i-1][1]]
                                prep = false
                            } else if( 0.5 > curve && !(index.includes(`${curr[i-1][0] - 1}_${curr[i-1][1]}`))){
                                index.push(`${curr[i-1][0] - 1}_${curr[i-1][1]}`)
                                curr[i] = [curr[i-1][0] - 1, curr[i-1][1]]
                                prep = false
                            } else if ( 0.75 > curve && !(index.includes(`${curr[i-1][0]}_${curr[i-1][1] + 1}`))){
                                index.push(`${curr[i-1][0]}_${curr[i-1][1] + 1}`)
                                curr[i] = [curr[i-1][0], curr[i-1][1] + 1]
                                prep = false
                            } else if (1 > curve && !(index.includes(`${curr[i-1][0]}_${curr[i-1][1] - 1}`))){
                                index.push(`${curr[i-1][0]}_${curr[i-1][1] - 1}`)
                                curr[i] = [curr[i-1][0], curr[i-1][1] - 1]
                                prep = false
                            }
                        }
                    } 
                else{
                if(curr[i-1][0] - curr[i-2][0] != 0){
                    if(curr[i-1][0] > curr[i-2][0]){
                        index.push(`${curr[i-1][0] + 1}_${curr[i-1][1]}`)
                        curr[i] = [curr[i-1][0] + 1, curr[i-1][1]]
                    }
                    else{
                        index.push(`${curr[i-1][0] - 1}_${curr[i-1][1]}`)
                        curr[i] = [curr[i-1][0] - 1, curr[i-1][1]]
                    }
                } else if (curr[i-1][1] - curr[i-2][1] != 0) {
                    if(curr[i-1][1] > curr[i-2][1]){
                        index.push(`${curr[i-1][0]}_${curr[i-1][1] + 1}`)
                        curr[i] = [curr[i-1][0], curr[i-1][1] + 1]
                    }
                    else{
                        index.push(`${curr[i-1][0]}_${curr[i-1][1] - 1}`)
                        curr[i] = [curr[i-1][0], curr[i-1][1] - 1]
                    }
                }
            }
            }
            cache.push(curr)
        })

        let collisions = []
        for(let i = 0 ; words.length > i; i++){
            let randCol = Math.floor(Math.random() * n)
            let randRow = Math.floor(Math.random() * n)
            let canFit = false

            while(canFit == false){
                canFit = true
                randCol = Math.floor(Math.random() * n)
                randRow = Math.floor(Math.random() * n)
                for(let char = 0; words[i].length > char; char++){
                    if(collisions.includes(`${randCol + cache[i][char][0]}_${randRow + cache[i][char][1]}`) || document.getElementById(`${randCol + cache[i][char][0]}_${randRow + cache[i][char][1]}`) == undefined){
                        canFit = false
                    }
                }
            }

            if(Math.random > (rng - 0.15)){
                for(let char = 0; words[i].length > char; char++){
                    collisions.push(`${randCol + cache[i][char][0]}_${randRow + cache[i][char][1]}`)
                    document.getElementById(`${randCol + cache[i][char][0]}_${randRow + cache[i][char][1]}`).innerText = words[i][char].toString().toUpperCase()
                }
            } else {
                for(let char = 0; words[i].length > char; char++){
                    collisions.push(`${randCol + cache[i][char][0]}_${randRow + cache[i][char][1]}`)
                    document.getElementById(`${randCol + cache[i][char][0]}_${randRow + cache[i][char][1]}`).innerText = words[i][words[i].length - char - 1].toString().toUpperCase()
                }
            }

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
            if(document.getElementById(`${i}_${j}`) == null){continue}
            if(selectedCoords[selectedCoords.length - 1] == `${i}_${j}`){
                document.getElementById(`${i}_${j}`).setAttribute("class", "element del")
            }else if(selectedCoords.includes(`${i}_${j}`)){
                document.getElementById(`${i}_${j}`).setAttribute("class", "element selected")
            }else if( validMoves.includes(`${i}_${j}`)){
                document.getElementById(`${i}_${j}`).setAttribute("class", "element valid")
            }
            else if(document.getElementById(`${i}_${j}`) != null){
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
            } else if (selected.length > 75){ // Clears if selected length is greater than 75
                clear()
                updateGrid()
            }else if(validMoves.includes(e.target.id)){ //
                addSelection(getCords(e.target.id))
            }
            else{
              newSequence(getCords(e.target.id))
            }
  
            let result = selected.map(e => e[1]).join("")
            //console.log(result)
            document.querySelector("#display_word").innerText = result
  
            if(words.includes(result.toLowerCase())){
                document.querySelector("#displayWords").childNodes.forEach(i =>{
                    if(i.innerText == result.toLowerCase()){
                        score += result.length * ((1 + timerMultipler + matchByMultipler + difficultyMultipler) * 100)
                        updateScore(score)
                        i.setAttribute("class", "completedWord")
                        i.innerHTML = `<strike>${i.innerText}</strike>`
                    }
                })

                selected.forEach(e => {
                    document.getElementById(`${e[0]}`).setAttribute("class", "element solved")
                    document.getElementById(`${e[0]}`).id = ""
                    clear()
                    updateGrid()
                })
                let haveWon = []
                document.querySelector("#displayWords").childNodes.forEach( i=> {
                    if (i.className == "completedWord"){
                        haveWon.push(true)
                    } else {
                        haveWon.push(false)
                    }
                })
                haveWon.shift()
                if (!haveWon.includes(false)){
                    renderHome();
                    overlay.innerHTML = `
                    <div id="rulesMenu">
                        <br>
                        <h1 class="menuItem">YOU WIN!!!</h1>
                        <div id="gameOverOverlay">
                            <button> Play again? </button>
                        </div>
                    `
                    document.getElementById("overlay").style.display = "block";
                }
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
    if(!pause && document.querySelector("#minSec") != undefined){
        timer -= val
        if(0 >= timer){ //Code block executes if timer is at 0.
            pause = true
            document.querySelector("#minSec").innerText = "Game Over!"
        }
        document.querySelector("#minSec").innerText = `${Math.floor(timer/60)}:${("0" + (timer%60).toString()).slice(-2)}`
    }
    if (timer === 0){
        renderHome();
        timer = 300
        overlay.innerHTML = `
        <div id="rulesMenu">
            <br>
            <h1 class="menuItem">Oh no! You failed!....dummy</h1>
            <div id="gameOverOverlay">
                <button> Try again? </button>
            </div>
        `
        document.getElementById("overlay").style.display = "block";
    }
}

function updateScore(newScore){
    document.querySelector("#score").innerText = newScore
}


// GRID FUNCTIONS END HERE


// SETTINGS WINDOW FUNCTIONS 
function renderSettingsWindow() {
    difficulty = "easy"
    updateTimer(5)
    updatePattern("linearWords")

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
            <input type="radio" name="timer" value="5m" checked>
            <label for="5m">5 Min</label>
            <input type="radio" name="timer" value="10m">
            <label for="10m">10 Min</label>
            <input type="radio" name="timer" value="15m">
            <label for="15m">15 Min</label>
            <input type="radio" name="timer" value="20m">
            <label for="20m">20 Min</label>
            <input type="radio" name="timer" value="30m">
            <label for="30m">30 Min</label>
        </form>
        </div>
        <h2>&nbsp;Word Pattern</h2>
        <form id="matchType">
            <input type="radio" name="timer" value="linearWords" checked>
            <label for="5m">Horizontal And Vertical Words</label><br>
            <input type="radio" name="timer" value="curvedWords">
            <label for="10m">Curved Words</label>
        </form>
        <br>
        
        <p id="configDesc"><h3>Configuration Description:</h3> <br>
        <li id="displaySize"><strong>Grid Size:</strong> 13x13 (169 Elements)</li>
        <li id="displayTimer"> <strong>Timer:</strong> 30 Minutes</li>
        <li id="displayWords"><strong>Word List Length:</strong> 6 Words</li>
        <li id="genPattern"><strong>Generate Pattern:</strong> Horizontal and Vertical Words</li>
            <br>
            <li id="editDistanceCheck">Words Will Be <strong>Especially Distinct</strong> From Each Other</li>
            <li id="minLengthDisplay">Each Word Will Be <strong>3-6 Characters</strong> Long</li>
            <li id="dataSetLength">Words Pulled From: <strong>Easy</strong> Dataset of <strong>896</strong> words</li>
        </p>
        <button id="submitConfig"> Start Game </button>
        <br>
        </div>
        
        `
    //sampleWords("easy")
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

    document.querySelector("#matchType").addEventListener("click", function(e){
        updatePattern(e.target.value)
    })
}


function updatePattern(newType) {
    if(newType == "curvedWords"){
        patternType = "curvedWords"
        matchByMultipler = 0.5
        if(document.querySelector("#genPattern") == null) return
        document.querySelector("#genPattern").innerHTML = "<strong>Generate Pattern:</strong> Curved Lines Included <strong>(Hard)</strong>"
    } else if (newType == "linearWords" ){
        patternType = "linearWords"
        matchByMultipler = 0
        if(document.querySelector("#genPattern") == null) return
        document.querySelector("#genPattern").innerHTML = "<strong>Generate Pattern:</strong> Horizontal and Vertical Words"
    }
}

function initializeTimer(newTimer){
    if(newTimer.match(/^\d+m$/)){
        timer = parseInt(newTimer.match(/\d+/)*60)
        originTimer = parseInt(newTimer.match(/\d+/)*60)
        if(originTimer == 300){
            timerMultipler = 0.25
        } else{
            timerMultipler = 0
        }
    }
    document.querySelector("#displayTimer").innerHTML = `<strong>Timer:</strong> ${newTimer.match(/\d+/)} Minutes`
}

function updateDifficulty(newDifficulty){
    
    switch(newDifficulty){
        case 'easy':
            difficulty = "easy"
            difficultyMultipler = 0
            sampleWords("easy")
            document.querySelector("#displaySize").innerHTML = `<strong>Grid Size:</strong> 13x13 (169 Elements)`
            document.querySelector("#displayWords").innerHTML = `<strong>Word List Length:</strong> 6 Words`
            
            document.querySelector("#editDistanceCheck").innerHTML = `Words Will Be <strong>Especially Distinct</strong> From Each Other`
            document.querySelector("#minLengthDisplay").innerHTML = `Each Word Will Be <strong>3-6 Characters</strong> Long`
            document.querySelector("#dataSetLength").innerHTML = `Words Pulled From: <strong>Easy</strong> Dataset of <strong>${easyWords.length}</strong> words`
        break;

        case 'medium':
            difficulty = "medium"
            difficultyMultipler = 0.25
            sampleWords("medium")
            document.querySelector("#displaySize").innerHTML = `<strong>Grid Size:</strong> 16x16 (256 Elements)`
            document.querySelector("#displayWords").innerHTML = `<strong>Word List Length:</strong> 8 Words`

            document.querySelector("#editDistanceCheck").innerHTML = `Words Will Be <strong>Atleast Slightly Distinct</strong> From Each Other`
            document.querySelector("#minLengthDisplay").innerHTML = `Each Word Will Be <strong>5-8 Characters</strong> Long`
            document.querySelector("#dataSetLength").innerHTML = `Words Pulled From: <strong>Medium</strong> Dataset of <strong>${mediumWords.length}</strong> words`
        break;

        case 'hard':
            difficulty = "hard"
            difficultyMultipler = 0.5
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