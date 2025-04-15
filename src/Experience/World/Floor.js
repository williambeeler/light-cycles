import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        //Numerical values
        this.floorSize = 24
        this.floorRepeat = 28.5

        this.setGrid()

        // this.setGeometry()
        // this.setTextures()
        // this.setMaterial()
        // this.setMesh()
        this.debugMe()

    }

    debugMe()
    {
        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                floorSize: this.floorSize,
                floorRepeat: this.floorRepeat
            }
            this.debugFolder = this.debug.ui.addFolder('Floor')
            this.debugFolder.add(debugObject, 'floorSize', 0, 100, 1)
                .onChange(() =>
                {
                    this.geometry.scale(debugObject.floorSize, debugObject.floorSize, 1)
                    this.mesh.updateMatrix()
                    console.log(this.mesh)
                })
            this.debugFolder.add(debugObject, 'floorRepeat', 0, 30, 0.1)
                .onChange(() =>
                {
                    this.textures.color.repeat.set(debugObject.floorRepeat, debugObject.floorRepeat)
                })
        }
    }

    setGrid() 
    {
        // Grid
        const grid = new THREE.GridHelper(100, 20, 0x00ffff, 0x00ffff);
        this.grid = grid
        this.scene.add(this.grid);
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(this.floorSize, this.floorSize)
    }

    setTextures()
    {
        // this.textures = {}

        //Color texture of the ground
        // this.textures.color = this.resources.items.tronFloorTexture
        // this.textures.color.colorSpace = THREE.SRGBColorSpace
        // this.textures.color.repeat.set(this.floorRepeat, this.floorRepeat)
        // this.textures.color.wrapS = THREE.RepeatWrapping
        // this.textures.color.wrapT = THREE.RepeatWrapping

        //Normal texture of the ground
        // this.textures.normal = this.resources.items.tronFloorNormalTexture
        // this.textures.normal.repeat.set(1.5, 1.5)
        // this.textures.normal.wrapS = THREE.RepeatWrapping
        // this.textures.normal.wrapT = THREE.RepeatWrapping
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }
}