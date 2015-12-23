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
	// this.omega;     float3
	// -----------------------------------------------------
	//     Computed:
	// this.force;     float3
	// this.torque;    float3
	// -----------------------------------------------------
	particle.bx = [0, 0, 0];
	this.particles = [particle];
	this.force = [0, 0, 0];
	this.torque = [0, 0, 0];
	this.R = numeric.identity(3);
	particle.rb = this;
	this.omega = [0, 0, 0];
	this.mass = particle.mass;
	this.x = particle.x;
	this.P = [0, 0, 0];
	this.L = [0, 0, 0];
	this.updateBodyInertia();
	this.computeAux();
}

RB.prototype.computeAux = function () {
	this.v = numeric.div(this.P, this.mass);
	this.Iinv = pinv(numeric.dot(numeric.dot(this.R, this.Ibody), numeric.transpose(this.R)));
	this.omega = numeric.dot(this.Iinv, this.L);

	this.force = [0, 0, 0];
	this.torque = [0, 0, 0];
}
RB.prototype.update = function (dt) {
	this.integrateEuler(dt);
	this.computeAux();
	this.renormalizeR();
	this.computeCollisions();
};

RB.prototype.integrateEuler = function (dt) {
	diff = numeric.mul(this.v, dt)

	// Equations of motion
	numeric.addeq(this.x, diff); //TODO UNCOMMENT
	numeric.addeq(this.R, numeric.dot(this.getCrossMatrix(numeric.mul(this.omega, dt)), this.R));
	numeric.addeq(this.P, numeric.mul(this.force, dt));
	numeric.addeq(this.L, numeric.mul(this.torque, dt));
};
RB.prototype.renormalizeR = function () {
	var v0 = [this.R[0][0], this.R[1][0], this.R[2][0]];
	this.normalize(v0);
	var v1 = [this.R[0][1], this.R[1][1], this.R[2][1]];
	this.normalize(v1);
	var v2 = numeric.dot(this.getCrossMatrix(v0), v1);
	v1 = numeric.dot(this.getCrossMatrix(v2), v0);
	this.R[0][0] = v0[0];
	this.R[0][1] = v1[0];
	this.R[0][2] = v2[0];
	this.R[1][0] = v0[1];
	this.R[1][1] = v1[1];
	this.R[1][2] = v2[1];
	this.R[2][0] = v0[2];
	this.R[2][1] = v1[2];
	this.R[2][2] = v2[2];
};

RB.prototype.computeCollisions = function () {
	//TODO
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		if (particle.x[0] < particle.r) {
			particle.P[0] = Math.abs(particle.P[0]);
		}
		else if (particle.x[0] > Canvas.SIZE.WIDTH - particle.r) {
			particle.P[0] = -Math.abs(particle.P[0]);
		}

		if (particle.x[1] < particle.r) {
			particle.P[1] = Math.abs(particle.P[1]);
		}
		else if (particle.x[1] > Canvas.SIZE.HEIGHT - particle.r) {
			particle.P[1] = -Math.abs(particle.P[1]);
		}
		// if (particle.x[0] < particle.r) {
		//   particle.applyForce([0, Math.abs(particle.P[0]), 0]);
		//   particle.P[0] = 0;
		// } else if (particle.x[0] > Canvas.SIZE.WIDTH - particle.r) {
		//   particle.applyForce([0, -Math.abs(particle.P[0]), 0]);
		//   particle.P[0] = 0;
		// }
		//
		// if (particle.x[1] < particle.r) {
		//   particle.applyForce([0, Math.abs(particle.P[1]), 0]);
		//   particle.P[1] = 0;
		// } else if (particle.x[1] > Canvas.SIZE.HEIGHT - particle.r) {
		//   particle.applyForce([0, -Math.abs(particle.P[1]), 0]);
		//   particle.P[1] = 0;
		// }
	}
};

RB.prototype.draw = function (context, color) {
	for (var p in this.particles) {
		this.particles[p].draw(context, color);
	}
};

RB.prototype.updateTorque = function () {
	var torque = [0, 0, 0];
	for (var p in this.particles) {
		var particle = this.particles[p];
		numeric.addeq(torque, particle.torque);
		particle.force = [0, 0, 0];
	}
	this.torque = torque;
};

RB.prototype.updateForce = function () {
	var force = [0, 0, 0];
	for (var p in this.particles) {
		var particle = this.particles[p];
		numeric.addeq(force, particle.force);
		particle.force = [0, 0, 0];
	}
	this.force = force;
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
		var inner = numeric.mul(numeric.dot(r,r), numeric.identity(3));
		var diff = numeric.sub(inner, outer);
		// Multiplying by particle mass to get Inertia tensor of particle
		var Ibody = numeric.mul(particle.mass, diff);
		// Add all inertias of particles to get Inertia tensor of rigid body.
		numeric.addeq(J, Ibody);
	}
	// Actual Inertia tensor of rigid body.
	this.Ibody = J;
	// this.Ibodyinv = pinv(this.Ibody);
};

RB.prototype.isOverlap = function (rb) {
	for (var i in this.particles) {
		p1 = this.particles[i];
		for (var j in rb.particles) {
			p2 = rb.particles[j];
			var dist = Math.sqrt(numeric.sum(numeric.pow(numeric.sub(p1.x, p2.x), [2, 2, 2])));
			if (dist <= (p1.r + p2.r)) {
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

RB.prototype.join = function (rb) {
	// TODO add transitivity

	// We need to compute new center of mass
	var pos = [0, 0, 0];
	// First we will take all ORIGINAL rigid body particles
	for (var p in this.particles) {
		var particle = this.particles[p];
		// pos += position * mass of particle
		numeric.addeq(pos, numeric.mul(numeric.add(this.x, particle.bx), particle.mass));
	}

	// We need to take into account also new particles added from JOINED rigid body
	for (var p in rb.particles) {
		var particle = rb.particles[p];
		// pos += position * mass of particle
		numeric.addeq(pos, numeric.mul(numeric.add(particle.bx, rb.x), particle.mass));
	}
	// Add masses of joined bodies
	this.mass += rb.getMass();

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
	// positions of particles from joined rigid body
	for (var p in rb.particles) {
		var particle = rb.particles[p];
		// bx = x - ceneter of mass
		particle.bx = numeric.sub(numeric.add(particle.bx, rb.x), pos);
		// append new particles to joined rigid body
		this.particles.push(particle);
		// change rigid body to which particle belongs
		particle.rb = this;
	}
	// Assign new center of mass to this rigid body.
	this.x = pos;
	this.updateBodyInertia();
	this.computeAux();
};
RB.prototype.normalize = function (v) {
	var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	v[0] /= l;
	v[1] /= l;
	v[2] /= l;
};
