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

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                bikeSize: 1
            }
            this.debugFolder = this.debug.ui.addFolder('bike')
            this.debugFolder.add(debugObject, 'bikeSize', 0, 100, 1)
                .onChange(() =>
                {
                    console.log('value has changed')
                    this.model.scale.set(debugObject.bikeSize, debugObject.bikeSize, debugObject.bikeSize)
                })
        }

        // Resource
        this.resource = this.resources.items.bikeModel

        console.log(this.resource)

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        this.scene.add(this.model)

        this.model.traverse((child) =>
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

    update()
    {
        
    }
}