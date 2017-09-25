/*
* Javascript for Geolocation webapp
*/

var geolocator = (function() {

    var geo = {},
        geo_watcher,
        geo_current_position,
        geo_map = L.map('maplayer', {
            zoom: 10,
            dragging: false,
            attributionControl: false,
            zoomControl: false
        }),
        geo_map_marker,
        geo_map_polyline,
        geo_map_icon_a = L.icon({
            iconUrl: 'img/icon-a.svg',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            popupAnchor: [32, 16]
        }),
        geo_map_icon_b = L.icon({
            iconUrl: 'img/icon-b.svg',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            popupAnchor: [32, 16]
        }),
        geo_online = navigator.onLine,
        geo_routes = [],
        geo_route = {
            track: {
                name: 'Undefined',
                coords: [],
                distance: 0
            },
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
                    timeout: 10000
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
        ui_pos.innerHTML = `
            <dl>
                <dt>Latitude</dt>  
                <dd>${position.coords.latitude.toFixed(6)}</dd>
                <dt>Longitude</dt>  
                <dd>${position.coords.longitude.toFixed(6)}</dd>
                <dt>Position accuracy</dt>  
                <dd>${position.coords.accuracy.toFixed(0)}m</dd>
            </dl>
        `; 
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
        geo_map_marker = L.marker(latlon, {icon: geo_map_icon_a}).addTo(geo_map);
        geo_map.setView(latlon);
        if (geo_online) {
            console.log('stuff');
            // http://b.tile.stamen.com/terrain/8/48/96.png
            // http://tile.stamen.com/terrain/zoom/x/y.jpg
            L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png').addTo(geo_map);
        }
    }

    function setWaypoint() {
        var latlon = [geo_current_position.coords.latitude, geo_current_position.coords.longitude];
        geo_route.track.coords.push(latlon);
        ui_log_list.innerHTML += '<li style="font-size: smaller">Waypoint set at ' + latlon + '</li>';
        geo_map_marker = L.marker(latlon, {icon:  geo_map_icon_b}).addTo(geo_map);
        geo_route.redraw; 
    }

    function redrawMap() {
        geo_map.removeLayer(geo_map_polyline);
        geo_map_polyline = L.polyline(geo_route.track.coords, {color: '#aabbff'}).addTo(geo_map);
        map.fitBounds(geo_map_polyline.getBounds());
    }

    function listRoutes() {
        var ui_routelist = document.getElementById('routeList');
        var route_list = '';
        for (var r in geo_routes) {
            route_list += '<li><button>' + geo_routes[r].name + '</button></li>';
        }
        ui_routelist.innerHTML = route_list;
    }

    function logData(data) {
        ui_log_list.innerHTML += '<li style="font-size: smaller">' + data + '</li>';
    }

    function getSingleLocation() {
        startSpinner()
        if ('geolocation' in navigator) {
            var single_pos = navigator.geolocation.getCurrentPosition(
                function (position) {
                    logData('Got current position: ' + position.coords.latitude.toFixed(4) + ',' + position.coords.longitude.toFixed(4) + '; acc: ' + position.coords.accuracy + 'm');
                    geo_current_position = position;
                    ui_pos.innerHTML = `
                        <dl>
                            <dt>Latitude</dt>  
                            <dd>${position.coords.latitude.toFixed(4)}</dd>
                            <dt>Longitude</dt>  
                            <dd>${position.coords.longitude.toFixed(4)}</dd>
                            <dt>Position accuracy</dt>  
                            <dd>${position.coords.accuracy}m</dd>
                        </dl>
                    `; 
                    stopSpinner();
                    pinMarker([position.coords.latitude, position.coords.longitude], geo_map_icon_b);
                }, 
                showPosError, 
                {
                    enableHighAccuracy: false,
                    timeout: 10000
                }
            );
        } else {
            stopSpinner();
            ui_pos.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    return geo;

}());


geolocator.init();


/*
function onLocationFound(e) {
        // Get prior coord to compare
        var pre_coord = geo_route.coords[geo_route.coords.length - 1];
        var dist;
        if (pre_coord) {
            dist = geo_map.distance( [e.latitude, e.longitude], [pre_coord.latitude, pre_coord.longitude] );
            console.log('distance');
            console.log(geo_map.distance( [e.latitude, e.longitude], [pre_coord.latitude, pre_coord.longitude] ));
        } else {
            dist = 0;
        }
        // Push position to current route
        geo_route.coords.push({
            latitude: e.latitude,
            longitude: e.longitude,
            distance: dist,
            accuracy: e.accuracy
        });
        redrawMap(geo_route);
        redrawLog(geo_route);
        redrawLocationInfo(geo_route);
    }
    
    function onLocationError(e) {
        alert(e.message);
    }
    
    function redrawMap(route) {
        // Clean up map
        if (geo_map_marker !== undefined) {
            geo_map_marker.remove();    
        }
        if (geo_map_circle !== undefined) {
            geo_map_circle.remove();
        }
        if (geo_map_polyline !== undefined) {
            geo_map_polyline.remove();    
        }
        // Get positions for new map markers and calculate running distance
        route.distance = 0;
        var latlngs = [];
        for (var c in route.coords) {
            latlngs.push([ route.coords[c].latitude, route.coords[c].longitude ]);
            // Now we're at it, add the distances together
            route.distance += route.coords[c].distance;
        }
        // Draw the route
        geo_map_polyline = L.polyline(latlngs, {color: 'blue'}).addTo(geo_map);
        // zoom the map to the polyline
        geo_map.fitBounds(geo_map_polyline.getBounds());
        // Redraw the current position
        var radius = route.coords[route.coords.length - 1].accuracy / 2;
        var latlng = [ route.coords[route.coords.length - 1].latitude, route.coords[route.coords.length - 1].longitude ];
        geo_map_marker = L.marker(latlng).addTo(geo_map).bindPopup("You are within " + radius + " meters from this point");
        geo_map_circle = L.circle(latlng, radius).addTo(geo_map);
    }
    
    function redrawLog(route) {
        logdisplay.innerHTML = "<strong>" + route.name + "</strong>";
        for (var r in route.coords) {
            logdisplay.innerHTML += "<p>latlong: " + route.coords[r].latitude + "," + route.coords[r].longitude + "; distance: " + route.coords[r].distance + "</p>";    
        }
    }
    
    function redrawLocationInfo(route) {
        // Display geolocation data on screen
        console.log(route);
        var coord = route.coords[route.coords.length - 1];
        locdisplay.innerHTML = "<dl>"
                    + "<dt>Route</dt><dd>" + route.name + "</dd>"
                    + "<dt>Latitude</dt><dd>" + coord.latitude.toFixed(4) + "</dd>"
                    + "<dt>Longitude</dt><dd>" + coord.longitude.toFixed(4) + "</dd>"
                    + "<dt>Distance</dt><dd>" + route.distance.toFixed(0) + "m</dd>"
                    + "</dl>";
    }
    
    function startTracking() {
        geo_route = {
            name: 'New route ' + geo_routes.length,
            coords: [],
            distance: 0
        };
        geo_map.locate({
            setView: true,
            enableHighAccuracy: true,
            watch: true
        });
    }
    
    function stopTracking() {
        geo_map.stopLocate();
        geo_routes.push(geo_route);
        saveRoutes(geo_routes);
        listRoutes(geo_routes);
    }
    
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