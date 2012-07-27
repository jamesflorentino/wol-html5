class Game.HexTile
  @WIDTH: 83
  @HEIGHT: 56
  @OFFSETX: 42
  @OFFSETY: 14
  @EAST: 'east'
  @WEST: 'west'
  @SOUTHEAST: 'southEast'
  @NORTHEAST: 'northEast'
  @SOUTHWEST: 'southWest'
  @NORTHWEST: 'northWest'

  @deltaX: (direction, isOddRow, index = 1, i = 0) ->
    result = 0
    switch direction
      when @EAST
        result += (if isOddRow then Math.floor(i * 0.5) * -1 else Math.ceil(i * 0.5) * -1) + index
      when @WEST
        result += (if isOddRow then Math.ceil(i * 0.5) else Math.floor(i * 0.5)) - index
      when @SOUTHEAST
        result += (if isOddRow then Math.ceil(index * 0.5) else Math.floor(index * 0.5)) - i
      when @NORTHEAST
        result += Math.floor(index * 0.5) + i - Math.floor(i * 0.5)
        if isOddRow
          result++ if index % 2 and (index + i) % 2
        else
          result-- if index % 2 is 0 and (index + i) % 2
      when @SOUTHWEST
        result -= Math.ceil(index * 0.5) + i - Math.ceil(i * 0.5)
        if isOddRow
          result++ if index % 2 and (index + i) % 2
        else
          result-- if index % 2 is 0 and (index + i) % 2
      when @NORTHWEST
        result += (if isOddRow then Math.ceil(index * -0.5) else Math.floor(index * -0.5)) + i
    return result

  @deltaY: (direction, isOddRow, index = 1, i = 0) ->
    result = 0
    switch direction
      when @EAST then (result += i)
      when @WEST then (result += i * -1)
      when @SOUTHEAST then (result += index)
      when @SOUTHWEST then (result += index - i)
      when @NORTHEAST then (result += (index * -1) + i)
      when @NORTHWEST then (result += index * -1)
    return result

  @delta: (centerX, centerY, direction, isOddRow, index) ->
    result = []
    for i in [1..index]
      result.push
        x: centerX + @deltaX(direction, isOddRow, index, i - 1)
        y: centerY + @deltaY(direction, isOddRow, index, i - 1)
    return result

  @adjacent: (centerX, centerY, radius = 1) ->
    adjacentTiles = []
    isOddRow = centerY % 2 > 0

    for i in [1..radius]
      east = @delta centerX, centerY, @EAST, isOddRow, i
      adjacentTiles = adjacentTiles.concat east

      west = @delta centerX, centerY, @WEST, isOddRow, i
      adjacentTiles = adjacentTiles.concat west

      southEast = @delta centerX, centerY, @SOUTHEAST, isOddRow, i
      adjacentTiles = adjacentTiles.concat southEast

      northEast= @delta centerX, centerY, @NORTHEAST, isOddRow, i
      adjacentTiles = adjacentTiles.concat northEast

      southWest = @delta centerX, centerY, @SOUTHWEST, isOddRow, i
      adjacentTiles = adjacentTiles.concat southWest

      northWest = @delta centerX, centerY, @NORTHWEST, isOddRow, i
      adjacentTiles = adjacentTiles.concat northWest

    return adjacentTiles

  # @position
  # x: <int> -> the tileX property
  # y: <int> -> the tileY property
  # center: <boolean> -> to indiciate if we need to get the center value
  @position: (x, y, center) ->
    x: (x * (@WIDTH)) + (if y % 2 then @OFFSETX else 0) + (if center then @WIDTH * 0.5 else 0)
    y: (y * (@HEIGHT - @OFFSETY)) + (if center then @HEIGHT * 0.5 else 0)
