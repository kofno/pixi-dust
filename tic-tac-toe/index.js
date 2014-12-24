var Game = (function(PIXI, R) {

  var children = R.memoize(function(turn, move) {
    return R.foldlIndexed(generateChild(turn), [], move);
  });

  function nextMove(turn, move) {
    var index = bestMove(turn, move);
    return children(turn, move)[index];
  }

  function bestMove(turn, move) {
    var ss = scores(turn, move);
    return eqX(turn) ? R.indexOf(R.max(ss), ss) : R.indexOf(R.min(ss), ss);
  }

  var generateChild = R.curry(function generateChild(turn, accum, val, index, move) {
    if (!val) {
      var child = move.slice(0);
      child[index] = turn;
      accum.push(child);
    }
    return accum;
  });

  var score = R.curry(function(turn, multiplier, move) {
    // Make winning on the next move most valuable
    if (xWins(move)) return [ 1 * multiplier];
    if (oWins(move)) return [-1 * multiplier];
    if (tie(move))   return [ 0 * multiplier];

    // Dimish the value of future wins
    return R.flatten(R.map(score(toggle(turn), 1), children(toggle(turn), move)));
  });

  function scores(turn, move) {
    return R.map(sum5, R.map(score(turn, 10), Game.children(turn, move)));
  }

  function xWins(move) {
    return (
      R.any(allX, rows(move)) ||
        R.any(allX, columns(move)) ||
        R.any(allX, diagnals(move))
    );
  }

  function oWins(move) {
    return (
      R.any(allO, rows(move)) ||
        R.any(allO, columns(move)) ||
        R.any(allO, diagnals(move))
    );
  }

  // Assumes 'win' checks have already failed so board must be full.
  var tie = R.all(notNull);

  var eqX  = R.eq("X");
  var eqO  = R.eq("O");
  var allX = R.all(eqX);
  var allO = R.all(eqO);

  function notNull(value) {
    return value != null;
  }

  function rows(move) {
    return R.foldlIndexed(function(memo, val, i) {
      if (i % 3 == 0) {
        memo.push([val]);
      } else {
        memo[memo.length - 1].push(val);
      }
      return memo;
    }, [], move);
  }

  function columns(move) {
    return R.foldlIndexed(function(memo, val, i) {
      if (i < 3) {
        memo.push([val]);
      } else {
        memo[i % 3].push(val);
      }
      return memo;
    }, [], move);
  }

  function diagnals(move) {
    return [
      [move[0], move[4], move[8]],
      [move[2], move[4], move[6]]
    ];
  }

  var toggle = R.memoize(function(turn) {
    return (turn == "X" ? "O" : "X");
  });

  var sum = R.foldl(R.add, 0);
  var sum5 = R.compose(sum, R.take(5));

  var initialMove = function() {
    return [null, null, null,
            null, null, null,
            null, null, null];
  }

  return {
    initialMove : initialMove,
    children    : children,
    score       : score,
    xWins       : xWins,
    oWins       : oWins,
    tie         : tie,
    rows        : rows,
    columns     : columns,
    diagnals    : diagnals,
    sum         : sum,
    nextMove    : nextMove,
    scores      : scores
  };

})(PIXI, R);

console.log(Game.scores("X", []))
