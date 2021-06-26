const grid = document.querySelector('.grid');
const flagsLeft = document.querySelector('#flagsLeft');
const result = document.querySelector('#result');

let height = 10;
let bombCount = 20;
let flags = 0;
let matrix = [];
let isGameOver = false;
let totalVisitedCells = 0;

// each of the 8 directions
const dx = [-1, -1, 0, 1, 1, 1, 0, -1];
const dy = [0, 1, 1, 1, 0, -1, -1, -1];

// to create the matrix
function createTheMatrix() {
    flagsLeft.innerHTML = "Flags-Left 🚩: " + bombCount;

    // gettting a shuffled array with bombs at random positions
    const badArray = Array(bombCount).fill('bomb');
    const goodArray = Array(height * height - bombCount).fill('valid');
    const totalArray = goodArray.concat(badArray);
    const shuffledArray = totalArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < height; i++) {
        const temp = [];
        for (let j = 0; j < height; j++) {
            const square = document.createElement('div');
            // const indices = {x: i, y: j};
            // square.setAttribute('data', indices);
            square.classList.add(shuffledArray[i * 10 + j]);
            grid.appendChild(square);
            temp.push(square);

            // detecting left click
            square.addEventListener('click', function(e) {
                depthFirstSearch(i, j);
                // not sure what is the rule of minesweeper search
                if (totalVisitedCells == height * height - bombCount) {
                    isGameOver = true;
                    result.innerHTML = "<span style='color: rgb(0, 255, 85);'>YOU WON</span>";
                }
            })

            // ctrl and right click
            square.oncontextmenu = function(e) {
                e.preventDefault(); // prevents the default right click
                addFlag(square);
            }

        }
        matrix.push(temp);
    }
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < height; j++) {
            let total = 0;
            if (matrix[i][j].classList.contains('valid')) {
                for (let k = 0; k < 8; k++) {
                    let x = i + dx[k], y = j + dy[k];
                    if (x < 0 || x >= height || y < 0 || y >= height) continue;
                    if (matrix[x][y].classList.contains('bomb')) total++;
                }
            }
            matrix[i][j].setAttribute('count', total);
            // if (total != 0)
                // matrix[i][j].innerHTML = total;
        }
    }
}

createTheMatrix();

result.innerHTML = "Playing...";

// add a flag with right click
function addFlag(square) {
    if (isGameOver) return;
    if (square.classList.contains('checked')) return;
    
    if (!square.classList.contains('flag')) {
        if (flags < bombCount) {
            square.classList.add('flag');
            square.innerHTML = '🚩';
            flags++;
        }
    } else {
        square.classList.remove('flag');
        square.innerHTML = '';
        flags--;
    }
    let rest = bombCount - flags;
        flagsLeft.innerHTML = "Flags-Left 🚩: " + rest;
}


function depthFirstSearch(i, j) {
    if (i < 0 || i >= height || j < 0 || j >= height) return;
    if (isGameOver) return;
    const square = matrix[i][j];
    if (square.classList.contains('flag')) return;
    if (square.classList.contains('checked')) return;
    if (square.classList.contains('bomb')) {
        gameOver();
    } else {
        totalVisitedCells++;
        let total = square.getAttribute('count');
        if (total != 0) {
            square.classList.add('checked');
            let numbers = ["", "one", "two", "three", "four"];
            square.classList.add(numbers[total]);
            square.innerHTML = total;
            return;
        }
        square.classList.add('checked');
        setTimeout(() => {
            for (let k = 0; k < 8; k++) {
                depthFirstSearch(i + dx[k], j + dy[k]);
            }
        }, 100)
    }
}

function gameOver() {
    result.innerHTML = "YOU LOST!";
    isGameOver = true;
    // show all the bombs

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < height; j++) {
            if (matrix[i][j].classList.contains('bomb')) {
                matrix[i][j].innerHTML = '💣';
                matrix[i][j].classList.remove('bomb');
                matrix[i][j].classList.add('checked');
            }
        }
    }
}