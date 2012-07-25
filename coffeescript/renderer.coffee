{Entity, EventsDispatcher} = Game

{Ticker, Stage, Container, Bitmap} = @createjs


class Game.Scene extends Game.EventsDispatcher
  initialize: (canvasDOM) ->
    @stage = new Stage canvasDOM
    @background = new Container
    @terrain = new Container
    @layers = {}
    @stage.addChild @background
    @stage.addChild @terrain
    Ticker.addListener @render
    Ticker.setFPS 30

  addEntity: (entity, container) ->
    if container?
      container.addChild entity.sprite
      return entity
    @stage.addChild entity.sprite
    entity

  addLayer: (name) ->
    @layers[name] = new Container
    @stage.addChild @getLayer name
    this

  getLayer: (name) ->
    @layers[name]

  pause: ->
    Ticker.setPaused true
    this

  play: ->
    Ticker.setPaused false
    this

  render: =>
    do @stage.update
    do @update
    this

  setBackground: (image) ->
    return unless image?
    @background.addChild new Bitmap image
    return

  setTerrain: (image) ->
    return unless image?
    @terrain.addChild new Bitmap image
    return

  update: -> return
