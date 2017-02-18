/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function App() {
  var that = this;

  // Properties
  this.width = 0;
  this.height = 0;

  this.canvas = null;
  this.context = null;

  // Child components
  this.home = new Home(Config.Canvas.padding, Config.Canvas.padding);
  this.chessboard = new Chessboard(Config.Canvas.padding, Config.Canvas.padding);

  var btnSize = Config.Button.size;

  // Button: current player indicator
  this.playerIndicator = new Panel(0, 0, btnSize, btnSize);
  //this.playerIndicator.setFillStyle("RGBA(0, 0, 0, 0.5");
  //this.playerIndicator.setLineWidth(1);
  //this.playerIndicator.setStrokeStyle("#000000")

  // Button: new game
  this.btnNew = new Button(0, 0, btnSize, btnSize);
  this.btnNew.renderExtra.push(function(self, context) {
    context.beginPath();

    // Horizontal line
    context.moveTo(btnSize / 4, btnSize / 2);
    context.lineTo(btnSize - btnSize / 4, btnSize / 2);
    // Vertical line
    context.moveTo(btnSize / 2, btnSize / 4);
    context.lineTo(btnSize / 2, btnSize - btnSize / 4);

    context.strokeStyle = "#000";
    context.stroke();
  });
  this.btnNew.onClick = function() {
    that.chessboard.reset();
  };

  // Button: history back
  this.btnBack = new Button(0, 0, btnSize, btnSize);
  this.btnBack.renderExtra.push(function(self, context) {
    context.beginPath();

    // Horizontal line
    context.moveTo(btnSize / 4, btnSize / 2);
    context.lineTo(btnSize - btnSize / 4, btnSize / 2);
    // Arrow
    context.moveTo(btnSize / 2, btnSize / 4);
    context.lineTo(btnSize / 4, btnSize / 2);
    context.lineTo(btnSize / 2, btnSize - btnSize / 4);

    context.strokeStyle = "#000";
    context.stroke();
  });
  this.btnBack.onClick = function() {
    that.chessboard.back();
  };

  // Buttons for enabling the robot
  this.btnBotBlack = new Button(0, 0, btnSize, btnSize / 2);
  this.btnBotBlack.renderExtra.push(function(self, context) {
    context.drawStone(true, btnSize / 4, 0, btnSize / 4);
  });
  this.btnBotBlack.onClick = function() {
    that.chessboard.setRobot('black', !that.chessboard.robotConfig.black);
  };
  this.btnBotWhite = new Button(0, 0, btnSize, btnSize / 2);
  this.btnBotWhite.renderExtra.push(function(self, context) {
    context.drawStone(false, btnSize / 4, 0, btnSize / 4);
  });
  this.btnBotWhite.onClick = function() {
    that.chessboard.setRobot('white', !that.chessboard.robotConfig.white);
  };

  // Labels
  this.lblCurrent = new Label(0, 0, 'Player');
  this.lblCurrent.setHorizontalAlign('center');
  this.lblCurrent.setVerticalAlign('bottom');

  this.lblNew = new Label(0, 0, 'New');
  this.lblNew.setHorizontalAlign('center');
  this.lblNew.setVerticalAlign('bottom');

  this.lblBack = new Label(0, 0, 'Back');
  this.lblBack.setHorizontalAlign('center');
  this.lblBack.setVerticalAlign('bottom');

  this.lblRobot = new Label(0, 0, 'Robot');
  this.lblRobot.setHorizontalAlign('center');
  this.lblRobot.setVerticalAlign('bottom');

  // UI manager
  this.uiManager = new UIManager();
  this.uiManager.setRedrawHandler(
    function() {
      that.redraw();
    });
  this.uiManager.registerComponent(this.chessboard);
  this.uiManager.registerComponent(this.playerIndicator);
  this.uiManager.registerComponent(this.btnNew);
  this.uiManager.registerComponent(this.btnBack);
  this.uiManager.registerComponent(this.btnBotBlack);
  this.uiManager.registerComponent(this.btnBotWhite);
  this.uiManager.registerComponent(this.lblCurrent);
  this.uiManager.registerComponent(this.lblNew);
  this.uiManager.registerComponent(this.lblBack);
  this.uiManager.registerComponent(this.lblRobot);
  this.uiManager.registerComponent(this.home);

  // Initialize
  this.init();
}

App.prototype = {
  init: function() {
    var that = this;
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.render();
    //this.showHome(true);
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

    // Check if there is enough space for the buttons
    var currentSpace = Math.abs(this.canvas.width - this.canvas.height);
    var spaceNeeded = Config.Button.size + Config.Button.margin * 2;
    if (currentSpace < spaceNeeded) {
      boardSize -= spaceNeeded - currentSpace;
    }

    // Update the chessboard
    this.chessboard.setBoardSize(boardSize);
    this.home.setSize(
      this.canvas.width - Config.Canvas.padding * 2,
      this.canvas.height - Config.Canvas.padding * 2
    );

    // Update the buttons
    var buttonCount = 4;
    var buttonLengthAll = Config.Button.size * buttonCount + Config.Button.margin * (buttonCount - 1);
    if (this.canvas.width > this.canvas.height) {
      // Buttons on the right side
      var left = Config.Canvas.padding + boardSize + Config.Button.margin;
      var top = Math.floor((this.canvas.height - buttonLengthAll) / 2);

      // Player indicator
      this.lblCurrent.setPosition(left + Config.Button.size / 2, top - 2);
      this.playerIndicator.setPosition(left, top);

      // Buttons
      top += Config.Button.size + Config.Button.margin;
      this.lblNew.setPosition(left + Config.Button.size / 2, top - 2);
      this.btnNew.setPosition(left, top);

      top += Config.Button.size + Config.Button.margin;
      this.lblBack.setPosition(left + Config.Button.size / 2, top - 2);
      this.btnBack.setPosition(left, top);

      // Robots label and buttons
      top += Config.Button.size + Config.Button.margin;
      this.lblRobot.setPosition(left + Config.Button.size / 2, top - 2); 
      this.btnBotBlack.setPosition(left, top);

      top += Config.Button.size / 2;
      this.btnBotWhite.setPosition(left, top);
    } else {
      // Buttons on the bottom side
      var left = Math.floor((this.canvas.width - buttonLengthAll) / 2);
      var top = Config.Canvas.padding + boardSize + Config.Button.margin;

      // Player indicator
      this.lblCurrent.setPosition(left + Config.Button.size / 2, top - 2);
      this.playerIndicator.setPosition(left, top);

      // Buttons
      left += Config.Button.size + Config.Button.margin;
      this.lblNew.setPosition(left + Config.Button.size / 2, top - 2);
      this.btnNew.setPosition(left, top);

      left += Config.Button.size + Config.Button.margin;
      this.lblBack.setPosition(left + Config.Button.size / 2, top - 2);
      this.btnBack.setPosition(left, top);

      // Robots label and buttons
      left += Config.Button.size + Config.Button.margin;
      this.lblRobot.setPosition(left + Config.Button.size / 2, top - 2); 
      this.btnBotBlack.setPosition(left, top);

      top += Config.Button.size / 2;
      this.btnBotWhite.setPosition(left, top);
    }

    // Let UIManager to handle the redraw to avoid duplicated renderring
    // this.redraw();
    this.uiManager.requestRedraw();
  },

  redraw: function() {
    var that = this;

    // Clear the canvas
    this.canvas.width = this.canvas.width;
    this.canvas.height = this.canvas.height;

    // Get the component status before redraw
    this.playerIndicator.renderExtra = function(self, context) {
      context.drawStone(that.chessboard.isBlackPlaying(), 0, 0, Math.floor(self.width / 2));
    }
    this.btnBotBlack.setOn(this.chessboard.robotConfig.black);
    this.btnBotWhite.setOn(this.chessboard.robotConfig.white);

    // Draw the background
    this.context.save();
    this.context.fillStyle = Config.Canvas.fill;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();

    // Redraw all managed components
    this.uiManager.redrawComponents(this.context);

    console.log("- canvas redraw")
  },

  showHome: function(show) {
    this.home.setVisible(show);
    this.uiManager.enableAll(!show);
  },

  /* Mouse events */
  handleMouse: function(e, that) {
    switch (e.type) {
      case "mousedown":
        that.capture(e);
        break;
      case "mousemove":
        that.drag(e);
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
          that.drag(e.changedTouches[0]);
        } else if (e.touches.length == 2) {}
        break;
    }
  },

  capture: function(e) {
    var pos = this.getEventPosition(e);
    this.uiManager.dispatchEvent('capture', pos.left, pos.top);
  },

  drag: function(e) {
    var pos = this.getEventPosition(e);
    this.uiManager.dispatchEvent('drag', pos.left, pos.top);
  },

  release: function(e) {
    var pos = this.getEventPosition(e);
    this.uiManager.dispatchEvent('release', pos.left, pos.top);
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
