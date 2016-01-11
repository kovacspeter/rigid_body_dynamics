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
	this.force = [0, 0, 0];
	this.torque = [0, 0, 0];
	this.L = [0, 0, 0];
	this.R = numeric.identity(3);
	this.x = particle.getPosition();
	this.q = new Quaternion([0, 0, 0], 1);
	this.omega = [0, 0, 0];
	this.mass = particle.getMass();
	this.P = [0, 0, 0];
	this.v = [0, 0, 0];
	this.Ek = 0;
	//this.updateBodyInertia();
	this.ID = ++RB.LAST_ID;
	particle.rb = this;
	particle.ID = ++Particle.LAST_ID;
}

RB.LAST_ID = 0;

RB.prototype.computeAux = function () {
	this.P = numeric.mul(this.getVelocity(), this.getMass());
	/*
	// Gets rotation matrix from quaternion
	this.R = this.q.normalize().toMatrix();
	this.Iinv = numeric.dot(numeric.dot(this.R, this.Ibodyinv), numeric.transpose(this.R));
	// Computes angular velocity
	this.omega = numeric.dot(this.Iinv, this.L);
	this.force = [0, 0, 0];
	this.torque = [0, 0, 0];
	*/
};

RB.prototype.computeCollisions = function () {
	//TODO
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		var particlePosition = particle.getPosition();
		if (particlePosition[0] < particle.r) {
			this.v[0] = Math.abs(this.v[0]);
		} else if (particlePosition[0] > Canvas.SIZE.WIDTH - particle.r) {
			this.v[0] = -Math.abs(this.v[0]);
		}

		if (particlePosition[1] < particle.r) {
			this.v[1] = Math.abs(this.v[1]);
		} else if (particlePosition[1] > Canvas.SIZE.HEIGHT - particle.r) {
			this.v[1] = -Math.abs(this.v[1]);
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

RB.prototype.integrateEuler = function (dt) {
	diff = numeric.mul(this.v, dt)

	// Equations of motion
	numeric.addeq(this.x, diff);
	// ROTATION MATRIX IMPELem
	//numeric.addeq(this.R, numeric.dot(this.getCrossMatrix(this.omega), this.R));
	//NOTE: vsade pisu ze to ma byt 0 nie 1, zeby bol dakde bug?
	var q = new Quaternion(this.omega, 1);
	this.q = q.mul(this.q).smult(0.5);
	this.q = this.q.normalize();
	// this.q = this.q.smult(0.5).vmult(this.omega);
	// this.q = this.q.normalize();
	// console.log(this.q.v, this.q.s);
	numeric.addeq(this.P, numeric.mul(this.force, dt));
	numeric.addeq(this.L, numeric.mul(this.torque, dt));
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

RB.prototype.update = function () {
	//this.integrateEuler(dt);
	this.move();
	// this.renormalizeR();
	this.computeCollisions();
	this.computeAux();
	// update position, momentum, ... of the object's particles
	for (i in this.particles) {
		this.particles[i].update();
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

RB.prototype.applyForce = function (force, whichParticle) {
	var a = numeric.div(force, this.getMass());
	this.v = a;	// #DISCUSS: tu sa môže aj pripočítavať k aktuálnej rýchlosti!!!
	this.P = numeric.mul(this.v, this.getMass());
	
	force = numeric.div(force, 10000);
	for (var p in this.particles) {
		this.particles[p].applyForce(force, whichParticle);
	}	
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
			particle.bx = numeric.sub(numeric.add(particle.bx, rbs[rb].x), pos);
			// append new particles from joined rigid bodies
			this.particles.push(particle);
			// change rigid body to which particle belongs
			particle.rb = this;
		}
		rbs[rb].particles = [];
	}
	// Assign new center of mass to this rigid body.
	this.x = pos;
	//this.updateBodyInertia();
	this.computeAux();
};
// NOTE: DELETE WHEN QUATERNIONS WORK
RB.prototype.normalize = function (v) {
	var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	v[0] /= l;
	v[1] /= l;
	v[2] /= l;
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
