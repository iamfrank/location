import { on, off } from "../../modules/state.js";

export class StatusBar extends HTMLElement {
  renderBound = this.render.bind(this);

  constructor() {
    super();
  }

  connectedCallback() {
    // On new location event, update status bar
    on("currentlocation", this.renderBound);
  }

  render(currentLocation) {
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
    off("currentlocation", this.renderBound);
  }
}
