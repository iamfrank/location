import * as L from "../../modules/leaflet/leaflet-src.esm.js";
import { on } from "../../modules/state.js";

// Define LeafletMap component
export class LeafletMap extends HTMLElement {
  navigationPath;

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
      iconUrl: "./img/pin.svg",
      iconSize: [30, 20],
      iconAnchor: [15, 20],
      popupAnchor: [0, 0],
    });
    this.icon_b = L.icon({
      iconUrl: "./img/marker-b.svg",
      iconSize: [30, 20],
      iconAnchor: [15, 20],
      popupAnchor: [0, 0],
    });
    this.current_marker = null;
    this.saved_markers = L.layerGroup().addTo(this.ui_map);

    // Initialize Leaflet
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.ui_map);

    // Add event listeners
    this.ui_map.on("click", (ev) => {
      this.dispatchEvent(
        new CustomEvent("click:map", {
          detail: ev.latlng,
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  connectedCallback() {
    on("track", (navigation) => {
      if (this.navigationPath) {
        this.navigationPath.remove();
      }
      if (navigation.to && navigation.from) {
        const latlngs = [
          [navigation.from.latitude, navigation.from.longitude],
          [navigation.to.latitude, navigation.to.longitude],
        ];
        this.navigationPath = L.polyline(latlngs, { color: "red" }).addTo(
          this.ui_map,
        );
      }
    });

    on("locations", (locations) => {
      this.saved_markers.clearLayers();
      for (let p in locations) {
        let pos = locations[p];
        const marker = L.marker([pos.latitude, pos.longitude], {
          icon: this.icon_b,
        });
        this.saved_markers.addLayer(marker);
        marker._icon.location_data = pos;
      }
    });

    on("current", (currentLocation) => {
      if (this.current_marker) {
        this.current_marker.remove();
      }
      //if (currentLocation.accuracy < 10) {
      this.current_marker = L.marker(
        [currentLocation.latitude, currentLocation.longitude],
        {
          icon: this.icon_a,
        },
      ).addTo(this.ui_map);
      this.current_marker._icon.location_data = currentLocation;
      //} else { // Draw a circle indicating the radius of inaccuracy
      //  this.current_marker = L.circle(
      //    [currentLocation.latitude, currentLocation.longitude],
      //    {
      //      radius: currentLocation.accuracy,
      //    },
      //  ).addTo(this.ui_map);
      //  this.current_marker._path.location_data = currentLocation;
      //}
    });
  }
}
