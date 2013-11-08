var container, stats;

			var camera, scene, renderer;

			var mouseX = 0, mouseY = 0, mouseBtn = -1;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;


			init();

      function addControls() {
          lastTime = performance.now();
          controls =  new THREE.FirstPersonControls(camera, container);
          controls.mouseX = 0;
          controls.mouseY = 0;
          controls.movementSpeed = .002;
          controls.lookSpeed = 0.00007;
          controls._lookSpeed = controls.lookSpeed;
          moveCameraToStart(true);
      }

			function init() {

        container = document.getElementById('three-container');
				container.style.backgroundColor = '#000000';

				camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 0.01, 50 );
        initCameraPosition = new THREE.Vector3(4.2, 5.8, 14);
				camera.position.x = 1;
				camera.position.y = 1;
				camera.position.z = 2;

				// scene

				scene = new THREE.Scene();

        fog = new THREE.FogExp2(0xd8e7ff, 0.07);

        scene.fog = fog;
				var ambient = new THREE.AmbientLight( 0x111111 );
				scene.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 1, 1, 1 );
				scene.add( directionalLight );

				var manager = new THREE.LoadingManager(function() {
          removeLoading();
					scene.add(mesh);
          lastTime = performance.now();
          animate();
          addControls();
				});

				var texture = new THREE.Texture();

				var objects = [];

        objects.push('cluj');
        var translateMatrix = new THREE.Matrix4();
        translateMatrix.makeTranslation(93, 0, 13);
        //var transforms = {
          //'cluj': translateMatrix
        //};
				var geo = new THREE.Geometry();
        var earth = new THREE.CubeGeometry(1000, 0.00001, 1000);
        var earth_matrix = new THREE.Matrix4();
        earth_matrix.makeTranslation(0, -0.61, 0);
        earth.applyMatrix(earth_matrix);
        THREE.GeometryUtils.merge(geo, earth);
				var material = new THREE.MeshLambertMaterial();
        //material.ambient(0x)

				objects.forEach(function(name) {


					var loader = new THREE.OBJLoader( manager );
					loader.load( 'http://madeincluj.s3.amazonaws.com/3d/' + name + '.obj', function ( object ) {

            object.traverse(function(child){
                if (child instanceof THREE.Mesh) {
                  THREE.GeometryUtils.merge(geo, child);
                }
            });

          });
				});

        mesh = new THREE.Mesh( geo, material );

				renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );
				renderer.setClearColor( 0xd8e7ff );
				renderer.setSize( container.offsetWidth, container.offsetHeight );
        renderer.domElement.style.padding = 0;
        renderer.domElement.style.margin = 0;

				container.appendChild( renderer.domElement );
        var backButton = document.getElementById('back-home');
        backButton.addEventListener('click', moveCameraToStart);

        camera.lookAt(scene.position.clone());

			}

      function moveCameraToStart(firstRun) {
        controls.freeze = true;
        var diff = camera.position.clone().sub(initCameraPosition),
            threshold = 0.5;
        if (Math.abs(diff.x) >= threshold ||
            Math.abs(diff.y) >= threshold ||
            Math.abs(diff.z) >= threshold) {
          requestAnimationFrame(moveCameraToStart);
          if (Math.abs(diff.x) >= threshold) {
            camera.translateX(-controls.movementSpeed * diff.x * 15);
          }
          if (Math.abs(diff.y) >= threshold) {
            camera.translateY(-controls.movementSpeed * diff.y * 15);
          }
          if (Math.abs(diff.z) >= threshold) {
            camera.translateZ(-controls.movementSpeed * diff.z * 15);
          }
          camera.updateMatrixWorld();
          camera.updateMatrix();
        } else {
          if (firstRun) {
              controls.mouseX = 0;
              controls.mouseY = 0;
              controls.lat = -25;
              controls.lon = -106.6495033800851;
              controls.target = scene.position.clone();
              controls.freeze = false;
          } else {
              controls.mouseX = 0;
              controls.mouseY = 0;
              controls.lat = -34.6405691800904;
              controls.lon = -106.6495033800851;
              controls.target = scene.position.clone();
              controls.freeze = false;
          }
        }
        camera.lookAt(scene.position);
      }

      function render() {
        var time = performance.now();
        if (typeof controls !='undefined') controls.update(time - lastTime);
        lastTime = time;
        renderer.render( scene, camera );
      }
      
			function animate(e) {
        requestAnimationFrame( animate );
        render();
			}

     function onWindowResize() {

				windowHalfX = container.offsetWidth / 2;
				windowHalfY = container.offsetHeight / 2;

				camera.aspect = container.offsetWidth / container.offsetHeight;
				camera.updateProjectionMatrix();

				renderer.setSize(container.offsetWidth, container.offsetHeight);
     }

			function removeLoading() {
				var loading = document.getElementById('loading');
				var controls = document.getElementById('control-panel');
        document.body.removeChild(loading);
        controls.style.display = 'block';
			}