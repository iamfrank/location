export class CloseButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render(this.getAttribute("for"));
  }

  render(targetId) {
    this.innerHTML = `
      <button title="Close" popovertarget="${targetId}" popovertargetaction="hide">✖</button>
    `;
  }
}
