(function() {
    let boardSquares = document.querySelector(".gameboard");
    let restartBtn = document.querySelector(".restart > button");

    window.addEventListener("keydown", e => { //prevents the user from closing the dialog modal
        if (e.key == "Escape") {
            e.preventDefault();
        }
    })

    restartBtn.addEventListener("click", restartGame);

    boardSquares.addEventListener("click", e => {
        let index = e.target.attributes[0].value;

        if (checkEventTarget(e) && gameboard.isSquareEmpty(index)) {
            let marker = gameController.getCurrentMarker();
            gameboard.placeMarker(index, marker);
            drawMarkerInSquare(marker, e.target);
            gameController.changeTurn();
            let gameState = gameboard.checkWinner();

            if (gameState != -1) {
                let dialog = document.getElementById("modal");
                let finalResult = document.querySelector(".result");

                if (gameState == "x") {
                    finalResult.textContent = "The winner is X";
                    gameController.increaseWinnerScore("x");

                } else if (gameState == "o") {
                    finalResult.textContent = "The winner is O";
                    gameController.increaseWinnerScore("o");

                } else {
                    finalResult.textContent = "It's a tie";
                }

                dialog.showModal();
                setTimeout(() => {
                    dialog.close();
                    cleanGameBoard();
                    gameboard.cleanBoard();
                    gameController.setMarkerToInitState();
                }, 2500);

            }
        }
        
    });

    function drawMarkerInSquare(marker, square) {
        square.textContent = marker;
        if (marker == "x") {
            square.className = "x";
        } else {
            square.className = "o";
        }
    }

    function checkEventTarget(e) { // checks if event triggers inside an actual square
        return e.target.attributes[0].name == "data-key";
    }

    function cleanGameBoard() { //removes markers from the squares
        for (let i = 0; i < boardSquares.children.length; i++) {
            boardSquares.children[i].textContent = "";
            boardSquares.children[i].className = "";
        }
    }

    function restartGame() {
        cleanGameBoard();
        gameboard.cleanBoard();
        gameController.setMarkerToInitState();
        gameController.resetPlayersScore();
    }

    
}());



let gameboard = (function() {
    let board = new Array(9);
    board.fill(0);

    function placeMarker(index, marker) {
        board[index] = marker;
    }

    function isSquareEmpty(index) { // checks if there's already a marker in the square
        return board[index] == 0;
    }

    function checkWinner() {
        let winnerInRow = checkRows();
        if (winnerInRow != -1) {
            return winnerInRow;
        }

        let winnerInColumn = checkColumns();
        if (winnerInColumn != -1) {
            return winnerInColumn;
        }

        let winnerInDiagonal = checkDiagonals();
        if (winnerInDiagonal != -1) {
            return winnerInDiagonal;
        }

        return isTie();
    }

    function isTie() { //check for a tie
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                return -1;
            }
        }

        return "tie";
    }

    function checkDiagonals() { //check for 3 in a row in board diagonals
        let leftTopCorner = board[0];
        let rightTopCorner = board[2];
        let middle = board[4];


        if (leftTopCorner && leftTopCorner == middle && middle == board[8]) {
            return leftTopCorner;
        }

        if (rightTopCorner && rightTopCorner == middle && middle == board[6]) {
            return rightTopCorner;
        }

        return -1;
    }

    function checkColumns() { //check for 3 in a row in board columns
        for (let i = 0; i < 3; i++) {
            let firstSquare = board[i];
            let sameMarkerInColumn = true;

            if (!firstSquare) {
                continue;
            }

            for (let j = i + 3; j < 9; j += 3) {
                if (board[j] != firstSquare) {
                    sameMarkerInColumn = false;
                    break;
                }
            }

            if (sameMarkerInColumn) {
                return firstSquare;
            }
        }

        return -1;
    }

    function checkRows() { //check for 3 in a row in board rows
        for (let i = 0; i < 9; i += 3) {
            let firstSquare = board[i];
            let sameMarkerInRow = true;

            if (!firstSquare) {
                continue;
            }

            for (let j = i + 1; j < i + 3; j++) {
                if (board[j] != firstSquare) {
                    sameMarkerInRow = false;
                    break;
                }
            }

            if (sameMarkerInRow) {
                return firstSquare;
            }
        }

        return -1;
    }

    function cleanBoard() { //sets the board to its initial state
        board.fill(0);
    }

    return {placeMarker, isSquareEmpty, checkWinner, cleanBoard};
    
}());


function player(marker) {
    let score = 0;
    let playerMarker = document.querySelector(`.${marker} + .score`);

    let getScore = function() {
        return score;
    }

    let setScoreToZero = function() {
        score = 0;
        playerMarker.textContent = "-";
    }

    let increaseScore = function() {
        score++;
        playerMarker.textContent = score;
    }

    return {getScore, setScoreToZero, increaseScore};
    
}


let gameController = (function() {
    let currentMarker = "x";
    let playerX = player("x");
    let playerO = player("o");
    let currentTurn = document.querySelector(".playerTurn");

    let changeMarker = function() {
        if (currentMarker == "x") {
            currentMarker = "o";
        } else {
            currentMarker = "x";
        }
    }

    let getCurrentMarker = function() {
        return currentMarker;
    }

    let changeTurn = function() {
        changeMarker();
        currentTurn.textContent = currentMarker.toUpperCase();

    }

    let setMarkerToInitState = function() {
        currentMarker = "x";
        currentTurn.textContent = "X";
    }

    let increaseWinnerScore = function(finalResult) { 
        if (finalResult == "x") {
            playerX.increaseScore();
        } else {
            playerO.increaseScore();
        }
    }

    let resetPlayersScore = function() {
        playerO.setScoreToZero();
        playerX.setScoreToZero();
    }

    return {changeTurn, getCurrentMarker, setMarkerToInitState, increaseWinnerScore, resetPlayersScore};

}());