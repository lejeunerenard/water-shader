// var Engine = require('./audioEngine.js');
var Visualizer = require('./visualizer.js');

// var engine = new Engine();
var visualizer = new Visualizer({
   // audio: engine
});

var tick = function tick() {
   requestAnimationFrame(tick);

   //engine.update();
   visualizer.update();
};
tick();
