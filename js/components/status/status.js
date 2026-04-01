import { on, off } from "../../modules/state.js";

export class StatusBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // On new location event, update status bar
    on("currentlocation", this.render.bind(this));
  }

  render(currentLocation) {
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
    off("currentlocation", this.render.bind(this));
  }
}
