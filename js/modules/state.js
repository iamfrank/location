import FlatGeoLocation from "./location-object.js";

const localstorage_key = "locator-iegh383hd9";
const state = {
  callbacks: {},
  locations: [],
  current: null,
  tracking: {
    active: false,
    from: null,
    to: null,
  },
};

/**
 * Events:
 * `tracking`
 * `current`
 * `locations`
 */
function on(actionId, callback) {
  if (!state.callbacks[actionId]) state.callbacks[actionId] = [];
  state.callbacks[actionId].push(callback);
  return () => off(actionId, callback); // returns unsubscribe fn
}

function off(actionId, callback) {
  state.callbacks[actionId] = (state.callbacks[actionId] || []).filter(
    (cb) => cb !== callback,
  );
}

function set(stateProp, data) {
  state[stateProp] = data;
  (state.callbacks[stateProp] || []).forEach((cb) => cb(state[stateProp]));
  return state;
}

function get(stateProp) {
  return state[stateProp];
}

/** Fetches locations from localStorage */
function loadLocations() {
  const ls = JSON.parse(localStorage.getItem(localstorage_key));
  state.locations = ls ? ls : [];
  set("locations", state.locations);
  return state.locations;
}

function findLocation(title) {
  return state.locations.find((l) => l.title === title);
}

function saveLocation(title, location_data) {
  let _title = title;
  if (!title || title === "") {
    _title = "unknown";
  }
  const locationObject = new FlatGeoLocation(_title, location_data);
  return saveLocations([...state.locations, locationObject]);
}

function deleteLocation(location_data) {
  const loc_idx = state.locations.findIndex((loc) => {
    return loc.title === location_data.title;
  });
  if (loc_idx === -1) {
    return;
  }
  return saveLocations(state.locations.splice(loc_idx, 1));
}

function saveLocations(locations_array) {
  set("locations", locations_array);
  localStorage.setItem(localstorage_key, JSON.stringify(locations_array));
  return locations_array;
}

export {
  loadLocations,
  findLocation,
  saveLocation,
  deleteLocation,
  on,
  off,
  set,
  get,
};
