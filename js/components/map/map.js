import * as L from "../../leaflet/leaflet-src.esm.js";

// Define LeafletMap component
export class LeafletMap extends HTMLElement {
  set setLocation(location) {
    if (this.current_marker) {
      this.current_marker.remove();
    }
    if (location.accuracy < 10 || true) {
      this.current_marker = L.marker([location.latitude, location.longitude], {
        icon: this.icon_a,
      }).addTo(this.ui_map);
      this.current_marker._icon.location_data = location;
    } else {
      this.current_marker = L.circle([location.latitude, location.longitude], {
        radius: location.accuracy,
      }).addTo(this.ui_map);
      this.current_marker._path.location_data = location;
    }
  }

  set setMarkers(locations) {
    console.log(locations);
    this.saved_markers.clearLayers();
    for (let p in locations) {
      let pos = locations[p];
      const marker = L.marker([pos.latitude, pos.longitude], {
        icon: this.icon_b,
      });
      this.saved_markers.addLayer(marker);
      marker._icon.location_data = pos;
    }
  }

  centerOnLocation(location) {
    this.ui_map.flyTo([location.latitude, location.longitude], 14);
  }

  constructor() {
    super();

    // Create markup and attach to the DOM
    this.map = document.createElement("div");
    this.map.setAttribute("id", "lftmap");
    this.appendChild(this.map);

    this.ui_map = L.map("lftmap", { zoomControl: false }).setView(
      [55, 11.5],
      6,
    );
    L.control.scale({ imperial: false }).addTo(this.ui_map);
    this.icon_a = L.icon({
      iconUrl: "./img/marker-a.svg",
      iconSize: [30, 20],
      iconAnchor: [15, 20],
      popupAnchor: [0, 0],
    });
    this.icon_b = L.icon({
      iconUrl: "./img/marker-b.svg",
      iconSize: [30, 20],
      iconAnchor: [15, 0],
      popupAnchor: [0, 0],
    });
    this.current_marker = null;
    this.saved_markers = L.layerGroup().addTo(this.ui_map);

    // Initialize Leaflet
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.ui_map);
  }
}
