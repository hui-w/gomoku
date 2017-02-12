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

  dispatchEvent: function() {
    var eventType = arguments[0];

    for (var i = 0; i < this.components.length; i++) {
      var component = this.components[i];

      switch (eventType) {
        case 'capture':
          var left = arguments[1];
          var top = arguments[2];
          if (typeof component.onCapture === 'function') {
            component.onCapture(left, top);
          }
          break;
        case 'drag':
          var left = arguments[1];
          var top = arguments[2];
          if (typeof component.onCapture === 'function') {
            component.onDrag(left, top);
          }
          break;
        case 'release':
          var left = arguments[1];
          var top = arguments[2];
          if (typeof component.onCapture === 'function') {
            component.onRelease(left, top);
          }
          break;
      }
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
