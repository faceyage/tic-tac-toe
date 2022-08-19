const Player = (isX) => {
    let myTurn = isX;
    let mark = isX ? "X" : "O";
    let isMyTurn = () => {
        return myTurn;
    }
    let changeTurn = () => {
        myTurn = myTurn ? false : true;
    }
    return {mark, changeTurn, isMyTurn};
}

const gameBoard = (() => {
    let board = new Array(3);
    for (let i = 0; i < 3; i++) {
        board[i] = new Array(3);
    }
    const squares = document.getElementsByClassName("square");

    //updates squares in html.
    const renderBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                squares[(i * 3) + j].innerHTML = board[i][j] === undefined ? "" : board[i][j];
            }
        }
    }

    //returns true if marking successful or already occupied.
    const markSquare = (sqr, i, mark) => {
        let j = (i % 3);
        i = Math.floor(i / 3);
        if (board[i][j] !== undefined) {
            return false;
        }
        board[i][j] = mark;
        renderBoard();
        return true;
    }

    const gameOver = (i) => {
        const winCard = document.querySelector(".win-card");
        winCard.classList.remove("hidden");

        const main = document.querySelector(".main");
        main.classList.add("blur");

        //user win
        if (i === 1) {
            winCard.innerHTML = "User has won!";
        }//ai win
        else if (i === -1) {
            winCard.innerHTML = "AI has won!";
        }//tie
        else if (i === 0) {
            winCard.innerHTML = "Game is tie!";
        }
    }

    //check if game is over
    const checkWin = (user, ai) => {
        let sum = 0;
        //check rows
        for (let i = 0; i < 3; i++) {
            sum = 0;
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === user.mark) {
                    sum += 1;
                }
                if (board[i][j] === ai.mark) {
                    sum += -1;
                }
            }
            if (sum === 3) {
                gameOver(1);
            }
            else if(sum === -3)
            {
                gameOver(-1);
            }
        }
        
        //check columns
        for (let i = 0; i < 3; i++) {
            sum = 0;
            for (let j = 0; j < 3; j++) {
                if (board[j][i] === user.mark) {
                    sum += 1;
                }
                if (board[j][i] === ai.mark) {
                    sum += -1;
                }
            }
            if (sum === 3) {
                gameOver(1);
            }
            else if(sum === -3)
            {
                gameOver(-1);
            }
        }

        //check cross 
        sum = 0;
        for (let i = 0; i < 3; i++) {
            if (board[i][i] === user.mark || board[i][2 - i] === user.mark) {
                sum += 1;   
            }
            if (board[i][i] === ai.mark || board[i][2 - i] === ai.mark)
            {
                sum -= 1;
            }
        }
        if (sum === 3) {
            gameOver(1);
        }
        else if(sum === -3)
        {
            gameOver(-1);
        }

        //check tie
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++) {
                //no tie
                if (board[i][j] === undefined) {
                    return;
                }
            }
        }
        //if the code is still running game is tie
        gameOver(0);
    }

    const resetBoard = () => {
        const winCard = document.querySelector(".win-card")
        winCard.classList.add("hidden");

        const main = document.querySelector(".main");
        main.classList.remove("blur");

        board = new Array(3);
        for (let i = 0; i < 3; i++) {
            board[i] = new Array(3);
        }
        renderBoard();
    };
    return {markSquare, resetBoard, board, renderBoard, checkWin}
})();

const startGame = (isX) => {
    gameBoard.resetBoard();

    const user = Player(isX);
    const ai = Player(!isX);

    const x = document.querySelector(".x");
    x.addEventListener("click", startGame, true);
    
    const o = document.querySelector(".o");
    o.addEventListener("click", startGame, false);

    const restartBtn = document.querySelector(".reset")
    restartBtn.addEventListener("click", gameBoard.resetBoard);

    const squares = document.querySelectorAll(".square");
    squares.forEach((sqr, i) => {
        sqr.addEventListener("click", () => {
            let didMark;
            if (user.isMyTurn()) {
            didMark = gameBoard.markSquare(sqr, i, user.mark);
            }
            else {
            didMark = gameBoard.markSquare(sqr, i, ai.mark);
            }
            //check if marking success or failed
            if (didMark) {
                user.changeTurn();
                ai.changeTurn();
                gameBoard.checkWin(user, ai);
            }
        });
    });
    
};

startGame(true);