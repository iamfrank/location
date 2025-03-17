import {saveLocation, deleteLocation} from "./state.js"

// Define component
export class LocationInfo extends HTMLElement {

  location

  // setter
  setLocation(data) {
    this.location = data
    this.render(this.location)
  }

  constructor() {
    super()
  }

  render(location_data) {
    console.log('location', location_data)
    this.innerHTML = `
      <button class="btn-close" title="Close">
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="black" stroke-width="2" stroke-linejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6L18 18" />
          </g>
        </svg>
      </button>
      <article>
        ${ location_data.title ? `<h3>${ location_data.title }</h3>`: ''}
        <p class="coordinates">
          ${location_data.latitude.toFixed(4)} N, ${location_data.longitude.toFixed(4)} E
        </p>
        <p class="location-details">
          ${ location_data.accuracy !== null && location_data.accuracy > 5 ? `<small class="accuracy">Accuracy ${ Math.round(location_data.accuracy) } m</small>`:''}
          ${ location_data.altitude !== null ? `<small class="altitude">Altitude ${ this.formatAltitude(location_data.altitude, locoation_data.altitudeAccuracy)}</small>`:''}
        </p>
      </article>
      <p class="actions">
        ${ !location_data.title ? '<button class="btn-save-location">Save location</button>' : '<button class="btn-delete-location">Delete</button>' }
      </p>
    `

    this.addEventListener('click', (event) => {
      if (event.target.closest('.btn-close')) {
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

  formatAltitude(altitude, accuracy) {
    if (!accuracy || accuracy < 2) {
      return `${ Math.round(altitude) } m`
    } else {
      return `${ Math.round(altitude - accuracy) } - ${ Math.round(altitude + accuracy) } m`
    }
  }

}
