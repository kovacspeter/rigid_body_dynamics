function Sphere(position, radius) {
  this.position = position;
  this.radius = radius;
}

Sphere.prototype.setPosition = function (position) {
  this.position = position;
}

Sphere.prototype.isInSphere = function(pos) {
  return this.radius - this.position.distance(pos) >= 0;
}
