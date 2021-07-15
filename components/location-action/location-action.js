// Define LeafletMap component
class LocationAction extends HTMLElement {

    static get observedAttributes() { 
        return [
            'data-has-location'
        ]
    }

    constructor() {    
        super()

        this.ui_map = null

        // Create some CSS to apply to the DOM
        const style = document.createElement('style')
        style.textContent = `
            location-action {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 2;
                text-align: center;
                color: #fff;
            }
            #svbtn,
            #locstat {
                
            }
            #svbtn {
                color: #fff;
                border-radius: .66rem;
                background: #000;
                padding: .5rem 1rem;
                border: solid .125rem #fff;
                margin: 1rem auto;
                box-shadow: 0 .125rem .5rem hsla(0,0%,0%,.33);
            }
            #locstat {
                color: #fff;
                background: hsla(0,0%,0%,.66);
                padding: .5rem;
                width: 100%;
                margin: 0;
            }
        `
        document.head.appendChild(style)

        // Create markup and attach to the DOM
        this.btn = document.createElement('button')
        this.btn.setAttribute('id', 'svbtn')
        this.btn.innerText = 'Save'
        this.btn.style.display = 'none'
        this.appendChild(this.btn)
        this.status = document.createElement('p')
        this.status.setAttribute('id', 'locstat')
        this.status.innerText = 'Location unavailable'
        this.appendChild(this.status)
    
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-has-location' && newValue !== oldValue) {
            console.log('attr change', newValue)
            if (newValue) {
                this.btn.style.display = 'block'
                this.status.style.display = 'none'
            } else {
                this.status.style.display = 'block'
                this.btn.style.display = 'none'
            }
        }
    }
}

customElements.define('location-action', LocationAction)
