/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 *
 * Base class for canvas components
 */
function Component(child, left, top, width, height) {
  /*
  // Copy the prototype
  for (key in Component.prototype) {
    var item = Component.prototype[key];
    if (typeof item === 'function') {
      child.prototype[key] = item;
    } else {
      child.prototype[key] = JSON.parse(JSON.stringify(item));
    }
  }
  */

  // Copy the prototype
  for (key in Component.prototype) {
    var item = Component.prototype[key];
    if (typeof item === 'function') {
      child[key] = item;
    } else {
      child[key] = JSON.parse(JSON.stringify(item));
    }
  }

  // Init the component
  if (left != undefined) {
    child.left = left;
  }
  if (top != undefined) {
    child.top = top;
  }
  if (width != undefined) {
    child.width = width;
  }
  if (height != undefined) {
    child.height = height;
  }
}

Component.prototype = {
  // Position and size
  type: null,
  left: 0,
  top: 0,
  width: 0,
  height: 0,

  isEnabled: true,
  isVisible: true,

  // Look and feel
  fillStyle: null,
  strokeStyle: null,
  lineWidth: 0,

  /* Method to render the extra content
   * Example:
   *  panel.renderExtra.push(function(self, context) {
   *    context.fillStyle = "RGBA(255, 0, 0, 0.5)";
   *    context.fillRect(0, 0, self.width, self.height);
   *  });
   */
  renderExtra: [],

  // Event to update UI
  onRequestRedraw: null,

  // Events handler
  /* Comment these out, as they will be always null if being declared here as null
  onCapture: null,
  onDrag: null,
  onRelease: null,
  */

  setEnabled: function(isEnabled) {
    this.isEnabled = isEnabled;
    this.requestRedraw();
  },

  setVisible: function(isVisible) {
    this.isVisible = isVisible;
    this.requestRedraw();
  },

  setPosition: function(left, top) {
    this.left = left;
    this.top = top;
    this.requestRedraw();
  },

  setSize: function(width, height) {
    this.width = width;
    this.height = height;
    this.requestRedraw();
  },

  setStrokeStyle: function(style) {
    this.strokeStyle = style;
    this.requestRedraw();
  },

  setLineWidth: function(width) {
    this.lineWidth = width;
    this.requestRedraw();
  },

  setFillStyle: function(style) {
    this.fillStyle = style;
    this.requestRedraw();
  },

  requestRedraw: function() {
    if (typeof this.onRequestRedraw == 'function') {
      this.onRequestRedraw();
    }
  },

  isPointInside: function(left, top) {
    return left >= this.left &&
      left <= this.left + this.width &&
      top >= this.top &&
      top <= this.top + this.height;
  },

  handleEvent: function(eventType, left, top) {
    if (!this.isEnabled || !this.isVisible) {
      // The component is disabled of hidden
      return;
    }

    switch (eventType) {
      case 'capture':
        if (typeof this.onCapture === 'function') {
          this.onCapture(left, top);
        }
        break;
      case 'drag':
        if (typeof this.onDrag === 'function') {
          this.onDrag(left, top);
        }
        break;
      case 'release':
        if (typeof this.onRelease === 'function') {
          this.onRelease(left, top);
        }
        break;
    }
  },

  render: function(context) {
    context.save();
    context.translate(this.left, this.top);

    // Background
    if (this.fillStyle) {
      context.fillStyle = this.fillStyle;
      context.fillRect(0, 0, this.width, this.height);
    }

    // Border
    if (this.strokeStyle && this.lineWidth > 0) {
      context.lineWidth = this.lineWidth;
      context.strokeStyle = this.strokeStyle;
      context.strokeRect(0, 0, this.width, this.height);
    }

    // Render customized content
    if (typeof this.renderExtra == 'function') {
      this.renderExtra(this, context);
    } else if (typeof this.renderExtra == 'object') {
      for (var i = 0; i < this.renderExtra.length; i++) {
        var renderExtra = this.renderExtra[i];
        if (typeof renderExtra == 'function') {
          renderExtra(this, context);
        }
      }
    }

    context.restore();
  }
}
