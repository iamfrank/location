
import Compass from './components/compass/compass.js'

Compass.init()

/*
* HTML elements
*/

let pos_btn = document.getElementById('get-position'),
    set_btn = document.getElementById('set-position'),
    info_panel = document.getElementById('info-panel'),
    direction_panel = document.getElementById('direction-view'),
    end_dir_btn = document.getElementById('end-direction-btn'),
    info_dir_to = document.getElementById('direction-to'),
    info_dir_from = document.getElementById('direction-from'),
    info_dist = document.getElementById('point-distance'),
    info_bearing = document.getElementById('point-direction')


/*
* Properties
*/

let flag_user_has_zoomed = false,
    flag_is_tracking = false,
    geo_options = {
        enableHighAccuracy: true, 
        maximumAge: 30000, 
        timeout: 27000
    },
    pos_watcher = null,
    position_now = {
        coords: {
            latitude: 55,
            longitude: 11
        }
    },
    positions = [],
    ui_map = null,
    ui_map_marker = null

const icon = L.icon({
    iconUrl: './img/logo_v3_small.svg',
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -30],
})


/*
    * Methods
    */

function toDegrees(num) { 
    return num * 180 / Math.PI
}

function calcBearing(pos1,pos2)  {
    var R = 6371e3, // metres
        φ1 = pos1[0],
        φ2 = pos2[0],
        λ1 = pos1[1],
        λ2 = pos2[1],
        y = Math.sin(λ2-λ1) * Math.cos(φ2),
        x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2-λ1)
    console.log(toDegrees(Math.atan2(y, x)))
    return Math.round( toDegrees(Math.atan2(y, x)) ) + '°'
}

function calcDistance(dist_num) {
    var dist_pretty = ''
    if (dist_num < 1000) {
        dist_pretty = Math.round( dist_num ) + 'm'
    } else {
        dist_pretty = Math.round( dist_num / 1000 ) + 'km'
    }
    return dist_pretty
}

function updateBearing(pos_idx) {
    info_bearing.innerText = calcBearing(
        [position_now.coords.latitude, position_now.coords.longitude],
        [positions[pos_idx].lat, positions[pos_idx].lng]
    )
}

function updateDistance(pos_idx) {
    info_dist.innerText = calcDistance(ui_map.distance(
        [position_now.coords.latitude, position_now.coords.longitude], 
        [positions[pos_idx].lat, positions[pos_idx].lng]
    ))
}

function updateNavTo(pos_idx) {
    info_dir_to.innerText = positions[pos_idx].lat + ' ' + positions[pos_idx].lng
}

function updateNavFrom() {
    info_dir_from.innerText = position_now.coords.latitude + ' ' + position_now.coords.longitude
}

function accuracyDigester(accuracy) {
    let acc_obj = {
        display: '',
        zoom: 1
    }
    if (accuracy < 1) {
        acc_obj.display = `< 1m`
    } else if (accuracy < 1000) {
        acc_obj.display = `~ ${ accuracy.toFixed(0) }m`
    } else {
        acc_obj.display = `~ ${ (accuracy / 1000).toFixed(1) }km`   
    }
    if (accuracy < 50) {
        acc_obj.zoom = 19
    } else if (accuracy < 150) {
        acc_obj.zoom = 18
    } else if (accuracy < 250) {
        acc_obj.zoom = 17
    } else if (accuracy < 500) {
        acc_obj.zoom = 16
    } else if (accuracy < 1000) {
        acc_obj.zoom = 15
    } else if (accuracy < 2500) {
        acc_obj.zoom = 14
    } else if (accuracy < 5000) {
        acc_obj.zoom = 13
    } else if (accuracy < 10000) {
        acc_obj.zoom = 12
    } else if (accuracy < 15000) {
        acc_obj.zoom = 11
    } else if (accuracy < 25000) {
        acc_obj.zoom = 10
    } else if (accuracy < 50000) {
        acc_obj.zoom = 9
    } else if (accuracy < 150000) {
        acc_obj.zoom = 8
    } else if (accuracy < 250000) {
        acc_obj.zoom = 7
    } else {
        acc_obj.zoom = 6
    }
    return acc_obj
}

function renderPosition(position) {
    const lat = position.coords.latitude,
            lng = position.coords.longitude
    let str = 'Tracking current location<br>'
    if (lat > 0) {
        str += 'N ' + lat.toFixed(4) + '&#176;<br>'
    } else if (lat < 0) {
        str += 'S ' + lat.toFixed(4) + '&#176;<br>'
    } else {
        str = '0&#176;<br>'
    }
    if (lng > 0) {
        str += 'E ' + lng.toFixed(4) + '&#176;'
    } else if (lng < 0) {
        str += 'W ' + lng.toFixed(4) + '&#176;'
    } else {
        str += '0&#176;'
    }
    str += '<p class="info-accuracy">Accuracy: ' + accuracyDigester(position.coords.accuracy).display + '</p>'
    info_panel.innerHTML = str
}

function updateMap(position) {
    const lat = position.coords.latitude,
            lng = position.coords.longitude

    let zoom = ui_map.getZoom()
    if (!flag_user_has_zoomed) {
        zoom = accuracyDigester(position.coords.accuracy).zoom
    }
    ui_map_marker.setLatLng([lat, lng])
    ui_map.setView([lat, lng], zoom)
}

function geo_success(position) {
    position_now = position
    renderPosition(position)
    updateMap(position)
}

function geo_error() {
    info_panel.innerHTML = "No location available :-("
}

function deletePosition(position_time_id) {
    var idx = positions.findIndex(function(p) {
        return p.time === position_time_id
    })
    positions[idx].marker.remove()
    positions.splice(idx, 1)
    savePositions(positions)
}

function endPointMeTo() {
    direction_panel.style.display = 'none'
}

function pointMeTo(pos_idx) {
    direction_panel.style.display = 'block'
    updateNavFrom()
    updateNavTo(pos_idx)
    updateDistance(pos_idx)
    updateBearing(pos_idx)
}

function renderMarkers(positions) {
    for (var pos in positions) {
        let new_marker = L.marker([positions[pos].lat, positions[pos].lng], {icon: icon})
        .bindPopup('<p>' + positions[pos].lat + '<br>' + positions[pos].lng + '</p>' + '<button onclick="pointMeTo(' + pos + ')">Take me here</button> <button onclick="deletePosition(' + positions[pos].time + ')">Remove</button>')
        .addTo(ui_map)
        positions[pos].marker = new_marker
    }
}

function savePositions(arr) {
    let save_arr = arr.map(pos => {
        return Object.assign({}, pos)
    })
    
    save_arr.map(function(pos) {
        pos.marker = null
    })
    localStorage.setItem('locator-positions-7718522f6d83', JSON.stringify(save_arr))
}

function setGeoPos() {
    flag_is_tracking = false
    ui_map_marker.remove()
    navigator.geolocation.clearWatch(pos_watcher)
    let new_pos = {
        lat: position_now.coords.latitude,
        lng: position_now.coords.longitude,
        acc: position_now.coords.accuracy,
        time: new Date().getTime()
    }
    positions.push(new_pos)
    renderMarkers([new_pos])
    savePositions(positions)
    info_panel.innerHTML = 'Location set'
}

function renderMarker() {
    ui_map_marker = L.marker([0, 0], {icon: icon})
    .bindPopup('<button onclick="setGeoPos()">Set</button>')
    .addTo(ui_map)
}

function getGeoPos() {
    flag_user_has_zoomed = false
    flag_is_tracking = true
    if ("geolocation" in navigator) {
        renderMarker()
        pos_watcher = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options)
    } else {
        info_panel.textContent = "Can't locate on this device."
    }
}

function loadSavedPositions() {
    positions = JSON.parse( localStorage.getItem('locator-positions-7718522f6d83') ) || []
    renderMarkers(positions)
}

function initListeners() {
    pos_btn.addEventListener('click', function() {
        getGeoPos()
    })
    set_btn.addEventListener('click', function() {
        setGeoPos()
    })
    end_dir_btn.addEventListener('click', function() {
        endPointMeTo()
    })
}

function initMap() {
    ui_map = L.map('map').setView([position_now.coords.latitude, position_now.coords.longitude], 6)
    ui_map.addEventListener('zoomstart', function() {
        flag_user_has_zoomed = true
    })
    if (navigator.onLine) { // Only load map tiles if online
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(ui_map)
    }
}


/*
    * Initialization
    */

initListeners()
initMap()
loadSavedPositions()
