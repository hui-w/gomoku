/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */

var app_prototype = {
  // Child components
  menu: null,
  chessboard: null,
  playerIndicator: null,
  btnMenu: null,
  btnBack: null,
  lblCurrent: null,
  lblMenu: null,
  lblBack: null,

  init: function() {
    this._super();

    // Prepare the child components
    this.initChildren();

    // Register the children
    this.registerComponents([
      this.chessboard,
      this.playerIndicator,
      this.btnMenu,
      this.btnBack,
      this.lblCurrent,
      this.lblMenu,
      this.lblBack,
      this.menu
    ]);

    // Initialize
    this.render();
    this.showMenu(true);
  },

  canvasResized: function(width, height) {
    var boardSize = (width > height ?
      height : width) - Config.Canvas.padding * 2;

    // Check if there is enough space for the buttons
    var currentSpace = Math.abs(width - height);
    var spaceNeeded = Config.Button.size + Config.Button.margin * 2;
    if (currentSpace < spaceNeeded) {
      boardSize -= spaceNeeded - currentSpace;
    }

    // Update the chessboard
    this.chessboard.setBoardSize(boardSize);

    // Update the home menu
    this.menu.setSize(
      width,
      height
    );

    // Update the buttons
    var buttonCount = 3;
    var labelMargin = 2;
    var buttonLengthAll = Config.Button.size * buttonCount + Config.Button.margin * (buttonCount - 1);
    if (width > height) {
      // Buttons on the right side
      var left = Config.Canvas.padding + boardSize + Config.Button.margin;
      var top = Math.floor((height - buttonLengthAll) / 2);

      // Player indicator
      this.lblCurrent.setPosition(left + Config.Button.size / 2, top - labelMargin);
      this.playerIndicator.setPosition(left, top);

      // Buttons
      top += Config.Button.size + Config.Button.margin;
      this.lblMenu.setPosition(left + Config.Button.size / 2, top - labelMargin);
      this.btnMenu.setPosition(left, top);

      top += Config.Button.size + Config.Button.margin;
      this.lblBack.setPosition(left + Config.Button.size / 2, top - labelMargin);
      this.btnBack.setPosition(left, top);
    } else {
      // Buttons on the bottom side
      var left = Math.floor((width - buttonLengthAll) / 2);
      var top = Config.Canvas.padding + boardSize + Config.Button.margin;

      // Player indicator
      this.lblCurrent.setPosition(left + Config.Button.size / 2, top - labelMargin);
      this.playerIndicator.setPosition(left, top);

      // Buttons
      left += Config.Button.size + Config.Button.margin;
      this.lblMenu.setPosition(left + Config.Button.size / 2, top - labelMargin);
      this.btnMenu.setPosition(left, top);

      left += Config.Button.size + Config.Button.margin;
      this.lblBack.setPosition(left + Config.Button.size / 2, top - labelMargin);
      this.btnBack.setPosition(left, top);
    }
  },

  canvasWillPaint: function(context) {
    // Set the player indicator
    this.playerIndicator.onRenderExtra = function(context) {
      var r = Math.floor(this.playerIndicator.width / 2);
      context.drawStone(this.chessboard.isBlackPlaying(), 0, 0, r);
    }.bind(this);

    // Draw the background
    context.save();
    context.fillStyle = Config.Canvas.fill;
    context.fillRect(0, 0, this.width, this.height);
    context.restore();
  },

  canvasDidPaint: function(context) {
    console.log("- canvas painted");
  },

  initChildren: function() {
    // Home menu and chess board
    this.menu = new Menu(0, 0);
    this.menu.onClose = function(blackBotEnabled, whiteBotEnabled) {
      this.showMenu(false);
      if (blackBotEnabled != null && whiteBotEnabled != null) {
        // Arguments are null if the close button is clicked
        this.chessboard.reset(blackBotEnabled, whiteBotEnabled);
      }
    }.bind(this);

    // The main chessboard
    this.chessboard = new Chessboard(Config.Canvas.padding, Config.Canvas.padding);

    var btnSize = Config.Button.size;

    // Panel: current player indicator
    this.playerIndicator = new Panel(0, 0, btnSize, btnSize);

    // Button: menu button
    this.btnMenu = new Button(0, 0, btnSize, btnSize);
    this.btnMenu.onRenderExtra.push(function(context) {
      context.beginPath();

      // Horizontal line
      context.antiFuzzyLine(btnSize / 4, parseInt(btnSize * 0.3), btnSize - btnSize / 4, parseInt(btnSize * 0.3));
      context.antiFuzzyLine(btnSize / 4, parseInt(btnSize * 0.5), btnSize - btnSize / 4, parseInt(btnSize * 0.5));
      context.antiFuzzyLine(btnSize / 4, parseInt(btnSize * 0.7), btnSize - btnSize / 4, parseInt(btnSize * 0.7));

      context.strokeStyle = "#000";
      context.stroke();
    });
    this.btnMenu.onClick = function() {
      this.showMenu(true);
    }.bind(this);

    // Button: history back
    this.btnBack = new Button(0, 0, btnSize, btnSize);
    this.btnBack.onRenderExtra.push(function(context) {
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
      this.chessboard.back();
    }.bind(this);

    // Labels
    this.lblCurrent = new Label(0, 0, 'Player');
    this.lblCurrent.setHorizontalAlign('center');
    this.lblCurrent.setVerticalAlign('bottom');

    this.lblMenu = new Label(0, 0, 'Menu');
    this.lblMenu.setHorizontalAlign('center');
    this.lblMenu.setVerticalAlign('bottom');

    this.lblBack = new Label(0, 0, 'Back');
    this.lblBack.setHorizontalAlign('center');
    this.lblBack.setVerticalAlign('bottom');
  },

  showMenu: function(show) {
    this.menu.setVisible(show);

    // Only show close button when chessdata is not ready
    this.menu.showCloseButton(this.chessboard.chessData != null)

    this.chessboard.setEnabled(!show);
    this.btnBack.setEnabled(!show);
  }
}

var App = CanvasApp.extend(app_prototype);

var app = null;
addEventListener("load", function() {
  app = new App();
});
