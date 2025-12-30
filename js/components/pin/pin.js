import { saveLocation } from "../../state.js";

export class LocationPin extends HTMLElement {
  active = false;

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    document.addEventListener("click:map", this.mapClickHandler.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener("click:map", this.mapClickHandler);
  }

  render() {
    this.innerHTML = `
      <button title="Manually add new location" ${this.active ? 'class="active"' : ""}>
        <img src="../img/pin.svg" />
      </button>
    `;
    this.querySelector("button").addEventListener(
      "click",
      this.clickHandler.bind(this),
    );
  }

  clickHandler() {
    this.active = !this.active;
    console.log("adding a pin", this.active);
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
    }
  }
}
