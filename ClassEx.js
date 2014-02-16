// ClassEx provides a means to create new constructors.
// It supports object compositing via "modules".

joe.assert = function(condition, message) {
  if (!condition) {
    if (joe.Utility.isMobile()) {
      console.log(message || joe.Strings.ASSERT_DEFAULT_MESSAGE);
    }
    else if (confirm(message + joe.Strings.ASSERT_DISMISSAL)) {
      debugger;
    }
  }
};

joe.loadModule = function(module) {
  var key = null;

  for (key in module) {
    this[key] = module[key];
  }
};

// Events allow objects to communicate without requiring an understanding
// of each other's interface. For example, a UI button can signal a 'press'
// to its owning state machine without using a specific reference to the
// state machine. That's the good news, but there is some bad news.
//
// Events are slow. You should use them only to communicate state changes
// that occur intermittently, like a user button press or a sound that plays
// once in a while.
joe.eventsModule = {
  events: {},

  onMessage: function(messageName, listener, callback) {
    if (!this.events.hasOwnProperty(messageName)) {
      this.events[messageName] = [];
    }

    if (this.events[messageName].indexOf(listener) < 0) {
      this.events[messageName].push({listener: listener, callback: callback});
    }
  },

  messageUnlisten: function(messageName, listener) {
    var msgInfo = null,
        i = 0;

    if (this.events.hasOwnProperty(messageName)) {
      msgInfo = this.events.hasOwnProperty[messageName];
      for (i=0; i<msgInfo.length; ++i) {
        if (msgInfo[i].listener === listener) {
          joe.Utility.erase(msgInfo, msgInfo[i]);
          break;
        }
      }
    }
  },

  messageUnlistenAll: function(listener) {
    var key = null,
        i = 0,
        bErase = false;

    for (key in this.events) {
      bErased = true;

      while (bErased) {
        bErased = false;

        for (i=0; i<key.length; ++i) {
          if (key[i].listener === listener) {
            joe.Utility.erase(key, key[i]);
            bErased = true;
            break;
          }
        }
      }
    }
  },

  message: function(eventName) {
    var bConsumed = false,
        key = null,
        nList = 0,
        list = null;

    if (this.events.hasOwnProperty(eventName)) {
      list = this.events[eventName];
      nList = list.length;
      for (i=0; i<nList; ++i) {
        if (list[i].callback.apply(list[i].listener, Array.prototype.slice.call(arguments, 1))) {
          break;
        }
      }
    }
  },

  broadcast: function(eventName) {
    var bConsumed = false,
        key = null,
        nList = 0,
        list = null;

    if (this.events.hasOwnProperty(eventName)) {
      list = this.events[eventName];
      nList = list.length;
      for (i=0; i<nList; ++i) {
        list[i].callback.apply(list[i].listener, Array.prototype.slice.call(arguments, 1));
      }
    }
  }
};

joe.ClassEx = function(classModules, instanceModules) {
  var classMods = classModules; 
  var instMods = instanceModules;

  var _class = function() {
    joe.ClassEx.extendVariables(this, instMods);

    // Call the new class' 'init' method 
    this.init.apply(this, arguments);
  };

  // Hook all joe objects into the event system.
  var _newPrototype = function() {}
  _newPrototype.prototype = joe.eventsModule;
  _class.prototype = new _newPrototype();

  classModules = joe.ClassEx.include(classModules);
  instanceModules = joe.ClassEx.include(instanceModules);

  joe.ClassEx.staticInit(classModules);
  joe.ClassEx.staticInit(instanceModules);

  // Make the prototype object available to the class and
  // its instances outside of construction time.
  _class.static = _class.prototype;
  _class.prototype.static = _class.prototype;

  // Provide a default 'init' method.
  _class.prototype.init = function() {};

  _class.prototype.loadModule = joe.loadModule;

  // Copy instance-level functions into the class prototype.
  joe.ClassEx.extendMethods(_class.static, instanceModules);

  // Copy class data and methods into the new class.
  joe.ClassEx.extend(_class, classMods);

  return _class;
};

joe.ClassEx.clearMessages = function() {
  joe.eventsModule.events = {};
};

// Resolve 'requires' directives into a master list of modules.
joe.ClassEx.include = function(modules) {
  var modulesArray = null,
      key = null,
      module = null,
      i = 0,
      il = 0,
      j = 0,
      jl = 0,
      includes = null,
      included = [];
      extraModules = [];

  if (modules) {
    if (!(modules instanceof Array)) {
      modulesArray = [];
      modulesArray.push(modules);
    }
    else {
      modulesArray = modules;
    }

    for (i=0, il=modulesArray.length; i<il; ++i) {
      // Are there any 'includes'?
      includes = modulesArray[i]["requires"];
      if (includes) {
        // Yes. Add them to the list of modules.
        if (includes instanceof Array) {
          for (j=0, jl=includes.length; j<jl; ++j) {
            if (included.indexOf(includes[j])) {
              joe.assert(false, 'Circular dependency during include process!');
            }
            else {
              included.push(includes[j]);
              extraModules.push(includes[j]);
            }
          }
        }
        else {
          extraModules.push(includes);
        }
      }
    }

    if (extraModules.length) {
      // Found depdendencies. Recurse into them to handle
      // hierarchical dependencies.
      extraModules = joe.ClassEx.include(extraModules);
    }

    // Insert required modules into the start of the module array
    // (allows classes to override included methods).
    for (i=0; i<extraModules.length; ++i) {
      modulesArray.unshift(extraModules[i]);
    }
  }

  return modulesArray;
},

joe.ClassEx.staticInit = function(modules) {
  var modulesArray = modules && (modules instanceof Array) ? modules : null,
      i = 0;

  if (modules) {
    if (!modulesArray) {
      modulesArray = [];
      modulesArray.push(modules);
    }

    for (i=0; i<modulesArray.length; ++i) {
      if (modulesArray[i].staticInit) {
        modulesArray[i].staticInit();
      }
    }
  }
};

joe.ClassEx.extend = function(object, modules) {
  joe.ClassEx.extendVariables(object, modules);
  joe.ClassEx.extendMethods(object, modules);
};

// Copy functions from the specified module into the
// _class prototype.
joe.ClassEx.extendMethods = function(object, modules) {
  var key = null;
  var i = 0;
  var newModules = null;

  if (modules) {

    if (!(modules instanceof Array)) {
      newModules = [];
      newModules.push(modules);
      modules = newModules;
    }

    for (i=0; i<modules.length; ++i) {
      if (object && modules[i]) {
        for (key in modules[i]) {
          if (typeof(modules[i][key]) === "function") {
            object[key] = joe.ClassEx.cloneInstanceVars(modules[i][key]);
          }
        }
      }
    }
  }
};
// Copy instance variables into the current object.
joe.ClassEx.extendVariables = function(object, modules, bIgnoreRequires) {
  var key = null;
  var i = 0;
  var module = null;

  if (modules && object) {

    if (!(modules instanceof Array)) {
      newModules = [];
      newModules.push(modules);
      modules = newModules;
    }

    for(i=0; i<modules.length; ++i) {

      module = modules[i];

      for (key in module) {
        if (key === "requires") {
          if (!bIgnoreRequires) {
            joe.ClassEx.extendVariables(object, joe.ClassEx.include(module[key]), true);
          }
        }
        else if (typeof(module[key]) !== "function") {
          joe.assert(!(object[key]), "Found duplicate object during instantiation.");
          object[key] = joe.ClassEx.cloneInstanceVars(module[key]);
        }
      }
    }
  }
};

// Snippet taken from Code Dojo:
// http://davidwalsh.name/javascript-clone
joe.ClassEx.cloneInstanceVars = function(src) {
  function mixin(dest, source, copyFunc) {
    var name, s, i, empty = {};
    
    for(name in source){
      // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
      // inherited from Object.prototype.	 For example, if dest has a custom toString() method,
      // don't overwrite it with the toString() method that source inherited from Object.prototype

      // Skip the 'requires' keyword. It has already been processed.
      if (name === 'requires') {
        continue;
      }

      s = source[name];
      if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
        dest[name] = copyFunc ? copyFunc(s) : s;
      }
    }
    return dest;
  }
  
  if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
    // Don't want to proces null, undefined, any non-object, or function
    return src;
  }
  if(src.nodeType && "cloneNode" in src){
    // DOM Node
    return src.cloneNode(true); // Node
  }
  if(src instanceof Date){
    // Date
    return new Date(src.getTime());	// Date
  }
  if(src instanceof RegExp){
    // RegExp
    return new RegExp(src);   // RegExp
  }
  var r, i, l;
  if(src instanceof Array){
    // array
    r = [];
    for(i = 0, l = src.length; i < l; ++i){
      if(i in src){
        r.push(joe.ClassEx.cloneInstanceVars(src[i]));
      }
    }
  }else{
    // generic objects
    r = src.constructor ? new src.constructor() : {};
  }
  return mixin(r, src, joe.ClassEx.cloneInstanceVars);
};