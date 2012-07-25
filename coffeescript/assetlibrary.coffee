{EventsDispatcher} = Game

class Game.AssetLibrary extends EventsDispatcher
  initialize: (options) ->
    @loader = new PreloadJS()
    @manifest = []
    @assets = []

  complete: (callback) ->
    @on 'complete', callback

  get: (id) ->
    @assets[id] or @loader.getResult(id)?.result

  preload: ->
    @loader.onComplete = => @trigger 'complete'
    @loader.loadManifest @manifest

  add: (id, resource) ->
    if resource instanceof HTMLImageElement
      @assets[id] = resource
    else
      @manifest.push id: id, src: resource
    this

  remove: -> return
