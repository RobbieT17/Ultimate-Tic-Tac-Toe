const NUM_BOARDS = 9
const NUM_TILES = 9

let currentPlayer = 'X'
let gameWon = false

function win(grid, mark) {
    const marking = (c, i) => Array.from(grid.childNodes)[i].classList.contains(c)

    return (marking(mark, 0) && marking(mark, 1) && marking(mark, 2)) ||
           (marking(mark, 3) && marking(mark, 4) && marking(mark, 5)) ||
           (marking(mark, 6) && marking(mark, 7) && marking(mark, 8)) ||
           (marking(mark, 0) && marking(mark, 3) && marking(mark, 6)) ||
           (marking(mark, 1) && marking(mark, 4) && marking(mark, 7)) ||
           (marking(mark, 2) && marking(mark, 5) && marking(mark, 8)) ||
           (marking(mark, 0) && marking(mark, 4) && marking(mark, 8)) ||
           (marking(mark, 2) && marking(mark, 4) && marking(mark, 6))
}

// Player wins the game
function checkWinGameCondition() {
    const freeBoard = board => !(board.classList.contains('x-won') || board.classList.contains('o-won'))
    const gameBoard = document.getElementById('theBoard')

    if (win(gameBoard, 'x-won')) return 1
    else if (win(gameBoard, 'o-won')) return 2
    else if (Array.from(gameBoard.childNodes).filter(board => freeBoard(board)).length === 0) return 3
    return 0
}

// Player wins a board
function winBoard(board, tiles, mark) {
    board.classList.add(mark + '-won')

    const tileClass = mark + '-tile'
    tiles.forEach(tile => {
        if (!tile.classList.contains(tileClass)) {
            tile.textContent = mark.toUpperCase()
            tile.classList.add(tileClass)
            tile.classList.remove(mark === 'x' ? 'o-tile' : 'x-tile')
        }  
    })

    const label = document.getElementById('turn')

    switch (checkWinGameCondition()) {
        case 1: 
            label.textContent = 'PLAYER 1 WINS'
            gameWon = true
            break
        case 2: 
            label.textContent = 'PLAYER 2 WINS'
            gameWon = true
            break
        case 3: 
            label.textContent = 'TIE'
            gameWon = true
            break
    }
}

function checkWinBoardConditions(board) {
    const tiles = Array.from(board.childNodes)

    // Checks for Player 1 Win
    if (win(board, 'x-tile')) winBoard(board, tiles, 'x')
      
    // Checks for Player 2 Win
    else if(win(board, 'o-tile')) winBoard(board, tiles, 'o')
        
    // Checks for Tie
    else if (tiles.filter(tile => tile.classList.contains('free-tile')).length === 0) board.classList.add('tie')  
}

function isTerminatedBoard(board) {
    return board.classList.contains('x-won') || board.classList.contains('o-won') || board.classList.contains('tie')
}

// Activates the board, allowing it to be played on
function activateBoard(board) {
    board.classList.add('active-board')
    Array.from(board.childNodes)
    .filter(tile => !(tile.classList.contains('x-tile') || tile.classList.contains('o-tile')))
    .forEach(tile => tile.classList.add('free-tile'))
}

// Allows next tile to be placed anywhere
function openAll() {
    Array.from(document.getElementById('theBoard').childNodes) 
    .filter(board => !isTerminatedBoard(board))
    .forEach(board => activateBoard(board))
}

// Switches from Player 1 to Player 2 and vise-versa
function switchPlayer() {
    const isPlayer1 = currentPlayer === 'X';
    currentPlayer =  isPlayer1 ? 'O' : 'X'
    document.getElementById('turn').textContent = 'Player ' + (isPlayer1 ? '2' : '1') + '\'s Turn'
}

function update(board, tileId) {
    checkWinBoardConditions(board) // Check if board has been won/tied
  
    document.querySelectorAll('.board').forEach(board => board.classList.remove('active-board'))
    document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('free-tile'))

    if (gameWon) return // Program ends when someone wins the game

    // Gets the new board to play on next
    const newBoard =  document.getElementById('board' + tileId) 
    isTerminatedBoard(newBoard) ? openAll() : activateBoard(newBoard)   
    switchPlayer()
}

// You can play on active tiles
function validTile(tile) {
    return tile.classList.contains('free-tile')
}

// You can play on active boards
function validBoard(board) {
    return board.classList.contains('active-board')
}

// Marks tile with either an 'X' or an 'O' depending on the player
function markTile(board, tile, tileId) {
    if (validTile(tile) && validBoard(board)) {
        tile.textContent = currentPlayer
        tile.classList.add(currentPlayer === 'X' ? 'x-tile' : 'o-tile')
        tile.classList.remove('free-tile')
        update(board, tileId)
    } 
}

function initializeBoards() {
    // Creates Board
    for (let i = 0; i < NUM_BOARDS; i++){
        const board = document.createElement('div')
        board.classList.add('board')
        board.classList.add('active-board')
        board.id = 'board' + i;

        // Create Tiles
        for (let j = 0; j < NUM_TILES; j++) {
            const tile = document.createElement('div')
            tile.classList.add('tile')
            tile.classList.add('free-tile')

            tile.addEventListener('click', () => markTile(board, tile, j))
            board.appendChild(tile)
        }

        document.getElementById('theBoard').appendChild(board)
    }

    document.getElementById('turn').textContent = "Player 1's Turn"
}

document.addEventListener('DOMContentLoaded', () => initializeBoards());
