export default class Result extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.result = this.getAttribute('result')
  }
  // --------------------------------------
  // hooks --------------------------------
  // --------------------------------------
  async connectedCallback() {
    this.template = await fetch('./components/result/result.html')
    this.template = await this.template.text()

    const rootNode = document.createElement('div')
    rootNode.innerHTML = this.template

    this.shadow.appendChild(rootNode)
    if (this.result === 'win') {
      this.shadow.querySelector('h2').innerHTML = 'Well played you are still alive'
    } else {
      this.shadow.querySelector('h2').innerHTML = 'For he\'s a jolly good fellow, and so say all of us!<br>RIP'
    }

  }
}

customElements.define('result-page', Result)

