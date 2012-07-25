#######################################
# Wings Of Lemuria in HTML5
# author: James O. Florentino
# email: j@jamesflorentino.com
# twitter: @jamesflorentino
#########################################################

{Scene, EventsDispatcher, Entity, Units, HexTile} = Game
{AssetLibrary, ClassManager, SheetData} = Game

{Shape, Ticker, Ease, Tween, Container, SpriteSheet, SpriteSheetUtils, Bitmap} = createjs
#========================================================

# TEST PARTICLES
class Vector
  speed: 10
  time: 0

class Particle
  originX: 0
  originY: 0
  speed: 10
  time: 0
  constructor: (image) ->
    @index = null
    @texture = new Bitmap image
    @texture.regX = image.naturalWidth * 0.5
    @texture.regY = image.naturalHeight * 0.5
    @texture.scaleX = @texture.scaleY = Math.random()
    @setOrigin 0, 0
    @speed = 10 * Math.PI / 180
    @time = new Date().getTime()  * Math.random()
    @randomTime = @time

  die: ->
    @complete = true

  followEntity: (@entity) ->

  setOrigin: (x, y) ->
    @originX = x
    @originY = y

  update: ->
    if @entity?
      @setOrigin @entity.sprite.x, @entity.sprite.y + 40
    @texture.x = @originX + Math.sin(@randomTime) * 40
    @texture.y = @originY + Math.cos(@time) * 20
    @time += @speed


  x: (x) ->
    @texture.x = x if x?
    @texture.x

  y: (y) ->
    @texture.y = y if y?
    @texture.y

#========================================================
class WingsOfLemuriaTactics
  constructor: ->
    canvas = document.querySelector 'canvas#game'
    canvas.height = 450
    @particles = []
    @scene = new Scene canvas
    @scene.update = @update
    do @scene.pause
    # set layers
    @scene.addLayer 'tiles'
    @scene.addLayer 'units'
    @scene.addLayer 'fx'

    @fxLayer = @scene.getLayer 'fx'
    @fxParticle = new Container
    @fade = new Shape
    @fxLayer.addChild @fade, @fxParticle
    @fade.graphics.beginFill('rgba(0,0,0,0.1)').drawRect 0, 0, canvas.width, canvas.height
    @fxLayer.addChild @fade
    @fxLayer.cache 0, 0, canvas.width, canvas.height

    # set coordinates
    @setTerrainPosition 5, 70
    @scene.terrain.x = 0

    # class manager's role is to handle all possible values for classes
    @classes = new ClassManager

    # the asset library will take care of our asset management
    @assets = new AssetLibrary
    @assets.add 'background', 'images/background.png'
    @assets.add 'terrain', 'images/terrain.png'
    @assets.add 'elements', 'images/elements.png'

    # when adding units
    # add marine
    @classes.register 'marine', Units.Marine
    @assets.add 'marine', 'images/marine.png'

    # add vanguard
    @classes.register 'vanguard', Units.Vanguard
    @assets.add 'vanguard', 'images/vanguard.png'

    # other events
    @assets.complete @assetsReady
    do @assets.preload
    return

  addUnit: (code, attributes) =>
    asset = @assets.get code
    sheetData = SheetData.get code, asset
    entity = @classes.create code
    entity.sheetData sheetData
    @scene.getLayer('units').addChild entity.sprite
    entity

  addParticle: (unit, name = 'shield') ->
    particles = []
    image = @assets.get name
    for i in [0..10]
      particle = new Particle image
      particle.index = i
      particle.followEntity unit
      @particles.push particle
      particles.push particle
      @fxParticle.addChild particle.texture
    particles

  assetsReady: =>
    spriteSheet = new SpriteSheet SheetData.elements(@assets.get 'elements')
    assetNames = do spriteSheet.getAnimations
    for assetName in assetNames
      @assets.add assetName, SpriteSheetUtils.extractFrame spriteSheet, assetName
    # add the background and terrain to the scene with coordinates
    @scene.setBackground @assets.get('background')
    @scene.setTerrain @assets.get('terrain')
    do @setScene
    do @testUnit

  generateGrid: ->
    rows =  7
    columns = 8
    container = new Container
    image = @assets.get 'hex_bg'
    # generate the grid
    for row in [0..rows]
      for column in [0..columns]
        bitmap = new Bitmap image
        tilePosition = HexTile.position column, row
        bitmap.x = tilePosition.x
        bitmap.y = tilePosition.y
        container.addChild bitmap
    @scene.getLayer('tiles').addChild container

  moveUnit: (unit, tiles) ->
    hexTiles = @showTiles [[unit.tileX, unit.tileY]].concat(tiles)
    tileLayer = @scene.getLayer 'tiles'
    for hexTileImage, i in hexTiles
      Tween.get(hexTileImage)
        .wait(unit.walkDuration * i)
        .to((alpha: 0, scaleX: 1.5, scaleY: 1.5), 600)
        .call(-> tileLayer.removeChild this)
    unit.walk tiles

  setScene: ->
    do @generateGrid
    do @scene.play
    this

  setTerrainPosition: (x, y) ->
    @scene.terrain.y = @scene.getLayer('tiles').y = @scene.getLayer('units').y = y
    @scene.terrain.x = @scene.getLayer('tiles').x = @scene.getLayer('units').x = x

  showTiles: (tiles, assetName = 'hex_target') ->
    image = @assets.get assetName
    container = @scene.getLayer 'tiles'
    hexTiles = []
    for tile in tiles
      [x, y] = tile
      bitmap = new Bitmap image
      tilePosition = HexTile.position x, y, true
      bitmap.x = tilePosition.x
      bitmap.y = tilePosition.y
      bitmap.regX = HexTile.WIDTH * 0.5
      bitmap.regY = HexTile.HEIGHT * 0.5
      container.addChild bitmap
      hexTiles.push bitmap
    hexTiles

  testUnit: ->
    column = 0
    row = 1
    unit = @addUnit 'marine'
    tiles = [
      [1, 1]
      [2, 1]
      [3, 1]
      [4, 1]
    ]
    unit.walk column, row
    @moveUnit unit, tiles
    particles = @addParticle unit, 'shield'
    unit.on 'walkEnd', ->
      return
      for particle in particles
        do particle.die

  # generate a bunch of units for benchmarking
  testUnits: ->
    rows = 7
    columns = 8
    units = ['marine', 'vanguard']
    for row in [0..rows]
      for column in [0..columns]
        unit = @addUnit units[Math.round(Math.random() * (units.length - 1))]
        unit.walk column, row
        unit.play Math.round(Math.random() * (unit.totalFrames() - 1))
        unit.face 'left' if Math.random() > 0.5

  update: =>
    i = 0
    while i < @particles.length
      particle = @particles[i]
      do particle.update
      if particle.complete
        @particles.splice @particles.indexOf(particle), 1
        @fxLayer.removeChild particle.texture
        i--
      i++
    @fade.visible = !(@fxParticle.visible = false)
    @fxLayer.updateCache 'source-over'
    @fade.visible = !(@fxParticle.visible = true)
    @fxLayer.updateCache 'lighter'


#========================================================
window.onload = ->
  game = new WingsOfLemuriaTactics
