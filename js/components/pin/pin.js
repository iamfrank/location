import { saveLocation } from "../../modules/state.js";

export class LocationPin extends HTMLElement {
  active = false;
  mapClickHandlerBound = this.mapClickHandler.bind(this);

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    document.addEventListener("click:map", this.mapClickHandlerBound);
  }

  disconnectedCallback() {
    document.removeEventListener("click:map", this.mapClickHandlerBound);
  }

  render() {
    this.innerHTML = `
      <button title="Manually add new location" ${this.active ? 'class="active"' : ""}>
        <img src="./img/add-pin.svg" />
      </button>
    `;
    this.querySelector("button").addEventListener(
      "click",
      this.clickHandler.bind(this),
    );
  }

  clickHandler() {
    this.active = !this.active;
    this.render();
  }

  mapClickHandler(ev) {
    if (this.active) {
      saveLocation(prompt("Position name"), {
        coords: {
          latitude: ev.detail.lat,
          longitude: ev.detail.lng,
          accuracy: 0,
          timestamp: new Date().getTime(),
        },
      });
      this.active = !this.active;
      this.render();
    }
  }
}
