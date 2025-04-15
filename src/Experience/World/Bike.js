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
        this.player.lives = 3
        this.player.score = 0
        this.player.engineStart = false
        this.player.speed = 0.1
        this.player.mostRecentDirection = null //up, left, right

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                bikeSize: this.player.bikeSize,
                bikeLocationY: this.player.bikeLocationY 
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
        }

        // Resource
        this.resource = this.resources.items.bikeModel

        this.setModel()
        this.setAnimation()

        //Add to the player object
        this.player.lastTurnPos = this.player.model.position.clone()
        this.player.direction = new THREE.Vector3(1, this.player.bikeLocationY, 0); // start moving +X

        //Controls event listener
        document.addEventListener('keydown', this.setControls.bind(this, this.player));
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

    setControls(player, e)
    {
        if (e.key === 'ArrowUp' && player.direction.z !== -1) {
            player.engineStart = true
            player.direction.set(0, 0, -1)
            player.mostRecentDirection = 'up'
            // player.direction.rotateX(0, 0, -1)
        }
        if (e.key === 'ArrowDown' && player.direction.z !== 1) {
            player.direction.set(0, 0, 0)
            player.engineStart = false
            player.mostRecentDirection = 'back'
            // player.speed = 0
        }
        if (e.key === 'ArrowLeft' && player.direction.x !== -1) {
            player.direction.set(-1, 0, 0)
            player.mostRecentDirection = 'left'
            player.model.rotation.y += Math.PI / 2;
        }
        if (e.key === 'ArrowRight' && player.direction.x !== 1) {
            player.direction.set(1, 0, 0)
            player.mostRecentDirection = 'right'
            player.model.rotation.y -= Math.PI / 2;
        }
        this.addTrailSegment(player)
        console.log(e.key)
    }

    addTrailSegment(player) {
        const currentPos = player.model.position.clone()
        const length = currentPos.distanceTo(player.lastTurnPos);
      
        const mid = currentPos.clone().add(player.lastTurnPos).multiplyScalar(0.5)
        const isX = player.direction.x !== 0
      
        const geometry = new THREE.BoxGeometry(isX ? length : 1, 1, isX ? 1 : length)
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, opacity: 1, transparent: false })
        const segment = new THREE.Mesh(geometry, material)
        segment.position.copy(mid)
        segment.position.y = 0.5
      
        player.trail.push(segment)
        this.scene.add(segment)
      
        player.lastTurnPos = currentPos.clone()
    }    

    update()
    {
        // Move player
        if (this.player.engineStart == true) {
            this.player.model.position.addScaledVector(this.player.direction, this.player.speed)
            console.log(this.player.model.position)
        }
    }
}