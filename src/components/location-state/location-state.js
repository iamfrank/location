export default function() {
    
    // Properties
    let location_now = null
    let locations = []
    let shouldHandle = true
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
    const timeout = 3000

    // Methods
    const getSavedLocations = function() {
        return locations
    }
    const saveCurrentLocation = function(location_data) {
        location_data.title = prompt('Save location as:', `Location #${ locations.length }`) 
        locations.push(location_data)
        saveLocations()
    }
    const deleteLocation = function(location_title) {
        if (confirm('Are you sure you want to delete saved location?')) {
            const loc_idx = locations.findIndex(function(l){
                return l.title === location_title
            })
            locations.splice(loc_idx, 1)
            saveLocations()
        }   
    }
    const saveLocations = function() {
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
        saveCurrentLocation,
        deleteLocation
    }
}
