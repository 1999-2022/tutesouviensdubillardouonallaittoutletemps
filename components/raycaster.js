(function() {
    /**
     * Props
     */
    const player = game.player
    const raycaster = new THREE.Raycaster()
    const impulse = 125
    let mouse = new THREE.Vector2()
    let powerAim

    /**
     * Meshes
     */

    const powerGeo = new THREE.Geometry()
    powerGeo.vertices.push(new THREE.Vector3(0, 0, 0))
    const powerMesh = new THREE.Line(
        powerGeo,
        new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 3
        })
    )
    powerMesh.visible = false
    game.scene.add(powerMesh)

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(3000, 3000, 1, 1), 
        new THREE.MeshBasicMaterial({
            color: 0xcccccc, 
            side: THREE.FrontSide
        })
    )
    plane.rotation.x = Math.PI / -2
    plane.position.y = 5
    plane.visible = false
    game.scene.add(plane)

    /**
     * Physics
     */

    const usePower = function() {
        if (player.position && powerAim){
            powerMesh.geometry.vertices[0] = player.position
            powerMesh.geometry.vertices[1] = powerAim
            
            powerMesh.geometry.verticesNeedUpdate = true
        }
    }

    const getMousePos = (event, object) => {
        const x = event.clientX || event.originalEvent.targetTouches[0].clientX
        const y = event.clientY || event.originalEvent.targetTouches[0].clientY
        
        mouse = new THREE.Vector2()
        mouse.x = (x / window.innerWidth) * 2 - 1
        mouse.y = -(y / window.innerHeight) * 2 + 1
        
        raycaster.setFromCamera(mouse, game.camera)
        return raycaster.intersectObject(object)
    }

    const mouseUpHandler = () => {
        window.removeEventListener("mousemove", mouseMoveHandler)
        window.removeEventListener("mouseup", mouseUpHandler)
        powerMesh.visible = false

        const vector = powerAim.sub(player.position)
        player.applyCentralImpulse(vector.negate().multiplyScalar(impulse))
    }

    const mouseDownHandler = (event) => {
        const intersects = getMousePos(event, player)

        if (intersects[0]) {
            window.addEventListener("mousemove", mouseMoveHandler)
            window.addEventListener("mouseup", mouseUpHandler)
        }
    }

    const mouseMoveHandler = (event) => {
        const intersects = getMousePos(event, plane)
        
        if (intersects[0]) {
            powerMesh.visible = true
            powerAim = intersects[0].point
            powerAim.y = powerAim.y + game.player.geometry.parameters.radius
            usePower()
        }
    }

    window.addEventListener("mousedown", mouseDownHandler)


    const drawPowerLine = function(){
        if (powerMesh.visible) usePower()
        requestAnimationFrame(drawPowerLine)
    }

    drawPowerLine()
})()