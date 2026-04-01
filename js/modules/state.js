import FlatGeoLocation from "./location-object.js";

const localstorage_key = "locator-iegh383hd8";
const locations_change_event = new CustomEvent("updatelocations");
const callbacks = {}; // 'update'
let locations = [];
let currentLocation = null;
let tracking = {
  active: false,
  from: null,
  to: null,
};

function on(actionId, callback) {
  if (!callbacks[actionId]) callbacks[actionId] = [];
  callbacks[actionId].push(callback);
  return () => off(actionId, callback); // returns unsubscribe fn
}

function off(actionId, callback) {
  callbacks[actionId] = (callbacks[actionId] || []).filter(
    (cb) => cb !== callback,
  );
}

function publish(actionId, newState) {
  (callbacks[actionId] || []).forEach((cb) => cb(newState));
}

function set(actionId, data) {
  switch (actionId) {
    case "track":
      tracking.active = data.active;
      if (data.from) {
        tracking.from = data.from;
      } else {
        tracking.from = null;
      }
      if (data.to) {
        tracking.to = data.to;
      } else {
        tracking.to = null;
      }
      publish("track", tracking);
      break;
    default:
    // Nothing
  }
}

function setCurrentLocation(location) {
  currentLocation = location;
  publish("currentlocation", currentLocation);
}

function getCurrentLocation() {
  return currentLocation;
}

/** Fetches locations from localStorage */
function getLocations() {
  const ls = JSON.parse(localStorage.getItem(localstorage_key));
  locations = ls ? ls : [];
  publish("locations", locations);
  return locations;
}

function getLocation(title) {
  return locations.find((l) => l.title === title);
}

function saveLocation(title, location_data) {
  let _title = title;
  if (!title || title === "") {
    _title = "unknown";
  }
  const locationObject = new FlatGeoLocation(_title, location_data);
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
  publish("locations", locations_array);
}

export {
  getLocations,
  getLocation,
  saveLocation,
  deleteLocation,
  getCurrentLocation,
  setCurrentLocation,
  on,
  off,
  set,
};
