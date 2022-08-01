let state = {
    root_element: 'locator',
    heading: false,
    lat: false,
    lng: false,
    accuracy: false,
    update: function(key, val) {
        this[key] = val
        document.dispatchEvent(ev)
    }
}

const ev = new CustomEvent('stateChanged', { detail: state })

export default state