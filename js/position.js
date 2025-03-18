let watcherId
let currentLocation = null
let retry

const options = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 0
}

const position_event = new CustomEvent('updateposition', {
  detail: {
    position: () => currentLocation
  }
})

function normalizeGeolocation(geolocation) {
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

function success(position) {
  retry++
  currentLocation = normalizeGeolocation(position)
  document.dispatchEvent(position_event)
  if (position.coords.accuracy < 50 || retry > 5) { 
    navigator.geolocation.clearWatch(watcherId)
    document.querySelector('location-message').message = false
  }
}

function error(err) {
  console.error(err)
  document.querySelector('location-message').message = err
}

export function fetchCurrentPosition() {
  if (currentLocation) {
    document.dispatchEvent(position_event)
  }
  document.querySelector('location-message').message = 'Aquiring position ...'
  retry = 0
  watcherId = navigator.geolocation.watchPosition(success, error, options)
}
