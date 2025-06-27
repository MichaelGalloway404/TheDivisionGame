// Hide/Unhide rules for player
document.getElementsByClassName('rulesButton')[0].addEventListener('click', function () {
    document.getElementsByClassName('rules')[0].classList.toggle('hidden');
    document.getElementsByClassName('panel')[0].classList.toggle('hidden');

    for (let i = 0; i < document.querySelectorAll(".DirButton").length; i++) {
        document.querySelectorAll(".DirButton")[i].classList.toggle('hidden');
    }
    for (let i = 0; i < document.querySelectorAll(".square").length; i++) {
        document.querySelectorAll(".square")[i].classList.toggle('hidden');
    }
});

// temp map
let map = [
    [40, 2, 71, 12, 8],
    [51, 8, 28, 43, 92],
    [12, 80, 12, 9, 67],
    [2, 25, 8, 81, 13],
    [3, 18, 34, 12, 1]
]

// helper function to save the current map state
function saveMap(map) {
    let newMap = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            newMap[i][j] = map[i][j];
        }
    }
    return newMap;
}

// variables to keep track of moves
let mapHistory = [];

// kees track of the moves made by the player
let moveList = [];

function randomMap() {
    let newMap = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            newMap[i][j] = Math.floor(Math.random() * 99) + 1; // 1-99
        }
    }
    return newMap;
}
map = randomMap();

// assign starting positon randomly
let currentPos = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];

// control if the player can add or subtract
let canAddSubtract = true;

// control if a move can be undone
let canUndo = false;

// helper funtion to determine the outcome of a move
function setDivisionOutcome(x, y, newVal, oldVal) {
    // if value being diveded is less than the devisor
    if (newVal < oldVal) {
        // grab the tenths place for exaple 3/7 = 0.42 - we will store the 4 in remainder
        let remainder = Math.floor(((newVal / oldVal) * 10) % 10)
        if (remainder == 0) {
            remainder = 1; // for numbers like 8/99 = 0.0808... which would give a remainder of 0
        }
        map[currentPos[0]][currentPos[1]] = remainder // new current position = remainder
        // grab the hundredths place for exaple 3/7 = 0.42 - we will store the 2 in remainder
        map[currentPos[0] + x][currentPos[1] + y] = Math.floor(((newVal / oldVal) * 100) % 10) // previous position
    } else {
        // grab the ones place
        map[currentPos[0]][currentPos[1]] = Math.floor(newVal / oldVal) // current position 
        // grab the tenths place
        map[currentPos[0] + x][currentPos[1] + y] = Math.floor(((newVal / oldVal) * 10) % 10) // previous position
    }
}

// function to move player in a direction
function move(dir) {
    // get current position and save it 
    let oldVal = map[currentPos[0]][currentPos[1]];
    let newVal;
    // check if the move is valid based on the direction
    if (dir == 'u' && currentPos[0] - 1 >= 0 && map[currentPos[0] - 1][currentPos[1]] != 0) {
        // save the current map state before moving
        mapHistory.push(saveMap(map))
        // move the player
        currentPos[0] = currentPos[0] - 1;
        // get new current position and save it
        newVal = map[currentPos[0]][currentPos[1]];
        // update new and old values in the map with the correct division outcome
        setDivisionOutcome(1, 0, newVal, oldVal);
        // add the move to the move list
        moveList.push('u');
        // canAddSubtract is set to true so the player can add or subtract
        canAddSubtract = true;
    }
    if (dir == 'd' && currentPos[0] + 1 < map[0].length && map[currentPos[0] + 1][currentPos[1]] != 0) {
        mapHistory.push(saveMap(map))
        currentPos[0] = currentPos[0] + 1;
        newVal = map[currentPos[0]][currentPos[1]];
        setDivisionOutcome(-1, 0, newVal, oldVal);
        moveList.push('d');
        canAddSubtract = true;
    }
    if (dir == 'r' && currentPos[1] + 1 < map[0].length && map[currentPos[0]][currentPos[1] + 1] != 0) {
        mapHistory.push(saveMap(map))
        currentPos[1] = currentPos[1] + 1;
        newVal = map[currentPos[0]][currentPos[1]];
        setDivisionOutcome(0, -1, newVal, oldVal);
        moveList.push('r');
        canAddSubtract = true;
    }
    if (dir == 'l' && currentPos[1] - 1 >= 0 && map[currentPos[0]][currentPos[1] - 1] != 0) {
        mapHistory.push(saveMap(map))
        currentPos[1] = currentPos[1] - 1;
        newVal = map[currentPos[0]][currentPos[1]];
        setDivisionOutcome(0, 1, newVal, oldVal);
        moveList.push('l');
        canAddSubtract = true;
    }
}

// functions to increment the current position value
function incCurr() {
    if (canAddSubtract) {
        moveList.push('+');
        mapHistory.push(saveMap(map))
        map[currentPos[0]][currentPos[1]] += 1;
        // only allow adding or subtracting once per move
        canAddSubtract = false;
    }
}

// functions to decrement the current position value
function decCurr() {
    if (canAddSubtract && map[currentPos[0]][currentPos[1]] > 1) {
        moveList.push('-');
        mapHistory.push(saveMap(map))
        map[currentPos[0]][currentPos[1]] -= 1;
        // only allow adding or subtracting once per move
        canAddSubtract = false;
    }
}

// function to update the map on the screen
function changeMap() {
    // if the map changes player is allowed to undo the move
    canUndo = true;
    let cellNumber = 0;
    for (let i in map) {
        for (let j in map[i]) {
            document.getElementsByClassName('square')[cellNumber].innerHTML = map[i][j];
            if (currentPos[0] == i && currentPos[1] == j) {
                //  highlight the current players position
                document.getElementsByClassName('square')[cellNumber].classList.add('green');
            } else {
                document.getElementsByClassName('square')[cellNumber].classList.remove('green');
            }
            cellNumber++;
        }
    }
}

//  function to submit the map and calculate the final penalty score
function submitMap() {
    let cellNumber = 0;
    let score = 0;
    for (let i in map) {
        for (let j in map[i]) {
            document.getElementsByClassName('square')[cellNumber].innerHTML = map[i][j];
            if (map[i][j] != 0) {
                document.getElementsByClassName('square')[cellNumber].classList.add('red');
                score += map[i][j];
            }
            if (currentPos[0] == i && currentPos[1] == j) {
                //  remove the player highlight from the current players position
                document.getElementsByClassName('square')[cellNumber].classList.remove('green');
            }
            cellNumber++;
        }
    }
    document.getElementsByClassName('score')[0].innerHTML = 'Final Penalty Score: ' + score;
}

// function to undo the last move
function undoMove() {
    if (canUndo == true) {
        // canUndo is set to false so the player cannot undo again until a new move is made, no risk of mapHistory being empty
        let undo = mapHistory.pop();
        // map now equals the last saved map state
        map = undo;
        // if there are moves in the moveList, remove the last move
        if (moveList) {
            let lastMove = moveList.pop();
            let sencondToLastMove = null;
            // if there is a second to last move, save it
            if (moveList) {
                sencondToLastMove = moveList.pop();
            }
            // moving the player back to the previous position
            switch (lastMove) {
                case 'd':
                    currentPos[0] = currentPos[0] - 1;
                    break;
                case 'u':
                    currentPos[0] = currentPos[0] + 1;
                    break;
                case 'l':
                    currentPos[1] = currentPos[1] + 1;
                    break;
                case 'r':
                    currentPos[1] = currentPos[1] - 1;
                    break;
                default:
                    break;
            }
            // if the second to last move was an increment or decrement, undo that as well
            if (sencondToLastMove !== null) {
                if (sencondToLastMove == '-') {
                    map[currentPos[0]][currentPos[1]] += 1;
                    canAddSubtract = true;
                }
                if (sencondToLastMove == '+') {
                    map[currentPos[0]][currentPos[1]] -= 1;
                    canAddSubtract = true;
                }
            }
        }
        // display updated map on the screen
        changeMap();
        canAddSubtract = true;
    }
    canUndo = false;
}

// fresh the map on page load
changeMap();

// main game loop to handle button clicks
for (let i = 0; i < document.querySelectorAll(".DirButton").length; i++) {
    document.querySelectorAll(".DirButton")[i].addEventListener("click", function () {
        let dir = document.querySelectorAll(".DirButton")[i].className;
        // Get the direction from the class name
        dir = dir.split(' ')[1];
        switch (dir) {
            // each case corresponds to buttons second class name
            case 'down':
                move('d');
                changeMap();
                break;
            case 'up':
                move('u');
                changeMap();
                break;
            case 'left':
                move('l');
                changeMap();
                break;
            case 'right':
                move('r');
                changeMap();
                break;
            case '+':
                incCurr();
                changeMap();
                break;
            case '-':
                decCurr();
                changeMap();
                break;
            case 'undo':
                undoMove();
                break;
            case 'submit':
                submitMap();
                break;
            default:
                break;
        }
    });
}