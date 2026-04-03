import { findLocation, on, get } from "../../modules/state.js";

export class LocationList extends HTMLElement {
  locations = [];

  constructor() {
    super();
  }

  connectedCallback() {
    this.locations = get("locations");
    this.render();
    this.addEventListener("click", this.listClickHandler);
    on("locations", (locations) => {
      this.locations = locations;
      this.render();
    });
  }

  render() {
    this.innerHTML = `
      <button class="popover-btn" title="List locations" popovertarget="locationlist" popovertargetaction="show">
        <img src="./img/list.svg" alt="">
      </button>
      <dialog popover id="locationlist">
        <button-close for="locationlist"></button-close>
        <ul>
          ${this.renderListItems(this.locations)}
        </ul
      </dialog>
    `;
  }

  renderListItems(items) {
    let html = "";
    if (items.length <= 0) {
      html +=
        '<li style="padding: 0.75rem 1rem;">No saved locations available</li>';
    } else {
      items.forEach((item) => {
        html += `
          <li>
            <button class="location-list-item-btn" title="${item.title}">
              <img src="./img/marker-b.svg" alt="">
              ${item.title}
            </button>
          </li>
        `;
      });
    }
    return html;
  }

  listClickHandler(event) {
    // Handle the case where a user selects an item in the list
    if (event.target.classList.contains("location-list-item-btn")) {
      const locationInfo = findLocation(event.target.getAttribute("title"));
      const locationInfoElement = document.createElement("location-info");
      locationInfoElement.setLocation(locationInfo);
      document.body.append(locationInfoElement);
      this.querySelector("#locationlist").hidePopover();
    }
  }
}
