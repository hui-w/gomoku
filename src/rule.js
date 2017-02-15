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
  syncStatus: function(row, col) {
    this.result = null;

    if (arguments.length === 0) {
      return;
    }

    // Dummy
    if (this.chessBoard.chessData[0][0] != 0) {
      this.result = [0, 0, 4, 0];
    }
  },

  reset: function() {
    this.result = null;
  },

  isGameOver: function() {
    return this.result !== null;
  }
}
