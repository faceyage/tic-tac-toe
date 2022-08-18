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

    //upadetes squares in html.
    const renderBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // board[i][j] = (i * 3) + j;
                squares[(i * 3) + j].innerHTML = board[i][j] === undefined ? "" : board[i][j];
            }
        }
        console.log(board);
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

    //check if game is over
    const checkWin = () => {

    }

    const resetBoard = () => {
        board = new Array(3);
        for (let i = 0; i < 3; i++) {
            board[i] = new Array(3);
        }
        renderBoard();
    };
    return {markSquare, resetBoard, board, renderBoard}
})();

const startGame = () => {
    const user = Player(true);
    const ai = Player(false);

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
            }
        });
    });
    
};

startGame();