function RigidBody(sphere) {//TODO
	this.ID = id;
  this.mass = 1;
  this.spheres = [sphere];
  this.quaternion;
  this.position = sphere.position;
  this.rotation;
  this.linearMomentum;
  this.angularMomentum;
  this.inertia;
  this.inertiaInv;
  this.force = {
    x: 0,
    y: 0,
    z: 0
  };
  this.torque = 0;
  //... TODO
};

RigidBody.prototype.join = function (rigid_body) {
  for (sphere in rigid_body.spheres) {
    sphere = rigid_body.spheres[sphere];
    this.spheres.push(sphere);
    sphere.rigidBody = this;
  }
  this.updateCenterOfMass();
  this.updateMass();
};

RigidBody.prototype.move = function(dt) {
  for (sphere in this.spheres) {
    this.spheres[sphere].move(dt);
  }
};

RigidBody.prototype.updateCenterOfMass = function() {
  //TODO
};

RigidBody.prototype.draw = function(context, color) {
  for (sphere in this.spheres) {
    this.spheres[sphere].draw(context, color);
  }
};

RigidBody.prototype.updateMass = function() {
  this.mass = 0;
  for (sphere in this.spheres) {
    this.mass += this.spheres[sphere].mass;
  }
};

RigidBody.prototype.isCollision = function(rigid_body) {
  for (var i in this.spheres) {
    sphere1 = this.spheres[i];
    for (var j in rigid_body.spheres) {
      sphere2 = rigid_body.spheres[j];
      var dx = sphere1.position.x - sphere2.position.x;
      var dy = sphere1.position.y - sphere2.position.y;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist <= (sphere1.getRadius() + sphere2.getRadius())) {
        return true;
      }
    }
  }
  return false;
};

RigidBody.prototype.checkCollision = function(rigid_body) {
  for (var i=0; i < this.spheres.length; i++) {
    sphere1 = this.spheres[i];
    for (var j=0; j < rigid_body.spheres.length; j++) {
      sphere2 = rigid_body.spheres[j];
      //TODO check ci tam nie je bug s tym ze moze ich byt viac v kolizii a asi by mala
      //        nastat kolizia s tym s ktorou sa prvou stretla
      var dx = sphere1.position.x - sphere2.position.x;
      var dy = sphere1.position.y - sphere2.position.y;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < (sphere1.getRadius() + sphere2.getRadius())) {
    		var nx = dx / dist;
    		var ny = dy / dist;
    		var k = (sphere1.getRadius() + sphere2.getRadius()) - dist; //velkost prieniku
    		sphere1.position.move(nx*k/2, ny*k/2, 0);
    		sphere2.position.move(-nx*k/2, -ny*k/2, 0);

    		k = -2 * ((sphere1.velocity.x - sphere2.velocity.x) * nx + (sphere1.velocity.y - sphere2.velocity.y) * ny) /
         (1/sphere1.mass + 1/sphere2.mass);
    		sphere1.accelerate(k*nx/sphere1.mass, k*ny/sphere1.mass);
    		sphere2.accelerate(-k*nx/sphere2.mass, -k*ny/sphere2.mass);
      }
    }
  }
};

RigidBody.prototype.getSphere = function(point) {
  for (var sphere in this.spheres) {
    if (this.spheres[sphere].isInSphere(point)) {
			return this.spheres[sphere];
		}
  }
  return null;
}

RigidBody.prototype.applyForce = function(sphere, x, y, z) {
  sphere.applyForce(x,y,z);
}
