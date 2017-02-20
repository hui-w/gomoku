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
    this.renderExtra.push(this.renderMask);

    var btn = new Button(100, 50, 150, 32, 'button1');
    btn.setText('Human vs. Human');
    btn.onClick = function() {
      console.log('Button clicked');
    };
    this.addChild(btn);
  },

  renderMask: function(self, context) {
    context.fillStyle = "RGBA(0, 0, 0, 0.5)";
    context.fillRect(0, 0, self.width - 0, self.height - 0);
  }
}
