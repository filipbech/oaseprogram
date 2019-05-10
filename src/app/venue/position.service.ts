export class PositionService {
  mapBounds = {
    latitude: [55.862230, 55.857048],
    longitude: [9.785015, 9.803598]
  };

  calculatePctFromLatLng(lat, lng) {
    const top = 100 * ((lat - this.mapBounds.latitude[0]) / (this.mapBounds.latitude[1] - this.mapBounds.latitude[0]));
    const left = 100 * ((lng - this.mapBounds.longitude[0]) / (this.mapBounds.longitude[1] - this.mapBounds.longitude[0]));
    const inView = top > 0 && top < 100 && left > 0 && left < 100;

    return { top, left, inView };
  }
}
