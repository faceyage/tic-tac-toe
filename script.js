const Player = (isX) => {
    let myTurn = isX;
    let mark = isX ? "X" : "O";
    console.log(isX, mark);
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
    let gameOver = false;

    //updates squares in html.
    const renderBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                squares[(i * 3) + j].innerHTML = board[i][j] === undefined ? "" : board[i][j];
            }
        }
    }

    //returns true if marking successful or already occupied.
    const markSquare = (i, mark) => {
        let j = (i % 3);
        i = Math.floor(i / 3)

        if (board[i][j] !== undefined || gameOver) {
            return false;
        }
        board[i][j] = mark;
        renderBoard();
        return true;
    }

    const endGame = (i) => {
        gameOver = true;
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
        return gameOver;
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
                return endGame(1);
            }
            else if(sum === -3)
            {
                return endGame(-1);
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
                return endGame(1);
            }
            else if(sum === -3)
            {
                return endGame(-1);
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
            return endGame(1);
        }
        else if(sum === -3)
        {
            return endGame(-1);
        }

        //check tie
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++) {
                //no tie
                if (board[i][j] === undefined) {
                    return false;
                }
            }
        }
        //if the code is still running game is tie
        return endGame(0);
    }

    const resetBoard = () => {
        const winCard = document.querySelector(".win-card")
        winCard.classList.add("hidden");

        const main = document.querySelector(".main");
        main.classList.remove("blur");

        gameOver = false;
        board = new Array(3);
        for (let i = 0; i < 3; i++) {
            board[i] = new Array(3);
        }
        renderBoard();
    };
    
    return {markSquare, resetBoard, renderBoard, checkWin, board}
})();


const ai_play = (ai) => {
    didMark = false;
    let i;
    do {
        i = Math.floor(Math.random() * 9);
        didMark = gameBoard.markSquare(i, ai.mark);
    } while (!didMark);
    return i;
}

//to start or restart game
const startGame = (isX) => {
    const user = Player(isX);
    const ai = Player(!isX);

    gameBoard.resetBoard();
    if(!isX) {
        ai_play(ai);
        user.changeTurn();
    }
    const x = document.querySelector(".x");
    x.addEventListener("click", () => {startGame(true)});
    
    const o = document.querySelector(".o");
    o.addEventListener("click",() => {startGame(false)});

    const restartBtn = document.querySelector(".reset")
    restartBtn.addEventListener("click", () => {startGame(true)});

    const squares = document.querySelectorAll(".square");
    squares.forEach((sqr, i) => {
        sqr.addEventListener("click", () => {
            let didMark;
            if (user.isMyTurn()) {
                didMark = gameBoard.markSquare(i, user.mark);
                console.log(`did mark = ${didMark} User Mark = ${user.mark}`)
            }
            
            //check if marking success or failed
            if (didMark) {
                user.changeTurn();
                const gameOver = gameBoard.checkWin(user, ai);
                if (!gameOver) {
                    ai_play(ai);
                    user.changeTurn();
                    ai.changeTurn();
                    gameBoard.checkWin(user, ai);
                }
            }
        });
    });
    
};

startGame(false);