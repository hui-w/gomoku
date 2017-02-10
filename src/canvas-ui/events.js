/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function Events() {
  this.components = [];
  this.upateUIHandler = null;
}

Events.prototype = {
  setUpdateUIHandler: function(handler) {
    this.upateUIHandler = handler;
  },

  registerComponent: function(component) {
    component.onUpdateUI = this.upateUIHandler;
    this.components.push(component);
  },

  redrawComponents: function(context) {
    for (var i = 0; i < this.components.length; i++) {
      this.components[i].render(context);
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
          component.onCapture(left, top);
          break;
        case 'drag':
          var left = arguments[1];
          var top = arguments[2];
          component.onDrag(left, top);
          break;
        case 'release':
          var left = arguments[1];
          var top = arguments[2];
          component.onRelease(left, top);
          break;
      }
    }
  }
}
