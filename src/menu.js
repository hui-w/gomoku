/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Home Menu
 */
var menu_prototype = {
  onClose: null,
  btnWidth: null,
  btnHeight: null,
  btn1: null,
  btn2: null,
  btn3: null,

  init: function(left, top) {
    this._super(left, top);

    // Init the value
    this.onClose = null;
    this.btnWidth = 150;
    this.btnHeight = 32;

    this.onRenderExtra.push(this.renderMask);

    // Human vs Human
    this.btn1 = new Button(0, 0, 150, 32, 'button1');
    this.btn1.setText('Human vs. Human');
    this.btn1.onClick = function() {
      this.triggerOnClose(false, false);
    }.bind(this);
    this.addChild(this.btn1);

    // Human vs Robot
    this.btn2 = new Button(0, 0, 150, 32, 'button2');
    this.btn2.setText('Human vs. Robot');
    this.btn2.onClick = function() {
      this.triggerOnClose(false, true);
    }.bind(this);
    this.btn2.onRenderExtra.push(function(context) {
      // White stone on the right side
      context.drawStone(false, 150 - 20 - 6, 6, 10);
    });
    this.addChild(this.btn2);

    // Robot vs Human
    this.btn3 = new Button(0, 0, 150, 32, 'button3');
    this.btn3.setText('Robot vs. Human');
    this.btn3.onClick = function() {
      this.triggerOnClose(true, false);
    }.bind(this);
    this.btn3.onRenderExtra.push(function(context) {
      // Black stone on the left side
      context.drawStone(true, 6, 6, 10);
    });
    this.addChild(this.btn3);

    // Robot vs Robot
    this.btn4 = new Button(0, 0, 150, 32, 'button4');
    this.btn4.setText('Robot vs. Robot');
    this.btn4.onClick = function() {
      this.triggerOnClose(true, true);
    }.bind(this);
    this.btn4.onRenderExtra.push(function(context) {
      // Black stone on the left side
      context.drawStone(true, 6, 6, 10);
    });
    this.btn4.onRenderExtra.push(function(context) {
      // White stone on the right side
      context.drawStone(false, 150 - 20 - 6, 6, 10);
    });
    this.addChild(this.btn4);

    this.onSizeChanged = this.sizeChangedHandler;
  },

  sizeChangedHandler: function(width, height) {
    var cLeft = width / 2 - this.btnWidth / 2;
    var cTop = height / 2 - 2.6 * this.btnHeight;

    this.btn1.setPosition(cLeft, cTop);
    cTop += this.btnHeight * 1.4;
    this.btn2.setPosition(cLeft, cTop);
    cTop += this.btnHeight * 1.4;
    this.btn3.setPosition(cLeft, cTop);
    cTop += this.btnHeight * 1.4;
    this.btn4.setPosition(cLeft, cTop);
    cTop += this.btnHeight * 1.4;
  },

  renderMask: function(context) {
    context.fillStyle = "RGBA(0, 0, 0, 0.5)";
    context.fillRect(0, 0, this.width - 0, this.height - 0);
  },

  triggerOnClose: function(blackBotEnabled, whiteBotEnabled) {
    if (typeof this.onClose == 'function') {
      this.onClose(blackBotEnabled, whiteBotEnabled);
    }
  }
}

var Menu = Component.extend(menu_prototype);
