import * as L from '../../leaflet/leaflet-src.esm.js'

// Define LeafletMap component
export class LeafletMap extends HTMLElement {

  static get observedAttributes() {
    return [
      'data-position',
      'data-saved-positions'
    ]
  }

  constructor() {
    super()

    // Create some CSS to apply to the DOM
    const style = document.createElement('style')
    style.textContent = `
      leaflet-map {
        position: fixed;
        top: 0;
        left: 0;
        display: block;
        height: 100%;
        width: 100vw;
        z-index: 1;
      }
      #lftmap {
        height: 100%;
        width: 100vw;
      }
    `
    document.head.appendChild(style)

    // Create markup and attach to the DOM
    this.map = document.createElement('div')
    this.map.setAttribute('id', 'lftmap')
    this.appendChild(this.map)

    this.ui_map = L.map('lftmap').setView([55, 11.5], 6)
    this.icon_a = L.icon({
      iconUrl: './icon.svg',
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [0, -30]
    })
    this.icon_b = L.icon({
      iconUrl: './icon_current.svg',
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [0, -30]
    })
    this.current_marker = null
    this.saved_markers = L.layerGroup().addTo(this.ui_map)

    // Initialize Leaflet
    if (navigator.onLine) { // Only load map tiles if online
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.ui_map)
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {

    if (name === 'data-position' && newValue !== oldValue) { 
      let position = JSON.parse(newValue)
      position.is_current = true
      position.title = null
      if (this.current_marker) {
        this.current_marker.remove()
      }
      this.current_marker = L.marker([position.latitude, position.longitude], { icon: this.icon_a }).addTo(this.ui_map)
      this.current_marker._icon.location_data = position
    }

    if (name === 'data-saved-positions' && newValue !== oldValue) {
      let positions = JSON.parse(newValue)
      this.saved_markers.clearLayers()
      for (let p in positions) {
        let pos = positions[p]
        pos.is_current = false
        const marker = L.marker([pos.latitude, pos.longitude], { icon: this.icon_b })
        this.saved_markers.addLayer(marker)
        marker._icon.location_data = pos
      }
    }
  }
}
