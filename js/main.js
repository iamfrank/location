// Import modules
import { LeafletMap } from "./components/map/map.js";
import { LocationInfo } from "./components/info/info.js";
import { LocationList } from "./components/list/list.js";
import { LocationPin } from "./components/pin/pin.js";
import { LocationLocator } from "./components/locate/locate.js";
import { StatusBar } from "./components/status/status.js";
import { LocationNavigator } from "./components/navigate/navigate.js";
import { AboutPage } from "./components/about/about.js";
import { CloseButton } from "./components/closebutton/closebutton.js";
import { get, loadLocations } from "./modules/state.js";

// Init web components
customElements.define("location-info", LocationInfo);
customElements.define("leaflet-map", LeafletMap);
customElements.define("location-list", LocationList);
customElements.define("location-pin", LocationPin);
customElements.define("location-status", StatusBar);
customElements.define("location-locator", LocationLocator);
customElements.define("location-navigator", LocationNavigator);
customElements.define("location-about", AboutPage);
customElements.define("button-close", CloseButton);

// Show saved locations in map on page load
window.addEventListener("load", function () {
  loadLocations();
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
