!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.Arcadia=e():"undefined"!=typeof global?global.Arcadia=e():"undefined"!=typeof self&&(self.Arcadia=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};(function() {
  var Arcadia, nowOffset;

  if (window.requestAnimationFrame === void 0) {
    window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  }

  if (window.cancelAnimationFrame === void 0) {
    window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
  }

  if (window.performance === void 0) {
    nowOffset = Date.now();
    window.performance = {
      now: function() {
        return Date.now() - nowOffset;
      }
    };
  }

  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

  Arcadia = {
    Game: require('./game.coffee'),
    Button: require('./button.coffee'),
    Emitter: require('./emitter.coffee'),
    GameObject: require('./gameobject.coffee'),
    Label: require('./label.coffee'),
    Pool: require('./pool.coffee'),
    Scene: require('./scene.coffee'),
    Shape: require('./shape.coffee'),
    Sprite: require('./sprite.coffee')
  };

  /*
  @description Get information about the current environment
  */


  Arcadia.ENV = (function() {
    var agent, android, firefox, ios, mobile;
    agent = navigator.userAgent.toLowerCase();
    android = !!(agent.match(/android/i) && agent.match(/android/i).length > 0);
    ios = !!(agent.match(/ip(hone|od|ad)/i) && agent.match(/ip(hone|od|ad)/i).length > 0);
    firefox = !!(agent.match(/firefox/i) && agent.match(/firefox/i).length > 0);
    mobile = !!(agent.match(/mobile/i) && agent.match(/mobile/i).length > 0) || android;
    return Object.freeze({
      android: android,
      ios: ios,
      firefox: firefox,
      mobile: mobile,
      desktop: !mobile,
      cordova: window.cordova !== void 0
    });
  })();

  /*
  @description Change the active scene being displayed
  */


  Arcadia.changeScene = function(SceneClass, options) {
    if (options == null) {
      options = {};
    }
    return Arcadia.instance.activeScene = new SceneClass(options);
  };

  /*
  @description Distance method
  */


  Arcadia.distance = function(one, two) {
    return Math.sqrt(Math.pow(two.x - one.x, 2) + Math.pow(two.y - one.y, 2));
  };

  /*
  @description Random number method
  */


  Arcadia.random = function(min, max) {
    throw new Error("Implement a function that gets a random number between " + min + " and " + max + "!");
  };

  module.exports = global.Arcadia = Arcadia;

}).call(this);


},{"./button.coffee":2,"./emitter.coffee":3,"./game.coffee":4,"./gameobject.coffee":5,"./label.coffee":6,"./pool.coffee":7,"./scene.coffee":8,"./shape.coffee":9,"./sprite.coffee":10}],2:[function(require,module,exports){
(function() {
  var Button, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Shape = require('./shape.coffee');

  Button = (function(_super) {
    __extends(Button, _super);

    function Button(args) {
      var Label, height;
      if (args == null) {
        args = {};
      }
      Label = require('./label.coffee');
      this.padding = args.padding || 0;
      this.label = args.label || new Label({
        text: args.text,
        font: args.font
      });
      this.label.drawCanvasCache();
      Button.__super__.constructor.call(this, args);
      if (!args.hasOwnProperty('size')) {
        height = this.vertices === 0 ? this.label.size.width : this.label.size.height;
        this.size = {
          width: this.label.size.width + this.padding,
          height: height + this.padding
        };
      }
      this.add(this.label);
      if (args.hasOwnProperty('action')) {
        this.action = args.action;
      }
      this.disabled = false;
      this.enablePointEvents = true;
    }

    /*
    @description If touch/mouse end is inside button, execute the user-supplied callback
    this method will get fired for each different button object on the screen
    */


    Button.prototype.onPointEnd = function(points) {
      var i;
      Button.__super__.onPointEnd.call(this, points);
      if (typeof this.action !== 'function' || this.disabled) {
        return;
      }
      i = points.length;
      while (i--) {
        if (this.containsPoint(points[i])) {
          return this.action();
        }
      }
    };

    /*
    @description Helper method to determine if mouse/touch is inside button graphic
    */


    Button.prototype.containsPoint = function(point) {
      return point.x < this.position.x + this.size.width / 2 + this.padding / 2 && point.x > this.position.x - this.size.width / 2 - this.padding / 2 && point.y < this.position.y + this.size.height / 2 + this.padding / 2 && point.y > this.position.y - this.size.height / 2 - this.padding / 2;
    };

    /*
    @description Getter/setter for text value
    */


    Button.property('text', {
      get: function() {
        return this.label.text;
      },
      set: function(text) {
        return this.label.text = text;
      }
    });

    /*
    @description Getter/setter for font value
    */


    Button.property('font', {
      get: function() {
        return this.label.font;
      },
      set: function(font) {
        return this.label.font = font;
      }
    });

    return Button;

  })(Shape);

  module.exports = Button;

}).call(this);


},{"./label.coffee":6,"./shape.coffee":9}],3:[function(require,module,exports){
(function() {
  var Emitter, GameObject, Pool, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Pool = require('./pool.coffee');

  Shape = require('./shape.coffee');

  Emitter = (function(_super) {
    __extends(Emitter, _super);

    /*
     * @constructor
     * @description Basic particle emitter
     * @param {string} [shape='square'] Shape of the particles. Accepts strings that are valid for Shapes (e.g. "circle", "triangle")
     * @param {number} [size=10] Size of the particles
     * @param {number} [count=25] The number of particles created for the system
    */


    function Emitter(factory, count) {
      if (count == null) {
        count = 25;
      }
      if (typeof factory !== 'function') {
        throw new Error('Emitter requires a factory function');
      }
      Emitter.__super__.constructor.apply(this, arguments);
      this.duration = 1;
      this.fade = false;
      this.scale = 1.0;
      this.speed = 200;
      this.i = this.particle = null;
      while (count--) {
        this.children.add(factory());
      }
      this.children.deactivateAll();
    }

    /*
     * @description Activate a particle emitter
     * @param {number} x Position of emitter on x-axis
     * @param {number} y Position of emitter on y-axis
    */


    Emitter.prototype.startAt = function(x, y) {
      var direction;
      this.children.activateAll();
      this.reset();
      this.i = this.children.length;
      while (this.i--) {
        this.particle = this.children.at(this.i);
        this.particle.position.x = x;
        this.particle.position.y = y;
        direction = Math.random() * 2 * Math.PI;
        this.particle.velocity.x = Math.cos(direction);
        this.particle.velocity.y = Math.sin(direction);
        this.particle.speed = Math.random() * this.speed;
      }
      this.timer = 0;
      this.position.x = x;
      return this.position.y = y;
    };

    Emitter.prototype.update = function(delta) {
      Emitter.__super__.update.call(this, delta);
      this.timer += delta;
      this.i = this.children.length;
      while (this.i--) {
        this.particle = this.children.at(this.i);
        if (this.timer >= this.duration) {
          this.children.deactivate(this.i);
        }
        if (this.scale !== 1.0) {
          this.particle.scale += this.scale * delta / this.duration;
        }
      }
    };

    Emitter.prototype.reset = function() {
      var _results;
      this.i = this.children.length;
      _results = [];
      while (this.i--) {
        this.particle = this.children.at(this.i);
        if (typeof this.particle.reset === 'function') {
          _results.push(this.particle.reset());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Emitter;

  })(GameObject);

  module.exports = Emitter;

}).call(this);


},{"./gameobject.coffee":5,"./pool.coffee":7,"./shape.coffee":9}],4:[function(require,module,exports){
(function() {
  var Game,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Game = (function() {
    /*
     * @constructor
     * @description Main "game" object; sets up screens, input, etc.
     * @param {Object} args Config object. Allowed keys: width, height, scene, scaleToFit
    */

    function Game(args) {
      var Arcadia;
      if (args == null) {
        args = {};
      }
      this.update = __bind(this.update, this);
      Arcadia = require('./arcadia.coffee');
      this.size = {
        width: parseInt(args.width, 10) || 320,
        height: parseInt(args.height, 10) || 480
      };
      Arcadia.WIDTH = this.size.width;
      Arcadia.HEIGHT = this.size.height;
      Arcadia.SCALE = 1;
      Arcadia.OFFSET = {
        x: 0,
        y: 0
      };
      Arcadia.FPS = 60;
      if (args.hasOwnProperty('fps')) {
        Arcadia.FPS_LIMIT = args.fps;
      }
      if (args.hasOwnProperty('element')) {
        this.element = args.element;
      } else {
        this.element = document.createElement('div');
        this.element.id = 'arcadia';
        document.body.appendChild(this.element);
      }
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      this.element.appendChild(this.canvas);
      this.setPixelRatio();
      this.input = {
        'left': false,
        'up': false,
        'right': false,
        'down': false,
        'w': false,
        'a': false,
        's': false,
        'd': false,
        'enter': false,
        'escape': false,
        'space': false,
        'control': false,
        'z': false,
        'x': false
      };
      this.points = [];
      Arcadia.instance = this;
      Arcadia.points = this.points;
      Arcadia.element = this.element;
      this.onResize = this.onResize.bind(this);
      this.onPointStart = this.onPointStart.bind(this);
      this.onPointMove = this.onPointMove.bind(this);
      this.onPointEnd = this.onPointEnd.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      this.pause = this.pause.bind(this);
      this.resume = this.resume.bind(this);
      if (Arcadia.ENV.mobile) {
        this.element.addEventListener('touchstart', this.onPointStart, false);
        this.element.addEventListener('touchmove', this.onPointMove, false);
        this.element.addEventListener('touchend', this.onPointEnd, false);
      } else {
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
        this.element.addEventListener('mousedown', this.onPointStart, false);
        this.element.addEventListener('mouseup', this.onPointEnd, false);
      }
      this.element.addEventListener('touchmove', function(e) {
        return e.preventDefault();
      });
      if (window.cordova !== void 0) {
        document.addEventListener('pause', this.pause, false);
        document.addEventListener('resume', this.resume, false);
      }
      if (args.scaleToFit) {
        this.onResize();
        window.addEventListener('resize', this.onResize, false);
      }
      this.activeScene = new args.scene({
        size: {
          width: Arcadia.WIDTH,
          height: Arcadia.HEIGHT
        }
      });
      this.start();
    }

    /*
    @description Pause active scene if it has a pause method
    */


    Game.prototype.pause = function() {
      if (typeof this.activeScene.pause === "function") {
        return this.activeScene.pause();
      }
    };

    /*
    @description Resume active scene if it has a pause method
    */


    Game.prototype.resume = function() {
      if (typeof this.activeScene.resume === "function") {
        return this.activeScene.resume();
      }
    };

    /*
    @description Mouse/touch event callback
    */


    Game.prototype.onPointStart = function(event) {
      this.getPoints(event);
      if (event.type.indexOf('mouse') !== -1) {
        this.element.addEventListener('mousemove', this.onPointMove, false);
      }
      return this.activeScene.onPointStart(this.points);
    };

    /*
    @description Mouse/touch event callback
    */


    Game.prototype.onPointMove = function(event) {
      this.getPoints(event);
      return this.activeScene.onPointMove(this.points);
    };

    /*
    @description Mouse/touch event callback
    TODO: Generates garbage
    */


    Game.prototype.onPointEnd = function(event) {
      var end;
      this.getPoints(event, end = true);
      if (event.type.indexOf('mouse') !== -1) {
        this.element.removeEventListener('mousemove', this.onPointMove, false);
      }
      return this.activeScene.onPointEnd(this.points);
    };

    /*
    @description Keyboard event callback
    TODO: Generates garbage
    */


    Game.prototype.onKeyDown = function(event) {
      var key;
      key = this.getKey(event.keyCode);
      if (this.input[key]) {
        return;
      }
      this.input[key] = true;
      if (typeof this.activeScene.onKeyDown === "function") {
        return this.activeScene.onKeyDown(key);
      }
    };

    /*
    @description Keyboard event callback
    TODO: Generates garbage
    */


    Game.prototype.onKeyUp = function(event) {
      var key;
      key = this.getKey(event.keyCode);
      this.input[key] = false;
      if (typeof this.activeScene.onKeyUp === "function") {
        return this.activeScene.onKeyUp(key);
      }
    };

    /*
    @description Translate a keyboard event code into a meaningful string
    */


    Game.prototype.getKey = function(keyCode) {
      switch (keyCode) {
        case 37:
          return 'left';
        case 38:
          return 'up';
        case 39:
          return 'right';
        case 40:
          return 'down';
        case 87:
          return 'w';
        case 65:
          return 'a';
        case 83:
          return 's';
        case 68:
          return 'd';
        case 13:
          return 'enter';
        case 27:
          return 'escape';
        case 32:
          return 'space';
        case 17:
          return 'control';
        case 90:
          return 'z';
        case 88:
          return 'x';
      }
    };

    /*
    @description Static method to translate mouse/touch input to coordinates the
    game will understand. Takes the <canvas> offset and scale into account
    */


    Game.prototype.getPoints = function(event, touchEnd) {
      var i, source, _results;
      if (touchEnd == null) {
        touchEnd = false;
      }
      while (this.points.length > 0) {
        this.points.pop();
      }
      if (event.type.indexOf('mouse') !== -1) {
        return this.points.unshift({
          x: (event.pageX - Arcadia.OFFSET.x) / Arcadia.SCALE - this.size.width / 2 + this.activeScene.camera.position.x,
          y: (event.pageY - Arcadia.OFFSET.y) / Arcadia.SCALE - this.size.height / 2 + this.activeScene.camera.position.y
        });
      } else {
        source = touchEnd ? 'changedTouches' : 'touches';
        i = event[source].length;
        _results = [];
        while (i--) {
          _results.push(this.points.unshift({
            x: (event[source][i].pageX - Arcadia.OFFSET.x) / Arcadia.SCALE - this.size.width / 2 + this.activeScene.camera.position.x,
            y: (event[source][i].pageY - Arcadia.OFFSET.y) / Arcadia.SCALE - this.size.height / 2 + this.activeScene.camera.position.y
          }));
        }
        return _results;
      }
    };

    /*
     * @description Start the event/animation loops
    */


    Game.prototype.start = function() {
      this.previousDelta = window.performance.now();
      return this.updateId = window.requestAnimationFrame(this.update);
    };

    /*
    @description Cancel draw/update loops
    */


    Game.prototype.stop = function() {
      return window.cancelAnimationFrame(this.updateId);
    };

    /*
    @description Update callback
    */


    Game.prototype.update = function(currentDelta) {
      var delta;
      delta = currentDelta - this.previousDelta;
      this.updateId = window.requestAnimationFrame(this.update);
      Arcadia.FPS = Arcadia.FPS * 0.9 + 1000 / delta * 0.1;
      if (Arcadia.FPS_LIMIT && delta < 1000 / Arcadia.FPS_LIMIT) {
        return;
      }
      this.activeScene.draw(this.context);
      this.activeScene.update(delta / 1000);
      return this.previousDelta = currentDelta;
    };

    /*
    @description Change size of canvas based on pixel density
    */


    Game.prototype.setPixelRatio = function() {
      if (window.devicePixelRatio === void 0) {
        window.devicePixelRatio = 1;
      }
      if (this.context.backingStorePixelRatio === void 0) {
        this.context.backingStorePixelRatio = this.context.webkitBackingStorePixelRatio || 1;
      }
      Arcadia.PIXEL_RATIO = window.devicePixelRatio / this.context.backingStorePixelRatio;
      this.canvas.width = Arcadia.WIDTH * Arcadia.PIXEL_RATIO;
      this.canvas.height = Arcadia.HEIGHT * Arcadia.PIXEL_RATIO;
      this.canvas.style.width = "" + Arcadia.WIDTH + "px";
      return this.canvas.style.height = "" + Arcadia.HEIGHT + "px";
    };

    /*
    @description Handle window resize events. Scale the canvas element to max out the size of the current window, keep aspect ratio
    */


    Game.prototype.onResize = function() {
      var aspectRatio, height, margin, orientation, width;
      width = window.innerWidth;
      height = window.innerHeight;
      if (width > height) {
        orientation = 'landscape';
        aspectRatio = Arcadia.WIDTH / Arcadia.HEIGHT;
      } else {
        orientation = 'portrait';
        aspectRatio = Arcadia.HEIGHT / Arcadia.WIDTH;
      }
      if (orientation === 'landscape') {
        if (width / aspectRatio > height) {
          width = height * aspectRatio;
          margin = '0 ' + ((window.innerWidth - width) / 2) + 'px';
        } else if (width / aspectRatio < height) {
          height = width / aspectRatio;
          margin = ((window.innerHeight - height) / 2) + 'px 0';
        }
      } else if (orientation === 'portrait') {
        if (height / aspectRatio > width) {
          height = width * aspectRatio;
          margin = ((window.innerHeight - height) / 2) + 'px 0';
        } else if (height / aspectRatio < width) {
          width = height / aspectRatio;
          margin = '0 ' + ((window.innerWidth - width) / 2) + 'px';
        }
      }
      Arcadia.SCALE = height / Arcadia.HEIGHT;
      Arcadia.OFFSET.x = (window.innerWidth - width) / 2;
      Arcadia.OFFSET.y = (window.innerHeight - height) / 2;
      this.element.setAttribute('style', "position: relative; width: " + width + "px; height: " + height + "px; margin: " + margin + ";");
      this.canvas.style['position'] = 'absolute';
      this.canvas.style['left'] = '0';
      this.canvas.style['top'] = '0';
      this.canvas.style['-webkit-transform'] = "scale(" + Arcadia.SCALE + ")";
      this.canvas.style['-webkit-transform-origin'] = '0 0';
      this.canvas.style['transform'] = "scale(" + Arcadia.SCALE + ")";
      return this.canvas.style['transform-origin'] = '0 0';
    };

    return Game;

  })();

  module.exports = Game;

}).call(this);


},{"./arcadia.coffee":1}],5:[function(require,module,exports){
(function() {
  var GameObject, Pool;

  Pool = require('./pool.coffee');

  GameObject = (function() {
    function GameObject(args) {
      if (args == null) {
        args = {};
      }
      this.scale = args.scale || 1;
      this.rotation = args.rotation || 0;
      this.alpha = args.alpha || 1;
      this.enablePointEvents = args.enablePointEvents || false;
      if (typeof args.position === 'object') {
        this.position = {
          x: args.position.x,
          y: args.position.y
        };
      } else {
        this.position = {
          x: 0,
          y: 0
        };
      }
      this.children = new Pool();
    }

    /*
    @description Overridden in child objects
    */


    GameObject.prototype.drawCanvasCache = function() {
      return null;
    };

    /*
    @description Draw child objects
    @param {CanvasRenderingContext2D} context
    */


    GameObject.prototype.draw = function() {
      return this.children.draw.apply(this.children, arguments);
    };

    /*
    @description Update child objects
    @param {Number} delta Time since last update (in seconds)
    */


    GameObject.prototype.update = function(delta) {
      return this.children.update(delta);
    };

    /*
    @description Add child object
    @param {Object} object Object to be added
    */


    GameObject.prototype.add = function(object) {
      return this.children.add(object);
    };

    /*
    @description Remove child object
    @param {Object} objectOrIndex Object or index of object to be removed
    */


    GameObject.prototype.remove = function(objectOrIndex) {
      return this.children.remove(objectOrIndex);
    };

    /*
    @description Activate child object
    @param {Object} objectOrIndex Object or index of object to be activated
    */


    GameObject.prototype.activate = function(objectOrIndex) {
      return this.children.activate(objectOrIndex);
    };

    /*
    @description Deactivate child object
    @param {Object} objectOrIndex Object or index of object to be deactivated
    */


    GameObject.prototype.deactivate = function(objectOrIndex) {
      return this.children.deactivate(objectOrIndex);
    };

    /*
    @description Event handler for "start" pointer event
    @param {Array} points Array of touch/mouse coordinates
    */


    GameObject.prototype.onPointStart = function(points) {
      if (!this.enablePointEvents) {
        return;
      }
      return this.children.onPointStart(points);
    };

    /*
    @description Event handler for "move" pointer event
    @param {Array} points Array of touch/mouse coordinates
    */


    GameObject.prototype.onPointMove = function(points) {
      if (!this.enablePointEvents) {
        return;
      }
      return this.children.onPointMove(points);
    };

    /*
    @description Event handler for "end" pointer event
    @param {Array} points Array of touch/mouse coordinates
    */


    GameObject.prototype.onPointEnd = function(points) {
      if (!this.enablePointEvents) {
        return;
      }
      return this.children.onPointEnd(points);
    };

    return GameObject;

  })();

  module.exports = GameObject;

}).call(this);


},{"./pool.coffee":7}],6:[function(require,module,exports){
(function() {
  var Label, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Shape = require('./shape.coffee');

  Label = (function(_super) {
    __extends(Label, _super);

    function Label(args) {
      if (args == null) {
        args = {};
      }
      this._font = {
        size: 10,
        family: 'monospace'
      };
      this._text = 'text goes here';
      this._alignment = 'center';
      Label.__super__.constructor.call(this, args);
      if (args.hasOwnProperty('font')) {
        this.font = args.font;
      }
      if (args.hasOwnProperty('text')) {
        this.text = args.text;
      }
      if (args.hasOwnProperty('alignment')) {
        this.alignment = args.alignment;
      }
      this.anchor = {
        x: this.size.width / 2,
        y: this.size.height / 2
      };
    }

    /*
    @description Draw object onto internal <canvas> cache
    */


    Label.prototype.drawCanvasCache = function() {
      var Arcadia, context, element, lineCount, lineHeight, newlines, x,
        _this = this;
      if (this.canvas === void 0) {
        return;
      }
      Arcadia = require('./arcadia.coffee');
      context = this.canvas.getContext('2d');
      lineCount = 1;
      newlines = this.text.match(/\n/g);
      if (newlines) {
        lineCount = newlines.length + 1;
      }
      element = document.getElementById('text-dimensions');
      if (!element) {
        element = document.createElement('div');
        element['id'] = 'text-dimensions';
        element.style['position'] = 'absolute';
        element.style['top'] = '-9999px';
        element.style['overflow'] = 'scroll';
        document.body.appendChild(element);
      }
      element.style['font'] = this.font;
      element.style['line-height'] = 1;
      element.innerHTML = this.text.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
      this.size.width = element.offsetWidth;
      this.size.height = element.offsetHeight;
      lineHeight = this.size.height / lineCount * Arcadia.PIXEL_RATIO;
      this.anchor = {
        x: this.size.width / 2,
        y: this.size.height / 2
      };
      this.canvas.width = this.size.width + this._border.width + Math.abs(this._shadow.x) + this._shadow.blur;
      this.canvas.height = this.size.height + this._border.width + Math.abs(this._shadow.y) + this._shadow.blur;
      if (Arcadia.PIXEL_RATIO > 1) {
        this.canvas.width *= Arcadia.PIXEL_RATIO;
        this.canvas.height *= Arcadia.PIXEL_RATIO;
      }
      context.font = "" + (this._font.size * Arcadia.PIXEL_RATIO) + "px " + this._font.family;
      context.textAlign = this.alignment;
      context.textBaseline = 'middle';
      this.setAnchorPoint();
      if (this.debug) {
        context.lineWidth = 1 * Arcadia.PIXEL_RATIO;
        context.strokeStyle = '#f00';
        context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        context.arc(this.anchor.x, this.anchor.y, 3, 0, 2 * Math.PI, false);
        context.stroke();
      }
      context.translate(this.anchor.x, this.anchor.y);
      if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
        context.shadowOffsetX = this._shadow.x * Arcadia.PIXEL_RATIO;
        context.shadowOffsetY = this._shadow.y * Arcadia.PIXEL_RATIO;
        context.shadowBlur = this._shadow.blur * Arcadia.PIXEL_RATIO;
        context.shadowColor = this._shadow.color;
      }
      x = this.alignment === 'start' || this.alignment === 'left' ? -this.size.width / 2 : this.alignment === 'end' || this.alignment === 'right' ? this.size.width / 2 : 0;
      if (this._color) {
        context.fillStyle = this._color;
        if (lineCount > 1) {
          this.text.split('\n').forEach(function(text, index) {
            return context.fillText(text, x, (-_this.size.height / 2 * Arcadia.PIXEL_RATIO) + (lineHeight / 2) + (lineHeight * index));
          });
        } else {
          context.fillText(this.text, x, 0);
        }
      }
      if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
      }
      if (this._border.width && this._border.color) {
        context.lineWidth = this._border.width * Arcadia.PIXEL_RATIO;
        context.strokeStyle = this._border.color;
        if (lineCount > 1) {
          this.text.split('\n').forEach(function(text, index) {
            return context.strokeText(text, x, (-_this.size.height / 2 * Arcadia.PIXEL_RATIO) + (lineHeight / 2) + (lineHeight * index));
          });
        } else {
          context.strokeText(this.text, x, 0);
        }
      }
      return this.dirty = false;
    };

    /*
    @description Getter/setter for font
    TODO: Handle bold text
    */


    Label.property('font', {
      get: function() {
        return "" + this._font.size + "px " + this._font.family;
      },
      set: function(font) {
        var values;
        values = font.match(/^(\d+)(?:px)? (.+)$/);
        if (values.length === 3) {
          this._font.size = values[1];
          this._font.family = values[2];
          return this.dirty = true;
        } else {
          throw new Error('Use format "(size)px (font-family)" when setting Label font');
        }
      }
    });

    Label.property('text', {
      get: function() {
        return this._text;
      },
      set: function(value) {
        this._text = String(value);
        return this.dirty = true;
      }
    });

    Label.property('alignment', {
      get: function() {
        return this._alignment;
      },
      set: function(value) {
        this._alignment = value;
        return this.dirty = true;
      }
    });

    return Label;

  })(Shape);

  module.exports = Label;

}).call(this);


},{"./arcadia.coffee":1,"./shape.coffee":9}],7:[function(require,module,exports){
/*
@description One possible way to store common recyclable objects.
Assumes the objects you add will have an `active` property, and optionally an
`activate()` method which resets the object's state. Inspired by Programming
Linux Games (http://en.wikipedia.org/wiki/Programming_Linux_Games)
*/


(function() {
  var Pool;

  Pool = (function() {
    function Pool() {
      this.active = [];
      this.inactive = [];
      this.index = 0;
      this.factory = null;
    }

    Pool.property('length', {
      get: function() {
        return this.active.length;
      }
    });

    Pool.prototype.at = function(index) {
      return this.active[index];
    };

    /*
    @description Add an object into the recycle pool
                 list is z-sorted from 0 -> n, higher z-indices are drawn first
    */


    Pool.prototype.add = function(object) {
      if (!object.zIndex) {
        object.zIndex = this.active.length + this.inactive.length;
      }
      this.index = 0;
      while (this.index < this.length && object.zIndex > this.active[this.index].zIndex) {
        this.index += 1;
      }
      this.active.splice(this.index, 0, object);
      return this.length;
    };

    /*
    @description Remove an object from the recycle pool
    */


    Pool.prototype.remove = function(object) {
      var index;
      if (typeof object === 'number') {
        index = object;
        object = this.active.splice(index, 1)[0];
        if (typeof object.destroy === 'function') {
          object.destroy();
        }
        return object;
      }
      if (this.active.indexOf(object) !== -1) {
        index = this.active.indexOf(object);
        object = this.active.splice(index, 1)[0];
        if (typeof object.destroy === 'function') {
          object.destroy();
        }
        return object;
      }
      if (this.inactive.indexOf(object) !== -1) {
        index = this.inactive.indexOf(object);
        object = this.inactive.splice(index, 1)[0];
        if (typeof object.destroy === 'function') {
          object.destroy();
        }
        return object;
      }
      return void 0;
    };

    /*
    @description Get an active object by reference
    */


    Pool.prototype.activate = function(object) {
      var index;
      if (object) {
        index = this.inactive.indexOf(object);
        if (index === -1) {
          return void 0;
        }
        object = this.inactive.splice(index, 1)[0];
        if (typeof object.reset === 'function') {
          object.reset();
        }
        this.index = this.length;
        while (this.index > 0 && this.active[this.index - 1].zIndex > object.zIndex) {
          this.active[this.index] = this.active[this.index - 1];
          this.index -= 1;
        }
        this.active[this.index] = object;
        return object;
      }
      if (!object && this.inactive.length) {
        object = this.inactive.shift();
        if (typeof object.reset === 'function') {
          object.reset();
        }
        this.index = this.length;
        while (this.index > 0 && this.active[this.index - 1].zIndex > object.zIndex) {
          this.active[this.index] = this.active[this.index - 1];
          this.index -= 1;
        }
        this.active[this.index] = object;
        return object;
      }
      if (typeof this.factory !== 'function') {
        throw new Error('Pools need a factory function');
      }
      this.add(this.factory());
      return this.active[this.length - 1];
    };

    /*
    @description Deactivate an active object at a particular object/index
    */


    Pool.prototype.deactivate = function(objectOrIndex) {
      var index, object;
      index = typeof objectOrIndex !== 'number' ? this.active.indexOf(objectOrIndex) : objectOrIndex;
      if (index === -1) {
        return;
      }
      object = this.active.splice(index, 1)[0];
      this.inactive.push(object);
      return object;
    };

    /*
    @description Deactivate all child objects
    */


    Pool.prototype.deactivateAll = function() {
      this.index = this.length;
      while (this.index--) {
        this.deactivate(this.index);
      }
    };

    /*
    @description Activate all child objects
    */


    Pool.prototype.activateAll = function() {
      while (this.inactive.length) {
        this.activate();
      }
    };

    /*
    @description Passthrough method to update active child objects
    */


    Pool.prototype.update = function(delta) {
      this.index = this.length;
      while (this.index--) {
        this.at(this.index).update(delta);
      }
    };

    /*
    @description Passthrough method to draw active child objects
    */


    Pool.prototype.draw = function() {
      this.index = this.length;
      while (this.index--) {
        this.at(this.index).draw.apply(this.at(this.index), arguments);
      }
    };

    /*
    @description Event handler for "start" pointer event
    @param {Array} points Array of touch/mouse coordinates
    */


    Pool.prototype.onPointStart = function(points) {
      this.index = this.length;
      while (this.index--) {
        this.at(this.index).onPointStart(points);
      }
    };

    /*
    @description Event handler for "move" pointer event
    @param {Array} points Array of touch/mouse coordinates
    */


    Pool.prototype.onPointMove = function(points) {
      this.index = this.length;
      while (this.index--) {
        this.at(this.index).onPointMove(points);
      }
    };

    /*
    @description Event handler for "end" pointer event
    @param {Array} points Array of touch/mouse coordinates
    */


    Pool.prototype.onPointEnd = function(points) {
      this.index = this.length;
      while (this.index--) {
        this.at(this.index).onPointEnd(points);
      }
    };

    return Pool;

  })();

  module.exports = Pool;

}).call(this);


},{}],8:[function(require,module,exports){
(function() {
  var GameObject, Scene,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Scene = (function(_super) {
    __extends(Scene, _super);

    function Scene(args) {
      var DEFAULT_SIZE;
      if (args == null) {
        args = {};
      }
      Scene.__super__.constructor.call(this, args);
      DEFAULT_SIZE = {
        width: Arcadia.WIDTH,
        height: Arcadia.HEIGHT
      };
      this.size = args.size || DEFAULT_SIZE;
      this.enablePointEvents = true;
      this.camera = {
        target: null,
        viewport: {
          width: this.size.width,
          height: this.size.height
        },
        bounds: {
          top: -this.size.height / 2,
          bottom: this.size.height / 2,
          left: -this.size.width / 2,
          right: this.size.width / 2
        },
        position: {
          x: 0,
          y: 0
        }
      };
    }

    /*
     * @description Update the camera if necessary
     * @param {Number} delta
    */


    Scene.prototype.update = function(delta) {
      Scene.__super__.update.call(this, delta);
      if (!this.camera.target) {
        return;
      }
      this.camera.position.x = this.camera.target.position.x;
      this.camera.position.y = this.camera.target.position.y;
      if (this.camera.position.x < this.camera.bounds.left + this.camera.viewport.width / 2) {
        this.camera.position.x = this.camera.bounds.left + this.camera.viewport.width / 2;
      } else if (this.camera.position.x > this.camera.bounds.right - this.camera.viewport.width / 2) {
        this.camera.position.x = this.camera.bounds.right - this.camera.viewport.width / 2;
      }
      if (this.camera.position.y < this.camera.bounds.top + this.camera.viewport.height / 2) {
        return this.camera.position.y = this.camera.bounds.top + this.camera.viewport.height / 2;
      } else if (this.camera.position.y > this.camera.bounds.bottom - this.camera.viewport.height / 2) {
        return this.camera.position.y = this.camera.bounds.bottom - this.camera.viewport.height / 2;
      }
    };

    /*
     * @description Clear context, then re-draw all child objects
     * @param {CanvasRenderingContext2D} context
    */


    Scene.prototype.draw = function(context) {
      if (this.color) {
        context.fillStyle = this.color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      } else {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      }
      return Scene.__super__.draw.call(this, context, this.camera.viewport.width / 2 - this.camera.position.x, this.camera.viewport.height / 2 - this.camera.position.y);
    };

    /*
    @description Getter/setter for camera target
    */


    Scene.property('target', {
      get: function() {
        return this.camera.target;
      },
      set: function(shape) {
        if (!shape || !shape.position) {
          throw new Error('Scene camera target requires a `position` property.');
        }
        return this.camera.target = shape;
      }
    });

    return Scene;

  })(GameObject);

  module.exports = Scene;

}).call(this);


},{"./gameobject.coffee":5}],9:[function(require,module,exports){
(function() {
  var Easie, GameObject, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Easie = require('../vendor/easie.coffee');

  Shape = (function(_super) {
    __extends(Shape, _super);

    /*
    @description Shape constructor
    @param {Object} options Object representing shape options
    */


    function Shape(options) {
      var property;
      if (options == null) {
        options = {};
      }
      Shape.__super__.constructor.call(this, options);
      this.canvas = document.createElement('canvas');
      this.dirty = true;
      this.tweens = [];
      this._color = '#fff';
      this._border = {
        width: 0,
        color: '#fff'
      };
      this._shadow = {
        x: 0,
        y: 0,
        blur: 0,
        color: '#fff'
      };
      this._vertices = 4;
      this._size = {
        width: 10,
        height: 10
      };
      this.speed = 1;
      this.velocity = {
        x: 0,
        y: 0
      };
      this.angularVelocity = 0;
      this.acceleration = {
        x: 0,
        y: 0
      };
      this.debug = false;
      for (property in options) {
        if (options.hasOwnProperty(property)) {
          this[property] = options[property];
        }
      }
      this.anchor = {
        x: this.size.width / 2,
        y: this.size.height / 2
      };
    }

    /*
    @description Getter/setter for color
    */


    Shape.property('color', {
      get: function() {
        return this._color;
      },
      set: function(color) {
        this._color = color;
        return this.dirty = true;
      }
    });

    /*
    @description Getter/setter for border
    */


    Shape.property('border', {
      get: function() {
        return "" + this._border.width + "px " + this._border.color;
      },
      set: function(border) {
        var values;
        values = border.match(/^(\d+)(?:px)? (.+)$/);
        if ((values != null ? values.length : void 0) === 3) {
          this._border.width = parseInt(values[1], 10);
          this._border.color = values[2];
          return this.dirty = true;
        } else {
          return console.warn('Use format "(width)px (color)" when setting borders');
        }
      }
    });

    /*
    @description Getter/setter for shadow
    */


    Shape.property('shadow', {
      get: function() {
        return "" + this._shadow.x + "px " + this._shadow.y + "px " + this._shadow.blur + "px " + this._shadow.color;
      },
      set: function(shadow) {
        var values;
        values = shadow.match(/^(\d+)(?:px)? (\d+)(?:px)? (\d+)(?:px)? (.+)$/);
        if ((values != null ? values.length : void 0) === 5) {
          this._shadow.x = parseInt(values[1], 10);
          this._shadow.y = parseInt(values[2], 10);
          this._shadow.blur = parseInt(values[3], 10);
          this._shadow.color = values[4];
          return this.dirty = true;
        } else {
          return console.warn('Use format "(x)px (y)px (blur)px (color)" when setting shadows');
        }
      }
    });

    Shape.property('vertices', {
      get: function() {
        return this._vertices;
      },
      set: function(verticies) {
        this._vertices = verticies;
        return this.dirty = true;
      }
    });

    Shape.property('size', {
      get: function() {
        return this._size;
      },
      set: function(size) {
        if (size.width < 1) {
          size.width = 1;
        }
        if (size.height < 1) {
          size.height = 1;
        }
        this._size = {
          width: size.width,
          height: size.height
        };
        return this.dirty = true;
      }
    });

    /*
    @description Getter/setter for path
    */


    Shape.property('path', {
      get: function() {
        return this._path;
      },
      set: function(path) {
        this._path = path;
        return this.dirty = true;
      }
    });

    /*
    @description Draw object onto internal <canvas> cache
    */


    Shape.prototype.drawCanvasCache = function() {
      var context;
      if (this.canvas === void 0) {
        return;
      }
      this.canvas.width = this.size.width + this._border.width + Math.abs(this._shadow.x) + this._shadow.blur;
      this.canvas.height = this.size.height + this._border.width + Math.abs(this._shadow.y) + this._shadow.blur;
      if (Arcadia.PIXEL_RATIO > 1) {
        this.canvas.width *= Arcadia.PIXEL_RATIO;
        this.canvas.height *= Arcadia.PIXEL_RATIO;
      }
      this.setAnchorPoint();
      context = this.canvas.getContext('2d');
      context.lineJoin = 'miter';
      context.beginPath();
      if (this.debug) {
        context.lineWidth = 1 * Arcadia.PIXEL_RATIO;
        context.strokeStyle = '#f00';
        context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        context.arc(this.anchor.x, this.anchor.y, 3, 0, 2 * Math.PI, false);
        context.stroke();
      }
      context.translate(this.anchor.x, this.anchor.y);
      if (this.path) {
        this._path(context);
      } else {
        switch (this.vertices) {
          case 2:
            context.moveTo(-this.size.width / 2, -this.size.height / 2);
            context.lineTo(this.size.width / 2, this.size.height / 2);
            break;
          case 3:
            context.moveTo(0, -this.size.height / 2);
            context.lineTo(this.size.width / 2, this.size.height / 2);
            context.lineTo(-this.size.width / 2, this.size.height / 2);
            context.lineTo(0, -this.size.height / 2);
            break;
          case 4:
            context.moveTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
            context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
            context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
            context.lineTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
            context.lineTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
            break;
          default:
            context.arc(0, 0, this.size.width / 2 * Arcadia.PIXEL_RATIO, 0, 2 * Math.PI);
        }
      }
      context.closePath();
      if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
        context.shadowOffsetX = this._shadow.x * Arcadia.PIXEL_RATIO;
        context.shadowOffsetY = this._shadow.y * Arcadia.PIXEL_RATIO;
        context.shadowBlur = this._shadow.blur * Arcadia.PIXEL_RATIO;
        context.shadowColor = this._shadow.color;
      }
      if (this._color) {
        context.fillStyle = this._color;
        context.fill();
      }
      if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
      }
      if (this._border.width && this._border.color) {
        context.lineWidth = this._border.width * Arcadia.PIXEL_RATIO;
        context.strokeStyle = this._border.color;
        context.stroke();
      }
      return this.dirty = false;
    };

    /*
    @description Find the midpoint of the shape
    */


    Shape.prototype.setAnchorPoint = function() {
      var x, y;
      x = this.size.width / 2 + this._border.width / 2;
      y = this.size.height / 2 + this._border.width / 2;
      if (this._shadow.blur > 0) {
        x += this._shadow.blur / 2;
        y += this._shadow.blur / 2;
      }
      if (this._shadow.x < 0) {
        x -= this._shadow.x;
      }
      if (this._shadow.y < 0) {
        y -= this._shadow.y;
      }
      this.anchor.x = x * Arcadia.PIXEL_RATIO;
      return this.anchor.y = y * Arcadia.PIXEL_RATIO;
    };

    /*
    @description Draw object
    @param {CanvasRenderingContext2D} context
    */


    Shape.prototype.draw = function(context, offsetX, offsetY, offsetRotation, offsetScale, offsetAlpha) {
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      if (offsetRotation == null) {
        offsetRotation = 0;
      }
      if (offsetScale == null) {
        offsetScale = 1;
      }
      if (offsetAlpha == null) {
        offsetAlpha = 1;
      }
      context.save();
      context.translate(offsetX * Arcadia.PIXEL_RATIO, offsetY * Arcadia.PIXEL_RATIO);
      if (offsetRotation !== 0) {
        context.rotate(offsetRotation);
      }
      context.translate(this.position.x * Arcadia.PIXEL_RATIO, this.position.y * Arcadia.PIXEL_RATIO);
      if (this.rotation !== 0) {
        context.rotate(this.rotation);
      }
      if (this.scale * offsetScale !== 1) {
        context.scale(this.scale * offsetScale, this.scale * offsetScale);
      }
      if (this.alpha * offsetAlpha < 1) {
        context.globalAlpha = this.alpha * offsetAlpha;
      }
      if (this.dirty) {
        this.drawCanvasCache();
      }
      context.drawImage(this.canvas, -this.anchor.x, -this.anchor.y);
      context.restore();
      return Shape.__super__.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY, this.rotation + offsetRotation, this.scale * offsetScale, this.alpha * offsetAlpha);
    };

    /*
    @description Update object
    @param {Number} delta Time since last update (in seconds)
    */


    Shape.prototype.update = function(delta) {
      var i, obj, property, tween;
      Shape.__super__.update.call(this, delta);
      i = this.tweens.length;
      while (i--) {
        tween = this.tweens[i];
        tween.time += delta * 1000;
        if (tween.time > tween.duration) {
          tween.time = tween.duration;
        }
        if (typeof this[tween.property] === 'object') {
          obj = {};
          for (property in this[tween.property]) {
            if (this[tween.property].hasOwnProperty(property)) {
              obj[property] = tween.easingFunc(tween.time, tween.start[property], tween.change[property], tween.duration);
            }
          }
          this[tween.property] = obj;
        } else {
          this[tween.property] = tween.easingFunc(tween.time, tween.start, tween.change, tween.duration);
        }
        if (tween.time === tween.duration) {
          this.tweens.splice(i, 1);
          if (typeof tween.callback === 'function') {
            tween.callback();
          }
        }
      }
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.position.x += this.velocity.x * this.speed * delta;
      this.position.y += this.velocity.y * this.speed * delta;
      return this.rotation += this.angularVelocity * delta;
    };

    /*
     * @description Basic AABB collision detection
     * @param {Shape} other Shape object to test collision with
    */


    Shape.prototype.collidesWith = function(other) {
      if (this === other) {
        return false;
      }
      return Math.abs(this.position.x - other.position.x) < this.size.width / 2 + other.size.width / 2 && Math.abs(this.position.y - other.position.y) < this.size.height / 2 + other.size.height / 2;
    };

    /*
    @description Add a transition to the `tween` stack
    */


    Shape.prototype.tween = function(property, target, duration, easing, callback) {
      var change, key, obj;
      if (duration == null) {
        duration = 500;
      }
      if (easing == null) {
        easing = 'linearNone';
      }
      change = (function() {
        if (typeof target === 'object') {
          obj = {};
          for (key in this[property]) {
            obj[key] = target[key] - this[property][key];
          }
          return obj;
        } else {
          return target - this[property];
        }
      }).call(this);
      return this.tweens.push({
        time: 0,
        property: property,
        start: this[property],
        change: change,
        duration: duration,
        easingFunc: Easie[easing],
        callback: callback
      });
    };

    return Shape;

  })(GameObject);

  module.exports = Shape;

}).call(this);


},{"../vendor/easie.coffee":11,"./gameobject.coffee":5}],10:[function(require,module,exports){
(function() {
  var GameObject, Sprite,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Sprite = (function(_super) {
    __extends(Sprite, _super);

    /*
    @description Sprite constructor
    @param {Object} options Possible keys: x, y, size, imgsrc
    */


    function Sprite(options) {
      if (options == null) {
        options = {};
      }
      Sprite.__super__.constructor.call(this, options.x, options.y);
      this.size = options.size;
      this.speed = 1;
      this.velocity = {
        x: 0,
        y: 0
      };
      this.img = new Image();
      this.img.src = options.imgsrc;
    }

    /*
    @description Draw object
    @param {CanvasRenderingContext2D} context
    */


    Sprite.prototype.draw = function(context, offsetX, offsetY) {
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      Sprite.__super__.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);
      context.save();
      context.translate(this.position.x + offsetX, this.position.y + offsetY);
      if (this.scale !== 1) {
        context.scale(this.scale, this.scale);
      }
      if (this.rotation !== 0 && this.rotation !== Math.PI * 2) {
        context.rotate(this.rotation);
      }
      context.drawImage(this.img, 0, 0);
      return context.restore();
    };

    /*
    @description Update object
    @param {Number} delta Time since last update (in seconds)
    */


    Sprite.prototype.update = function(delta) {
      Sprite.__super__.update.call(this, delta);
      this.position.x += this.velocity.x * this.speed * delta;
      return this.position.y += this.velocity.y * this.speed * delta;
    };

    /*
    @description Basic collision detection
    @param {Sprite} other Sprite object to test collision with
    */


    Sprite.prototype.collidesWith = function(other) {
      if (this.vertices === 4) {
        return Math.abs(this.position.x - other.position.x) < this.size / 2 + other.size / 2 && Math.abs(this.position.y - other.position.y) < this.size / 2 + other.size / 2;
      } else {
        return Math.sqrt(Math.pow(other.position.x - this.position.x, 2) + Math.pow(other.position.y - this.position.y, 2)) < this.size / 2 + other.size / 2;
      }
    };

    return Sprite;

  })(GameObject);

  module.exports = Sprite;

}).call(this);


},{"./gameobject.coffee":5}],11:[function(require,module,exports){
/*
Easie.coffee (https://github.com/jimjeffers/Easie)
Project created by J. Jeffers

Robert Penner's Easing Equations in CoffeeScript
http://robertpenner.com/easing/

DISCLAIMER: Software provided as is with no warranty of any type. 
Don't do bad things with this :)
*/


(function() {
  this.Easie = (function() {
    function Easie() {}

    Easie.backIn = function(time, begin, change, duration, overshoot) {
      if (overshoot == null) {
        overshoot = 1.70158;
      }
      return change * (time /= duration) * time * ((overshoot + 1) * time - overshoot) + begin;
    };

    Easie.backOut = function(time, begin, change, duration, overshoot) {
      if (overshoot == null) {
        overshoot = 1.70158;
      }
      return change * ((time = time / duration - 1) * time * ((overshoot + 1) * time + overshoot) + 1) + begin;
    };

    Easie.backInOut = function(time, begin, change, duration, overshoot) {
      if (overshoot == null) {
        overshoot = 1.70158;
      }
      if ((time = time / (duration / 2)) < 1) {
        return change / 2 * (time * time * (((overshoot *= 1.525) + 1) * time - overshoot)) + begin;
      } else {
        return change / 2 * ((time -= 2) * time * (((overshoot *= 1.525) + 1) * time + overshoot) + 2) + begin;
      }
    };

    Easie.bounceOut = function(time, begin, change, duration) {
      if ((time /= duration) < 1 / 2.75) {
        return change * (7.5625 * time * time) + begin;
      } else if (time < 2 / 2.75) {
        return change * (7.5625 * (time -= 1.5 / 2.75) * time + 0.75) + begin;
      } else if (time < 2.5 / 2.75) {
        return change * (7.5625 * (time -= 2.25 / 2.75) * time + 0.9375) + begin;
      } else {
        return change * (7.5625 * (time -= 2.625 / 2.75) * time + 0.984375) + begin;
      }
    };

    Easie.bounceIn = function(time, begin, change, duration) {
      return change - Easie.bounceOut(duration - time, 0, change, duration) + begin;
    };

    Easie.bounceInOut = function(time, begin, change, duration) {
      if (time < duration / 2) {
        return Easie.bounceIn(time * 2, 0, change, duration) * 0.5 + begin;
      } else {
        return Easie.bounceOut(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;
      }
    };

    Easie.circIn = function(time, begin, change, duration) {
      return -change * (Math.sqrt(1 - (time = time / duration) * time) - 1) + begin;
    };

    Easie.circOut = function(time, begin, change, duration) {
      return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
    };

    Easie.circInOut = function(time, begin, change, duration) {
      if ((time = time / (duration / 2)) < 1) {
        return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
      } else {
        return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
      }
    };

    Easie.cubicIn = function(time, begin, change, duration) {
      return change * (time /= duration) * time * time + begin;
    };

    Easie.cubicOut = function(time, begin, change, duration) {
      return change * ((time = time / duration - 1) * time * time + 1) + begin;
    };

    Easie.cubicInOut = function(time, begin, change, duration) {
      if ((time = time / (duration / 2)) < 1) {
        return change / 2 * time * time * time + begin;
      } else {
        return change / 2 * ((time -= 2) * time * time + 2) + begin;
      }
    };

    Easie.elasticOut = function(time, begin, change, duration, amplitude, period) {
      var overshoot;
      if (amplitude == null) {
        amplitude = null;
      }
      if (period == null) {
        period = null;
      }
      if (time === 0) {
        return begin;
      } else if ((time = time / duration) === 1) {
        return begin + change;
      } else {
        if (period == null) {
          period = duration * 0.3;
        }
        if ((amplitude == null) || amplitude < Math.abs(change)) {
          amplitude = change;
          overshoot = period / 4;
        } else {
          overshoot = period / (2 * Math.PI) * Math.asin(change / amplitude);
        }
        return (amplitude * Math.pow(2, -10 * time)) * Math.sin((time * duration - overshoot) * (2 * Math.PI) / period) + change + begin;
      }
    };

    Easie.elasticIn = function(time, begin, change, duration, amplitude, period) {
      var overshoot;
      if (amplitude == null) {
        amplitude = null;
      }
      if (period == null) {
        period = null;
      }
      if (time === 0) {
        return begin;
      } else if ((time = time / duration) === 1) {
        return begin + change;
      } else {
        if (period == null) {
          period = duration * 0.3;
        }
        if ((amplitude == null) || amplitude < Math.abs(change)) {
          amplitude = change;
          overshoot = period / 4;
        } else {
          overshoot = period / (2 * Math.PI) * Math.asin(change / amplitude);
        }
        time -= 1;
        return -(amplitude * Math.pow(2, 10 * time)) * Math.sin((time * duration - overshoot) * (2 * Math.PI) / period) + begin;
      }
    };

    Easie.elasticInOut = function(time, begin, change, duration, amplitude, period) {
      var overshoot;
      if (amplitude == null) {
        amplitude = null;
      }
      if (period == null) {
        period = null;
      }
      if (time === 0) {
        return begin;
      } else if ((time = time / (duration / 2)) === 2) {
        return begin + change;
      } else {
        if (period == null) {
          period = duration * (0.3 * 1.5);
        }
        if ((amplitude == null) || amplitude < Math.abs(change)) {
          amplitude = change;
          overshoot = period / 4;
        } else {
          overshoot = period / (2 * Math.PI) * Math.asin(change / amplitude);
        }
        if (time < 1) {
          return -0.5 * (amplitude * Math.pow(2, 10 * (time -= 1))) * Math.sin((time * duration - overshoot) * ((2 * Math.PI) / period)) + begin;
        } else {
          return amplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - overshoot) * (2 * Math.PI) / period) + change + begin;
        }
      }
    };

    Easie.expoIn = function(time, begin, change, duration) {
      if (time === 0) {
        return begin;
      }
      return change * Math.pow(2, 10 * (time / duration - 1)) + begin;
    };

    Easie.expoOut = function(time, begin, change, duration) {
      if (time === duration) {
        return begin + change;
      }
      return change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
    };

    Easie.expoInOut = function(time, begin, change, duration) {
      if (time === 0) {
        return begin;
      } else if (time === duration) {
        return begin + change;
      } else if ((time = time / (duration / 2)) < 1) {
        return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
      } else {
        return change / 2 * (-Math.pow(2, -10 * (time - 1)) + 2) + begin;
      }
    };

    Easie.linearNone = function(time, begin, change, duration) {
      return change * time / duration + begin;
    };

    Easie.linearIn = function(time, begin, change, duration) {
      return Easie.linearNone(time, begin, change, duration);
    };

    Easie.linearOut = function(time, begin, change, duration) {
      return Easie.linearNone(time, begin, change, duration);
    };

    Easie.linearInOut = function(time, begin, change, duration) {
      return Easie.linearNone(time, begin, change, duration);
    };

    Easie.quadIn = function(time, begin, change, duration) {
      return change * (time = time / duration) * time + begin;
    };

    Easie.quadOut = function(time, begin, change, duration) {
      return -change * (time = time / duration) * (time - 2) + begin;
    };

    Easie.quadInOut = function(time, begin, change, duration) {
      if ((time = time / (duration / 2)) < 1) {
        return change / 2 * time * time + begin;
      } else {
        return -change / 2 * ((time -= 1) * (time - 2) - 1) + begin;
      }
    };

    Easie.quartIn = function(time, begin, change, duration) {
      return change * (time = time / duration) * time * time * time + begin;
    };

    Easie.quartOut = function(time, begin, change, duration) {
      return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
    };

    Easie.quartInOut = function(time, begin, change, duration) {
      if ((time = time / (duration / 2)) < 1) {
        return change / 2 * time * time * time * time + begin;
      } else {
        return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
      }
    };

    Easie.quintIn = function(time, begin, change, duration) {
      return change * (time = time / duration) * time * time * time * time + begin;
    };

    Easie.quintOut = function(time, begin, change, duration) {
      return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
    };

    Easie.quintInOut = function(time, begin, change, duration) {
      if ((time = time / (duration / 2)) < 1) {
        return change / 2 * time * time * time * time * time + begin;
      } else {
        return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;
      }
    };

    Easie.sineIn = function(time, begin, change, duration) {
      return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
    };

    Easie.sineOut = function(time, begin, change, duration) {
      return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
    };

    Easie.sineInOut = function(time, begin, change, duration) {
      return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
    };

    return Easie;

  })();

  module.exports = this.Easie;

}).call(this);


},{}]},{},[1])
(1)
});
;