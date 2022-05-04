// Define component
class LocationActions extends HTMLElement {

    static get observedAttributes() { 
        return [
            'data-location'
        ]
    }

    constructor() {    
        super()

        this.location = JSON.parse(this.dataset.location)
        console.log(this.location)

        // Create some CSS to apply to the DOM
        const style = document.createElement('style')
        style.textContent = `
            
        `
        document.head.appendChild(style)

        // Create markup and attach to the DOM
        this.p = document.createElement('p')
        this.p.innerHTML = `${this.location.latitude.toFixed(4)}, ${this.location.longitude.toFixed(4)}`
        this.appendChild(this.p)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-location' && newValue !== oldValue) {
            // Anything?
        }
    }
}

customElements.define('location-actions', LocationActions)
