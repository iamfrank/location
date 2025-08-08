import FlatGeoLocation from "./location-object.js";

const localstorage_key = "locator-iegh383hd8";
const locations_change_event = new CustomEvent("updatelocations");
let locations = [];
let currentLocation = null;

function setCurrentLocation(location) {
  currentLocation = location;
}

function getCurrentLocation() {
  return currentLocation;
}

function getLocations() {
  const ls = JSON.parse(localStorage.getItem(localstorage_key));
  locations = ls ? ls : [];
  return locations;
}

function getLocation(title) {
  return locations.find((l) => l.title === title);
}

function saveLocation(title, location_data) {
  const locationObject = new FlatGeoLocation(title, location_data);
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

export {
  getLocations,
  getLocation,
  saveLocation,
  deleteLocation,
  getCurrentLocation,
  setCurrentLocation,
};
