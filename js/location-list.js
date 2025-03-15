import { getLocations, getLocation }from "./state.js"

export class LocationList extends HTMLElement {

  expanded = false
  locations = []

  constructor() {
    super()
    this.locations = getLocations()
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
      this.innerHTML = `<button class="location-list-toggle"><img src="/img/marker.svg" alt="Locations"></button>`
      this.querySelector('button').addEventListener('click', () => {
        this.expanded = true
        this.render()
      })
    } else {
      this.innerHTML = `
        <ul>
          ${ this.renderListItems(this.locations) }
        </ul>
      `
    }
  }

  renderListItems(items) {
    let html = ''
    items.forEach(item => {
      html += `<li><button class="location-list-item-btn" title="${item.title}">${ item.title }</button></li>`
    })
    return html
  }

  listClickHandler(event) {
    // Handle the case where a user selects an item in the list
    if (event.target.classList.contains('location-list-item-btn')) {
      console.log(event.target.title)
      const locationInfoElement = document.createElement('location-info')
      locationInfoElement.setLocation(getLocation(event.target.title))
      document.body.append(locationInfoElement)
      this.expanded = false
      this.render()
    }
  }

}