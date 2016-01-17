function RB(particle) {
	// -----------------------------------------------------
	//     Constant:
	// this.mass;      float
	// this.Ibody;     matrix3
	// this.Ibodyinv;  matrix3
	// -----------------------------------------------------
	//     State:
	// this.x;         float3    Position
	// this.R;         matrix3   Rotation
	// this.P;         float3    Linear momentum = m v
	// this.L;         float3    Angular momentum = I omega
	// -----------------------------------------------------
	//     Derived:
	// this.Iinv;      matrix3
	// this.v;         float3
	// this.omega;     float3		Angular velocity
	// -----------------------------------------------------
	//     Computed:
	// this.force;     float3
	// this.torque;    float3
	// -----------------------------------------------------
	this.particles = [particle];
	this.x = particle.getPosition();
	this.mass = particle.getMass();
	this.force = [0, 0, 0];
	this.torque = [0, 0, 0];
	this.R = numeric.identity(3);
	this.q = new Quaternion([0, 0, 0], 1);
	this.omega = [0, 0, 0];
	this.v = [0, 0, 0];
	this.Ek = 0;
	this.reset();
	this.updateBodyInertia();
	this.computeAux();
	this.ID = ++RB.LAST_ID;
	particle.rb = this;
	particle.ID = ++Particle.LAST_ID;
}

RB.LAST_ID = 0;

RB.prototype.computeAux = function () {
	// Computes linear velocity
  this.v = numeric.div(this.P, this.getMass());
	// Gets rotation matrix from quaternion
	this.R = this.q.normalize().toMatrix();
	this.Iinv = numeric.dot(numeric.dot(this.R, this.Ibodyinv), numeric.transpose(this.R));
	// Computes angular velocity
	this.omega = numeric.dot(this.Iinv, this.L);
};

RB.prototype.computeCollisions = function () {
	//TODO
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		var particlePosition = particle.getPosition();
		if (particlePosition[0] < particle.r) {
			this.P[0] = Math.abs(this.P[0]);
		} else if (particlePosition[0] > Canvas.SIZE.WIDTH - particle.r) {
			this.P[0] = -Math.abs(this.P[0]);
		}

		if (particlePosition[1] < particle.r) {
			this.P[1] = Math.abs(this.P[1]);
		} else if (particlePosition[1] > Canvas.SIZE.HEIGHT - particle.r) {
			this.P[1] = -Math.abs(this.P[1]);
		}
	}
};

RB.prototype.integrateEuler = function () {
	// Equations of motion
	numeric.addeq(this.x, this.v);
	//NOTE: vsade pisu ze to ma byt 0 nie 1, zeby bol dakde bug?
	var q = new Quaternion(this.omega, 1);
	this.q = this.q.mul(q).smult(0.5);
	numeric.addeq(this.P, this.force);
	numeric.addeq(this.L, this.torque);

	this.force = [0, 0, 0];
	this.torque = [0, 0, 0];
	//console.log(this.P);
	//console.log(this.L);
};

RB.prototype.draw = function (context, color) {
	for (var p in this.particles) {
		this.particles[p].draw(context, color);
	}
	for (var p in this.particles) {
		this.particles[p].drawCentre(context);
	}
	drawX(context, this.x, 8, '#999');
};
RB.prototype.move = function () {
	numeric.addeq(this.x, this.v);

	for (var p in this.particles) {
		this.particles[p].move();
	}
};
RB.prototype.reset = function() {
	this.P = [0, 0, 0];
	this.L = [0, 0, 0];
};
RB.prototype.update = function () {
	this.computeAux();
	this.integrateEuler();
  this.computeCollisions();
};
RB.prototype.updateBodyInertia = function () {
	var J = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	for (var p in this.particles) {
		var particle = this.particles[p];
		var r = particle.bx;
		// r * rT -> 3x1 * 1x3 = 3x3
		var outer = [
			[r[0] * r[0], r[0] * r[1], r[0] * r[2]],
			[r[1] * r[0], r[1] * r[1], r[1] * r[2]],
			[r[2] * r[0], r[2] * r[1], r[2] * r[2]]
		];
		// rT * r * Identity -> (1x3 * 3x1) * 3x3 = 3x3
		var inner = numeric.mul(numeric.dot(r, r), numeric.identity(3));
		var diff = numeric.sub(inner, outer);
		// Multiplying by particle mass to get Inertia tensor of particle
		var Ibody = numeric.mul(particle.mass, diff);
		// Add all inertias of particles to get Inertia tensor of rigid body.
		numeric.addeq(J, Ibody);
	}
	// Actual Inertia tensor of rigid body.
	this.Ibodyinv = pinv(J);
};
RB.prototype.isOverlap = function (rb) {
	for (var i in this.particles) {
		var p1 = this.particles[i];
		for (var j in rb.particles) {
			var p2 = rb.particles[j];
			var dist = Math.sqrt(numeric.sum(numeric.pow(numeric.sub(p1.getPosition(), p2.getPosition()), [2, 2, 2])));
			if (dist <= (p1.getRadius() + p2.getRadius())) {
				return true;
			}
		}
	}
	return false;
};
RB.prototype.getAcceleration = function () {
	return numeric.mul(this.force, 1 / this.mass);
};
RB.prototype.getCrossMatrix = function (vec) {
	var vecx = [
		[0, -vec[2], vec[1]],
		[vec[2], 0, -vec[0]],
		[-vec[1], vec[0], 0]
	];
	return vecx;
};
RB.prototype.getForce = function () {
	return this.force;
};
RB.prototype.getKineticEnergy = function() {
	var Ek = 0;
	for (var p in this.particles) {
		Ek += this.particles[p].getKineticEnergy();
	}
	return Ek;
};
RB.prototype.getMass = function () {
	return this.mass;
};
RB.prototype.getMomentum = function () {
	return this.P;
};
RB.prototype.getParticle = function (x, y, z) {
	for (var p in this.particles) {
		var particle = this.particles[p];
		if (particle.isInside(x, y, z)) {
			return particle;
		}
	}
	return null;
};
RB.prototype.getPosition = function () {
	return this.x;
};
RB.prototype.getVelocity = function () {
	return this.v;
};

RB.prototype.join = function (rbs) {
	// We need to compute new center of mass
	var pos = numeric.mul(this.x, this.getMass());

	for (var rb in rbs) {
		// We need to take into account also new JOINED rigid body
		numeric.addeq(pos, numeric.mul(rbs[rb].x, rbs[rb].getMass()));
		this.mass += rbs[rb].getMass();
	}
	// Compute new center of mass of this rigid body.
	pos = numeric.div(pos, this.mass);

	// Now we have new center of mass we need to recompute relative
	// positions of particles from original rigid body

	for (var p in this.particles) {
		var particle = this.particles[p];
		// bx = x - ceneter of mass
		particle.bx = numeric.sub(numeric.add(particle.bx, this.x), pos);
	}

	// Now we have new center of mass we need to recompute relative
	// positions of particles from joined rigid bodies
	for (var rb in rbs) {
		for (var p in rbs[rb].particles) {
			var particle = rbs[rb].particles[p];
			// bx = x - ceneter of mass
			particle.bx = numeric.sub(particle.getPosition(), pos);
			// append new particles from joined rigid bodies
			this.particles.push(particle);
			// change rigid body to which particle belongs
			particle.rb = this;
		}
		rbs[rb].particles = [];
	}
	// Assign new center of mass to this rigid body.
	this.x = pos;
	this.updateBodyInertia();
	this.computeAux();
	console.log(this.x, this.R, this.P, this.L);
};
