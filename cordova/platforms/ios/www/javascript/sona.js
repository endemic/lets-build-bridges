var Sona;

Sona = (function() {
  function Sona(sources) {
    var StandardAudioContext;
    StandardAudioContext = typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : AudioContext;
    this.supported = !!StandardAudioContext;
    if (!this.supported) {
      return;
    }
    this.context = new StandardAudioContext();
    this.sources = sources;
    this.buffers = {};
    this.sounds = {};
  }

  Sona.prototype.load = function(callback) {
    var request, source;
    if (!this.supported) {
      return;
    }
    source = this.sources.shift();
    request = new XMLHttpRequest();
    request.open('GET', source.url, true);
    request.responseType = 'arraybuffer';
    request.onload = (function(_this) {
      return function() {
        return _this.context.decodeAudioData(request.response, function(buffer) {
          _this.buffers[source.id] = buffer;
          return _this.next(callback);
        }, function(e) {
          return _this.next(callback);
        });
      };
    })(this);
    return request.send();
  };

  Sona.prototype.next = function(callback) {
    if (this.sources.length) {
      return this.load(callback);
    } else if (typeof callback === 'function') {
      return callback();
    }
  };

  Sona.prototype.play = function(id, _loop) {
    if (_loop == null) {
      _loop = false;
    }
    if (!this.supported || this.buffers[id] === void 0) {
      return;
    }
    this.sounds[id] = this.sounds[id] || {};
    this.sounds[id].sourceNode = this.context.createBufferSource();
    this.sounds[id].sourceNode.buffer = this.buffers[id];
    this.sounds[id].sourceNode.loop = _loop;
    if (!this.sounds[id].gainNode) {
      this.sounds[id].gainNode = this.context.createGain();
      this.sounds[id].gainNode.connect(this.context.destination);
    }
    this.sounds[id].sourceNode.connect(this.sounds[id].gainNode);
    return this.sounds[id].sourceNode.start(0);
  };

  Sona.prototype.loop = function(id) {
    return this.play(id, true);
  };

  Sona.prototype.stop = function(id) {
    if (!this.supported || this.sounds[id] === void 0) {
      return;
    }
    return this.sounds[id].sourceNode.stop(0);
  };

  Sona.prototype.getVolume = function(id) {
    if (!this.supported || this.sounds[id] === void 0) {
      return;
    }
    return this.sounds[id].gainNode.gain.value;
  };

  Sona.prototype.setVolume = function(id, volume) {
    if (!this.supported || this.sounds[id] === void 0) {
      return;
    }
    return this.sounds[id].gainNode.gain.value = volume;
  };

  return Sona;

})();

if (typeof exports !== 'undefined') {
  module.exports = Sona;
} else {
  window.Sona = Sona;
}
