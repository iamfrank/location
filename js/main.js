// Import modules
import { LeafletMap } from "./map.js";
import GeoLoc from "./geolocation/index.js";
import { LocationInfo } from "./location-info.js";
import { getLocations } from "./state.js";
import { fetchCurrentPosition } from "./position.js";
import { LocationList } from "./location-list.js";
import { LocationMessage } from "./messages.js";

// Init web components
customElements.define("location-info", LocationInfo);
customElements.define("leaflet-map", LeafletMap);
customElements.define("location-list", LocationList);
customElements.define("location-message", LocationMessage);

// Init state and elements
const map_el = document.getElementById("lflt");
const geol = new GeoLoc();

/*
// Register service worker for offline use
const swURL = 'service-worker.js'
if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', async () => {
    // Try to register the service worker.
    try {
      const reg = await navigator.serviceWorker.register(swURL)
      console.info('Service worker registered! 😎', reg)
    } catch (err) {
      console.error('😥 Service worker registration failed: ', err)
    }
  })
}
*/

// Show saved locations in map on page load
window.addEventListener("load", function () {
  map_el.setMarkers = getLocations();
});

// On new location event, update map and action panel
document.addEventListener("change:geolocation", function (ev) {
  map_el.setLocation = ev.detail.coords;
});

// When locations are changed, update map markers
document.addEventListener("updatelocations", function (ev) {
  map_el.setMarkers = getLocations();
});

// Handle clicks and touches
document.addEventListener("click", function (ev) {
  if (ev.target.classList.contains("leaflet-marker-icon")) {
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
    await geol.getPosition();
  });

geol.getPosition();
