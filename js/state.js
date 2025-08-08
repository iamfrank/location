const localstorage_key = "locator-iegh383hd8";
const locations_change_event = new CustomEvent("updatelocations");
let locations = [];

function getLocations() {
  const ls = JSON.parse(localStorage.getItem(localstorage_key));
  locations = ls ? ls : [];
  return locations;
}

function getLocation(title) {
  return locations.find((l) => l.title === title);
}

function saveLocation(title, location_data) {
  const locationObject = {
    title: title,
    latitude: location_data.latitude,
    longitude: location_data.longitude,
    accuracy: location_data.accuracy,
    altitude: location_data.altitude,
    altitude_accuracy: location_data.altitude_accuracy,
    speed: location_data.speed,
    heading: location_data.heading,
  };
  locations.push(locationObject);
  commitLocations(locations);
}

function deleteLocation(location_data) {
  let loc_idx = locations.findIndex(function (loc) {
    return loc.title === location_data.title;
  });
  locations.splice(loc_idx, 1);
  commitLocations(locations);
}

function commitLocations(locations_array) {
  localStorage.setItem(localstorage_key, JSON.stringify(locations_array));
  document.dispatchEvent(locations_change_event);
}

export { getLocations, getLocation, saveLocation, deleteLocation };
