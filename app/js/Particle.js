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
	// this.Iinv;      matrix3
	// this.v;         float3
	// this.omega;     float3
	// -----------------------------------------------------
	//     Computed:
	// this.force;     float3
	// this.torque;    float3
	// -----------------------------------------------------
	this.rb = undefined;
	this.force = [0, 0, 0];
	this.torque = [0, 0, 0];
	this.bx = undefined;
	this.setSphere(radius, position, numeric.identity(3));
}
Particle.DENSITY = 1 / ((4 / 3) * Math.PI * 1000);		// for r = 10, mass should be = 1
Particle.LAST_ID = 0;

Particle.prototype.setSphere = function (r, x, R) {
	this.r = r;
	this.mass = this.computeMass();
	this.x = x;
	this.R = R;
	this.P = [0, 0, 0];
	this.L = [0, 0, 0];
	this.Ibody = [
		[2 * this.mass * Math.pow(r, 2) / 5, 0, 0],
		[0, 2 * this.mass * Math.pow(r, 2) / 5, 0],
		[0, 0, 2 * this.mass * Math.pow(r, 2) / 5]
	];
	this.Ibodyinv = numeric.inv(this.Ibody);
	this.computeAux();
};

Particle.prototype.draw = function (context, color) {
	var position = this.x;
	if (this.rb) {
		position = numeric.add(this.rb.x, numeric.dot(this.rb.q.normalize().toMatrix(), this.bx))
	}
	drawCircle(context, position, this.r, color);
};

Particle.prototype.computeAux = function () {
	this.v = numeric.div(this.P, this.mass);
	this.Iinv = numeric.dot(numeric.dot(this.R, this.Ibodyinv), numeric.transpose(this.R));
	this.omega = numeric.dot(this.Iinv, this.L);
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
Particle.prototype.getMass = function () {
	return this.mass;
};
Particle.prototype.getMomentum = function () {
	return this.P;
};
Particle.prototype.getPosition = function () {
	return this.x;
};
Particle.prototype.getRadius = function () {
	return this.r;
};
Particle.prototype.getVelocity = function () {
	return this.v;
};

Particle.prototype.normalize = function (v) {
	var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	v[0] /= l;
	v[1] /= l;
	v[2] /= l;
}

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
}

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
}

Particle.prototype.update = function (dt) {

	this.move(dt);
}

Particle.prototype.isInside = function (x, y, z) {
	var sub = numeric.sub([x, y, z], this.x);
	var power = numeric.pow(sub, [2, 2, 2]);
	var sum = numeric.sum(power);
	// console.log(this.r - Math.sqrt(sum) >= 0);
	return this.r - Math.sqrt(sum) >= 0;
};

Particle.prototype.applyForce = function (force) {
	numeric.addeq(this.rb.force, force);
	numeric.addeq(this.rb.torque, numeric.dot(this.getCrossMatrix(numeric.sub(this.bx, this.rb.x)), force));
}

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
	return numeric.dot(numeric.dot(V, numeric.diag(Sinv)), numeric.transpose(U))
}
