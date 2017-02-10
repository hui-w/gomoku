/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function Button(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;

  // The position where mouse was down
  this.capturedPosition = null;

  // Event handler
  this.onClick = null;
  this.onUpdateUI = null;

  // Extra render
  this.renderExtra = null;
}

Button.prototype = {
  setPosition: function(left, top) {
    this.left = left;
    this.top = top;
    this.triggerUpdateUI();
  },

  render: function(context) {
    context.save();
    context.translate(this.left, this.top);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.width, 0);
    context.lineTo(this.width, this.height);
    context.lineTo(0, this.height);
    context.closePath();

    if (this.capturedPosition) {
      context.fillStyle = "#B5B5B5";
      context.strokeStyle = "#979797";
    } else {
      context.fillStyle = "#EBEBEB";
      context.strokeStyle = "#979797";
    }

    context.fill();
    context.stroke();

    // Render customized content
    if (typeof this.renderExtra == 'function') {
      this.renderExtra(context);
    }

    context.restore();
  },

  isPointInside: function(left, top) {
    return left >= this.left &&
      left <= this.left + this.width &&
      top >= this.top &&
      top <= this.top + this.height;
  },

  onCapture: function(left, top) {
    if (!this.isPointInside(left, top)) {
      return;
    }

    this.capturedPosition = { left: left, top: top };
    this.triggerUpdateUI();
  },

  onRelease: function(left, top) {
    if (!this.capturedPosition) {
      return;
    }

    if (this.isPointInside(left, top)) {
      // Both Capture and Release event happens on the component
      if (typeof this.onClick == 'function') {
        this.onClick();
      } else if (typeof this.onClick == 'array') {
        for (var i = 0; i < this.onClick.length; i++) {
          var handler = this.onClick[i];
          if (typeof handler == 'function') {
            handler();
          }
        }
      }
    }

    this.capturedPosition = null;
    this.triggerUpdateUI();
  },

  onDrag: function(left, top) {

  },

  triggerUpdateUI: function() {
    if (typeof this.onUpdateUI == 'function') {
      this.onUpdateUI();
    }
  }
}
