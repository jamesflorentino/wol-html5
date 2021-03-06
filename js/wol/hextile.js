// Generated by CoffeeScript 1.3.3
(function() {

  Game.HexTile = (function() {

    function HexTile() {}

    HexTile.WIDTH = 83;

    HexTile.HEIGHT = 56;

    HexTile.OFFSETX = 42;

    HexTile.OFFSETY = 14;

    HexTile.EAST = 'east';

    HexTile.WEST = 'west';

    HexTile.SOUTHEAST = 'southEast';

    HexTile.NORTHEAST = 'northEast';

    HexTile.SOUTHWEST = 'southWest';

    HexTile.NORTHWEST = 'northWest';

    HexTile.deltaX = function(direction, isOddRow, index, i) {
      var result;
      if (index == null) {
        index = 1;
      }
      if (i == null) {
        i = 0;
      }
      result = 0;
      switch (direction) {
        case this.EAST:
          result += (isOddRow ? Math.floor(i * 0.5) * -1 : Math.ceil(i * 0.5) * -1) + index;
          break;
        case this.WEST:
          result += (isOddRow ? Math.ceil(i * 0.5) : Math.floor(i * 0.5)) - index;
          break;
        case this.SOUTHEAST:
          result += (isOddRow ? Math.ceil(index * 0.5) : Math.floor(index * 0.5)) - i;
          break;
        case this.NORTHEAST:
          result += Math.floor(index * 0.5) + i - Math.floor(i * 0.5);
          if (isOddRow) {
            if (index % 2 && (index + i) % 2) {
              result++;
            }
          } else {
            if (index % 2 === 0 && (index + i) % 2) {
              result--;
            }
          }
          break;
        case this.SOUTHWEST:
          result -= Math.ceil(index * 0.5) + i - Math.ceil(i * 0.5);
          if (isOddRow) {
            if (index % 2 && (index + i) % 2) {
              result++;
            }
          } else {
            if (index % 2 === 0 && (index + i) % 2) {
              result--;
            }
          }
          break;
        case this.NORTHWEST:
          result += (isOddRow ? Math.ceil(index * -0.5) : Math.floor(index * -0.5)) + i;
      }
      return result;
    };

    HexTile.deltaY = function(direction, isOddRow, index, i) {
      var result;
      if (index == null) {
        index = 1;
      }
      if (i == null) {
        i = 0;
      }
      result = 0;
      switch (direction) {
        case this.EAST:
          result += i;
          break;
        case this.WEST:
          result += i * -1;
          break;
        case this.SOUTHEAST:
          result += index;
          break;
        case this.SOUTHWEST:
          result += index - i;
          break;
        case this.NORTHEAST:
          result += (index * -1) + i;
          break;
        case this.NORTHWEST:
          result += index * -1;
      }
      return result;
    };

    HexTile.delta = function(centerX, centerY, direction, isOddRow, index) {
      var i, result, _i;
      result = [];
      for (i = _i = 1; 1 <= index ? _i <= index : _i >= index; i = 1 <= index ? ++_i : --_i) {
        result.push({
          x: centerX + this.deltaX(direction, isOddRow, index, i - 1),
          y: centerY + this.deltaY(direction, isOddRow, index, i - 1)
        });
      }
      return result;
    };

    HexTile.adjacent = function(centerX, centerY, radius) {
      var adjacentTiles, east, i, isOddRow, northEast, northWest, southEast, southWest, west, _i;
      if (radius == null) {
        radius = 1;
      }
      adjacentTiles = [];
      isOddRow = centerY % 2 > 0;
      for (i = _i = 1; 1 <= radius ? _i <= radius : _i >= radius; i = 1 <= radius ? ++_i : --_i) {
        east = this.delta(centerX, centerY, this.EAST, isOddRow, i);
        adjacentTiles = adjacentTiles.concat(east);
        west = this.delta(centerX, centerY, this.WEST, isOddRow, i);
        adjacentTiles = adjacentTiles.concat(west);
        southEast = this.delta(centerX, centerY, this.SOUTHEAST, isOddRow, i);
        adjacentTiles = adjacentTiles.concat(southEast);
        northEast = this.delta(centerX, centerY, this.NORTHEAST, isOddRow, i);
        adjacentTiles = adjacentTiles.concat(northEast);
        southWest = this.delta(centerX, centerY, this.SOUTHWEST, isOddRow, i);
        adjacentTiles = adjacentTiles.concat(southWest);
        northWest = this.delta(centerX, centerY, this.NORTHWEST, isOddRow, i);
        adjacentTiles = adjacentTiles.concat(northWest);
      }
      return adjacentTiles;
    };

    HexTile.position = function(x, y, center) {
      return {
        x: (x * this.WIDTH) + (y % 2 ? this.OFFSETX : 0) + (center ? this.WIDTH * 0.5 : 0),
        y: (y * (this.HEIGHT - this.OFFSETY)) + (center ? this.HEIGHT * 0.5 : 0)
      };
    };

    return HexTile;

  })();

}).call(this);
