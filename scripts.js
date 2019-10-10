var selectedDifficulty = "easy";
var clickedCell;
var time = 0;
var amoutOfNumbers = [0,0,0,0,0,0,0,0,0];
var board = [];
var startingBoard = [];
var interval;

function squareClick(cell) {
    if(clickedCell != undefined) {
        for(i = 0; i < 9; i ++) {
            document.getElementById(clickedCell.id[0] + i).style.background = "transparent";
            document.getElementById(i + clickedCell.id[1]).style.background = "transparent";
        }
    }
    for(i = 0; i < 9; i ++) {
        document.getElementById(cell.id[0] + i).style.background = "#99ff99";
        document.getElementById(i + cell.id[1]).style.background = "#99ff99";
    }
    cell.style.background = "white";
    clickedCell = cell;
    if(board[Number(clickedCell.id[1])][Number(clickedCell.id[0])] != 0) {
        for(i = 0; i < 9; i++) {
            for(j = 0; j < 9; j++) {
                if(board[i][j] == Number(board[Number(clickedCell.id[1])][Number(clickedCell.id[0])])) {
                    document.getElementById(String(j) + String(i)).style.color = "red";
                } else {
                    document.getElementById(String(j) + String(i)).style.color = "black";
                }
            }
        }
    } else {
        for(i = 0; i < 9; i++) {
            for(j = 0; j < 9; j++) {
                document.getElementById(String(j) + String(i)).style.color = "black";
            }
        }
    }
}

function markCell(value) {
    if(clickedCell != undefined && startingBoard[Number(clickedCell.id[1])][Number(clickedCell.id[0])] == 0) {
        var n = board[Number(clickedCell.id[1])][Number(clickedCell.id[0])];
        if(value == 0) {
            if(n != 0) {
                if(amoutOfNumbers[n - 1] == 9) {
                    unblockNumber(n);
                }
                amoutOfNumbers[n-1] -= 1;
            }
            clickedCell.innerHTML = "";
        } else {
            amoutOfNumbers[value - 1] += 1;
            if(amoutOfNumbers[value - 1] == 9) {
                blockNumber(value);
            }
            if(n != 0) {
                if(amoutOfNumbers[n - 1] == 9) {
                    unblockNumber(n);
                }
                amoutOfNumbers[n - 1] -= 1;
            }
            clickedCell.innerHTML = value;
        }
        board[Number(clickedCell.id[1])][Number(clickedCell.id[0])] = value;
        squareClick(clickedCell);
    }
}

function setBoard() {
    for(i = 1; i <= 9 ; i++) {
        unblockNumber(i);
    }
    amoutOfNumbers = [0,0,0,0,0,0,0,0,0];
    for(i = 0; i < 9; i++) {
        for(j = 0; j < 9; j++) {
            if(board[i][j] == 0) {
                document.getElementById(String(j) + String(i)).innerHTML = "";
            } else {
                document.getElementById(String(j) + String(i)).innerHTML = board[i][j];
                amoutOfNumbers[board[i][j] - 1] += 1;
            }
        }
    }
}

function startNewGame() {
    document.getElementById("status").innerHTML = "Nierozwiązane";
    startTimer();
    time = -1;
    if(selectedDifficulty == "easy") {
        document.getElementById("currentDifficult").innerHTML = "Łatwy";
    } else if(selectedDifficulty == "medium") {
        document.getElementById("currentDifficult").innerHTML = "Średni";
    } else {
        document.getElementById("currentDifficult").innerHTML = "Trudny";
    }
    $.get('https://sugoku.herokuapp.com/board?difficulty='+selectedDifficulty)
    .done(function (data) {
        board = data.board;
        startingBoard = board.map(function(arr) {
            return arr.slice();
        });
        setBoard();
    })
}

function startTimer() {
    clearInterval(interval);
    interval = setInterval(function() {
        time++;
        var hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
        var minutes = Math.floor((time % (60 * 60)) / (60));
        var seconds = Math.floor((time % 60));
        if(String(seconds).length == 1) {
            seconds = "0"+seconds;
        }
        if(String(minutes).length == 1) {
            minutes = "0"+minutes;
        }
        if(String(hours).length == 1) {
            hours = "0"+hours;
        }
        document.getElementById("timer").innerHTML = hours+":"+minutes+":"+seconds;
    },1000);
}

function reset() {
    document.getElementById("status").innerHTML = "Nierozwiązane";
    startTimer();
    time = -1;
    board = [];
    board = startingBoard.map(function(arr) {
        return arr.slice();
    });
    setBoard();
}

function check() {
    $.post('https://sugoku.herokuapp.com/validate', {board: JSON.stringify(board)}).done(function (response) {
        var status = response.status;
        if(status == "solved"){
            document.getElementById("status").innerHTML = "Rozwiązane";
            clearInterval(interval);
            window.alert("Gratulacje! Roziązano sudoku.");
        } else {
            document.getElementById("status").innerHTML = "Nierozwiązane";
        }
    })
}

function solve() {
    clearInterval(interval);
    $.post('https://sugoku.herokuapp.com/solve', {board: JSON.stringify(startingBoard)}).done(function (response) {
        board = response.solution;
        setBoard();
        document.getElementById("status").innerHTML = "Rozwiązane";
    })
}

function blockNumber(id) {
    document.getElementById(id).className = "numberButtonDisabled";
    document.getElementById(id).style.pointerEvents = "none";
}

function unblockNumber(id) {
    document.getElementById(id).className = "numberButton";
    document.getElementById(id).style.pointerEvents = "auto";
} 

function difficulty(diff) {
    document.getElementById(selectedDifficulty).style.background = "#99ff66";
    document.getElementById(diff).style.background = "#A9A9A9"
    selectedDifficulty = diff;
}