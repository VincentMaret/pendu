import Game from './components/game/game.js'
import Result from './components/result/result.js'

const words = [
  'gateau',
  'pinceau',
  'peinture',
  'saperlipopette',
  'electronique',
  'perlimpimpim'
]

const GameEl = document.querySelector('#Game')
GameEl.setAttribute('word', words[Math.floor(Math.random() * words.length)])

window.addEventListener('lose', () => {
  setTimeout(() => {
    document.querySelector('body')
      .removeChild(document.querySelector('#Game'))
    document.body.innerHTML = '<result-page result="lose"></result-page>'
  }, 1000)
})

window.addEventListener('win', () => {
  setTimeout(() => {
    document.querySelector('body')
      .removeChild(document.querySelector('#Game'))
    document.body.innerHTML = '<result-page result="win"></result-page>'
  }, 1000)
})
