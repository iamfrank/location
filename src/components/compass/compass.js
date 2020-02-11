import state from '../../state.js'
import Panel from '../panel/panel.js'

let panel

function init() {
    panel = Panel.createPanel('compass', true)
    panel.innerHTML = `
        <span class="ccircle"></span>
        <span class="cpointer"></span>
        <span class="cn">N</span>
        <span class="ce">E</span>
        <span class="cs">S</span>
        <span class="cw">W</span>
    `
    document.addEventListener('deviceorientation', updateHeading, true)    
    document.addEventListener('stateChanged', display, true)
}

function updateHeading(ev) {
    if (ev.absolute && state.heading !== ev.alpha) {
        state.update('heading', ev.alpha)
        display(state.heading)
    }
}

function display(ev) {
    panel.style.transform = 'rotate(' + ev.detail.heading + 'deg)'
}

export default {
    init
}