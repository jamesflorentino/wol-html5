{Entity, Units} = Game

randomIdle = (seconds = 2) ->
  Math.random() * seconds * 1000


class Units.Marine extends Entity
  onSheetData:->
    @play 'idleIn'
    @reg 0, 8
    @walkDuration = 500
    @height = 40
    @spriteSheet.getAnimation('onMoveStart').next = 'onMove'

  onAnimationEnd: (label, animation) ->
    {spriteSheet} = animation
    prevent @timeout
    switch label
      when 'idleIn' then @play 'idleOut'
      when 'idleOut'
        @stop 'idleIn'
        @timeout = after 4000, => @play 'idleIn'
      when 'onMoveStart' then @play 'onMove'
      #when 'onMove' then @play 'onMove'
      when 'onMoveEnd' then @play 'idleIn'
      when 'onRifleShotStart' then @play 'onRifleShot1'
      when 'onRifleShot1' then @play 'onRifleShot2'
      when 'onRifleShot2' then @play 'onRifleShot3'
      when 'onRifleShot3' then @play 'onRifleShot4'
      when 'onRifleShot4' then @play 'onRifleShotEnd'
      when 'onRifleShotEnd' then @play 'idleIn'
      #else @stop animation.currentFrame + spriteSheet.getNumFrames(label)

  onWalk: -> @play 'onMoveStart'

  onWalkEnd: -> @play 'onMoveEnd'

  onAttack: ->
    @play 'onRifleShotStart'

class Units.Vanguard extends Entity
  onSheetData: ->
    @stop 0
    @reg 25, 15
    @walkDuration = 1800

  onAnimationEnd: (label, animation) ->
    {spriteSheet} = animation
    switch label
      when 'walkStart' then @play 'walk'
      when 'walk'
        @play 'walkEnd' unless @walking
      when 'walkEnd' then @stop 0
      when 'attackStart' then @play 'attack1'
      when 'attack1' then @play 'attack2'
      when 'attack2' then @stop 0
      when 'onDieStart' then @stop 'onDieStart'
      #else @stop animation.currentFrame + spriteSheet.getNumFrames(label) - 1

  onWalk: ->
    @walking = true
    @play 'walkStart'

  onWalkEnd: ->
    @walking = false
    #@play 'walkEnd'
  
  onAttack: ->
    @play 'attackStart'

  onDie: -> @play 'death'
