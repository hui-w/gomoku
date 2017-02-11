/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 *
 * Base class for canvas components
 */
function Component(child, left, top, width, height) {
  /*
  Copy the prototype
   */
  for (key in Component.prototype) {
    child.prototype[key] = Component.prototype[key];
  }

  // Initialize
  child.left = left;
  child.top = top;
  child.width = width;
  child.height = height;
}

Component.prototype = {
  left: null,
  top: null,
  width: null,
  height: null,

  // Method to render the extra content
  renderExtra: null,

  // Event to update UI
  onUpdateUI: null,

  render: function(context) {

  },

  setPosition: function(left, top) {
    this.left = left;
    this.top = top;
    this.triggerUpdateUI();
  },

  triggerUpdateUI: function() {
    if (typeof this.onUpdateUI == 'function') {
      this.onUpdateUI();
    }
  }
}
