// Generated by CoffeeScript 1.3.3
(function() {

  Game.ClassManager = (function() {

    function ClassManager() {
      this.classObjects = {};
    }

    ClassManager.prototype.register = function(name, classObject) {
      return this.classObjects[name] = classObject;
    };

    ClassManager.prototype.create = function(name) {
      var classObject;
      classObject = this.classObjects[name];
      if (classObject == null) {
        return;
      }
      return new classObject();
    };

    return ClassManager;

  })();

}).call(this);