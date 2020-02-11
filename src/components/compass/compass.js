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
    window.addEventListener('deviceorientation', updateHeading, true)    
}

function updateHeading(ev) {
    if (state.heading !== ev.alpha) {
        state.heading = ev.alpha
        display(state.heading)
    }
}

function display(data) {
    panel.style.transform = 'rotate(' + data + 'deg)'
}

export default {
    init
}