import appState from "../app-state/app-state.js"

// Define component
export class LocationActions extends HTMLElement {

    style = `
        .location-actions-wrapper {
            display: none;
            border: solid 1px yellow;
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #fff;
            z-index: 99999;
        }
        .location-close-button {

        }
    `
    template = `
        <style>${this.style}</style>
        <button class="btn-close">x</button>
        <h3></h3>
        <p></p>
        <button class="btn-save-location">Save location</button>
        <button class="btn-delete-location">Delete</button>
    `
    location
    dom_el
    state = appState

    // setter
    setLocation(data) {
        this.location = data
        this.renderDOM(this.location)
    }

    constructor() {
        super()
        this.createShadowDOM()
    }

    // Methods
    createShadowDOM() {
        // Create markup and attach to the DOM
        this.attachShadow({ mode: 'open' }) // sets and returns 'this.shadowRoot'
        // Create div element
        const wrapper = document.createElement('div')
        wrapper.className = 'location-actions-wrapper'
        wrapper.innerHTML = this.template
        // attach the created elements to the shadow DOM
        this.shadowRoot.append(wrapper)
        this.dom_el = wrapper

        this.shadowRoot.addEventListener('click', (event) => {
            if (event.target.className === 'btn-close') {
                this.dom_el.style.display = 'none'
            } else if (event.target.className === 'btn-save-location') {
                this.location.title = prompt('Save location as:')
                this.state.saveLocation(this.location)
                this.dom_el.style.display = 'none'
            } else if (event.target.className === 'btn-delete-location' && confirm('Do you want to delete this waypoint?')) {
                this.state.deleteLocation(this.location)
                this.dom_el.style.display = 'none'
            }
        })
    }

    renderDOM(location_data) {

        const p_el = this.dom_el.querySelector('p')

        this.shadowRoot.querySelector('h3').innerText = location_data.title ? location_data.title : ''

        p_el.innerHTML = `${location_data.latitude.toFixed(4)}, ${location_data.longitude.toFixed(4)}`

        if (Boolean(location_data.is_current)) {
            this.dom_el.querySelector('.btn-save-location').style.display = 'block'
            this.dom_el.querySelector('.btn-delete-location').style.display = 'none'
        } else {
            this.dom_el.querySelector('.btn-save-location').style.display = 'none'
            this.dom_el.querySelector('.btn-delete-location').style.display = 'block'
        }

        this.dom_el.style.display = 'block'
    }
}
