{EventsDispatcher, HexTile} = Game
{Ticker, Stage, Container, SpriteSheet, BitmapAnimation, Tween} = @createjs

class Game.Entity extends EventsDispatcher
  initialize: ->
    @tileX = 0
    @tileY = 0
    @sprite = new Container()
    @walkDuration = 1000
    @height = 0
    do @onSpawn

  send: ->
    @trigger.apply this, arguments
    this

  attack: ->
    do @onAttack
    this

  die: ->
    do @onDie
    this

  face: (leftOrRight) ->
    if leftOrRight?
      @sprite.scaleX = if leftOrRight is "left" then -1 else 1
      return this
    else
      if @sprite.scaleX is -1 then "left" else "right"

  sheetData: (sheetData) ->
    return unless sheetData?
    spriteSheet = new SpriteSheet sheetData
    animation = new BitmapAnimation spriteSheet

    animation.onAnimationEnd = (a, label) =>
      @onAnimationEnd label, a

    @reg = (x, y) ->
      animation.regX = x
      animation.regY = y

    @pause = ->
      animation.paused = true

    @play = (frameOrLabel) ->
      if frameOrLabel?
        animation.gotoAndPlay frameOrLabel
      else
        do animation.play

    @stop = (frameOrLabel) ->
      if frameOrLabel?
        animation.gotoAndStop frameOrLabel
      else
        do animation.stop

    @totalFrames = -> do spriteSheet.getNumFrames

    @spriteSheet = spriteSheet
    @animation = animation

    @sprite.addChild animation
    @stop 0
    do @onSheetData
  
  walk: ->
    return unless arguments.length > 0
    if arguments[0] instanceof Array
      @walkList.apply this, arguments
    else
      @walkTo.apply this, arguments
    return this

  # @params
  # - list:Array - a list of arrays with proprties {x, y}
  # - walkDuration:int
  # tells the unit to move around the respective hexagon tiles
  walkList: (points, walkDuration = @walkDuration) ->
    tween = Tween.get @sprite
    for point, i in points
      do =>
        [x, y] = point
        nextPoint = points[i + 1]
        hex = HexTile.position x, y, true
        tween = tween.to {x: hex.x, y: hex.y}, walkDuration
        tween = tween.call =>
          @tileX = x
          @tileY = y
          if nextPoint?
            nextHex = HexTile.position nextPoint[0], nextPoint[1], true
            if nextHex.x > hex.x then @face 'right' else @face 'left'
    tween = tween.call =>
      do @onWalkEnd if walkDuration > 0
      @trigger 'walkEnd'
    do @onWalk if walkDuration > 0

  # @params x:int, y:int, walkDuration:int
  # Tells the unit to immediate move to the target hexagon tile
  walkTo: (x, y, walkDuration = @walkDuration) ->
    hex = HexTile.position x, y, true
    @tileX = x
    @tileY = y
    @sprite.x = hex.x
    @sprite.y = hex.y

  # entity events
  onAnimationEnd: -> return
  onSheetData: -> return
  onSpawn: -> return
  onWalk: -> return
  onWalkEnd: -> return
  onAttack: -> return
  onDie: -> return
