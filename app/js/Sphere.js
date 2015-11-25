function Sphere(position, radius) {
  this.position = position;
  this.radius = radius;
	this.mass = 1;								//Hmotnosť gule
	this.velocity = {
		x: 0,
		y: 0,
    z: 0
	};
  this.rigidBody = null;
}

Sphere.DEFAULT_RADIUS = 10;
Sphere.RESISTANCE = 0.999;

Sphere.prototype.applyForce = function(x, y, z) {
  var vx = x / this.mass;
  var vy = y / this.mass;
  var vz = z / this.mass;

  this.accelerate(vx, vy, vz);
}

Sphere.prototype.move = function(dt) {
	//dt je casovy zlomok medzi poslednymi dvoma tiknutiami casovaca

	this.position.move(this.velocity.x * dt, this.velocity.y * dt, 0);
	if (this.position.x < this.radius) {
		this.velocity.x = Math.abs(this.velocity.x);
	}
	else if (this.position.x > Canvas.SIZE.WIDTH - this.radius){
		this.velocity.x = -Math.abs(this.velocity.x);
	}

	if (this.position.y < this.radius) {
		this.velocity.y = Math.abs(this.velocity.y);
	}
	else if (this.position.y > Canvas.SIZE.HEIGHT - this.radius){
		this.velocity.y = -Math.abs(this.velocity.y);
	}
};

Sphere.prototype.accelerate = function(ax, ay, az) {
	this.velocity.x += ax;
	this.velocity.y += ay;
  this.velocity.z += az;
};

Sphere.prototype.setPosition = function (position) {
  this.position = position;
};

Sphere.prototype.getPosition = function() {
	return this.position;
};

Sphere.prototype.setRadius = function (radius) {
	if (radius > Sphere.DEFAULT_RADIUS) {
		this.radius = radius;
	}
};

Sphere.prototype.getRadius = function() {
	return this.radius;
};

Sphere.prototype.isInSphere = function(pos) {
  return this.radius - this.position.distance(pos) >= 0;
};

Sphere.prototype.draw = function(context, color) {
  drawCircle(context, this.position, this.radius, color)
};
