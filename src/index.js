// Import modules
import { LeafletMap } from "./components/leaftlet-map/leaflet-map.js"
import { LocationActions } from "./components/location-actions/location-actions.js"
import locationState from "./components/location-state/location-state.js"

// Import CSS
import "./style/index.css"
import "leaflet/dist/leaflet.css"

// Init web components
customElements.define('location-actions', LocationActions)
customElements.define('leaflet-map', LeafletMap)

// Init state and elements
const state = locationState()
const map_el = document.getElementById('lflt')

// On new location event, update map and action panel
document.addEventListener('position', function (ev) {
  let pos_data = JSON.stringify(ev.detail.position())
  map_el.setAttribute('data-position', pos_data)
})

// When locations are changed, update map
document.addEventListener('changelocations', function (ev) {
  map_el.setAttribute('data-saved-positions', JSON.stringify(state.getSavedLocations()))
})

// Handle clicks and touches
document.addEventListener('click', function (ev) {

  // On clicking the save button, update list of saved locations
  if (ev.target.className === 'btn-save-location') {
    state.saveCurrentLocation()
  } else if (ev.target.className === 'btn-delete-location') {
    state.deleteLocation(ev.target.dataset.locationTitle)
  }
})
