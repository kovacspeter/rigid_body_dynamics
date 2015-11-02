function Position(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Position.prototype.move = function(x, y, z) {
	this.x += x;
	this.y += y;
	this.z += z;
};

Position.prototype.equals = function(pos) {
  return (pos.x - this.x + pos.y - this.y + pos.z - this.z) == 0;
};

Position.prototype.distance = function (pos) {
  return Math.abs(pos.x - this.x) + Math.abs(pos.y - this.y) + Math.abs(pos.z - this.z)
};
