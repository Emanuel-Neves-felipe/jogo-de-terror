import * as THREE from 'three'
import { Player } from './Player.js'
import { World } from './World.js'
import { Enemy } from './Enemy.js'

export class Game {
    constructor() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x000000)
        this.scene.fog = new THREE.Fog(0x000000, 100, 500)

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap
        document.body.appendChild(this.renderer.domElement)

        this.player = new Player(this.camera)
        this.world = new World(this.scene)
        
        this.enemies = []
        this.isRunning = false
        this.clock = new THREE.Clock()
        this.frameCount = 0
        this.fps = 0

        this.setupLights()
        this.createEnemies()
        this.setupEventListeners()
    }

    setupLights() {
        // Luz ambiente muito fraca (escuro)
        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3)
        this.scene.add(ambientLight)

        // Lanterna do jogador
        this.playerLight = new THREE.PointLight(0xffff99, 1, 50)
        this.playerLight.castShadow = true
        this.playerLight.shadow.mapSize.width = 2048
        this.playerLight.shadow.mapSize.height = 2048
        this.playerLight.shadow.camera.near = 0.5
        this.playerLight.shadow.camera.far = 500
        this.camera.add(this.playerLight)
    }

    createEnemies() {
        // Criar alguns inimigos espalhados pelo mapa
        const positions = [
            { x: 20, z: -30 },
            { x: -25, z: -40 },
            { x: 30, z: -50 },
            { x: -15, z: -20 }
        ]

        positions.forEach(pos => {
            const enemy = new Enemy(pos.x, 0, pos.z)
            this.enemies.push(enemy)
            this.scene.add(enemy.group)
        })
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize())
        window.addEventListener('click', () => this.onMouseClick())
    }

    onWindowResize() {
        const width = window.innerWidth
        const height = window.innerHeight
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }

    onMouseClick() {
        if (this.isRunning) {
            // Lógica de disparo/ataque será adicionada
        }
    }

    start() {
        this.isRunning = true
        this.player.enableControls()
        document.getElementById('hud').classList.remove('hidden')
        document.getElementById('health-bar').classList.remove('hidden')
        this.animate()
    }

    pause() {
        this.isRunning = false
        this.player.disableControls()
    }

    updateHUD() {
        this.frameCount++
        const elapsed = this.clock.getElapsedTime()
        
        if (Math.floor(elapsed) > Math.floor(elapsed - 0.016)) {
            this.fps = Math.round(1 / (elapsed / this.frameCount))
        }

        document.getElementById('fps').textContent = this.fps
        document.getElementById('health-text').textContent = this.player.health
        document.getElementById('health-fill').style.width = (this.player.health) + '%'
    }

    updateEnemies(deltaTime) {
        this.enemies.forEach(enemy => {
            // Calcular distância para o jogador
            const playerPos = this.player.camera.position
            const distance = enemy.group.position.distanceTo(playerPos)
            
            if (distance < 80) {
                enemy.update(deltaTime, playerPos)
                
                // Causar dano se muito perto
                if (distance < 2) {
                    this.player.takeDamage(deltaTime * 10)
                }
            }
        })
    }

    animate() {
        if (!this.isRunning) {
            requestAnimationFrame(() => this.animate())
            return
        }

        requestAnimationFrame(() => this.animate())

        const deltaTime = Math.min(this.clock.getDelta(), 0.1)

        this.player.update(deltaTime)
        this.updateEnemies(deltaTime)
        this.updateHUD()

        // Fazer a câmera acompanhar o jogador
        this.playerLight.position.copy(this.camera.position)

        this.renderer.render(this.scene, this.camera)
    }
}
