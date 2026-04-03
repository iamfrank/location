import { on, get } from "../../modules/state.js";
import {
  formatCoords,
  formatHeading,
  formatDistance,
  calculateDistanceAndHeading,
} from "../../modules/utils.js";

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
      ${current ? `<dl><dt>pos</dt><dd>${current.title} ${formatCoords(current.latitude, current.longitude)}</dd></dl>` : ""}
      ${navigation?.from ? `<dl><dt>orig</dt><dd>${navigation.from.title} ${formatCoords(navigation.from.latitude, navigation.from.longitude)}</dd></dl>` : ""}
      ${navigation?.to ? `<dl><dt>target</dt><dd>${navigation.to.title} ${formatCoords(navigation.to.latitude, navigation.to.longitude)}</dd></dl>` : ""}
      ${navigation?.from && navigation?.to ? this.renderDistanceAndHeading(navigation.from, navigation.to) : ""}
    `;
  }

  renderDistanceAndHeading(from, to) {
    const { heading, distance } = calculateDistanceAndHeading(from, to);
    return `
      <dl><dt>heading</dt><dd>${formatHeading(heading)}</dd></dl>
      <dl><dt>dist</dt><dd>${formatDistance(distance)}</dd></dl>
    `;
  }
}
