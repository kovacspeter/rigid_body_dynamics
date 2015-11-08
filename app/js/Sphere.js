function Sphere(position, radius) {
  this.position = position;
  this.radius = radius;
	this.mass = 1;								//Hmotnosť gule
	this.speed = {
		x: Math.sqrt(2)/2 /2,
		y: Math.sqrt(2)/2 /2
	};
  this.rigidBody = null;
}

Sphere.DEFAULT_RADIUS = 10;
Sphere.RESISTANCE = 0.999;

Sphere.prototype.move = function(dt) {
	//dt je casovy zlomok medzi poslednymi dvoma tiknutiami casovaca

  this.speed.x = Sphere.RESISTANCE * this.speed.x;
  this.speed.y = Sphere.RESISTANCE * this.speed.y;
	this.position.move(this.speed.x * dt, this.speed.y * dt, 0);
	if (this.position.x < this.radius) {
		this.speed.x = Math.abs(this.speed.x);
	}
	else if (this.position.x > Canvas.SIZE.WIDTH - this.radius){
		this.speed.x = -Math.abs(this.speed.x);
	}

	if (this.position.y < this.radius) {
		this.speed.y = Math.abs(this.speed.y);
	}
	else if (this.position.y > Canvas.SIZE.HEIGHT - this.radius){
		this.speed.y = -Math.abs(this.speed.y);
	}
};

Sphere.prototype.accelerate = function(ax, ay) {
	this.speed.x += ax;
	this.speed.y += ay;
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
