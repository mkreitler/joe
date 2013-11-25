// [HELP]
// <h1>joe.Resources</h1><hr>
//
// <em>Retrieves image, audio, font, and text/svg data from the server.</em>
//
// <strong>Interface</strong>
// loadImage = function(imageURL);
// loadSound = function(soundURL);
// loadFont = function(fontURL);
// loadSVG = function(svgURL);
//
// <strong>Use</strong>
// <pre> var myLoader = {
//   onSoundLoaded = function(sound, soundName) {...},
//   onImageLoaded = function(image) {...},
//   onFontLoaded = function(font) {...},
//   onSVGloaded = function(svgText) {...},
//   onErrorCallback = function(errorText) {...}
// };
//
// joe.Resources.loadSound("mySound", myLoader.onSoundLoaded, myLoader.onErrorCallback, this, nChannels, minDelay);
// joe.Resources.loadImage("myImage", myLoader.onImageLoaded, myLoader.onErrorCallback, this);
// joe.Resources.loadFont("myFont", myLoader.onFontLoaded, myLoader.onErrorCallback, this);
// joe.Resources.loadSVG("mySVG", myLoader.onSVGloaded, myLoader.onErrorCallback, this);</pre>
//
// <strong>Notes</strong>
// TODO: maintain a total resource count and add a progress API.
// [END HELP]

joe.Resources = {};

joe.ResourceLoader = new joe.ClassEx(null, {
// Static Definitions /////////////////////////////////////////////////////////

  loadImage: function(imageURL, onLoadedCallback, onErrorCallback, observer) {
    var image = new Image();
  
    if (onLoadedCallback) {
      image.onload = function() {
        onLoadedCallback.call(observer, image);
      }
    }
    
    if (onErrorCallback) {
      image.onerror = function() {
        onErrorCallback.call(observer, imageURL);
      }
    }
  
    image.src = imageURL;
  
    return image;
  },
  
  loadFont: function(fontURL, onLoadedCallback, onErrorCallback, observer) {
    var font = joe.Resources.FontEx.newFromResource(fontURL, onLoadedCallback, onErrorCallback, observer);    
    
    return font;
  },
  
  loadSound: function(soundURL, onLoadedCallback, onErrorCallback, observer, nChannels, repeatDelaySec) {
    var boundLoadedCallback = onLoadedCallback ? onLoadedCallback.bind(observer) : null;
    var boundErrorCallback = onErrorCallback ? onErrorCallback.bind(observer) : null;
    
    return joe.Sound.load(soundName, onLoadedCallback, onErrorCallback, nChannels, repeatDelaySec);
  },

  loadSVG: function(svgName, onLoadedCallback, onErrorCallback, observer) {
    var xhr = new XMLHttpRequest();
    var url = "http://www.freegamersjournal.com/svg-edit-2.6/php/loadSVG.php";
    var title = svgName;
    var matches = null;
  
    xhr.open("POST", url, true);

    // Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (xhr.responseText && xhr.responseText.substring(0, "ERROR:".length) === "ERROR:") {
            if (onErrorCallback) onErrorCallback.call(observer);
          }
          else if (onLoadedCallback) {
            onLoadedCallback.call(observer, xhr.responseText);
          }
        }
        else if (xhr.responseText) {
          if (onErrorCallback) onErrorCallback.call(observer, svgName);
        }
      }
    }

    xhr.send("name=" + svgName);  
  }
},
{
// Instance Definitions ///////////////////////////////////////////////////////
});

joe.Resources.loader = new joe.ResourceLoader();
