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
    size: 12,
    face: "Arial, Helvetica, sans-serif",
    color: "#000000"
  };

  this.init();

  this.text = text;
  this.horizontalAlign = 'left';
  this.verticalAlign = 'top';
}

Label.prototype = {
  init: function() {
    this.onRenderExtra.push(function(context) {
      context.fillStyle = this.font.color;
      context.font = this.font.size + "px " + this.font.face;
      context.fillTextEx(this.text, 0, 0, this.horizontalAlign, this.verticalAlign);
    });
  },

  setHorizontalAlign: function(horizontalAlign) {
    if (horizontalAlign === this.horizontalAlign) {
      return;
    }

    this.horizontalAlign = horizontalAlign;
    this.requestRedraw();
  },

  setVerticalAlign: function(verticalAlign) {
    if (verticalAlign === this.verticalAlign) {
      return;
    }

    this.verticalAlign = verticalAlign;
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
