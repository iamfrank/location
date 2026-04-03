import { on, get } from "../../modules/state.js";
import { formatCoords } from "../../modules/format.js";

export class StatusBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.className = "location-status";
    on("navigate", this.render.bind(this));
    on("current", this.render.bind(this));
  }

  render() {
    const navigation = get("navigate");
    const current = get("current");
    this.innerHTML = `
      ${current ? `<dl><dt>pos</dt><dd>${formatCoords(current.latitude, current.longitude)}</dd></dl>` : ""}
      ${navigation?.from ? `<dl><dt>orig</dt><dd>${formatCoords(navigation.from.latitude, navigation.from.longitude)}</dd></dl>` : ""}
      ${navigation?.to ? `<dl><dt>dest</dt><dd>${formatCoords(navigation.to.latitude, navigation.to.longitude)}</dd></dl>` : ""}
    `;
  }
}
