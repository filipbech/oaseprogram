export class PositionService {
  mapBounds = {
    latitude: [56.125205, 56.117716],
    longitude: [10.120664, 10.145729]
  };

  calculatePctFromLatLng(lat, lng) {
    let top = 100 * ((lat - this.mapBounds.latitude[0]) / (this.mapBounds.latitude[1] - this.mapBounds.latitude[0]));
    let left = 100 * ((lng - this.mapBounds.longitude[0]) / (this.mapBounds.longitude[1] - this.mapBounds.longitude[0]));
    let inView = top > 0 && top < 100 && left > 0 && left < 100;

    // TODO: Remove fake
    /*FAKE START*/
    inView = true;
    if (top < 0) {
      top = 100 + (top % 100);
    }
    if (top > 100) {
      top = 100 - (top % 100);
    }

    if (left < 0) {
      left = 100 + (left % 100);
    }
    if (left > 100) {
      left = 100 - (left % 100);
    }
    /** FAKE END */



    return { top, left, inView };
  }
}
