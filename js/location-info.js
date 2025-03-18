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

  connectedCallback() {
    // Disconnect already created location-info elements
    document.querySelectorAll('location-info').forEach((element) => {
      if (element !== this) {
        element.remove()
      }
    })
  }

  render(location_data) {
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
          ${ this.formatCoords(location_data.latitude, location_data.longitude) }
        </p>
        <p class="location-details">
          ${ location_data.accuracy !== null ? this.formatAccuracy(location_data.accuracy) : ''}
          ${ location_data.altitude !== null ? this.formatAltitude(location_data.altitude, location_data.altitudeAccuracy) : ''}
        </p>
      </article>
      <p class="actions">
        ${ !location_data.title ? '<button class="btn-save-location">Save location</button>' : '<button class="btn-track-location">Track</button><button class="btn-delete-location">Delete</button>' }
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
      } else if (event.target.className === 'btn-track-location') {
        // attach tracker element with 2 locations as arguments
        this.remove()
      }
    })
  }

  formatCoords(lat, lon) {
    let latStr = `${lat.toFixed(4)} N`
    let lonStr = `${lon.toFixed(4)} E`
    if (lat < 0) {
      latStr = `${ Math.abs(lat).toFixed(4)} S`
    }
    if (lon < 0) {
      lonStr = `${ Math.abs(lon).toFixed(4)} W`
    }
    return `${latStr} ${lonStr}`
  }

  formatAltitude(altitude, accuracy) {
    if (accuracy < 2) {
      return `<small class="altitude">Altitude ${ Math.round(altitude) } m</small>`
    } else {
      return `<small class="altitude">Altitude ${ Math.round(altitude - accuracy) } - ${ Math.round(altitude + accuracy) } m</small>`
    }
  }

  formatAccuracy(accuracy) {
    let color = 'black'
    if (accuracy > 100) {
      color = 'red' 
    } else if (accuracy > 25) {
      color = 'orange'
    } 
    if (accuracy > 5) {
      return `<small class="accuracy" style="color: ${ color };">Accuracy ${ Math.round(accuracy) } m</small>`
    } else {
      return ''
    } 
  }

}
