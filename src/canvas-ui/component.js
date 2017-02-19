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
  text: null,
  font: {
    size: 12,
    face: "Arial, Helvetica, sans-serif",
    color: "#000000"
  },

  /* Method to render the extra content
   * Example:
   *  panel.renderExtra.push(function(self, context) {
   *    context.fillStyle = "RGBA(255, 0, 0, 0.5)";
   *    context.fillRect(0, 0, self.width, self.height);
   *  });
   */
  renderExtra: [],

  /*
   * Parent and child components
   */
  parent: null,
  children: [],

  // Event to update UI
  onRequestRedraw: null,

  // Events handler
  /* Comment these out, as they will be always null if being declared here as null
  onCapture: null,
  onDrag: null,
  onRelease: null,
  */

  setEnabled: function(isEnabled) {
    if (this.isEnabled === isEnabled) {
      return;
    }

    this.isEnabled = isEnabled;
    this.requestRedraw();

    // Update children
    this.children.forEach(function(child) {
      child.setEnabled(isEnabled);
    });
  },

  setVisible: function(isVisible) {
    if (this.isVisible === isVisible) {
      return;
    }

    this.isVisible = isVisible;
    this.requestRedraw();

    // Update children
    this.children.forEach(function(child) {
      child.setVisible(isVisible);
    });
  },

  setPosition: function(left, top) {
    if (this.left === left && this.top === top) {
      return;
    }

    this.left = left;
    this.top = top;
    this.requestRedraw();

    // Update children
    this.children.forEach(function(child) {
      child.requestRedraw();
    });
  },

  setSize: function(width, height) {
    if (this.width === width && this.height === height) {
      return;
    }

    this.width = width;
    this.height = height;
    this.requestRedraw();
  },

  setText: function(text) {
    if (this.text === text) {
      return;
    }

    this.text = text;
    this.requestRedraw();
  },

  setStrokeStyle: function(strokeStyle) {
    if (this.strokeStyle === strokeStyle) {
      return;
    }

    this.strokeStyle = strokeStyle;
    this.requestRedraw();
  },

  setLineWidth: function(lineWidth) {
    if (this.lineWidth === lineWidth) {
      return;
    }

    this.lineWidth = lineWidth;
    this.requestRedraw();
  },

  setFillStyle: function(fillStyle) {
    if (this.fillStyle === fillStyle) {
      return;
    }

    this.fillStyle = fillStyle;
    this.requestRedraw();
  },

  // Add a child component
  addChild: function(child) {
    this.children.push(child);
    child.bindParent(this);
  },

  // Set the parent of current component
  bindParent: function(parent) {
    this.parent = parent;
  },

  // Request redraw
  requestRedraw: function() {
    if (typeof this.onRequestRedraw == 'function') {
      this.onRequestRedraw();
    }
  },

  // Check if the point is inside the component rectangle
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

    // Propagate to children
    this.children.forEach(function(child) {
      child.handleEvent(eventType, left, top);
    })
  },

  render: function(context) {
    context.save();
    var left = this.left;
    var top = this.top;
    var parent = this.parent;

    // Get the left and top of all parents
    while (parent != null) {
      left += parent.left;
      top += parent.top;
      parent = parent.parent;
    }
    context.translate(left, top);

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

    // Text
    if (this.text) {
      context.fillStyle = this.font.color;
      context.font = this.font.size + "px " + this.font.face;
      context.fillTextEx(this.text, this.width / 2, this.height / 2, 'center', 'middle');
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

    // Render all children
    this.children.forEach(function(child) {
      child.render(context);
    });
  }
}
