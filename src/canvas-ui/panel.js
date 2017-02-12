/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Canvas panel
 */
function Panel(left, top, width, height) {
  // Inherits all members from base class
  Component(this, left, top, width, height);

  // Initialize
  this.type = 'panel';

  this.init();
}

Panel.prototype = {
  init: function() {

  }
}
