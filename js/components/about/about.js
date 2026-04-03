export class AboutPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <button popovertarget="aboutdialog" title="About this app" class="popover-btn">
        <img src="./img/logo.svg" alt="About">
      </button>
      <dialog id="aboutdialog" popover>
        <button-close for="aboutdialog"></button-close>
        <h2>Locator</h2>
        <p>A web application to track and display geolocations by <a href="https://iamfrank.github.io">Iamfrank</a>.</p>
        <p>
          <a
            id="go-github"
            href="https://github.com/iamfrank/location"
            title="Check this out on Github"
            target="_blank"
          >Check this out on Github</a>
        </p>
        <p><small>v1.0.2</small></p>
      </dialog>
    `;
  }
}
