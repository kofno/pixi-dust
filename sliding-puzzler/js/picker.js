function Picker() {
  'use strict';

  var pictureSrcs = [
    "./assets/images/bobcats.jpg",
    "./assets/images/cheetah.jpg",
    "./assets/images/redchair.jpg",
    "./assets/images/pup.jpg",
    "./assets/images/recycled.png",
    "./assets/images/snarl.jpg"
  ];

  var thumbWidth  = 200;
  var thumbHeight = 150;

  var rowsPerPage = 2;
  var colsPerPage = 3;

  this.preload = function() {
    game.load.spritesheet('thumbs', './assets/images/thumbs.png',
                          thumbWidth, thumbHeight);
  };

  this.create = function() {
    this.createImageButtons();
    this.createText();
  };

  this.createText = function() {
    var text = game.add.text(game.world.centerX, 500,
                             "Click to Choose a Puzzle");
    text.anchor.set(0.5);
    text.align = "center";
    text.font = 'Arial';
    text.fontWeight = 'bold';
    text.fontSize = 60;
    text.fill = this.createTextGradient(text);
  };

  this.createTextGradient = function(text) {
    var gradient = text.context.createLinearGradient(0, 0, 0, text.height);
    gradient.addColorStop(0, '#8ED6FF');
    gradient.addColorStop(1, '#004CB3');
    return gradient;
  };

  this.createImageButtons = function() {
    var thumbsGroup = game.add.group();
    var thumb;

    var currentThumb = 0;
    for (var row = 0; row < rowsPerPage; row++) {
      for (var col = 0; col < colsPerPage; col++) {
        var left = 50 + (thumbWidth * col) + (50 * col);
        var top  = 50 + (thumbHeight * row) + (50 * row);

        thumb = thumbsGroup.create(left, top, 'thumbs', currentThumb);
        thumb.inputEnabled = true;
        thumb.events.onInputDown.add(this.launchPuzzle, this);
        thumb.input.useHandCursor = true;
        thumb.puzzleSrc = pictureSrcs[currentThumb++];
      }
    }
  };

  this.launchPuzzle = function(source) {
    this.state.start('Puzzle', true, false, source.puzzleSrc);
  };
}
