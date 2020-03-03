const body = document.getElementById("body")

//GRID VARIABLES
let words = ["EEEEE", "EEEEEEE"] // List of words
let grid = []

let difficulty = undefined
let selected = []
let validMoves = [] 
//GRID VARIABLES END HERE


//*DOM FUNCTIONS
document.addEventListener("DOMContentLoaded", function (event) {

    //transitionToGrid("medium") 
})
//DOM FUNCTIONS END HERE

//SELECTION FUNCTIONS


//SELECTION FUNCTIONS END HERE


//* GRID FUNCTIONS
function transitionToGrid(gridType){ //Call this method, with it's arguement, a difficulty to transition to grid.
    if(gridType !== "easy" && gridType !== "medium" && gridType == "hard") return //Early exit if difficulty not valid

    let k = document.createElement("div")
    k.setAttribute("class", "verticalContent")
    k.innerHTML = `
    <div class="timerBar">
        <div id="timer"> <h3>Timer:</h3>
            <div class="timer">
            </div>
        </div>
        <div id="word">
            <h3>Word:</h3>
            <div id="display_word"class="wordBox">

            </div>
        </div>
    </div>
    <div id="${gridType}-grid" class="contentWindow"></div>
    
    <div class="wordList">
        <h1>Words li</h1>
        <ul class="wordsUl"></ul>
    </div>
    </div>
    <div class="contentRight">
        <h1>High Scores</h1>
    </div>
    `
    let renderDisplay = document.querySelector("#renderDisplay")
    renderDisplay.appendChild(k)
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
    for(let i = 0; Math.sqrt(grids.childNodes.length) -1 > i; i++){
        for(let j = 0; Math.sqrt(grids.childNodes.length) - 1 > j; j++){
            if(selectedCoords[selectedCoords.length - 1] == `${i}_${j}`){
                document.getElementById(`${i}_${j}`).setAttribute("class", "element del")
            }
            else if(selectedCoords.includes(`${i}_${j}`)){
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
}
//* GRID FUNCTIONS END HERE