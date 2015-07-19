/*
  TODOS
  -----
   * Refactor code (clean up globals, use a Game state, extract long methods into shorter methods, etc.)
   * Add a GameStart and GameOver state
   * Add a PuzzlePicker state to allow users to select from several puzzle images
   * Add more puzzles (kid friendly)
   * Publish to pixi-dust

 */

'use strict';

var game;
game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('Menu', Menu);
game.state.add('Picker', Picker);
game.state.add('Puzzle', Puzzle);
game.state.add('Completed', Completed);

game.state.start('Menu');
