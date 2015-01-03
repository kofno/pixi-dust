var Game = (function() {

  function Game(el) {
    this.el        = document.getElementById(el);
    this.loader    = new PIXI.AssetLoader(['sprites.json']);
    this.stage     = new PIXI.Stage(0x888888);
    this.renderer  = PIXI.autoDetectRenderer(255, 255);
    this.container = new PIXI.DisplayObjectContainer();
    this.grid      = buildGrid();
  }

  Game.prototype.run = function() {
    this.stage.addChild(this.container);

    (this.el || document.body).appendChild(this.renderer.view);

    this.loader.on('onComplete', this.onAssetsLoaded.bind(this));
    this.loader.load();
  }

  Game.prototype.pickTexture = function(coords) {
    if (PS.Grid.isHintAt(this.grid)(coords)) {
      var value = PS.Grid.valueAt(this.grid)(coords);
      return this.textures['hint' + value.value0.value0];
    } else if (PS.Grid.isMineAt(this.grid)(coords)) {
      return this.textures.bomb;
    } else {
      return this.textures.open;
    }
  }

  Game.prototype.handleReveal = function(data) {
    var button = data.target;
    button.interactive = false;
    button.buttonMode = false;
    button.setTexture(this.pickTexture(button.theCoords));
  }

  Game.prototype.handleFlag = function(data) {
    var button = data.target;
    if (button.flagged) {
      button.setTexture(this.textures.cell);
      button.flagged = false;
    } else {
      button.setTexture(this.textures.flag);
      button.flagged = true;
    }
    return false;
  }

  Game.prototype.buildGrid = function() {
    for (var x = 0; x < 100; x++) {
      for (var y = 0; y < 100; y++) {
        var button         = new PIXI.Sprite(this.textures.cell);
        button.interactive = true;
        button.buttonMode  = true;
        button.position.x  = (25 * (x % 10)) + 5;
        button.position.y  = (25 * (Math.floor(x / 10))) + 5;
        button.theCoords   = new PS.Grid.Coords((x % 10) + 1, Math.floor(x / 10) + 1);

        button.mousedown = this.handleReveal.bind(this);
        button.rightdown = this.handleFlag.bind(this);
        this.container.addChild(button);
      }
    }
  }

  Game.prototype.onAssetsLoaded = function() {
    this.initializeTextures();
    this.buildGrid();

    requestAnimFrame(this.animate.bind(this));
  }

  Game.prototype.animate = function() {
    this.renderer.render(this.stage);

    requestAnimFrame(this.animate.bind(this));
  }

  Game.prototype.initializeTextures = function() {
    this.textures = {
      cell  : new PIXI.Texture.fromImage('Cell.png'),
      flag  : new PIXI.Texture.fromImage('Flag.png'),
      bomb  : new PIXI.Texture.fromImage('ExposedBomb.png'),
      open  : new PIXI.Texture.fromImage('ExposedCell.png'),
      hint1 : new PIXI.Texture.fromImage('Hint1.png'),
      hint2 : new PIXI.Texture.fromImage('Hint2.png'),
      hint3 : new PIXI.Texture.fromImage('Hint3.png'),
      hint4 : new PIXI.Texture.fromImage('Hint4.png'),
      hint5 : new PIXI.Texture.fromImage('Hint5.png'),
      hint6 : new PIXI.Texture.fromImage('Hint6.png'),
      hint7 : new PIXI.Texture.fromImage('Hint7.png'),
      hint8 : new PIXI.Texture.fromImage('Hint8.png')
    }
  }

  function buildGrid() {
    var dims = new PS.Grid.Dimensions(10, 10);
    return PS.Grid.newGrid(dims)(10)();
  }

  return Game;

})();

var game = new Game("the-game");
game.run();

// Don't display the canvas context menu
var canvas = document.getElementsByTagName('canvas')[0]
if (canvas) {
  canvas.oncontextmenu = function(event) {
    event.preventDefault();
    return false;
  }
}
