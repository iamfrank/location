/*
* Javascript for Geolocation webapp
*/

var geolocator = (function() {

    var geo = {},
        geo_map = L.map('maplayer').fitWorld(),
        geo_map_marker,
        ui_pos = document.getElementById("positionInfo"),
        ui_spinner = document.getElementById("loadingOverlay");
        
    geo.init = init;
    geo.getLocation = getLocation;


    function init() {
        
        startSpinner();
        // Get current location
        getLocation();
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

    function getLocation() {
        startSpinner()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosSuccess, showPosError);
        } else {
            stopSpinner();
            ui_pos.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosSuccess(position) {
        ui_pos.innerHTML = `
            <dl>
                <dt>Latitude</dt>  
                <dd>${position.coords.latitude}</dd>
                <dt>Longitude</dt>  
                <dd>${position.coords.longitude}</dd>
                <dt>Position accuracy</dt>  
                <dd>${position.coords.accuracy}m</dd>
            </dl>
        `; 
        stopSpinner();
        pinMarker(position.coords.latitude, position.coords.longitude);
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

    function pinMarker(lat, lon) {
        var latlon = [lat,lon];
        geo_map_marker = L.marker(latlon).addTo(geo_map);
        geo_map.flyTo(latlon, 10);
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
