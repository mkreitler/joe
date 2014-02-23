// The TextMenu class automates creation of generic text menus.
//
// Builds the menu from a list of text entries. Each entry contains
// the following data:
//
// Entry text, input handlers, anchorX
//
// The overall menu takes the following data:
//
// custom draw, transition type
//
// 

joe.GUI.TextMenu = new joe.ClassEx({
// Static Definition //////////////////////////////////////////////////////////
  DEFAULT_SPACING_Y: 0.1,
  DEFAULT_ANCHOR_X: 0.5,
},
{
// Instance Definition ////////////////////////////////////////////////////////
  requires: joe.GUI.WidgetModule,

  customDraw: null,
  labels: [],

  init: function(x, y, font, labelInfo, anchorX, anchorY, spacingY, customDraw) {
    var labelList = labelInfo instanceof Array ? labelInfo : [],
        i = 0,
        yLocal = 0,
        width = 0,
        height = 0,
        newLabel = null,
        textSize = null;

    if (font) {
      spacingY = spacingY || joe.GUI.TextMenu.DEFAULT_SPACING_Y;
      anchorX = anchorX || 0;
      anchorY = anchorY || 0;

      if (!(labelInfo instanceof Array)) {
        labelList.push(labelInfo);
      }

      this.customDraw = customDraw ? customDraw : null;

      this.computeBounds(x, y, labelList, font, spacingY, anchorX, anchorY);

      // Add the labels.
      for (i=0; i<labelList.length; ++i) {
        //joe.GUI.Label(text, font, x, y, inputCallbacks, anchorX, anchorY, maxWidth, vSpacing, cursorChar, cursorPos, cursorSpacing) {
        textSize = font.measureText(labelList[i].text); 
        this.labels[i] = new joe.GUI.Label(labelList[i].text,
                                           font,
                                           this.bounds.width * (labelList[i].anchorX || 0),
                                           yLocal,
                                           labelList[i].inputHandlers,
                                           labelList[i].anchorX || joe.GUI.TextMenu.DEFAULT_ANCHOR_X,
                                           0,
                                           this.bounds.width,
                                           spacingY);
        this.widgetAddChild(this.labels[i]);

        yLocal += this.labels[i].AABBgetRef().height + (labelList[i].padding || 0) + font.height * spacingY;
      }
    }

    return this;
  },

  draw: function(gfx) {
    if (this.customDraw) {
      this.customDraw(gfx);
    }
  },

  computeBounds: function(x, y, labelList, font, spacingY, anchorX, anchorY) {
    var i = 0,
        xMin = Number.POSITIVE_INFINITY,
        xMax = Number.NEGATIVE_INFINITY,
        height = 0,
        width = 0,
        textSize = null;

    for (i=0; i<labelList.length; ++i) {

      textSize = font.measureText(labelList[i].text);
      if (-labelList[i].anchorX * textSize.width < xMin) {
        xMin = -labelList[i].anchorX * textSize.width;
      }

      if (-labelList[i].anchorX * textSize.width + textSize.width > xMax) {
        xMax = -labelList[i].anchorX * textSize.width + textSize.width;
      }

      height += textSize.height;
      if (i < labelList.length - 1) {
        height += (labelList[i].padding || 0) + font.height * spacingY;
      }
    }

    width = xMax - xMin;

    this.AABBset(x - anchorX * width,
                 y - anchorY * height,
                 width,
                 height);

  }
});

