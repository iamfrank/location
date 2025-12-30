export class LocationPin extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.querySelector("button").addEventListener(
      "click",
      this.clickHandler.bind(this),
    );
  }

  disconnectedCallback() {
    this.querySelector("button").removeEventListener(
      "click",
      this.clickHandler,
    );
  }

  render() {
    this.innerHTML = `
      <button title="Manually add new location">
        <img src="../img/pin.svg" />
      </button>
    `;
  }

  clickHandler() {
    alert("adding a pin");
  }
}
