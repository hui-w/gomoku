/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 *
 * The chess board of the game
 * It's derived from Component
 */
var chessboard_prototype = {
  unitSize: null,
  halfSize: null,
  stones: null,
  chessData: null,
  robotConfig: null,
  robot: null,
  rule: null,
  capturedPos: null,
  dragOffset: null,
  selectedCell: null,

  init: function(left, top) {
    this._super(left, top);

    // Caculated values
    this.unitSize = 0;
    this.halfSize = 0;

    // Data {row, col}
    this.stones = [];

    // Array for chessboard data
    this.chessData = null;

    this.robotConfig = {
      black: false,
      white: false
    };
    this.robot = new Robot(this);
    this.rule = new Rule(this);

    this.capturedPos = null; // {left, top}
    this.dragOffset = null; // {left, top}
    this.selectedCell = null; // {row, col}

    // Init the chess data array
    //this.syncToChessData();

    this.onRenderExtra.push(this.renderChessboard);
    this.onRenderExtra.push(this.renderStones);
    this.onRenderExtra.push(this.renderHighlight);
    this.onRenderExtra.push(this.renderResults);
  },

  reset: function(blackBotEnabled, whiteBotEnabled) {
    this.stones = [];
    this.selectedCell = null;
    this.syncToChessData();
    this.robotConfig = {
      black: blackBotEnabled,
      white: whiteBotEnabled
    };
    this.rule.reset();
    this.robotPlay();
    this.requestPaint();
  },

  renderChessboard: function(context) {
    // The rectangle of the visiable chess board
    var rect = {
      left: this.halfSize,
      top: this.halfSize,
      right: this.width - this.halfSize,
      bottom: this.height - this.halfSize
    };

    context.beginPath();
    for (var i = 0; i < Config.Board.size; i++) {
      // Horizontal line
      context.antiFuzzyLine(
        rect.left,
        rect.top + this.unitSize * i,
        rect.right,
        rect.top + this.unitSize * i
      );

      // Vertical line
      context.antiFuzzyLine(
        rect.left + this.unitSize * i,
        rect.top,
        rect.left + this.unitSize * i,
        rect.bottom
      );
    }

    context.lineWidth = 1;
    context.strokeStyle = Config.Board.stroke;
    context.stroke();
  },

  renderStones: function(context) {
    for (var i = 0; i < this.stones.length; i++) {
      var row = this.stones[i].row;
      var col = this.stones[i].col;

      var left = col * this.unitSize;
      var top = row * this.unitSize;

      context.drawStone(i % 2 == 0, left, top, this.halfSize);
    }
  },

  renderHighlight: function(context) {
    if (this.selectedCell) {
      var left = this.selectedCell.col * this.unitSize;
      var top = this.selectedCell.row * this.unitSize;
      var right = left + this.unitSize;
      var bottom = top + this.unitSize;
      var length = Math.floor(this.unitSize / 4);

      context.save();
      context.beginPath();

      // Left top
      context.moveTo(left, top + length);
      context.lineTo(left, top);
      context.lineTo(left + length, top);

      // Right top
      context.moveTo(right - length, top);
      context.lineTo(right, top);
      context.lineTo(right, top + length);

      // Right bottom
      context.moveTo(right, bottom - length);
      context.lineTo(right, bottom);
      context.lineTo(right - length, bottom);

      // Left bottom
      context.moveTo(left + length, bottom);
      context.lineTo(left, bottom);
      context.lineTo(left, bottom - length);

      context.lineWidth = 2;
      context.strokeStyle = Config.Selected.stroke;
      context.stroke();
      context.restore();
    }
  },

  renderResults: function(context) {
    if (this.rule.isGameOver()) {
      context.beginPath();
      for (var i = 0; i < this.rule.results.length; i++) {
        var result = this.rule.results[i];

        var top1 = result[0] * this.unitSize + this.halfSize;
        var left1 = result[1] * this.unitSize + this.halfSize;
        var top2 = result[2] * this.unitSize + this.halfSize;
        var left2 = result[3] * this.unitSize + this.halfSize;

        context.moveTo(left1, top1);
        context.lineTo(left2, top2);
      }

      context.lineWidth = this.halfSize / 2;
      context.strokeStyle = Config.Board.resultStyle;
      context.stroke();
    }
  },

  onCapture: function(left, top) {
    this.capturedPos = { left: left, top: top };

    // Select the current cell
    this.setSelectedCell(left, top);
  },

  onDrag: function(left, top) {
    if (!this.capturedPos) {
      // Mouse not down
      return;
    }

    if (!this.dragOffset) {
      // Before can be dragged
      var distance = Math.pow(left - this.capturedPos.left, 2) + Math.pow(top - this.capturedPos.top, 2);
      if (distance >= Math.pow(Config.Selected.dragSensitive * this.unitSize, 2)) {
        this.dragOffset = {
          left: left - this.capturedPos.left,
          top: top - this.capturedPos.top
        }
      }
    } else {
      // Drag the selected cell
      this.setSelectedCell(left - this.dragOffset.left, top - this.dragOffset.top);
    }
  },

  onRelease: function(left, top) {
    this.capturedPos = null;
    this.dragOffset = null;

    // Put a stone
    if (this.selectedCell && !this.hasStone(this.selectedCell.row, this.selectedCell.col)) {
      this.putStone(this.selectedCell.row, this.selectedCell.col);
    }
  },

  setBoardSize: function(size) {
    this.unitSize = Math.floor(size / Config.Board.size);
    this.halfSize = Math.floor(size / Config.Board.size / 2);
    this.width = this.unitSize * Config.Board.size - 1;
    this.height = this.unitSize * Config.Board.size - 1;
  },

  // Sync stones array to the rectangular array
  // newVal: 0 - empty; 1 - black; 2 - white
  syncToChessData: function(stone, newVal) {
    if (arguments.length === 2) {
      // Update the rectangular array
      var row = stone.row;
      var col = stone.col;
      this.chessData[row][col] = newVal;
    }

    // Sync from the stone list
    this.chessData = [];

    // Init with empty chess board
    for (var i = 0; i < Config.Board.size; i++) {
      this.chessData[i] = [];
      for (var j = 0; j < Config.Board.size; j++) {
        this.chessData[i][j] = 0;
      }
    }

    // Merge from the stone history
    for (var i = 0; i < this.stones.length; i++) {
      var row = this.stones[i].row;
      var col = this.stones[i].col;
      var isBlack = i % 2 === 0;
      this.chessData[row][col] = isBlack ? 1 : 2;
    }
  },

  back: function() {
    if (this.stones.length <= 0) {
      // Nothing to rollback
      return;
    }

    if (this.robotConfig.black && this.robotConfig.white) {
      // Disable back when robots playing
      return;
    } else if (!this.robotConfig.black && !this.robotConfig.white) {
      // Rollback one step when human playing
      var stone = this.stones.pop();
      this.syncToChessData(stone, 0);
    } else if (this.stones.length >= 2) {
      // Human playing with robot
      var stone = this.stones.pop();
      this.syncToChessData(stone, 0);
      stone = this.stones.pop();
      this.syncToChessData(stone, 0);
    }

    // Highlight the last step
    if (this.stones.length > 0) {
      var lastStone = this.stones[this.stones.length - 1];
      this.selectedCell = {
        row: lastStone.row,
        col: lastStone.col
      };
    }

    // Update the judge
    this.rule.reset();
    this.requestPaint();
  },

  isBlackPlaying: function() {
    return this.stones.length % 2 === 0;
  },

  putStone: function(row, col) {
    if (this.rule.isGameOver()) {
      // The Game is already over
      return;
    }

    var stone = {
      row: row,
      col: col
    };
    this.selectedCell = stone;
    this.stones.push(stone);

    var stoneValue = this.isBlackPlaying() ? 2 : 1; // The value before this stone was put
    this.syncToChessData(stone, stoneValue);

    // Check if game is over
    this.rule.syncStatus(row, col);

    this.requestPaint();

    if (!this.rule.isGameOver()) {
      // Let robot play
      setTimeout(function() {
        this.robotPlay();
      }.bind(this), 100);
    }
  },

  robotPlay: function() {
    if ((!this.robotConfig.black && this.isBlackPlaying()) ||
      (!this.robotConfig.white && !this.isBlackPlaying())
    ) {
      return;
    }

    if (this.stones.length <= 0) {
      // First step
      var pos = Math.floor(Config.Board.size / 2);
      this.putStone(pos, pos);
    } else {
      // Robot will make the decision
      var position = this.robot.getPosition();

      if (position.length === 2 && position[0] !== undefined && position[1] !== undefined) {
        var row = position[0];
        var col = position[1];
        this.putStone(row, col);
      }
    }
  },

  setRobot: function(key, value) {
    this.robotConfig[key] = value;
    if (this.robotConfig.black || this.robotConfig.white) {
      this.robotPlay();
    }
  },

  setSelectedCell: function(left, top) {
    var oldRow = this.selectedCell ? this.selectedCell.row : null;
    var oldCol = this.selectedCell ? this.selectedCell.col : null;

    if (left < this.left || left > this.left + this.width || top < this.top || top > this.top + this.height) {
      this.selectedCell = null;
    } else {
      // Calculate the selected cell
      this.selectedCell = this.posToCell(left, top);
    }

    var newRow = this.selectedCell ? this.selectedCell.row : null;
    var newCol = this.selectedCell ? this.selectedCell.col : null;

    if (newRow != oldRow || newCol != oldCol) {
      this.requestPaint();
    }
  },

  posToCell: function(left, top) {
    return {
      col: Math.floor((left - this.left) / this.unitSize),
      row: Math.floor((top - this.top) / this.unitSize)
    };
  },

  hasStone: function(row, col) {
    for (var i = 0; i < this.stones.length; i++) {
      if (row === this.stones[i].row && col === this.stones[i].col) {
        return true;
      }
    }

    return false;
  }
}

var Chessboard = Component.extend(chessboard_prototype);
