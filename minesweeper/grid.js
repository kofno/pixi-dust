var Grid = (function() {

  // emptyGrid :: Int -> Int -> [[String]]
  function emptyGrid(x, y) {
    var grid = [];

    for (var i = 0; i < x; i++)
      grid.push(Array(y));

    return grid;
  }

  // mineGrid :: Int -> [[String]] -> [[String]]
  function mineGrid(count, grid) {
    var dimX = grid.length,
        dimY = grid[0].length;

    for (var i = 0; i < count; i++) {
      layMine(grid);
    }

    return grid;
  }

  // layMine :: [[String]] -> [[String]]
  function layMine(grid) {
    var x, y;

    x = randomInt(grid.length);
    y = randomInt(grid[0].length);

    if (!grid[x][y])
      grid[x][y] = "X";
    else
      layMine(grid);

    return grid;
  }

  // placeHints :: [[String]] -> [[String]]
  function placeHints(grid) {
    grid.forEach(function(row, x) {
      (row || []).forEach(function(cell, y) {
        if (mine(cell)) {
          placeHint(grid, [x, y]);
        }
      });
    })

    return grid;
  }

  // placeHint :: [[String]] -> [Int, Int] -> [[String]]
  function placeHint(grid, coord) {
    var x = coord[0],
        y = coord[1]
    ;

    if (!mine(get(grid, coord))) return;

    applyToGrid(grid, [x-1, y], add1)
    applyToGrid(grid, [x+1, y], add1)

    applyToGrid(grid, [x, y-1], add1)
    applyToGrid(grid, [x, y+1], add1)

    applyToGrid(grid, [x-1, y-1], add1)
    applyToGrid(grid, [x+1, y-1], add1)
    applyToGrid(grid, [x-1, y+1], add1)
    applyToGrid(grid, [x+1, y+1], add1)

    return grid;
  }

  // mine :: String -> Bool
  function mine(val) {
    return val == "X";
  }

  // get :: [[String]] -> [Int, Int] -> Maybe(Value)
  function get(grid, coords) {
    var row = grid[coords[0]];
    if (row)
      return row[coords[1]];
    else
      return undefined
  }

  // applyToGrid :: [[String]] -> [Int, Int] -> Void
  function applyToGrid(grid, coord, fn) {
    var x = coord[0],
        y = coord[1]
    ;

    if (grid[x] && !mine(grid[x][y])) {
      grid[x][y] = fn(grid[x][y]);
    }
  }

  // add1 :: Maybe(n) -> Int
  function add1(n) {
    return 1+(n || 0);
  }

  // randomInt :: Int -> Int
  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  return {
    emptyGrid: emptyGrid,
    layMine: layMine,
    mineGrid: mineGrid,
    placeHints: placeHints,
    placeHint: placeHint
  };

})();
