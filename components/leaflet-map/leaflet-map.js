// Apply external Leaflet CSS to the DOM
const linkElem = document.createElement('link')
linkElem.setAttribute('rel', 'stylesheet')
linkElem.setAttribute('href', './components/leaflet-map/leaflet.css')
document.head.appendChild(linkElem)

// Apply external Leaflet JS to the DOM
const scriptElem = document.createElement('script')
scriptElem.setAttribute('src', './components/leaflet-map/leaflet.js')
document.head.appendChild(scriptElem)

// Define LeafletMap component
class LeafletMap extends HTMLElement {

    static get observedAttributes() { 
        return [
            'data-position',
            'data-saved-positions'
        ]
    }

    constructor() {    
        super()

        this.ui_map = null
        this.icon_a = L.icon({
            iconUrl: './components/leaflet-map/icon_current.svg',
            iconSize: [30, 45],
            iconAnchor: [15, 45],
            popupAnchor: [0, -30]
        })
        this.icon_b = L.icon({
            iconUrl: './components/leaflet-map/icon.svg',
            iconSize: [30, 45],
            iconAnchor: [15, 45],
            popupAnchor: [0, -30]
        })
        this.current_marker = null

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

        // Initialize Leaflet
        this.ui_map = L.map('lftmap').setView([55, 11.5], 6)
        if (navigator.onLine) { // Only load map tiles if online
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.ui_map)
        }
    
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-position' && newValue !== oldValue) {
            let position = JSON.parse(newValue)
            if (this.current_marker) {
                this.current_marker.remove()
            }
            this.current_marker = L.marker([position.latitude, position.longitude], {icon: this.icon_a}).addTo(this.ui_map)
            this.current_marker.bindPopup(`<h3>My location</h3><location-actions data-location='${ newValue }' data-is-current="true"></location-actions>`)
        }
        if (name === 'data-saved-positions' && newValue !== oldValue) {
            let positions = JSON.parse(newValue)
            for (let p in positions) {
                const marker = L.marker([positions[p].latitude, positions[p].longitude], {icon: this.icon_b}).addTo(this.ui_map)
                marker.bindPopup(`<h3>Saved position</h3><location-actions data-location='${ JSON.stringify(positions[p]) }'></location-actions>`)
            }
        }
    }
}

// Wait for leaflet.js to load before registering component
window.addEventListener('load', function() {
    customElements.define('leaflet-map', LeafletMap)
})
