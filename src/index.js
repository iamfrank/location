// Import modules
import { LeafletMap } from "./components/leaftlet-map/leaflet-map.js"
import { LocationActions } from "./components/location-actions/location-actions.js"
import locationState from "./components/location-state/location-state.js"
import appState from './components/app-state/app-state.js'

// Import CSS
import "./style/index.css"
import "leaflet/dist/leaflet.css"

// Init web components
customElements.define('location-actions', LocationActions)
customElements.define('leaflet-map', LeafletMap)

// Init state and elements
locationState()
const map_el = document.getElementById('lflt')
const actions_el = document.querySelector('location-actions')


// Show saved locations in map on page load
window.addEventListener('load', function () {
  map_el.setAttribute('data-saved-positions', JSON.stringify(appState.fetchLocations()))
})

// On new location event, update map and action panel
document.addEventListener('position', function (ev) {
  let pos_data = JSON.stringify(ev.detail.position())
  map_el.setAttribute('data-position', pos_data)
})

// When locations are changed, update map
document.addEventListener('changelocations', function (ev) {
  map_el.setAttribute('data-saved-positions', JSON.stringify(appState.fetchLocations()))
})

// Handle clicks and touches
document.addEventListener('click', function (ev) {
  
  if (ev.target.classList.contains('leaflet-marker-icon')) {
    actions_el.setLocation(ev.target.location_data)
  }
})
