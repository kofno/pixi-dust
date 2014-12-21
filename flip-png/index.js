var Game = (function(PIXI) {

  function Game() {
    this.sprite = new PIXI.Sprite.fromImage('sheesh.png');
    this.stage = new PIXI.Stage(0xFFFFFF);
    this.renderer = PIXI.autoDetectRenderer(600, 400);
    this.container = new PIXI.DisplayObjectContainer();

    this.stage.addChild(this.container);
    document.body.appendChild(this.renderer.view);
    this.configureSprite(this.sprite);
    this.placeSprite(this.sprite);

    this.animate();
  }

  Game.prototype.animate = function() {
    requestAnimFrame(this.animate.bind(this));

    if (this.sprite.scaleFactor) {
      this.sprite.scale.x += this.sprite.scaleFactor;
      if (Math.abs(this.sprite.scale.x) >= 1) {
        this.sprite.scaleFactor = 0;
        this.sprite.scale.x = Math.sign(this.sprite.scale.x) * 1;
      }
    }

    this.renderer.render(this.stage);
  }

  Game.prototype.placeSprite = function(sprite) {
    this.container.addChild(sprite);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;

    sprite.position.x = 300;
    sprite.position.y = 200;

    return sprite;
  }

  Game.prototype.configureSprite = function(sprite) {
    sprite.buttonMode = true;
    sprite.interactive = true;
    sprite.scaleFactor = 0;
    sprite.mousedown = sprite.touchstart = this.flipSprite;
  }

  Game.prototype.flipSprite = function() {
    if (!this.scaleFactor) {
      this.scaleFactor = Math.sign(this.scale.x) * -0.05;
    }
  }

  function configureSprite(sprite) {
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;

    sprite.position.x = 300;
    sprite.position.y = 200;
  }

  return Game;

})(PIXI);

var game = new Game();
