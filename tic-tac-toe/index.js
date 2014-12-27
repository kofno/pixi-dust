var Game = (function(PIXI, R) {

  function Game() {
    this.loader           = new PIXI.AssetLoader(['sprites.json']);
    this.stage            = new PIXI.Stage(0xffffff);
    this.renderer         = PIXI.autoDetectRenderer(640, 960);
    this.container        = new PIXI.DisplayObjectContainer();
    this.startGameButtons = [];
  }

  Game.prototype.run = function() {
    this.stage.addChild(this.container);
    document.body.appendChild(this.renderer.view);

    this.loader.on('onComplete', this.onAssetsLoaded.bind(this));
    this.loader.load();
  }

  Game.prototype.onAssetsLoaded = function() {
    this.addTitleBar();
    this.initializeButtonTextures();
    this.addGameBoard();
    this.addStartGameButtons();

    requestAnimFrame(this.animate.bind(this));
  }

  Game.prototype.animate = function() {
    this.renderer.render(this.stage);

    requestAnimFrame(this.animate.bind(this));
  }

  Game.prototype.addTitleBar = function() {
    var titleBar = PIXI.Sprite.fromImage('TitleBar.png');
    titleBar.position.x = 59;
    titleBar.position.y = 30;

    this.container.addChild(titleBar);
  }

  Game.prototype.initializeButtonTextures = function() {
    this.buttonTextures = {
      blank : new PIXI.Texture.fromImage('BlankPiece.png'),
      X     : new PIXI.Texture.fromImage('XPiece.png'),
      O     : new PIXI.Texture.fromImage('OPiece.png')
    }
  }

  Game.prototype.addPlayAsOButton = function() {
    var playAsO = PIXI.Sprite.fromImage('PlayAsO.png');
    playAsO.interactive = true;
    playAsO.buttonMode  = true;
    playAsO.position.x  = 59;
    playAsO.position.y  = 695 + 64 + 45;

    playAsO.mousedown = playAsO.touchstart = function() {
      this.aiX = true;
      this.turn = "X";
      this.removeGameStartButtons();

      setTimeout(function() {
        var moveIdx = Logic.nextMoveIndex(this.turn, this.gameState());
        this.clickMove(this.buttons[moveIdx]);
      }.bind(this), 1000);
    }.bind(this)

    this.container.addChild(playAsO);

    return playAsO;
  }

  Game.prototype.addPlayAsXButton = function() {
    var playAsX = PIXI.Sprite.fromImage('PlayAsX.png');
    playAsX.interactive = true;
    playAsX.buttonMode  = true;
    playAsX.position.x  = 59;
    playAsX.position.y  = 695;

    playAsX.mousedown = playAsX.touchstart = function() {
      this.aiO  = true;
      this.turn = "X";
      this.removeGameStartButtons();
    }.bind(this)

    this.container.addChild(playAsX);

    return playAsX;
  }

  Game.prototype.addStartGameButtons = function() {
    this.startGameButtons.push(this.addPlayAsXButton());
    this.startGameButtons.push(this.addPlayAsOButton());
  }

  Game.prototype.removeGameStartButtons = function() {
    R.forEach(function(button) {
      this.container.removeChild(button);
    }.bind(this), this.startGameButtons);
    this.startGameButtons = [];
  }

  Game.prototype.addGameBoard = function() {
    this.buttons = R.map(function(i) {
      var button = this.addGridButton(i);
      this.container.addChild(button);
      return button;
    }.bind(this), R.range(0, 9));
  }

  Game.prototype.addGridButton = function(i) {
    var hIndex = i % 3;
    var vIndex = Math.floor(i/3);
    var button = new PIXI.Sprite(this.buttonTextures.blank);

    button.interactive = true;
    button.buttonMode  = true;
    button.position.x  = (hIndex * (144 + 45)) + 59;
    button.position.y  = (vIndex * (144 + 45)) + 140;
    button.theValue    = null;

    button.mousedown = button.touchstart = this.onMoveClicked.bind(this)

    return button;
  }

  Game.prototype.onMoveClicked = function(event) {
    if (this.canMove(event.target)) {
      this.clickMove(event.target);
    }
  }

  Game.prototype.clickMove = function(button) {
    button.setTexture(this.buttonTextures[this.turn]);
    button.theValue    = this.turn;
    button.interactive = false;
    button.buttonMode  = false;

    if (this.gameIsOver()) {
      this.endGame()
    } else {
      this.turn = toggleTurn(this.turn);
      if (this.aiTurn()) {
        setTimeout(function() {
          var moveIdx = Logic.nextMoveIndex(this.turn, this.gameState());
          this.clickMove(this.buttons[moveIdx])
        }.bind(this), 1000)
      }
    }
  }

  Game.prototype.gameIsOver = function() {
    var state = this.gameState();

    return (
      Logic.xWins(state) ||
        Logic.oWins(state) ||
        Logic.tie(state)
    );
  }

  Game.prototype.endGame = function() {
    this.turn = null;

    // A winner you

    // Play again?
  }

  Game.prototype.gameState = function() {
    return R.pluck('theValue', this.buttons);
  }

  Game.prototype.canMove = function(button) {
    return (
      this.turn &&
        !button.theValue &&
        !this.aiTurn()
    );
  }

  Game.prototype.aiTurn = function() {
    return (
      (this.turn == "X" && this.aiX) ||
        (this.turn == "O" && this.aiO)
    );
  }

  Game.prototype.aiMove = function() {
    var moveIdx = Logic.nextMoveIndex(this.turn, this.gameState());
    this.clickMove(this.buttons[moveIdx]);
  }

  function toggleTurn(turn) {
    return turn == "X" ? "O" : "X";
  }

  return Game;

})(PIXI, R);

var game = new Game();
game.run();
