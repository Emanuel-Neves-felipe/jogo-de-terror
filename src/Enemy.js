import * as THREE from 'three'

export class Enemy {
    constructor(x, y, z) {
        this.group = new THREE.Group()
        this.group.position.set(x, y, z)
        
        this.health = 50
        this.maxHealth = 50
        this.speed = 5
        this.detectionRange = 80
        this.attackRange = 3
        this.lastAttackTime = 0
        this.attackCooldown = 1
        
        this.createModel()
        
        this.targetPosition = new THREE.Vector3()
        this.velocity = new THREE.Vector3()
    }

    createModel() {
        // Corpo
        const bodyGeometry = new THREE.CapsuleGeometry(0.8, 2, 8, 16)
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.4,
            metalness: 0.1,
            emissive: 0x330000
        })
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
        body.castShadow = true
        body.receiveShadow = true
        this.group.add(body)

        // Cabeça
        const headGeometry = new THREE.SphereGeometry(0.6, 16, 16)
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc0000,
            roughness: 0.5,
            emissive: 0x220000
        })
        
        const head = new THREE.Mesh(headGeometry, headMaterial)
        head.position.y = 1.5
        head.castShadow = true
        head.receiveShadow = true
        this.group.add(head)

        // Olhos
        const eyeGeometry = new THREE.SphereGeometry(0.2, 8, 8)
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00
        })
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
        leftEye.position.set(-0.2, 1.8, 0.5)
        this.group.add(leftEye)
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
        rightEye.position.set(0.2, 1.8, 0.5)
        this.group.add(rightEye)

        // Braços
        this.createLimb(0.3, 0.6, 1)
        this.createLimb(-0.3, 0.6, 1)
    }

    createLimb(offsetX, offsetZ, length) {
        const limbGeometry = new THREE.CylinderGeometry(0.25, 0.2, length, 8)
        const limbMaterial = new THREE.MeshStandardMaterial({
            color: 0xaa0000,
            roughness: 0.6,
            emissive: 0x220000
        })
        
        const limb = new THREE.Mesh(limbGeometry, limbMaterial)
        limb.position.set(offsetX, 0.5, offsetZ)
        limb.castShadow = true
        limb.receiveShadow = true
        this.group.add(limb)
    }

    update(deltaTime, playerPosition) {
        const distance = this.group.position.distanceTo(playerPosition)
        
        if (distance < this.detectionRange) {
            // Perseguir o jogador
            this.targetPosition.copy(playerPosition)
            this.targetPosition.y = this.group.position.y
            
            const direction = new THREE.Vector3()
                .subVectors(this.targetPosition, this.group.position)
                .normalize()
            
            this.velocity.copy(direction).multiplyScalar(this.speed)
            
            // Rotacionar em direção ao jogador
            this.group.lookAt(this.targetPosition)
            
            // Mover inimigo
            this.group.position.add(this.velocity.clone().multiplyScalar(deltaTime))
        }
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount)
        
        // Piscar com dano
        if (this.group.children[0]) {
            this.group.children[0].material.emissive.setHex(0xff0000)
            setTimeout(() => {
                if (this.group.children[0]) {
                    this.group.children[0].material.emissive.setHex(0x330000)
                }
            }, 100)
        }
    }
}
