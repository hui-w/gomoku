/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function UIManager() {
  this.components = [];
  this.redrawHandler = null;
  this.delayTimer = null;
}

UIManager.prototype = {
  setRedrawHandler: function(handler) {
    this.redrawHandler = handler;
  },

  registerComponent: function(component) {
    var that = this;
    component.onRequestRedraw = function() {
      that.requestRedraw();
    };

    this.components.push(component);
  },

  redrawComponents: function(context) {
    for (var i = 0; i < this.components.length; i++) {
      if (typeof this.components[i].render === 'function') {
        this.components[i].render(context);
      }
    }
  },

  enableAll: function(enabled) {
    for (var i = 0; i < this.components.length; i++) {
      this.components[i].setEnabled(enabled);
    }  
  },

  dispatchEvent: function(eventType, left, top) {
    for (var i = 0; i < this.components.length; i++) {
      var component = this.components[i];
      component.handleEvent(eventType, left, top);
    }
  },

  requestRedraw: function() {
    var that = this;
    if (this.delayTimer) {
      // To aviod duplicated render
      return;
    }

    this.delayTimer = setTimeout(function() {
      that.redrawHandler();
      that.delayTimer = null;
    }, 50);
  }
}
