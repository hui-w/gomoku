/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function $() {
  var elements = new Array();
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string')
      element = document.getElementById(element);
    if (arguments.length == 1)
      return element;
    elements.push(element);
  }
  return elements;
}

// Convert stones list to an array of chessboard
function stonesToChessboard(stones) {
  var chessData = [];

  // Init with empty chess board
  for (var i = 0; i < Config.Board.size; i++) {
    chessData[i] = [];
    for (var j = 0; j < Config.Board.size; j++) {
      chessData[i][j] = 0;
    }
  }

  // Merge from the stone history
  for (var i = 0; i < stones.length; i++) {
    var row = stones[i].row;
    var col = stones[i].col;
    var isBlack = i % 2 === 0;
    chessData[row][col] = isBlack ? 1 : 2;
  }

  return chessData;
}

Element.prototype.createChild = function(tag, param, innerHTML) {
  var element = document.createElement(tag);
  this.appendChild(element);
  if (param) {
    for (key in param) {
      element.setAttribute(key, param[key]);
    }
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  return element;
};

Element.prototype.hasClassName = function(a) {
  return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className);
}

Element.prototype.addClassName = function(a) {
  if (!this.hasClassName(a)) {
    this.className = [this.className, a].join(" ");
  }
}

Element.prototype.removeClassName = function(b) {
  if (this.hasClassName(b)) {
    var a = this.className;
    this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ");
  }
}

var canvasPrototype = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
canvasPrototype.antiFuzzyLine = function(x1, y1, x2, y2) {
  if (this.lineWidth % 2 == 1) {
    //-0.5 to avoid fuzzy line
    x1 -= 0.5;
    y1 -= 0.5;
    x2 -= 0.5;
    y2 -= 0.5;
  }
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
};

canvasPrototype.drawStone = function(isBlack, x, y, r) {
  var cx = x + r;
  var cy = y + r;

  this.save();
  this.beginPath();
  this.arc(cx, cy, r - 2, 0, 2 * Math.PI);
  this.closePath();
  var gradient = this.createRadialGradient(cx + 2, cy - 2, r - 2, cx + 2, cy - 2, 0);
  if (isBlack) {
    gradient.addColorStop(0, "#0A0A0A");
    gradient.addColorStop(1, "#636766");
  } else {
    gradient.addColorStop(0, "#D1D1D1");
    gradient.addColorStop(1, "#F9F9F9");
  }
  this.fillStyle = gradient;
  this.fill();
  this.restore();
}

/*
horizontalAlign: left, center, right
verticalAlign: top, middle, bottom
 */
canvasPrototype.fillTextEx = function(text, x, y, horizontalAlign, verticalAlign) {
  this.save();
  var textLeft = x;
  if (horizontalAlign != "left") {
    var textWidth = this.measureText(text).width;
    if (horizontalAlign == "center") {
      textLeft -= textWidth / 2;
    } else if (horizontalAlign == "right") {
      textLeft -= textWidth;
    }
  }
  this.textBaseline = verticalAlign;
  this.fillText(text, textLeft, y);
  this.restore();
}
