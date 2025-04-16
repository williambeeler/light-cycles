import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Bike
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        //Player object
        this.player = {}
        this.player.trail = []
        this.player.bikeSize = 0.7
        this.player.bikeLocationY = 0.16
        this.player.direction = new THREE.Vector3(0, 0, 0)
        this.player.lives = 3
        this.player.score = 0
        this.player.speed = 0.1
        this.player.isMoving = false
        this.player.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        }
        this.player.turnAngle = Math.PI / 2
        // Track rotation angle (Y-axis rotation in radians)
        this.player.rotationY = 0 // Initial rotation
        

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                bikeSize: this.player.bikeSize,
                bikeLocationY: this.player.bikeLocationY,
                bikeRotate: 0
            }
            this.debugFolder = this.debug.ui.addFolder('bike')
            this.debugFolder.add(debugObject, 'bikeSize', 0, 100, 0.01)
                .onChange(() =>
                {
                    this.model.scale.set(debugObject.bikeSize, debugObject.bikeSize, debugObject.bikeSize)
                })
            this.debugFolder.add(debugObject, 'bikeLocationY', -20, 20, 0.01)
                .onChange(() =>
                {
                    this.model.position.set(this.model.position.x, debugObject.bikeLocationY, this.model.position.z)
                })
            this.debugFolder.add(debugObject, 'bikeRotate', 0, 360, 0.01)
                .onChange(() =>
                {
                    this.player.model.rotation.y = debugObject.bikeRotate
                })
        }

        // Resource
        this.resource = this.resources.items.bikeModel

        this.setModel()
        this.setAnimation()

        //Add to the player object
        this.player.lastTurnPos = this.player.model.position.clone()

        //Controls event listener
        // document.addEventListener('keydown', this.setControls.bind(this, this.player))
        document.addEventListener('keydown', this.playerKeydown.bind(this, this.player))
        document.addEventListener('keyup', this.playerKeyup.bind(this, this.player));


        console.log(this.player)
    }

    /*
    * Orients the model itself based on directional movement
    */
    modelOrientation(player)
    {

    }

    playerKeydown(player, e)
    {
        if (player.keys.hasOwnProperty(e.key)) {
            player.keys[e.key] = true
            player.isMoving = true

            // Handle left/right turns immediately on keydown
            if (e.key === 'ArrowLeft') {
                player.rotationY += player.turnAngle // Turn 45 degrees left
                player.model.rotation.y = player.rotationY
            } else if (e.key === 'ArrowRight') {
                player.rotationY -= player.turnAngle // Turn 45 degrees right
                player.model.rotation.y = player.rotationY
            }

        }
    }

    playerKeyup(player, e)
    {
        if (player.keys.hasOwnProperty(e.key)) {
            player.keys[e.key] = false
            player.isMoving = false
        }
    }

    setModel()
    {
        this.player.model = this.resource.scene
        this.player.model.scale.set(this.player.bikeSize, this.player.bikeSize, this.player.bikeSize)
        this.player.model.position.set(0, this.player.bikeLocationY, 0)
        this.scene.add(this.player.model)

        this.player.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        
    }


    // addTrailSegment(player) {
    //     const currentPos = player.model.position.clone()
    //     const length = currentPos.distanceTo(player.lastTurnPos);
      
    //     const mid = currentPos.clone().add(player.lastTurnPos).multiplyScalar(0.5)
    //     const isX = player.direction.x !== 0
      
    //     const geometry = new THREE.BoxGeometry(isX ? length : 1, 1, isX ? 1 : length)
    //     const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, opacity: 1, transparent: false })
    //     const segment = new THREE.Mesh(geometry, material)
    //     segment.position.copy(mid)
    //     segment.position.y = 0.5
      
    //     player.trail.push(segment)
    //     this.scene.add(segment)
      
    //     player.lastTurnPos = currentPos.clone()
    // }    

    update()
    {
        // Move player
        if (this.player.isMoving == true) {
            console.log(this.player.model.position)

            // Reset direction
            this.player.direction.set(0, 0, 0);

            // Prevent diagonal movement by prioritizing one direction
            if (this.player.keys.ArrowUp) {
                this.player.direction.z = 1; // Move forward
            } else if (this.player.keys.ArrowDown) {
                this.player.direction.z = -1; // Move backward
            } else if (this.player.keys.ArrowLeft) {
                // this.player.direction.x = -1; // Move left
            } else if (this.player.keys.ArrowRight) {
                // this.player.direction.x = 1; // Move right
            }

            // Apply movement in world space based on rotation
            if (this.player.direction.length() > 0) {
                // Transform direction to world space using model's rotation
                const moveDirection = this.player.direction.clone().applyQuaternion(this.player.model.quaternion);
                this.player.model.position.x += moveDirection.x * this.player.speed;
                this.player.model.position.z += moveDirection.z * this.player.speed;
            }

        }
    }
}