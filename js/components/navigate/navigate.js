import { on, set, get } from "../../modules/state.js";
import {
  formatCoords,
  formatDistance,
  calculateDistanceAndHeading,
} from "../../modules/utils.js";

export class LocationNavigator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    on("navigate", (navObj) => {
      this.render(navObj);
    });
    on("current", (newLocation) => {
      if (get("navigate").updateFrom) {
        set("navigate", {
          ...get("navigate"),
          from: newLocation,
        });
      }
    });
  }

  render(trackingData) {
    if (trackingData.active && trackingData.to && trackingData.from) {
      const result = calculateDistanceAndHeading(
        trackingData.from,
        trackingData.to,
      );
      this.innerHTML = `
        <dialog id="navigator" popover>
          <button-close for="navigator"></button-close>
          <figure>
            <img src="./img/compass.svg" alt="">
            <span class="pointer" style="transform: rotate(${result.heading}deg);"></span>
            <figcaption>
              ${result.heading}°
              <br>
              <small>${formatDistance(result.distance)}</small>
            </figcaption>
          </figure>
          <dl>
            <dt>Target location</dt>
            <dd>
              ${trackingData.to.title}
              <br>
              ${formatCoords(trackingData.to.latitude, trackingData.to.longitude)}
            </dd>
            <dt>${trackingData.from.title ? trackingData.from.title : "Current location"}</dt>
            <dd>${formatCoords(trackingData.from.latitude, trackingData.from.longitude)}</dd>
          </dl>
          <button class="track-stop">Stop tracking</button>
        </dialog>
      `;
      this.querySelector(".track-stop").addEventListener("click", () => {
        set("navigate", {
          active: false,
          from: null,
          to: null,
          fromCurrent: true,
        });
      });
    } else {
      this.innerHTML = "";
    }
  }
}
