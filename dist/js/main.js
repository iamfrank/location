/*
* Javascript for Geolocation webapp
*/

var geolocator = (function() {

    var geo = {},
        geo_watcher,
        geo_current_position,
        geo_map = L.map('maplayer').fitWorld(),
        geo_map_marker,
        geo_routes = [],
        geo_route_new = {
            name: 'Undefined',
            coords: [],
            distance: 0
        },
        ui_pos = document.getElementById("positionInfo"),
        ui_spinner = document.getElementById("loadingOverlay"),
        ui_tracking_elements = document.getElementsByClassName('track-visible'),
        ui_log = document.getElementById("log");
        
        
    geo.init = init;
    geo.startLocating = startLocating;
    geo.startTracking = startTracking;
    geo.stopTracking = stopTracking;
    geo.setWaypoint = setWaypoint;
    geo.getSingleLocation = getSingleLocation;


    function init() {
        
        startSpinner();
        //Navigate to position view
        location.hash = 'positionView';
        // Get current location
        startLocating();
        // Initialize map
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(geo_map);

        /*
        // Fetch already saved routes
        if (typeof(Storage) !== "undefined" && localStorage.geolocatorSavedRoutes) {
            geo_routes = JSON.parse(localStorage.geolocatorSavedRoutes);
        } else {
            // No support for web storage
            console.log('No support for web storage');
        }
        
        // List routes
        listRoutes(geo_routes); 
        */
    }

    function startLocating() {
        startSpinner()
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(geo_watcher);
            geo_watcher = navigator.geolocation.watchPosition(
                showPosSuccess, 
                showPosError, 
                {
                    enableHighAccuracy: true, 
                    maximumAge        : 30000, 
                    timeout           : 27000
                }
            );
        } else {
            stopSpinner();
            ui_pos.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosSuccess(position) {
        logData('Got watchposition: ' + position.coords.latitude.toFixed(4) + ',' + position.coords.longitude.toFixed(4) + '; acc: ' + position.coords.accuracy + 'm');
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
        pinMarker([position.coords.latitude, position.coords.longitude]);
    }

    function showPosError(error) {
        stopSpinner();
        switch(error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred."
                break;
        }
    }

    function startSpinner() {
        ui_spinner.style.display = 'block';
    }

    function stopSpinner() {
        ui_spinner.style.display = 'none';
    }

    function pinMarker(latlon) {
        geo_map_marker = L.marker(latlon).addTo(geo_map);
        geo_map.flyTo(latlon, 10);
    }

    function startTracking() {
        // Navigate back to position page and display tracking options
        location.hash = 'positionView';
        for (var el of ui_tracking_elements) {
            el.style.display = 'block';
        }
    }

    function stopTracking() {
        geo_route_new.name = prompt('Name your route:');
        geo_routes.push(geo_route_new);
        // Clean up tracking route
        geo_route_new = {
            name: 'Undefined',
            coords: [],
            distance: 0
        };
        // Hide tracking UI
        for (var el of ui_tracking_elements) {
            el.style.display = 'none';
        }
        listRoutes();
    }

    function setWaypoint() {
        var latlon = [geo_current_position.coords.latitude, geo_current_position.coords.longitude];
        geo_route_new.coords.push(latlon);
        pinMarker(latlon);
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
        ui_log.innerHTML += '<li style="font-size: smaller">' + data + '</li>';
    }

    function getSingleLocation() {
        startSpinner()
        if (navigator.geolocation) {
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
                    pinMarker([position.coords.latitude, position.coords.longitude]);
                }, 
                showPosError, 
                {
                    enableHighAccuracy: true, 
                    maximumAge        : 30000, 
                    timeout           : 27000
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
* Register service worker
* (Does nothing at present. Is needed to display Chrome install web app banner.)
*/

var service_worker = (function() {
    
    var sw = {};
    
    sw.init = init;
    
    function init() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }).catch(function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    }
    
    return sw;
    
}());

service_worker.init();
