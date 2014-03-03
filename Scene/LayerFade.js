/*
 * Overlay the provides fade-in / fade-out transitions.
*/

joe.Scene.LayerFade = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  // Instance Definition //////////////////////////////////////////////////////
  requires: joe.Scene.LayerInterface,

  color: "#000000",
  transTime: 1.0,
  timer: 0.0,
  callback: null,
  fadeDir: 0.0,

  init: function(color, transTime, paramFadeStart) {
    this.setColor(color);
    this.setTransitionTime(transTime);
    this.timer = transTime * paramFadeStart;
  },

  setColor: function(newColor) {
    this.color = newColor;
  },

  setTransitionTime: function(newTransTime) {
    this.transTime = newTransTime;
  },

  startFadeIn: function(fadeCompleteCallback) {
    this.timer = this.transTime;
    this.callback = fadeCompleteCallback;
    this.fadeDir = -1;
  },

  startFadeOut: function(fadeCompleteCallback) {
    this.timer = 0.0;
    this.callback = fadeCompleteCallback;
    this.fadeDir = 1.0;
  },

  update: function(dt, gameTime) {
    if (this.fadeDir > 0.0) {
      this.timer += dt * 0.001;
      if (this.timer >= this.transTime) {
        this.fadeDir = 0;
        if (this.callback) {
          this.callback();
        }
      }
    }
    else if (this.fadeDir < 0.0) {
      this.timer -= dt * 0.001;
      if (this.timer <= 0.0) {
        this.fadeDir = 0;
        if (this.callback) {
          this.callback();
        }
      }
    }
  },

  drawClipped: function(gfx, srcRect, magnification) {
    var alphaParam = joe.MathEx.trigTransition(this.timer / Math.max(this.transTime, 0.001));

    if (gfx) {
      gfx.save();
      gfx.globalAlpha = alphaParam;
      gfx.translate(srcRect.x, srcRect.y);
      joe.Graphics.clearToColor(this.color, gfx, srcRect.w, srcRect.h);
      gfx.restore();
    }
  }
});
