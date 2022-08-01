let locations
const localstorage_key = 'iamfrank-locator'
const locations_change_event = new CustomEvent('changelocations')

function fetchLocations() {
  const ls = JSON.parse(localStorage.getItem(localstorage_key))
  locations = ls ? ls : []
  return locations 
}

function saveLocation(location_data) {
  console.log('saving', locations, location_data)
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
  fetchLocations,
  saveLocation,
  deleteLocation
}