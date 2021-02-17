import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  // Support Theme mode for board.
  @Input() isDarkTheme: boolean;
  // emit game not ready on exit.
  @Output() gameNotReady = new EventEmitter<boolean>();


  // init the board once settings are ready.
  private _displayBoard: boolean;
  @Input() set displayBoard(value: boolean) {
    this._displayBoard = value;
    if (value) {
      this.initComponent();
    }
  }
  get displayBoard(): boolean {
    return this._displayBoard;
  }

  gameSettings: any;
  gameStatus: any;
  PLAYER_ONE = { name: 'You', symbol: 'x' };
  PLAYER_TWO = { name: 'Computer', symbol: 'o' };
  DRAW = { name: 'Draw' };
  // Is coputer thinking.
  isThinking: boolean = false;
  // To do undo last step later.
  lastSelectedIndex: number = -1;
  board: any[];
  currentPlayer = this.PLAYER_ONE;
  lastWinner: any;
  gameOver: boolean;
  // Lock the board on game finish.
  boardLocked: boolean;
  canResetGame: boolean;
  defaultBoardSize: number = 3;
  winningIndexes: Array<any>;


  constructor(private cookieService: CookieService) { }

  initComponent() {
    this.initGameSettings();
    this.initGameStatus();
    this.setWinnerCombination();
    if (this.gameSettings && !this.gameStatus.currentPlayer) {
      this.newGame();
    } else if (this.gameSettings) {
      this.loadGame();
    }
  }

  initGameSettings() {
    let settings = this.cookieService.get('game-settings');
    if (settings && JSON.parse(settings)) {
      settings = JSON.parse(settings);
      this.gameSettings = settings;
      this.defaultBoardSize = this.gameSettings.selectedBoardSize;
      this.PLAYER_ONE.name = this.gameSettings.firstName;
      this.PLAYER_TWO.name = this.gameSettings.secondName;
    } else {
      this.gameNotReady.emit(false);
    }
  }

  initGameStatus() {
    this.gameStatus = {};
    this.currentPlayer = this.PLAYER_ONE;
    let status = this.cookieService.get('game-status');
    if (status && JSON.parse(status)) {
      status = JSON.parse(status);
      this.gameStatus = status;
      this.lastWinner = this.gameStatus.currentPlayer;
    } else {
      this.gameStatus = {
        player1CheckedCells: [],
        player2CheckedCells: [],
        boardDetails: {
          player1Scores: [],
          player2Scores: []
        },
        gameEnded: false
      }
    }
  }

  undoLastMove() {
    if (this.gameOver || this.gameSettings.againstComputer) {
      this.lastSelectedIndex = -1;
      return;
    }
    if (this.lastSelectedIndex !== -1) {
      this.board[this.lastSelectedIndex].value = '';
      this.lastSelectedIndex = -1;
      this.currentPlayer = (this.currentPlayer.symbol == this.PLAYER_TWO.symbol ? this.PLAYER_ONE : this.PLAYER_TWO);
      this.gameStatus.currentPlayer = this.currentPlayer;
      if (this.currentPlayer.symbol === this.PLAYER_ONE.symbol) {
        this.gameStatus.player1CheckedCells.pop();
      } else {
        this.gameStatus.player2CheckedCells.pop();
      }

      this.saveGameStatus();
    }
    this.checkReset();
  }

  checkReset() {
    this.board.forEach((item) => {
      if (item.value) {
        this.canResetGame = true;
      }
    });
  }

  square_click(square, index) {
    if (square.value === '' && !this.gameOver) {
      square.value = this.currentPlayer.symbol;
      if (!this.gameSettings.againstComputer) {
        this.lastSelectedIndex = index;
      }
      if (this.currentPlayer.symbol === this.PLAYER_ONE.symbol) {
        this.gameStatus.player1CheckedCells.push(index);
      } else {
        this.gameStatus.player2CheckedCells.push(index);
      }
      this.completeMove(this.currentPlayer);
    }
  }

  computerMove() {
    this.boardLocked = true;
    this.isThinking = true;
    setTimeout(() => {
      let square = this.getRandomAvailableSquare();
      square.value = this.PLAYER_TWO.symbol;
      this.gameStatus.player2CheckedCells.push(square.index);
      this.saveGameStatus();
      this.completeMove(this.PLAYER_TWO);
      this.boardLocked = false;
      this.isThinking = false;
    }, 800);
  }

  completeMove(player) {
    this.checkReset();
    if (this.hasWinner(player.symbol)) {
      this.showGameOver(player);
    } else if (!this.availableSquaresExist()) {
      this.showGameOver(this.DRAW);
    } else {
      this.currentPlayer = (this.currentPlayer.symbol == this.PLAYER_TWO.symbol ? this.PLAYER_ONE : this.PLAYER_TWO);
      this.gameStatus.currentPlayer = this.currentPlayer;
      this.saveGameStatus();
      if (this.currentPlayer.symbol == this.PLAYER_TWO.symbol && this.gameSettings.againstComputer) {
        this.computerMove();
      }
    }
  }

  availableSquaresExist(): boolean {
    return this.board.filter(s => s.value == '').length > 0;
  }

  getRandomAvailableSquare(): any {
    let availableSquares = this.board.filter(s => s.value === '');
    let squareIndex = this.getRndInteger(0, availableSquares.length - 1);

    return availableSquares[squareIndex];
  }

  showGameOver(winner) {
    this.gameOver = true;
    this.lastWinner = winner;

    if (winner !== this.DRAW) {
      this.currentPlayer = winner;
      if (winner === this.PLAYER_ONE) {
        this.gameStatus.boardDetails.player1Scores.push(1);
        this.gameStatus.boardDetails.player2Scores.push(0);
      } else {
        this.gameStatus.boardDetails.player1Scores.push(0);
        this.gameStatus.boardDetails.player2Scores.push(1);
      }
    } else {
      this.gameStatus.boardDetails.player1Scores.push(0);
      this.gameStatus.boardDetails.player2Scores.push(0);
    }
    this.gameStatus.currentPlayer = winner;
    this.gameStatus.gameEnded = true;
    this.saveGameStatus();
  }

  saveGameStatus() {
    this.cookieService.set('game-status', JSON.stringify(this.gameStatus), undefined, '', '', false, "Lax");
  }

  newGame(gameEnded = false) {
    if (gameEnded) {
      this.gameStatus.gameEnded = false;
      this.gameStatus.player1CheckedCells = [];
      this.gameStatus.player2CheckedCells = [];
      this.currentPlayer = this.PLAYER_ONE;
      this.saveGameStatus();
    }

    this.initBoardSquares();
    this.canResetGame = false;;
    this.gameOver = false;
    this.boardLocked = false;
    this.lastSelectedIndex = -1;

    if (this.currentPlayer.symbol == this.PLAYER_TWO.symbol && this.gameSettings.againstComputer) {
      this.boardLocked = true;
      this.computerMove();
    }
  }

  initBoardSquares() {
    this.defaultBoardSize = ((this.gameSettings || {}).selectedBoardSize) || this.defaultBoardSize;
    this.board = [];
    let index = 0
    for (let row = 0; row < this.defaultBoardSize; row++) {
      for (let column = 0; column < this.defaultBoardSize; column++) {
        this.board.push({ value: '', index });
        index++;
      }
    }
  }

  resetGame() {
    this.cookieService.set('game-status', '', -1, '', '', false, "Lax");
    this.initComponent();
  }

  loadGame() {

    this.initBoardSquares();
    this.currentPlayer = this.gameStatus.currentPlayer;
    this.gameOver = this.gameStatus.gameEnded;
    this.board.forEach((item, index) => {
      if (this.gameStatus.player1CheckedCells.includes(index)) {
        item.value = this.PLAYER_ONE.symbol;
      } else if (this.gameStatus.player2CheckedCells.includes(index)) {
        item.value = this.PLAYER_TWO.symbol;
      }
      this.hasWinner(this.currentPlayer.symbol);
    });

    this.checkReset();
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  setWinnerCombination() {
    let valueInColumn = 0;
    let valueInDiagonal = 0;
    this.winningIndexes = [];
    const cellsToWin = this.gameSettings.selectedCellsToWin;

    for (let j = 0; j < this.defaultBoardSize; j++) {
      for (let outerIndex = j * this.defaultBoardSize; outerIndex <= (this.defaultBoardSize * (j + 1) - cellsToWin); outerIndex++) {

        // For pushing rows into winningIndexes array
        let rowIndex = [];
        // i = row index
        for (let i = outerIndex; i < (outerIndex + cellsToWin); i++) {
          rowIndex.push(i);
          if (i >= Math.pow(this.defaultBoardSize, 2)) {
            rowIndex = [];
          }
        }
        if (rowIndex.length) {
          this.winningIndexes.push(rowIndex);
        }
        // For pushing columns into winningIndexes array
        let columnIndex = [];
        let tempValueInColumn = valueInColumn;
        // i = column index
        for (let i = outerIndex; i < (outerIndex + cellsToWin); i++) {
          columnIndex.push(tempValueInColumn);
          if (tempValueInColumn >= Math.pow(this.defaultBoardSize, 2)) {
            columnIndex = [];
          }
          tempValueInColumn += this.defaultBoardSize;
        }
        if (columnIndex.length) {
          this.winningIndexes.push(columnIndex);
        }
        valueInColumn++;

        let diagonalIndexOne = [];
        // l = Diagonal index
        valueInDiagonal = outerIndex;
        for (let l = outerIndex; l < (outerIndex + cellsToWin); l++) {
          diagonalIndexOne.push(valueInDiagonal);
          if (valueInDiagonal >= Math.pow(this.defaultBoardSize, 2)) {
            diagonalIndexOne = [];
          }
          valueInDiagonal += this.defaultBoardSize + 1;
        }
        if (diagonalIndexOne.length) {
          this.winningIndexes.push(diagonalIndexOne);
        }
        let diagonalIndexTwo = [];
        valueInDiagonal = cellsToWin + outerIndex - 1;
        // l = reversed diagonal index
        for (let l = outerIndex; l < (outerIndex + cellsToWin); l++) {
          diagonalIndexTwo.push(valueInDiagonal);
          if (valueInDiagonal >= Math.pow(this.defaultBoardSize, 2)) {
            diagonalIndexTwo = [];
          }
          valueInDiagonal += this.defaultBoardSize - 1;
        }
        if (diagonalIndexTwo.length) {
          this.winningIndexes.push(diagonalIndexTwo);
        }
      }
    }
  }

  // Retruns if it has winner or not
  hasWinner(symbol) {
    let win = false;
    let playerSelections = new Array();
    playerSelections = symbol == this.PLAYER_ONE.symbol ? this.gameStatus.player1CheckedCells : this.gameStatus.player2CheckedCells;
    if (playerSelections.length >= this.gameSettings.selectedCellsToWin) {
      // setting winningIndexes from its length
      for (let sets = 0; sets < this.winningIndexes.length; sets++) {
        let setWinner = this.winningIndexes[sets];
        let setFound = true;
        for (let rowIndex = 0; rowIndex < setWinner.length; rowIndex++) {
          let found = false;
          for (let s = 0; s < playerSelections.length; s++) {
            if (setWinner[rowIndex] == playerSelections[s]) {
              found = true;
              break;
            }
          }
          if (found == false) {
            setFound = false;
            break;
          }
        }
        if (setFound == true) {
          win = true;
          this.winningIndexes[sets].forEach(position => {
            this.board[position].winner = true
          });
          break;
        }
      }
    }
    return win;
  }

  exitGame() {
    this.gameStatus = '';
    // Allow transition to be applied.
    setTimeout(() => {
      this.gameSettings = '';
    }, 500);
    this.saveGameStatus();
    this.cookieService.set('game-settings', '', -1, '', '', false, "Lax");
    this.gameNotReady.emit(false);
  }

}
