((window) => {
	/**
	 * Base
	 */

	const container = document.querySelector("#container")

	Physijs.scripts.worker = "physijs_worker.js"
	Physijs.scripts.ammo = "ammo.js"

	/**
	 * Renderer
	 */

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		powerPreference: "high-performance",
		alpha: true
	})
	renderer.setSize(innerWidth, innerHeight)
	renderer.shadowMapEnabled = true
	renderer.shadowMapType = THREE.PCFSoftShadowMap

	/**
	 * Scene
	 */

	scene = new Physijs.Scene()
	scene.setGravity(new THREE.Vector3(0, -800, 0))

	/**
	 * Camera
	 */

	const aspectRatio = window.innerWidth / window.innerHeight
	const camera = new THREE.OrthographicCamera(
		-400 * aspectRatio, 400 * aspectRatio, 400, -400, 1, 2500
	)
	camera.position.set(800, 400, 800)
	camera.lookAt(new THREE.Vector3(0,0,0))
	scene.add(camera)

	/**
	 * Lightning
	 */

	const dirLight = new THREE.DirectionalLight(0x003fff, 1)
    
    dirLight.position.set(-200, 300, 200)
    
    dirLight.castShadow = true
    dirLight.shadowCameraVisible = false
    dirLight.shadowDarkness = 0.5
    dirLight.shadowCameraFov = 60
    dirLight.shadowCameraNear = 10
    dirLight.shadowCameraFar = 800
    
    scene.add(dirLight)

	/**
	 * Player
	 */

	const playerProps = {
		color: 0xffff00,
		radius: 8,
		segments: 24,
		rings: 24,
		mass: 100
	}

	const playerGeo = new THREE.SphereGeometry(
		playerProps.radius, 
		playerProps.segments,
		playerProps.rings
	)
	const playerMat = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({
			color: playerProps.color,
			side: THREE.DoubleSide
		}), 1, 1
	)
	
	const player = new Physijs.SphereMesh(
		playerGeo, playerMat, playerProps.mass
	)
	player.setLinearFactor(new THREE.Vector3(0, 0, 0))
	player.castShadow = true
	player.position.y = 30
	player.position.z = -200
	
	scene.add(player)

	const movePlayer = () => {
	    if (player.position.y < -50) {
	    	player.position.x = 0
	    	player.position.y = 20
	    	player.position.z = 200

	    	player.setLinearVelocity(new THREE.Vector3(0,0,0))
	    	player.setAngularVelocity(new THREE.Vector3(0,0,0))
	    	player.__dirtyPosition = true
	    }
	}

	movePlayer()

	/**
	 * Render
	 */

	const render = () => {
		scene.simulate()
	    renderer.render(scene, camera)
        requestAnimationFrame(render)
	}
	container.append(renderer.domElement) 
	render()

	/**
	 * Export
	 */

	const game = {
		scene: scene,
		camera: camera,
		container: container,
		player: player
	}

	window.game = game
})(this)
