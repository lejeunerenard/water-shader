// Polyfills
require('./audioContext-polyfill.js');
navigator.getUserMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia );

function Engine( options ) {
   options = options || {};

   this.ctx = new window.AudioContext();

   // Declare vars
   this.volume     = 0;
   this.levelsData = [];

   // Config vars
   this.levelsCount = options.levelsCount || 16;
   this.sample = options.sample || 'audio/luise-sola.mp3';

   // Nodes
   this.analyser = this.ctx.createAnalyser();
   this.analyser.smoothingTimeConstant = 0.3; //smooths out bar chart movement over time
   this.analyser.fftSize = 1024;
   this.analyser.connect(this.ctx.destination); // always the destination


   // Load asynchronously
   var request = new XMLHttpRequest();
   request.open("GET", this.sample, true);
   request.responseType = "arraybuffer";

   this.source = this.ctx.createBufferSource();
   this.source.connect(this.analyser);

   var self = this;
   request.onload = function() {
      self.ctx.decodeAudioData(request.response, function(buffer) {
         self.source.buffer = buffer;
         self.source.loop = true;
         self.source.start(0.0);

      }, function(e) {
         console.log(e);
      });
   };
   request.send();

   // Aux info
   this.binCount = this.analyser.frequencyBinCount;
   this.levelBins = Math.floor(this.binCount / this.levelsCount); //number of bins in each level

   // Data
   this.freqByteData = new Uint8Array(this.binCount);
}
Engine.prototype.hasGetUserMedia = function hasGetUserMedia() {
   return !!(navigator.getUserMedia);
};

Engine.prototype.enableMic = function enableMic() {
   var errorCallback = function(e) {
      console.error('Reeeejected!', e);
   };

   if (engine.hasGetUserMedia()) {
      // Good to go!
      console.log('yay! \\(^.^ )/');

      // Not showing vendor prefixes.
      navigator.getUserMedia({audio: true}, function(stream) {
         var microphone = engine.ctx.createMediaStreamSource(stream);

         // microphone -> inverter -> destination.
         microphone.connect(engine.ctx.destination);
      }, errorCallback);
   } else {
      alert('getUserMedia() is not supported in your browser');
   }
};
Engine.prototype.update = function update() {
   this.analyser.getByteFrequencyData(this.freqByteData); //<-- bar chart

   var sum = 0,
       j = 0,
       i = 0;

   //normalize levelsData from freqByteData
   for(i = 0; i < this.levelsCount; i++) {
      sum = 0;
      for(j = 0; j < this.levelBins; j++) {
         sum += this.freqByteData[(i * this.levelBins) + j];
      }
      this.levelsData[i] = sum / this.levelBins / 256; //freqData maxs at 256
   }

   // Get average
   sum = 0;
   for(j = 0; j < this.levelsCount; j++) {
      sum += this.levelsData[j];
   }

   this.volume = sum / this.levelsCount;
};

module.exports = Engine;
