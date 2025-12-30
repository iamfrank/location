export class LocationMessage extends HTMLElement {
  
  set message(msg) {
    this.render(msg)
  }

  constructor() {
    super()
  }

  render(message) {
    this.innerHTML = message ? `<div class="location-message">${ message }</div>` : ''
  }

}