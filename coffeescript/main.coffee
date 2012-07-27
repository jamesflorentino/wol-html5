#######################################
# Wings Of Lemuria in HTML5
# author: James O. Florentino
# email: j@jamesflorentino.com
# twitter: @jamesflorentino
#########################################################

{Scene, EventsDispatcher, Entity, Units, HexTile, Particles, AssetLibrary, ClassManager, SheetData}  = Game
{Shape, Ticker, Ease, Tween, Container, SpriteSheet, SpriteSheetUtils, Bitmap} = createjs

#========================================================
class Settings
  constructor: ->
    @particles = false
    @particleEffects = false



#========================================================
class Game.WingsOfLemuriaTactics
  settings: new Settings

  constructor: ->
    canvas = document.querySelector 'canvas#game'
    canvas.height = 450
    @particles = new Particles
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
    @fade.graphics.beginFill('rgba(0,0,0,0.1)').drawRect(0, 0, canvas.width, canvas.height)
    @fxLayer.addChild @fade, @fxParticle
    @fxLayer.cache 0, 0, canvas.width, canvas.height
    #@fxLayer.compositeOperation = 'lighter'

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
    if tiles instanceof Array
      hexTiles = []
      _.each tiles, (tile) ->
        {x, y} = tile
        bitmap = new Bitmap image
        tilePosition = HexTile.position x, y, true
        bitmap.x = tilePosition.x
        bitmap.y = tilePosition.y
        bitmap.tileX = x
        bitmap.tileY = y
        bitmap.regX = HexTile.WIDTH * 0.5
        bitmap.regY = HexTile.HEIGHT * 0.5
        container.addChild bitmap
        hexTiles.push bitmap
      hexTiles

  testUnit: ->
    @settings.particles = true
    @settings.particleEffects = true
    unit = @addUnit 'marine'
    unit.walk 5, 0
    data =
      name: 'shield'
      asset: @assets.get 'shield'
      total: 10
      entity: unit
    particles = @particles.create(data.name, data.asset, data.total, data.entity)
    _.each particles, (particle) =>
      @fxParticle.addChild particle.bitmap
      particle.die = (me) => @fxParticle.removeChild me.bitmap
    return
    #==================================================
    tiles = HexTile.adjacent unit.tileX, unit.tileY, 2
    hexTiles = @showTiles tiles, 'hex_select'
    _.each hexTiles, (hexTile, i) ->
      hexTile.onClick = ->
        centerTile = hexTile
        {tileX, tileY} = centerTile
        adjacent = HexTile.adjacent tileX, tileY

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
    return
    if @settings.particles
      do @particles.update
      if @settings.particleEffects
        do @updateParticleFx

  updateParticleFx: ->
    @fade.visible = not @fxParticle.visible = false
    @fxLayer.updateCache 'destination-out'
    @fade.visible = not @fxParticle.visible = true
    @fxLayer.updateCache 'lighter'
