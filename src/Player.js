import * as THREE from 'three'

export class Player {
    constructor(camera) {
        this.camera = camera
        this.camera.position.set(0, 1.6, 0)
        
        this.velocity = new THREE.Vector3()
        this.direction = new THREE.Vector3()
        
        this.health = 100
        this.maxHealth = 100
        this.speed = 8
        this.sprintSpeed = 12
        
        this.keys = {}
        this.isSprinting = false
        this.isGrounded = true
        
        this.pitch = 0
        this.yaw = 0
        this.mouseSensitivity = 0.002
        this.canLook = false
        
        this.setupControls()
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true
            if (e.key === 'Shift') this.isSprinting = true
        })

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false
            if (e.key === 'Shift') this.isSprinting = false
        })

        document.addEventListener('mousemove', (e) => {
            if (this.canLook) {
                this.yaw -= e.movementX * this.mouseSensitivity
                this.pitch -= e.movementY * this.mouseSensitivity
                
                this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch))
            }
        })

        document.addEventListener('pointerlockchange', () => {
            this.canLook = document.pointerLockElement === document.body
        })

        document.body.addEventListener('click', () => {
            document.body.requestPointerLock()
        })
    }

    enableControls() {
        document.body.requestPointerLock()
    }

    disableControls() {
        document.exitPointerLock()
    }

    update(deltaTime) {
        this.handleMovement(deltaTime)
        this.updateCamera()
    }

    handleMovement(deltaTime) {
        const currentSpeed = this.isSprinting ? this.sprintSpeed : this.speed
        this.direction.set(0, 0, 0)

        if (this.keys['w']) this.direction.z -= 1
        if (this.keys['s']) this.direction.z += 1
        if (this.keys['a']) this.direction.x -= 1
        if (this.keys['d']) this.direction.x += 1

        if (this.direction.length() > 0) {
            this.direction.normalize()
            
            // Rotacionar direção baseado no yaw
            const rotatedDir = new THREE.Vector3()
            rotatedDir.x = Math.sin(this.yaw) * this.direction.z + Math.cos(this.yaw) * this.direction.x
            rotatedDir.z = Math.cos(this.yaw) * this.direction.z - Math.sin(this.yaw) * this.direction.x
            
            this.velocity.x = rotatedDir.x * currentSpeed
            this.velocity.z = rotatedDir.z * currentSpeed
        } else {
            this.velocity.x = 0
            this.velocity.z = 0
        }

        this.camera.position.add(this.velocity.clone().multiplyScalar(deltaTime))
        
        // Manter o jogador acima do chão
        this.camera.position.y = 1.6
    }

    updateCamera() {
        this.camera.rotation.order = 'YXZ'
        this.camera.rotation.y = this.yaw
        this.camera.rotation.x = this.pitch
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount)
        
        if (this.health <= 0) {
            console.log('Game Over!')
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount)
    }
}
