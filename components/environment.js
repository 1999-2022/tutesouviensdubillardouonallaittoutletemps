(() => {
	/**
	 * Plane
	 */

	const planeProps = {
		color: 0x6687f5,
		x: 200,
		y: 10,
		z: 600
	}

	const plane = new Physijs.BoxMesh(
		new THREE.BoxGeometry(
			planeProps.x, planeProps.y, planeProps.z, 1, 1, 1
		),
		Physijs.createMaterial(new THREE.MeshLambertMaterial({
			color: planeProps.color, 
			side: THREE.DoubleSide
		}), 1, 0.5), 
		0
	)

	plane.receiveShadow = true
	game.scene.add(plane)

	/**
	 * Collision
	 */

	const borderMesh = (x, z, w, h, rotate) => {
	    const border = new Physijs.BoxMesh(
	      new THREE.BoxGeometry(w, 10, h),
	      Physijs.createMaterial(
	        new THREE.MeshPhongMaterial({color: 0xeeefff}), 0.2, 1.0    
	      ), 0 
	    )
	    border.position.set(x, 10, z)
		if (rotate) border.rotation.set(0, Math.PI / 2, 0)
	    border.visible = true
	    return border
  	}

  	game.scene.add(borderMesh(-100, 0, 5, 600 - 50))
  	game.scene.add(borderMesh(100, 0, 5, 600 - 50))
  	game.scene.add(borderMesh(0, 300, 5, 200 - 50, true))
  	game.scene.add(borderMesh(0, -300, 5, 200 - 50, true))

	/**
	 * Balls
	 */

	const ballsProps = {
		color: 0xe6f2e5,
		total: 6,
		radius: 8,
		segments: 40,
		rings: 24,
		mass: 17.5,
		offset: {
			x: 0,
			z: 100
		}
	}
	
	let balls = []

	for (let i = 0; i < ballsProps.total; i++) {
		const ball = new Physijs.SphereMesh(
			new THREE.SphereGeometry(
				ballsProps.radius,
				ballsProps.segments,
				ballsProps.rings
			),
			Physijs.createMaterial(
				new THREE.MeshPhongMaterial({
					color: ballsProps.color,
					side: THREE.DoubleSide
				}), 1, 1
			),
			ballsProps.mass
		)

		ball.setLinearFactor(new THREE.Vector3(0, 0, 0))
		ball.castShadow = true
		ball.receiveShadow = true
		ball.position.set(0, 100 * i + (100 / 2), 0)
		
		balls.push(ball)
	}

	balls[0].position.set(0 + ballsProps.offset.x, 100 / 2, ballsProps.offset.z)
	balls[1].position.set(-30 + ballsProps.offset.x, 100 / 2, ballsProps.offset.z)
	balls[2].position.set(30 + ballsProps.offset.x, 100 / 2, ballsProps.offset.z)
	balls[3].position.set(-15 + ballsProps.offset.x, 100 / 2 + 100, ballsProps.offset.z)
	balls[4].position.set(15 + ballsProps.offset.x, 100 / 2 + 100, ballsProps.offset.z)
	balls[5].position.set(0 + ballsProps.offset.x, 100 / 2 + (2 * 100), ballsProps.offset.z)

	balls.forEach((ball) => {
		game.scene.add(ball)
	})
})()