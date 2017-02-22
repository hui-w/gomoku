/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Home Menu
 */
function Home(left, top) {
  // Inherits all members from base class
  Component(this, left, top);

  // Initialize
  this.type = 'home';

  this.init();
}

Home.prototype = {
  init: function() {
    this.onRenderExtra.push(this.renderMask);

    var btn1 = new Button(100, 50, 150, 32, 'button1');
    btn1.setText('Human vs. Human');
    btn1.onClick = function() {
      console.log('Button1 clicked');
    };
    this.addChild(btn1);

    var btn2 = new Button(100, 100, 150, 32, 'button2');
    btn2.setText('Human vs. Robot');
    btn2.onClick = function() {
      console.log('Button2 clicked');
    };
    this.addChild(btn2);

    var btn3 = new Button(100, 150, 150, 32, 'button3');
    btn3.setText('Robot vs. Human');
    btn3.onClick = function() {
      console.log('Button3 clicked');
    };
    this.addChild(btn3);
  },

  renderMask: function(context) {
    context.fillStyle = "RGBA(0, 0, 0, 0.5)";
    context.fillRect(0, 0, this.width - 0, this.height - 0);
  }
}
