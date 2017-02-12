/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function Chessboard() {
  this.left = 0;
  this.top = 0;
  this.size = 0;

  // Caculated values
  this.width = 0;
  this.height = 0;
  this.unitSize = 0;
  this.halfSize = 0;

  // Data {row, col}
  this.stones = [];

  this.robot = {
    black: false,
    white: false
  };

  this.capturedPos = null; // {left, top}
  this.dragOffset = null; // {left, top}
  this.selectedCell = null; // {row, col}

  // The event to redraw
  this.onRequestRedraw = null;
}

Chessboard.prototype = {
  init: function() {
    this.stones = [];
    this.robot = {
      black: false,
      white: false
    };
    this.requestRedraw();
  },

  back: function() {
    if (this.stones.length <= 0) {
      // Nothing to rollback
      return;
    }

    if (this.robot.black && this.robot.white) {
      // Disable back when robots playing
      return;
    } else if (!this.robot.black && !this.robot.white) {
      // Rollback one step when human playing
      this.stones.pop();
      this.requestRedraw();
    } else if (this.stones.length >= 2) {
      // Human playing with robot
      this.stones.pop();
      this.stones.pop();
      this.requestRedraw();
    }

    // Highlight the last step
    if (this.stones.length > 0) {
      var lastStone = this.stones[this.stones.length - 1];
      this.selectedCell = {
        row: lastStone.row,
        col: lastStone.col
      };
    }
  },

  isBlack: function() {
    return this.stones.length % 2 === 0;
  },

  putStone: function(row, col) {
    var that = this;

    var stone = {
      row: row,
      col: col
    };
    this.selectedCell = stone;
    this.stones.push(stone);
    this.requestRedraw();

    setTimeout(function() {
      that.robotPlay();
    }, 100);
  },

  robotPlay: function() {
    if ((!this.robot.black && this.isBlack()) ||
      (!this.robot.white && !this.isBlack())
    ) {
      return;
    }

    if (this.stones.length <= 0) {
      // First step
      var pos = Math.floor(Config.Board.size / 2);
      this.putStone(pos, pos);
    } else {
      // Robot will make the decision
      var robot = new Robot(this.stones);
      var position = robot.getPosition();

      if (position.length === 2 && position[0] !== undefined && position[1] !== undefined) {
        var row = position[0];
        var col = position[1];
        this.putStone(row, col);
      }
    }
  },

  setRobot: function(key, value) {
    this.robot[key] = value;
    if (this.robot.black || this.robot.white) {
      this.robotPlay();
    }
  },

  setPaintingArea: function(left, top, size) {
    this.left = left;
    this.top = top;
    this.unitSize = Math.floor(size / Config.Board.size);
    this.halfSize = Math.floor(size / Config.Board.size / 2);
    this.width = this.unitSize * Config.Board.size - 1;
    this.height = this.unitSize * Config.Board.size - 1;
  },

  render: function(context) {
    context.save();
    context.translate(this.left, this.top);
    this.renderChessboard(context);
    this.renderStones(context);
    this.renderHighlight(context);
    context.restore();
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
      this.requestRedraw();
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
  },

  requestRedraw: function() {
    if (typeof this.onRequestRedraw == 'function') {
      this.onRequestRedraw();
    }
  }
}
