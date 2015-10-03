function init() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.SphereGeometry( 1, 32, 32 );
  var material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
  var sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 0, 1, 0 );
  scene.add( directionalLight );

  camera.position.z = 5;

  var render = function () {
  	requestAnimationFrame( render );

  	// sphere.rotation.x += 0.1;
  	// sphere.rotation.y += 0.1;

  	renderer.render(scene, camera);
  };

  render();
}
