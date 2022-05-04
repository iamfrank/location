// Define component
class LocationActions extends HTMLElement {

    static get observedAttributes() { 
        return [
            'data-location',
            'data-is-current'
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
        if (Boolean(this.dataset.isCurrent)) {
            this.savebtn = document.createElement('button')
            this.savebtn.className = 'btn-save-location'
            this.savebtn.innerText = 'Save location'
            this.savebtn.addEventListener('click', this.saveLocation)
            this.p.appendChild(this.savebtn)
        } else {
            this.delbtn = document.createElement('button')
            this.delbtn.className = 'btn-delete-location'
            this.delbtn.innerText = 'Delete'
            this.delbtn.addEventListener('click', this.deleteLocation)
            this.p.appendChild(this.delbtn)
        }
        this.appendChild(this.p)
    }

    saveLocation() {
        let savename = prompt('Save location as:')
        console.log('saving location')
    }

    deleteLocation() {
        if (confirm('Are you sure you want to delete saved location?')) {
            console.log('deleting location')
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-location' && newValue !== oldValue) {
            // Anything?
        }
    }
}

customElements.define('location-actions', LocationActions)
