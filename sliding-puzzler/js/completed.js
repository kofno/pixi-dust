function Completed() {

  this.preload = function() {
    game.load.image('tryAgain', './assets/images/TryAgainButton.png');
  };

  this.create = function() {
    this.add.image(0, 0, 'solution');

    setTimeout(this.createTryAgainButton.bind(this), 2000);
  };

  this.createTryAgainButton = function() {
    this.add.button(game.world.centerX, game.world.centerY, 'tryAgain',
                    this.tryAgain, this);
  };

  this.tryAgain = function() {
    this.state.start('Picker');
  };

}
