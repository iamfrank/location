class Location {

  constructor() {
    this.location_now = null
    this.shouldHandle = true
    this.geo_options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    }
    this.position_event = new CustomEvent('position', {
      detail: {
        position: () => this.location_now
      }
    })
    this.timeout = 3000 
  }

  #normalizeGeolocation(geolocation) {
    return {
      accuracy: geolocation.coords.accuracy,
      latitude: geolocation.coords.latitude,
      longitude: geolocation.coords.longitude,
      timestamp: geolocation.timestamp,
      altitude: geolocation.coords.altitude,
      altitudeAccuracy: geolocation.coords.altitudeAccuracy,
      heading: geolocation.coords.heading,
      speed: geolocation.coords.speed
    }
  }
  #throttleHandler(callback, delay) {
    if (this.shouldHandle) {
      this.shouldHandle = false
      callback()
      setTimeout(function () {
        this.shouldHandle = true
      }, delay)
    }
  }

  getCurrentPosition() {
    if ("geolocation" in navigator) {
      // Watch geolocation
      navigator.geolocation.watchPosition(
        (position) => {
          this.#throttleHandler(() => {
            this.location_now = this.#normalizeGeolocation(position)
            document.dispatchEvent(this.position_event)
          }, this.timeout)
        },
        (error) => {
          this.#throttleHandler(() => {
            console.error("No location available :-( ", error)
            document.dispatchEvent(this.position_event)
            return false
          }, this.timeout)
        },
        this.geo_options
      )
    } else {
      document.dispatchEvent(this.position_event)
      console.error("No geolocation on this device")
    }
  }
}

let locations = []
const localstorage_key = 'locator-iegh383hd8'
const locations_change_event = new CustomEvent('updatelocations')

function getLocations() {
  const ls = JSON.parse(localStorage.getItem(localstorage_key))
  locations = ls ? ls : []
  return locations
}

function getLocation(title) {
  return locations.find((l) => l.title === title)
}

function saveLocation(location_data) {
  locations.push(location_data)
  commitLocations(locations)
}

function deleteLocation(location_data) {
  let loc_idx = locations.findIndex(function (loc) {
    return loc.title === location_data.title
  })
  locations.splice(loc_idx, 1)
  commitLocations(locations)
}

function commitLocations(locations_array) {
  localStorage.setItem(localstorage_key, JSON.stringify(locations_array))
  document.dispatchEvent(locations_change_event)
}

export {
  Location,
  getLocations,
  getLocation,
  saveLocation,
  deleteLocation
}
