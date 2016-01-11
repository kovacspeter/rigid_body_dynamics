function Particle(radius, position) {
	// -----------------------------------------------------
	//     Constant:
	// this.r;         float    radius
	// this.mass;      float
	// this.Ibody;     matrix3
	// this.Ibodyinv;  matrix3
	// -----------------------------------------------------
	//     State:
	// this.x;         float3    Position
	// this.bx         float3    Local Position in Body System
	// this.R;         matrix3   Rotation
	// this.P;         float3    Linear momentum = m v
	// this.L;         float3    Angular momentum = I omega
	// -----------------------------------------------------
	//     Derived:
	// this.I					 float3		Moment of Inertia
	// this.Iinv;      matrix3
	// this.v;         float3
	// this.omega;     float3		--> #DISCUSS: IS angular velocity of the particle really needed?
	// -----------------------------------------------------
	//     Computed:
	// this.force;     float3
	// this.torque;    float3
	// -----------------------------------------------------
	this.rb = undefined;
	this.torque = [0, 0, 0];
	this.omega = [0, 0, 0];
	this.bx = [0, 0, 0];
	this.x = position;
	this.R = numeric.identity(3);
	this.P = [0, 0, 0];
	this.L = [0, 0, 0];
	this.I = 0;
	this.setSphere(radius, position);
	this.computeAux();
}
Particle.DENSITY = 1 / ((4 / 3) * Math.PI * 1000);		// for r = 10, mass should be = 1
Particle.LAST_ID = 0;

Particle.prototype.setSphere = function (r) {
	this.r = r;
	this.mass = this.computeMass();
	this.Ibody = [
		[2 * this.mass * Math.pow(this.r, 2) / 5, 0, 0],
		[0, 2 * this.mass * Math.pow(this.r, 2) / 5, 0],
		[0, 0, 2 * this.mass * Math.pow(this.r, 2) / 5]
	];
	this.Ibodyinv = numeric.inv(this.Ibody);
};

Particle.prototype.draw = function (context, color) {
	drawCircle(context, this.getPosition(), this.r, color);
};

Particle.prototype.drawCentre = function (context) {
	drawX(context, this.getPosition(), 6, '#777');
	drawLine(context, this.rb.getPosition(), this.getPosition(), '#222', 1);
};

Particle.prototype.computeAux = function () {
	//this.Iinv = numeric.dot(numeric.dot(this.R, this.Ibodyinv), numeric.transpose(this.R));
	//this.omega = numeric.dot(this.Iinv, this.L);
	/*
	 this.P = numeric.mul(this.rb.getVelocity(), this.getMass());
	 this.v = numeric.mul(this.rb.omega, this.getDistanceFromCenterOfMass());
	 */
	// I = m*(DistanceFromCenterOfRotation)^2
	var r = this.getDistanceFromCenterOfMass();
	this.I = this.getMass() * r * r;

	this.L = numeric.mul(this.omega, this.I);
};

Particle.prototype.computeMass = function () {
	var volume = (4 / 3) * Math.PI * Math.pow(this.r, 3);
	return Particle.DENSITY * volume;
};

Particle.prototype.getCrossMatrix = function (vec) {
	var vecx = [
		[0, -vec[2], vec[1]],
		[vec[2], 0, -vec[0]],
		[-vec[1], vec[0], 0]
	];
	return vecx;
};
Particle.prototype.getDistanceFromCenterOfMass = function () {
	return Math.sqrt(this.bx[0] * this.bx[0] + this.bx[1] * this.bx[1] + this.bx[2] * this.bx[2]);
};
Particle.prototype.getKineticEnergy = function () {
	return (this.I * (this.rb.omega[0] * this.rb.omega[0] + this.rb.omega[1] * this.rb.omega[1])) / 2;
};
Particle.prototype.getMass = function () {
	return this.mass;
};
Particle.prototype.getMomentum = function () {
	return this.P;
};
Particle.prototype.getPosition = function () {
	if (this.rb) {
		return numeric.add(this.rb.x, this.bx);
	} else {
		return this.x;
	}
};
Particle.prototype.getRadius = function () {
	return this.r;
};
Particle.prototype.getVelocity = function () {
	return this.v;
};

// #DISCUSS: Actually it's not move, but rotate!!!
Particle.prototype.move = function () {
	var r = this.getDistanceFromCenterOfMass();
	if (r > 0) {
		var theta = Math.acos(this.bx[0] / r);
		
		if (Math.asin(this.bx[1] / r) > 0) {
			theta = -theta;
		}
		theta += this.omega[0];
		if (theta > Math.PI) {
			theta = -Math.PI + (theta - Math.PI);
		} 
		
		console.log(theta);
		if ((theta <= Math.PI) && (theta > (Math.PI/2))) {
			this.bx[0] = r * (Math.cos(theta));
			this.bx[1] = -r * Math.sin(theta);
			console.log("HERE 1");
		} else if ((theta <= (Math.PI/2)) && (theta > 0)) {
			this.bx[0] = r * Math.cos(theta);
			this.bx[1] = -r * Math.sin(theta);
			console.log("HERE 2");
		} else if((theta <= 0) && (theta > (-Math.PI/2))) {
			this.bx[0] = r * Math.cos(theta);
			this.bx[1] = r * (-Math.sin(theta));
			console.log("HERE 3");
		} else {
			this.bx[0] = r * (Math.cos(theta));
			this.bx[1] = r * (-Math.sin(theta));
			console.log("HERE 4");
		}
	}
};

Particle.prototype.normalize = function (v) {
	var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	v[0] /= l;
	v[1] /= l;
	v[2] /= l;
};

Particle.prototype.integrateEuler = function (dt) {

	numeric.addeq(this.x, numeric.mul(this.v, dt));
	var m = numeric.dot(this.getCrossMatrix(this.omega), this.R);
	numeric.addeq(this.R, numeric.mul(m, dt));

	numeric.addeq(this.P, numeric.mul(this.force, dt));
	numeric.addeq(this.L, numeric.mul(this.torque, dt));
	this.v = numeric.div(this.P, this.mass);

	// if (this.x[0] < this.r) {
	//   this.P[0] = Math.abs(this.P[0]);
	// }
	// else if (this.x[0] > Canvas.SIZE.WIDTH - this.r){
	//   this.P[0] = -Math.abs(this.P[0]);
	// }
	//
	// if (this.x[1] < this.r) {
	//   this.P[1] = Math.abs(this.P[1]);
	// }
	// else if (this.x[1] > Canvas.SIZE.HEIGHT - this.r){
	//   this.P[1] = -Math.abs(this.P[1]);
	// }

	this.force = [0, 0, 0];
	this.torque = [0, 0, 0];
	// TODO ak chceme gravitaciu/odpor alebo daco take
	// var kdf = this.v.mulScalar(g_world.kdl * dt);
	// kdf.negate();
	// this.P.accum(kdf);
	// var kdt = this.omega.mulScalar(g_world.kdw * dt);
	// kdt.negate();
	// this.L.accum(kdt);
};

Particle.prototype.renormalizeR = function () {
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

Particle.prototype.update = function () {
	this.computeAux();
	this.move();
};

Particle.prototype.isInside = function (x, y, z) {
	var sub = numeric.sub([x, y, z], this.getPosition());
	var power = numeric.pow(sub, [2, 2, 2]);
	var sum = numeric.sum(power);
	// console.log(this.r - Math.sqrt(sum) >= 0);
	return this.r - Math.sqrt(sum) >= 0;
};

Particle.prototype.applyForce = function (force, whichParticle) {
	 var r = numeric.dot(whichParticle.getPosition(), this.getPosition());
	 var alpha = numeric.div(numeric.mul(force, r), this.I);
	 this.omega = alpha;	// #DISCUSS: tu sa môže aj pripočítavať k aktuálnej uhlovej rýchlosti!!!
	 this.L = numeric.mul(this.omega, this.I);
	//numeric.addeq(this.rb.torque, numeric.dot(this.getCrossMatrix(numeric.sub(this.bx, this.rb.x)), force));
};

function pinv(A) {
	var z = numeric.svd(A), foo = z.S[0];
	var U = z.U, S = z.S, V = z.V;
	var m = A.length, n = A[0].length, tol = Math.max(m, n) * numeric.epsilon * foo, M = S.length;
	var i, Sinv = new Array(M);
	for (i = M - 1; i !== -1; i--) {
		if (S[i] > tol)
			Sinv[i] = 1 / S[i];
		else
			Sinv[i] = 0;
	}
	return numeric.dot(numeric.dot(V, numeric.diag(Sinv)), numeric.transpose(U));
}
;
