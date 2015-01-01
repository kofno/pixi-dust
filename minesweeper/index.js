var Game = (function() {
  function Game() {
  }

  Game.prototype.run = function() {
    console.log("I was running...");
  }

  return Game;

})();

var game = new Game("the-game");
game.run();
