/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Canvas label
 */
function Label(left, top, text) {
  // Inherits all members from base class
  Component(this, left, top, 0, 0);

  // Initialize
  this.type = 'label';
  this.font = {
    size: 10,
    face: "verdana",
    color: "#000000"
  };

  this.init();

  this.text = text;
  this.horizontalAlign = 'left';
  this.verticalAlign = 'top';
}

Label.prototype = {
  init: function() {
    this.renderExtra.push(function(self, context) {
      context.fillStyle = self.font.color;
      context.font = self.font.size + "px " + self.font.face;
      context.fillTextEx(self.text, 0, 0, self.horizontalAlign, self.verticalAlign);
    });
  },

  setHorizontalAlign: function(value) {
    if (value === this.horizontalAlign) {
      return;
    }

    this.horizontalAlign = value;
    this.requestRedraw();
  },

  setVerticalAlign: function(value) {
    if (value === this.verticalAlign) {
      return;
    }

    this.verticalAlign = value;
    this.requestRedraw();
  },

  setText: function(text) {
    if (text === this.text) {
      return;
    }
    
    this.text = text;
    this.requestRedraw();
  }
}
