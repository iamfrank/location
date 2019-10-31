import LeafletMap from './components/map/map.mjs'

LeafletMap.init()

/*
 * Properties
 */

var ui_info = document.getElementById('position-info'),
    positions = [],
    current_pos = null

// For testing
/*
positions = [
    { 
        latitude: 55.536780,
        longitude: 11.971517  
    },
    { 
        latitude: 55.534440,
        longitude: 11.974178  
    },
    {
        latitude: 55.534005,
        longitude: 11.973146
    }
]
*/


/*
 * Methods
 */

function displayLatLng(coords) {
    var str = ''
    if (coords.latitude > 0) {
        str += 'N ' + coords.latitude.toFixed(4) + '&#176;<br>'
    } else if (coords.latitude < 0) {
        str += 'S ' + coords.latitude.toFixed(4) + '&#176;<br>'
    } else {
        str = '0&#176;<br>'
    }
    if (coords.longitude > 0) {
        str += 'E ' + coords.longitude.toFixed(4) + '&#176;'
    } else if (coords.latitude < 0) {
        str += 'W ' + coords.longitude.toFixed(4) + '&#176;'
    } else {
        str += '0&#176;'
    }
    return str
}

function renderMarkers() {
    for (var p in positions) {
        var pos_num = parseInt(p) + 1
        L.marker([positions[p].latitude, positions[p].longitude]).addTo(ui_map)
        .bindPopup('<strong>Position ' + pos_num + '</strong><br>' + displayLatLng({latitude: positions[p].latitude, longitude: positions[p].longitude}))
    }
}

function locationSuccess(position) {
    console.log('location data', position)
    var latlng = {latitude: position.latitude, longitude: position.longitude},
        ui_latlng = displayLatLng(latlng)
    ui_info.innerHTML = ui_latlng
    positions.push(latlng)
    renderMarkers()
}

function locationError(err) {
    console.log(err)
    ui_info.textContent = 'Unable to retrieve your location'
}