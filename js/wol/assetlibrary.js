// Generated by CoffeeScript 1.3.3
(function() {
  var EventsDispatcher,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventsDispatcher = Game.EventsDispatcher;

  Game.AssetLibrary = (function(_super) {

    __extends(AssetLibrary, _super);

    function AssetLibrary() {
      return AssetLibrary.__super__.constructor.apply(this, arguments);
    }

    AssetLibrary.prototype.initialize = function(options) {
      this.loader = new PreloadJS();
      this.manifest = [];
      return this.assets = [];
    };

    AssetLibrary.prototype.complete = function(callback) {
      return this.on('complete', callback);
    };

    AssetLibrary.prototype.get = function(id) {
      var _ref;
      return this.assets[id] || ((_ref = this.loader.getResult(id)) != null ? _ref.result : void 0);
    };

    AssetLibrary.prototype.preload = function() {
      var _this = this;
      this.loader.onComplete = function() {
        return _this.trigger('complete');
      };
      return this.loader.loadManifest(this.manifest);
    };

    AssetLibrary.prototype.add = function(id, resource) {
      if (resource instanceof HTMLImageElement) {
        this.assets[id] = resource;
      } else {
        this.manifest.push({
          id: id,
          src: resource
        });
      }
      return this;
    };

    AssetLibrary.prototype.remove = function() {};

    return AssetLibrary;

  })(EventsDispatcher);

}).call(this);
