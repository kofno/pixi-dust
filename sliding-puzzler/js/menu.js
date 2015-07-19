function Menu() {
  'use strict';

  this.preload = function() {
    game.load.image('menu', './assets/images/menu.png');
  };

  this.create = function() {
    this.add.button(0, 0, 'menu', this.startGame, this);
  };

  this.startGame = function() {
    this.state.start('Picker');
  };
}
