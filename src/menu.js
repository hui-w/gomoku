/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Home Menu
 */
var menu_prototype = {
  onClose: null,
  padding: null,
  showClose: null,
  btn1: null,
  btn2: null,
  btn3: null,
  btn4: null,

  init: function(left, top) {
    this._super(left, top);

    // Init the value
    this.onClose = null;
    this.padding = {
      h: 35,
      v: 25
    };

    this.onRenderExtra.push(this.renderMask);
    this.onRenderExtra.push(this.renderBorder);

    // Human vs Human
    this.btn1 = new Button(0, 0, Config.Menu.buttonWidth, Config.Menu.buttonHeight, 'button1');
    this.btn1.setText('Human vs. Human');
    this.btn1.setRadius(8);
    this.btn1.onClick = function() {
      this.triggerOnClose(false, false);
    }.bind(this);
    this.addChild(this.btn1);

    // Human vs Robot
    this.btn2 = new Button(0, 0, Config.Menu.buttonWidth, Config.Menu.buttonHeight, 'button2');
    this.btn2.setText('Human vs. Robot');
    this.btn2.setRadius(8);
    this.btn2.onClick = function() {
      this.triggerOnClose(false, true);
    }.bind(this);
    this.btn2.onRenderExtra.push(function(context) {
      // White stone on the right side
      context.drawStone(false, 160 - 20 - 6, 6, 10);
    });
    this.addChild(this.btn2);

    // Robot vs Human
    this.btn3 = new Button(0, 0, Config.Menu.buttonWidth, Config.Menu.buttonHeight, 'button3');
    this.btn3.setText('Robot vs. Human');
    this.btn3.setRadius(8);
    this.btn3.onClick = function() {
      this.triggerOnClose(true, false);
    }.bind(this);
    this.btn3.onRenderExtra.push(function(context) {
      // Black stone on the left side
      context.drawStone(true, 6, 6, 10);
    });
    this.addChild(this.btn3);

    // Robot vs Robot
    this.btn4 = new Button(0, 0, Config.Menu.buttonWidth, Config.Menu.buttonHeight, 'button4');
    this.btn4.setText('Robot vs. Robot');
    this.btn4.setRadius(8);
    this.btn4.onClick = function() {
      this.triggerOnClose(true, true);
    }.bind(this);
    this.btn4.onRenderExtra.push(function(context) {
      // Black stone on the left side
      context.drawStone(true, 6, 6, 10);
    });
    this.btn4.onRenderExtra.push(function(context) {
      // White stone on the right side
      context.drawStone(false, 160 - 20 - 6, 6, 10);
    });
    this.addChild(this.btn4);

    // Close button
    this.btnClose = new Button(0, 0, 20, 20);
    this.btnClose.setRadius(2);
    this.btnClose.onClick = function() {
      this.triggerOnClose();
    }.bind(this);
    this.btnClose.onRenderExtra.push(function(context) {
      context.beginPath();
      context.moveTo(4, 4);
      context.lineTo(16, 16);
      context.moveTo(16, 4);
      context.lineTo(4, 16);
      context.strokeStyle = "RGB(255, 0, 0)";
      context.stroke();
    });
    this.addChild(this.btnClose);

    // When size changed, re-position the buttons
    this.onSizeChanged = this.sizeChangedHandler;
  },

  sizeChangedHandler: function(width, height) {
    var cLeft = width / 2 - Config.Menu.buttonWidth / 2;
    var cTop = height / 2 - 2.6 * Config.Menu.buttonHeight;

    this.btnClose.setPosition(
      cLeft + Config.Menu.buttonWidth + this.padding.h - 24,
      cTop - this.padding.v + 4
    );

    this.btn1.setPosition(cLeft, cTop);
    cTop += Config.Menu.buttonHeight * 1.4;
    this.btn2.setPosition(cLeft, cTop);
    cTop += Config.Menu.buttonHeight * 1.4;
    this.btn3.setPosition(cLeft, cTop);
    cTop += Config.Menu.buttonHeight * 1.4;
    this.btn4.setPosition(cLeft, cTop);
    cTop += Config.Menu.buttonHeight * 1.4;
  },

  showCloseButton: function(show) {
    this.btnClose.setVisible(show);
  },

  renderMask: function(context) {
    context.fillStyle = "RGBA(0, 0, 0, 0.5)";
    context.fillRect(0, 0, this.width - 0, this.height - 0);
  },

  renderBorder: function(context) {
    var height = Config.Menu.buttonHeight * (4 + 0.4 * 3) + this.padding.v * 2;
    var left = this.width / 2 - Config.Menu.buttonWidth / 2 - this.padding.h;
    var top = this.height / 2 - height / 2;
    var width = Config.Menu.buttonWidth + this.padding.h * 2;

    // Main dialog
    context.beginPath();
    context.rect(left, top, width, height);
    context.strokeStyle = "RGBA(0, 0, 0, 1)";
    context.fillStyle = "RGBA(255, 255, 255, 0.8)";
    context.stroke();
    context.fill();
  },

  triggerOnClose: function(blackBotEnabled, whiteBotEnabled) {
    if (typeof this.onClose == 'function') {
      this.onClose(blackBotEnabled, whiteBotEnabled);
    }
  }
}

var Menu = Component.extend(menu_prototype);
