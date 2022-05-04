// Define component
class LocationActions extends HTMLElement {

    static get observedAttributes() { 
        return [
            'data-location'
        ]
    }

    constructor() {    
        super()

        // Create some CSS to apply to the DOM
        const style = document.createElement('style')
        style.textContent = `
            
        `
        document.head.appendChild(style)

        // Create markup and attach to the DOM
        this.btn = document.createElement('button')
        this.btn.innerText = 'Stuff'
        this.appendChild(this.btn)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-location' && newValue !== oldValue) {
            // Anything?
        }
    }
}

customElements.define('location-actions', LocationActions)
