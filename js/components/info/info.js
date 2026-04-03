import { saveLocation, deleteLocation, set, get } from "../../modules/state.js";
import { getBFE } from "../../modules/matriklen.js";
import { formatCoords } from "../../modules/utils.js";

// Define component
export class LocationInfo extends HTMLElement {
  location;

  // setter
  setLocation(data) {
    this.location = data;
    this.render(this.location);
    this.renderOIS(this.location);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    // Disconnect already created location-info elements
    document.querySelectorAll("location-info").forEach((element) => {
      if (element !== this) {
        element.remove();
      }
    });
  }

  render(location_data) {
    this.innerHTML = `
      <button title="Close"></button>
      <article>
        ${location_data.title ? `<h3>${location_data.title}</h3>` : ""}
        <p class="coordinates">
          ${formatCoords(location_data.latitude, location_data.longitude)}
        </p>
        <p class="location-details">
          ${location_data.accuracy !== null ? this.formatAccuracy(location_data.accuracy) : ""}
          ${location_data.altitude !== null ? this.formatAltitude(location_data.altitude, location_data.altitude_accuracy) : ""}
        </p>
        <div class="location-ois"></div>
      </article>
      ${
        location_data.title !== "Current location"
          ? `<p class="actions">
          <button class="btn-track-location-from">Navigate from here</button>
          <button class="btn-delete-location">Delete</button>
          <button class="btn-track-location-to">Navigate to here</button>
        </p>`
          : `<p class="actions">
          <button class="btn-track-location-from">Navigate from here</button>
          <button class="btn-save-location">Save location</button>
        </p>`
      }
    `;

    this.addEventListener("click", (event) => {
      if (event.target.closest('[title="Close"]')) {
        this.remove();
      } else if (event.target.className === "btn-save-location") {
        let title = prompt("Save location as:");
        if (title === "") {
          title = `location-${Math.round(Math.random() * 1000)}`;
        }
        saveLocation(title, this.location);
        this.remove();
      } else if (
        event.target.className === "btn-delete-location" &&
        confirm("Do you want to delete this waypoint?")
      ) {
        deleteLocation(this.location);
        this.remove();
      } else if (event.target.className === "btn-track-location-to") {
        const oldNav = get("track");
        set("track", {
          from: oldNav.from !== null ? oldNav.from : get("current"),
          to: this.location,
        });
        this.remove();
      } else if (event.target.className === "btn-track-location-from") {
        set("track", {
          from: this.location,
          to: get("track").to ? get("track").to : null,
        });
        this.remove();
      }
    });
  }

  async renderOIS(location_data) {
    if (location_data && location_data.accuracy < 25) {
      this.querySelector(".location-ois").innerHTML = `
        <p>${await this.formatOISlinks([location_data.latitude, location_data.longitude])}</p>
      `;
    }
  }

  formatAltitude(altitude, accuracy) {
    if (accuracy < 2) {
      return `<small class="altitude">Altitude ${Math.round(altitude)} m</small>`;
    } else {
      return `<small class="altitude">Altitude ${Math.round(altitude - accuracy)} - ${Math.round(altitude + accuracy)} m</small>`;
    }
  }

  formatAccuracy(accuracy) {
    let color = "black";
    if (accuracy > 100) {
      color = "red";
    } else if (accuracy > 25) {
      color = "orange";
    }
    if (accuracy > 5) {
      return `<small class="accuracy" style="color: ${color};">Accuracy ${Math.round(accuracy)} m</small>`;
    } else {
      return "";
    }
  }

  async formatOISlinks(latlon) {
    try {
      const result = await getBFE(latlon);
      const htmlStr = result.reduce((str, bfeNo) => {
        return (
          str +
          `<a style="display: block" href="https://www.ois.dk/search/${bfeNo}/sfe" target="_blank">Se BFEnr ${bfeNo} på OIS.dk</a>`
        );
      }, "");
      return htmlStr;
    } catch {
      return "";
    }
  }
}
