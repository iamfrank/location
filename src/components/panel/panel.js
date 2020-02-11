import State from '../../state.js'

function createPanel(panel_id, is_visible) {
    let node = document.createElement('div')
    node.id = panel_id
    node.className = 'panel'
    if (!is_visible) {
        node.classList.add('hide')
    }
    document.getElementById(State.root_element).appendChild(node)
    node.toggle = function() {
        this.classList.toggle('hide')
    }
    return node
}

export default {
    createPanel
}