class LeafletMap extends HTMLElement {
    constructor() {
        super(); // Always call super first in constructor
        this.setAttribute('id', 'map')
    }
}

const vm = {
    init: function() {

        window.customElements.define('leaflet-map', LeafletMap)
    
        let ui_map = L.map('map').setView([55.536780, 11.971517], 13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(ui_map)
        
    }
}

export default vm