export default class FlatGeoLocation {
  _title = "";
  _latitude = null;
  _longitude = null;
  _accuracy = null;
  _altitude = null;
  _altitude_accuracy = null;
  _speed = null;
  _heading = null;
  _timestamp = null;

  constructor(title, location_data) {
    this._title = title;
    this._latitude = location_data.coords.latitude;
    this._longitude = location_data.coords.longitude;
    this._accuracy = location_data.coords.accuracy;
    this._altitude = location_data.coords.altitude;
    this._altitude_accuracy = location_data.coords.altitude_accuracy;
    this._speed = location_data.coords.speed;
    this._heading = location_data.coords.heading;
    this._timestamp = location_data.timestamp;
  }

  get title() {
    return this._title;
  }
  get latitude() {
    return this._latitude;
  }
  get longitude() {
    return this._longitude;
  }
  get accuracy() {
    return this._accuracy;
  }
  get altitude() {
    return this._altitude;
  }
  get altitude_accuracy() {
    return this._altitude_accuracy;
  }
  get speed() {
    return this._speed;
  }
  get heading() {
    return this._heading;
  }
  get timestamp() {
    return this._timestamp;
  }
}
