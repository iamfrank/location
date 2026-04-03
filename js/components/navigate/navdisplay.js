import { on, set, get } from "../../modules/state.js";
import {
  formatCoords,
  formatDistance,
  calculateDistanceAndHeading,
} from "../../modules/utils.js";

export class NavDisplay extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.className = "navigation-display";
    this.render(null);
    on("track", (navigation) => {
      this.render(navigation);
    });
  }

  render(nav) {
    const isNavigating = nav && nav.to && nav.from ? true : false;
    if (isNavigating) {
      const { heading, distance } = calculateDistanceAndHeading(
        nav.from,
        nav.to,
      );
      this.innerHTML = `
        <img src="./img/compass.svg" alt="">
        <span style="transform: rotate(${heading}deg);"></span>
        <p>
          ${heading}°
          <br>
          <small>${formatDistance(distance)}</small>
          <br>
          <button>Cancel</button>
        </p>
      `;
      this.querySelector("button").addEventListener("click", () => {
        set("track", {
          to: null,
          from: null,
        });
      });
    } else {
      this.innerHTML = "";
    }
  }
}
