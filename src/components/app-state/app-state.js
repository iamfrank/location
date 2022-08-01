export default {
  locations: [],
  localstorage_key: 'iamfrank-locator',
  fetchLocations() {
    return JSON.parse(localStorage.getItem(this.localstorage_key))
  },
  saveLocation(location_data) {
    console.log('saving', this.locations, this.location_data)
    this.locations.push(location_data)
    console.log('postsave', this.locations)
    this.commitLocations(this.locations)
  },
  deleteLocation(location_data) {
    console.log('delete', location_data, this.locations)
    loc_idx = this.locations.findIndex(function(loc) {
      return loc.title === location_data.title
    })
    this.locations.splice(loc_idx,1)
    this.commitLocations(this.locations)
  },
  commitLocations(locations) {
    console.log('committing', locations, JSON.stringify(locations))
    localStorage.setItem(this.localstorage_key, JSON.stringify(locations))
  } 
}