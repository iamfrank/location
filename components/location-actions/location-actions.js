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
        this.div = document.createElement('div')
        if (this.location.title) {
            this.h3 = document.createElement('h3')
            this.h3.innerText = this.location.title
            this.div.appendChild(this.h3)
        }
        this.p = document.createElement('p')
        this.p.innerHTML = `${this.location.latitude.toFixed(4)}, ${this.location.longitude.toFixed(4)}`
        this.div.appendChild(this.p)
        if (Boolean(this.dataset.isCurrent)) {
            this.savebtn = document.createElement('button')
            this.savebtn.className = 'btn-save-location'
            this.savebtn.innerText = 'Save location'
            this.div.appendChild(this.savebtn)
        } else {
            this.delbtn = document.createElement('button')
            this.delbtn.className = 'btn-delete-location'
            this.delbtn.innerText = 'Delete'
            this.delbtn.dataset.locationTitle = this.location.title
            this.div.appendChild(this.delbtn)
        }
        this.appendChild(this.div)
    }
}

customElements.define('location-actions', LocationActions)
