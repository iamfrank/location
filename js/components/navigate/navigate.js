import { on, set } from "../../modules/state.js";

export class LocationNavigator extends HTMLElement {
  tracking = {
    active: false,
    from: null,
    to: null,
  };

  constructor() {
    super();
  }

  connectedCallback() {
    on("track", (trackingData) => {
      this.tracking = trackingData;
      this.render(this.tracking);
    });
    on("currentlocation", (newLocation) => {
      this.tracking.from = newLocation;
      this.render(this.tracking);
    });
  }

  render(trackingData) {
    if (trackingData.active) {
      const result = this.calculateDistanceAndHeading(
        trackingData.from,
        trackingData.to,
      );
      this.innerHTML = `
        <section class="navigator">
          <figure>
            <img src="../../img/compass.svg" alt="">
            <span class="pointer" style="transform: rotate(${result.heading}deg);"></span>
            <figcaption>
              ${result.heading}°
              <br>
              <small>${this.formatDistance(result.distance)}</small>
            </figcaption>
          </figure>
          <dl>
            <dt>Target location</dt>
            <dd>
              ${trackingData.to.title}
              <br>
              ${trackingData.to.latitude}, ${trackingData.to.longitude}
            </dd>
            <dt>Current location</dt>
            <dd>${trackingData.from.latitude}, ${trackingData.from.longitude}</dd>
          </dl>
          <button class="track-stop">Stop tracking</button>
        </section>
      `;
      this.querySelector(".track-stop").addEventListener("click", () => {
        set("track", { active: false });
      });
    } else {
      this.innerHTML = "";
    }
  }

  formatDistance(meters) {
    if (meters >= 1000) {
      return `${meters / 1000} km`;
    } else {
      return `${meters} m`;
    }
  }

  /**
   * Calculate distance (meters) and heading (degrees) between two WGS84 coordinate pairs.
   */
  calculateDistanceAndHeading(from, to) {
    const R = 6371e3; // Earth radius in meters
    const lat1 = from.latitude;
    const lon1 = from.longitude;
    const lat2 = to.latitude;
    const lon2 = to.longitude;
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    // Haversine formula for distance
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = Math.round(R * c);

    // Bearing formula
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    let heading = (Math.atan2(y, x) * 180) / Math.PI;
    heading = Math.round((heading + 360) % 360); // Normalize to 0-360

    return { distance, heading };
  }
}
