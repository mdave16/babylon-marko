'use strict';

var EventEmitter = require('events');

function Stack(top, size) {
    this.top = top;
    this.size = size;
    this.add = function( otherStack ) {
      this.size += otherStack.size;
    }
}

class Babylon extends EventEmitter {
  constructor() {
    super();
    this.newGame();
  }

  newGame() {
    var nums =  "?".repeat(3).split("");
    var colours = new Array("red", "blue", "green", "black");
    var board = nums.map(i => colours.map( c => new Stack(c, 1))).reduce((acc, val) => acc.concat(val), []);
    this.state = {
      currentPlayer: "Player 1",
      winningPlayer: null,
      gameOver: false,
      board: board
    };
    // this.setState('board', board)

    this.emit('change');
  }

  makeMove(player, baseStack, destStack) {
    var currentPlayer = this.state.currentPlayer;

    if(!this.legalMove(baseStack, destStack)) {
      return false;
    }

    destStack.add(baseStack);
    this.board.splice(this.board.indexOf(baseStack), 1);

    var isWinner = this.checkWinner();
    if (isWinner) {
      this.state.winningPlayer = currentPlayer;
      this.state.gameOver = true;
    }

    this.state.currentPlayer = this.state.currentPlayer === "Player 1" ? "Player 2" : "Player 1";

    this.emit('change');

    return true;
  }

  legalMove(stack1, stack2) {
    if (stack1 === stack2) return false;
    if (stack1.top == stack2.top) return true;
    if (stack1.size == stack2.size) return true;
    return false;
  }

  moreMoves() {
    var board = this.state.board;
    for (var stack1 in board) {
      for (var stack2 in board) {
        if(this.legalMove(stack1, stack2)) {
          return true;
        }
      }
    }
    return false;
  }

  checkWinner() {
    return !this.moreMoves();
  }

  get board() {
    return this.state.board;
  }

  get isGameOver() {
    return this.state.gameOver === true;
  }

  get winningPlayer() {
    return this.state.winningPlayer;
  }

  get currentPlayer() {
    return this.state.currentPlayer;
  }
}

module.exports = Babylon;
