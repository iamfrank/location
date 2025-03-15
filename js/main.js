// Import modules
import { LeafletMap } from './map.js'
import { LocationInfo } from './location-info.js'
import { LocationState, getLocations } from './state.js'
import { LocationList } from './location-list.js'

// Init web components
customElements.define('location-info', LocationInfo)
customElements.define('leaflet-map', LeafletMap)
customElements.define('location-list', LocationList)

// Init state and elements
const location = new LocationState()
const map_el = document.getElementById('lflt')

/*
// Register service worker for offline use
const swURL = 'service-worker.js'
if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', async () => {
    // Try to register the service worker.
    try {
      const reg = await navigator.serviceWorker.register(swURL)
      console.log('Service worker registered! 😎', reg)
    } catch (err) {
      console.error('😥 Service worker registration failed: ', err)
    }
  })
}
*/

// Show saved locations in map on page load
window.addEventListener('load', function () {
  map_el.setAttribute('data-saved-positions', JSON.stringify(getLocations()))
})

// On new location event, update map and action panel
document.addEventListener('position', function (ev) {
  let pos_data = JSON.stringify(ev.detail.position())
  map_el.setAttribute('data-position', pos_data)
})

// When locations are changed, update map
document.addEventListener('updatelocations', function (ev) {
  map_el.setAttribute('data-saved-positions', JSON.stringify(getLocations()))
})

// Handle clicks and touches
document.addEventListener('click', function (ev) {
  if (ev.target.classList.contains('leaflet-marker-icon')) {
    const locationInfoElement = document.createElement('location-info')
    locationInfoElement.setLocation(ev.target.location_data)
    document.body.append(locationInfoElement)
  }
})

document.querySelector('.location-list-toggle').addEventListener('click', () => {
  const locationListElement = document.createElement('location-list')
  document.body.append(locationListElement)
})
