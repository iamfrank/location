import GeoLoc from "../../geolocation/index.js";

export class LocationLocator extends HTMLElement {
  geoloc;

  constructor() {
    super();
    this.geoloc = new GeoLoc();
    this.geoloc.trackStart();
  }

  connectedCallback() {
    this.render();
    this.querySelector("button").addEventListener(
      "click",
      this.clickHandler.bind(this),
    );
  }

  render() {
    this.innerHTML = `
      <button title="Locate my position">
        <img src="./img/crosshair.svg" />
      </button>
    `;
  }

  clickHandler() {
    this.geoloc.trackStart();
  }
}
