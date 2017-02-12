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

  this.init();

  this.text = text;
}

Label.prototype = {
  init: function() {
    this.renderExtra.push(function(self, context) {
      context.fillTextEx(self.text, 0, 0, 'left', 'top');
    });
  },

  setText: function(text) {
  	this.text = text;
  	this.requestRedraw();
  }
}
