# Generates a new UUID
uniqueId = (length=8) ->
  id = ""
  id += Math.random().toString(36).substr(2) while id.length < length
  id.substr 0, length

# Deep copy of an object
clone = (obj) ->
  if not obj? or typeof obj isnt 'object'
    return obj
  if obj instanceof Date
    return new Date(obj.getTime())
  if obj instanceof RegExp
    flags = ''
    flags += 'g' if obj.global?
    flags += 'i' if obj.ignoreCase?
    flags += 'm' if obj.multiline?
    flags += 'y' if obj.sticky?
    return new RegExp(obj.source, flags)
  newInstance = new obj.constructor()
  for key of obj
    newInstance[key] = clone obj[key]
  return newInstance

@after = (ms, cb) -> setTimeout cb, ms
@prevent = (timeout) -> clearTimeout timeout
@every = (ms, cb) -> setInterval cb, ms
@finish = (interval) -> clearInterval interval

@Utils =
  uniqueId: uniqueId
  clone: clone
  after: after
  every: every
