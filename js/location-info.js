import {saveLocation, deleteLocation} from "./state.js"

// Define component
export class LocationInfo extends HTMLElement {

  template = `
    <button class="btn-close">x</button>
    <h3></h3>
    <p class="coordinates"></p>
    <p>
      <small class="timestamp"></small><br>    
      <small class="accuracy"></small><br>
      <small class="altitude"></small>
    </p>
    <button class="btn-save-location">Save location</button>
    <button class="btn-delete-location">Delete</button>
  `
  location
  dom_el

  // setter
  setLocation(data) {
    this.location = data
    this.render(this.location)
  }

  constructor() {
    super()
  }

  render(location_data) {
    this.innerHTML = `
      <button class="btn-close">x</button>
      ${ location_data.title ? `<h3>${ location_data.title }</h3>`: ''}
      <p class="coordinates">
        ${location_data.latitude.toFixed(4)}, ${location_data.longitude.toFixed(4)}
      </p>
      <p>
        <small class="timestamp">${ new Date(location_data.timestamp).toLocaleString() }</small><br>    
        <small class="accuracy">${ location_data.accuracy }</small><br>
        <small class="altitude">${ location_data.altitude }</small>
      </p>
      ${ location_data.is_current ? '<button class="btn-save-location">Save location</button>':'<button class="btn-delete-location">Delete</button>' }
    `

    this.addEventListener('click', (event) => {
      if (event.target.className === 'btn-close') {
        this.remove()
      } else if (event.target.className === 'btn-save-location') {
        this.location.title = prompt('Save location as:')
        if (this.location.title === '') {
          this.location.title = `location-${Math.round(Math.random() * 1000)}`
        }
        saveLocation(this.location)
        this.remove()
      } else if (event.target.className === 'btn-delete-location' && confirm('Do you want to delete this waypoint?')) {
        deleteLocation(this.location)
        this.remove()
      }
    })
  }
}
