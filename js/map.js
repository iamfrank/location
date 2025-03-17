import * as L from './leaflet/leaflet-src.esm.js'

// Define LeafletMap component
export class LeafletMap extends HTMLElement {

  set setLocation(location) {
    if (this.current_marker) {
      this.current_marker.remove()
    }
    this.current_marker = L.marker([location.latitude, location.longitude], { icon: this.icon_a }).addTo(this.ui_map)
    this.current_marker._icon.location_data = location
    this.ui_map.flyTo([location.latitude, location.longitude], 14)
  }

  set setMarkers(locations) {
    this.saved_markers.clearLayers()
    for (let p in locations) {
      let pos = locations[p]
      const marker = L.marker([pos.latitude, pos.longitude], { icon: this.icon_b })
      this.saved_markers.addLayer(marker)
      marker._icon.location_data = pos
    }
  }

  constructor() {
    super()

    // Create markup and attach to the DOM
    this.map = document.createElement('div')
    this.map.setAttribute('id', 'lftmap')
    this.appendChild(this.map)

    this.ui_map = L.map('lftmap', {zoomControl: false}).setView([55, 11.5], 6)
    L.control.scale({imperial: false}).addTo(this.ui_map)
    this.icon_a = L.icon({
      iconUrl: './img/marker-red.svg',
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [0, -30]
    })
    this.icon_b = L.icon({
      iconUrl: './img/marker-black.svg',
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [0, -30]
    })
    this.current_marker = null
    this.saved_markers = L.layerGroup().addTo(this.ui_map)

    // Initialize Leaflet
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.ui_map)
  }

}
