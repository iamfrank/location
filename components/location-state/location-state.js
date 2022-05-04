export default function() {
    
    // Properties
    let location_now = null
    let locations = []
    const geo_options = {
        enableHighAccuracy: true, 
        maximumAge: 30000, 
        timeout: 27000
    }
    const localstorage_key = 'iamfrank-locator'
    const position_event = new CustomEvent('position', { detail: {
        position: () => location_now
    }})
    const locations_change_event = new CustomEvent('changelocations', { detail: {
        locations: () => locations
    }})

    // Methods
    const getSavedLocations = function() {
        return locations
    }
    const saveCurrentLocation = function() {
        locations.push(location_now)
        localStorage.setItem(localstorage_key, JSON.stringify(locations))
        document.dispatchEvent(locations_change_event)
    }
    const normalizeGeolocation = function(geolocation) {
        return {
            accuracy: geolocation.coords.accuracy,
            latitude: geolocation.coords.latitude,
            longitude: geolocation.coords.longitude,
            timestamp: geolocation.timestamp
        }
    }
    const geo_success = function(position) {
        // Emit new position
        location_now = normalizeGeolocation(position)
        document.dispatchEvent(position_event)
    }
    const geo_error = function() {
        document.dispatchEvent(position_event)
        console.error("No location available :-(")
        return false
    }

    // Initialize

    // Fetch saved locations on page load
    window.addEventListener('load', function() {
        locations = JSON.parse( localStorage.getItem(localstorage_key) ) || []
        document.dispatchEvent(locations_change_event)
    })

    // Watch geolocation
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(geo_success, geo_error, geo_options)
    } else {
        document.dispatchEvent(position_event)
        console.error("No geolocation on this device")
    }

    return {
        getSavedLocations,
        saveCurrentLocation
    }
}
