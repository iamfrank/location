export class LocationLocator extends HTMLElement {
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

  render() {
    this.innerHTML = `
      <button title="Locate my position">
        <img src="./img/crosshair.svg" />
      </button>
    `;
  }

  clickHandler() {}
}
