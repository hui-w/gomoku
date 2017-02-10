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
  this.right = 0;
  this.bottom = 0;
  this.unitSize = 0;
  this.halfSize = 0;

  // Data {x, y, isBlack}
  this.isBlack = true;
  this.stones = [];

  this.capturedPos = null; // {left, top}
  this.dragOffset = null; // {left, top}
  this.selectedCell = null; // {x, y}

  // The event to redraw
  this.onUpdateUI = null;
}

Chessboard.prototype = {
  init: function() {
    this.isBlack = true;
    this.stones = [];
    this.triggerUpdateUI();
  },

  back: function() {
    this.isBlack = !this.isBlack;
    this.stones.pop();
    this.triggerUpdateUI();
  },

  setPaintingArea: function(left, top, size) {
    this.left = left;
    this.top = top;
    this.unitSize = Math.floor(size / Config.Board.size);
    this.halfSize = Math.floor(size / Config.Board.size / 2);
    this.right = left + this.unitSize * Config.Board.size - 1;
    this.bottom = top + this.unitSize * Config.Board.size - 1;
  },

  render: function(context) {
    this.renderChessboard(context);
    this.renderCells(context);
    this.renderHighlight(context);
  },

  renderChessboard: function(context) {
    // The rectangle of the visiable chess board
    var rect = {
      left: this.left + this.halfSize,
      top: this.top + this.halfSize,
      right: this.right - this.halfSize,
      bottom: this.bottom - this.halfSize
    };

    context.save();
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
    context.restore();
  },

  renderCells: function(context) {
    for (var i = 0; i < this.stones.length; i++) {
      var x = this.stones[i].x;
      var y = this.stones[i].y;
      var isBlack = this.stones[i].isBlack;

      var left = this.left + x * this.unitSize;
      var top = this.top + y * this.unitSize;
      var cx = left + this.halfSize;
      var cy = top + this.halfSize;

      context.beginPath();
      context.arc(cx, cy, this.halfSize - 2, 0, 2 * Math.PI);
      context.closePath();
      var gradient = context.createRadialGradient(cx + 2, cy - 2, this.halfSize - 2, cx + 2, cy - 2, 0);
      if (!isBlack) {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
      } else {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
      }
      context.fillStyle = gradient;
      context.fill();
    }
  },

  renderHighlight: function(context) {
    if (this.selectedCell) {
      var left = this.left + this.selectedCell.x * this.unitSize;
      var top = this.top + this.selectedCell.y * this.unitSize;
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

    // Set the selected cell
    if (this.selectedCell && !this.hasStone(this.selectedCell.x, this.selectedCell.y)) {
      this.stones.push({
        x: this.selectedCell.x,
        y: this.selectedCell.y,
        isBlack: this.isBlack
      });

      this.isBlack = !this.isBlack;

      this.triggerUpdateUI();
    }
  },

  setSelectedCell: function(left, top) {
    var oldX = this.selectedCell ? this.selectedCell.x : null;
    var oldY = this.selectedCell ? this.selectedCell.y : null;

    if (left < this.left || left > this.right || top < this.top || top > this.bottom) {
      this.selectedCell = null;
    } else {
      // Calculate the selected cell
      this.selectedCell = this.posToCell(left, top);
    }

    var newX = this.selectedCell ? this.selectedCell.x : null;
    var newY = this.selectedCell ? this.selectedCell.y : null;

    if (newX != oldX || newY != oldY) {
      this.triggerUpdateUI();
    }
  },

  posToCell: function(left, top) {
    return {
      x: Math.floor((left - this.left) / this.unitSize),
      y: Math.floor((top - this.top) / this.unitSize)
    };
  },

  hasStone: function(x, y) {
    for (var i = 0; i < this.stones.length; i++) {
      if (x === this.stones[i].x && y === this.stones[i].y) {
        return true;
      }
    }

    return false;
  },

  triggerUpdateUI: function() {
    if (typeof this.onUpdateUI == 'function') {
      this.onUpdateUI();
    }
  }
}
