function Sphere(position, radius) {
  this.position = position;
  this.radius = radius;
	this.speed = {
		x: 0.5,
		y: 0.5
	};
}

Sphere.DEFAULT_RADIUS = 10;

Sphere.prototype.move = function(dt) {
	//dt je casovy zlomok medzi poslednymi dvoma tiknutiami casovaca
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
