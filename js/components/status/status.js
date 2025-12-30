import { getCurrentLocation } from "../../state.js";

export class StatusBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // On new location event, update status bar
    document.addEventListener("change:geolocation", this.render.bind(this));
  }

  render() {
    const currentLocation = getCurrentLocation();
    console.log(currentLocation);
    if (currentLocation) {
      this.innerHTML = `
        <dl class="location-status">
          <dt>Tracking location</dt>
          <dd>${currentLocation.latitude} ${currentLocation.longitude}</dd>
        </dl>
      `;
    }
  }

  disconnectedCallback() {
    document.removeEventListener("change:geolocation", this.render);
  }
}
