import appState from "./app-state.js"

export class LocationList extends HTMLElement {

  expanded = false
  locations = []
  state = appState

  constructor() {
    super()
    this.locations = this.state.getLocations()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    if (!this.expanded) {
      this.innerHTML = `<button class="">Locations</button>`
    } else {
      this.innerHTML = `
        <ul>
          ${this.locations.map((l) => {
            return `<li>${ l.title }</li>`
          })}
        </ul>
        <button class="">Close</button>
      `
    }
  }

}