/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function Judge(stones) {
  this.chessData = null;
  this.result = null;
}

Judge.prototype = {
  sync: function(stones) {
    this.chessData = stonesToChessboard(stones);
    this.result = null;

    var current = stones[stones.length];


    // Dummy
    //if (this.chessData[0][0] != 0) {
    //  this.result = [0, 0, 4, 0];
    //}
  },

  isGameOver: function() {
    if (this.chessData == null) {
      // Game not started
      return false;
    }

    return this.result !== null;
  }
}
