// Generated by CoffeeScript 1.3.3
(function() {
  var getAdjacentHexes, getAdjacentPoints, getConeHexes, getEast, getHeuristics, getIntersectHexes, getLinearHexes, getNorthEast, getNorthWest, getSouthEast, getSouthWest, getWest, setBounds;

  getIntersectHexes = function(x, y, radius, gap) {
    var i, list, tiles;
    if (radius == null) {
      radius = 1;
    }
    if (gap == null) {
      gap = 0;
    }
    tiles = [];
    i = 1 + gap;
    while (i < radius + 1) {
      list = getEast(x, y, i, true);
      tiles = tiles.concat(list);
      list = getSouthEast(x, y, i, true);
      tiles = tiles.concat(list);
      list = getSouthWest(x, y, i, true);
      tiles = tiles.concat(list);
      list = getWest(x, y, i, true);
      tiles = tiles.concat(list);
      list = getNorthWest(x, y, i, true);
      tiles = tiles.concat(list);
      list = getNorthEast(x, y, i, true);
      tiles = tiles.concat(list);
      i++;
    }
    return tiles;
  };

  getConeHexes = function(x, y, radius, gap) {
    var i, list, tiles;
    if (radius == null) {
      radius = 1;
    }
    if (gap == null) {
      gap = 0;
    }
    tiles = [];
    i = 1 + gap;
    while (i < radius + 1) {
      list = getEast(x, y, i);
      tiles = tiles.concat(list);
      list = getSouthEast(x, y, i, true);
      tiles = tiles.concat(list);
      list = getSouthWest(x, y, i, false);
      tiles = tiles.concat(list);
      list = getWest(x, y, i, false);
      tiles = tiles.concat(list);
      list = getNorthWest(x, y, i, true);
      tiles = tiles.concat(list);
      list = getNorthEast(x, y, i);
      tiles = tiles.concat(list);
      i++;
    }
    return tiles;
  };

  getLinearHexes = function(x, y, radius, gap) {
    var i, list, tiles;
    if (radius == null) {
      radius = 1;
    }
    if (gap == null) {
      gap = 0;
    }
    tiles = [];
    i = 1 + gap;
    while (i < radius + 1) {
      list = getEast(x, y, i, true);
      tiles = tiles.concat(list);
      list = getWest(x, y, i, true);
      tiles = tiles.concat(list);
      i++;
    }
    return tiles;
  };

  getAdjacentHexes = function(x, y, radius, gap) {
    var i, list, tiles;
    if (radius == null) {
      radius = 1;
    }
    if (gap == null) {
      gap = 0;
    }
    tiles = [];
    i = 1 + gap;
    while (i < radius + 1) {
      list = getSouthEast(x, y, i);
      tiles = tiles.concat(list);
      list = getNorthEast(x, y, i);
      tiles = tiles.concat(list);
      list = getSouthWest(x, y, i);
      tiles = tiles.concat(list);
      list = getNorthWest(x, y, i);
      tiles = tiles.concat(list);
      list = getWest(x, y, i);
      tiles = tiles.concat(list);
      list = getEast(x, y, i);
      tiles = tiles.concat(list);
      i++;
    }
    return tiles;
  };

  getEast = function(x, y, radius, skipIteration) {
    var i, offsetX, tiles, xx, yy;
    tiles = [];
    i = 0;
    offsetX = radius * 0.5;
    offsetX = Math.floor(offsetX);
    while (i < radius) {
      yy = y + i;
      xx = x + radius - Math.ceil(i * 0.5);
      if (y % 2 && yy % 2 === 0) {
        xx++;
      }
      tiles.push({
        x: xx,
        y: yy
      });
      i++;
      if (skipIteration) {
        break;
      }
    }
    return tiles;
  };

  getWest = function(x, y, radius, skipIteration) {
    var i, offsetX, tiles, xx, yy;
    tiles = [];
    i = 0;
    offsetX = radius * 0.5;
    offsetX = Math.floor(offsetX);
    while (i < radius) {
      yy = y - i;
      xx = x - radius + Math.floor(i * 0.5);
      if (y % 2 && yy % 2 === 0) {
        xx++;
      }
      tiles.push({
        x: xx,
        y: yy
      });
      i++;
      if (skipIteration) {
        break;
      }
    }
    return tiles;
  };

  getNorthWest = function(x, y, radius, skipIteration) {
    var i, offsetX, tiles, xx, yy;
    tiles = [];
    i = 0;
    offsetX = radius * 0.5;
    offsetX = Math.ceil(offsetX);
    while (i < radius) {
      xx = x + i - offsetX;
      yy = y - radius;
      if (y % 2 && radius % 2) {
        xx++;
      }
      tiles.push({
        x: xx,
        y: yy
      });
      if (skipIteration) {
        break;
      }
      i++;
    }
    return tiles;
  };

  getSouthWest = function(x, y, radius, skipIteration) {
    var i, offsetX, tiles, xx, yy;
    tiles = [];
    i = 0;
    offsetX = radius * 0.5;
    offsetX = Math.ceil(offsetX);
    while (i < radius) {
      yy = y + radius - i;
      xx = x - i - offsetX + Math.ceil(i * 0.5);
      if (yy % 2 === 0 && y % 2 && radius % 2) {
        xx++;
      }
      if (radius % 2 === 0 && y % 2 === 0 && yy % 2) {
        xx--;
      }
      tiles.push({
        x: xx,
        y: yy
      });
      if (skipIteration) {
        break;
      }
      i++;
    }
    return tiles;
  };

  getNorthEast = function(x, y, radius, skipIteration) {
    var i, offsetX, tiles, xx, yy;
    tiles = [];
    i = 0;
    offsetX = radius * 0.5;
    offsetX = Math.floor(offsetX);
    while (i < radius) {
      yy = y - radius + i;
      xx = x + i + offsetX - Math.floor(i * 0.5);
      if (yy % 2 === 0 && y % 2 && radius % 2) {
        xx++;
      }
      if (radius % 2 === 0 && y % 2 === 0 && yy % 2) {
        xx--;
      }
      tiles.push({
        x: xx,
        y: yy
      });
      i++;
      if (skipIteration) {
        break;
      }
    }
    return tiles;
  };

  getSouthEast = function(x, y, radius, skipIteration) {
    var i, offsetX, tiles, xx, yy;
    tiles = [];
    i = 0;
    offsetX = radius * 0.5;
    offsetX = Math.floor(offsetX);
    while (i < radius) {
      xx = x - i + offsetX;
      yy = y + radius;
      if (y % 2 && radius % 2) {
        xx++;
      }
      tiles.push({
        x: xx,
        y: yy
      });
      i++;
      if (skipIteration) {
        break;
      }
    }
    return tiles;
  };

  getHeuristics = function(start, destination) {
    return Math.sqrt(Math.pow(start.x - destination.x, 2) + Math.pow(start.y - destination.y, 2));
  };

  getAdjacentPoints = function(origin) {
    return getAdjacentHexes(origin.x, origin.y);
  };

  setBounds = function(points, columns, rows) {
    var point, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      point = points[_i];
      if (point.x > -1 && point.y > -1 && point.x < columns && point.y < rows) {
        _results.push(point);
      }
    }
    return _results;
  };

  window.HexUtil = {
    getAdjacentHexes: getAdjacentHexes,
    getHeuristics: getHeuristics,
    getAdjacentPoints: getAdjacentPoints,
    setBounds: setBounds
  };

}).call(this);
