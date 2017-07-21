/*
 * Javascript for Geolocation webapp
 */

var x = document.getElementById("location");

function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude
                + "<br>Longitude: " + position.coords.longitude
                + "<br>Accuracy: " + position.coords.accuracy
                + "<br>Altitude: " + position.coords.altitude
                + "<br>Altitude accuracy: " + position.coords.altitudeAccuracy
                + "<br>Heading: " + position.coords.heading
                + "<br>Timestamp: " + position.coords.timestamp;
}

function showError(error) {
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

getLocation();


/*
 * Register service worker
 * (Does nothing at present. Is needed to display Chrome install web app banner.)
 */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('../dist/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
