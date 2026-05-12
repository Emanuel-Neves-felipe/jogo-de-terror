import * as THREE from 'three'
import { Game } from './Game.js'

let game = null

window.startGame = () => {
    const menu = document.getElementById('menu')
    menu.classList.add('hidden')
    
    if (!game) {
        game = new Game()
    }
    game.start()
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const menu = document.getElementById('menu')
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden')
            if (game) game.pause()
        }
    }
})
