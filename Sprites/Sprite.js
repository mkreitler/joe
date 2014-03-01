// 2D animated game object, possibly with a collision model. Usually rendered
// as part of a SpriteLayer object (see LayerSprite.js).

joe.Sprite = new joe.ClassEx({
  // Static definition ////////////////////////////////////////////////////////
},
{
  // Instance definition //////////////////////////////////////////////////////
  requires: [joe.kinematicObject, joe.physicsCollider],

  spriteSheet: null,
  align: {x:0, y:0},
  frameIndex: 0,
  zOrder: 0,
  sequencer: null,
  
  init: function(spriteSheet, frameIndex, alignX, alignY, x, y, vx, vy, ax, ay, blocksMask, blockedByMask, boundsFactorX, boundsFactorY) {
    var width = 0,
        height = 0;

    joe.assert(spriteSheet);

    this.spriteSheet = spriteSheet;
    this.spriteSheet.setAlignment(alignX, alignY);

    if (frameIndex instanceof joe.MathEx.Indexer) {
      this.sequencer = frameIndex;
      this.frameIndex = 0;
    }
    else {
      this.frameIndex = frameIndex || 0;
      this.sequencer = null;
    }

    this.kinInit(x, y, vx, vy, ax, ay);

    width = this.spriteSheet ? spriteSheet.getCellWidth() : 0;
    height = this.spriteSheet ? spriteSheet.getCellHeight() : 0;
    width = boundsFactorX ? width * boundsFactorX : width;
    height = boundsFactorY ? height * boundsFactorY : height;

    this.collideInit(x - width * alignX,
                     y - height * alignY,
                     width,
                     height,
                     blocksMask,
                     blockedByMask);

    // TODO: add collision callback?
  },

  startAnim: function(bRandomize) {
    if (this.sequencer) {
      this.frameIndex = this.sequencer.start(bRandomize);
    }
  },

  stopAnim: function() {
    if (this.sequencer) {
      this.sequencer.stop();
    }
  },

  pauseAnim: function() {
    if (this.sequencer) {
      this.sequencer.pause();
    }
  },

  resumeAnim: function() {
    if (this.sequencer) {
      this.sequencer.resume();
    }
  },

  setVelocity: function(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  },

  setAcceleration: function(ax, ay) {
  },

  update: function(dt, gameTime) {
    if (this.sequencer) {
      this.frameIndex = this.sequencer.getIndex();
    }
    
    this.kinUpdate(dt);
  },

  setZOrder: function(zOrder) {
    this.zOrder = zOrder;
  },

  getZOrder: function() {
    return this.zOrder;
  },

  setAlignment: function(alignX, alignY) {
    joe.assert(this.spriteSheet);
    this.spriteSheet.setAlignment(alignX, alignY);
  },

  setSpritesheet: function(newSheet) {
    var width = 0,
        height = 0;

    this.spriteSheet = newSheet;

    width = this.spriteSheet ? spriteSheet.getCellWidth() : 0;
    height = this.spriteSheet ? spriteSheet.getCellHeight() : 0;
    width = boundsFactorX ? width * boundsFactorX : width;
    height = boundsFactorY ? height * boundsFactorY : height;

    this.AABBset(this.pos.x - width * this.align.x,
                 this.pos.y - height * this.align.y,
                 width,
                 height);
  },

  setFrame: function(index) {
    this.frameIndex = index;
  },

  draw: function(gfx) {
    joe.assert(this.spriteSheet);

    this.spriteSheet.draw(gfx, this.pos.x, this.pos.y, this.frameIndex);
  },

  drawToWorld: function(gfx, worldX, worldY) {
    joe.assert(this.spriteSheet);

    this.spriteSheet.draw(gfx, this.pos.x - worldX, this.pos.y - worldY, this.frameIndex);
  },

  setPos: function(x, y) {
    this.pos.x = x;
    this.pos.y = y;

    this.updateBounds(x, y);
  },

  updateBounds: function(x, y) {
    this.bounds.x = this.pos.x - this.align.x * this.bounds.w;
    this.bounds.y = this.pos.y - this.align.y * this.bounds.h;
  }
});

