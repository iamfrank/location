import state from "./app-state.js"

export class LocationList extends HTMLElement {

  expanded = false
  locations = []

  constructor() {
    super()
    this.locations = state.getLocations()
  }

  connectedCallback() {
    this.render()
    this.addEventListener('click', this.listClickHandler.bind(this))
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.listClickHandler)
  }

  render() {
    if (!this.expanded) {
      this.innerHTML = `<button>Locations</button>`
      this.querySelector('button').addEventListener('click', () => {
        this.expanded = true
        this.render()
      })
    } else {
      this.innerHTML = `
        <ul>
          ${ this.locations.map((l) => {
            return `<li><button class="location-list-item-btn" title="${l.title}">${ l.title }</button></li>`
          }) }
        </ul>
        <button>Close</button>
      `
    }
  }

  listClickHandler(event) {
    // Handle the case where a user selects an item in the list
    if (event.target.classList.contains('location-list-item-btn')) {
      console.log(event.target.title)
      const locationInfoElement = document.createElement('location-info')
      locationInfoElement.setLocation(state.getLocation(event.target.title))
      document.body.append(locationInfoElement)
      this.expanded = false
      this.render()
    }
  }

}