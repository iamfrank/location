let locations = []
const localstorage_key = 'locator-iegh383hd8'
const locations_change_event = new CustomEvent('updatelocations')

function getLocations() {
  const ls = JSON.parse(localStorage.getItem(localstorage_key))
  locations = ls ? ls : []
  return locations
}

function getLocation(title) {
  const ls = JSON.parse(localStorage.getItem(localstorage_key))
  locations = ls ? ls : []
  return locations.find((l) => l.title === title)
}

function saveLocation(location_data) {
  // simulate different coords
  // location_data.latitude = location_data.latitude + Math.random() * 0.1
  // location_data.longitude = location_data.longitude + Math.random() * 0.1
  locations.push(location_data)
  commitLocations(locations)
}

function deleteLocation(location_data) {
  let loc_idx = locations.findIndex(function (loc) {
    return loc.title === location_data.title
  })
  locations.splice(loc_idx, 1)
  commitLocations(locations)
}

function commitLocations(locations_array) {
  localStorage.setItem(localstorage_key, JSON.stringify(locations_array))
  document.dispatchEvent(locations_change_event)
}

export default {
  getLocations,
  getLocation,
  saveLocation,
  deleteLocation
}
