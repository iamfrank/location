/*
* Javascript for Geolocation webapp
*/

var geolocator = (function() {

    var geo = {},
        geo_watcher,
        geo_current_position,
        geo_map = L.map('maplayer', {
            center: [55, 15],
            zoom: 10,
            attributionControl: false,
            zoomControl: false
        }),
        geo_map_tiles = false,
        geo_map_pos_marker,
        geo_map_track_marker,
        geo_map_polyline,
        geo_map_icon_a = L.icon({
            iconUrl: 'img/icon-a.svg',
            iconSize: [48, 48],
            iconAnchor: [24, 48]
        }),
        geo_map_icon_b = L.icon({
            iconUrl: 'img/icon-b.svg',
            iconSize: [48, 48],
            iconAnchor: [24, 48]
        }),
        geo_online = navigator.onLine,
        geo_routes = [],
        geo_route = {
            name: 'Undefined',
            positions: [],
            distance: 0,
            time: '-',
            speed: 0,
            calcDistance: calcTotalDistance,
            calcTime: calcTotalTime,
            calcSpeed: calcAvgSpeed,
            setMarker: setWaypoint,
            redraw: redrawMap
        },
        ui_pos = document.getElementById("positionInfo"),
        ui_spinner = document.getElementById("loadingOverlay"),
        ui_tracking_elements = document.getElementsByClassName('track-visible'),
        ui_log_container = document.getElementById("log"),
        ui_log_button = document.querySelector(".log-toggle"),
        ui_log_wrapper = document.querySelector(".log-wrapper"),
        ui_log_list = document.querySelector(".log-list"),
        ui_set_wp_button = document.querySelector(".set_wp_btn");
        
        
    geo.init = init;


    function init() {
        
        // Get current location
        startLocating();

        if (geo_online && !geo_map_tiles) {
            L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png').addTo(geo_map);
        }

        // Add event listeners
        ui_log_button.addEventListener('click', function() {
            ui_log_container.classList.toggle("open");
        });
        ui_set_wp_button.addEventListener('click', function() {
            setWaypoint();
        });

        /*
        // Fetch already saved routes
        if (typeof(Storage) !== "undefined" && localStorage.geolocatorSavedRoutes) {
            geo_routes = JSON.parse(localStorage.geolocatorSavedRoutes);
        } else {
            // No support for web storage
            console.log('No support for web storage');
        }
        */
    }

    function startLocating() {
        startSpinner()
        if ('geolocation' in navigator) {
            navigator.geolocation.clearWatch(geo_watcher);
            geo_watcher = navigator.geolocation.watchPosition(
                showPosSuccess, 
                showPosError, 
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            stopSpinner();
            ui_pos.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosSuccess(position) {
        logData([
            'Got watchposition: ',
            position.coords.latitude.toFixed(4),
            ',',
            position.coords.longitude.toFixed(4),
            '; acc: ',
            position.coords.accuracy.toFixed(0),
            'm'
        ].join(''));
        geo_current_position = position;
        redrawPosInfo(geo_current_position);
        stopSpinner();
        updateMarker([position.coords.latitude, position.coords.longitude]);
    }

    function showPosError(error) {
        stopSpinner();
        switch(error.code) {
            case error.PERMISSION_DENIED:
                ui_log_list.innerHTML += "<li>User denied the request for Geolocation.</li>"
                break;
            case error.POSITION_UNAVAILABLE:
                ui_log_list.innerHTML += "<li>Location information is unavailable.</li>"
                break;
            case error.TIMEOUT:
                ui_log_list.innerHTML += "<li>The request to get user location timed out.</li>"
                break;
            case error.UNKNOWN_ERROR:
                ui_log_list.innerHTML += "<li>An unknown error occurred.</li>"
                break;
        }
    }

    function startSpinner() {
        ui_spinner.style.display = 'block';
    }

    function stopSpinner() {
        ui_spinner.style.display = 'none';
    }

    function updateMarker(latlon) {        
        if (geo_map_pos_marker !== undefined ) {
            geo_map.removeLayer(geo_map_pos_marker);
        }
        geo_map_pos_marker = L.marker(latlon, {icon: geo_map_icon_a}).addTo(geo_map);
        geo_map.setView(latlon);
    }

    function setWaypoint() {
        geo_current_position.timestamp = new Date();
        var latlon = [geo_current_position.coords.latitude, geo_current_position.coords.longitude];
        geo_route.positions.push(geo_current_position);
        ui_log_list.innerHTML += '<li style="font-size: smaller">Waypoint set at ' + latlon + '</li>';
        geo_map_track_marker = L.marker(latlon, {icon:  geo_map_icon_b}).addTo(geo_map);
        geo_route.calcDistance();
        geo_route.calcTime();
        redrawPosInfo(geo_current_position);
        geo_route.redraw();
    }

    function redrawMap() {
        if (geo_map_polyline !== undefined ) {
            geo_map.removeLayer(geo_map_polyline);
        }
        var latlngs = [];
        for (var p in geo_route.positions) {
            var c = geo_route.positions[p].coords;
            latlngs.push([c.latitude, c.longitude]);
        }
        geo_map_polyline = L.polyline(latlngs, {color: '#401B00'}).addTo(geo_map);
        geo_map.fitBounds(geo_map_polyline.getBounds());
    }

    function redrawPosInfo(position) {
        ui_pos.innerHTML = `
            <dl class="location-info">
                <dt>Latitude</dt>  
                <dd>${position.coords.latitude.toFixed(6)}</dd>
                <dt>Longitude</dt>  
                <dd>${position.coords.longitude.toFixed(6)}</dd>
                <dt>Position accuracy</dt>  
                <dd>${position.coords.accuracy.toFixed(0)}m</dd>
                <dt>Altitude</dt>
                <dd>${position.coords.altitude ? position.coords.altitude.toFixed(6) : '-'}</dd>
                <dt>Altitude accuracy</dt>
                <dd>${position.coords.altitudeAccuracy ? position.coords.altitudeAccuracy.toFixed(6) : '-'}</dd>
                <dt>Heading</dt>
                <dd>${position.coords.heading ? position.coords.heading.toFixed(0) : '-'}</dd>
                <dt>Speed</dt>
                <dd>${position.coords.speed ? position.coords.speed.toFixed(0) + 'm/s' : '-'}</dd>
                <dt>Latest position time</dt>
                <dd>${position.timestamp ? new Date(position.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}</dd>
                <dt>Distance travelled</dt>
                <dd>${(geo_route.distance / 1000).toFixed(1) + 'km'}</dd>
                <dt>Time travelled</dt>
                <dd>${(geo_route.calcTime() / 1000).toFixed(0).toString().padStart(2, "0") + 'sec'}</dd>
                <dt>Avg. speed</dt>
                <dd>${((geo_route.calcSpeed())*3.6).toFixed(0) + 'km/h'}</dd>
            </dl>
        `;
    }

    function logData(data) {
        ui_log_list.innerHTML += '<li style="font-size: smaller">' + data + '</li>';
    }

    function calcTotalDistance() {
        if (geo_route.positions.length > 1) {
            for (var p = 1; p < geo_route.positions.length; p++) {
                var c1 = geo_route.positions[p].coords;
                var c2 = geo_route.positions[p-1].coords;
                geo_route.distance += geo_map.distance([c1.latitude, c1.longitude],[c2.latitude, c2.longitude]);
            }
            return geo_route.distance;
        } else {
            return 0;
        }
    }

    function calcTotalTime() {
        if (geo_route.positions.length > 1) {
            var t1 = geo_route.positions[0].timestamp,
                t2 = geo_route.positions[geo_route.positions.length -1].timestamp;
            return geo_route.time = t2 - t1;
        } else {
            return 0;
        }
    }

    function calcAvgSpeed() {
        if (geo_route.positions.length > 1) {
            return geo_route.speed = geo_route.distance / geo_route.time;
        } else {
            return 0;
        }
    }

    return geo;

}());


geolocator.init();


/*
        
    function saveRoutes(routes) {
        localStorage.setItem("geolocatorSavedRoutes", JSON.stringify(routes));
    }
    
    function listRoutes(routes) {
        routedisplay.innerHTML = '';
        for (var r in routes) {
            routedisplay.innerHTML += '<li><button class="btn" onclick="geolocator.loadRoute(' + r + ')">' + routes[r].name + '</button><button class="btn" onclick="geolocator.deleteRoute(' + r + ')">Delete</button></li>';
        }
    }
    
    function loadRoute(route_id) {
        location.hash = '';
        geo_route = geo_routes[route_id];
        redrawLog(geo_route);
        redrawLocationInfo(geo_route, geo_route.coords[geo_route.coords.length - 1]);
        redrawMap(geo_route);
    }
    
    function deleteRoute(route_id) {
        if (confirm('Delete?')) {
            geo_routes.splice(route_id, 1);
            saveRoutes(geo_routes);
            listRoutes(geo_routes);    
        }
    }
*/
