export default function() {
    
    // Properties
    let location_now = null
    let shouldHandle = true
    const geo_options = {
        enableHighAccuracy: true, 
        maximumAge: 30000, 
        timeout: 27000
    }
    const position_event = new CustomEvent('position', { detail: {
        position: () => location_now
    }})
    const timeout = 3000

    // Methods
    const normalizeGeolocation = function(geolocation) {
        return {
            accuracy: geolocation.coords.accuracy,
            latitude: geolocation.coords.latitude,
            longitude: geolocation.coords.longitude,
            timestamp: geolocation.timestamp
        }
    }
    const throttleHandler = function(callback, delay) {
        if (shouldHandle) {
            shouldHandle = false
            callback()
            setTimeout(function() {
                shouldHandle = true
            }, delay)
        }
    }
    const geo_success = function(position) {
        // Emit new position
        throttleHandler(function() {
            location_now = normalizeGeolocation(position)
            document.dispatchEvent(position_event)
        }, timeout)
    }
    const geo_error = function() {
        throttleHandler(function () {
            document.dispatchEvent(position_event)
            console.error("No location available :-(")
            return false
        }, timeout)
    }

    // Initialize

    // Watch geolocation
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(geo_success, geo_error, geo_options)
    } else {
        document.dispatchEvent(position_event)
        console.error("No geolocation on this device")
    }
}
