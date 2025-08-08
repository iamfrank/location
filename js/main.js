// Import modules
import { LeafletMap } from "./map.js";
import GeoLoc from "./geolocation/index.js";
import FlatGeoLocation from "./location-object.js";
import { LocationInfo } from "./location-info.js";
import {
  getLocations,
  setCurrentLocation,
  getCurrentLocation,
} from "./state.js";
import { LocationList } from "./location-list.js";
import { LocationMessage } from "./messages.js";
import { StatusBar } from "./status.js";

// Init web components
customElements.define("location-info", LocationInfo);
customElements.define("leaflet-map", LeafletMap);
customElements.define("location-list", LocationList);
customElements.define("location-message", LocationMessage);
customElements.define("location-status", StatusBar);

// Init state and elements
const map_el = document.getElementById("lflt");
const geoloc = new GeoLoc();

// Show saved locations in map on page load
window.addEventListener("load", function () {
  map_el.setMarkers = getLocations();
});

// On new location event, update map and action panel
document.addEventListener("change:geolocation", function (ev) {
  const l = new FlatGeoLocation("Current location", ev.detail);
  setCurrentLocation(l);
  map_el.setLocation = getCurrentLocation();
});

// When locations are changed, update map markers
document.addEventListener("updatelocations", function (ev) {
  map_el.setMarkers = getLocations();
});

// Handle clicks and touches
document.addEventListener("click", function (ev) {
  console.log(ev.target);
  if (
    ev.target.classList.contains("leaflet-marker-icon") ||
    ev.target.classList.contains("leaflet-interactive")
  ) {
    const locationInfoElement = document.createElement("location-info");
    locationInfoElement.setLocation(ev.target.location_data);
    document.body.append(locationInfoElement);
  }
});

// Opens the location list
document
  .querySelector(".location-list-toggle")
  .addEventListener("click", () => {
    const locationListElement = document.createElement("location-list");
    document.body.append(locationListElement);
  });

// Triggers relocating position
document
  .querySelector(".location-update")
  .addEventListener("click", async () => {
    geoloc.trackStart();
  });

// Centers on current position
document.querySelector(".location-center").addEventListener("click", () => {
  map_el.centerOnLocation(getCurrentLocation());
});

geoloc.trackStart();
