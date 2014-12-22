var Game = (function(PIXI) {

  function Game() {
    this.loader = new PIXI.AssetLoader(['sprites.json']);
    this.stage = new PIXI.Stage(0x888888);
    this.renderer = PIXI.autoDetectRenderer(640, 480);
    this.gameContainer = new PIXI.DisplayObjectContainer();

    this.canPick = true;
    this.firstTile = null;
    this.secondTile = null;
  }

  Game.prototype.run = function() {
    this.stage.addChild(this.gameContainer);
    document.body.appendChild(this.renderer.view);

    this.loader.on('onComplete', this.onTilesLoaded.bind(this));
    this.loader.load();
  }

  Game.prototype.onTilesLoaded = function() {
    sample = _.sample(_.range(1, 40), 24)
    tiles = _.shuffle(sample.concat(sample));

    _.each(tiles, this.renderTile.bind(this));
    requestAnimFrame(this.animate.bind(this));
  }

  Game.prototype.renderTile = function(tileId, index) {
    var frameId = tileId + "_64x64.png";
    var tile = PIXI.Sprite.fromFrame(frameId);

    tile.buttonMode = true;
    tile.interactive = true;
    tile.isSelected = false;
    tile.theVal = tileId;

    tile.position.x = 7 + column(index) * 80;
    tile.position.y = 7 + row(index) * 80;

    tile.tint = 0x000000;
    tile.alpha = 0.5;

    this.gameContainer.addChild(tile);
    tile.mousedown = tile.touchstart = this.handleTileSelection();
  }

  Game.prototype.animate = function() {
    requestAnimFrame(this.animate.bind(this));
    this.renderer.render(this.stage);
  }

  Game.prototype.handleTileSelection = function() {
    var game = this;
    return function() {
      if (game.canPick) {
        if (!this.isSelected) {
          this.isSelected = true;
          this.tint = 0xffffff;
          this.alpha = 1;
          if (!game.firstTile) {
            game.firstTile = this;
          } else {
            game.secondTile = this;
            game.canPick = false;
            if (match(game.firstTile, game.secondTile)) {
              setTimeout(game.removeTiles.bind(game), 1000);
            } else {
              setTimeout(game.coverTiles.bind(game), 1000);
            }
          }
        }
      }
    }
  }

  Game.prototype.removeTiles = function() {
    this.removeTile(this.firstTile);
    this.firstTile = null;

    this.removeTile(this.secondTile);
    this.secondTile = null;

    this.canPick = true;
  }

  Game.prototype.removeTile = function(tile) {
    this.gameContainer.removeChild(tile);
  }

  Game.prototype.coverTiles = function() {
    deselectTile(this.firstTile);
    this.firstTile = null;

    deselectTile(this.secondTile);
    this.secondTile = null;

    this.canPick = true;
  }

  function match(firstTile, secondTile) {
    return firstTile.theVal === secondTile.theVal;
  }

  function deselectTile(tile) {
    tile.isSelected = false;
    tile.tint = 0x000000;
    tile.alpha = 0.5;
  }

  function row(i) {
    return Math.floor(i / 8);
  }

  function column(i) {
    return i % 8;
  }

  return Game;
})(PIXI);

var game = new Game();
game.run();
