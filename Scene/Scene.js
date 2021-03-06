// TODO: add support for a 'Scene' object? What would that be?

joe.Scene = {
  DEFAULTS: {
              VIEW_ORDER: 100
            },

  views: [],
  viewPort: {x:0, y:0, w:joe.Graphics.getWidth(), h:joe.Graphics.getHeight()},
  ioIndex: 0,

  getFirstViewContainingPoint: function(x, y) {
    var i=0;

    this.ioIndex = -1;
    return this.getNextViewContainingPoint(x, y);
  },

  getNextViewContainingPoint: function(x, y) {
    var i=0,
        view = null;

    for (i=this.ioIndex+1; i<this.views.length; ++i) {
      if (joe.MathEx.rectContainsPoint(this.views[i].view.getWorldRect(), x, y)) {
        this.ioIndex = i;
        view = this.views[i].view;
        break;
      }
    }

    return view;
  },

  // Add a view to the hierarchy, drawn in zOrder where '0' is the near
  // view, with higher-numbered views stacking behind.
  addView: function(view, zOrder) {
    var i = 0,
        bInserted = false;

    zOrder = zOrder || joe.Scene.DEFAULTS.VIEW_ORDER;

    if (view) {
      for (i=0; i<this.views.length; ++i) {
        if (this.views[i].zOrder >= zOrder) {
          this.views.splice(i, 0, {view:view, zOrder:zOrder});
          bInserted = true;
          break;
        }
      }

      if (!bInserted) {
        this.views.push({view:view, zOrder:zOrder});
        bInserted = true;
      }
    }

    return bInserted ? view : null;
  },

  removeView: function(view) {
    var i = 0,
        bRemoved = false;

    for (i=0; i<this.views.length; ++i) {
      if (this.views.view === view) {
        joe.Utility.erase(this.views, this.views[i]);
        bRemoved = true;
      }
    }
  },

  update: function(dt, gameTime) {
    var i = 0;

    for (i=this.views.length - 1; i>=0; --i) {
      this.views[i].view.update(dt, gameTime);
    }
  },

  draw: function(gfx) {
    var i = 0,
        clippedRect = null;

    for (i=this.views.length - 1; i>=0; --i) {
      clippedRect = joe.MathEx.clip(this.viewPort, this.views[i].view.getWorldRect());
      if (clippedRect && clippedRect.w && clippedRect.h) {
        this.views[i].view.draw(gfx);
      }
    }
  }, 

  LayerInterface: {
    parent: null,
    bDefaultConsumeInput: true,

    setParent: function(view) {
      this.parent = view;
    },

    setDefaultConsumeInput: function(bNewDefault) {
      this.bDefaultConsumeInput = bNewDefault;
    },

    drawClipped: function(gfx) {
      // Override to provide custom functionality.
    },

    update: function(dt, gameTime) {
      // Override to provide custom functionality.
    },

    // Default IO handlers. Override to provide custom functionality.
    mouseDown: function(x, y) {
      return this.bDefaultConsumeInput
    },

    mouseOver: function(x, y) {
      return this.bDefaultConsumeInput
    },

    mouseHold: function(x, y) {
      return this.bDefaultConsumeInput
    },

    mouseDrag: function(x, y) {
      return this.bDefaultConsumeInput
    },

    mouseUp: function(x, y) {
      return this.bDefaultConsumeInput
    },

    touchDown: function(id, x, y) {
      return this.bDefaultConsumeInput
    },

    touchMove: function(id, x, y) {
      return this.bDefaultConsumeInput
    },

    touchDown: function(id, x, y) {
      return this.bDefaultConsumeInput
    }
  } 
};



