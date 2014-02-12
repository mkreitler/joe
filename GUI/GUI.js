/**
 * Manages gui elements.
 */

joe.GuiClass = new joe.ClassEx(
  null,
  {
    requires: joe.Listeners,
    
    widgets: [],
    focusWidget: null,
    viewOffset: {x:0, y:0},
    clipRect: null,
    curTouchID: -1,

    getContext: function() {
      return this.widgets;
    },

    setContext: function(widgetList) {
      this.widgets = widgetList;
    },

    newContext: function() {
      var oldContext = this.widgets;

      this.widgets = [];

      return oldContext;
    },

    setViewOffset: function(x, y) {
      this.viewOffset.x = x;
      this.viewOffset.y = y;
    },

    setClipRect: function(clipRect) {
      this.clipRect = clipRect;
    },

    addWidget: function(widget, toFront) {
      toFront ? this.widgets.unshift(widget) : this.widgets.push(widget);

      return widget;
    },

    removeWidget: function(widget) {
      joe.Utility.erase(this.widgets, widget);
    },

    setFocusWidget: function(widget) {
      this.focusWidget = widget;
    },

    update: function(dt, gameTime) {
      // Update widgets.
      var i = 0;

      for (i=0; i<this.widgets.length; ++i) {
        if (this.widgets[i].widgetActive()) {
          this.widgets[i].updateWidget(dt, gameTime, 0, 0);
        }
      }
    },

    draw: function(context) {
      // Draw widgets.
      var i = 0;

      for (i=0; i<this.widgets.length; ++i) {
        if (this.widgets[i].widgetVisible()) {
          if (!this.clipRect || joe.MathEx.clip(this.clipRect, this.widgets[i].AABBgetRectRef())) {
            this.widgets[i].drawWidget(context, 0, 0);
          }
        }
      }
    },

    getWidgetAt: function(x, y) {
      var widget  = null,
          i       = 0,
          bounds  = null;

      for (i=0; i<this.widgets.length; ++i) {
        if (this.widgets[i].AABBcontainsPoint(x, y)) {
          bounds = this.widgets[i].AABBgetRef();
          widget = this.widgets[i].widgetGetChildAt(x - bounds.x, y - bounds.y);
          break;
        }
      }

      return widget;
    },

    touchDown: function(id, x, y) {
      if (this.curTouchID < 0) {
        this.curTouchID = id;
        this.mouseDown(x, y);
      }
    },

    touchMove: function(id, x, y) {
      if (this.curTouchID === id) {
        this.mouseDrag(x, y);
      }
    },

    touchUp: function(id, x, y) {
      if (this.curTouchID === id) {
        this.mouseUp(x, y);
        this.curTouchID = -1;
      }
    },

    mouseUp: function(x, y) {
      var widget = this.focusWidget,
          bConsumed = widget ? widget.mouseUp(x + this.viewOffset.x, y + this.viewOffset.y) : false,
          newFocusWidget = bConsumed ? widget : null;

      this.setFocusWidget(newFocusWidget);

      return bConsumed;
    },

    mouseDown: function(x, y) {
      var widget = this.getWidgetAt(x + this.viewOffset.x, y + this.viewOffset.y),
          bConsumed = widget ? widget.mouseDown(x + this.viewOffset.x, y + this.viewOffset.y) : false,
          newFocusWidget = bConsumed ? widget : null;

      this.setFocusWidget(newFocusWidget);

      return bConsumed;
    },

    mouseDrag: function(x, y) {
      var widget = this.focusWidget,
          bConsumed = widget ? widget.mouseDrag(x + this.viewOffset.x, y + this.viewOffset.y) : false,
          newFocusWidget = widget;

      return bConsumed;
    },

    mouseOver: function(x, y) {
      var widget = this.getWidgetAt(x + this.viewOffset.x, y + this.viewOffset.y),
          bConsumed = widget && (!this.focusWidget || this.focusWidget === widget) ? widget.mouseOver(x + this.viewOffset.x, y + this.viewOffset.y) : false;

      return bConsumed;
    },

    mouseHold: function(x, y) {
      var widget = this.focusWidget,
          bConsumed = widget ? widget.mouseHold(x + this.viewOffset.x, y + this.viewOffset.y) : false;

      return bConsumed;
    },

    mouseClick: function(x, y) {
      var widget = this.getWidgetAt(x + this.viewOffset.x, y + this.viewOffset.y),
          bConsumed = widget ? widget.mouseClick(x + this.viewOffset.x, y + this.viewOffset.y) : false,
          newFocusWidget = bConsumed ? widget : null;

      this.setFocusWidget(newFocusWidget);

      return bConsumed;
    },

    mouseDoubleClick: function(x, y) {
      var widget = this.getWidgetAt(x + this.viewOffset.x, y + this.viewOffset.y),
          bConsumed = widget ? widget.mouseDoubleClick(x + this.viewOffset.x, y + this.viewOffset.y) : false,
          newFocusWidget = bConsumed ? widget : null;

      this.setFocusWidget(newFocusWidget);

      return bConsumed;
    }
  }
);

joe.GUI = new joe.GuiClass();
joe.GUI.INACTIVE_COLOR = "#aaaaaa";

joe.UpdateLoop.addListener(joe.GUI);
joe.Graphics.addListener(joe.GUI);
