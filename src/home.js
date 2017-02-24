/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Home Menu
 */
var home_prototype = {
  onHide: null,
  btnWidth: null,
  btnHeight: null,
  btn1: null,
  btn2: null,
  btn3: null,

  init: function(left, top) {
    this._super(left, top);

    // Init the value
    this.onHide = null;
    this.btnWidth = 150;
    this.btnHeight = 32;

    this.onRenderExtra.push(this.renderMask);

    this.btn1 = new Button(0, 0, 150, 32, 'button1');
    this.btn1.setText('Human vs. Human');
    this.btn1.onClick = function() {
      console.log('Button1 clicked');
      this.triggerOnHide();
    }.bind(this);
    this.addChild(this.btn1);

    this.btn2 = new Button(0, 0, 150, 32, 'button2');
    this.btn2.setText('Human vs. Robot');
    this.btn2.onClick = function() {
      console.log('Button2 clicked');
      this.triggerOnHide();
    }.bind(this);
    this.addChild(this.btn2);

    this.btn3 = new Button(0, 0, 150, 32, 'button3');
    this.btn3.setText('Robot vs. Human');
    this.btn3.onClick = function() {
      console.log('Button3 clicked');
      this.triggerOnHide();
    }.bind(this);
    this.addChild(this.btn3);

    this.onSizeChanged = this.sizeChangedHandler;
  },

  sizeChangedHandler: function(width, height) {
    this.btn1.setPosition((width - this.btnWidth) / 2, height / 2 - 1.5 * this.btnHeight);
    this.btn2.setPosition((width - this.btnWidth) / 2, height / 2);
    this.btn3.setPosition((width - this.btnWidth) / 2, height / 2 + 1.5 * this.btnHeight);
  },

  renderMask: function(context) {
    context.fillStyle = "RGBA(0, 0, 0, 0.5)";
    context.fillRect(0, 0, this.width - 0, this.height - 0);
  },

  triggerOnHide: function() {
    if (typeof this.onHide == 'function') {
      this.onHide();
    }
  }
}

var Home = Component.extend(home_prototype);
