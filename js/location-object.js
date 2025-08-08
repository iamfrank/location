export default class FlatGeoLocation {
  title = "";
  latitude = null;
  longitude = null;
  accuracy = null;
  altitude = null;
  altitude_accuracy = null;
  speed = null;
  heading = null;
  timestamp = null;

  constructor(title, location_data) {
    this.title = title;
    this.latitude = location_data.coords.latitude;
    this.longitude = location_data.coords.longitude;
    this.accuracy = location_data.coords.accuracy;
    this.altitude = location_data.coords.altitude;
    this.altitude_accuracy = location_data.coords.altitude_accuracy;
    this.speed = location_data.coords.speed;
    this.heading = location_data.coords.heading;
    this.timestamp = location_data.timestamp;
  }

  get title() {
    return this.title;
  }
  get latitude() {
    return this.latitude;
  }
  get longitude() {
    return this.longitude;
  }
  get accuracy() {
    return this.accuracy;
  }
  get altitude() {
    return this.altitude;
  }
  get altitude_accuracy() {
    return this.altitude_accuracy;
  }
  get speed() {
    return this.speed;
  }
  get heading() {
    return this.heading;
  }
  get timestamp() {
    return this.timestamp;
  }
}
