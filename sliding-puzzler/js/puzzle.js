"use strict";

function Puzzle() {

  this.init = function(imageSrc) {
    this.puzzleSrc = imageSrc;
  };

  this.preload = function() {
    game.load.spritesheet(
      "puzzle",
      this.puzzleSrc,
      pieceWidth,
      pieceHeight
    );

    game.load.image('solution', this.puzzleSrc);
  };

  this.create = function() {
    prepareBoard();
  };

  /*
   *  Private
   */

  var pieceWidth  = 200;
  var pieceHeight = 200;
  var piecesGroup;

  function prepareBoard() {
    var piecesIndex = 0,
        piece
      ;

    var boardCols = Phaser.Math.floor(game.world.width /  pieceWidth);
    var boardRows = Phaser.Math.floor(game.world.height / pieceHeight);

    var piecesAmount = boardCols * boardRows;
    var shuffledIndexArray = createShuffledIndexArray(piecesAmount);

    piecesGroup = game.add.group();

    for (var i = 0; i < boardRows; i++) {
      for (var j = 0; j < boardCols; j++) {
        if (shuffledIndexArray[piecesIndex]) {
          piece = piecesGroup.create(j * pieceWidth, i * pieceHeight, 'puzzle', shuffledIndexArray[piecesIndex]);
        }
        else {
          piece = piecesGroup.create(j * pieceWidth, i * pieceHeight);
          piece.black = true;
        }
        piece.name = 'piece' + i.toString() + 'x' + j.toString();
        piece.currentIndex = piecesIndex;
        piece.destIndex = shuffledIndexArray[piecesIndex];
        piece.inputEnabled = true;
        piece.events.onInputDown.add(selectPiece, this);
        piece.posX = j;
        piece.posY = i;
        piecesIndex++;
      }
    }
  }

  function selectPiece(piece) {
    var blackPiece = canMove(piece);

    if (blackPiece) {
      movePiece(piece, blackPiece);
    }
  }

  function movePiece(piece, blackPiece) {
    var tmpPiece = {
      posX: piece.posX,
      posY: piece.posY,
      currentIndex: piece.currentIndex
    };

    game.add.tween(piece).to({
      x: blackPiece.posX * pieceWidth,
      y: blackPiece.posY * pieceHeight
    }, 300, Phaser.Easing.Linear.None, true);

    piece.posX = blackPiece.posX;
    piece.posY = blackPiece.posY;
    piece.currentIndex = blackPiece.currentIndex;
    piece.name ='piece' + piece.posX.toString() + 'x' + piece.posY.toString();

    blackPiece.posX = tmpPiece.posX;
    blackPiece.posY = tmpPiece.posY;
    blackPiece.currentIndex = tmpPiece.currentIndex;
    blackPiece.name ='piece' + blackPiece.posX.toString() + 'x' + blackPiece.posY.toString();

    checkIfFinished();
  }

  function createShuffledIndexArray(piecesAmount) {
    var indexArray = [];

    for (var i = 0; i < piecesAmount; i++) {
      indexArray.push(i);
    }

    return shuffle(indexArray);
  }

  function shuffle(array) {
    var counter = array.length,
      temp,
      index
      ;

    while (counter > 0) {
      index = Math.floor(Math.random() * counter);

      counter--;

      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  function canMove(piece) {
    var blackElemFound = false;

    piecesGroup.children.forEach(function(element) {
      if (element.posX === (piece.posX -1) && element.posY === piece.posY && element.black ||
        element.posX === (piece.posX +1) && element.posY === piece.posY && element.black ||
        element.posY === (piece.posY -1) && element.posX === piece.posX && element.black ||
        element.posY === (piece.posY +1) && element.posX === piece.posX && element.black) {
        blackElemFound = element;
      }
    });

    return blackElemFound;
  }

  function checkIfFinished() {
    var isFinished = piecesGroup.children.reduce(function(memo, value) {
      if (value.currentIndex != value.destIndex) {
        return false;
      }
      else {
        return memo;
      }
    }, true);

    if (isFinished) {
      game.state.start('Completed');
    }
  }

}
