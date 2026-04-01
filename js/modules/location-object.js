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
}
