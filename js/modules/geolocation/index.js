import { set } from "../state.js";
import FlatGeoLocation from "../location-object.js";

export default class GeoLoc {
  options = {
    enableHighAccuracy: true,
    timeout: 60000,
    maximumAge: 5000,
    accuracyThreshold: 10,
  };
  geolocationResult = null;
  geolocationResultCache = [];
  _status = "Ready";
  trackerId = null;

  constructor(options) {
    if (!navigator.geolocation) {
      this._status = "Geolocation is not supported by your browser";
      console.error(this._status);
    } else if (options) {
      this.options = Object.assign({}, options);
    }
  }

  get coordinate() {
    return [
      this.geolocationResult.coords.longitude,
      this.geolocationResult.coords.latitude,
    ];
  }
  get accuracy() {
    return this.geolocationResult.coords.accuracy;
  }
  get time() {
    return this.geolocationResult.timestamp;
  }
  get status() {
    return this._status;
  }
  get crs() {
    return "WGS84";
  }
  get isAccurate() {
    if (
      this.geolocationResult.coords.accuracy < this.options.accuracyThreshold
    ) {
      return true;
    } else {
      return false;
    }
  }

  dispatchPosition(position) {
    const l = new FlatGeoLocation("Current location", position);
    set("current", l);
    // DEPRECATED: Send event to other components
    document.body.dispatchEvent(
      new CustomEvent("change:geolocation", {
        detail: position,
        bubbles: true,
        composed: true,
      }),
    );
  }

  trackStart() {
    this.geolocationResultCache = [];
    this.trackerId = navigator.geolocation.watchPosition(
      (position) => {
        this._status = "Tracking";
        if (position instanceof GeolocationPosition) {
          this.geolocationResultCache.push(position);
          if (this.geolocationResultCache.length > 10) {
            this.geolocationResultCache.shift();
          }
          this.geolocationResult = position;
          this.dispatchPosition(position);
        }
      },
      (posError) => {
        if (posError instanceof GeolocationPositionError) {
          this.geolocationResult = null;
          this._status = "Error";
          navigator.geolocation.clearWatch(this.trackerId);
        } else {
          console.error("Geolocation API returned an unknown error");
        }
      },
      this.options,
    );
  }

  trackEnd() {
    this._status = "Idle";
    navigator.geolocation.clearWatch(this.trackerId);
  }

  getPosition(iteration = 1) {
    this.trackStart();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.accuracy < this.options.accuracyThreshold) {
          this.trackEnd();
          resolve(this.geolocationResult);
        } else if (iteration > 120) {
          reject("getPosition timed out");
        } else {
          this.getPosition(iteration++);
        }
      }, 1000);
    });
  }

  renderHTML() {
    const posData = this.geolocationResult.coords;
    const element = document.createElement("dl");
    let htmlContent = "<dl>";
    htmlContent += this.renderDefinition(
      "longitude",
      posData.longitude,
      "decimal degrees",
    );
    htmlContent += this.renderDefinition(
      "latitude",
      posData.latitude,
      "decimal degrees",
    );
    htmlContent += this.renderDefinition("accuracy", posData.accuracy, "m");
    htmlContent += this.renderDefinition(
      "Is that very accurate?",
      this.isAccurate,
    );
    htmlContent += this.renderDefinition("altitude", posData.altitude, "m");
    htmlContent += this.renderDefinition(
      "altitudeAccuracy",
      posData.altitudeAccuracy,
      "m",
    );
    htmlContent += this.renderDefinition("heading", posData.heading, "degrees");
    htmlContent += this.renderDefinition("speed", posData.speed, "m/s");
    htmlContent += this.renderDefinition(
      "Timestamp",
      new Date(this.geolocationResult.timestamp).toLocaleString(),
    );

    htmlContent += "</dl>";
    element.innerHTML = htmlContent;
    return htmlContent;
  }

  renderDefinition(title, data, unit = "") {
    if (typeof title === "string") {
      return `<dt>${title}${unit !== "" ? ` (${unit})` : ""}</dt><dd>${data}</dd>`;
    } else {
      return "";
    }
  }
}
