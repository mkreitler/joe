// Indexers iterate through a list of indeces.

joe.MathEx.Indexer = new joe.ClassEx({
  END_CONDITION: {
    HOLD: 0,
    LOOP: 1,
    PING_PONG: 2
  }
},
{
  sequence: [],
  frameCallbacks: null,
  fps: 0,
  endCondition: 0, // STOP
  timer: 0,
  index: 0,
  direction: 1,
  lastFrame: -1,

  init: function(fps, endCondition, frameCallbacks) {
    var i=0;

    this.fps = fps;
    this.setSequence(endCondition, frameCallbacks, Array.prototype.splice.call(arguments, 2, arguments.length - 2));
  },

  setSequence: function(endCondition, frameCallbacks /* , varArgs sequence */ ) {
    var i = 0,
        iInner = 0;

    this.endCondition = endCondition;
    this.sequence.length = 0;
    this.lastFrame = -1;

    this.frameCallbacks = frameCallbacks;

    for (i=2; i<arguments.length; ++i) {
      if (arguments[i] instanceof Array) {
        for (iInner=0; iInner<arguments[i].length; ++iInner) {
          this.sequence.push(arguments[i][iInner]);
        }
      }
      else {
        this.sequence.push(arguments[i]);
      }
    }
  },

  getIndex: function() {
    var index = Math.max(0, this.index);

    index = Math.min(index, this.sequence.length - 1);

    return this.sequence[index];
  },

  reset: function() {
    this.timer = 0;
  },

  pause: function() {
    joe.UpdateLoop.removeListener(this);
  },

  resume: function() {
    joe.UpdateLoop.addListener(this);
  },

  start: function(bRandomize) {
    this.index = 0;

    if (bRandomize) {
      this.index = Math.floor(Math.random() * this.sequence.length);
    }

    this.timer = this.fps > 0 ? this.index / this.fps : 0;

    joe.UpdateLoop.addListener(this);

    return this.index;
  },

  stop: function() {
    this.pause();
  },

  update: function(dt, gameTime) {
    var sequenceTime = this.fps > 0 ? this.sequence.length / this.fps : 0,
        elapsedTime = 0.0,
        spf = this.sequence.length > 0 ? sequenceTime / this.sequence.length : 0
        tInc = 0,

    // Convert time to MS.
    dt *= 0.001;

    elapsedTime = this.direction * dt;
    
    if (Math.abs(elapsedTime) != 0 && spf > 0) {
      // Must be going backwards.
      switch(this.endCondition) {
        case joe.MathEx.Indexer.END_CONDITION.LOOP:
          while (Math.abs(elapsedTime) > 0) {
            tInc = Math.min(spf, Math.abs(elapsedTime));

            this.timer += this.direction * tInc;
            elapsedTime -= this.direction * tInc;

            if (this.timer < 0) {
              this.timer += sequenceTime;
            }
            else if (this.timer > sequenceTime) {
              this.timer -= sequenceTime;
            }

            this.index = Math.round(this.timer * this.fps);
            this.index = Math.min(this.index, this.sequence.length);

            if (this.index != this.lastFrame) {
              if (this.frameCallbacks && this.frameCallbacks.hasOwnProperty("" + this.index)) {
                this.frameCallbacks["" + this.index].call(this, this.endCondition);
              }

              this.lastFrame = this.index;
            }
          }
        break;

        case joe.MathEx.Indexer.END_CONDITION.PING_PONG:
          while (Math.abs(elapsedTime) > 0) {
            tInc = Math.min(spf, Math.abs(elapsedTime));

            this.timer += this.direction * tInc;
            elapsedTime -= this.direction * tInc;

            if (this.timer < 0) {
              this.timer *= -1;
              this.direction *= -1;
            }
            else if (this.timer > sequenceTime) {
              this.direction *= -1;
              this.timer = sequenceTime - (this.timer - sequenceTime);
            }

            this.index = Math.round(this.timer * this.fps);
            this.index = Math.min(this.index, this.sequence.length);

            if (this.index != this.lastFrame) {
              if (this.frameCallbacks && this.frameCallbacks.hasOwnProperty("" + this.index)) {
                this.frameCallbacks["" + this.index].call(this, this.endCondition);
              }

              this.lastFrame = this.index;
            }
          }
        break;

        default: // Includes case joe.MathEx.Indexef.END_CONDITION.STOP
          while (Math.abs(elapsedTime) > 0) {
            tInc = Math.min(spf, Math.abs(elapsedTime));

            this.timer += this.direction * tInc;
            elapsedTime -= this.direction * tInc;

            if (this.timer < 0) {
              this.timer = 0;
            }
            else if (this.timer > sequenceTime) {
              this.timer = sequenceTime;
            }

            this.index = Math.round(this.timer * this.fps);
            this.index = Math.min(this.index, this.sequence.length);

            if (this.index != this.lastFrame) {
              if (this.frameCallbacks && this.frameCallbacks.hasOwnProperty("" + this.index)) {
                this.frameCallbacks["" + this.index].call(this, this.endCondition);
              }

              this.lastFrame = this.index;
            }
          }
        break;
      }
    }

    this.index = Math.floor(this.timer * this.fps);
  }
});