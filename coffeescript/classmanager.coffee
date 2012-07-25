class Game.ClassManager
  constructor: ->
    @classObjects = {}

  register: (name, classObject) ->
    @classObjects[name] = classObject

  create: (name) ->
    classObject = @classObjects[name]
    return unless classObject?
    new classObject()
