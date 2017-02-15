/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function Rule(chessBoard) {
  this.chessBoard = chessBoard;
  this.result = null;
}

Rule.prototype = {
  syncStatus: function(row, col, value) {
    this.result = null;

    if (arguments.length === 0) {
      return;
    }

    // Find the result line
    var data = this.chessBoard.chessData;

    // Check horizontal line
    var c1 = col;
    while (c1 - 1 >= 0 && data[row][c1 - 1] === value) {
      // Move left
      c1--;
    }

    var c2 = col;
    while (c2 + 1 < Config.Board.size && data[row][c2 + 1] === value) {
      // Move right
      c2++;
    }

    if (c2 - c1 >= 4) {
      this.result = [row, c1, row, c2];
      return;
    }

    // Check vertically line
    var r1 = row;
    while (r1 - 1 >= 0 && data[r1 - 1][col] === value) {
      // Move top
      r1--;
    }

    var r2 = row;
    while (r2 + 1 < Config.Board.size && data[r2 + 1][col] === value) {
      r2++;
    }

    if (r2 - r1 >= 4) {
      this.result = [r1, col, r2, col];
      return;
    }

    // Check cross line
    r1 = row;
    c1 = col;
    while (r1 - 1 >= 0 && c1 - 1 >= 0 && data[r1 - 1][c1 - 1] === value) {
      // Move left top
      r1--;
      c1--;
    }

    r2 = row;
    c2 = col;
    while (r2 + 1 < Config.Board.size && c2 + 1 < Config.Board.size && data[r2 + 1][c2 + 1] === value) {
      // Move right bottom
      r2++;
      c2++;
    }

    if (r2 - r1 >= 4) {
      this.result = [r1, c1, r2, c2];
      return;
    }

    // Check counter cross line
    r1 = row;
    c1 = col;
    while (r1 + 1 < Config.Board.size && c1 - 1 >= 0 && data[r1 + 1][c1 - 1] === value) {
      // Move left bottom
      r1++;
      c1--;
    }

    r2 = row;
    c2 = col;
    while (r2 - 1 >= 0 && c2 + 1 < Config.Board.size && data[r2 - 1][c2 + 1] === value) {
      // Move right top
      r2--;
      c2++;
    }

    if (c2 - c1 >= 4) {
      this.result = [r1, c1, r2, c2];
      return;
    }
  },

  reset: function() {
    this.result = null;
  },

  isGameOver: function() {
    return this.result !== null;
  }
}
