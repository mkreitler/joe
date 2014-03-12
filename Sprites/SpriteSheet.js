joe.SpriteSheet = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  // Instance Definition //////////////////////////////////////////////////////
  srcImage: null,
  rows: 0,
  cols: 0,
  spriteWidth: 0,
  spriteHeight: 0,
  alignX: 0,
  alignY: 0,

  init: function(srcImage, rows, cols, alignX, alignY) {
    this.srcImage = srcImage;
    this.rows = Math.max(1, rows);
    this.cols = Math.max(1, cols);
    this.spriteWidth = Math.round(this.srcImage.width / this.cols);
    this.spriteHeight = Math.round(this.srcImage.height / this.rows);
    this.setAlignment(alignX, alignY);
  },

  setAlignment: function(alignX, alignY) {
    this.alignX = typeof(alignX) === 'undefined' ? 0 : alignX;
    this.alignY = typeof(alignY) === 'undefined' ? 0 : alignY;
  },

  getCellWidth: function() {
    return this.spriteWidth;
  },

  getCellHeight: function() {
    return this.spriteHeight;
  },

  draw: function(gfx, x, y, row, col) {
    var index = row;

    if (typeof(col) === 'undefined') {
      // Interpret the 'row' as a pure index.
      row = Math.floor(index / this.cols);
      col = index % this.cols;
    }

    joe.assert(row >= 0 && row < this.rows, "Rows = " + this.rows);
    joe.assert(typeof(col) === 'undefined' || (col >= 0 && col < this.cols));
    joe.assert(gfx);


    gfx.drawImage(this.srcImage, col * this.spriteWidth, row * this.spriteHeight, this.spriteWidth, this.spriteHeight,
                  Math.round(x - this.alignX * this.spriteWidth), Math.round(y - this.alignY * this.spriteHeight), this.spriteWidth, this.spriteHeight);
  }
});
