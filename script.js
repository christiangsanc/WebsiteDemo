var gameDimension = parseInt(getComputedStyle(document.body)
  .getPropertyValue("--game-dimension"));

let grid = document.getElementById("grid");

let cells = [];


let isMouseDown = false;
let paintMode = true;

grid.addEventListener("mousedown", (e) => {
    isMouseDown = true;
}); 
document.addEventListener("mouseup", () => {
    isMouseDown = false;
});

const majorStep = 4; 
for (let i = 0; i < gameDimension * gameDimension; i++) {
    let cellDiv = document.createElement("div");
    cellDiv.className = "cell";

    let row = Math.floor(i / gameDimension);
    let col = i % gameDimension;
 
    if ((row -2) % majorStep === 0) cellDiv.classList.add("major-row");
    if ((col -2) % majorStep === 0) cellDiv.classList.add("major-col");

    cellDiv.addEventListener("mousedown", function (e) {
        e.preventDefault();

        paintMode = !this.classList.contains("alive");

        this.classList.toggle("alive", paintMode);
    });

    cellDiv.addEventListener("mouseover", function () {
        if (isMouseDown) {
            this.classList.toggle("alive", paintMode);
        }
    });

    grid.appendChild(cellDiv);
    cells.push(cellDiv);
}

let ms = 100; 

let msSlider = document.getElementById("msSlider");
let msLabel = document.getElementById("msLabel");

msSlider.addEventListener("input", function () {
    ms = parseInt(this.value);
 
    msLabel.innerText = ms;
 
    if (playButton.classList.contains("alive")) {
        clearInterval(timeStepInterval);
        timeStepInterval = setInterval(executeTimeStep, ms);
    }
});

let isPlaying = false;
let playButton = document.getElementById("playBtn");
var timeStepInterval;
playButton.addEventListener("click", function () {
    if (isPlaying) {
        clearInterval(timeStepInterval);
        timeStepInterval = null;

        isPlaying = false;
        this.classList.remove("alive");
        this.innerText = "Play";
    } else {
        timeStepInterval = setInterval(executeTimeStep, ms);

        isPlaying = true;
        this.classList.add("alive");
        this.innerText = "Stop";
    }
});

let clearButton = document.getElementById("clearBtn");

clearButton.addEventListener("click", function () { 
    clearInterval(timeStepInterval);
    timeStepInterval = null;

    isPlaying = false;
    playButton.classList.remove("alive");
    playButton.innerText = "Play";

    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("alive");
    }
});

function executeTimeStep() {
    let nextState = new Array(cells.length).fill(false);

    for (let row = 0; row < gameDimension; row++) {
        for (let col = 0; col < gameDimension; col++) {

            let idx = toOneDimensionIndex(row, col, gameDimension);
            let activeNeighbors = getActiveNeighborsCount(cells, row, col, gameDimension);

            let isAlive = cells[idx].classList.contains("alive");

            if (isAlive) {
                nextState[idx] = (activeNeighbors === 2 || activeNeighbors === 3);
            } else {
                nextState[idx] = (activeNeighbors === 3);
            }
        }
    }
 
    for (let i = 0; i < cells.length; i++) {
        let willBeAlive = nextState[i];
        let isAlive = cells[i].classList.contains("alive");

        if(willBeAlive != isAlive){
        cells[i].classList.toggle("alive", nextState[i]);
        }
    }
}


function toOneDimensionIndex(row, col, gameDimension){
    return row*gameDimension + col;
}

function getActiveNeighborsCount(cells, row, col, gameDimension){
    // if(row < 0 || row >= gameDimension || col < 0 || col >= gameDimension){
    //     throw "row or col values in getActiviteNeighbors() out of index";
    // }

    // cells.forEach(element => {
    //     if(!element.classList.contains("cell")){
    //         throw 'GetActiveNeighbors(): at least one of the cells does not contain the "cell" class';
    //     }
    // })
    
    // if(cells.length != gameDimension*gameDimension){
    //     throw "GetActiveNeighbors(): cells array length does not match gameDimension squared";
    // }

    var count = 0;

    if(row-1>=0 && cells[toOneDimensionIndex(row-1,col,gameDimension)].classList.contains("alive")){
        count++;
    }
    if(row-1>=0 && col+1 < gameDimension && cells[toOneDimensionIndex(row-1,col+1,gameDimension)].classList.contains("alive")){
        count++;
    }
    if(col+1 < gameDimension && cells[toOneDimensionIndex(row,col+1,gameDimension)].classList.contains("alive")){
        count++;
    }
    if(row+1 < gameDimension && col+1 < gameDimension && cells[toOneDimensionIndex(row+1,col+1,gameDimension)].classList.contains("alive")){
        count++;
    }
    if(row+1 < gameDimension && cells[toOneDimensionIndex(row+1,col,gameDimension)].classList.contains("alive")){
        count++;
    }
    if(row+1 < gameDimension && col-1 >= 0 && cells[toOneDimensionIndex(row+1,col-1,gameDimension)].classList.contains("alive")){
        count++;
    }
    if(col-1 >= 0 && cells[toOneDimensionIndex(row,col-1,gameDimension)].classList.contains("alive")){
        count++;
    }
    if(row-1>=0 && col-1 >= 0 && cells[toOneDimensionIndex(row-1,col-1,gameDimension)].classList.contains("alive")){
        count++;
    }
    return count;
}