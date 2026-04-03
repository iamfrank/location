import { get, set, on } from "../../modules/state.js";

export class NavButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render(null);
    on("navigate", (navigation) => {
      this.render(navigation);
    });
  }

  render(nav) {
    const isNavigating = nav && nav.to && nav.from ? true : false;
    this.innerHTML = `
      <button
        class="${isNavigating ? "active" : ""} popover-button"
        ${!isNavigating ? "disabled" : ""}
        title="Stop path tracking">
        O
      </button>
    `;
    this.querySelector("button").addEventListener("click", () => {
      const newNav = set("navigate", {
        to: null,
        from: null,
      });
      this.render(newNav);
    });
  }
}
