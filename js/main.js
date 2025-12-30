// Import modules
import FlatGeoLocation from "./location-object.js";
import { LeafletMap } from "./components/map/map.js";
import { LocationInfo } from "./components/info/info.js";
import { LocationList } from "./components/list/list.js";
import { LocationPin } from "./components/pin/pin.js";
import { LocationMessage } from "./components/message/message.js";
import { LocationLocator } from "./components/locate/locate.js";
import { StatusBar } from "./components/status/status.js";
import {
  getLocations,
  setCurrentLocation,
  getCurrentLocation,
} from "./state.js";

// Init web components
customElements.define("location-info", LocationInfo);
customElements.define("leaflet-map", LeafletMap);
customElements.define("location-list", LocationList);
customElements.define("location-pin", LocationPin);
customElements.define("location-message", LocationMessage);
customElements.define("location-status", StatusBar);
customElements.define("location-locator", LocationLocator);

// Init state and elements
const map_el = document.getElementById("lflt");
const list_el = document.querySelector("location-list");

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

// When locations are changed, update map markers and location list
document.addEventListener("updatelocations", function () {
  const newLocations = getLocations();
  map_el.setMarkers = newLocations;
  list_el.setLocations = newLocations;
});

// Handle clicks and touches
document.addEventListener("click", function (ev) {
  if (
    ev.target.classList.contains("leaflet-marker-icon") ||
    ev.target.classList.contains("leaflet-interactive")
  ) {
    const locationInfoElement = document.createElement("location-info");
    locationInfoElement.setLocation(ev.target.location_data);
    document.body.append(locationInfoElement);
  }
});
