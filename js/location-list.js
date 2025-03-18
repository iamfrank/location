import { getLocations, getLocation }from "./state.js"

export class LocationList extends HTMLElement {

  locations = []

  constructor() {
    super()
    // Make the function refer to (this) instance and still be removable when used in a remote element's event listener
    this.closeListHandler = this.closeListHandler.bind(this) 
  }

  connectedCallback() {
    this.locations = getLocations()
    this.render()
    this.addEventListener('click', this.listClickHandler)
    document.querySelector('leaflet-map').addEventListener('click', this.closeListHandler)
  }

  disconnectedCallback() {
    document.querySelector('leaflet-map').removeEventListener('click', this.closeListHandler)
  }

  render() {
    this.innerHTML = `
      <ul>
        ${ this.renderListItems(this.locations) }
      </ul>
    `
  }

  renderListItems(items) {
    let html = ''

    if (items.length <= 0) {
      html += '<li style="padding: 0.75rem 1rem;">No saved locations available</li>'
    } else {
      items.forEach(item => {
        html += `
          <li>
            <button class="location-list-item-btn" title="${item.title}">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g fill="#ffffff">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C8.13401 2 5 5.13401 5 9C5 13.25 12 22 12 22C12 22 19 13.25 19 9C19 5.13401 15.866 2 12 2ZM7 9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9C17 11.7614 14.7614 14 12 14C9.23858 14 7 11.7614 7 9ZM9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9Z"/>
                </g>
              </svg>
              ${ item.title }
            </button>
          </li>
        `
      })
    }

    return html
  }

  listClickHandler(event) {
    // Handle the case where a user selects an item in the list
    if (event.target.classList.contains('location-list-item-btn')) {
      const locationInfo = getLocation(event.target.title)
      const locationInfoElement = document.createElement('location-info')
      locationInfoElement.setLocation(locationInfo)
      document.body.append(locationInfoElement)
      document.querySelector('#lflt').setLocation = locationInfo
      this.remove()
    }
  }

  closeListHandler() {
    this.remove()
  }

}