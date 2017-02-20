/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function Button(left, top, width, height, id) {
  // Inherits all members from base class
  Component(this, left, top, width, height, id);

  // Initialize
  this.type = 'button';

  this.isOn = false;
  this.text = null;
  this.font = {
    size: 12,
    face: "Arial, Helvetica, sans-serif",
    color: "#000000"
  };

  // The position where mouse was down
  this.capturedPosition = null;

  // Event handler
  this.onClick = [];

  this.init();
}

Button.prototype = {
  init: function() {
    // Render the button border and background
    this.renderExtra.push(function(self, context) {
      console.log(self);
      if (self.id === 'button1') {
        console.log(self.capturedPosition);
      }
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(self.width, 0);
      context.lineTo(self.width, self.height);
      context.lineTo(0, self.height);
      context.closePath();

      if (self.capturedPosition || self.isOn) {
        context.fillStyle = "#B5B5B5";
        context.strokeStyle = "#979797";
      } else {
        context.fillStyle = "#EBEBEB";
        context.strokeStyle = "#979797";
      }

      context.fill();
      context.stroke();
    });

    // Render the text
    this.renderExtra.push(function(self, context) {
      // Text
      if (self.text) {
        context.fillStyle = self.font.color;
        context.font = self.font.size + "px " + self.font.face;
        context.fillTextEx(self.text, self.width / 2, self.height / 2, 'center', 'middle');
      }
    });
  },

  setOn: function(isOn) {
    if (this.isOn === isOn) {
      return;
    }

    this.isOn = isOn;
    this.requestRedraw();
  },

  setText: function(text) {
    if (this.text === text) {
      return;
    }

    this.text = text;
    this.requestRedraw();
  },

  onCapture: function(left, top) {
    if (!this.isPointInside(left, top)) {
      return;
    }

    this.capturedPosition = { left: left, top: top };
    this.requestRedraw();
  },

  onRelease: function(left, top) {
    if (!this.capturedPosition) {
      return;
    }

    if (this.isPointInside(left, top)) {
      // Both Capture and Release event happens on the component
      if (typeof this.onClick == 'function') {
        this.onClick();
      } else if (typeof this.onClick == 'object') {
        for (var i = 0; i < this.onClick.length; i++) {
          var handler = this.onClick[i];
          if (typeof handler == 'function') {
            handler();
          }
        }
      }
    }

    this.capturedPosition = null;
    this.requestRedraw();
  },

  onDrag: function(left, top) {

  }
}
