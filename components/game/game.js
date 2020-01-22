const SMILEYS = [
  '&#128567;',
  '&#128557;',
  '&#128552;',
  '&#128542;',
  '&#128529;',
  '&#128535;'
]
const ABCD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default class Game extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.word = this.getAttribute('word').toUpperCase()
    this.lives = this.getAttribute('lives')
    this.template = null
    this.score = 0
    this.alreadyChosen = []
    // custom events
    this.winE = new Event('win')
    this.loseE = new Event('lose')
  }
  static get observedAttributes() {
    return ['word', 'count']
  }
  // --------------------------------------
  // hooks --------------------------------
  // --------------------------------------
  async connectedCallback() {
    this.template = await fetch('./components/game/game.html')
    this.template = await this.template.text()

    const rootNode = document.createElement('div')
    rootNode.innerHTML = this.template
    // inits
    this.shadow.appendChild(rootNode)
    this.processNewWord()
    this.displayLives()
    this.setEvent()
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'word') {
      this.word = newVal.toUpperCase()
      if (this.template) this.processNewWord()
    }
  }
  // --------------------------------------
  // methods-------------------------------
  // --------------------------------------
  // --------------------------------------
  processNewWord() {
    const fragment = document.createDocumentFragment()
    const letter = document.createElement('div')
    letter.classList.add('letter')
    for (let i = 0; i < this.word.length; i++) {
      fragment.append(letter.cloneNode())
    }
    this.shadow.querySelector('.word-container').append(fragment)
  }
  setEvent() {
    document.addEventListener('keydown', this.keydownHandler)
  }
  unsetEvent() {
    document.removeEventListener('keydown', this.keydownHandler)
  }
  // --------------------------------------
  // displays
  displayLives() {
    const fragment = document.createDocumentFragment()
    const life = document.createElement('div')
    life.innerHTML = '&#128519;'

    for (let i = 0; i < this.lives; i++) {
      fragment.append(life.cloneNode(true))
    }
    this.shadow.querySelector('.lives').append(fragment)
  }
  displayDeath() {
    const lives = this.shadow.querySelector('.lives').childNodes
    lives[this.lives].innerHTML = SMILEYS[this.lives]
  }
  displayNotif() {
    this.shadow.querySelector('.notif').style.opacity = 1
    setTimeout(() => {
      this.shadow.querySelector('.notif').style.opacity = 0
    }, 2000)
  }
  // --------------------------------------
  // handlers
  keydownHandler = e => {
    const normalizeKey = e.key.toUpperCase()
    // accept only A-Z
    if (ABCD.indexOf(normalizeKey) === -1) return
    const indexes = []
    // accept only new chars
    if (this.alreadyChosen.includes(normalizeKey)) {
      this.displayNotif()
      return
    }
    // add char to alreadyChosen array and display it
    this.alreadyChosen.push(normalizeKey)
    const typedLetterEl = document.createElement('div')
    typedLetterEl.innerHTML = normalizeKey
    this.shadow.querySelector('.letters-container').append(typedLetterEl)
    // if right char
    if (this.word.indexOf(normalizeKey) != -1) {
      // increment score and display char
      this.word.split('').forEach((letter, i) => {
        if (letter.toUpperCase() === normalizeKey) {
          this.score++
          this.shadow.querySelector('.word-container')
            .childNodes[i].innerHTML = normalizeKey
        }
      })
      // if win
      if (this.score >= this.word.length) {
        this.unsetEvent()
        window.dispatchEvent(this.winE)
      }
    } else { // if wrong char
      if (this.lives > 0) {
        this.lives--
        this.displayDeath()
      }
      // if lose
      if (this.lives <= 0) {
        this.unsetEvent()
        window.dispatchEvent(this.loseE)

      }
    }
  }
}

customElements.define('game-page', Game)

