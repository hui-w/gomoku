var Class = {
  // Class.create仅仅返回另外一个函数，此函数执行时将调用原型方法initialize
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
};

// 对象的扩展
Object.extend = function(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
};


var Person = Class.create();
Person.prototype = {
  initialize: function(name) {
    this.name = name;
  },
  getName: function(prefix) {
    return prefix + this.name;
  }
};

var Employee = Class.create();
Employee.prototype = Object.extend(new Person(), {
  initialize: function(name, employeeID) {
    this.name = name;
    this.employeeID = employeeID;
  },
  getName: function() {
    return "Employee name: " + this.name;
  }
});


var zhang = new Employee("ZhangSan", "1234");
console.log(zhang.getName()); // "Employee name: ZhangSan"


// http://www.cnblogs.com/sanshi/archive/2009/07/15/1524263.html
