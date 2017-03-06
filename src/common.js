/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
function $() {
  var elements = new Array();
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string')
      element = document.getElementById(element);
    if (arguments.length == 1)
      return element;
    elements.push(element);
  }
  return elements;
}

Element.prototype.hasClassName = function(a) {
  return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className);
}

Element.prototype.addClassName = function(a) {
  if (!this.hasClassName(a)) {
    this.className = [this.className, a].join(" ");
  }
}

Element.prototype.removeClassName = function(b) {
  if (this.hasClassName(b)) {
    var a = this.className;
    this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ");
  }
}