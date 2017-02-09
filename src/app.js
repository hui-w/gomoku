/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/maze
 * @licence MIT 
 */
function App() {
  var that = this;
  this.game = new Game();
  this.game.onChange = function() {
    // Sth changed and redraw requested
    that.redraw();
  };

  this.width = 0;
  this.height = 0;
  this.cellSize = 0;

  this.canvas = null;
  this.context = null;

  // Initialize
  this.init();
}

App.prototype = {
  init: function() {
    var that = this;
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.render();
  },

  render: function() {
    var that = this;

    // Create the wrapper
    var rootElement = document.body;
    var wrapper = rootElement.createChild("div", {
      "id": "app-wrapper",
      "style": "padding: " + Config.Canvas.margin + "px"
    })

    // Initialize the canvas and the context
    this.canvas = wrapper.createChild("canvas", {
      "id": "app-canvas",
      "width": 0,
      "height": 0
    });
    if (typeof G_vmlCanvasManager != "undefined") {
      this.canvas = G_vmlCanvasManager.initElement(this.canvas);
    }
    this.context = this.canvas.getContext("2d");

    // Bind events
    // Handle the mouse events
    this.handleMouseEvent = function(e) {
      that.handleMouse(e, that);
    }
    this.canvas.addEventListener("mousedown", this.handleMouseEvent, false);
    this.canvas.addEventListener("mousemove", this.handleMouseEvent, false);
    this.canvas.addEventListener("mouseup", this.handleMouseEvent, false);

    // Handle the touch events
    this.handleTouchEvent = function(e) {
      that.handleTouch(e, that);
    }
    this.canvas.addEventListener("touchstart", this.handleTouchEvent, false);
    this.canvas.addEventListener("touchend", this.handleTouchEvent, false);
    this.canvas.addEventListener("touchmove", this.handleTouchEvent, false);

    // Calculate the size of the chessboard
    this.resizeCanvas();

    // Check if the window size is changed
    function checkWindowsize() {
      var nwidth = document.documentElement.clientWidth;
      var nheight = document.documentElement.clientHeight;
      if (nwidth != that.width || nheight != that.height) {
        that.width = nwidth;
        that.height = nheight;
        that.resizeCanvas();
      }
    }
    setInterval(checkWindowsize, 200);
  },

  resizeCanvas: function() {
    this.canvas.width = this.width - Config.Canvas.margin * 2;
    this.canvas.height = this.height - Config.Canvas.margin * 2;
    var boardSize = (this.canvas.width > this.canvas.height ?
      this.canvas.height : this.canvas.width) - Config.Canvas.padding * 2;
    this.game.setPaintingArea(
      Config.Canvas.padding,
      Config.Canvas.padding,
      boardSize
    );

    this.redraw();
  },

  redraw: function() {
    // Clear the canvas
    this.canvas.width = this.canvas.width;
    this.canvas.height = this.canvas.height;

    // Draw the background
    this.context.save();
    this.context.fillStyle = Config.Canvas.fill;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();

    // Redraw tje Game
    this.game.draw(this.context);

    console.log("- canvas redraw")
  },

  /* Mouse events */
  handleMouse: function(e, that) {
    switch (e.type) {
      case "mousedown":
        that.capture(e);
        break;
      case "mousemove":
        that.move(e);
        break;
      case "mouseup":
        that.release(e);
        break;
    }
  },

  /* Touch events */
  handleTouch: function(e, that) {
    e.preventDefault();
    switch (e.type) {
      case "touchstart":
        if (e.touches.length == 1) {
          that.capture(e.targetTouches[0]);
        } else if (e.touches.length == 2) {}
        break;
      case "touchend":
        if (e.changedTouches.length == 1) {
          that.release(e.changedTouches[0]);
        }
        break;
      case "touchmove":
        if (e.changedTouches.length == 1) {
          that.move(e.changedTouches[0]);
        } else if (e.touches.length == 2) {}
        break;
    }
  },

  capture: function(e) {
    var pos = this.getEventPosition(e);
    this.game.onCapture(pos.left, pos.top);
  },

  release: function(e) {
    var pos = this.getEventPosition(e);
    this.game.onRelease(pos.left, pos.top);
  },

  move: function(e) {
    var pos = this.getEventPosition(e);
    this.game.onMove(pos.left, pos.top);
  },

  /* Get the event position on the monitor */
  getEventPosition: function(ev) {
    return {
      left: ev.pageX - this.canvas.offsetLeft,
      top: ev.pageY - this.canvas.offsetTop
    };
  }
}

var app = null;
addEventListener("load", function() {
  app = new App();
});
