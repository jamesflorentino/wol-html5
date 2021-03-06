// Generated by CoffeeScript 1.3.3
(function() {
  var Aura, Bitmap, Particle, Shield, Vector,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Bitmap = createjs.Bitmap;

  Vector = (function() {

    function Vector(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      return;
    }

    Vector.prototype.set = function(x, y) {
      this.x = x;
      this.y = y;
    };

    Vector.prototype.iAdd = function(vector) {
      this.x += vector.x;
      return this.y += vector.y;
    };

    Vector.prototype.iSub = function(vector) {
      this.x -= vector.x;
      return this.y -= vector.y;
    };

    return Vector;

  })();

  Particle = (function() {

    function Particle(texture, entity) {
      this.texture = texture;
      this.entity = entity;
      this.position = new Vector(0, 0);
      this.acceleration = new Vector(0, 0);
      this.velocity = new Vector(0, 0);
      this.life = new Vector(15, 15);
      this.time = new Vector(0, 0);
      this.complete = false;
      if (this.texture != null) {
        this.bitmap = new Bitmap(this.texture);
      }
      if (this.spawn) {
        this.spawn();
      }
    }

    Particle.prototype.update = function() {
      this.life.x -= 0.033;
      if (this.life.x < 0) {
        this.complete = true;
        if (this.die != null) {
          return this.die(this);
        }
      }
    };

    Particle.prototype.remove = function() {};

    Particle.prototype.die = function() {};

    return Particle;

  })();

  Shield = (function(_super) {

    __extends(Shield, _super);

    function Shield() {
      return Shield.__super__.constructor.apply(this, arguments);
    }

    Shield.prototype.spawn = function() {
      this.velocity.set(Math.random() * 100, Math.random() * 100);
      this.acceleration.set(0.15, 0.05);
      this.bitmap.scaleX = this.bitmap.scaleY = Math.max(0.25, Math.random() * 0.5);
      return this.life.set(3, 3);
    };

    Shield.prototype.update = function() {
      this.position.x = this.entity.sprite.x + Math.sin(this.velocity.x) * 40;
      this.position.y = this.entity.sprite.y + this.entity.height + Math.cos(this.velocity.y) * 20;
      this.velocity.iAdd(this.acceleration);
      this.bitmap.x = this.position.x;
      return this.bitmap.y = this.position.y;
    };

    return Shield;

  })(Particle);

  Aura = (function(_super) {

    __extends(Aura, _super);

    function Aura() {
      return Aura.__super__.constructor.apply(this, arguments);
    }

    Aura.prototype.spawn = function() {
      this.velocity.set(Math.random() * 10, Math.random() * 100);
      this.acceleration.set(0.01, 3);
      this.bitmap.scaleX = this.bitmap.scaleY = Math.max(0.25, Math.random() * 0.5);
      return this.life.set(3, 3);
    };

    Aura.prototype.update = function() {
      this.position.x = this.entity.sprite.x + Math.sin(this.velocity.x) * 40;
      this.position.y = this.entity.sprite.y + this.entity.height - this.velocity.y;
      this.bitmap.x = this.position.x;
      this.bitmap.y = this.position.y;
      this.velocity.iAdd(this.acceleration);
      return Aura.__super__.update.apply(this, arguments);
    };

    return Aura;

  })(Particle);

  Game.Particles = (function() {

    function Particles() {
      this.children = [];
      this.classes = {};
      this.register('shield', Shield);
      this.register('aura', Aura);
    }

    Particles.prototype.create = function(name, asset, total, entity) {
      var classObject, i, particle, particles, _i;
      particles = [];
      if (total == null) {
        total = 1;
      }
      for (i = _i = 0; 0 <= total ? _i <= total : _i >= total; i = 0 <= total ? ++_i : --_i) {
        classObject = this.classes[name];
        particle = new classObject(asset, entity);
        particles.push(particle);
        this.children.push(particle);
      }
      return particles;
    };

    Particles.prototype.register = function(name, classObject) {
      return this.classes[name] = classObject;
    };

    Particles.prototype.update = function() {
      var i, particle, _results;
      i = 0;
      _results = [];
      while (particle = this.children[i]) {
        particle.update();
        if (particle.complete) {
          this.children.splice(this.children.indexOf(particle), 1);
          i--;
        }
        _results.push(i++);
      }
      return _results;
    };

    return Particles;

  })();

}).call(this);
