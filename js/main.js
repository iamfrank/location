// Import modules
import { LeafletMap } from './map.js'
import { LocationInfo } from './location-info.js'
import { LocationState } from './location-state.js'
import { LocationList } from './location-list.js'
import appState from './app-state.js'

// Init web components
customElements.define('location-info', LocationInfo)
customElements.define('leaflet-map', LeafletMap)
customElements.define('location-list', LocationList)

// Init state and elements
const location = new LocationState()
const map_el = document.getElementById('lflt')
const actions_el = document.querySelector('location-info')

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
  map_el.setAttribute('data-saved-positions', JSON.stringify(appState.getLocations()))
})

// On new location event, update map and action panel
document.addEventListener('position', function (ev) {
  let pos_data = JSON.stringify(ev.detail.position())
  map_el.setAttribute('data-position', pos_data)
})

// When locations are changed, update map
document.addEventListener('updatelocations', function (ev) {
  map_el.setAttribute('data-saved-positions', JSON.stringify(appState.getLocations()))
})

// Handle clicks and touches
document.addEventListener('click', function (ev) {
  if (ev.target.classList.contains('leaflet-marker-icon')) {
    actions_el.setLocation(ev.target.location_data)
  }
})
