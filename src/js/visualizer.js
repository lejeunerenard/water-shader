var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

function Visualizer( options ) {
   options = options || {};

   this.audio = options.audio;

   this.maxLines = options.maxLines || 200;
   this.maxRadius = options.maxRadius || 20;

   this.createScene(options);
}
Visualizer.prototype.createScene = function createScene() {

   // Render pass camera and scene
   this.renderer = new THREE.WebGLRenderer();
   this.renderer.setSize( window.innerWidth, window.innerHeight );
   this.renderer.setClearColor( 0x111111 );
   document.querySelector('body').appendChild( this.renderer.domElement );

   this.scene = new THREE.Scene();

   this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
   this.camera.position.z = 30;
   this.scene.add( this.camera );

   this.controls = new OrbitControls(this.camera);


   // Lighting
   var ambientLight = new THREE.AmbientLight(0x222222);
   this.scene.add(ambientLight);

   // directional lighting
   var directionalLight = new THREE.PointLight(0xFFFFFF, 1, 500);
   directionalLight.position.set(50, -50, 50);
   this.scene.add(directionalLight);

   var geo = new THREE.SphereGeometry( 10, 32, 32 );
   var material = new THREE.ShaderMaterial({
      uniforms: {
         time: { type: "f", value: 1.0 }
      },
      vertexShader: document.querySelector('#vertexShader').textContent,
      fragmentShader: document.querySelector('#fragShader').textContent
   });
   this.sphere = new THREE.Mesh( geo, material );
   this.scene.add( this.sphere );
};
Visualizer.prototype.update = function update() {
   this.sphere.material.uniforms.time.value += 0.05;
   this.renderer.render( this.scene, this.camera );
};
module.exports = Visualizer;
