{Bitmap} = createjs

class Vector
  constructor: (@x = 0, @y = 0) -> return

  set: (@x, @y) -> return

  iAdd: (vector) ->
    @x += vector.x
    @y += vector.y
 
  iSub: (vector) ->
    @x -= vector.x
    @y -= vector.y

# =========================================================

class Particle

  constructor: (@texture, @entity) ->
    @position = new Vector 0, 0
    @acceleration = new Vector 0, 0
    @velocity = new Vector 0, 0
    @life = new Vector 15, 15
    @time = new Vector 0, 0
    @complete = false
    if @texture?
      @bitmap = new Bitmap @texture
    do @spawn if @spawn

  update: ->
    @life.x -= 0.033 # 33 ms
    if @life.x < 0
      @complete = true
      @die this if @die?

  remove: -> return

  die: -> return

# =========================================================

class Shield extends Particle

  spawn: ->
    @velocity.set Math.random() * 100, Math.random() * 100
    @acceleration.set 0.15, 0.05
    @bitmap.scaleX = @bitmap.scaleY = Math.max 0.25, Math.random() * 0.5
    @life.set 3, 3

  update: ->
    @position.x = @entity.sprite.x + Math.sin(@velocity.x) * 40
    @position.y = @entity.sprite.y + @entity.height + Math.cos(@velocity.y) * 20
    @velocity.iAdd @acceleration
    @bitmap.x = @position.x
    @bitmap.y = @position.y
    #super

class Aura extends Particle

  spawn: ->
    @velocity.set Math.random() * 10, Math.random() *  100
    @acceleration.set 0.01, 3
    @bitmap.scaleX = @bitmap.scaleY = Math.max 0.25, Math.random() * 0.5
    @life.set 3, 3

  update: ->
    @position.x = @entity.sprite.x + Math.sin(@velocity.x) * 40
    @position.y = @entity.sprite.y + @entity.height - @velocity.y
    @bitmap.x = @position.x
    @bitmap.y = @position.y
    @velocity.iAdd @acceleration
    super

# =========================================================

class Game.Particles

  constructor: ->
    @children = []
    @classes = {}
    @register 'shield', Shield
    @register 'aura', Aura
  
  # @name:    name of the particle targeted
  # @entity:  the reference entity to follow
  # @asset:   the resource image of the particle
  # @total:   total number of particle to generate
  create: (name, asset, total, entity) ->
    particles = []
    total ?= 1
    for i in [0..total]
      classObject = @classes[name]
      particle = new classObject asset, entity
      particles.push particle
      @children.push particle
    particles

  register: (name, classObject) ->
    @classes[name] = classObject


  update: ->
    i = 0
    while particle = @children[i]
      do particle.update
      if particle.complete
        @children.splice @children.indexOf(particle), 1
        i--
      i++

