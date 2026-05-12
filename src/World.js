import * as THREE from 'three'

export class World {
    constructor(scene) {
        this.scene = scene
        this.createFloor()
        this.createWalls()
        this.createDecorations()
    }

    createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(200, 200)
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.1
        })
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -Math.PI / 2
        floor.position.y = 0
        floor.receiveShadow = true
        this.scene.add(floor)
    }

    createWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.7,
            metalness: 0
        })

        // Parede frontal
        const frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(100, 20, 2),
            wallMaterial
        )
        frontWall.position.set(0, 10, -50)
        frontWall.castShadow = true
        frontWall.receiveShadow = true
        this.scene.add(frontWall)

        // Parede traseira
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(100, 20, 2),
            wallMaterial
        )
        backWall.position.set(0, 10, 50)
        backWall.castShadow = true
        backWall.receiveShadow = true
        this.scene.add(backWall)

        // Parede esquerda
        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(2, 20, 100),
            wallMaterial
        )
        leftWall.position.set(-50, 10, 0)
        leftWall.castShadow = true
        leftWall.receiveShadow = true
        this.scene.add(leftWall)

        // Parede direita
        const rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(2, 20, 100),
            wallMaterial
        )
        rightWall.position.set(50, 10, 0)
        rightWall.castShadow = true
        rightWall.receiveShadow = true
        this.scene.add(rightWall)

        // Pilares internos
        this.createPillar(-20, 0, -20)
        this.createPillar(20, 0, -20)
        this.createPillar(-20, 0, 20)
        this.createPillar(20, 0, 20)
    }

    createPillar(x, y, z) {
        const pillarGeometry = new THREE.CylinderGeometry(1.5, 1.5, 20, 8)
        const pillarMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.6
        })
        
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
        pillar.position.set(x, y + 10, z)
        pillar.castShadow = true
        pillar.receiveShadow = true
        this.scene.add(pillar)
    }

    createDecorations() {
        // Caixas misteriosas espalhadas
        for (let i = 0; i < 5; i++) {
            const boxGeometry = new THREE.BoxGeometry(
                Math.random() * 3 + 1,
                Math.random() * 3 + 1,
                Math.random() * 3 + 1
            )
            const boxMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.3, 0.3),
                roughness: 0.8
            })
            
            const box = new THREE.Mesh(boxGeometry, boxMaterial)
            box.position.set(
                (Math.random() - 0.5) * 80,
                boxGeometry.parameters.height / 2,
                (Math.random() - 0.5) * 80
            )
            box.castShadow = true
            box.receiveShadow = true
            this.scene.add(box)
        }
    }
}
