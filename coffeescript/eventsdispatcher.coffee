class Game.EventsDispatcher
  constructor: ->
    _.extend this, Backbone.Events
    @initialize.apply this, arguments

  initialize: -> return
