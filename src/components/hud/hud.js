import Panel from '../panel/panel.js'
import { accuracyDigester } from '../../filters/filters.js'

let panel

function init() {
    panel = Panel.createPanel('hud', true)
    document.addEventListener('stateChanged', display, true)
}

function display(ev) {
    let str = `<span>Heading: ${ ev.detail.heading}</span><br>`
    if (ev.detail.lat > 0) {
        str += 'N ' + ev.detail.lat.toFixed(4) + '&#176;<br>'
    } else if (ev.detail.lat < 0) {
        str += 'S ' + ev.detail.lat.toFixed(4) + '&#176;<br>'
    } else {
        str = '0&#176;<br>'
    }
    if (ev.detail.lng > 0) {
        str += 'E ' + ev.detail.lng.toFixed(4) + '&#176;'
    } else if (ev.detail.lng < 0) {
        str += 'W ' + ev.detail.lng.toFixed(4) + '&#176;'
    } else {
        str += '0&#176;'
    }
    str += '<p class="info-accuracy">Accuracy: ' + accuracyDigester(ev.detail.accuracy).display + '</p>'
    panel.innerHTML = str
}

export default {
    init
}