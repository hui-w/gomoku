/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function Rule(chessBoard) {
  this.chessBoard = chessBoard;
  this.results = [];
}

Rule.prototype = {
  // Get the count of sequential stones
  // By the direction of dRow and dCol
  // Self is not included
  getSideLength: function(row, col, dRow, dCol) {
    var r = row;
    var c = col;
    var data = this.chessBoard.chessData;

    var length = 0;
    while (r + dRow >= 0 &&
      c + dCol >= 0 &&
      r + dRow < Config.Board.size &&
      c + dCol < Config.Board.size &&
      data[r + dRow][c + dCol] === data[r][c]
    ) {
      length++;
      r += dRow;
      c += dCol;
    }

    return length;
  },

  // Return the line if the sequential length is >= 5
  // Otherwise return null
  getLine: function(row, col, dRow, dCol) {
    // Search along negative direction
    var left = this.getSideLength(row, col, -dRow, -dCol);

    // Search along positive direction
    var right = this.getSideLength(row, col, dRow, dCol);

    if (left + right >= 4) {
      return [
        row - dRow * left,
        col - dCol * left,
        row + dRow * right,
        col + dCol * right
      ];
    } else {
      return null;
    }
  },

  syncStatus: function(row, col) {
    this.results = [];

    // Left to right
    var result = this.getLine(row, col, 0, 1);
    if (result) {
      this.results.push(result);
    }

    // Top to bottom
    var result = this.getLine(row, col, 1, 0);
    if (result) {
      this.results.push(result);
    }

    // Left-top to right-bottom
    var result = this.getLine(row, col, 1, 1);
    if (result) {
      this.results.push(result);
    }

    // Right-top to left-bottom
    var result = this.getLine(row, col, 1, -1);
    if (result) {
      this.results.push(result);
    }
  },

  reset: function() {
    this.results = [];
  },

  isGameOver: function() {
    return this.results.length !== 0;
  }
}
