const Player = (isX) => {
    let myTurn = isX;
    let letter = isX ? "X" : "O";
    console.log(isX, letter);
    let isMyTurn = () => {
        return myTurn;
    }
    let changeTurn = () => {
        myTurn = myTurn ? false : true;
    }
    return {letter, changeTurn, isMyTurn};
}

const TicTacToe = (() => {
    let user;
    let ai;
    let gameOver = false;
    let winner = "";
    let difficulty = "easy";
    //create board array
    let board = new Array(3);
    for (let i = 0; i < 3; i++) {
        board[i] = new Array(3);
    }
    const squares = document.getElementsByClassName("square");

    //to start or restart game
    const startGame = (isX, diff = "") => {
        if (diff !== "") {
            difficulty = diff;
        }
        user = Player(isX);
        ai = Player(!isX);
        // console.log(`Game is started Users letter: ${user.letter} AI's letter: ${ai.letter}`)

        resetBoard();
        if(!isX) {
            ai_play();
            user.changeTurn();
        }
        
        const squares = document.querySelectorAll(".square");
        squares.forEach((sqr, i) => {
            sqr.addEventListener("click", () => {
                let didMark;
                if (user.isMyTurn()) {
                    didMark = TicTacToe.makeMove(i, user.letter);
                    // console.log(`did mark = ${didMark} User Mark = ${user.letter}`)
                }
                
                //check if marking success or failed
                if (didMark) {
                    user.changeTurn();
                    const gameOver = TicTacToe.checkWin();
                    if (!gameOver) {
                        ai_play();
                        user.changeTurn();
                        TicTacToe.checkWin();
                    }
                }
            });
        });
    };


    const ai_play = () => {
        if (difficulty === "unbeatable") {
            let i;
            if (TicTacToe.numEmptySquares === 9) {
                i = Math.floor(Math.random() * 9);
                TicTacToe.makeMove(i, ai.letter);
            }
            i = TicTacToe.minimax(true).position;
            TicTacToe.makeMove(i, ai.letter);
        }
        else if (difficulty === "easy") {
            let i = Math.floor(Math.random() * 9);
            let didMark = TicTacToe.makeMove(i, ai.letter);
            if (!didMark) {
                ai_play();
            }
        } 
    }
    
    //updates squares in html.
    const renderBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                squares[(i * 3) + j].innerHTML = board[i][j] === undefined ? "" : board[i][j];
            }
        }
    }

    //returns true if marking successful or already occupied.
    const makeMove = (i, letter) => {
        let j = (i % 3);
        i = Math.floor(i / 3)

        if (board[i][j] !== undefined || gameOver) {
            return false;
        }
        board[i][j] = letter;
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

    const minimax = (maximize) => {
        if (winner !== "") {
            // console.log("game over")
            if (winner == ai.letter) {
                return {"position": null, "score": 1 * (numEmptySquares() + 1)}
            }
            else if(winner = user.letter) {
                return {"position": null, "score": -1 * (numEmptySquares() + 1)}
            }
            else if(winner = "tie") {
                return {"position": null, "score": 0}
            }
        }
        let best;
        if (maximize) {
            best = {"position": null, "score": -Infinity}//maximizing player
        }
        else {
            best = {"position": null, "score": Infinity}//minimizing player
        }
        availableMoves().forEach((possible_move) => {
            //1d index to 2d index
            let j = (possible_move % 3);
            let i = Math.floor(possible_move / 3);
            //make move
            const letter = maximize ? ai.letter : user.letter;
            board[i][j] = letter;
            checkWin(false);
            
            const sim_score = minimax(!maximize);
            // console.log(`Possible Move: ${possible_move} \nSim Score:`, sim_score);
            
            //undo move
            board[i][j] = undefined;
            winner = "";
            sim_score.position = possible_move;

            if (maximize) {
                if (sim_score.score > best.score) {
                    best = sim_score;
                }
            }
            else { 
                if (sim_score.score < best.score) {
                    best = sim_score;
                }
            }
    });
    return best;
    };

    const availableMoves = () => {
        const moves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === undefined) {
                    let index = (i * 3) + j;
                    moves.push(index);
                }
            }
        }
        return moves;
    };

    const numEmptySquares = () => {
        return availableMoves().length;
    };

    const hasEmptySquares = () => {
        if (numEmptySquares() > 0) {
            return true;
        }
        return false;
    };

    //check if game is over
    const checkWin = (end=true) => {
        let sum = 0;
        //check rows
        for (let i = 0; i < 3; i++) {
            sum = 0;
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === user.letter) {
                    sum += 1;
                }
                if (board[i][j] === ai.letter) {
                    sum += -1;
                }
            }
            if (sum === 3) {
                winner = user.letter;
                if (end) {
                    return endGame(1);
                }
            }
            else if(sum === -3)
            {
                winner = ai.letter;
                if(end) {
                    return endGame(-1);
                }
            }
        }
        
        //check columns
        for (let i = 0; i < 3; i++) {
            sum = 0;
            for (let j = 0; j < 3; j++) {
                if (board[j][i] === user.letter) {
                    sum += 1;
                }
                if (board[j][i] === ai.letter) {
                    sum += -1;
                }
            }
            if (sum === 3) {
                winner = user.letter;
                if (end) {
                    return endGame(1);
                }
            }
            else if(sum === -3)
            {
                winner = ai.letter;
                if (end) {
                    return endGame(-1);
                }
            }
        }

        //check diagonal 
        sum = 0;
        for (let i = 0; i < 3; i++) {
            if (board[i][i] === user.letter) {
                sum += 1;   
            }
            if (board[i][i] === ai.letter)
            {
                sum -= 1;
            }
        }
        if (sum === 3) {
            winner = user.letter;
            if (end) {
                return endGame(1);
            }
        }
        else if(sum === -3)
        {
            winner = ai.letter;
            if (end) {
                return endGame(-1);

            }
        }
        sum = 0;
        for (let i = 0; i < 3; i++) {
            if (board[i][2 - i] === user.letter) {
                sum += 1;
            }
            if (board[i][2 - i] === ai.letter) {
                sum -= 1;
            }
        }
        if (sum === 3) {
            winner = user.letter;
            if (end) {
                return endGame(1);
            }
        }
        else if(sum === -3)
        {
            winner = ai.letter;
            if (end) {
                return endGame(-1);
            }
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
        winner = "tie";
        if (end) {
            return endGame(0);
        }
    }

    const resetBoard = () => {
        const winCard = document.querySelector(".win-card")
        winCard.classList.add("hidden");

        const main = document.querySelector(".main");
        main.classList.remove("blur");

        gameOver = false;
        winner = "";
        board = new Array(3);
        for (let i = 0; i < 3; i++) {
            board[i] = new Array(3);
        }
        renderBoard();
    };
    
    const printBoard = () => {
        console.log(board);
    }


    return {makeMove, resetBoard, renderBoard, checkWin, availableMoves, minimax, printBoard, startGame}
})();





function addListeners() {
    const difficulty = document.querySelector("#difficulty");
    difficulty.addEventListener("change", () => {
        console.log(difficulty.value);
        TicTacToe.startGame(true, difficulty.value);
    });

    const x = document.querySelector(".x");
    x.addEventListener("click", () => {TicTacToe.startGame(true)});
    
    const o = document.querySelector(".o");
    o.addEventListener("click",() => {TicTacToe.startGame(false)});

    const restartBtn = document.querySelector(".reset")
    restartBtn.addEventListener("click", () => {TicTacToe.startGame(true)});
}

addListeners();
TicTacToe.startGame(true);