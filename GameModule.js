/**
 *  Provides helper functions common to most games.
 *
 *  usage:
 *
 *  requires: joe.GameModule,
 *
 *  images: {"image1", "image2", "image3", ...}, // Assumed to reside in the img directory
 *  fonts:  {font1: "relative URL to font resource #1",
 *           font2: "[relative URL to font resource #2, part a", "relative URL to font resource #2, part b"]},
 *  sounds: {"sound1", "sound2", "sound3", ...}, // Assumed to reside in the snd directory 
 *
 *  onResourceLoadComplete: function() {
 *    var image = this.getImage("image1"),
 *        font = this.getFont("font1"),
 *        sound = this.getSound("sound1");
 *
 *    // Set up scene and other resource-dependent structure.
 *  }
 */

joe.GameModule = {
  images: {
    // exampleImg: null // this will load img/exampleImg.png and store the resource in this.images.exampleImg.
  },
  fonts: {
    // exampleFont: ["img/someFont_a.png", "img/someFont_b.png"] OR exampleFont: "img/someFont.png" // loads the specified font into this.fonts.exampleFont
  },
  sounds: {
    // NOT YET IMPLMENTED
  },

  gameInit: function() {
    this.loadImages();
    this.loadFonts();
    this.loadSounds();

    // Force a check against resources, in case there aren't any to load.
    this.onResourceLoaded(null);
  },

  getImage: function(imgName) {
    var img = null;

    if (this.images.hasOwnProperty(imgName)) {
      img = this.images[imgName];
    }

    return img;
  },

  getFont: function(fontName) {
    var font = null;

    if (this.fonts.hasOwnProperty(fontName)) {
      font = this.fonts[fontName];
    }

    return font;
  },

  getSound: function(soundName) {
    var sound = null;

    if (this.sounds.hasOwnProperty(soundName)) {
      sound = this.sounds[soundName];
    }

    return sound;
  },

  loadImages: function() {
    var key = null;

    for (key in this.images) {
      this.images[key] = joe.Resources.loader.loadImage("img/" + key + ".png", this.onResourceLoaded, this.onResourceLoadFailed, this);
    }
  },

  loadFonts: function(fontName) {
    var key = null;

    for (key in this.fonts) {
      this.fonts[key] = joe.Resources.loader.loadBitmapFont(this.fonts[key], this.onResourceLoaded, this.onResourceLoadFailed, this);
    }
  },

  loadSounds: function() {
    // TODO: add logic
  },

  onResourceLoadComplete: function() {
    // Override this in the child game class.
  },

  gameStart: function() {
    this.onResourceLoadComplete();

    joe.UpdateLoop.addListener(this);
    joe.Graphics.addListener(this);

    joe.MouseInput.addListener(this);
    joe.KeyInput.addListener(this);
    joe.Multitouch.addListener(this);

    joe.UpdateLoop.start();
    joe.Graphics.start();
  },

  update: function(dt, gameTime) {
  },

  draw: function(gfx) {
    joe.Graphics.clearToColor("#ffffff", gfx);
  },

  onResourceLoaded: function(resource) {
    if (joe.Resources.loadComplete()) {
      this.gameStart();
    }
  },

  onResourceLoadFailed: function(resourceURL) {
    console.log("Failed to load font resource from " + resourceURL);
  }
};

// Create the game on load, storing it in the window.joeGame variable.
// window.onload = function() {
//   window.joeGame = new YourGameClass();
// };
