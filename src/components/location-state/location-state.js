export class LocationState {
    
    // Properties
    location_now = null
    shouldHandle = true
    geo_options = {
        enableHighAccuracy: true, 
        maximumAge: 30000, 
        timeout: 27000
    }
    position_event = new CustomEvent('position', { detail: {
        position: () => this.location_now
    }})
    timeout = 3000

    // Methods
    normalizeGeolocation(geolocation) {
        return {
            accuracy: geolocation.coords.accuracy,
            latitude: geolocation.coords.latitude,
            longitude: geolocation.coords.longitude,
            timestamp: geolocation.timestamp
        }
    }
    throttleHandler(callback, delay) {
        if (this.shouldHandle) {
            this.shouldHandle = false
            callback()
            setTimeout(function() {
                this.shouldHandle = true
            }, delay)
        }
    }

    // Constructor
    constructor() {
        if ("geolocation" in navigator) {
            // Watch geolocation
            navigator.geolocation.watchPosition(
                (position) => {
                    this.throttleHandler(() => {
                        this.location_now = this.normalizeGeolocation(position)
                        document.dispatchEvent(this.position_event)
                    }, this.timeout)
                },
                (error) => {
                    this.throttleHandler(() => {
                        console.error("No location available :-( ", error)
                        document.dispatchEvent(this.position_event)
                        return false
                    }, this.timeout)
                },
                this.geo_options
            )
        } else {
            document.dispatchEvent(this.position_event)
            console.error("No geolocation on this device")
        }
    }
}
