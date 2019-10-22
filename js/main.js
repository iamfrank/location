/*
 * Properties
 */

var ui_info = document.getElementById('position-info'),
    current_pos = null


/*
 * Methods
 */

function success(position) {
    current_pos = position
    ui_info.innerHTML = displayLatLng(current_pos.coords)
}

function error() {
    ui_info.textContent = 'Unable to retrieve your location'
}

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

function openMap() {

}


/*
 * Initialization
 */

if (!navigator.geolocation) {
    ui_info.textContent = 'Geolocation is not supported by your browser'
} else {
    ui_info.textContent = 'Locating…'
    navigator.geolocation.getCurrentPosition(success, error);
}
